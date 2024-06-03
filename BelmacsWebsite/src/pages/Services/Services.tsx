import ServicesTypes from "../../components/Services/ServicesTypes/ServicesTypes";
import OtherServices from "../../components/Services/OtherServices/OtherServices";
import Hero from "../../components/Hero/Hero";

import ServicesHeroImage from "../../assets/Hero/Services.jpg";

export default function Services() {
  return (
    <div>
      <Hero imageUrl={ServicesHeroImage} heroText="Our Services" />
      <div className="container">
        <ServicesTypes />
        <OtherServices />
      </div>
    </div>
  );
}
