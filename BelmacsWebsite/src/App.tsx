import "./App.css";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import ProjectIndividual from "./components/Projects/ProjectsIndividual/ProjectsIndividual";

// Admin Page
import AdminLogin from "./pages/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminCreate from "./components/Admin/Create/Create";
import AdminEdit from "./components/Admin/Edit/Edit";
import PrivateRoute from "./components/Admin/PrivateRoute";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  const location = useLocation();

  // Define paths where you don't want to show the footer
  const noFooterPaths = [
    "/admin",
    "/admin/dashboard",
    "/admin/create",
    "/admin/edit",
  ];
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
            path="/admin/edit"
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
      {!noFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
