import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useLocation } from "react-router-dom";

import ProjectsHero from "../ProjectsHero/ProjectsHero";

interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const { paramData } = location.state || {}; // Destructure paramData from location.state

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      if (!category) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, `${category}-projects`)
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
    <div className="projects-individual">
      <ProjectsHero
        imageUrl={paramData.image}
        heroText={paramData.title + " Projects"}
      />
      <div>
        {projects.map((projectItem) => (
          <div key={projectItem.id}>
            <img src={projectItem.image} alt={projectItem.name} />
            <p>{projectItem.name}</p>
            <p>{projectItem.developer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
