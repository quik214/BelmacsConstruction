import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastProvider } from "./components/Toast/ToastContext";

import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import ProjectIndividual from "./components/Projects/ProjectsIndividual/ProjectsIndividual";

// Admin Page
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminCreate from "./pages/Admin/AdminCreate/AdminCreate";
import AdminEdit from "./pages/Admin/AdminEdit/AdminEdit";
import PrivateRoute from "./components/Admin/PrivateRoute";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

function MainApp() {
  const location = useLocation();

  // Define paths where you don't want to show the footer
  const noFooterPaths = [
    "/admin",
    "/admin/dashboard",
    "/admin/create",
    "/admin/edit",
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
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create"
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
    </>
  );
}

export default App;
