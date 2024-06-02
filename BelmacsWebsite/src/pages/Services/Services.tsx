import ServicesTypes from "../../components/Services/ServicesTypes/ServicesTypes";
import Hero from "../../components/Hero/Hero";

import ServicesHeroImage from "../../assets/Hero/Services.jpg";

export default function Services() {
  return (
    <div>
      <Hero imageUrl={ServicesHeroImage} heroText="Our Services" />
      <div className="container">
        <ServicesTypes />
      </div>
    </div>
  );
}
