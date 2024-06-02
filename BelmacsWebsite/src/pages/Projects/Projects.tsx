import ProjectsTypes from "../../components/Projects/ProjectsTypes/ProjectsTypes";
import Hero from "../../components/Hero/Hero";

import DefaultHeroImage from "../../assets/Projects/Hero.jpg";

export default function Projects() {
  return (
    <div>
      <Hero imageUrl={DefaultHeroImage} heroText="Our Projects" />
      <div className="container">
        <ProjectsTypes />
      </div>
    </div>
  );
}
