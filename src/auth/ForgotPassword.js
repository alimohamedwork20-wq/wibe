import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import Cookies from "js-cookie";
import "../components/spinner.css";
const ForgotPassword = () => {
  const [Email, setEmail] = useState("");
  const [Error, setError] = useState("");
  const [Loading, setLoading] = useState(false);
  async function Otp() {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API_URL}/Auth/otp`, {
        Email: Email,
      });

      if (res && res.data) {
        Cookies.set("temp_otp", res.data.code, { expires: 1 / 288 });
        Cookies.set("email", res.data.email);
        window.location.href = "/reset";
      }
      setError(res.status);
    } catch (err) {
      const statusCode = err.response?.status;
      setError(statusCode);
      console.error("Error details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="forgot-container">
      {/* الجانب الأيسر: الصورة */}
      <div className="forgot-visual">
        <div className="forgot-overlay"></div>
        <div className="forgot-visual-content">
          <h2 className="forgot-logo">Wibe.</h2>
          <p className="forgot-tagline">RECOVER YOUR ACCESS</p>
        </div>
      </div>

      {/* الجانب الأيمن: الفورم */}
      <div className="forgot-form-section">
        <div className="forgot-wrapper">
          <div className="forgot-header">
            <h3>Enter your email</h3>
            <p>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form className="forgot-auth-form">
            <div className="forgot-input-group">
              <label>Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <>
              {" "}
              {Error == 404 ? (
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    color: "#a80b0b",
                    transform: "translateY(-170%)",
                  }}
                >
                  - The email address is incorrect...
                </p>
              ) : (
                ""
              )}
            </>
            <button onClick={(p) => Otp()} type="button" className="forgot-btn">
              {Loading ? (
                <span className="loader">Loading</span>
              ) : (
                "SEND RESET LINK"
              )}
            </button>
          </form>

          <div className="forgot-footer">
            <p>
              REMEMBERED YOUR PASSWORD? <a href="/login">BACK TO LOGIN</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
