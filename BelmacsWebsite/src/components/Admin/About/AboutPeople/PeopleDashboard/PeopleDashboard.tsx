import "./PeopleDashboard.css";
import "./PeopleDashboard-media.css";

import EditIcon from "../../../../../assets/Icons/AdminDashboard/pencil-simple.svg"
import DeleteIcon from "../../../../../assets/Icons/AdminDashboard/trash.svg";

import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db , storage } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";

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

  // for navigation between pages
  const navigate = useNavigate();

  // for delete
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<People | null>(null);

  // toast setup for people delete
  const deleteSuccessToast = (people: string) => {
    toast.success(
      <div>
        <b>{people}</b> has been deleted
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
    navigate(`/admin/about/people/edit/${person.name}`, {
      state: { paramData: person }, // push person object to be stored in the next page's state
    });
  };

  // handles delete function
  const handleDelete = (people: People) => {
  setSelectedPeople(people); // push selected People data into selectedPeople variable
  setShowDeleteConfirmation(true); // display delete pop up
  };

  const confirmDelete = async () => {
    if (!selectedPeople) return; // ensure selectedPeople both exist (for below parts)
    try {

      // Delete firestore storage image
      const imageRef = ref(storage, selectedPeople.image);
      await deleteObject(imageRef);

      const peopleRef = doc(
        db,
        `about-people`,
        selectedPeople.name
      ); // assign peopleRef variable the People document (within Firebase)

      // Delete firestore data using details in peopleRef
      await deleteDoc(peopleRef);

      // Update people after deletion
      setPeople((prevPeople) =>
        prevPeople.filter((people) => people.name !== selectedPeople.name)
      );

      console.log("Director deleted:", selectedPeople.name); // log the deleted people
      setShowDeleteConfirmation(false); // Hide the confirmation dialog after deletion

      deleteSuccessToast(selectedPeople.name); // display toast
    } catch (error) {
      console.error("Error deleting director:", error);
      setShowDeleteConfirmation(false); // Hide the confirmation dialog on error
    }
  };

  /*
    // for search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


*/

  const handleAddPeople = () => {
    navigate(`/admin/about/people/create`)
  };

  const createNewLine = (companyDesc: string) => {
    return companyDesc.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };


return (
    <div className="person-ctr">
      <div className="person-header">Our People</div>

      <div className="add-person-ctr">
        <button className="add-person-button" onClick={handleAddPeople}>
          Add Director
        </button>
      </div>

      <div className="person-table-ctr">
        {people.length > 0 && (
          <table className="person-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th className="mobile-table">Position</th>
                <th className="mobile-table">Qualifications</th>
                <th className="person-table-description mobile-table">Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={person.image}
                      alt={"person image"}
                      className="person-image"
                    />
                  </td>
                  <td>
                    <p>{person.name}</p>
                  </td>
                  <td className="mobile-table">
                    <p>{person.position}</p>
                  </td>
                  <td className="mobile-table">
                  {person.qualifications.length > 0 ? (
                      person.qualifications.map((qualification, qIndex) => (
                        <p key={qIndex}>- {qualification}</p>
                      ))
                    ) : (
                      <p>No qualifications listed</p>
                    )}
                  </td>
                  <td className="mobile-table">
                    <p>{createNewLine(person.description)}</p>
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
                    onClick={() => handleDelete(person)}
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
      
      {showDeleteConfirmation && selectedPeople && (
        <>
          <div className="delete-overlay"></div>
          <div className="delete-confirmation-popup">
            <div className="delete-confirmation-ctr">
              <div className="delete-confirmation-header">Are you sure?</div>
              <div className="delete-confirmation-description">
                Are you sure you want to delete{" "}
                <span style={{ color: "#364FC7" }}>
                  {selectedPeople.name}?
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
    </div>
  );
};

export default PeopleDashboard;
