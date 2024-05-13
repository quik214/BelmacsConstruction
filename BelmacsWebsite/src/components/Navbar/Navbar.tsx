import React, { useState, useEffect } from "react";
import "../../assets/fonts.css";

import BelmacsBlueBlack from "../../assets/Logos/belmacs-blueblack.png";
import BelmacsWhiteWhite from "../../assets/Logos/belmacs-whitewhite.png";

import "./Navbar.css";
import "./Navbar-media.css";
import CloseIcon from "../../assets/Icons/close.svg";
import MenuIcon from "../../assets/Icons/menu.svg";

// Link (for working with react-router)
import { Link } from "react-router-dom";

export default function Navbar() {
  // for belmacs logo changing
  const logoNonActive = BelmacsWhiteWhite;
  const logoActive = BelmacsBlueBlack;

  const [navbar, setNavbar] = useState(false);
  const [logo, setLogo] = useState(false);

  // below is arrow function
  const changeBackground = () => {
    if (window.scrollY >= 40) {
      setNavbar(true);
      setLogo(true);
    } else {
      setNavbar(false);
      setLogo(false);
    }
  };

  window.addEventListener("scroll", changeBackground);
  // "scroll" is some default behaviour, and we apply the function changeBackground upon scroll

  // for making sidebar appear
  const showSideBar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "flex";
  };

  // for hiding sidebar
  const hideSideBar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.display = "none";
  };

  return (
    <div>
      <nav className="sidebar">
        <div className="sidebar-links">
          <img
            src={CloseIcon}
            className="sidebar-link "
            onClick={hideSideBar}
          ></img>
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
        </div>
      </nav>

      <nav className={navbar ? "navbar active" : "navbar"}>
        <img src={logo ? logoActive : logoNonActive} className="navbar-logo" />

        <div className="nav-links">
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
          <img
            src={MenuIcon}
            className="nav-sidebar-icon"
            onClick={showSideBar}
          ></img>
        </div>
      </nav>
    </div>
  );
}
