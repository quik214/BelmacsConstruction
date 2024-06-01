import ProjectsCategory from "../../components/Projects/ProjectsCategory/ProjectsCategory";
import ProjectsHero from "../../components/Projects/ProjectsHero/ProjectsHero";

import Footer from "../../components/Footer/Footer"

export default function Projects() {
  return (
    <div>
      <ProjectsHero />
      <div className="container">
        <ProjectsCategory />
      </div>

      <Footer />
    </div>
  );
}
