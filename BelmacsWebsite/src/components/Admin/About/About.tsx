import "./About.css";
import "./About-media.css";

import EditIcon from "../../../assets/Icons/AdminDashboard/pencil-simple.svg";
//import DeleteIcon from "../../../assets/Icons/AdminDashboard/trash.svg";

import React, { useState, useEffect } from "react";
import {
  //getDocs,
  //collection,
  //deleteDoc,
  doc,
  getDoc,
  //DocumentData,
  //QueryDocumentSnapshot,
} from "firebase/firestore";
import { db /*storage*/ } from "../../../firebase";
import { useNavigate } from "react-router-dom";
//import { ref, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// About object to store each Project's values
interface Company {
  descriptionOne: string;
  descriptionTwo: string;
  image: string;
}

const About: React.FC = () => {
  // for displaying of Projects
  const [company, setCompany] = useState<Company | null>(null);
  //const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);

  // for navigation between pages
  const navigate = useNavigate();

  // for delete
  //const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  //const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  //const [notification, setNotification] = useState<{
  //message: string;
  //type: "success" | "error";
  // } | null>(null);

  // toast setup for project delete
  /*const deleteSuccessToast = (project: string) => {
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
  };*/

  // function to retrieve the company data from database
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const docRef = doc(db, "about-company", "about-company");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompany(docSnap.data() as Company);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching Company: ", error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  const handleEditCompany = () => {
    navigate("/admin/about/edit/company", {
      state: { paramData: company }, // push Company object to be stored in the next page's state
    });
  };
  // handles delete function
  //const handleDelete = (project: Project) => {
  //setSelectedProject(project); // push selected Project data into selectedProject variable
  //setShowDeleteConfirmation(true); // display delete pop up
  //};

  /*  const confirmDelete = async () => {
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
*/
  return (
    <div className="company-ctr">
      <div className="company-header">The Company</div>

      <div className="company-table-ctr">
        {company && (
          <table className="company-table">
            <thead>
              <tr>
                <th>Company Image</th>
                <th>Descriptions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src={company.image}
                    alt={"Company image"}
                    className="company-image"
                  />
                </td>
                <td>
                  <p>{company.descriptionOne}</p>
                  <br></br>
                  <p>{company.descriptionTwo}</p>
                </td>
                <td className="table-actions">
                  <button
                    className="action-button edit-button"
                    onClick={handleEditCompany}
                  >
                    <img src={EditIcon} alt="Edit" className="action-icons" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      {/*
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
*/}
      {/* Notification 
      {notification && (
        <div className={`notification-btm-right ${notification.type}`}>
          {notification.message}
        </div>
      )}*/}
    </div>
  );
};

export default About;
