import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../firebase";

import './AboutAchievements.css';
import './AboutAchievements-media.css';

import buildingLogo from "../../../assets/Icons/AboutAchievements/building-office.svg";
import hatLogo from "../../../assets/Icons/AboutAchievements/hard-hat.svg";
import usersLogo from "../../../assets/Icons/AboutAchievements/users-three.svg";
import certificateLogo from "../../../assets/Icons/AboutAchievements/certificate.svg";


interface Award {
  id: string;
  title: string;
}

interface Project {
  id: string;
  type: string; // To store the type of project
  awards: Award[];
  // Add other project fields here if needed
}

const AboutAchievements = () => {
  const [totalAwards, setTotalAwards] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const projectTypes = [
          "residential",
          "commercial",
          "existingBuildingRetrofit",
          "institutional",
          "infrastructure",
          "industrial",
        ]; // Define project types
        let awardsCount = 0; // Initialize the counter for total awards
        let projectsCount = 0; // Initialize the counter for total projects
        const allProjects: Project[] = []; // Create an empty array to hold all projects

        for (const type of projectTypes) {
          const projectsCollectionRef = collection(db, `${type}-projects`); // Get collection reference for each type
          const querySnapshot = await getDocs(projectsCollectionRef); // Retrieve data for each type

          projectsCount += querySnapshot.size; // Increment the project count by the number of documents retrieved

          await Promise.all(
            querySnapshot.docs.map(
              async (doc: QueryDocumentSnapshot<DocumentData>) => {
                const projectData = doc.data(); // Get project data
                const awardsCollectionRef = collection(doc.ref, "awards"); // Get awards collection reference
                const awardsSnapshot = await getDocs(awardsCollectionRef); // Retrieve awards data

                // Create an awards array
                const awards = awardsSnapshot.docs.map((awardDoc) => ({
                  id: awardDoc.id, // award id
                  title: awardDoc.data().title, // award title
                }));

                // Increment the awards count by the number of awards
                awardsCount += awards.length;

                // Combine project data and awards into the project array
                allProjects.push({
                  id: doc.id,
                  type: type, // Add the project type to the project data
                  ...projectData,
                  awards: awards,
                } as Project);
              }
            )
          );
        }

        // Calculate years of experience
        const currentYear = new Date().getFullYear();
        const startYear = 1994;
        const experience = currentYear - startYear;

        // Update state with total awards, projects, years of experience, and all projects data
        setTotalAwards(awardsCount);
        setTotalProjects(projectsCount);
        setYearsOfExperience(experience);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  return (
    <div className="achievements-container reveal">
      <div className="achievements-header">
        Our Achievements
      </div>
      <div className="achievements">
        <div className="achievement">
          <img className="icon" src={hatLogo}></img>
          <div className="info">
            <h3>1994</h3>
            <p>Year Established</p>
          </div>
        </div>
        <div className="achievement">
          <img className="icon" src={hatLogo}></img>
          <div className="info">
            <h3>{yearsOfExperience} years</h3>
            <p>of Experience</p>
          </div>
        </div>
        <div className="achievement">
          <img className="icon" src={buildingLogo}></img>
          <div className="info">
            <h3>{totalProjects}</h3>
            <p>Number of Projects</p>
          </div>
        </div>
        <div className="achievement">
          <img className="icon" src={certificateLogo}></img>
          <div className="info">
            <h3>{totalAwards}</h3>
            <p>Awards Won</p>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default AboutAchievements;
