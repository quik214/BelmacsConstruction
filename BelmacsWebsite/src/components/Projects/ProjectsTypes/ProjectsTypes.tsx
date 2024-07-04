import "../../../assets/fonts.css";
import "./ProjectsTypes.css";
import "./ProjectsTypes-media.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../../../firebase'; 
import { getDocs, collection } from "firebase/firestore";

export type projectTypeItem = {
  title?: string;
  image?: string;
  path?: string;
};

export default function ProjectsTypes() {
  const navigate = useNavigate();
  const [projectTypes, setProjectTypes] = useState<projectTypeItem[]>([]);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'project-types'));
        const types: projectTypeItem[] = [];
        querySnapshot.forEach((doc) => {
          types.push(doc.data() as projectTypeItem);
        });
        setProjectTypes(types);
      } catch (error) {
        console.error("Error fetching project types: ", error);
      }
    };

    fetchProjectTypes();
  }, []);

  const handleClick = (project: projectTypeItem) => {
    navigate(`/projects/${project.path}`, { state: { paramData: project } });
  };

  return (
    <div className="project-types">
      <p className="project-types-header">Projects</p>
      <p className="project-types-desc">
        We are a leading provider of integrated automation and control
        solutions. Specializing in customized automation systems, the company
        serves diverse industries such as marine, oil and gas, and industrial
        sectors. Our offerings include advanced engineering services, innovative
        automation products, and comprehensive system integration solutions.
        With a focus on enhancing operational efficiency, we ensure safety and
        deliver cutting-edge technology tailored to meet specific client needs.
        With a commitment to quality and reliability, Belmacs stands out as a
        trusted partner for complex automation and control projects.
      </p>

      <div className="project-types-grid-container">
        {projectTypes.map((type) => (
          <div
            key={type.title} // Assuming title is unique for each category
            className={`project-types-grid-item ${type.title?.toLowerCase().replace(/ /g, "-")}`}
            style={{ backgroundImage: `url(${type.image})` }}
            onClick={() => handleClick(type)}
          >
            <div className="title">{type.title}</div>
            <div className="overlay">
              <div className="box">
                <span>View</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
