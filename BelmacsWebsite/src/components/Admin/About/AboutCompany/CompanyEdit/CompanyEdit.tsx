import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../../firebase"; // Adjust the import based on your firebase setup

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import "./CompanyEdit.css";
import "./CompanyEdit-media.css";

// toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// for placeholder image

import ImagePlaceHolder from "../../../../../assets/Icons/AdminDashboard/empty-image-placeholder.png";

const EditCompany = () => {
  interface Company {
    image: string;
    description: string;
  }

  const navigate = useNavigate();

  const location = useLocation();

  const [company, setCompany] = useState<Company>({
    description: "",
    image: "",
  });

  const [description, setDescription] = useState(company.description);
  const [originalImageUrl, setOriginalImageUrl] = useState(company.image);
  const [selectedImage, setSelectedImage] = useState<string | File | null>( // useState to set the selectedImage
    null
  );

  const [errors, setErrors] = useState({
    description: "",
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (location.state?.paramData) {
        const { description, image } = location.state.paramData;
        setDescription(description);
        setOriginalImageUrl(image);
        setCompany({ description, image });
      } else {
        try {
          const docRef = doc(db, "about-company", "about-company");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Company;
            setDescription(data.description);
            setOriginalImageUrl(data.image);
            setCompany(data);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    };

    fetchData();
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {
      description: "",
      image: "",
    };

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return !newErrors.description && !newErrors.image;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (company) {
          setCompany({ ...company, image: reader.result as string });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      // Restore original image if the input is cleared
      if (company && originalImageUrl) {
        setCompany({ ...company, image: originalImageUrl });
        setSelectedImage(null);
      }
    }
  };

  const editErrorToast = () => {
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
  const editSuccessToast = () => {
    toast.success(<div>Successfully edited <b>Company Details</b></div>, {
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

  const handleSubmit = async (event: React.FormEvent) => {
    // this function is triggered by the form submission ('Save' button)
    event.preventDefault(); // prevent any default actions
    // if form validation does not pass, then return immediately
    if (!validateForm()) {
      return;
    }
    // if form validation does not pass, then return immediately

    const storage = getStorage(); // return an instance of our Firebase storage
    let imageUrl = company.image; // imageUrl assigned the value of person.image

    try {
      // if the user uploads a new image
      if (selectedImage instanceof File) {
        // If a new image is uploaded
        const imageFormat = selectedImage.type.split("/")[1]; // Extract image file format from MIME type
        // given an image file name such as "belmacs/jpg", we split it into an array, and then get the jpg part only (which we assign to imageFormat)

        // create a reference to the image using the type, name, and imageFormat
        const newImageRef = ref(
          storage,
          `belmacs_images/about/company/company_image.${imageFormat}`
        );

        // Upload new image
        await uploadBytes(newImageRef, selectedImage); // upload the image to the reference location
        imageUrl = await getDownloadURL(newImageRef); // get the download URL for the newly uploaded image

        // updatedPerson is a Person object that will store the person data, but with the new image URL (if there is one)
        const updatedCompany = { ...company, image: imageUrl };

        // set the reference to the new person name, and update the reference document with the updatedPerson object data
        const newDocRef = doc(db, `about-company`, `about-company`);
        await setDoc(newDocRef, updatedCompany);

        editSuccessToast();
        setTimeout(() => {
          navigate("/admin/about");
        }, 1000); // navigate back to /admin/about after 1 second
      } else {
        const updatedCompany = { ...company };

        // set the reference to the new person name, and update the reference document with the updatedPerson object data
        const newDocRef = doc(db, `about-company`, `about-company`);
        await setDoc(newDocRef, updatedCompany);

        editSuccessToast();
        setTimeout(() => {
          navigate("/admin/about");
        }, 1000); // navigate back to /admin/about after 1 second
      }
    } catch (error) {
      console.error("Error updating person: ", error);
      editErrorToast();
    }
  };

  // for converting newlines
  const createNewLine = (companyDesc: String) => {
    return companyDesc.replace(/\\n/g, "\n");
  };

  return (
    <div className="edit-company-ctr">
      <form onSubmit={handleSubmit}>
        <p className="edit-company-header">Edit Company</p>
        <div className="edit-field">
          <div>
            <div className="edit-image-field">
              <div className="edit-current-new-comapny-img-ctr">
                <div className="edit-current-company-img-ctr">
                  <label className="edit-field-header">Current Image</label>
                  <div className="current-img">
                    {company?.image && (
                      <div>
                        <img
                          src={originalImageUrl}
                          alt="Current Image"
                          className="current-company-img"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="edit-new-company-img-ctr">
                  <label className="edit-field-header">New Image</label>
                  <div className="new-img">
                    <img
                      src={selectedImage ? company.image : ImagePlaceHolder}
                      alt="New Image"
                      className="new-company-img"
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
          </div>
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <div className="edit-field">
          <label className="edit-field-header">Description</label>
          <textarea
            rows={5}
            value={createNewLine(company.description)}
            onChange={(e) => {
              setDescription(e.target.value);
              setCompany({ ...company, description: e.target.value });
            }}
          />
          {errors.description && <p className="error">{errors.description}</p>}
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
