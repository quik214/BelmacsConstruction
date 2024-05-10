import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// for react-router
import { Link, Route, Routes } from "react-router-dom";

// below imports must be relative to App.tsx
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";

// import navbar
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
