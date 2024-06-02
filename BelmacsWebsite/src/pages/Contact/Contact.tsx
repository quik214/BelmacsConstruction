import Hero from "../../components/Hero/Hero";

import ContactUsHeroImage from "../../assets/Hero/ContactUs.jpg";

export default function () {
  return (
    <div>
      <Hero imageUrl={ContactUsHeroImage} heroText="Contact Us" />
    </div>
  );
}
