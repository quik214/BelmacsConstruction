import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../../firebase';

interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
}

async function fetchDataFromFirestore(): Promise<Project[]> {
  const querySnapshot = await getDocs(collection(db, "residential-projects"));
  const data: Project[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    data.push({ id: doc.id, ...docData } as Project);
  });
  return data;
}

const ProjectsCategory: React.FC = () => {
  const [projectData, setProjectData] = useState<Project[]>([]);

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
            <img src={project.image} alt={project.name} />
            <p>{project.name}</p>
            <p>{project.developer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsCategory;