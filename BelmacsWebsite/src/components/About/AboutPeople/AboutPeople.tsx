import React, { useState } from "react";
import "../../../assets/fonts.css";
import "./AboutPeople.css";
import "./AboutPeople-media.css";

import AboutPeopleCHIN from "../../../assets/About/AboutPeople/CHIN-Yeu-Tong.jpg";
import AboutPeopleTAN from "../../../assets/About/AboutPeople/TAN-Yan-Kiat.jpg";
import AboutPeopleWONG from "../../../assets/About/AboutPeople/WONG-Yit-Hong-Benny.jpg";
import AboutPeopleCHAU from "../../../assets/About/AboutPeople/CHAU-Yong-Foo.jpg";

interface Person {
  img: string;
  name: string;
  role: string;
  qualifications: string;
  description: string;
}

const People: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const people: Person[] = [
    {
      img: AboutPeopleCHIN,
      name: "Er. Chin Yeu Tong",
      role: "Managing Director",
      qualifications: "- Bachelors in Mechanical Engineering \n - Professional Engineer \n - Certified GMFP",
      description: `Er. CHIN Yeu Tong graduated with a Bachelor of Engineering (Mechanical) from Nanyang Technological University in 1995. He is a registered Professional Engineer in Singapore since 2012. He is also a BCA Certified Green Mark Facilities Professional.
      \n Yeu Tong has more than 20 years of experience in various sectors of building construction industry in Singapore and overseas.
      \n He started his career in 1995 as an engineer in Beca Carter Hollings & Ferner and had worked on numerous major retrofitting projects including Paragon Shopping Centre, National Blood Centre, Orchard Hotel, Royal Holiday Inn and Amenity Block. He had also completed Saigon Metropolitan, a prestigious office tower in Ho Chi Minh City; Laguna 88 condominium and The Loft at Nassim Road condominium.
      \n In 2001, Yeu Tong left to join Meinhardt and had worked on numerous mega-size projects. He was made a Director of the company in 2010.
      \n The most notable project completed by him is Resorts World at Sentosa which is the first Integrated Resorts in Singapore. He was the Deputy Project Director who started the project from planning stage in 2005 till full completion of the Resorts in 2012. Other significant projects handled and completed by him include District Cooling Plant at Sentosa which equipped the largest capacity chiller in Singapore; One Raffles Quay which is one of the tallest office building in Singapore; Marina Bay Suite which is a prestigious super high-rise condominium in urban area; Circle Line and Downtown Line MRT stations; SIM University; Yale-NUS College; MGM Grand Hotel in Vietnam which is the first MGM flagship casino resorts in South-East Asia; Burj-Dubai Mall Hotel in Dubai; Dubai Marina Mall mixed development consists of retails, Hotel and Service Apartment in Dubai; Capital Plaza Mixed Development in Abu Dhabiwhich was the tallest building in there at that time.
      \n Yeu Tong joined BELMACS in August 2013 as Director.
      \n He was promoted to Managing Director in 2020.`,
    },
    {
      img: AboutPeopleTAN,
      name: "Er. Tan Yan Kiat",
      role: "Founder & Director",
      qualifications: "- Bachelors in Mechanical Engineering \n - Professional Engineer \n - Senior Member, Institution of Engineers, Singapore (Sr. MIES) \n - Member of the American Society of Heating, Refrigerating and Air-Conditioning Engineers (MASHRAE) \n - Registered Inspector (M&E)",
      description: `Er. TAN Yan Kiat graduated with a Bachelor of Engineering (Mechanical) from the University of Singapore in 1979. Upon graduation, he joined Rankine & Hill Consulting Engineers as an Engineer and managed projects such as The Paramount Hotel / Shopping Centre, Excelsior Hotel / Shopping Centre and the Tampines Telephone Exchange. Subsequently, he obtained his Professional Engineer in 1983.
      \n In 1984, Yan Kiat left to join J. Roger Preston & Partners and had worked on numerous projects spanning over a wide sector of the building industry. Some of the more significant projects are The Gateway, UOB Plaza, 396 Alexandra Road (formerly known as BP Tower), AIA Tower, AIA Changi and Mt. Elizabeth Medical Centre. In 1992, he was made a Partner of the local practice as well as a Director in J. Roger Preston & Partners Pte Ltd, a company responsible outside Singapore.
      \n Yan Kiat is personally involved in the development of Fire Life Safety System in high-rise buildings, in particularly UOB Plaza, a 66-storey 250m high-rise office building. He was invited by IES to present a paper on FLSS in UOB Plaza in 1986. Yan Kiat became a M&E Registered Inspector in 1994. In the same year, he co-founded BELMACS Consulting Engineers and held the position of Partner. The practice was incorporated to BELMACS Pte Ltd in 2006 and he has since held the position of Managing Director.
      \n Yan Kiat was involved in the design of several commercial and residential projects such as Tampines Junction, Sun Plaza, Citylights and Belmond Green. As a Registered Inspector, Yan Kiat is noted for his role in mega projects such as Suntec City, One Raffles Quay and Resorts World Sentosa.`
    },
    { 
      img: AboutPeopleWONG,
      name: "Er. Wong Yit Hong",
      role: "Director",
      qualifications: "- Bachelors in Mechanical Engineering \n - Professional Engineer \n - Member, Institution of Engineers, Singapore (MIES) \n - Member of the American Society of Heating, Refrigerating and Air-Conditioning Engineers (MASHRAE) \n - Design for Safety Coordinator (DfSC)",
      description: `Er. Benny WONG received his Bachelor of Engineering (Mechanical) from Nanyang Technological University in 1992. He is a registered Professional Engineer since 2013 and a registered Specialist Professional Engineer in Lift & Escalator.
      \n Benny has more than 22 years of experience in the Building and Construction Industry both in Singapore and Overseas. He started his engineering career with Wormald Fire Systems as a Design / Project engineer working on projects including SIA Hangar 2, CAAS Cargo Agents Buildings and BP Tower.
      \n In 1994, Benny joined Bescon Consulting Engineers Pte of which he designed and commissioned buildings ranging from condominiums, mixed developments, IT-related product manufacturing plant and also a Class 1 Aircraft Hangar Complex with Annex / Lounge Building in Brunei.
      \n Benny then joined Meinhardt in 2001 where he was the Job Captain for One Raffles Quay office development, a role involving leading a team of engineers and coordinating with various stakeholders.
      \n To further enhance his project management skills, Benny joined Rider Levett Bucknall in 2002 as a Project Manager and completed landmark projects such as the National Library Building and Singapore Flyer.
      \n From 2008 to 2011, Benny took on the challenge to re-join Meinhardt as Deputy Chief Resident Engineer for the mega project - Resorts World at Sentosa. He had thus overseen the successful completion of the Casino / Hotels / Ballrooms, S.E.A. Aquarium and Adventure Cove Waterpark.
      \n In 2012, Benny joined CapitaLand to oversee the construction of d'Leedon, a condominium with 1,703 units and 12 exclusive semi-detached houses, and the 509-unit Sky Habitat condominium. Both condominiums were designed by internationally-renowned Architects.
      \n Benny joined BELMACS in August 2015 as Director.`
    },
    { 
      img: AboutPeopleCHAU,
      name: "Er. Chau Yong Foo",
      role: "Director",
      qualifications: "- Bachelors in Mechanical Engineering \n - Professional Engineer \n - Singapore Certified Energy Manager (SCEM) \n - ASEAN Chartered Professional Engineer (ACPE) \n - Design for Safety Professionals (DfSP)",
      description: `Er. CHAU Yong Foo received his Bachelor of Engineering (Electrical) degree from National University of Singapore in 2006. He is a registered Professional Engineer (Electrical) and ASEAN Chartered Professional Engineer since 2014 and 2017 respectively. He is also registered as Singapore Certified Energy Manager (SCEM) and Design for Safety Professional (DFSP) since year 2014 and 2018 respectively.
      \n Yong Foo started his career as process engineer in the Semiconductor Manufacturing Industry before entering the construction industry as a M&E consulting engineer in his previous employment. Yong Foo has more than 10 years of extensive experience in the building construction industry ranging from residential, commercial and industrial buildings. The projects under his care includes the design and implementation of Keppel District Cooling Plant at Mediapolis, Hotel Indigo at Xiamen, major addition and alternations at UOB Plaza and Alexandra. Other greenfield projects includes a Comestic Factory for Bestworld at Jurong and Samwoh Smart Hub Office cum Factory in Kranji.`
    },
  ];

  const handleCardClick = (person: Person) => {
    setSelectedPerson(person);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPerson(null);
  };

  return (
    <>
      <div className="people reveal">
        <p className="people-header">Our People</p>
        <div className="people-card-container">
          {people.map((person, index) => (
            <div
              key={index}
              className="people-card"
              onClick={() => handleCardClick(person)}
            >
              <img src={person.img} alt={person.name} />
              <div className="people-card-info">
                <p className="people-name">{person.name}</p>
                <p className="people-role">{person.role}</p>
              </div>
              <div className="people-card-read-more">Click to read more</div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && selectedPerson && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closePopup}>
              &times;
            </span>
            <div className="popup-content-header">
              <img src={selectedPerson.img} alt={selectedPerson.name} />
              <div className="popup-content-info">
                <p className="popup-name">{selectedPerson.name}</p>
                <p className="popup-role">{selectedPerson.role}</p>
                <p className="popup-qualifications">{selectedPerson.qualifications}</p>
              </div>
            </div>
            <p className="popup-description">{selectedPerson.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default People;