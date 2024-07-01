import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getYear } from "date-fns"; // Import getYear function
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db } from "../../../../firebase";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./ProjectsEdit.css";
import "./ProjectsEdit-media.css";

//date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ImagePlaceHolder from "../../../../assets/Icons/AdminDashboard/empty-image-placeholder.png";

// create a Project object
interface Project {
  image: string;
  name: string;
  developer: string;
  type: string;
  status: string;
  completion: string;
  client: string;
  location: string;
  featured: "yes" | "no";
  awards: string[];
}

const EditProject: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>(); // useParams used to retrieve the id and type from the URL
  // they must match the naming in App.tsx (where we define the routing)
  const [oldId] = useState<string>(id || ""); // useState to store the oldId, which is taken from id (above)
  const [project, setProject] = useState<Project | null>(null); // useState used to modify the project variable (of type Project)
  // project can either be Project or null - which means that there may be no project data available
  const [loading, setLoading] = useState<boolean>(true); // useState used to set the loading variable
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | File | null>( // useState to set the selectedImage
    null
  );
  const [selectedType, setSelectedType] = useState<string>( // useState for selectedType
    type || "residential" // if type is falsy, then we set selectedType to have the value of "residential"
  );
  const [selectedYear, setSelectedYear] = useState<string | "">(""); // New state to handle year selection
  const [editSuccess, setEditSuccess] = useState<boolean>(false);
  const [status, setStatus] = useState<string | undefined>(undefined); // State for status // useState for editSuccess, currently set to false
  const navigate = useNavigate(); // function used for navigation (in later parts of code)

  // for form errors
  // errors is a variable that consists of an array of key-value pairs
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // for awards
  // awards is an array of strings (that each represent an award)
  const [awards, setAwards] = useState<string[]>([]);

  // ** USEEFFECT FOR ID OR TYPE CHANGE ** // - basically triggered whenever we click on the 'Edit' button in the Dashboard
  // useEffect is run whenever the id or type variables change
  useEffect(() => {
    // define a fetchProject function (obviously used to fetch projects) within this useEffect
    const fetchProject = async () => {
      if (!id || !type) return;

      try {
        const docRef = doc(db, `${type}-projects`, oldId); // set the reference to point to the type-projects, and the oldId (document id)
        const docSnap = await getDoc(docRef); // gets the document snapshot from Firebase, basically just represents the document

        // if the document exists, then perform the following
        if (docSnap.exists()) {
          const projectData = docSnap.data() as Project; // set projectData to be a Project object that essentially cotains all the data from the snapshot
          setProject(projectData); // set the project to be projectData using setProject (which we will later display in the HTML)
          setOriginalImageUrl(projectData.image);
          setStatus(projectData.status);
          setSelectedYear(projectData.completion);
          // Fetch awards from sub-collection
          const awardsCollectionRef = collection(docRef, "awards"); // assign the awardsCollectionRef variable to reference the awards collection in docRef
          const awardsSnapshot = await getDocs(awardsCollectionRef); // get a snapshot of the data in the awards collection
          const awardsData = awardsSnapshot.docs.map((doc) => doc.data().title); // set awardsData (an array) to contain the title of each award using awardsSnapshot

          setAwards(awardsData); // Set awards state with data from Firebase sub-collection
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching project: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, type]); // the useEffect will only run whenever there is a change to the id or type
  // this means that whenever we click the 'Edit' button (in the Dashboard), then there will be a change to this file (page)'s id and type
  // (since we have the useParams to change them )
  // thus triggering this useEffect() function run and perform the above

  // ** USEEFFECT FOR PROJECT TYPE CHANGE ** //
  // useEffect that runs whenever there is a change to selectedType
  useEffect(() => {
    // if the project exists
    if (project) {
      // if the selectedType is not "existingBuildingRetrofit"
      if (selectedType !== "existingBuildingRetrofit") {
        setProject((prevProject) => ({
          // then we pass in prevProject to setProject (which is essentially project's previous state)
          ...prevProject!, // set all the details
          client: "", // but set client to be an empty string
        }));
        // if the selectedType is "existingBuildingRetrofit"
      } else {
        setProject((prevProject) => ({
          // then we pass in prevProject to setProject
          ...prevProject!, // set all the details
          developer: "", // but set developer to be an empty string
        }));
      }

      // the setting of the empty string will be used for the purpose of hiding in the HTML in later parts
    }
  }, [selectedType]); // useEffect runs whenever there is a change to selectedType

  // ** FUNCTION FOR FIELD CHANGE ** //
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > // event coming from <input> and <textarea> elements (depending on what is changed)
    // the events trigger this function
  ) => {
    const { name, value } = event.target; // destructure the name and value from the elements, and assign to name and value
    if (project) {
      // if project exists (used to ensure that the project is not undefined or null before updating its state)
      setProject({ ...project, [name]: value }); // use existing key-value (values) in project, and set the key with name to the value
    }
  };

  // ** FUNCTION FOR completion date CHANGE ** //
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const yearString = getYear(date).toString();
      // setSelectedYear(yearString);
      setProject((prevProject) =>
        prevProject ? { ...prevProject, completion: yearString } : null
      );
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "Completed" | "Ongoing";
    setStatus(newStatus);
    if (newStatus === "Ongoing") {
      setSelectedYear(""); // Clear selected year for 'Ongoing' status
      setProject((prevProject) =>
        prevProject ? { ...prevProject, status: newStatus, completion: "" } : null
      );
    } else {
      const currentYear = new Date().getFullYear().toString();
      setSelectedYear(currentYear); // Set selected year to current year for 'Completed' status
      setProject((prevProject) =>
        prevProject ? { ...prevProject, status: newStatus, completion: currentYear } : null
      );
    }
  };

  // ** FUNCTION FOR HANDLING IMAGE CHANGE ** //
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (project) {
          setProject({ ...project, image: reader.result as string });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      // Restore original image if the input is cleared
      if (project && originalImageUrl) {
        setProject({ ...project, image: originalImageUrl });
        setSelectedImage(null);
      }
    }
  };

  // ** FUNCTION FOR HANDLING AWARD CHANGE ** //
  const handleAwardChange = (index: number, value: string) => {
    // pass in the index and the value of the award (that is modified)
    const newAwards = [...awards]; // set newAwards to be an array of awards (taken from awards), we call this spreading
    newAwards[index] = value; // set the newAwards at the specific index to have the new value (entered into the HTML)
    setAwards(newAwards); // setAwards to be the entire new array of awards with any value changes to the awards
  };

  // ** FUNCTION FOR HANDLING AWARD ADD ** //
  const handleAddAward = () => {
    setAwards([...awards, ""]); // setAwards to make awards have its current values, along with an empty string, representing the new award
    // (that was added upon clicking 'Add Award')
  };

  // ** FUNCTION FOR HANDLING AWARD REMOVE ** //
  const handleRemoveAward = (index: number) => {
    // pass in the index to the function
    const newAwards = awards.filter((_, i) => i !== index); // filter the awards to only have the awards without the specified index, assign to newAwards
    setAwards(newAwards); // setAwards to contain the awards in newAwards
  };

  // ** FUNCTION FOR HANDLING EDIT FORM SUBMIT ** //
  const handleSubmit = async (event: React.FormEvent) => {
    // this function is triggered by the form submission ('Save' button)
    event.preventDefault(); // prevent any default actions

    // if form validation does not pass, then return immediately
    if (!validateForm()) {
      return;
    }

    // if there is no project and no type, we return
    // this is simply used for checking
    if (!project || !type) return;

    const storage = getStorage(); // return an instace of our Firebase storage
    let imageUrl = project.image; // imageUrl assigned the value of project.image

    try {
      // if the user uploads a new image
      if (selectedImage instanceof File) {
        // If a new image is uploaded
        const imageFormat = selectedImage.type.split("/")[1]; // Extract image file format from MIME type
        // given an image file name such as "belmacs/jpg", we split it into an array, and then get the jpg part only (which we assign to imageFormat)

        // create a reference to the image using the type, name, and imageFormat
        const newImageRef = ref(
          storage,
          `belmacs_images/${selectedType}/${project.name}.${imageFormat}`
        );

        // Upload new image
        await uploadBytes(newImageRef, selectedImage); // upload the image to the reference location
        imageUrl = await getDownloadURL(newImageRef); // get the download URL for the newly uploaded image

        // If (project name OR type changed, then we delete the old image)
        if (
          project.image &&
          (project.name !== oldId || type !== selectedType) // the project name is not oldId (means name change) OR type is not selectedType (change type)
          // project.name !== oldId means that there was a name change (meaning that project.name was changed), and thus it will no longer match oldId
          // since oldId is the old project's name
        ) {
          const oldImageRef = ref(storage, project.image); // create a reference to the old image URL
          await deleteObject(oldImageRef); // delete the old image at the referenced location
        }
        // otherwise, if both the type OR project name has changed, then we re-upload the old image

        // if the user does not upload a new image
        // and if the type changed or project name changed
      } else if (type !== selectedType || project.name !== oldId) {
        const oldImageRef = ref(storage, project.image); // create a reference to the old image URL

        // Fetch the old image and re-upload it
        const oldImageUrl = await getDownloadURL(oldImageRef); // get the download URL from the reference
        const response = await fetch(oldImageUrl); // CORS request

        // if response is not ok (error)
        if (!response.ok) {
          throw new Error("Failed to fetch old image.");
        }

        const blob = await response.blob(); // blob contains the binary data of the image file, including the MIME type
        // basicallyblob is the image

        // create a reference to the new path (of the image file)
        const newImageRef = ref(
          storage,
          `belmacs_images/${selectedType}/${project.name}.${
            blob.type.split("/")[1]
          }`
        );

        // upload the blob to the new path
        await uploadBytes(newImageRef, blob);
        imageUrl = await getDownloadURL(newImageRef); // get download URL of the newly uploaded image

        // Delete the old image (at the old path )
        await deleteObject(oldImageRef);
      }

      // Delete the old document
      const oldProjectRef = doc(db, `${type}-projects`, oldId); // create a reference to the old path
      await deleteDoc(oldProjectRef); // delete the old document (project)

      // Delete the old awards subcollection
      const oldAwardsCollectionRef = collection(oldProjectRef, "awards"); // create reference to old awards collection
      const oldAwardsSnapshot = await getDocs(oldAwardsCollectionRef); // get the snapshot of the collection
      const deleteAwardsPromises = oldAwardsSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref); // map through each document in the awards snapshot, and delete each of them
      });
      await Promise.all(deleteAwardsPromises); // waits until all delete operations are completed

      // Add project details to the new collection
      const newProjectRef = doc(db, `${selectedType}-projects`, project.name); // create reference to collection with new name

      if (status === "Ongoing") {
        setSelectedYear("");
      }

      await setDoc(newProjectRef, {
        ...project,
        image: imageUrl,
        status: status,
        completion: selectedYear,
      }); // set the data at the reference

      // Filter out empty awards
      const filteredAwards = awards.filter((award) => award.trim() !== "");

      // Add awards as a subcollection with award title as document ID
      const awardsCollectionRef = collection(newProjectRef, "awards"); // reference the awards collection at the location of newProjectRef
      await Promise.all(
        filteredAwards.map(async (award) => {
          // map over each filteredAward, and create a document
          await setDoc(doc(awardsCollectionRef, award), { title: award }); // with the award title as the id
        })
      );

      // show toast
      editSuccessToast(project.name);

      // hides the entire form upon success
      setEditSuccess(true);

      // navigates the user back to dashboard
      navigate("/admin/projects");
    } catch (error) {
      createErrorToast();
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // createErrorToast
  const createErrorToast = () => {
    toast.error("Please fill in the required fields.", {
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

  // toast setup for login success
  const editSuccessToast = (projectName: string) => {
    toast.success(
      <div>
        Successfully edited <b>{projectName}</b>
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

  // form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {};

    if (!project?.name) {
      newErrors.name = "Name is required.";
    }
    if (!project?.type) {
      newErrors.type = "Type is required.";
    }
    if (!project?.location) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="edit-project-ctr">
      {!editSuccess && project && (
        <form onSubmit={handleSubmit}>
          <p className="edit-project-header">Edit Project</p>

          <div className="edit-field">
            <label className="edit-field-header">Project Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="edit-project-type"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="existingBuildingRetrofit">
                Existing Building Retrofit
              </option>
              <option value="institutional">Institutional</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          <div className="edit-field">
            <label className="edit-field-header">Name</label>
            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="edit-field">
            <div className="edit-current-new-project-img-ctr">
              <div className="edit-current-project-img-ctr">
                <label className="edit-field-header">Current Image</label>
                <div className="current-img">
                  {originalImageUrl && (
                    <div>
                      <img
                        src={originalImageUrl}
                        alt="Current Image"
                        className="current-project-img"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="edit-new-project-img-ctr">
                <label className="edit-field-header">New Image</label>
                <div className="new-project-img">
                  <img
                    src={selectedImage ? project.image : ImagePlaceHolder}
                    alt="New Image"
                    className="new-project-img"
                    onClick={() =>
                      (
                        document.getElementById(
                          "upload-image-input"
                        ) as HTMLInputElement
                      ).click()
                    }
                  />
                </div>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="upload-image-input"
              id="upload-image-input"
            />
          </div>

          {selectedType !== "existingBuildingRetrofit" && (
            <div className="edit-field">
              <label className="edit-field-header">Developer</label>
              <input
                type="text"
                name="developer"
                value={project.developer}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="edit-awards-field">
            <label className="edit-awards-header">Awards</label>
            {awards.length > 0 ? (
              awards.map((award, index) => (
                <div key={index} className="edit-award-input-ctr">
                  <input
                    type="text"
                    placeholder="Award Title"
                    value={award}
                    onChange={(e) => handleAwardChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-award-btn"
                    onClick={() => handleRemoveAward(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="edit-awards-desc">No awards yet.</p>
            )}
            <button
              type="button"
              className="add-award-btn"
              onClick={handleAddAward}
            >
              Add Award
            </button>
          </div>

          <div className="edit-field">
            <label className="edit-field-header">Type</label>
            <input
              type="text"
              name="type"
              value={project.type}
              onChange={handleInputChange}
            />
            {errors.type && <p className="error">{errors.type}</p>}
          </div>

          <div className="edit-field">
            <label className="edit-field-header">Status</label>
            <select
              className="edit-project-status"
              id="status"
              name="status"
              value={status}
              onChange={handleStatusChange}
              required
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {status !== "Ongoing" && (
            <div className="edit-field">
              <label className="edit-field-header">Completion</label>
              <DatePicker
                selected={
                  selectedYear ? new Date(Number(selectedYear), 0, 1) : null
                }
                onChange={handleDateChange}
                showYearPicker
                dateFormat="yyyy"
                className="edit-input"
              />
            </div>
          )}

          {selectedType === "existingBuildingRetrofit" && (
            <div className="edit-field">
              <label className="edit-field-header">Client</label>
              <input
                type="text"
                name="client"
                value={project.client}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="edit-field">
            <label className="edit-field-header">Location</label>
            <input
              type="text"
              name="location"
              value={project.location}
              onChange={handleInputChange}
            />
          </div>

          <div className="edit-field">
            <label className="edit-field-header">Featured</label>
            <div className="featured-toggle-ctr">
              <label className="featured-switch">
                <input
                  type="checkbox"
                  checked={project.featured === "yes"}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      featured: e.target.checked ? "yes" : "no",
                    })
                  }
                />
                <span className="featured-slider round"></span>
              </label>
            </div>
          </div>

          <div className="edit-project-button-ctr">
            <button type="submit" className="edit-project-button">
              Save
            </button>
            <button
              type="button"
              className="cancel-project-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProject;
