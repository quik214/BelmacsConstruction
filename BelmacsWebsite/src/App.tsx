import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";

import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import ProjectIndividual from "./components/Projects/ProjectsIndividual/ProjectsIndividual";

// Admin Page
import Admin from "./pages/Admin/Admin";
import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard";
import AdminCreate from "./components/Admin/AdminCreate/AdminCreate";
import AdminEdit from "./components/Admin/AdminEdit/AdminEdit";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<AdminCreate />} />
          <Route path="/admin/edit" element={<AdminEdit />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
