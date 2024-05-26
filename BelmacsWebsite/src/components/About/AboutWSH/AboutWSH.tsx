import "../../../assets/fonts.css";
import "./AboutWSH.css";
import "./AboutWSH-media.css";

import ComplianceLogo from "../../../assets/Icons/AboutWSH/note-pencil-blue.svg";
import PreventionLogo from "../../../assets/Icons/AboutWSH/hand-palm-blue.svg";
import EducationLogo from "../../../assets/Icons/AboutWSH/chalkboard-teacher-blue.svg";

export default function AboutWSH() {
  return (
    <div className="wsh reveal">
      <div className="wsh-text">
          <p className="wsh-header">Our Workplace Safety and Health Policy</p>
      </div>

      <div className="wsh-card-container">
        <div className="wsh-card one">
          <div className="wsh-card-background-one">
            <div className="wsh-card-text">
              <img className="wsh-logo" src={ComplianceLogo} />
              <p className="wsh-card-title">Compliance</p>  
              <p className="wsh-card-desc">Compliance with applicable legislation</p>
            </div>
          </div>
        </div>
        <div className="wsh-card two">
          <div className="wsh-card-background-two">
            <div className="wsh-card-text">
              <img className="wsh-logo" src={PreventionLogo} />
              <p className="wsh-card-title">Prevention</p>
              <p className="wsh-card-desc">Adopting the best practices and continuously improving health and safety standards to prevent injury and ill health</p>
            </div>
          </div>
        </div>
        <div className="wsh-card three">
          <div className="wsh-card-background-three">
            <div className="wsh-card-text">
              <img className="wsh-logo" src={EducationLogo} />
              <p className="wsh-card-title">Education</p>
              <p className="wsh-card-desc">Educating and training our employees on the importance of safety and health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
