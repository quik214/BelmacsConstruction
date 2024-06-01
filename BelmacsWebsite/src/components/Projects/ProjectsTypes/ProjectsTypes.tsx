import "../../../assets/fonts.css";
import "./ProjectsTypes.css";
import "./ProjectsTypes-media.css";

import { useNavigate } from "react-router-dom";

/* Hero Images to pass */
/* Only Residential image is good, the rest needs to change */
import ResidentialImage from "../../../assets/Projects/HeroImages/ResidentialHero.png";
import CommercialImage from "../../../assets/Projects/Grid-Images/Commercial.png";
import InstitutionalImage from "../../../assets/Projects/Grid-Images/Institutional.png";
import ExisitingBuildingRetrofitImage from "../../../assets/Projects/Grid-Images/Existing-Building-Retrofit.png";
import InfrastructureImage from "../../../assets/Projects/Grid-Images/Infrastructure.png";
import IndustrialImage from "../../../assets/Projects/Grid-Images/Industrial.png";

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
        {projectTypes.map((paramData) => (
          <div
            key={paramData.title} // Assuming title is unique for each category
            className={`grid-item ${paramData.title
              ?.toLowerCase()
              .replace(/ /g, "-")}`}
            onClick={() => handleClick(paramData)}
            style={{ cursor: "pointer" }}
          >
            <div className="overlay">{paramData.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
