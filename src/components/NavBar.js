import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import { useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cookies from "js-cookie";
import { ImageProfile } from "../components/ImageProfile";

/* ================= NAV CONTAINER (DESKTOP ANIMATION RETURNED) ================= */

const NavContainer = styled(motion.div)`
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
`;

/* ================= MENU ================= */

const MenuItems = styled(motion.ul)`
  position: relative;

  height: ${(props) => props.theme.navHeight};

  background-color: ${(props) => props.theme.body};

  color: ${(props) => props.theme.text};

  list-style: none;

  display: flex;

  justify-content: space-around;

  align-items: center;

  width: 100%;

  padding: 0 10rem;

  @media (max-width: 40em) {
    position: fixed;

    top: 0;
    left: 0;

    width: 100%;

    flex-direction: column;

    padding: 4rem 0 2rem;

    height: auto;

    background-color: ${(props) => props.theme.body};

    transform: ${(props) =>
      props.mobileOpen ? "translateY(0)" : "translateY(-120%)"};

    transition: 0.35s ease;

    z-index: 9998;
  }
`;

/* ================= BURGER ================= */

const Burger = styled.div`
  display: none;
  @media (max-width: 40em) {
    display: flex;

    position: fixed;

    top: 15px;
    right: 20px;

    font-size: 28px;

    cursor: pointer;

    z-index: 10000;

    color: ${(props) => props.theme.text};
  }
`;

/* ================= DESKTOP MENU BUTTON ================= */

const MenuBtn = styled.li`
  position: absolute;

  top: 100%;
  left: 50%;

  transform: translateX(-50%);

  width: 15rem;
  height: 2.5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${(props) => `rgba(${props.theme.textRgba}, 0.7)`};

  color: ${(props) => props.theme.body};

  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);

  cursor: pointer;

  @media (max-width: 40em) {
    display: none;
  }
`;

/* ================= ITEM ================= */

const MenuItem = styled(motion.li)`
  cursor: pointer;
  transition: 0.2s;
  margin: 10px;
  &:hover {
    color: white;
    transform: scale(1.2);
  }

  text-transform: uppercase;
  color: ${(props) => props.theme.text};
`;

/* ================= COMPONENT ================= */

const NavBar = () => {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scroll } = useLocomotiveScroll();
  const navigate = useNavigate();

  /* ================= SCROLL ================= */

  const handleScroll = (id) => {
    const elem = document.querySelector(id);

    setMobileOpen(false);
    setDesktopOpen(false);

    scroll?.scrollTo(elem, {
      offset: "-100",
      duration: "2000",
    });
  };

  /* ================= NAVIGATION ================= */

  const handleNavigation = (path) => {
    setMobileOpen(false);
    setDesktopOpen(false);

    if (scroll) scroll.destroy();

    ScrollTrigger.getAll().forEach((t) => t.kill());
    ScrollTrigger.refresh();

    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const userStatus = Cookies.get("token");

  const logout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* BURGER */}
      <Burger onClick={() => setMobileOpen(!mobileOpen)}>☰</Burger>

      {/* NAV CONTAINER + ANIMATION (DESKTOP FIX) */}
      <NavContainer
        initial={{ y: "-100%" }}
        animate={{ y: desktopOpen ? 0 : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <MenuItems mobileOpen={mobileOpen}>
          {/* MENU BTN (DESKTOP TOGGLE) */}
          <MenuBtn
            style={{ fontSize: "20px", paddingTop: "5px" }}
            onClick={() => setDesktopOpen(!desktopOpen)}
          >
            Menu
          </MenuBtn>

          <MenuItem onClick={() => handleScroll("#home")}>Home</MenuItem>

          <MenuItem onClick={() => handleScroll(".about")}>About</MenuItem>

          <MenuItem onClick={() => handleScroll("#shop")}>Shop</MenuItem>

          <MenuItem onClick={() => handleScroll("#new-arrival")}>
            New Arrival
          </MenuItem>

          {userStatus ? (
            <MenuItem onClick={logout}>Logout</MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => handleNavigation("/login")}>
                Login
              </MenuItem>

              <MenuItem onClick={() => handleNavigation("/register")}>
                Register
              </MenuItem>
            </>
          )}

          {/* PROFILE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "12px" }}>
              HELLO, {Cookies.get("userName")?.toUpperCase()}
            </span>

            <ImageProfile
              size="35px"
              fontSize="1rem"
              onClick={() => (window.location.pathname = "/profile")}
            >
              {Cookies.get("userName")?.charAt(0)?.toUpperCase()}
            </ImageProfile>
          </div>
        </MenuItems>
      </NavContainer>
    </>
  );
};

export default NavBar;
