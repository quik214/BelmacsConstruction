import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "../../../assets/fonts.css";

import "./AboutPeople.css";
import "./AboutPeople-media.css";

interface Person {
  name: string;
  image: string;
  position: string;
  qualifications: string[];
  description: string;
}

const People: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchPeople = async () => {
      const querySnapshot = await getDocs(collection(db, "about-people"));
      const peopleData = querySnapshot.docs.map((doc) => doc.data() as Person);

      // Define the sort order
      const sortOrder = [
        "Managing Director",
        "Founder and Director",
        "Director",
      ];

      // Sort people by role based on the sort order
      peopleData.sort((a, b) => {
        const indexA = sortOrder.indexOf(a.position);
        const indexB = sortOrder.indexOf(b.position);

        // Positions not in the sort order should get a very high index so that they will be at the back of the list
        const maxIndex = sortOrder.length;
        const effectiveIndexA = indexA === -1 ? maxIndex : indexA;
        const effectiveIndexB = indexB === -1 ? maxIndex : indexB;

        return effectiveIndexA - effectiveIndexB;
      });
      setPeople(peopleData);
    };

    fetchPeople();
  }, []);

  const handleCardClick = (person: Person) => {
    setSelectedPerson(person);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPerson(null);
  };

  const peopleCount = people.length;

  return (
    <>
      <div className="people reveal">
        <p className="people-header">Our People</p>
        <div
          className={`people-grid-container ${
            peopleCount === 5
              ? "five"
              : peopleCount === 6
              ? "six"
              : peopleCount === 7
              ? "seven"
              : peopleCount >= 8
              ? "eight"
              : "default"
          }`}
        >
          {people.map((person, index) => (
            <div
              key={index}
              className={`people-card ${
                peopleCount === 7 ? "seven" : "default"
              }`}
              onClick={() => handleCardClick(person)}
              aria-label={`View details for ${person.name}`}
              role="button"
            >
              <img src={person.image} alt={person.name} />
              <div className="people-card-info">
                <p className="people-name">{person.name}</p>
                <p className="people-role">{person.position}</p>
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
              <img src={selectedPerson.image} alt={selectedPerson.name} />
              <div className="popup-content-info">
                <p className="popup-name">{selectedPerson.name}</p>
                <p className="popup-role">{selectedPerson.position}</p>
                <p className="popup-qualifications">
                  {selectedPerson.qualifications.map((qualification, index) => (
                    <span key={index}>
                      - {qualification}
                      <br />
                    </span>
                  ))}
                </p>
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
