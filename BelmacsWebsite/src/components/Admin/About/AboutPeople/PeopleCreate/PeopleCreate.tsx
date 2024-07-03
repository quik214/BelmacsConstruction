import "./PeopleCreate.css";
import "./PeopleCreate-media.css";

// import libraries
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../../../../firebase";
import { setDoc, doc } from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import ImagePlaceHolder from "../../../../../assets/Icons/AdminDashboard/empty-image-placeholder.png";

// toast library
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getDocs, collection } from "firebase/firestore";

const PeopleCreate: React.FC = () => {
  // ** OBJECT DECLARATION **

  // personDetails is an Object that represents the value in the CREATE form
  const [personDetails, setPersonDetails] = useState({
    name: "",
    image: "",
    position: "",
    qualifications: [],
    description: "",
    displayOrder: "",
  });

  // useState for Qualifications
  // setQualifications is used to set the array of Qualifications, which is asigned to qualifications variable
  const [qualifications, setQualifications] = useState<string[]>([]);

  // useState
  // setErrors is used to update the errors object
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    position: "",
    description: "",
  });

  // useState to set the imageFile (File object)
  // initial value is null
  const [imageFile, setImageFile] = useState<File | null>(null);

  // useNavigate hook. Essentially a function that can be used to navigate user to different routes (URL)
  const navigate = useNavigate(); // will be used in later parts of the code for navigation to a different URL

  // ** HANDLE CHANGES TO INPUT (ENTER DATA INTO INPUT AND SELECT) ** //

  // handleChange function, used to handle any changes to the following elements:
  // <input> elements
  // <select> elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // this specifies the elements that on change, the function will react upon
    // we are essentially assigning variable e the element's name and value (for use in line 90)
    // think of it as on change of a certain element (stated above), we will constantly pass in the element's details, of which includes the above
  ) => {
    const { name, value } = e.target; // destructure target into name and value variables
    setPersonDetails((prevDetails) => ({
      // set the personDetails to take in its prevDetails (previous state, prior to this function being called)
      ...prevDetails, // every value from the previous state is copied over to the new state
      [name]: value, // but for the property name in personDetails, it will be set to the value of the element that is being edited
      // this means that each field in the form has a name that matches the personDetails object property
      // and it will take the value entered into the field, and be used here in this function to update the new state
    }));
  };

  // ** FUNCTION TO NAVIGATE TO PREVIOUS PAGE ** //
  // function used to navigate to the previous page upon a cancellation (if user does not wish to edit the CREATE form)
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  // ** FUNCTION TO HANDLE IMAGE CHANGE ** //
  // handle changes of any image
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (personDetails) {
          setPersonDetails({
            ...personDetails,
            image: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      // Restore original image if the input is cleared
      if (personDetails && ImagePlaceHolder) {
        setPersonDetails({ ...personDetails, image: ImagePlaceHolder });
        setImageFile(null);
      }
    }
  };

  // ** FUNCTION FOR FORM VALIDATION ** //
  const validate = () => {
    // create an Object with each property representing the errors of each field (and property of personDetails)
    const newErrors = {
      name: "",
      image: "",
      position: "",
      description: "",
      displayOrder: "",
    };
    let isValid = true;

    // trim the personDetails name, then check if it is empty
    // if true, we set the newErrors property to be the below string
    if (!personDetails.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // trim the personDetails position, and check if it is empty
    // then we set the error message to be the below string
    if (!personDetails.position.trim()) {
      newErrors.position = "Position is required";
      isValid = false;
    }

    // trim the personDetails description, check if it is empty
    // then we set the error message to be the below string
    if (!personDetails.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    // if the imageFile variable (declared at the top) is empty
    // then we set the error message to be the below string
    if (!imageFile) {
      newErrors.image = "Image file is required";
      isValid = false;
    }

    // afterwards, set the errors (declared above) to have the values of newErrors
    setErrors(newErrors);
    return isValid;
  };

  // ** FUNCTION TO HANDLE QUALIFICATIONS CHANGE ** //
  const handleQualificationChange = (
    e: React.ChangeEvent<HTMLInputElement>, // set e variable to be the <input> element
    index: number // index is the position of the qualification in the qualifications array
  ) => {
    const newQualifications = [...qualifications]; // creates a shallow copy of the qualifications array
    newQualifications[index] = e.target.value; // set newQualifications[index] to be the value of the qualifications <input> element
    setQualifications(newQualifications); // setQualifications function to set the (above declared) qualifications array to have the values of newQualifications
  };

  // ** FUNCTION TO HANDLE ADD QUALIFICATION ** //
  const handleAddQualification = () => {
    setQualifications([...qualifications, ""]); // setQualifications to have its previous qualifications, but also a new qualification with an empty value
  };

  // ** FUNCTION TO HANDLE REMOVE QUALIFICATION ** //
  const handleRemoveQualification = (index: number) => {
    // remove qualification at a specific index in the qualifications array
    const newQualifications = qualifications.filter((_, i) => i !== index);
    // (_, i) - _ is the current element (which we no longer need), i is the current index of the element
    // the qualifications.filter() function then filters all the persons, where i (current index) will not be included
    // we set the filtered qualifications to be stored in the variable newQualifications
    setQualifications(newQualifications); // we then set the qualifications array to be newQualifications
  };

  // createErrorToast
  const createErrorToast = () => {
    toast.error("Please fix the errors in the form", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // createSuccessToast
  const createSuccessToast = (message: string) => {
    toast.success(
      <div>
        You have added <b>{message}</b>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };

  // createFailureToast
  const createFailureToast = () => {
    toast.error("Person failed to be added", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // ** FUNCTION TO HANDLE SUBMIT OF CREATE FORM ** //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // used to prevent default behaviour of the form submission

    if (!validate() || !imageFile) {
      createErrorToast();
      return;
    }

    try {
      // Get the current list of people
      const peopleCollectionRef = collection(db, "about-people");
      const peopleSnapshot = await getDocs(peopleCollectionRef);
      const peopleCount = peopleSnapshot.docs.length;

      // Upload image to Firebase Storage
      const storageRef = ref(
        storage,
        `belmacs_images/about/people/${personDetails.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (_snapshot) => {
          // snapshot can be excluded
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const personRef = doc(db, `about-people`, personDetails.name);

          await setDoc(personRef, {
            name: personDetails.name,
            image: downloadURL,
            position: personDetails.position,
            qualifications: qualifications,
            description: personDetails.description,
            displayOrder: peopleCount + 1, // set displayOrder to the length of the current list plus one
          });

          createSuccessToast(personDetails.name);
          navigate("/admin/about");
        }
      );
    } catch (error) {
      console.error("Error adding people: ", error);
      createFailureToast();
    }
  };

  return (
    <div className="create-person-ctr">
      <div className="create-person-form-ctr">
        <p className="create-person-header">Add New Director</p>
        {/* CREATE Form */}
        <form onSubmit={handleSubmit}>
          <div className="create-field">
            <label htmlFor="name">Upload Image File (229x305)</label>
            <div className="new-person-img">
              <img
                src={imageFile ? personDetails.image : ImagePlaceHolder}
                alt="New Image"
                className="new-person-img"
                onClick={() =>
                  (
                    document.getElementById(
                      "upload-image-input"
                    ) as HTMLInputElement
                  ).click()
                }
              />
            </div>
            <input
              className="upload-image-input create-input"
              id="upload-image-input"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
            {errors.image && <p className="error-msg">{errors.image}</p>}
          </div>

          <div className="create-field">
            <label htmlFor="name" className="create-field-header">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Er. Full Name"
              value={personDetails.name}
              onChange={handleChange}
              className="create-input"
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>

          <div className="create-field">
            <label htmlFor="position" className="create-field-header">
              Position
            </label>
            <input
              id="position"
              type="text"
              name="position"
              placeholder="Director"
              value={personDetails.position}
              onChange={handleChange}
              className="create-input"
            />
            {errors.position && <p className="error-msg">{errors.position}</p>}
          </div>

          <div className="qualifications-field">
            <label htmlFor="qualifications" className="create-field-header">
              Qualifications
            </label>

            {qualifications.map((qualification, index) => (
              <div key={index} className="qualification-input-ctr">
                <input
                  type="text"
                  name="qualifications"
                  placeholder="Qualification"
                  value={qualification}
                  onChange={(e) => handleQualificationChange(e, index)}
                  className="create-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQualification(index)}
                  className="remove-qualification-button"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQualification}
              className="add-qualification-button"
            >
              Add Qualification
            </button>
          </div>

          <div className="create-field">
            <label htmlFor="description" className="create-field-header">
              Description
            </label>
            <textarea
              rows={15}
              id="description"
              name="description"
              placeholder="Description"
              value={personDetails.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="error-msg">{errors.description}</p>
            )}
          </div>

          <div className="create-person-button-ctr">
            <button type="submit" className="create-person-button">
              Add Director
            </button>
            <button
              type="button"
              className="cancel-person-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeopleCreate;
