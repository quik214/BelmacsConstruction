import "./PeopleDashboard.css";
import "./PeopleDashboard-media.css";
import EditIcon from "../../../../../assets/Icons/AdminDashboard/pencil-simple.svg";
import DeleteIcon from "../../../../../assets/Icons/AdminDashboard/trash.svg";
import HamburgerIcon from "../../../../../assets/Icons/menu-black.svg";

import React, { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragStart
} from "@hello-pangea/dnd";

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
  const [people, setPeople] = useState<People[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<People | null>(null);

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
    toast.error(
      <div>
        You cannot add more than 8 directors
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
      state: { paramData: person },
    });
  };

  const handleDelete = (people: People) => {
    setSelectedPeople(people);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!selectedPeople) return;
    try {
      const imageRef = ref(storage, selectedPeople.image);
      await deleteObject(imageRef);
      const peopleRef = doc(db, "about-people", selectedPeople.id);
      await deleteDoc(peopleRef);
      setPeople((prevPeople) =>
        prevPeople.filter((people) => people.id !== selectedPeople.id)
      );
      console.log("Director deleted:", selectedPeople.name);
      setShowDeleteConfirmation(false);
      deleteSuccessToast(selectedPeople.name);
    } catch (error) {
      console.error("Error deleting director:", error);
      setShowDeleteConfirmation(false);
    }
  };

  const handleAddPeople = () => {
    if (people.length === 8) {
      maxPeopleToast();
      return;
    }
    navigate(`/admin/about/people/create`);
  };

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

  const onDragStart = (start: DragStart) => {
    // Add the 'dragging' class to the item being dragged
    document.querySelectorAll('.person-table tbody tr').forEach(row => {
      if (row.getAttribute('data-id') === start.draggableId) {
        row.classList.add('dragging');
      } else {
        row.classList.remove('dragging');
      }
    });
  };

  const onDragEnd = async (result: DropResult) => {
    // Remove the 'dragging' class from all items
    document.querySelectorAll('.person-table tbody tr').forEach(row => {
      row.classList.remove('dragging');
    });

    if (!result.destination) return;
    
    const reorderedPeople = Array.from(people);
    const [removed] = reorderedPeople.splice(result.source.index, 1);
    reorderedPeople.splice(result.destination.index, 0, removed);

    setPeople(reorderedPeople);

    for (let i = 0; i < reorderedPeople.length; i++) {
      await handleDisplayOrderChange(reorderedPeople[i].id, i + 1);
    }
  };

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
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable droppableId="people">
              {(provided) => (
                <table
                  className="person-table"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
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
                      <Draggable key={person.id} draggableId={person.id} index={index}>
                        {(provided) => (
                          <tr
                            data-id={person.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td className="person-displayOrder">
                              <img src={HamburgerIcon} className="person-hamburger" alt="Drag handle" />
                            </td>
                            <td className="person-displayOrder">{person.displayOrder}</td>
                            <td>
                              <img
                                src={person.image}
                                alt="person"
                                className="person-image"
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
                                <img src={DeleteIcon} alt="Delete" className="action-icons" />
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
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
