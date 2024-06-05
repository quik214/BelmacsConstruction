import "../../../assets/fonts.css";
import "./OtherServices.css";
import "./OtherServices-media.css";

import ComplianceLogo from "../../../assets/Icons/AboutWSH/note-pencil-blue.svg";

export type otherServicesItem = {
  title?: string;
  icon?: string;
};

export const otherServices: otherServicesItem[] = [
  {
    title: "Project Management Consultancy",
    icon: ComplianceLogo,
  },
  {
    title: "Green Mark Consultancy",
    icon: ComplianceLogo,
  },
  {
    title: "M&E Registered Inspector",
    icon: ComplianceLogo,
  },
  {
    title: "Fire Certificate Renewal",
    icon: ComplianceLogo,
  },
  {
    title: "Fire Safety Inspection",
    icon: ComplianceLogo,
  },
  {
    title: "Electrical Licensing",
    icon: ComplianceLogo,
  },
];

export default function OtherServices() {
  return (
    <div className="other-services">
      <p className="other-services-header">Other Services</p>
      <p className="other-services-desc">
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
      <div className="other-services-card-container">
        {otherServices.map((service) => (
          <div className="other-services-card" key={service.title}>
            <div className="other-services-card-background">
              <div className="other-services-card-text">
                <img className="other-services-logo" src={service.icon} />
                <p className="other-services-card-title">{service.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
