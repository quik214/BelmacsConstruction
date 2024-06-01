import ProjectsTypes from "../../components/Projects/ProjectsTypes/ProjectsTypes";
import ProjectsHero from "../../components/Projects/ProjectsHero/ProjectsHero";

import Footer from "../../components/Footer/Footer"

export default function Projects() {
  return (
    <div>
      <ProjectsHero />
      <div className="container">
        <ProjectsTypes />
      </div>

      <Footer />
    </div>
  );
}
