import React, { useState } from "react";
import "./log.css";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/spinner.css";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
const LoginPage = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Error, setError] = useState(false);
  const [Loading, setLoading] = useState(false);
  async function login() {
    setLoading(true);
    try {
      const loginData = {
        Email: Email,
        Password: Password,
      };
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API_URL}/Auth/login`, loginData, {
        withCredentials: true,
      });

      if (res && res.data) {
        setError(false);
        Cookies.set("userName", res.data.fullName);
        Cookies.set("token", res.data.token);
        Cookies.set("temp_token", res.data.token);
        Cookies.set("pass", Password);
        Cookies.set("email", Email);
        window.location.href = "/home";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(true);
      } else {
        console.error("Network Error:", error.message);
        toast.error("Server is down, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="login-container">
        <div className="login-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <h2 className="visual-logo">Wibe.</h2>
            <p className="visual-tagline">THE ART OF MINIMALIST FASHION</p>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h3>Welcome Back</h3>
              <p>Enter your credentials to access your account.</p>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="studio@wibe.com"
                  required
                />
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label>Password</label>
                  <Link to="/forgot-password" global className="forgot-link">
                    Forgot?
                  </Link>
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              {Error && (
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    color: "#a80b0b",
                    transform: "translateY(-170%)",
                  }}
                >
                  - The password or email is incorrect..
                </p>
              )}

              <button onClick={login} type="button" className="login-btn">
                {Loading ? <span className="loader">Loading</span> : "SIGN IN"}
              </button>
            </form>

            <div className="form-footer">
              <p>
                NEW TO THE STUDIO?{" "}
                {/* التعديل هنا: استخدمنا window.location عشان ننضف الميموري وإحنا رايحين نكريت أكونت */}
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/register";
                  }}
                >
                  CREATE ACCOUNT
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
