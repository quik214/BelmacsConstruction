import AboutHero from "../../components/About/AboutHero/AboutHero";
import AboutCompany from "../../components/About/AboutCompany/AboutCompany";
import AboutVM from "../../components/About/AboutVM/AboutVM";
import "./About.css";

export default function () {
  const reveal = () => {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var revealTop = reveals[i].getBoundingClientRect().top;
      var revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  };

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
        <AboutVM />
      </div>
    </div>
  );
}
