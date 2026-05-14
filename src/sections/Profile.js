import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 1. استيراد التنقل
import axios from "axios";
import Cookies from "js-cookie";
import "../components/spinner.css";
import "../styles/Profile.css";
import toast from "react-hot-toast";

const ProfileWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)),
    url("https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // مهم عشان زرار الرجوع يتمركز صح
`;

// 2. ستايل زرار الرجوع الاحترافي
const BackButton = styled(motion.button)`
  position: absolute;
  top: 40px;
  left: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const GlassCard = styled(motion.div)`
  background: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(25px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  padding: 4rem 3rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
  text-align: center;
`;

// ... بقية التنسيقات (AvatarCircle, StyledInputGroup, ModernButton) اللي عملناها قبل كدة ...
const AvatarCircle = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 2.5rem;
  background: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: 900;
  color: #000;
`;

const StyledInputGroup = styled.div`
  text-align: left;
  margin-bottom: 2rem;
  label {
    font-size: 0.65rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 12px;
    display: block;
  }
  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 18px;
    color: #fff;
    font-size: 1rem;
    outline: none;
  }
`;

const ModernButton = styled(motion.button)`
  width: 100%;
  padding: 20px;
  background: #fff;
  color: #000;
  border-radius: 20px;
  border: none;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Password, setPassword] = useState("");
  const [RPassword, setRPassword] = useState("");
  const [CPassword, setCPassword] = useState("");
  const [newName, setNewName] = useState(Cookies.get("userName") || "User");
  const [HandelPass, setHandelPass] = useState(false);
  const [HandelPassCon, setHandelPassCon] = useState(false);
  async function updateName() {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.put(
        `${API_URL}/Account/update-name`,
        { Name: newName }, // بنبعت القيمة الجديدة من الـ State
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      if (res.status === 200) {
        Cookies.set("userName", newName);
        return true;
        setTimeout((e) => (window.location.pathname = "./home"), 2000);
      }
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      return false;
      toast.error(
        "Update failed, please ensure you are connected to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updatePass() {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.put(
        `${API_URL}/Auth/updatePass`,
        { Email: Cookies.get("email"), Password: RPassword }, // بنبعت القيمة الجديدة من الـ State
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      if (res.status === 200) {
        setTimeout((e) => (window.location.pathname = "./home"), 2000);
        return true;
      }
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      return false;
      toast.error(
        "Update failed, please ensure you are connected to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function selectRequest() {
    setHandelPass(false);
    setLoading(true);

    try {
      const isNameChanged = newName !== Cookies.get("userName");
      const isPassChanged = RPassword.length > 0;

      if (isNameChanged && isPassChanged) {
        if (Password !== Cookies.get("pass")) {
          setHandelPass(true);
          return;
        } else {
          if (await Promise.all([updateName(), updatePass()])) {
            toast.success("Modified Successfully!");
          } else {
            toast.error("Failed to update. Please try again.");
          }
        }
      } else if (isNameChanged) {
        if (await updateName()) {
          toast.success("Username has changed!");
        } else {
          toast.error("Failed to update username. Please try again.");
        }
      } else if (isPassChanged) {
        if (Password !== Cookies.get("pass")) {
          setHandelPass(true);
          return;
        } else {
          if (RPassword == CPassword) {
            if (await updatePass()) {
              toast.success("Password has changed!");
            } else {
              toast.error("Failed to update Password. Please try again.");
            }
            setHandelPassCon(false);
          } else {
            setHandelPassCon(true);
          }
        }
      } else {
        toast.error("You haven't changed any data!");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Selection Error:", error);
      toast.error("An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <ProfileWrapper>
      <BackButton
        onClick={() => (window.location.pathname = "/home")} // طريقة أفضل للتنقل في React
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>←</span> BACK TO HOME
      </BackButton>

      <GlassCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* عرض أول حرف من الاسم الجديد */}
        <AvatarCircle>
          {newName ? newName.charAt(0).toUpperCase() : "U"}
        </AvatarCircle>

        <h2
          style={{
            color: "#fff",
            fontWeight: 300,
            letterSpacing: "5px",
            marginBottom: "3rem",
          }}
        >
          MY ACCOUNT
        </h2>

        <StyledInputGroup>
          <label>Display Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </StyledInputGroup>

        <StyledInputGroup>
          <label>Email Address 🔒</label>
          <input
            type="email"
            value={Cookies.get("email") || "user@wibe.com"}
            disabled
            style={{ opacity: 0.3, cursor: "not-allowed" }}
          />
        </StyledInputGroup>

        <p class="d-inline-flex gap-1 collapsee w-100">
          <a
            class="btn btn-primary collapseB"
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            Change Password
          </a>
        </p>
        <div
          style={{ transition: "0.3s" }}
          class="collapse"
          id="collapseExample"
        >
          <div class="card card-body">
            <StyledInputGroup>
              <label>Old Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                style={{ opacity: 0.3 }}
              />
            </StyledInputGroup>
            {HandelPass && (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-140%)",
                }}
              >
                - Incorrect password.
              </p>
            )}
            <StyledInputGroup>
              <label>New Password</label>
              <input
                onChange={(e) => setRPassword(e.target.value)}
                type="password"
                style={{ opacity: 0.3 }}
              />
            </StyledInputGroup>
            <StyledInputGroup>
              <label>Confirm New Password</label>
              <input
                onChange={(e) => setCPassword(e.target.value)}
                type="password"
                style={{ opacity: 0.3 }}
              />
            </StyledInputGroup>
            {HandelPassCon && (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-140%)",
                }}
              >
                - The password does not match.
              </p>
            )}
          </div>
        </div>
        {/* Bottun Confirm */}
        <ModernButton
          whileHover={{
            y: -5,
            boxShadow: "0 15px 30px rgba(255,255,255,0.2)",
            color: "white",
            background: "transparent",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={selectRequest}
        >
          {loading ? <span className="loader">Loading</span> : "Save Profile"}
        </ModernButton>
      </GlassCard>
    </ProfileWrapper>
  );
};

export default ProfilePage;
