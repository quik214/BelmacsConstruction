import "../../../assets/fonts.css";
import "./AboutCompany.css";
import "./AboutCompany-media.css";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { getDocs, collection } from "firebase/firestore";

interface Company {
  description: string;
  image: string;
}
const TheCompany: React.FC = () => {
  const [data, setData] = useState<Company[]>([]);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "about-company"));
        const companyData: Company[] = querySnapshot.docs.map(
          (doc) => doc.data() as Company
        );
        setData(companyData);

        companyData.forEach(company => console.log(company.description));
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  // for converting newlines
  const createNewLine = (companyDesc: string) => {
    return companyDesc.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="company reveal">
      {data.map((company, index) => (
        <React.Fragment key={index}>
          <div key={index} className="company-text">
            <p className="company-header">The Company</p>
            <p className="company-desc one">{createNewLine(company.description)}</p>
          </div>
          <div className="company-img-ctr">
            <img src={company.image} alt="Company" className="company-img" />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
export default TheCompany;
