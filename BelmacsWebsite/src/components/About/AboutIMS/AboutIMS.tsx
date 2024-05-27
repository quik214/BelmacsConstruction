import "../../../assets/fonts.css";
import "./AboutIMS.css";
import "./AboutIMS-media.css";

import AboutImsImageOne from "../../../assets/About/AboutIMS/about-ims-one.png";
import AboutImsImageThree from "../../../assets/About/AboutIMS/about-ims-three.png";
import AboutImsImageFive from "../../../assets/About/AboutIMS/about-ims-five.png";

export default function AboutIMS() {
  return (
    <div className="ims reveal">
      <div className="ims-text">
        <p className="ims-header">Our IMS Policy</p>
        <p className="ims-desc one">
          The Management and Staff of BELMACS Pte Ltd are fully committed to provide professional,
          value-added designs that meet international quality and environmental management system
          standards for M&E services to achieve Total Customer Satisfaction and green environment.
        </p>
        <p className="ims-desc two">
          We shall strive to improve ourselves and the effectiveness of our Integrated Management
          System continually to uphold this IMS policy in our respective areas of work to meet the
          requirementsof our Clients, the regulatory authorities and the built environment. We are
          committed to prevention of environmental pollution and compliance to all applicable environmental
          legislations and requirements to which we subscribe.
        </p>
      </div>
      <div className="ims-img-ctr">
        <div className="ims-image one">
          <img src={AboutImsImageOne} className="ims-img-one"></img>
        </div>
        <div className="ims-image three">
          <img src={AboutImsImageThree} className="ims-img-three"></img>
        </div>
        <div className="ims-image five">
          <img src={AboutImsImageFive} className="ims-img-five"></img>
        </div>
      </div>
    </div>
  );
}
