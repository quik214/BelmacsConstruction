import "../../../assets/fonts.css";
import "./ProjectsTypes.css";
import "./ProjectsTypes-media.css";

import { useNavigate } from "react-router-dom";

export type projectTypeItem = {
  title?: string;
  image?: string;
  path?: string;
};
export const projectTypes: projectTypeItem[] = [
  {
    title: "Residential",
    image: "",
    path: "residential",
  },
  {
    title: "Commercial",
    image: "",
    path: "commercial",
  },
  {
    title: "Infrastructure",
    image: "",
    path: "infrastructure",
  },
  {
    title: "Existing Building Retrofit",
    image: "",
    path: "existingBuildingRetrofit",
  },
  {
    title: "Institutional",
    image: "",
    path: "institutional",
  },
  {
    title: "Industrial",
    image: "",
    path: "industrial",
  },
];

export default function ProjectsTypes() {
  const navigate = useNavigate();

  const handleClick = (project: projectTypeItem) => {
    navigate(`/projects/${project.path}`, { state: { project } });
  };

  return (
    <div className="category">
      <p className="category-header">Projects</p>
      <p className="category-desc">
        We are a leading provider of integrated automation and control
        solutions. Specializing in customized automation systems, the company
        serves diverse industries such as marine, oil and gas, and industrial
        sectors. Our offerings include advanced engineering services, innovative
        automation products, and comprehensive system integration solutions.
        With a focus on enhancing operational efficiency, we ensure safety and
        deliver cutting-edge technology tailored to meet specific client needs.
        With a commitment to quality and reliability, Belmacs stands out as a
        trusted partner for complex automation and control projects.
      </p>

      <div className="grid-container">
        {projectTypes.map((project) => (
          <div
            key={project.title} // Assuming title is unique for each category
            className={`grid-item ${project.title
              ?.toLowerCase()
              .replace(/ /g, "-")}`}
            onClick={() => handleClick(project)}
            style={{ cursor: "pointer" }}
          >
            <div className="overlay">{project.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
