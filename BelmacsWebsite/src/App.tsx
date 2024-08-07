import "./App.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Google Analytics
import ReactGA from "react-ga4";

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
import AdminDashboard from "./pages/Admin/AdminProjects/AdminProjectsDashboard/AdminProjectsDashboard";
import AdminCreate from "./pages/Admin/AdminProjects/AdminProjectsCreate/AdminProjectsCreate";
import AdminEdit from "./pages/Admin/AdminProjects/AdminProjectsEdit/AdminProjectsEdit";
import AdminEditProjectType from "./pages/Admin/AdminProjects/AdminProjectTypeEdit/AdminProjectsEdit";

// Admin Page (About)
import AdminAboutCompany from "./pages/Admin/AdminAbout/AdminAboutDashboard/AdminAboutDashboard";
import AdminEditCompany from "./pages/Admin/AdminAbout/AdminEditCompany/AdminEditCompany";

import AdminCreatePeople from "./pages/Admin/AdminAbout/AdminCreatePeople/AdminCreatePeople";
import AdminEditPeople from "./pages/Admin/AdminAbout/AdminEditPeople/AdminEditPeople";

import AdminAnalytics from "./pages/Admin/AdminAnalytics/AdminAboutDashboard/AdminAnalyticsDashboard";

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

  useEffect(() => {
    ReactGA.initialize("G-FZXFG5T9KE"); // Replace with your Google Analytics Measurement ID
    ReactGA.send("pageview");
  }, []);

  const TrackPageView: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
      ReactGA.send("pageview");
    }, [location]);

    return null;
  };

  return (
    <>
      <Navbar />
      <div>
        <TrackPageView />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:type" element={<ProjectIndividual />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/analytics"
            element={
              <PrivateRoute>
                <AdminAnalytics />
              </PrivateRoute>
            }
          />
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
            path="/admin/about/people/create"
            element={
              <PrivateRoute>
                <AdminCreatePeople />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/about/people/edit/:name"
            element={
              <PrivateRoute>
                <AdminEditPeople />
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
            path="/admin/projects/create/:selectedType"
            element={
              <PrivateRoute>
                <AdminCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/projects/edit/:type/:id"
            element={
              <PrivateRoute>
                <AdminEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/project-types/edit/:title"
            element={
              <PrivateRoute>
                <AdminEditProjectType />
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
