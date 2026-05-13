import React, { useState, useEffect } from "react"; // ضيفنا useEffect
import "./Reset.css";
import axios from "axios";
import Cookies from "js-cookie";

const Reset = () => {
  const [Loading, setLoading] = useState(false);
  const [Code, setCode] = useState("");
  const [handelCode, setHandelCode] = useState("");

  // --- الـ Logic بتاع العداد التنازلي ---
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
  // ------------------------------------

  const savedOtp = Cookies.get("temp_otp");

  function chick() {
    setLoading(true);
    if (Code !== savedOtp) {
      setHandelCode(true);
      setLoading(false);
    } else {
      setHandelCode(false);
      setLoading(false);
      window.location.pathname = "/reset-pass";
    }
  }

  async function Otp() {
    if (!canResend) return; // حماية إضافية لو حد حاول يضغط بسرعة

    try {
      setCanResend(false); // نقفل الزرار فوراً
      setTimer(60); // نبدأ عد تنازلي من 60 ثانية
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API_URL}/Auth/otp`, {
        Email: Cookies.get("email"),
      });
      if (res && res.data) {
        Cookies.set("temp_otp", res.data.code, { expires: 1 / 288 });
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      // لو حصل إيرور نرجع الزرار متاح تاني
      setCanResend(true);
      setTimer(0);
    }
  }

  return (
    <div className="forgot-container">
      <div className="forgot-visuall">
        <div className="forgot-overlay"></div>
        <div className="forgot-visual-content">
          <h2 className="forgot-logo">Wibe.</h2>
          <p className="forgot-tagline">RECOVER YOUR ACCESS</p>
        </div>
      </div>

      <div className="forgot-form-section">
        <div className="forgot-wrapper">
          <div className="forgot-header">
            <h3>Enter a code</h3>
            <p>A code has been sent to {Cookies.get("email")}</p>
          </div>

          <form className="forgot-auth-form">
            <div className="forgot-input-group">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label>Enter a your code</label>

                {/* تعديل زرار الـ Resend */}
                <p
                  onClick={canResend ? Otp : null}
                  style={{
                    transform: "translateY(10%)",
                    cursor: canResend ? "pointer" : "not-allowed",
                    opacity: canResend ? 1 : 0.5, // بهتان للزرار وهو مقفول
                  }}
                  className="forgot-link"
                >
                  {canResend ? "Resend code?" : `Resend in ${timer}s`}
                </p>
              </div>

              <input
                onChange={(e) => setCode(e.target.value)}
                type="text"
                placeholder="• • •  • • •"
                required
              />
            </div>

            {handelCode && (
              <p
                style={{
                  textAlign: "left",
                  fontSize: "10px",
                  color: "#a80b0b",
                  transform: "translateY(-170%)",
                }}
              >
                - The code you entered is incorrect..
              </p>
            )}

            <button
              onClick={() => chick()}
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
  );
};

export default Reset;
