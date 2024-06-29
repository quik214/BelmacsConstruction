import "./CompanyDashboard.css";
import "./CompanyDashboard-media.css";

import EditIcon from "../../../../../assets/Icons/AdminDashboard/pencil-simple.svg";

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db /*storage*/ } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";

// About object to store each Project's values
interface Company {
  description: String;
  image: string;
}

const About: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const docRef = doc(db, "about-company", "about-company");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompany(docSnap.data() as Company); // convert the data to Object form with description and image properties
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching Company: ", error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  const handleEditCompany = () => {
    navigate("/admin/about/company/edit", {
      state: { paramData: company }, // push Company object to be stored in the next page's state **
    });
  };

  const createNewLine = (companyDesc: String) => {
    return companyDesc.replace(/\\n/g, "\n");
  };

  return (
    <div className="company-ctr">
      <div className="company-header">The Company</div>

      <div className="company-table-ctr">
        {company && (
          <table className="company-table">
            <thead>
              <tr>
                <th>Company Image</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src={company.image}
                    alt={"Company image"}
                    className="company-image"
                  />
                </td>
                <td>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {createNewLine(company.description)}
                  </p>
                </td>
                <td className="table-actions">
                  <button
                    className="action-button edit-button"
                    onClick={handleEditCompany}
                  >
                    <img src={EditIcon} alt="Edit" className="action-icons" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default About;
