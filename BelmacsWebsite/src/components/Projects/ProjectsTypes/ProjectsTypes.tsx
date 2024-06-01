import "../../../assets/fonts.css";
import "./ProjectsTypes.css";
import "./ProjectsTypes-media.css";
// Link (for working with react-router)
import { Link } from "react-router-dom";

const category = [
  "residential",
  "commercial",
  "infrastructure",
  "existingBuildingRetrofit",
  "institutional",
  "industrial",
];

export default function ProjectsTypes() {
  return (
    <div className="category">
      <p className="category-header">Projects</p>
      <p className="category-desc">
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

      <div className="grid-container">
        <Link to={`/projects/${category[0]}`} className="grid-item residential">
          <div className="overlay">Residential</div>
        </Link>
        <Link to={`/projects/${category[1]}`} className="grid-item commercial">
          <div className="overlay">Commercial</div>
        </Link>
        <Link
          to={`/projects/${category[2]}`}
          className="grid-item infrastructure"
        >
          <div className="overlay">Infrastructure</div>
        </Link>

        <Link
          to={`/projects/${category[3]}`}
          className="grid-item existing-building-retrofit"
        >
          <div className="overlay">Existing Building Retrofit</div>
        </Link>
        <Link
          to={`/projects/${category[4]}`}
          className="grid-item institutional"
        >
          <div className="overlay">Institutional</div>
        </Link>
        <Link to={`/projects/${category[5]}`} className="grid-item industrial">
          <div className="overlay">Industrial</div>
        </Link>
      </div>
    </div>
  );
}
