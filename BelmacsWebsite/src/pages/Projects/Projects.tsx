import ProjectsTypes from "../../components/Projects/ProjectsTypes/ProjectsTypes";
import ProjectsHero from "../../components/Projects/ProjectsHero/ProjectsHero";

import DefaultHeroImage from "../../assets/Projects/Hero.jpg";

export default function Projects() {
  return (
    <div>
      <ProjectsHero imageUrl={DefaultHeroImage} heroText="Our Projects" />
      <div className="container">
        <ProjectsTypes />
      </div>
    </div>
  );
}
