import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useLocation } from "react-router-dom";

interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { category } = useParams<{ category: string }>(); // Adjust the parameter name if needed
  const location = useLocation();
  const { project } = location.state || {};
  console.log(location.state);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, category + "-projects")
        );
        console.log(category + "-projects");
        const data: Project[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData } as Project);
        });
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchDataFromFirestore();
  }, [category]);
  return (
    <div className="projects">
      <h1 className="header">{project.title}</h1>
      <div>
        {projects.map((project) => (
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

export default ProjectList;
