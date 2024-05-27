import "../../../assets/fonts.css";
import "./AboutPeople.css";
import "./AboutPeople-media.css";

import AboutPeopleCHIN from "../../../assets/About/AboutPeople/CHIN-Yeu-Tong.jpg";
import AboutPeopleTAN from "../../../assets/About/AboutPeople/TAN-Yan-Kiat.jpg";
import AboutPeopleWONG from "../../../assets/About/AboutPeople/WONG-Yit-Hong-Benny.jpg";
import AboutPeopleCHAU from "../../../assets/About/AboutPeople/CHAU-Yong-Foo.jpg";

export default function AboutPeople() {
  return (
    <div className="people reveal">
      <p className="people-header">Our People</p>
      <div className="people-card-container">
        <div className="people-card">
          <img src={AboutPeopleCHIN} />
          <div className="people-card-info">
            <p className="people-name">Er. Chin Yeu Tong</p>
            <p className="people-role">Managing Director</p>
          </div>
        </div>
        <div className="people-card">
          <img src={AboutPeopleTAN} />
          <div className="people-card-info">
            <p className="people-name">Er. Tan Yan Kiat</p>
            <p className="people-role">Founder & Director</p>
          </div>
        </div>
        <div className="people-card">
          <img src={AboutPeopleWONG} />
          <div className="people-card-info">
            <p className="people-name">Er. Wong Yit Hong</p>
            <p className="people-role">Director</p>
          </div>
        </div>
        <div className="people-card">
          <img src={AboutPeopleCHAU} />
          <div className="people-card-info">
            <p className="people-name">Er. Chau Yong Foo</p>
            <p className="people-role">Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
