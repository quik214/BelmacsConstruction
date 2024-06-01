import ProjectsTypes from "../../components/Projects/ProjectsTypes/ProjectsTypes";
import ProjectsHero from "../../components/Projects/ProjectsHero/ProjectsHero";

import DefaultHeroImage from "../../assets/Projects/Hero.jpg";

import Footer from "../../components/Footer/Footer"

export default function Projects() {
  return (
    <div>
      <ProjectsHero imageUrl={DefaultHeroImage} heroText="Our Projects" />
      <div className="container">
        <ProjectsTypes />
      </div>

      <Footer />
    </div>
  );
}
