import "./ProjectsIndividual.css";


import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useLocation } from "react-router-dom";

import Hero from "../../Hero/Hero";

interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
  awards: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]); // create a useState hook, where we have a variable projects and a function that updates the variable
  // currently, projects is set to be an empty array of Project objects
  const { type } = useParams<{ type: string }>(); // captures the part of the URL after the last /
  const location = useLocation();

  const { paramData } = location.state || {}; // Destructure paramData from location.state

  useEffect(() => {
    const fetchDataFromFirestore = async () => {

      if (!type) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, `${type}-projects`) // get the documents from the Firestore collection with the name of (type)-projects
        );
        // console.log(category + "-projects");
        const data: Project[] = []; // empty array to hold each project's data
        querySnapshot.forEach((doc) => { // iterate over each project and its data (in the Firebase collection), assign it to doc
          const docData = doc.data(); // assign the data to a variable
          data.push({ id: doc.id, ...docData } as Project); // push everything from docData to the data array (from id, to the last piece of data)
        });
        setProjects(data); // update projects state with the fetched data
      } catch (error) {
        console.error("Error fetching projects: ", error); // if there is error, log to console
      }
    };

    fetchDataFromFirestore();
  }, [type]); // whenever there is a change to type (which is the current project type), the entirety of the above code will re-run

  return (
    <div className="projects-individual">
      <Hero
        imageUrl={paramData.image}
        heroText={paramData.title + " Projects"}
      />
      <div>
        {projects.map((projectItem) => (
          <div key={projectItem.id}>
            <img src={projectItem.image} alt={projectItem.name} />
            <p>{projectItem.name}</p>
            <p>{projectItem.developer}</p>
            <p className="awards">
              {projectItem.awards.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
