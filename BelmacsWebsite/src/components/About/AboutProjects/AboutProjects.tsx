import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./AboutProjects.css";
import "./AboutProjects-media.css";

import Asana from "../../../assets/About/AboutProjects/asana.png";
import ClementiWoods from "../../../assets/About/AboutProjects/clementi-woods.jpg";
import DesignOrchard from "../../../assets/About/AboutProjects/design-orchard.png";
import FlamingoValley from "../../../assets/About/AboutProjects/flamingo.png";

export default function AboutProjects() {
  const data = [
    {
      img: Asana,
      project: "The Asana",
      location: "Tampines Street 86",
    },
    {
      img: DesignOrchard,
      project: "Design Orchard",
      location: "Orchard Road",
    },
    {
      img: ClementiWoods,
      project: "Clementi Woods",
      location: "West Coast Road",
    },
    {
      img: FlamingoValley,
      project: "Flamingo Valley",
      location: "Siglap Road",
    },
  ];

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    arrows: false,

    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="projects reveal">
      <p className="projects-header">Our Projects</p>
      <div className="flex-container">
        <Slider {...settings}>
          {data.map((d) => (
            <div className="card" key={d.project}>
              <img className="card-img" src={d.img} />
              <div className="card-text-container">
                <p className="card-header">{d.project}</p>
                <div className="card-desc-container">
                  <p className="card-desc">{d.location}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
