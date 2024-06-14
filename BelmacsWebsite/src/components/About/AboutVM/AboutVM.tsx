import "./AboutVM.css";
import "./AboutVM-media.css";

import VisionImage from "../../../assets/About/AboutVM/about-vision.jpg";
import MissionImage from "../../../assets/About/AboutVM/about-mission.jpg";

export default function AboutVM() {
  return (
    <div className="vision-mission reveal">
      <div className="vision">
        <div className="vision-img-ctr">
          <img src={VisionImage} className="vision-img"></img>
        </div>
        <div className="vision-text">
          <p className="vision-header reveal">Our Vision</p>
          <p className="vision-desc reveal">
            To be one of the leading M&E consulting engineers in Singapore
          </p>
        </div>
      </div>
      <div className="mission ">
        <div className="mission-img-ctr">
          <img src={MissionImage} className="mission-img"></img>
        </div>
        <div className="mission-text">
          <p className="mission-header reveal">Our Mission</p>
          <p className="mission-desc reveal">
            To provide professional, value-added designs that meet international
            quality and environmental management standards
          </p>
        </div>
      </div>
    </div>
  );
}
