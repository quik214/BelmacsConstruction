import AboutHero from "../../components/About/AboutHero/AboutHero"
import AboutCompany from "../../components/About/AboutCompany/AboutCompany"
import "./About.css"

export default function () {
  const reveal = () => {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var revealTop = reveals[i].getBoundingClientRect().top;
      var revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add('active');
      } else {
        reveals[i].classList.remove('active');
      }
    }
  }

  window.addEventListener("scroll", reveal);

  return (
    <div>
      <AboutHero />
      <div className="container">
        <AboutCompany />
      </div>
    </div>
  );
}
