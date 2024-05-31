import ProjectsCategory from "../../components/Projects/ProjectsCategory/ProjectsCategory";
import ProjectsHero from "../../components/Projects/ProjectsHero/ProjectsHero";

export default function Projects() {
  return (
    <div>
      <ProjectsHero />
      <div className="container">
        <ProjectsCategory />
      </div>
    </div>
  );
}
