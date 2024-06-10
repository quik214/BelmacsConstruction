import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import "../../assets/fonts.css";
import "./Navbar.css";
import "./Navbar-media.css";
import BelmacsBlueBlack from "../../assets/Logos/belmacs-blueblack.png";
import BelmacsWhiteWhite from "../../assets/Logos/belmacs-whitewhite.png";
import CloseIcon from "../../assets/Icons/close.svg";
import MenuBlackIcon from "../../assets/Icons/menu-black.svg";
import MenuWhiteIcon from "../../assets/Icons/menu-white.svg";

export default function Navbar() {
  const [navbar, setNavbar] = useState(false);
  const [logo, setLogo] = useState(false);
  const [menuIcon, setMenuIcon] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        window.addEventListener("scroll", changeBackground);

        // Change navbar when on login page
        if (location.pathname === "/admin") {
          setNavbar(true);
          setLogo(true);
          setMenuIcon(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const changeBackground = () => {
    if (window.scrollY >= 40) {
      setNavbar(true);
      setLogo(true);
      setMenuIcon(true);
    } else {
      setNavbar(false);
      setLogo(false);
      setMenuIcon(false);
    }
  };

  const showSideBar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.remove("close");
      sidebar.classList.add("open");
      (sidebar as HTMLElement).style.display = "block";
    } else {
      console.error("Sidebar element not found.");
    }
  };

  const hideSideBar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar instanceof HTMLElement) {
      sidebar.classList.remove("open");
      sidebar.classList.add("close");
      setTimeout(() => {
        sidebar.style.display = "none";
      }, 300);
    } else {
      console.error("Sidebar element not found or is not an HTMLElement.");
    }
  };

  const handleSignOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        console.log("Sign out successful");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <nav className={authUser || navbar ? "navbar active" : "navbar"}>
        <img
          src={logo || authUser ? BelmacsBlueBlack : BelmacsWhiteWhite}
          className="navbar-logo"
        />
        <div className="nav-links">
          {!authUser && (
            <>
              <Link to="/" className="nav-link hideOnMobile">
                About
              </Link>
              <Link to="/projects" className="nav-link hideOnMobile">
                Projects
              </Link>
              <Link to="/services" className="nav-link hideOnMobile">
                Services
              </Link>
              <Link to="/contact" className="nav-link hideOnMobile">
                Contact Us
              </Link>
            </>
          )}
          {authUser && (
            <>
              <Link to="/admin" className="nav-link">
                Dashboard
              </Link>
              <Link
                to="/admin"
                onClick={handleSignOut}
                className="nav-link hideOnMobile"
              >
                Sign Out
              </Link>
            </>
          )}
          <img
            src={menuIcon ? MenuBlackIcon : MenuWhiteIcon}
            className="nav-sidebar-icon"
            onClick={showSideBar}
          ></img>
        </div>
      </nav>

      <nav className="sidebar">
        <div className="sidebar-links">
          <img
            src={CloseIcon}
            className="sidebar-img"
            onClick={hideSideBar}
          ></img>
          {!authUser && (
            <>
              <Link to="/" className="sidebar-link">
                About
              </Link>
              <Link to="/projects" className="sidebar-link">
                Projects
              </Link>
              <Link to="/services" className="sidebar-link">
                Services
              </Link>
              <Link to="/contact" className="sidebar-link">
                Contact Us
              </Link>
            </>
          )}

          {authUser && (
            <>
              <Link to="/admin" className="sidebar-link">
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="nav-link hideOnMobile">
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
