import AboutHero from "../../components/About/AboutHero/AboutHero";
import AboutCompany from "../../components/About/AboutCompany/AboutCompany";
import AboutVM from "../../components/About/AboutVM/AboutVM";
import "./About.css";
import AboutProjects from "../../components/About/AboutProjects/AboutProjects";
import AboutPeople from "../../components/About/AboutPeople/AboutPeople";
import AboutIMS from "../../components/About/AboutIMS/AboutIMS";
import AboutWSH from "../../components/About/AboutWSH/AboutWSH";
import AboutBizSafe from "../../components/About/AboutBizSafe/AboutBizSafe";
import AboutPDPA from "../../components/About/AboutPDPA/AboutPDPA";
import AboutAchievements from "../../components/About/AboutStatistics/AboutAchievements";

export default function () {
  const reveal = () => {
    const reveals = document.querySelectorAll(
      ".reveal, .reveal-one, .reveal-two, .reveal-three"
    );

    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const revealTop = reveals[i].getBoundingClientRect().top;
      let revealPoint = 150; // Default reveal point

      // Adjust the reveal point based on the specific class
      if (reveals[i].classList.contains("reveal-one")) {
        revealPoint = 200;
      } else if (reveals[i].classList.contains("reveal-two")) {
        revealPoint = 225;
      } else if (reveals[i].classList.contains("reveal-three")) {
        revealPoint = 250;
      }

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  };

  window.addEventListener("scroll", reveal);
  document.addEventListener("DOMContentLoaded", reveal); // Initial check on page load

  // Function to run reveal after DOM content is loaded
  const runRevealAfterDOMLoaded = () => {
    reveal();
    window.addEventListener("scroll", reveal);
  };

  if (document.readyState === "loading") {
    // DOMContentLoaded has not fired yet
    document.addEventListener("DOMContentLoaded", runRevealAfterDOMLoaded);
  } else {
    // DOMContentLoaded has already fired
    runRevealAfterDOMLoaded();
  }

  return (
    <div>
      <AboutHero />

      <div className="container">
        <AboutCompany />
      </div>

      <div className="out-container">
        <AboutVM />
      </div>

      <div className="container">
        <AboutProjects />
        <AboutPeople />
      </div>

      <div className="out-container">
        <AboutAchievements />
      </div>

      <div className="container">
        <AboutIMS />
        <AboutWSH />
      </div>

      <div className="out-container">
        <AboutBizSafe />
      </div>

      <div className="container">
        <AboutPDPA />
      </div>

      <div className="out-container"></div>
    </div>
  );
}
