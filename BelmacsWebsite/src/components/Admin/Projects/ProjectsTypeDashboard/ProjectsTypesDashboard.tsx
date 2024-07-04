import "./ProjectsTypesDashboard.css";
import "./ProjectsTypesDashboard-media.css";

import EditIcon from "../../../../assets/Icons/AdminDashboard/pencil-simple.svg";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useNavigate } from "react-router-dom";

// About object to store each ProjectTypes's values
interface ProjectType {
  title: string;
  image: string;
  path: string;
  type: string;
}

const ProjectType: React.FC = () => {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const collectionRef = collection(db, "project-types");
        const querySnapshot = await getDocs(collectionRef);

        // Map through documents and extract data
        const data: ProjectType[] = querySnapshot.docs.map(doc => ({
          id: doc.id, // Add document ID
          ...doc.data() as ProjectType
        }));

        setProjectTypes(data);
      } catch (error) {
        console.error("Error fetching Project Types: ", error);
      }
    };

    fetchDataFromFirestore();
  }, []); // Empty dependency array to run once on component mount

  const handleEditImage = (project: ProjectType) => {
    navigate("/admin/project-types/edit", {
      state: { paramData: project }
    });
  };

  return (
    <div className="projectTypes-ctr">
      <div className="projectTypes-header">Project Category Images</div>

      <div className="projectTypes-table-ctr">
        {projectTypes.length > 0 ? (
          <table className="projectTypes-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Image</th>
                <th className="mobile-table">Image Orientation </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectTypes.map((project, index) => (
                <tr key={project.title}>
                                      <td>
                    <p>
                      {project.title}
                    </p>
                  </td>
                  <td>
                    <img
                      src={project.image}
                      alt={`Project Type ${index}`}
                      className="projectTypes-image"
                    />
                  </td>
                  <td className="mobile-table">
                    <p>
                      {project.type}
                    </p>
                  </td>

                  <td className="table-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditImage(project)}
                    >
                      <img src={EditIcon} alt="Edit" className="action-icons" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No project types found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectType;
