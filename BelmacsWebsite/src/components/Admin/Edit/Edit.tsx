import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { db } from "../../../firebase";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Edit.css";
import "./Edit-media.css";

interface Project {
  image: string;
  name: string;
  developer: string;
  type: string;
  completion: string;
  client: string;
  location: string;
  featured: "yes" | "no";
  awards: string[];
}

const EditProject: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [oldId] = useState<string>(id || "");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | File | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<string>(
    type || "residential"
  );
  const [editSuccess, setEditSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // for form errors
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [awards, setAwards] = useState<string[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !type) return;

      try {
        const docRef = doc(db, `${type}-projects`, oldId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const projectData = docSnap.data() as Project;
          setProject(projectData);

          // Fetch awards from sub-collection
          const awardsCollectionRef = collection(docRef, "awards");
          const awardsSnapshot = await getDocs(awardsCollectionRef);
          const awardsData = awardsSnapshot.docs.map((doc) => doc.data().title);

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
  }, [id, type]);

  useEffect(() => {
    if (project) {
      if (selectedType !== "existingBuildingRetrofit") {
        setProject((prevProject) => ({
          ...prevProject!,
          client: "",
        }));
      } else {
        setProject((prevProject) => ({
          ...prevProject!,
          developer: "",
        }));
      }
    }
  }, [selectedType]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (project) {
      setProject({ ...project, [name]: value });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleAwardChange = (index: number, value: string) => {
    const newAwards = [...awards];
    newAwards[index] = value;
    setAwards(newAwards);
  };

  const handleAddAward = () => {
    setAwards([...awards, ""]);
  };

  const handleRemoveAward = (index: number) => {
    const newAwards = awards.filter((_, i) => i !== index);
    setAwards(newAwards);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!project || !type) return;

    const storage = getStorage();
    let imageUrl = project.image;

    try {
      if (selectedImage instanceof File) {
        // If a new image is uploaded
        const imageFormat = selectedImage.type.split("/")[1]; // Extract format from MIME type
        const newImageRef = ref(
          storage,
          `belmacs_images/${selectedType}/${project.name}.${imageFormat}`
        );

        // Upload new image
        await uploadBytes(newImageRef, selectedImage);
        imageUrl = await getDownloadURL(newImageRef);

        // If project name or type changed, delete the old image
        if (
          project.image &&
          (project.name !== oldId || type !== selectedType)
        ) {
          const oldImageRef = ref(storage, project.image);
          await deleteObject(oldImageRef);
        }
      } else if (type !== selectedType || project.name !== oldId) {
        // If type or name has changed and no new image is uploaded, re-upload the old image
        const oldImageRef = ref(storage, project.image);

        // Fetch the old image and re-upload it
        const oldImageUrl = await getDownloadURL(oldImageRef);
        const response = await fetch(oldImageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch old image.");
        }
        const blob = await response.blob();
        const newImageRef = ref(
          storage,
          `belmacs_images/${selectedType}/${project.name}.${
            blob.type.split("/")[1]
          }`
        );

        await uploadBytes(newImageRef, blob);
        imageUrl = await getDownloadURL(newImageRef);

        // Delete the old image if necessary
        await deleteObject(oldImageRef);
      }

      // Delete the old document
      const oldProjectRef = doc(db, `${type}-projects`, oldId);
      await deleteDoc(oldProjectRef);

      // Delete the old awards subcollection
      const oldAwardsCollectionRef = collection(oldProjectRef, "awards");
      const oldAwardsSnapshot = await getDocs(oldAwardsCollectionRef);
      const deleteAwardsPromises = oldAwardsSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await Promise.all(deleteAwardsPromises);

      // Add project details to the new collection
      const newProjectRef = doc(db, `${selectedType}-projects`, project.name);
      await setDoc(newProjectRef, { ...project, image: imageUrl });


      // Filter out empty awards
      const filteredAwards = awards.filter((award) => award.trim() !== "");

      // Add awards as a subcollection with award title as document ID
      const awardsCollectionRef = collection(newProjectRef, "awards");
      await Promise.all(
        filteredAwards.map(async (award) => {
          await setDoc(doc(awardsCollectionRef, award), { title: award });
        })
      );

      // show toast
      editSuccessToast(project.name);

      // hides the entire form upon success
      setEditSuccess(true);

      // navigates the user back to dashboard
      navigate("/admin/dashboard");
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
        Successfully edited <b>{projectName}</b>, redirecting you to the
        dashboard
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
            <label className="edit-field-header">Image</label>
            <div className="current-img">
              {project.image && (
                <div>
                  <img
                    src={project.image}
                    alt="Current Project"
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

          {project.completion && (
            <div className="edit-field">
              <label className="edit-field-header">Completion</label>

              <input
                type="text"
                name="completion"
                value={project.completion}
                onChange={handleInputChange}
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
