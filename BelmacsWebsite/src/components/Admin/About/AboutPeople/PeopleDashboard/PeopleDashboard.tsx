import "./PeopleDashboard.css";
import "./PeopleDashboard-media.css";

import EditIcon from "../../../../../assets/Icons/AdminDashboard/pencil-simple.svg";
import DeleteIcon from "../../../../../assets/Icons/AdminDashboard/trash.svg";
import HamburgerIcon from "../../../../../assets/Icons/menu-black.svg";

import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// People object to store each Director's values
interface People {
  id: string;
  name: string;
  image: string;
  position: string;
  qualifications: string[];
  description: string;
  displayOrder: number;
}

const PeopleDashboard: React.FC = () => {
  // for displaying of People
  const [people, setPeople] = useState<People[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const maxPeopleToast = () => {
    toast.error(<div>You cannot add more than 8 directors</div>, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // function to retrieve the OurPeople data from database
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const peopleCollectionRef = collection(db, "about-people");
        const querySnapshot = await getDocs(peopleCollectionRef);
        const peopleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as People[];
        setPeople(peopleData.sort((a, b) => a.displayOrder - b.displayOrder));
        setLoading(false);
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

      const peopleRef = doc(db, `about-people`, selectedPeople.id); // assign peopleRef variable the People document (within Firebase)

      // Delete firestore data using details in peopleRef
      await deleteDoc(peopleRef);

      // Update people after deletion
      setPeople((prevPeople) =>
        prevPeople.filter((people) => people.id !== selectedPeople.id)
      );

      console.log("Director deleted:", selectedPeople.name); // log the deleted people
      setShowDeleteConfirmation(false); // Hide the confirmation dialog after deletion

      deleteSuccessToast(selectedPeople.name); // display toast
    } catch (error) {
      console.error("Error deleting director:", error);
      setShowDeleteConfirmation(false); // Hide the confirmation dialog on error
    }
  };

  const handleAddPeople = () => {
    if (people.length === 8) {
      maxPeopleToast();
      return;
    }
    navigate(`/admin/about/people/create`);
  };

  // const createNewLine = (companyDesc: string) => {
  //   return companyDesc.split("\n").map((line, index) => (
  //     <React.Fragment key={index}>
  //       {line}
  //       <br />
  //     </React.Fragment>
  //   ));
  // };

  const handleDisplayOrderChange = async (id: string, newOrder: number) => {
    const personRef = doc(db, "about-people", id);
    await updateDoc(personRef, { displayOrder: newOrder });
    setPeople((prevPeople) =>
      prevPeople
        .map((person) =>
          person.id === id ? { ...person, displayOrder: newOrder } : person
        )
        .sort((a, b) => a.displayOrder - b.displayOrder)
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    document
      .querySelectorAll(".person-table tr")
      .forEach((row) => row.classList.add("dragging"));
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.preventDefault();
    setDragOverIndex(index);
    document
      .querySelectorAll(".person-table tr")
      .forEach((row) => row.classList.remove("drag-over"));
    e.currentTarget.classList.add("drag-over");
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const draggedPerson = people[draggedIndex];
    const targetPerson = people[index];

    const newPeople = [...people];
    newPeople[draggedIndex] = targetPerson;
    newPeople[index] = draggedPerson;
    console.log(dragOverIndex);

    // Update the display order in Firebase
    handleDisplayOrderChange(draggedPerson.id, targetPerson.displayOrder);
    handleDisplayOrderChange(targetPerson.id, draggedPerson.displayOrder);

    // Update local state
    setPeople(newPeople);

    setDraggedIndex(null);
    setDragOverIndex(null);
    document
      .querySelectorAll(".person-table tr")
      .forEach((row) => row.classList.remove("dragging", "drag-over"));
  };

  const handleTouchStart = (index: number) => {
    setDraggedIndex(index);
    document
      .querySelectorAll(".person-table tr")
      .forEach((row) => row.classList.add("dragging"));
  };

  const handleTouchMove = (
    e: React.TouchEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.preventDefault();
    setDragOverIndex(index);
    document
      .querySelectorAll(".person-table tr")
      .forEach((row) => row.classList.remove("drag-over"));
    e.currentTarget.classList.add("drag-over");
  };

  const handleTouchEnd = (index: number) => {
    handleDrop(index);
  };
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault(); // Prevent the default action (e.g., navigating to image source)
  };

  const preventDefault = (e: React.SyntheticEvent) => e.preventDefault();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="person-ctr">
      <div className="header-button-ctr">
        <div className="person-header">Our People</div>
        <button className="add-person-button" onClick={handleAddPeople}>
          Add Director
        </button>
      </div>

      <div className="person-table-ctr">
        {people.length > 0 && (
          <table className="person-table">
            <thead>
              <tr>
                <th></th>
                <th>Display Order</th>
                <th>Image</th>
                <th>Name</th>
                <th className="mobile-table">Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr
                  key={person.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchMove={(e) => handleTouchMove(e, index)}
                  onTouchEnd={() => handleTouchEnd(index)}
                >
                  <td className="person-displayOrder">
                    <img
                      src={HamburgerIcon}
                      className="person-hamburger unselectable"
                      onClick={handleImageClick} // Prevent default action on image click
                    />
                  </td>
                  <td className="person-displayOrder">{person.displayOrder}</td>
                  <td>
                    <img
                      src={person.image}
                      alt={"person image"}
                      className="person-image"
                      onClick={handleImageClick} // Prevent default action on image click
                    />
                  </td>
                  <td>
                    <p>{person.name}</p>
                  </td>
                  <td className="mobile-table">
                    <p>{person.position}</p>
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
                <span style={{ color: "#364FC7" }}>{selectedPeople.name}?</span>{" "}
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
