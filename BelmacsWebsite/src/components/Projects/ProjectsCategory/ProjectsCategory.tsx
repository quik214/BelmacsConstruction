import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../../firebase';

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "residential-projects"));

  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

export default function ProjectsCategory() {
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setProjectData(data);
    }
    fetchData();
  }, []);

  return (
    <div className="projects">
      <h1 className="header">Fetch Data</h1>    

      <div>
        {projectData.map((project) => (
          <div key={project.id}>
            <img src={project.image} ></img>
            <p>{project.name}</p>
            <p>{project.developer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
