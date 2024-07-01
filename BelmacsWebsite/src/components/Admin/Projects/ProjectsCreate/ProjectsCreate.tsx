import "./ProjectsCreate.css";
import "./ProjectsCreate-media.css";

// import libraries
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../../../firebase";
import { setDoc, doc, collection } from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import ImagePlaceHolder from "../../../../assets/Admin/placeholder-landscape.png";

// toast library
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import DateTimePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Create: React.FC = () => {
  // ** OBJECT DECLARATION **

  // get the selectedType from the URL (passed from the dashboard), assign it to variable selectedType
  const { selectedType } = useParams<{ selectedType: string }>();
  // console.log(selectedType);

  // projectDetails is an Object that represents the value in the CREATE form
  const [projectDetails, setProjectDetails] = useState({
    image: "",
    name: "",
    developer: "",
    type: "",
    status: "Completed",
    completion: new Date().getFullYear().toString(),
    client: "",
    location: "",
    featured: "no",
    ProjectType: selectedType, // assign ProjectType to be the selectedType (from line 18)
  });

  // declare Award object
  type Award = {
    title: string;
  };

  // useState for Awards
  // setAwards is used to set the array of Awards, which is asigned to awards variable
  const [awards, setAwards] = useState<Award[]>([]);

  // useState
  // setErrors is used to update the errors object
  // errors is an object with the properties 'image', 'name', etc.
  const [errors, setErrors] = useState({
    image: "",
    name: "",
    developer: "",
    type: "",
    status: "",
    completion: "",
    client: "",
    location: "",
  });

  // useState to set the imageFile (File object)
  // initial value is null
  const [imageFile, setImageFile] = useState<File | null>(null);

  // useNavigate hook. Essentially a function that can be used to navigate user to different routes (URL)
  const navigate = useNavigate(); // will be used in later parts of the code for navigation to a different URL

  // ** PROJECTTYPE DROPDOWN CHANGE ** //

  // this useEffect runs whenever there is a change in projectDetails.ProjectType
  // or setProjectDetails changes
  useEffect(() => {
    // Reset the fields based on the project type

    // if the ProjectType is not equals to existingBuildingRetrofit, the field to enter the client is removed
    if (projectDetails.ProjectType !== "existingBuildingRetrofit") {
      setProjectDetails((prevDetails) => ({
        ...prevDetails, // everything is included but we
        client: "", // clear the client field
      }));
      // otherwise, if the ProjectType is equals to existingBuildingRetrofit, the field to enter the developer is removed
    } else {
      setProjectDetails((prevDetails) => ({
        ...prevDetails, // everything is included but we
        developer: "", // clear the developer field
      }));
    }
  }, [projectDetails.ProjectType, setProjectDetails]); // this line is used to specify that on projectDetails.ProjectType change, then the useEffect will run
  // (setProjectDetails is not actually required here, since it is a function and there will not be a change to it )

  // ** HANDLE CHANGES TO INPUT (ENTER DATA INTO INPUT AND SELECT) ** //

  // handleChange function, used to handle any changes to the following elements:
  // <input> elements
  // <select> elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> // this specifies the elements that on change, the function will react upon
    // we are essentially assigning variable e the element's name and value (for use in line 90)
    // think of it as on change of a certain element (stated above), we will constantly pass in the element's details, of which includes the above
  ) => {
    const { name, value } = e.target; // destructure target into name and value variables
    setProjectDetails((prevDetails) => {
      const newDetails = {
        // set the projectDetails to take in its prevDetails (previous state, prior to this function being called)
        ...prevDetails, // every value from the previous state is copied over to the new state
        [name]: value, // but for the property name in projectDetails, it will be set to the value of the element that is being edited
        // this means that each field in the form has a name that matches the projectDetails object property
        // and it will take the value entered into the field, and be used here in this function to update the new state
      };

      // Check if the 'status' field was changed
      if (name === "status") {
        if (value === "Ongoing") {
          newDetails.completion = ""; // Set completion to null for 'Ongoing' status
        } else if (value === "Completed") {
          newDetails.completion = new Date().getFullYear().toString(); // Set completion to this year's date for 'Completed' status
        }
      }

      return newDetails;
    });
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
        if (projectDetails) {
          setProjectDetails({
            ...projectDetails,
            image: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      // Restore original image if the input is cleared
      if (projectDetails && ImagePlaceHolder) {
        setProjectDetails({ ...projectDetails, image: ImagePlaceHolder });
        setImageFile(null);
      }
    }
  };

  // ** FUNCTION TO HANDLE TOGGLE FOR FEATURED PROJECT ** //
  // for toggle switch (project.featured)
  const handleToggleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    // e.target represents the HTML element
    const { name } = e.target; // destructure e.target to get the name attribute (from the HTML element)
    // depending on projectDetails.featured's value, currentFeaturedValue will be set to either yes or no
    // if the current featured value (in the above object) is yes, we set to no
    // if it is no, we set it to yes
    const currentFeaturedValue =
      projectDetails.featured === "yes" ? "no" : "yes";
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: currentFeaturedValue, // we then use setProjectDetails to change the projectDetails 'featured' property to be set to currentFeaturedValue
    }));
  };

  // ** FUNCTION FOR FORM VALIDATION ** //
  const validate = () => {
    // create an Object with each property representing the errors of each field (and property of projectDetails)
    const newErrors = {
      image: "",
      name: "",
      developer: "",
      type: "",
      status: "",
      completion: "",
      client: "",
      location: "",
    };
    let isValid = true;

    // trim the projectDetails name, then check if it is empty
    // if true, we set the newErrors property to be the below string
    if (!projectDetails.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    }

    // trim the projectDetails developer, and check if it is empty AND check if the projectType is NOT existingBuildingRetrofit
    // then we set the error message to be the below string
    if (
      !projectDetails.developer.trim() &&
      projectDetails.ProjectType !== "existingBuildingRetrofit"
    ) {
      newErrors.developer = "Developer is required";
      isValid = false;
    }

    // trim the projectDetails completion, check if it is empty
    // then we set the error message to be the below string
    if (projectDetails.status === "Completed" && !projectDetails.completion) {
      newErrors.completion = "Completion date is required";
      isValid = false;
    }

    // trim the projectDetails type, check if it is empty
    // then we set the error message to be the below string
    if (!projectDetails.type.trim()) {
      newErrors.type = "Type is required";
      isValid = false;
    }

    // trim the projectDetails location, check if it is empty
    // then we set the error message to be the below string
    if (!projectDetails.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    // if the imageFile variable (declared at the top) is empty
    // then we set the error message to be the below string
    if (!imageFile) {
      newErrors.image = "Image file is required";
      isValid = false;
    }

    if (!projectDetails.status.trim()) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    // afterwards, set the errors (declared above) to have the values of newErrors
    setErrors(newErrors);
    return isValid;
  };

  // ** FUNCTION TO HANDLE AWARDS CHANGE ** //
  const handleAwardChange = (
    e: React.ChangeEvent<HTMLInputElement>, // set e variable to be the <input> element
    index: number // index is the position of the award in the awards array
  ) => {
    const newAwards = [...awards]; // creates a shallow copy of the awards array
    newAwards[index].title = e.target.value; // set newAwards[index] title to be the value of the awards <input> element
    setAwards(newAwards); // setAwards function to set the (above declared) awards array to have the values of newAwards
  };

  // ** FUNCTION TO HANDLE ADD AWARD ** //
  const handleAddAward = () => {
    setAwards([...awards, { title: "" }]); // setAwards to have its previous awards, but also a new award with an empty title
  };

  // ** FUNCTION TO HANDLE REMOVE AWARD ** //
  const handleRemoveAward = (index: number) => {
    // remove award at a specific index in the awards array
    const newAwards = awards.filter((_, i) => i !== index);
    // (_, i) - _ is the current element (which we no longer need), i is the current index of the element
    // the awards.filter() function then filters all the projects, where i (current index) will not be included
    // we set the filtered awards to be stored in the variable newAwards
    setAwards(newAwards); // we then set the awards array to be newAwards
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

  // createFailureToast (will not happen)
  const createFailureToast = () => {
    toast.error("Your project failed to be added", {
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

    // if the form is not validated (validate() returns false) OR there is no imageFile, then we will display the createErrorToast
    // !imageFile is simply to ensure that in the below line, imageFile does not have an error
    if (!validate() || !imageFile) {
      createErrorToast(); // display the error toast
      return;
    }

    try {
      // Upload image to Firebase Storage
      // ref creates a reference to a specific locaiton in Firebase Storage
      // takes 2 arguments: storage instance (based on import above), and the path where the file will be stored
      // path is as shown
      const storageRef = ref(
        storage,
        `belmacs_images/${projectDetails.ProjectType}/${projectDetails.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      // uploadBytesResumable is a function used to upload files to Firebase Storage (in a resumable way)
      // this means that if the file upload was interrupted, it can be resumed where it left off
      // the imageFile will thus be uploaded to the reference location specified in storageRef

      // uploadTask.on is a method used to handle events related to the uploading of the imageFile
      // this means that uploadBytesResumable is a function used to upload the imageFile, while uploadTask itself has a .on property
      // that contains the state of the upload (in a way)
      uploadTask.on(
        "state_changed", // event type that is triggered whenever there is change in upload state (progress, pause, resume)
        (_snapshot) => {
          // _snapshot contains information about current state of the upload, such as number of bytes transferred and total bytes
          // snapshot can actually be excluded
        },
        // handle any errors during file upload
        (error) => {
          console.error("Error uploading file: ", error);
        },
        // async is used to handle actions after the image file upload is completed successfully
        async () => {
          // Get the download URL from the uploaded file (in Firebase Storage)
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Extract (destructure) projectType from projectDetails and store the rest of the details in filteredDetails
          const { ProjectType, ...filteredDetails } = projectDetails;

          // Create a reference to firstly, the selected ProjectType-projects
          // and the projectDetails.name (that the user has entered into the field)
          const projectRef = doc(
            db,
            `${projectDetails.ProjectType}-projects`,
            projectDetails.name
          );

          // set the document data using the Firebase setDoc function
          // takes in 2 parameters, the reference to the location in Firebase,
          // along with the data object containing the data to be written to the document
          await setDoc(projectRef, {
            ...filteredDetails, // set the object to have filteredDetails
            image: downloadURL, // along with the image URL 
            completion: projectDetails.completion, // Ensure completion field is included
          });

          // Save awards as sub-collection
          for (const award of awards) {
            // for each award in awards array
            if (award.title.trim()) {
              // if the award is not empty (after trimming)
              // again, setDoc is used to upload data to a collection in Firebase
              await setDoc(
                // doc takes in a reference to the collection, which now is:
                // ProjectType-projects
                // name of the project
                // awards collection in the above
                doc(
                  collection(
                    db,
                    `${projectDetails.ProjectType}-projects`,
                    projectDetails.name,
                    "awards"
                  ),
                  award.title // the award title is set to be the ID within the 'awards' sub-collection
                ),
                { title: award.title } // set the data to be simply title: award.title
              );
            }
          }

          createSuccessToast(projectDetails.name); // display successToast upon successful project creation
          navigate("/admin/projects"); // navigate back to the admin dashboard
        }
      );
    } catch (error) {
      console.error("Error adding project: ", error);
      createFailureToast();
    }
  };

  // for year picker
  const handleChangeCompletion = (date: Date | null) => {
    if (date) {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        completion: date.getFullYear().toString(),
      }));
    }
  };

  return (
    <div className="create-project-ctr">
      <div className="create-project-form-ctr">
        <p className="create-project-header">Add New Project</p>
        {/* CREATE Form */}
        <form onSubmit={handleSubmit}>
          <div className="create-field">
            <label htmlFor="ProjectType" className="create-field-header">
              Select Project Type
            </label>
            <select
              id="ProjectType"
              className="create-project-type"
              name="ProjectType"
              value={projectDetails.ProjectType}
              onChange={handleChange}
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

          <div className="create-field">
            <label htmlFor="name">Upload Image File</label>
            <div className="new-project-img">
              <img
                src={imageFile ? projectDetails.image : ImagePlaceHolder}
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
            <input
              className="upload-image-input create-input"
              id="upload-image-input"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
            {errors.image && <p className="error-msg">{errors.image}</p>}
          </div>

          <div className="create-project-secondary-header">
            Enter Project Details
          </div>

          <div className="create-field">
            <label htmlFor="name" className="create-field-header">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Project Name"
              value={projectDetails.name}
              onChange={handleChange}
              className="create-input"
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>

          {projectDetails.ProjectType !== "existingBuildingRetrofit" && (
            <div className="create-field">
              <label htmlFor="developer" className="create-field-header">
                Developer
              </label>
              <input
                id="developer"
                type="text"
                name="developer"
                placeholder="Developer"
                value={projectDetails.developer}
                onChange={handleChange}
                className="create-input"
              />
              {errors.developer && (
                <p className="error-msg">{errors.developer}</p>
              )}
            </div>
          )}

          <div className="awards-field">
            <label htmlFor="awards" className="create-field-header">
              Awards
            </label>

            {awards.map((award, index) => (
              <div key={index} className="award-input-ctr">
                <input
                  type="text"
                  name="awards"
                  placeholder="Award"
                  value={award.title}
                  onChange={(e) => handleAwardChange(e, index)}
                  className="create-input"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAward(index)}
                  className="remove-award-button"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAward}
              className="add-award-button"
            >
              Add Award
            </button>
          </div>
          <div className="create-field">
            <label htmlFor="type" className="create-field-header">
              Type
            </label>
            <input
              id="type"
              type="text"
              name="type"
              placeholder="Type"
              value={projectDetails.type}
              onChange={handleChange}
              className="create-input"
            />
            {errors.type && <p className="error-msg">{errors.type}</p>}
          </div>

          <div className="create-field">
            <label htmlFor="status" className="create-field-header">
              Status
            </label>
            <select
              className={`create-project-status ${
                errors.status && "is-invalid"
              }`}
              id="status"
              name="status"
              value={projectDetails.status}
              onChange={handleChange}
            >
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
            </select>
            {errors.status && <p className="error-msg">{errors.status}</p>}
          </div>

          {projectDetails.status !== "Ongoing" && (
            <div className="create-field">
              <label htmlFor="completion" className="create-field-header">
                Completion Date
              </label>
              <DatePicker
                id="completion"
                name="completion"
                selected={
                  projectDetails.completion
                    ? new Date(parseInt(projectDetails.completion, 10), 0, 1)
                    : null
                }
                onChange={handleChangeCompletion}
                dateFormat="yyyy"
                showYearPicker
                className="create-input"
              />

              {errors.completion && (
                <p className="error-msg">{errors.completion}</p>
              )}
            </div>
          )}

          <div className="create-field">
            {projectDetails.ProjectType === "existingBuildingRetrofit" && (
              <div>
                <label htmlFor="client" className="create-field-header">
                  Client
                </label>
                <input
                  id="client"
                  type="text"
                  name="client"
                  placeholder="Client"
                  value={projectDetails.client}
                  onChange={handleChange}
                  className="create-input"
                />
                {errors.client && <p className="error-msg">{errors.client}</p>}
              </div>
            )}
          </div>

          <div className="create-field">
            <label htmlFor="location" className="create-field-header">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Location"
              value={projectDetails.location}
              onChange={handleChange}
              className="create-input"
            />
            {errors.location && <p className="error-msg">{errors.location}</p>}
          </div>

          <div className="featured-switch-ctr">
            <label htmlFor="featured" className="create-field-header">
              Featured
            </label>
            <label className="featured-switch">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={projectDetails.featured === "yes"}
                onChange={handleToggleChange}
              />
              <span className="featured-slider round"></span>
            </label>
          </div>

          <div className="create-project-button-ctr">
            <button type="submit" className="create-project-button">
              Add Project
            </button>
            <button
              type="button"
              className="cancel-project-button"
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

export default Create;
