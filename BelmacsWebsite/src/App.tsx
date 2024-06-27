import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import ProjectIndividual from "./components/Projects/ProjectsIndividual/ProjectsIndividual";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Page
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminCreate from "./pages/Admin/AdminCreate/AdminCreate";
import AdminEdit from "./pages/Admin/AdminEdit/AdminEdit";

// Admin Page (AboutCompany)
import AdminAboutCompany from "./pages/Admin/AdminAbout/AdminAboutCompany/AdminAboutCompany/AdminAboutCompany";
import AdminEditCompany from "./pages/Admin/AdminAbout/AdminAboutCompany/AdminEditCompany/AdminEditCompany";

import PrivateRoute from "./components/Admin/PrivateRoute";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return <MainApp />;
}

function MainApp() {
  const location = useLocation();

  // Define paths where you don't want to show the footer
  const noFooterPaths = [
    "/admin",
    "/admin/projects",
    "/admin/create",
    "/admin/edit",
    "/admin/about",
    "/admin/about/company/edit",
  ];

  // Check if the current path includes any of the paths in noFooterPaths
  const shouldShowFooter = !noFooterPaths.some((path) =>
    location.pathname.includes(path)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:type" element={<ProjectIndividual />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/about"
            element={
              <PrivateRoute>
                <AdminAboutCompany />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/about/company/edit"
            element={
              <PrivateRoute>
                <AdminEditCompany />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create/:selectedType"
            element={
              <PrivateRoute>
                <AdminCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/edit/:type/:id"
            element={
              <PrivateRoute>
                <AdminEdit />
              </PrivateRoute>
            }
          />
          {/* Catch-all route for invalid paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {shouldShowFooter && <Footer />}
      <ToastContainer />{" "}
      {/* Must be included in root (here), so that can be accessed across every page*/}
    </>
  );
}

export default App;
