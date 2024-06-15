import "./Create.css";
import "./Create-media.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { setDoc, doc } from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create: React.FC = () => {
  const [projectDetails, setProjectDetails] = useState({
    image: "",
    name: "",
    developer: "",
    awards: "",
    type: "",
    completion: "",
    client: "",
    location: "",
    featured: "no",
    ProjectType: "residential",
  });

  // useState function with array to hold error messages
  const [errors, setErrors] = useState({
    image: "",
    name: "",
    developer: "",
    awards: "",
    type: "",
    completion: "",
    client: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // for toggle switch (project.featured)
  const handleToggleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { name } = e.target;
    const currentFeaturedValue =
      projectDetails.featured === "yes" ? "no" : "yes";
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: currentFeaturedValue,
    }));
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

  // form validation function
  const validate = () => {
    const newErrors = {
      image: "",
      name: "",
      developer: "",
      awards: "",
      type: "",
      completion: "",
      client: "",
      location: "",
    };
    let isValid = true;

    if (!projectDetails.name.trim()) {
      newErrors.name = "Project name is required";
      isValid = false;
    }

    if (!projectDetails.developer.trim()) {
      newErrors.developer = "Developer is required";
      isValid = false;
    }

    if (!projectDetails.completion.trim()) {
      newErrors.completion = "Completion date is required";
      isValid = false;
    }

    if (!projectDetails.type.trim()) {
      newErrors.completion = "Type is required";
      isValid = false;
    }

    if (!projectDetails.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    if (!imageFile) {
      newErrors.image = "Image file is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!imageFile) {
    //   alert("Please select an image file");
    //   return;
    // }

    if (!validate() || !imageFile) {
      createErrorToast();
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(
        storage,
        `belmacs_images/${projectDetails.ProjectType}/${projectDetails.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (_snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          console.error("Error uploading file: ", error);
        },
        async () => {
          // Get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Destructure projectType out of projectDetails and assign the rest to filteredDetails
          const { ProjectType, ...filteredDetails } = projectDetails;

          // Save project details along with image URL in Firestore
          await setDoc(
            doc(
              db,
              `${projectDetails.ProjectType}-projects`,
              projectDetails.name
            ),
            {
              ...filteredDetails,
              image: downloadURL,
            }
          );
          createSuccessToast(projectDetails.name);

          navigate("/admin/dashboard");
        }
      );
    } catch (error) {
      console.error("Error adding project: ", error);
      createFailureToast();
    }
  };

  return (
    <div className="create-project-ctr">
      <div className="create-project-header">Add New Project</div>
      <div className="create-project-form-ctr">
        <form onSubmit={handleSubmit}>
          <label htmlFor="ProjectType">Select Project Type</label>
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

          <label htmlFor="name">Upload Image File</label>
          <input
            className="upload-image-input create-input"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {errors.image && <p className="error-msg">{errors.image}</p>}

          <div className="create-project-secondary-header">
            Enter Project Details:
          </div>

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
          {errors.developer && <p className="error-msg">{errors.developer}</p>}

          <div className="awards-field">
            <label htmlFor="awards" className="create-field-header">
              Awards
            </label>
            (\n to separate awards)
          </div>

          <input
            id="awards"
            type="text"
            name="awards"
            placeholder="Awards"
            value={projectDetails.awards}
            onChange={handleChange}
            className="create-input"
          />
          {errors.awards && <p className="error-msg">{errors.awards}</p>}

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

          <label htmlFor="completion" className="create-field-header">
            Completion Date
          </label>
          <input
            id="completion"
            type="text"
            name="completion"
            placeholder="Completion Date"
            value={projectDetails.completion}
            onChange={handleChange}
            className="create-input"
          />
          {errors.completion && (
            <p className="error-msg">{errors.completion}</p>
          )}

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

          <div className="featured-switch-ctr">
            <label htmlFor="featured" className="create-featured-header">
              Featured
            </label>
            <label className="featured-switch">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                value={projectDetails.featured}
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
