import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../firebase";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        window.addEventListener("scroll", changeBackground);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkInitialStates = () => {
      if (
        location.pathname === "/admin" ||
        location.pathname.includes("/projects") ||
        location.pathname.includes("/create") ||
        location.pathname.includes("/edit")
      ) {
        setNavbar(true);
        setLogo(true);
        setMenuIcon(true);
      } else {
        window.addEventListener("scroll", changeBackground);
      }
    };

    checkInitialStates();

    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, [location.pathname]);

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
      closeDropdown();
    } else {
      console.error("Sidebar element not found or is not an HTMLElement.");
    }
  };

  const handleSignOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        console.log("Sign out successful");
        hideSideBar();
        toast.success("Sign out successful", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Signing out fail please countant administrator", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });

    localStorage.clear();
  };

  return (
    <div>
      {/* DESKTOP NAVBAR */}
      <nav className={authUser || navbar ? "navbar active" : "navbar"}>
        <Link to="/">
          <img
            src={logo || authUser ? BelmacsBlueBlack : BelmacsWhiteWhite}
            className="navbar-logo"
          />
        </Link>
        <div className="nav-links">
          {/* (If user is not authenticated) && (The page is not admin), */}
          {!authUser && location.pathname !== "/admin" && (
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
            <div className="dropdown">
              <Link
                to="#"
                onClick={toggleDropdown}
                className="nav-link hideOnMobile dropdown-trigger"
              >
                Dashboard
              </Link>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link
                    to="/admin/about"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    About
                  </Link>
                  <Link
                    to="/admin/projects"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    Projects
                  </Link>
                </div>
              )}
              <Link
                to="/"
                onClick={handleSignOut}
                className="nav-link hideOnMobile"
              >
                Sign Out
              </Link>
            </div>
          )}
          {(authUser || location.pathname !== "/admin") && (
            <img
              src={menuIcon ? MenuBlackIcon : MenuWhiteIcon}
              className="nav-sidebar-icon"
              onClick={showSideBar}
            ></img>
          )}
        </div>
      </nav>

      {/* MOBILE SIDEBAR*/}

      <nav className="sidebar">
        <div className="sidebar-links">
          <img
            src={CloseIcon}
            className="sidebar-img"
            onClick={hideSideBar}
          ></img>
          {!authUser && location.pathname !== "/admin" && (
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
              <div className="dropdown">
                <Link
                  to="#"
                  onClick={toggleDropdown}
                  className="sidebar-link dropdown-trigger"
                >
                  Dashboard
                </Link>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link
                      to="/"
                      className="dropdown-item"
                      onClick={() => {
                        closeDropdown();
                        hideSideBar(); // Close sidebar when item clicked
                      }}
                    >
                      About
                    </Link>
                    <Link
                      to="/admin/projects"
                      className="dropdown-item"
                      onClick={() => {
                        closeDropdown();
                        hideSideBar(); // Close sidebar when item clicked
                      }}
                    >
                      Projects
                    </Link>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              <Link
                to="/"
                onClick={() => {
                  handleSignOut();
                  hideSideBar(); // Close sidebar after sign out
                }}
                className="sidebar-link"
              >
                Sign Out
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
