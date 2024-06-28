import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { db } from "../../../../../firebase";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ImagePlaceHolder from "../../../../../assets/Icons/AdminDashboard/empty-image-placeholder.png";

import "./PeopleEdit.css";
import "./PeopleEdit-media.css";

// create a Person object
interface Person {
  name: string;
  image: string;
  position: string;
  qualifications: string[];
  description: string;
}

const EditPeople: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // useParams used to retrieve the id from the URL
  const [oldName] = useState<string>(name || ""); // useState to store the oldId, which is taken from id (above)
  const [person, setPerson] = useState<Person | null>(null); // useState used to modify the person variable (of type Person)
  // person can either be Person or null - which means that there may be no person data available
  const [loading, setLoading] = useState<boolean>(true); // useState used to set the loading variable
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | File | null>( // useState to set the selectedImage
    null
  );
  const [editSuccess, setEditSuccess] = useState<boolean>(false); // useState for editSuccess, currently set to false
  const navigate = useNavigate(); // function used for navigation (in later parts of code)

  // for form errors
  // errors is a variable that consists of an array of key-value pairs
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // for awards
  // awards is an array of strings (that each represent an award)
  const [qualifications, setQualifications] = useState<string[]>([]);

  // ** USEEFFECT FOR ID CHANGE ** // - basically triggered whenever we click on the 'Edit' button in the Dashboard
  // useEffect is run whenever the id variable changes
  useEffect(() => {
    // define a fetchPerson function (obviously used to fetch person) within this useEffect
    const fetchPerson = async () => {
      if (!name) return;

      try {
        const docRef = doc(db, `about-people`, name); // set the reference to point to the people, and the oldId (document id)
        const docSnap = await getDoc(docRef); // gets the document snapshot from Firebase, basically just represents the document

        // if the document exists, then perform the following
        if (docSnap.exists()) {
          const personData = docSnap.data() as Person; // set personData to be a Person object that essentially contains all the data from the snapshot
          setPerson(personData); // set the person to be personData using setPerson (which we will later display in the HTML)

          setQualifications(personData.qualifications); // Set awards state with data from Firebase array

          setOriginalImageUrl(personData.image);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching person: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [name]); // the useEffect will only run whenever there is a change to the id
  // this means that whenever we click the 'Edit' button (in the Dashboard), then there will be a change to this file (page)'s id
  // (since we have the useParams to change them )
  // thus triggering this useEffect() function run and perform the above

  // ** FUNCTION FOR FIELD CHANGE ** //
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> // event coming from <input> and <textarea> elements (depending on what is changed)
    // the events trigger this function
  ) => {
    const { name, value } = event.target; // destructure the name and value from the elements, and assign to name and value
    if (person) {
      // if person exists (used to ensure that the person is not undefined or null before updating its state)
      setPerson({ ...person, [name]: value }); // use existing key-value (values) in person, and set the key with name to the value
    }
  };

  // ** FUNCTION FOR HANDLING IMAGE CHANGE ** //
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (person) {
          setPerson({ ...person, image: reader.result as string });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      // Restore original image if the input is cleared
      if (person && originalImageUrl) {
        setPerson({ ...person, image: originalImageUrl });
        setSelectedImage(null);
      }
    }
  };

  // ** FUNCTION FOR HANDLING AWARD CHANGE ** //
  const handleQualificationChange = (index: number, value: string) => {
    // pass in the index and the value of the award (that is modified)
    const newQualifications = [...qualifications]; // set newAwards to be an array of awards (taken from awards), we call this spreading
    newQualifications[index] = value; // set the newAwards at the specific index to have the new value (entered into the HTML)
    setQualifications(newQualifications); // setAwards to be the entire new array of awards with any value changes to the awards
  };

  // ** FUNCTION FOR HANDLING AWARD ADD ** //
  const handleAddQualification = () => {
    setQualifications([...qualifications, ""]); // setAwards to make awards have its current values, along with an empty string, representing the new award
    // (that was added upon clicking 'Add Award')
  };

  // ** FUNCTION FOR HANDLING AWARD REMOVE ** //
  const handleRemoveQualification = (index: number) => {
    // pass in the index to the function
    const newQualifications = qualifications.filter((_, i) => i !== index); // filter the awards to only have the awards without the specified index, assign to newAwards
    setQualifications(newQualifications); // setAwards to contain the awards in newAwards
  };

  // ** FUNCTION FOR HANDLING EDIT FORM SUBMIT ** //
  const handleSubmit = async (event: React.FormEvent) => {
    // this function is triggered by the form submission ('Save' button)
    event.preventDefault(); // prevent any default actions

    // if form validation does not pass, then return immediately
    if (!validateForm()) {
      return;
    }

    // if there is no person, we return
    // this is simply used for checking
    if (!person) return;

    const storage = getStorage(); // return an instance of our Firebase storage
    let imageUrl = person.image; // imageUrl assigned the value of person.image

    try {
      // if the user uploads a new image
      if (selectedImage instanceof File) {
        // If a new image is uploaded
        const imageFormat = selectedImage.type.split("/")[1]; // Extract image file format from MIME type
        // given an image file name such as "belmacs/jpg", we split it into an array, and then get the jpg part only (which we assign to imageFormat)

        // create a reference to the image using the type, name, and imageFormat
        const newImageRef = ref(
          storage,
          `belmacs_images/about/people/${person.name}.${imageFormat}`
        );

        // Upload new image
        await uploadBytes(newImageRef, selectedImage); // upload the image to the reference location
        imageUrl = await getDownloadURL(newImageRef); // get the download URL for the newly uploaded image

        // If (person name changed, then we delete the old image)
        if (
          originalImageUrl &&
          person.image &&
          person.name !== oldName // the person name is not oldId (means name change)
          // person.name !== oldId means that there was a name change (meaning that person.name was changed), and thus it will no longer match oldId
          // since oldId is the old person's name
        ) {
          const oldImageRef = ref(storage, originalImageUrl); // create a reference to the old image URL
          await deleteObject(oldImageRef); // delete the old image at the referenced location
        }
        // otherwise, if both the name has changed, then we re-upload the old image

        // if the user does not upload a new image
        // and if the name changed
      } else if (person.name !== oldName) {
        const oldImageRef = ref(storage, person.image); // create a reference to the old image URL

        // Fetch the old image and re-upload it
        const oldImageUrl = await getDownloadURL(oldImageRef); // get the download URL from the reference
        const response = await fetch(oldImageUrl); // CORS request

        // if response is not ok (error)
        if (!response.ok) {
          throw new Error("Failed to fetch old image.");
        }

        const blob = await response.blob(); // blob contains the binary data of the image file, including the MIME type
        // basically blob is the image

        // Extract the old image file format from the MIME type
        const oldImageFormat = blob.type.split("/")[1]; // Extract image file format from MIME type
        const newImageRef = ref(
          storage,
          `belmacs_images/about/people/${person.name}.${oldImageFormat}`
        );
        await uploadBytes(newImageRef, blob); // upload the image blob to the reference location
        imageUrl = await getDownloadURL(newImageRef); // get the download URL from the new reference
        await deleteObject(oldImageRef); // delete the old image at the referenced location
      }

      // updatedPerson is a Person object that will store the person data, but with the new image URL (if there is one)
      const updatedPerson = { ...person, image: imageUrl, qualifications };

      // set the reference to the new person name, and update the reference document with the updatedPerson object data
      const newDocRef = doc(db, `about-people`, person.name);
      await setDoc(newDocRef, updatedPerson);

      // If the person name changed, delete the old document
      if (person.name !== oldName) {
        const oldDocRef = doc(db, `about-people`, oldName); // set the reference to the old person name
        await deleteDoc(oldDocRef); // delete the document at the reference location
      }

      setEditSuccess(true); // set editSuccess to true (indicating successful edit)
      toast.success("Person updated successfully!"); // use toast to display successful edit message
      setTimeout(() => {
        navigate("/admin/about");
      }, 1000); // navigate back to /admin/about after 1 second
    } catch (error) {
      console.error("Error updating person: ", error);
      toast.error("Failed to update person."); // error update message
    }
  };

  // ** FORM VALIDATION FUNCTION ** //
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!person?.name) {
      newErrors.name = "Name is required.";
    }

    if (!person?.position) {
      newErrors.title = "Title is required.";
    }

    if (!person?.description) {
      newErrors.department = "Description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // display loading message if loading is true
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-people-ctr">
      <div className="edit-people-header">Edit Person</div>
      {person && (
        <form onSubmit={handleSubmit}>
          <div className="edit-image-field">
            <div className="edit-current-new-img-ctr">
              <div className="edit-current-img-ctr">
                <label className="edit-field-header">Current Image</label>
                <div className="current-img">
                  {person?.image && (
                    <div>
                      <img
                        src={originalImageUrl ? originalImageUrl : person.image}
                        alt="Current Image"
                        className="current-person-img"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="edit-new-img-ctr">
                <label className="edit-field-header">New Image</label>
                <div className="new-person-img">
                  <img
                    src={selectedImage ? person.image : ImagePlaceHolder}
                    alt="New Image"
                    className="new-person-img"
                  />
                </div>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="upload-image-input"
            />
          </div>

          <div className="edit-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={person.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="edit-field">
            <label htmlFor="position">Position:</label>
            <input
              type="text"
              id="position"
              name="position"
              value={person.position}
              onChange={handleInputChange}
            />
            {errors.position && (
              <span className="error">{errors.position}</span>
            )}
          </div>

          <div className="edit-qualifications-field">
            <label className="edit-qualifications-header">
              Qualifications:
            </label>
            {qualifications.map((qualification, index) => (
              <div key={index} className="edit-qualification-input-ctr">
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) =>
                    handleQualificationChange(index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="remove-qualification-btn"
                  onClick={() => handleRemoveQualification(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-qualification-btn"
              onClick={handleAddQualification}
            >
              Add Qualification
            </button>
          </div>

          <div className="edit-description-field">
            <label htmlFor="description">Description:</label>
            <textarea
              rows={15}
              id="description"
              name="description"
              value={person.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>

          <div className="edit-people-button-ctr">
            <button type="submit" className="edit-people-button">
              Save
            </button>
            <button
              type="button"
              className="cancel-people-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {editSuccess && <p>Director updated successfully!</p>}
    </div>
  );
};

export default EditPeople;
