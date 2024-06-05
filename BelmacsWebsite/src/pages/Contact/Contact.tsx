import Hero from "../../components/Hero/Hero";
import ContactForm from "../../components/ContactUs/ContactForm/ContactForm";

import ContactUsHeroImage from "../../assets/Hero/ContactUs.jpg";

export default function () {
  return (
    <div>
      <Hero imageUrl={ContactUsHeroImage} heroText="Contact Us" />

      <div className="container">
        <ContactForm />
      </div>
      
    </div>
  );
}
