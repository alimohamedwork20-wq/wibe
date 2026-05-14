import React, { useState } from "react";
import "./register.css";
import axios from "axios";
import "../components/spinner.css";
import Cookies from "js-cookie";
import { Name } from "ajv";
import toast from "react-hot-toast";
const RegisterPage = () => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [HandelChick, setHandelChick] = useState(false);
  const [HandelPassword, setHandelPassword] = useState(false);
  const [IsAgreed, setIsAgreed] = useState(false);
  const [HandelName, setHandelName] = useState(false);
  const [HandelTerms, setHandelTerms] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [HandelEmail, setHandelEmail] = useState(false);
  async function register() {
    setLoading(true);
    try {
      const loginData = {
        FullName: FullName,
        Email: Email,
        Password: Password,
      };
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API_URL}/Auth/register`, loginData);

      if (res && res.data) {
        Cookies.set("pass", Password);
        Cookies.set("email", Email);
        Cookies.set("userName", res.data.fullName);
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          "Login failed:",
          error.response.data.message || error.response.data,
        );
      } else {
        console.error("Network Error:", error.message);
        toast.error("Email is already registered.");
      }
    } finally {
      setLoading(false);
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function chick() {
    setHandelChick(false);
    setHandelPassword(false);
    setHandelTerms(false);
    setHandelName(false);
    setHandelEmail(false);
    if (Password !== RePassword) {
      setHandelChick(true);
    } else if (FullName.length <= 0) {
      setHandelName(true);
    } else if (!emailRegex.test(Email)) {
      setHandelEmail(true);
      return;
    } else if (Password.length < 8) {
      setHandelPassword(true);
    } else if (!IsAgreed) {
      setHandelTerms(true);
    } else {
      register();
    }
  }
  return (
    <div className="register-container">
      {/* الجانب الأيمن: الفورم (عشان نغير عن الـ Login) */}
      <div className="register-form-section">
        <div className="reg-wrapper">
          <div className="reg-header">
            <h3>Join the Studio</h3>
            <p>Create an account to start your journey with Wibe.</p>
          </div>

          <form className="reg-form">
            <div className="reg-input-group">
              <label>Full Name</label>
              <input
                onChange={(p) => setFullName(p.target.value)}
                type="text"
                placeholder="ALEXANDER WIBE"
                required
              />
            </div>
            {HandelName && (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-170%)",
                }}
              >
                - Enter the name.
              </p>
            )}
            <div className="reg-input-group">
              <label>Email Address</label>
              <input
                onChange={(p) => setEmail(p.target.value)}
                type="email"
                placeholder="studio@wibe.com"
                required
              />
            </div>
            {HandelEmail && (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-140%)",
                }}
              >
                - Enter the email.
              </p>
            )}
            <div className="reg-row">
              <div className="reg-input-group">
                <label>Password</label>
                <input
                  onChange={(p) => setPassword(p.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="reg-input-group">
                <label>Confirm Password</label>
                <input
                  onChange={(p) => setRePassword(p.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            {HandelPassword && (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-140%)",
                }}
              >
                - Password must be at least 8 characters.
              </p>
            )}
            {HandelChick && (
              <p
                style={{
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-120%)",
                }}
              >
                - The password does not match.
              </p>
            )}

            <div className="terms-check">
              <input
                onChange={(e) => setIsAgreed(e.target.checked)}
                type="checkbox"
                id="terms"
                required
              />
              <label htmlFor="terms">
                I agree to the <span>Terms & Conditions</span>
              </label>
            </div>
            {HandelTerms && (
              <p
                style={{
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(70%)",
                }}
              >
                - You must agree to the terms and conditions.
              </p>
            )}

            <button onClick={(p) => chick()} type="button" className="reg-btn">
              {Loading ? (
                <span className="loader">Loading</span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          <div className="reg-footer">
            <p>
              ALREADY A MEMBER? <a href="/login">SIGN IN</a>
            </p>
          </div>
        </div>
      </div>

      <div className="register-visual">
        <div className="reg-overlay"></div>
        <div className="reg-visual-content">
          <h2 className="reg-logo">Wibe.</h2>
          <div className="reg-motto">
            <span>Inspire.</span>
            <span>Create.</span>
            <span>Believe.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
