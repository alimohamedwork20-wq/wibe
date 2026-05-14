import React, { useState } from "react";
import "./ResetPass.css";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
const Reset = () => {
  const [Loading, setLoading] = useState(false);
  const [Password, setPassword] = useState("");
  // خليت اسم الـ State واضح (passwordError) والدالة اللي بتغيره (setPasswordError)
  const [passwordError, setPasswordError] = useState(false);

  async function chick() {
    // 1. التحقق من طول الباسورد
    if (Password.length < 8) {
      setPasswordError(true);
      return; // بنوقف التنفيذ هنا لو فيه خطأ
    }

    // 2. لو الباسورد تمام، بنخفي رسالة الخطأ ونبدأ عملية التحديث
    setPasswordError(false);
    setLoading(true);
    const token = Cookies.get("temp_token");
    try {
      // بنجيب الإيميل اللي حفظناه في الخطوة اللي فاتت
      const userEmail = Cookies.get("email");
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.put(
        `${API_URL}/Auth/updatePass`,
        { Email: userEmail, Password: Password },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="forgot-container">
        <div className="forgot-visualll">
          <div className="forgot-overlay"></div>
          <div className="forgot-visual-content">
            <h2 className="forgot-logo">Wibe.</h2>
            <p className="forgot-tagline">RECOVER YOUR ACCESS</p>
          </div>
        </div>

        <div className="forgot-form-section">
          <div className="forgot-wrapper">
            <div className="forgot-header">
              <h3>Enter a New Password</h3>
              <p>The password must be strong enough</p>
            </div>

            <form
              className="forgot-auth-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="forgot-input-group">
                <label>Enter a new password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="• • • • • • •"
                  required
                />
              </div>

              {passwordError && (
                <p
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    color: "#a80b0b",
                    transform: "translateY(-170%)",
                  }}
                >
                  - Password must be at least 8 characters.
                </p>
              )}

              <button
                onClick={chick}
                type="button"
                className="forgot-btn"
                disabled={Loading}
              >
                {Loading ? <span className="loader">Loading</span> : "Confirm"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reset;
