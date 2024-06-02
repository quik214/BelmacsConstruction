import "../../../assets/fonts.css";
import "./ServicesTypes.css";
import "./ServicesTypes-media.css";

import { useNavigate } from "react-router-dom";

export type servicesTypeItem = {
  title?: string;
  image?: string;
  css?: string;
};

export const servicesTypes: servicesTypeItem[] = [
  {
    title: "Air Conditioning and Mechanical Ventilation",
    image: "",
    css: "Air Conditioning and Mechanical Ventilation",
  },
  {
    title: "Plumbing, Sanitary and Gas",
    image: "",
    css: "Plumbing Sanitary and Gas",
  },
  {
    title: "Fire Protection",
    image: "",
    css: "Fire Protection",
  },
  {
    title: "Swimming Pool Filtration",
    image: "",
    css: "Swimming Pool Filtration",
  },
  {
    title: "Electrical and Security",
    image: "",
    css: "Electrical and Security",
  },
  {
    title: "Lift and Escalator",
    image: "",
    css: "Lift and Escalator",
  },
  {
    title: "Building Management System",
    image: "",
    css: "Building Management System",
  },
  {
    title: "Feasibility Studies",
    image: "",
    css: "Feasibility Studies",
  },
  {
    title: "Testing and Commissioning",
    image: "",
    css: "Testing and Commissioning",
  },
  {
    title: "Authority and Submission",
    image: "",
    css: "Authority and Submission",
  },
  {
    title: "Vetting of Tenancy M&E Design",
    image: "",
    css: "Vetting of Tenancy ME Design",
  },
];

export default function ProjectsTypes() {
  return (
    <div className="services">
      <p className="services-header">Services</p>
      <p className="services-desc">
        We are a leading provider of integrated automation and control
        solutions. Specializing in customized automation systems, the company
        serves diverse industries such as marine, oil and gas, and industrial
        sectors. Our offerings include advanced engineering services, innovative
        automation products, and comprehensive system integration solutions.
        With a focus on enhancing operational efficiency, we ensure safety and
        deliver cutting-edge technology tailored to meet specific client needs.
        With a commitment to quality and reliability, Belmacs stands out as a
        trusted partner for complex automation and control projects.
      </p>

      <div className="grid-container-3-cols">
        {servicesTypes.slice(0, 7).map((type) => (
          <div
            key={type.title}
            className={`services-grid-item ${type.css?.toLowerCase().replace(/ /g, "-")}`}
          >
            <div className="overlay">{type.title}</div>
          </div>
        ))}
      </div>

      <div className="grid-container-4-cols">
        {servicesTypes.slice(7).map((type) => (
          <div
            key={type.title}
            className={`services-grid-item ${type.css?.toLowerCase().replace(/ /g, "-")}`}
          >
            <div className="overlay">{type.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
