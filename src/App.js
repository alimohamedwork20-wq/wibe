import { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import { dark } from "./styles/Themes";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { useEffect, useRef, useState } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";
import ForgotPassword from "./auth/ForgotPassword";
import Home from "./sections/Home";
import About from "./sections/About";
import Shop from "./sections/Shop";
import ScrollTriggerProxy from "./components/ScrollTriggerProxy";
import Banner from "./sections/Banner";
import NewArrival from "./sections/NewArrival";
import { AnimatePresence } from "framer-motion";
import Footer from "./sections/Footer";
import Loader from "./components/Loader";
import LoginPage from "./auth/Login";
import RegisterPage from "./auth/Register";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Reset from "./auth/Reset";
import ResetPass from "./auth/ResetPass";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProfilePage from "./sections/Profile";
import { Toaster } from "react-hot-toast";
import NotFound from "./sections/NotFound";
// سكاشن الصفحة الرئيسية جمعناها هنا عشان كودك يبقى نضيف
const MainLanding = () => {
  return (
    <>
      <Home />
      <About />
      <Shop />
      <Banner />
      <NewArrival />
      <Footer />
    </>
  );
};

function App() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation(); // عشان نراقب تغيير المسار

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, []);

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={dark}>
        {/* شلنا الـ BrowserRouter من هنا لأن مكانه الصح في index.js */}
        <LocomotiveScrollProvider
          options={{
            smooth: true,
            smartphone: { smooth: true },
            tablet: { smooth: true },
          }}
          watch={[location.pathname]} // تحديث السكرول عند تغيير الصفحة
          containerRef={containerRef}
        >
          <AnimatePresence>{loaded ? null : <Loader />}</AnimatePresence>

          <ScrollTriggerProxy />

          <AnimatePresence>
            <main className="App" data-scroll-container ref={containerRef}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                {/*-------- Home -------- */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <MainLanding />
                    </ProtectedRoute>
                  }
                ></Route>
                {/*-------- profile -------- */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                ></Route>

                {/* صفحات الـ Auth المنفصلة */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/reset-pass" element={<ResetPass />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              <Toaster position="top-center" reverseOrder={true} />
            </main>
          </AnimatePresence>
        </LocomotiveScrollProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
