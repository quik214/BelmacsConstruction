import "../../../assets/fonts.css";
import "./ProjectsCategory.css";
import "./ProjectsCategory-media.css";

export default function ProjectsCategory() {
  return (
    <div className="category">
      <p className="category-header">Projects</p>
      <p className="category-desc">
        We are a leading provider of integrated automation and control
        solutions. Specializing in customized automation systems, the company
        serves diverse industries such as marine, oil and gas, and industrial
        sectors. Our offerings include advanced engineering services,
        innovative automation products, and comprehensive system integration
        solutions. With a focus on enhancing operational efficiency, we ensure
        safety and deliver cutting-edge technology tailored to meet specific
        client needs. With a commitment to quality and reliability, Belmacs
        stands out as a trusted partner for complex automation and control
        projects.
      </p>

      <div className="grid-container">
        <div className="grid-item residential">
          <div className="overlay">Residential</div>
        </div>
        <div className="grid-item commercial">
          <div className="overlay">Commercial</div>
        </div>
        <div className="grid-item institutional">
          <div className="overlay">Institutional</div>
        </div>

        <div className="grid-item existing-building-retrofit">
          <div className="overlay">Existing Building Retrofit</div>
        </div>
        <div className="grid-item infrastructure">
          <div className="overlay">Infrastructure</div>
        </div>
        <div className="grid-item industrial">
          <div className="overlay">Industrial</div>
        </div>
      </div>
    </div>
  );
}
