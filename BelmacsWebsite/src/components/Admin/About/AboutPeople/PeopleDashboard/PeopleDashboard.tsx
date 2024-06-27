import "./PeopleDashboard-media.css";
import "./PeopleDashboard.css";

import EditIcon from "../../../../../assets/Icons/AdminDashboard/pencil-simple.svg"
import DeleteIcon from "../../../../../assets/Icons/AdminDashboard/trash.svg";

import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  //deleteDoc,
  doc,
  getDoc,
  //DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db /*storage*/ } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";
//import { ref, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// People object to store each Project's values
interface People {
  name: string;
  image: string;
  position: string;
  qualifications: string[];
  description: string;
}

const PeopleDashboard: React.FC = () => {
  // for displaying of People
  const [people, setPeople] = useState<People[]>([]);
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

  // function to retrieve the OurPeople data from database
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const peopleCollectionRef = collection(db, "about-people");
        const querySnapshot = await getDocs(peopleCollectionRef);
        const peopleData = querySnapshot.docs.map((doc) => doc.data() as People);
        setPeople(peopleData);
      } catch (error) {
        console.error("Error fetching People collection: ", error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  const handleEditPeople = (person: People) => {
    navigate("/admin/about/people/edit", {
      state: { paramData: person }, // push person object to be stored in the next page's state
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
    <div className="people-ctr">
      <div className="people-header">Our People</div>

      <div className="people-table-ctr">
        {people.length > 0 && (
          <table className="people-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Position</th>
                <th>Qualifications</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={person.image}
                      alt={"people image"}
                      className="people-image"
                    />
                  </td>
                  <td>
                    <p>{person.name}</p>
                  </td>
                  <td>
                    <p>{person.position}</p>
                  </td>
                  <td>
                  {person.qualifications.length > 0 ? (
                      person.qualifications.map((qualification, qIndex) => (
                        <p key={qIndex}>- {qualification}</p>
                      ))
                    ) : (
                      <p>No qualifications listed</p>
                    )}
                  </td>
                  <td>
                    <p>{person.description}</p>
                  </td>
                  <td className="table-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditPeople(person)}
                    >
                      <img src={EditIcon} alt="Edit" className="action-icons" />
                    </button>
                    <button
                    className="action-button delete-button"
                    onClick={() => handleEditPeople(person)}
                  >
                    <img src={DeleteIcon} className="action-icons" />
                  </button>
                  </td>
                </tr>
              ))}
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

export default PeopleDashboard;
