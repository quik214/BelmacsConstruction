import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../../../firebase";

import "./Edit.css";

interface Project {
  image: string;
  name: string;
  developer: string;
  awards: string;
  type: string;
  completion: string;
  client: string;
  location: string;
}

const EditProject: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [oldId, setOldId] = useState<string>(id || ""); // State variable for old id
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | File | null>(null);
  const [selectedType, setSelectedType] = useState<string>(type || "residential");
  const [editSuccess, setEditSuccess] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !type) return;

      try {
        const docRef = doc(db, `${type}-projects`, oldId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const projectData = docSnap.data() as Project;
          setProject(projectData);
          setSelectedImage(projectData.image); // Set the selected image to the current image URL
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!project || !type) return;

    const storage = getStorage();
    let imageUrl = project.image;

    try {
      // Delete the old document
      const oldProjectRef = doc(db, `${type}-projects`, oldId);
      await deleteDoc(oldProjectRef);

      if (selectedImage instanceof File) {
        // Delete the old image if a new image is uploaded
        const oldImageRef = ref(storage, project.image);
        if (project.image) {
          await deleteObject(oldImageRef);
        }

        if (type !== selectedType) {
          // Upload new image
          const newImageRef = ref(storage, `belmacs_images/${selectedType}/${project.name}`);
          await uploadBytes(newImageRef, selectedImage);
          imageUrl = await getDownloadURL(newImageRef);
        } else {
          // Upload new image
          const newImageRef = ref(storage, `belmacs_images/${type}/${project.name}`);
          await uploadBytes(newImageRef, selectedImage);
          imageUrl = await getDownloadURL(newImageRef);
        }

        
      } else {
        // Re-upload the old image to the new location if no new image is uploaded
        const oldImageRef = ref(storage, project.image);

        if (type !== selectedType) {
          const newImageRef = ref(storage, `belmacs_images/${selectedType}/${project.name}`);
          const imageSnapshot = await getDownloadURL(oldImageRef);
          await uploadBytes(newImageRef, await fetch(imageSnapshot).then(res => res.blob()));
          imageUrl = await getDownloadURL(newImageRef);
        } else {
          const newImageRef = ref(storage, `belmacs_images/${type}/${project.name}`);
          const imageSnapshot = await getDownloadURL(oldImageRef);
          await uploadBytes(newImageRef, await fetch(imageSnapshot).then(res => res.blob()));
          imageUrl = await getDownloadURL(newImageRef);
        }
      }

      // Add project details to the new collection
      const newProjectRef = doc(db, `${selectedType}-projects`, oldId);
      await setDoc(newProjectRef, { ...project, image: imageUrl });

      setNotification({
        message: "Project updated successfully, redirecting you to the dashboard",
        type: "success",
      });
      setEditSuccess(true);
      setTimeout(() => {
        setNotification(null);
        navigate(-1); // Go back to the previous page after a delay
      }, 2500);
    } catch (error) {
      console.error("Error updating project: ", error);
      setNotification({ message: "Error updating project", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-project-ctr">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {!editSuccess && project && (
        <form onSubmit={handleSubmit}>
          <p className="edit-project-header">Edit Project</p>

          <div className="edit-project-fields">
            <label>Project Type</label>
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
            </select>
          </div>

          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Image</label>
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

          {selectedType !== "existingBuildingRetrofit" && (<div>
            <label>Developer</label>
            <input
              type="text"
              name="developer"
              value={project.developer}
              onChange={handleInputChange}
            />
          </div>)}

          <div>
            <div className="awards">
              <label className="awards-header">Awards </label>(\n to separate awards)
            </div>

            <textarea
              name="awards"
              value={project.awards}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={project.type}
              onChange={handleInputChange}
            />
          </div>

          {project.completion && (<div>
            <label>Completion</label>

            <input
              type="text"
              name="completion"
              value={project.completion}
              onChange={handleInputChange}
            />
          </div>)}

          {selectedType === "existingBuildingRetrofit" && (<div>
            <label>Client</label>
            <input
              type="text"
              name="client"
              value={project.client}
              onChange={handleInputChange}
            />
          </div>)}

          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={project.location}
              onChange={handleInputChange}
            />
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
