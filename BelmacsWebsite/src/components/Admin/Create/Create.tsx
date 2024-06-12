import "./Create.css";
import "./Create-media.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { setDoc, doc } from "firebase/firestore";

const Create: React.FC = () => {
  const [projectDetails, setProjectDetails] = useState({
    image: "",
    name: "",
    developer: "",
    awards: "",
    type: "residential",
    completion: "",
    client: "",
    location: "",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(
        doc(db, `${projectDetails.type}-projects`, projectDetails.name),
        projectDetails
      );
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  return (
    <div className="create-project-ctr">
      <div className="create-project-header">
        Add New Project
      </div>
      <div className="create-project-form-ctr">
        <form onSubmit={handleSubmit}>
          <label htmlFor="type">Select Project Type</label>
          <select
            id="type"
            className="create-project-type"
            name="type"
            value={projectDetails.type}
            onChange={handleChange}
            required
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


          <div className="create-project-secondary-header">
            Enter Project Details:
          </div>
          
          <label htmlFor="name">Project Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Project Name"
            value={projectDetails.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="developer">Developer</label>
          <input
            id="developer"
            type="text"
            name="developer"
            placeholder="Developer"
            value={projectDetails.developer}
            onChange={handleChange}
            required
          />

          <label htmlFor="awards">Awards</label>
          <input
            id="awards"
            type="text"
            name="awards"
            placeholder="Awards"
            value={projectDetails.awards}
            onChange={handleChange}
          />

          <label htmlFor="completion">Completion Date</label>
          <input
            id="completion"
            type="date"
            name="completion"
            placeholder="Completion Date"
            value={projectDetails.completion}
            onChange={handleChange}
            required
          />

          <label htmlFor="client">Client</label>
          <input
            id="client"
            type="text"
            name="client"
            placeholder="Client"
            value={projectDetails.client}
            onChange={handleChange}
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            placeholder="Location"
            value={projectDetails.location}
            onChange={handleChange}
            required
          />
          
          <div className="create-project-button-ctr">
            <button type="submit" className="create-project-button">Add Project</button>
            <button type="button" className="cancel-project-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
