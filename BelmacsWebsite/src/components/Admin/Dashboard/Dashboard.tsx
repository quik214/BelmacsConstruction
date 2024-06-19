import "./Dashboard.css";
import "./Dashboard-media.css";

import EditIcon from "../../../assets/Icons/AdminDashboard/pencil-simple.svg";
import DeleteIcon from "../../../assets/Icons/AdminDashboard/trash.svg";

import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Project object to store each Project's values
interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
  awards: { id: string; title: string }[];
  type: string;
  completion: string;
  client: string;
  location: string;
}

const Dashboard: React.FC = () => {
  // for displaying of Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [selectedType, setSelectedType] = useState<string>(() => {
    return localStorage.getItem("selectedType") || "residential";
  });

  // for navigation between pages
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

  // toast setup for project delete
  const deleteSuccessToast = (project: string) => {
    toast.success(
      <div>
        <b>{project}</b> has been deleted
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };

  // function to retrieve data from database
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const projectsCollectionRef = collection(
          db,
          `${selectedType}-projects`
        ); // assign variable collection of (projects) type
        const querySnapshot = await getDocs(projectsCollectionRef); // retrieve data from the selected (projects) type

        const data: Project[] = []; // create an empty Object array
        await Promise.all(
          querySnapshot.docs.map(
            async (doc: QueryDocumentSnapshot<DocumentData>) => {
              const projectData = doc.data(); // put data for selected project type inside projectData
              const awardsCollectionRef = collection(doc.ref, "awards"); // assign variable the sub-collection of awards from a project-document within a project type
              const awardsSnapshot = await getDocs(awardsCollectionRef); // retrieve awards based on (projects type) and (project - document)

              // for the creation of awards array
              const awards = awardsSnapshot.docs.map((awardDoc) => ({
                id: awardDoc.id, // award id
                title: awardDoc.data().title, // award title
              }));

              // combine all the data from main fields and awards into Project array
              data.push({
                id: doc.id,
                ...projectData,
                awards: awards,
              } as Project);
            }
          )
        );

        // sort based on descending order of date
        data.sort((a, b) => {
          const dateA: any = new Date(a.completion);
          const dateB: any = new Date(b.completion);
          return dateB - dateA;
        });

        // setProjects is used to push the projects in the (sorted) data variable into the Projects array created in line 36
        setProjects(data);
        setDisplayedProjects(data); // used for filtering
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchDataFromFirestore(); // retrieve from firebase firestore
  }, [selectedType]);

  // for search
  useEffect(() => {
    const filteredProjects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) // converts search field text to lowercase and project name to lowercase for easier searching
    );
    setDisplayedProjects(filteredProjects); // only display projects based on search field
  }, [projects, searchQuery]);

  // for handling project type change
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value; // set newType variable to be selected type from dropdown
    setSelectedType(newType); // change selectedType using setSelectedType
    localStorage.setItem("selectedType", newType); // set the localStorage to contain the selected project type
  };

  // navigate to edit page based on selected project id
  const handleEdit = (project: Project) => {
    navigate(`/admin/edit/${selectedType}/${project.id}`, {
      state: { paramData: project }, // push Project object to be stored in the next page's URL
    });
  };

  // handles delete function
  const handleDelete = (project: Project) => {
    setSelectedProject(project); // push selected Project data into selectedProject variable
    setShowDeleteConfirmation(true); // display delete pop up
  };

  const confirmDelete = async () => {
    if (!selectedType || !selectedProject) return; // ensure selectedType and selectedProject both exist (for below parts)
    try {
      // Delete firestore storage image
      const imageRef = ref(storage, selectedProject.image);
      await deleteObject(imageRef);

      // Delete subcollection 'awards' first
      const projectRef = doc(
        db,
        `${selectedType}-projects`,
        selectedProject.id
      ); // assign projectRef variable the Project document (within Firebase)
      const awardsCollectionRef = collection(projectRef, "awards"); // assign awardsCollectionRef the awards collection for the selected Project document
      const awardsSnapshot = await getDocs(awardsCollectionRef); // retrieve awards collection data based on awardsCollectionRef variable

      // function used to iterate through each award and delete each
      const deletePromises = awardsSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref); // delete each award
      });

      await Promise.all(deletePromises); // ensure all awards are deleted successfully, before moving on to code below
      // else, return

      // Delete firestore data using details in projectRef
      await deleteDoc(projectRef);

      // Update projects after deletion
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== selectedProject.id)
      );

      // Update displayedProjects after deletion
      setDisplayedProjects((prevDisplayedProjects) =>
        prevDisplayedProjects.filter(
          (project) => project.id !== selectedProject.id // filter a deleted project
        )
      );

      console.log("Project deleted:", selectedProject.id); // log the deleted project
      setShowDeleteConfirmation(false); // Hide the confirmation dialog after deletion

      deleteSuccessToast(selectedProject.name); // display toast
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
    navigate(`/admin/create/${selectedType}`),
      {
        state: { paramData: selectedType },
      }; // Navigate to AddProject component
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
                <td className="mobile-table">
                  <ul className="awards-list">
                    {projectItem.awards.map((award) => (
                      <li key={award.id}>{award.title}</li>
                    ))}
                  </ul>
                </td>
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
