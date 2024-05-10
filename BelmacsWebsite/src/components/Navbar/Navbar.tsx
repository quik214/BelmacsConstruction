import React, { useState, useEffect } from "react";
import "./Navbar.css";

// Link (for working with react-router)
import { Link } from "react-router-dom";

export default function Navbar() {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
        setNavbar(true)
    } else {
        setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground); 
  // i would assume that this "scroll" is some default behaviour, and we apply the function changeBackground upon scroll

  return (
    <nav className={navbar ? 'navbar active' : 'navbar'}>
      <Link to="/" className="nav-link">
        About
      </Link>

      <Link to="/projects" className="nav-link">
        Projects
      </Link>

      <Link to="/services" className="nav-link">
        Services
      </Link>

      <Link to="/contact" className="nav-link">
        Contact
      </Link>
    </nav>
  );
}
