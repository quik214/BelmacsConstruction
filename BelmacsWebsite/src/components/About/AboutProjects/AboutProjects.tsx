import "./AboutProjects.css";
import "./AboutProjects-media.css";

import VisionImage from "../../../assets/About/about-vision.jpg";
import MissionImage from "../../../assets/About/about-mission.jpg";

export default function AboutProjects() {
  return (
    <div className="projects reveal">
      <p className="projects-header">Our Projects</p>
      <div className="flex-container">
        <div className="card">
          <img className="card-img" src="../buildings/tapestry.png" />
          <div className="card-text-container">
            <p className="card-header">The Tapestry</p>
            <div className="card-desc-container">
              <p className="card-desc">Private Condominium (861 Units)</p>
            </div>
          </div>
        </div>
        <div className="card">
          <img className="card-img" src="../buildings/tapestry.png" />
          <div className="card-text-container">
            <p className="card-header">Grandeur Park Residences</p>
            <div className="card-desc-container">
              <p className="card-desc">Bedok South Avenue 3, Singapore</p>
            </div>
          </div>
        </div>
        <div className="card">
          <img className="card-img" src="../buildings/tapestry.png" />
          <div className="card-text-container">
            <p className="card-header">The Asana</p>
            <div className="card-desc-container">
              <p className="card-desc">Queen’s Road, Singapore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
