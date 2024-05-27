import "../../../assets/fonts.css";
import "./AboutBizSafe.css";
import "./AboutBizSafe-media.css";

import ConstructionWorker from "../../../assets/About/AboutBizSafe/construction-worker.jpg";
import BizSafeLogo from "../../../assets/About/AboutBizSafe/bizsafe.png";

export default function TheCompany() {
    return (
        <div className="bizsafe reveal">
            <div className="bizsafe-container">
                <div className="bizsafe-image-container">
                    <img className="bizsafe-image" src={ConstructionWorker} />
                </div>
                <div className="bizsafe-text">
                    <p className="bizsafe-text">
                    We aim to promote a proactive WSH policy based on effective
                    communication, systematic identification, assessment and control
                    of hazards/procedures.
                    </p>

                    <p className="bizsafe-text">
                    We are committed and will develop security programmes to include
                    terrorism protection. We will also work together with our clients,
                    fellow consultants, contractors and suppliers to embrace the
                    SGSecure movement.
                    </p>

                    <img className="bizsafe-logo" src={BizSafeLogo} />
                </div>
            </div>
        </div>
    );
  }