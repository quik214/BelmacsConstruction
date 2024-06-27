import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../../firebase"; // Adjust the import based on your firebase setup

import "./CompanyEdit.css";
import "./CompanyEdit-media.css";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCompany = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paramData } = location.state;
  console.log(paramData.descriptionOne);

  const [descriptionOne, setDescriptionOne] = useState(
    paramData.descriptionOne
  );
  const [descriptionTwo, setDescriptionTwo] = useState(
    paramData.descriptionTwo
  );
  const [image, setImage] = useState(paramData.image);

  const [errors, setErrors] = useState({
    descriptionOne: "",
    descriptionTwo: "",
    image: "",
  });

  const validateForm = () => {
    const newErrors = {
      descriptionOne: "",
      descriptionTwo: "",
      image: "",
    };

    if (!descriptionOne.trim()) {
      newErrors.descriptionOne = "Description One is required";
    }

    if (!descriptionTwo.trim()) {
      newErrors.descriptionTwo = "Description Two is required";
    }

    if (!image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);

    return (
      !newErrors.descriptionOne && !newErrors.descriptionTwo && !newErrors.image
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // the event that triggers this function is a change to the <input> element
    if (event.target.files && event.target.files[0]) {
      // if the event.target has a set of files, or has a single file
      setImage(event.target.files[0]); // then we will set the selectedImage to be the first file
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // this function is triggered by the form submission ('Save' button)
    event.preventDefault(); // prevent any default actions
    // if form validation does not pass, then return immediately
    if (!validateForm()) {
      return;
    }
    // if form validation does not pass, then return immediately

    try {
      const docRef = doc(db, "about-company", "about-company");
      await setDoc(docRef, { descriptionOne, descriptionTwo, image });
      toast.success("Company information updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/admin/about"); // Redirect back to admin page after saving
    } catch (error) {
      console.error("Error updating company: ", error);
      toast.error("Error updating company information.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="edit-company-ctr">
      <form onSubmit={handleSubmit}>
        <p className="edit-company-header">Edit Company</p>
        <div className="edit-field">
          <label className="edit-field-header">Image</label>
          <div className="current-img">
            {image && (
              <div>
                <img
                  src={image}
                  alt="Current Company"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-image-input"
          />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <div className="edit-field">
          <label className="edit-field-header">Description 1</label>
          <textarea
            rows={5}
            value={descriptionOne}
            onChange={(e) => setDescriptionOne(e.target.value)}
          />
          {errors.descriptionOne && (
            <p className="error">{errors.descriptionOne}</p>
          )}
        </div>
        <div className="edit-field">
          <label className="edit-field-header">Description 2</label>
          <textarea
            rows={5}
            value={descriptionTwo}
            onChange={(e) => setDescriptionTwo(e.target.value)}
          />
          {errors.descriptionTwo && (
            <p className="error">{errors.descriptionTwo}</p>
          )}
        </div>
        <div className="edit-company-button-ctr">
          <button type="submit" className="edit-company-button">
            Save
          </button>
          <button
            type="button"
            className="cancel-company-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompany;
