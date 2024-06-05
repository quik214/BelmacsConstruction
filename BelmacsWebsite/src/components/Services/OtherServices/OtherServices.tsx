import "../../../assets/fonts.css";
import "./OtherServices.css";
import "./OtherServices-media.css";

import ProjectIcon from "../../../assets/Icons/OtherServices/project-mangament-consultancy.svg";
import GreenMarkIcon from "../../../assets/Icons/OtherServices/green-mark-consultancy.svg";
import MnEIcon from "../../../assets/Icons/OtherServices/m&e-registered-inspector.svg";
import FireCertIcon from "../../../assets/Icons/OtherServices/fire-certificate-renewal.svg";
import FireSafetyIcon from "../../../assets/Icons/OtherServices/fire-safety-inspection.svg";
import ElectricalIcon from "../../../assets/Icons/OtherServices/electrical-licensing.svg";

export type otherServicesItem = {
  title?: string;
  icon?: string;
};

export const otherServices: otherServicesItem[] = [
  {
    title: "Project Management Consultancy",
    icon: ProjectIcon,
  },
  {
    title: "Green Mark Consultancy",
    icon: GreenMarkIcon,
  },
  {
    title: "M&E Registered Inspector",
    icon: MnEIcon,
  },
  {
    title: "Fire Certificate Renewal",
    icon: FireCertIcon,
  },
  {
    title: "Fire Safety Inspection",
    icon: FireSafetyIcon,
  },
  {
    title: "Electrical Licensing",
    icon: ElectricalIcon,
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
