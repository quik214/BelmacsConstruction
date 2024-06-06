import "../../../assets/fonts.css";
import "./ProjectsTypes.css";
import "./ProjectsTypes-media.css";

import { useNavigate } from "react-router-dom";

/* Hero Images to pass */
/* Only Residential image is good, the rest needs to change */
import ResidentialImage from "../../../assets/Projects/HeroImages/ResidentialHero.jpg";
import CommercialImage from "../../../assets/Projects/HeroImages/CommercialHero.jpg";
import InstitutionalImage from "../../../assets/Projects/HeroImages/InstitutionalHero.jpg";
import ExisitingBuildingRetrofitImage from "../../../assets/Projects/HeroImages/ExistingBuildingHero.jpg";
import InfrastructureImage from "../../../assets/Projects/HeroImages/InfrastructureHero.jpg";
import IndustrialImage from "../../../assets/Projects/HeroImages/IndustrialHero.jpg";



export type projectTypeItem = {
  title?: string;
  image?: string;
  path?: string;
};

export const projectTypes: projectTypeItem[] = [
  {
    title: "Residential",
    image: ResidentialImage,
    path: "residential",
  },
  {
    title: "Commercial",
    image: CommercialImage,
    path: "commercial",
  },
  {
    title: "Infrastructure",
    image: InfrastructureImage,
    path: "infrastructure",
  },
  {
    title: "Existing Building Retrofit",
    image: ExisitingBuildingRetrofitImage,
    path: "existingBuildingRetrofit",
  },
  {
    title: "Institutional",
    image: InstitutionalImage,
    path: "institutional",
  },
  {
    title: "Industrial",
    image: IndustrialImage,
    path: "industrial",
  },
];

export default function ProjectsTypes() {
  const navigate = useNavigate();

  const handleClick = (project: projectTypeItem) => {
    navigate(`/projects/${project.path}`, { state: { paramData: project } });

  };

  return (
    <div className="project-types">
      <p className="project-types-header">Projects</p>
      <p className="project-types-desc">
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

      <div className="project-types-grid-container">
        {projectTypes.map((type) => (
          <div
            key={type.title} // Assuming title is unique for each category
            // make sure css works correctly
            className={`project-types-grid-item ${type.title
              ?.toLowerCase()
              .replace(/ /g, "-")}`}
            onClick={() => handleClick(type)}
            style={{ cursor: "pointer" }}
          >
            <div className="overlay">{type.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
