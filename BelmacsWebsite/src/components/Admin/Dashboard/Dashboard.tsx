import "./Dashboard.css";
import "./Dashboard-media.css";

import EditIcon from "../../../assets/Icons/AdminDashboard/pencil-simple.svg";
import DeleteIcon from "../../../assets/Icons/AdminDashboard/trash.svg";

import React, { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";



interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
  awards: string;
  type: string;
  completion: string;
  client: string;
  location: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [selectedType, setSelectedType] = useState<string>("residential");

  const navigate = useNavigate();

  // for search
  const [searchQuery, setSearchQuery] = useState(""); // Add search query state

  

  // for delete
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      if (!selectedType) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, `${selectedType}-projects`)
        );

        const data: Project[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData } as Project);
        });

        data.sort((a, b) => {
          const dateA: any = new Date(a.completion);
          const dateB: any = new Date(b.completion);
          return dateB - dateA;
        });

        setProjects(data);
        setDisplayedProjects(data);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchDataFromFirestore();
  }, [selectedType]);

  // for search

  useEffect(() => {
    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedProjects(filteredProjects);
  }, [projects, searchQuery]);

  useEffect(() => {
    setDisplayedProjects(projects);
  }, [projects]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const handleEdit = (project: Project) => {
    navigate(`/admin/edit/${selectedType}/${project.id}`, {
      state: { paramData: project },
    });
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!selectedType || !selectedProject) return;
    try {
      // Delete firestore storage image
      const oldImageRef = ref(storage, selectedProject.image);

      // Delete the old image if necessary
      await deleteObject(oldImageRef);

      // Delete firestore data
      await deleteDoc(doc(db, `${selectedType}-projects`, selectedProject.id));
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== selectedProject.id)
      );
      setDisplayedProjects((prevDisplayedProjects) =>
        prevDisplayedProjects.filter(
          (project) => project.id !== selectedProject.id
        )
      );
      console.log("Project deleted:", selectedProject.id);
      setShowDeleteConfirmation(false); // Hide the confirmation dialog after deletion
      setNotification({
        message: selectedProject.name + " deleted successfully",
        type: "success",
      }); // Show success notification
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    } catch (error) {
      console.error("Error deleting project:", error);
      setShowDeleteConfirmation(false); // Hide the confirmation dialog on error
      setNotification({
        message: "Error deleting " + selectedProject.name,
        type: "error",
      }); // Show error notification
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    }
  };

  const handleAddProject = () => {
    navigate("/admin/create"); // Navigate to AddProject component
  };

  // for search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="dashboard-ctr">
      <div className="dashboard-header">Projects</div>
      <div className="dropdown-ctr">
        <label htmlFor="project-type" className="select-project-type">
          Select Project Type{" "}
        </label>
        <select
          id="project-type"
          value={selectedType}
          onChange={handleTypeChange}
        >
          {/* <option value="">--Select Type--</option> */}

          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="existingBuildingRetrofit">
            Exisiting Building Retrofit
          </option>
          <option value="institutional">Institutional</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="industrial">Industrial</option>
        </select>
      </div>
      <label htmlFor="search" className="search">
        Search
      </label>
      <div className="search-ctr">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="add-project-ctr">
        <button className="add-project-button" onClick={handleAddProject}>
          Add Project
        </button>
      </div>

      <div className="dashboard-table-ctr">
        <table className="project-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              {selectedType !== "existingBuildingRetrofit" && (
                <th className="mobile-table">Developer</th>
              )}
              <th className="mobile-table">Awards</th>
              <th className="mobile-table">Type</th>
              <th className="mobile-table">Completion</th>
              {selectedType === "existingBuildingRetrofit" && (
                <th className="mobile-table">Client</th>
              )}
              <th className="mobile-table">Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProjects.map((projectItem) => (
              <tr key={projectItem.id}>
                <td>
                  <img
                    src={projectItem.image}
                    alt={projectItem.name + " image"}
                    className="project-image"
                  />
                </td>
                <td>{projectItem.name}</td>
                {selectedType !== "existingBuildingRetrofit" && (
                  <td className="mobile-table">{projectItem.developer}</td>
                )}
                <td className="mobile-table">{projectItem.awards}</td>
                <td className="mobile-table">{projectItem.type}</td>
                <td className="mobile-table">{projectItem.completion}</td>
                {selectedType === "existingBuildingRetrofit" && (
                  <td className="mobile-table">{projectItem.client}</td>
                )}
                <td className="mobile-table">{projectItem.location}</td>
                <td className="table-actions">
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEdit(projectItem)}
                  >
                    <img src={EditIcon} className="action-icons" />
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(projectItem)}
                  >
                    <img src={DeleteIcon} className="action-icons" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteConfirmation && selectedProject && (
        <>
          <div className="delete-overlay"></div>
          <div className="delete-confirmation-popup">
            <div className="delete-confirmation-ctr">
              <div className="delete-confirmation-header">Are you sure?</div>
              <div className="delete-confirmation-description">
                Are you sure you want to delete{" "}
                <span style={{ color: "#364FC7" }}>
                  {selectedProject.name}?
                </span>{" "}
                This action cannot be undone.
              </div>

              <div className="button-container">
                <button
                  className="popup-cancel-btn"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
                <button className="popup-confirm-btn" onClick={confirmDelete}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification-btm-right ${notification.type}`}>
          {notification.message}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
