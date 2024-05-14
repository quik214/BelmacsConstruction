import React, { useState, useEffect } from "react";
import "../../assets/fonts.css";

import "./Navbar.css";
import "./Navbar-media.css";

/* Import Belmacs Icons */
import BelmacsBlueBlack from "../../assets/Logos/belmacs-blueblack.png";
import BelmacsWhiteWhite from "../../assets/Logos/belmacs-whitewhite.png";

/* Sidebar Icons */
import CloseIcon from "../../assets/Icons/close.svg";
import MenuBlackIcon from "../../assets/Icons/menu-black.svg";
import MenuWhiteIcon from "../../assets/Icons/menu-white.svg";

// Link (for working with react-router)
import { Link } from "react-router-dom";

export default function Navbar() {
  // for belmacs logo changing
  const logoNonActive = BelmacsWhiteWhite;
  const logoActive = BelmacsBlueBlack;

  const [navbar, setNavbar] = useState(false);
  const [logo, setLogo] = useState(false);

  const [menuIcon, setMenuIcon] = useState(false);

  // below is arrow function
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

  window.addEventListener("scroll", changeBackground);
  // "scroll" is some default behaviour, and we apply the function changeBackground upon scroll

  // for making sidebar appear (onclick of the menu icon)
  const showSideBar = () => {
    const sidebar = document.querySelector(".sidebar");

    sidebar.classList.remove("close");
    sidebar.classList.add("open");

    sidebar.style.display = "block";
  };

  // for hiding sidebar (onclick of the close icon)
  const hideSideBar = () => {
    const sidebar = document.querySelector(".sidebar");

    sidebar.classList.remove("open");
    sidebar.classList.add("close");

    setTimeout(() => {
      sidebar.style.display = "none";
    }, 300);
  };

  return (
    <div>
      {/* Start of Navbar */}
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
            src={menuIcon ? MenuBlackIcon : MenuWhiteIcon}
            className="nav-sidebar-icon"
            onClick={showSideBar}
          ></img>
        </div>
      </nav>
      {/* End of Navbar */}

      {/* Start of Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-links">
          <img
            src={CloseIcon}
            className="sidebar-img"
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
      {/* End of Sidebar */}
    </div>
  );
}
