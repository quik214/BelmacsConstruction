import AboutHero from "../../components/About/AboutHero/AboutHero"
import AboutCompany from "../../components/About/AboutCompany/AboutCompany"
import "./About.css"

export default function () {
  return (
    <div>
      <AboutHero />
      <div className="container">
        <AboutCompany />
      </div>
    </div>
  );
}
