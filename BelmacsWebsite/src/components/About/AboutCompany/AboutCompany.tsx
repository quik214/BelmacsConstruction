import "../../../assets/fonts.css";
import "./AboutCompany.css";
import "./AboutCompany-media.css";

import AboutCompanyImage from "../../../assets/About/about-company.jpg";

export default function TheCompany() {
  return (
    <div className="company reveal">
      <div className="company-text">
        <p className="company-header">The Company</p>
        <p className="company-desc one">
          BELMACS Consulting Engineers was established in 1994, providing
          mechanical & electrical consulting engineering services. BELMACS
          provides a complete range of professional consultancy services for a
          wide variety of projects including offices, commercial, industrial,
          residential, hotels, institutional and additions & alterations of
          existing buildings.
        </p>
        <p className="company-desc two">
          We have a team of pro-active, dedicated and passionate professional
          engineers, engineers, designers who are able to provide solutions and
          add value to the projects and to our customers, in one way or another.
        </p>
      </div>
      <div className="company-img-ctr">
        <img src={AboutCompanyImage} className="company-img"></img>
      </div>
    </div>
  );
}
