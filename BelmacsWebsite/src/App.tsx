import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";

import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import ProjectIndividual from "./components/Projects/ProjectsIndividual/ProjectsIndividual";
import Admin from "./pages/Admin/Admin";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      {!isAdminPage && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:type" element={<ProjectIndividual />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
