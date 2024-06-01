import "../../../assets/fonts.css";
import "./ProjectsCategory.css";
import "./ProjectsCategory-media.css";

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

export default function ProjectsCategory() {
  return (
    <div className="category">
      <p className="category-header">Projects</p>
      <p className="category-desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
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
