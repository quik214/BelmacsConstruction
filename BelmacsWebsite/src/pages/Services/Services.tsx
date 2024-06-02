import Hero from "../../components/Hero/Hero";

import ServicesHeroImage from "../../assets/Hero/Services.jpg";

export default function Services() {
  return (
    <div>
      <Hero imageUrl={ServicesHeroImage} heroText="Our Services" />
    </div>
  );
}
