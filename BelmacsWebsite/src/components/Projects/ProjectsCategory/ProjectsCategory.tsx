import "../../../assets/fonts.css";
import "./ProjectsCategory.css";
import "./ProjectsCategory-media.css";

import ResidentialImage from "../../../assets/Projects/Residential.png";
import CommercialImage from "../../../assets/Projects/Commercial.png";
import InstitutionalImage from "../../../assets/Projects/Institutional.png";
import ExisitingBuildingRetrofitImage from "../../../assets/Projects/Existing-Building-Retrofit.png";
import InfrastructureImage from "../../../assets/Projects/Infrastructure.png";
import IndustrialImage from "../../../assets/Projects/Industrial.png";

export default function ProjectsCategory() {
  return (
    <div className="category">
      <p className="category-header">Projects</p>
      <p className="category-desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <div className="grid-container">
        <div className="grid-item residential">
            <div className="overlay">Residential</div>
        </div>
        <div className="grid-item commercial">
            <div className="overlay">Commercial</div>
        </div>

        <div className="grid-item infrastructure">
            <div className="overlay">Infrastructure</div>
        </div>

        <div className="grid-item existing-building-retrofit">
            <div className="overlay">Existing Building Retrofit</div>
        </div>
        <div className="grid-item institutional">
            <div className="overlay">Institutional</div>
        </div>
        <div className="grid-item industrial">
            <div className="overlay">Industrial</div>
        </div>
      </div>
    </div>
    
  );
}
