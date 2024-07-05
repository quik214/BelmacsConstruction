import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

import "./ProjectTypeEdit.css";
import "./ProjectTypeEdit-media.css";

import ImageLandscapePlaceHolder from "../../../../assets/Admin/placeholder-landscape.png";
import ImagePortraitPlaceHolder from "../../../../assets/Icons/AdminDashboard/empty-image-placeholder.png";

// create a Project object
interface ProjectType {
  title: string;
  image: string;
  path: string;
  type: string;
}

const EditProjectType: React.FC = () => {
  const { title } = useParams<{ title: string }>(); // useParams used to retrieve the id from the URL
  const [projectType, setProjectType] = useState<ProjectType | null>(null); // useState used to modify the project variable (of type Project)
  // project can either be Project or null - which means that there may be no project data available
  const [loading, setLoading] = useState<boolean>(true); // useState used to set the loading variable
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | File | null>( // useState to set the selectedImage
    null
  );
  const [imageClass, setImageClass] = useState<string>(""); // state for CSS class
  const navigate = useNavigate(); // function used for navigation (in later parts of code)

  // for form errors
  // errors is a variable that consists of an array of key-value pairs
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // ** USEEFFECT FOR ID OR TYPE CHANGE ** // - basically triggered whenever we click on the 'Edit' button in the Dashboard
  // useEffect is run whenever the id or type variables change
  useEffect(() => {
    // define a fetchPerson function (obviously used to fetch person) within this useEffect
    const fetchProjectType = async () => {
      if (!title) return;

      try {
        const docRef = doc(db, `project-types`, title); // set the reference to point to the people, and the oldId (document id)
        const docSnap = await getDoc(docRef); // gets the document snapshot from Firebase, basically just represents the document

        // if the document exists, then perform the following
        if (docSnap.exists()) {
          const projectTypeData = docSnap.data() as ProjectType; // set projectTypeDatato be a Person object that essentially contains all the data from the snapshot
          setProjectType(projectTypeData); // set the person to be projectTypeData using setPerson (which we will later display in the HTML)

          setOriginalImageUrl(projectTypeData.image);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching ptoject Type: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectType();
  }, [title]); // the useEffect will only run whenever there is a change to the id or type
  // this means that whenever we click the 'Edit' button (in the Dashboard), then there will be a change to this file (page)'s id and type
  // (since we have the useParams to change them )
  // thus triggering this useEffect() function run and perform the above

  // ** FUNCTION FOR FIELD CHANGE ** //
  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > // event coming from <input> and <textarea> elements (depending on what is changed)
    // the events trigger this function
  ) => {
    const { name, value } = event.target; // destructure the name and value from the elements, and assign to name and value
    if (projectType) {
      // if project exists (used to ensure that the project is not undefined or null before updating its state)
      setProjectType({ ...projectType, [name]: value }); // use existing key-value (values) in project, and set the key with name to the value
    }
  };

  // ** FUNCTION FOR HANDLING IMAGE CHANGE ** //
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (projectType) {
          setProjectType({ ...projectType, image: reader.result as string });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      // Restore original image if the input is cleared
      if (projectType && originalImageUrl) {
        setProjectType({ ...projectType, image: originalImageUrl });
        setSelectedImage(null);
      }
    }
  };

  // ** FUNCTION FOR HANDLING EDIT FORM SUBMIT ** //
  const handleSubmit = async (event: React.FormEvent) => {
    // this function is triggered by the form submission ('Save' button)
    event.preventDefault(); // prevent any default actions

    // if form validation does not pass, then return immediately
    if (!validateForm()) {
      return;
    }

    // if there is no project type and no type, we return
    // this is simply used for checking
    if (!projectType) return;

    const storage = getStorage(); // return an instance of our Firebase storage
    let imageUrl = projectType.image; // imageUrl assigned the value of project.image

    try {
      // if the user uploads a new image
      if (selectedImage instanceof File) {
        // If a new image is uploaded
        const imageFormat = selectedImage.type.split("/")[1]; // Extract image file format from MIME type
        // given an image file name such as "belmacs/jpg", we split it into an array, and then get the jpg part only (which we assign to imageFormat)

        // create a reference to the image using the type, name, and imageFormat
        const newImageRef = ref(
          storage,
          `belmacs_images/project-types/${projectType.title}.${imageFormat}`
        );

        // Upload new image
        await uploadBytes(newImageRef, selectedImage); // upload the image to the reference location
        imageUrl = await getDownloadURL(newImageRef); // get the download URL for the newly uploaded image
        // Delete the old image
      }

      // updatedprojectType is a project type object that will store the person data, but with the new image URL (if there is one)
      const updatedprojectType = { ...projectType, image: imageUrl };

      // set the reference to the new person name, and update the reference document with the updatedprojectType object data
      const newDocRef = doc(db, `project-types`, projectType.title);
      await setDoc(newDocRef, updatedprojectType);

      editSuccessToast(projectType.title);
      setTimeout(() => {
        navigate("/admin/projects");
      }); // navigate back to /admin/about after 1 second
    } catch (error) {
      console.error("Error updating Project type: ", error);
      toast.error("Failed to update Project type."); // error update message
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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

    if (!projectType?.title) {
      newErrors.name = "Title is required.";
    }
    if (!projectType?.type) {
      newErrors.type = "Type is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="edit-project-type-ctr">
      <div className="edit-project-type-header">
        Edit Project Category Image
      </div>
      {projectType && (
        <form onSubmit={handleSubmit}>
          <div className="edit-field">
            <label htmlFor="title">Category</label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectType.title}
              disabled
              onChange={handleInputChange}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="edit-field">
            <label htmlFor="type">Image Orientation</label>
            <input
              type="text"
              id="type"
              name="type"
              value={projectType.type}
              disabled
              onChange={handleInputChange}
            />
            {errors.type && <span className="error">{errors.type}</span>}
          </div>
          <div className="edit-image-field">
            <div className="edit-current-new-project-type-img-ctr">
              <div className="edit-current-project-type-img-ctr">
                <label className="edit-field-header">Current Image</label>
                <div className="current-img">
                  {projectType?.image && (
                    <div>
                      <img
                        src={
                          originalImageUrl
                            ? originalImageUrl
                            : projectType.image
                        }
                        alt="Current Image"
                        className={`current-project-type-img ${
                          projectType.type === "Landscape"
                            ? "landscape-img"
                            : "portrait-img"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="edit-new-project-type-img-ctr">
                <label className="edit-field-header">New Image</label>
                <div className="new-project-type-img">
                  <img
                    src={
                      selectedImage 
                        ? projectType.image 
                        : (projectType.type === "Landscape" ? ImageLandscapePlaceHolder : ImagePortraitPlaceHolder)
                    }
                    alt="New Image"
                    className={`new-project-type-img ${
                      projectType.type === "Landscape"
                        ? "landscape-img"
                        : "portrait-img"
                    }`}
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

          <div className="edit-project-type-button-ctr">
            <button type="submit" className="edit-project-type-button">
              Save
            </button>
            <button
              type="button"
              className="cancel-project-type-button"
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

export default EditProjectType;
