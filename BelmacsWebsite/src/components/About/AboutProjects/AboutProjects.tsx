import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AboutProjects.css";
import "./AboutProjects-media.css";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";



import LocationIcon from "../../../assets/About/AboutProjects/map-pin.svg";
import AwardIcon from "../../../assets/About/AboutProjects/medal.svg";

interface Award {
  title: string;
}

interface Project {
  name: string;
  image: string;
  location: string;
  awards?: Award[];
  totalAwards: number;
}

const AboutProjects: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const projectTypes = [
    "residential-projects",
    "industrial-projects",
    "commercial-projects",
    "institutional-projects",
    "existingBuildingRetrofit-projects",
    "infrastructure-projects",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const allProjects: Project[] = [];

      try {
        for (const type of projectTypes) {
          const q = query(collection(db, type), where("featured", "==", "yes"));
          const querySnapshot = await getDocs(q);
          for (const doc of querySnapshot.docs) {
            const projectData = doc.data() as Project;
            const awardsSnapshot = await getDocs(
              collection(db, `${type}/${doc.id}/awards`)
            );
            const awards: Award[] = awardsSnapshot.docs.map(
              (awardDoc) => awardDoc.data() as Award
            );
            const totalAwards = awards.length;
            allProjects.push({ ...projectData, awards, totalAwards });
          }
        }
        setData(allProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchData();
  }, []);

  const slidesToShow = Math.min(Math.max(data.length, 1), 3); // Ensure at least 1 slide is shown, and at most 3
  const slidesToScroll = Math.min(Math.max(data.length, 1), 3); // Ensure at least 1 slide is scrolled, and at most 3

  const settings = {
    dots: true,
    infinite: data.length > 1,
    speed: 2500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const calculateTransform = (totalAwards: number): string => {
    return `translateY(${-35 * totalAwards}px)`;
  };

  const calculateBottom = (totalAwards: number): string => {
    return `${-30 * totalAwards + 1}px`;
  };

  const navigateProjectPage = () => {
    navigate("/projects");
  };

  return (
    <div className="projects reveal">
      <p className="projects-header">Featured Projects</p>
      <div className="flex-container">
        <Slider {...settings}>
          {data.map((d, index) => (
            <div
              onClick={navigateProjectPage}
              className="project-card"
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img className="card-img" src={d.image} alt={d.image} />
              <div
                className="card-text-container"
                style={{
                  transform:
                    hoveredIndex === index
                      ? calculateTransform(d.totalAwards >= 5 ? 0 : d.totalAwards)
                      : "translateY(0)",
                  transition: "transform 0.3s ease"
                }}
              >
                <div className ="ribbon ribbon-edge">{d.totalAwards} {d.totalAwards === 1 ? 'Award' : 'Awards'}</div>
                <div className="card-header">{d.name}</div>
                <div className="card-desc-container">
                  <img
                    src={LocationIcon}
                    alt="Location Icon"
                    className="location-icon"
                  />
                  <div className="card-desc">{d.location}</div>
                </div>
                {d.awards && d.awards.length > 0 && (
                  <div
                    className="awards-container"
                    style={{
                      bottom:
                        hoveredIndex === index
                        ? calculateBottom(d.totalAwards >= 5 ? 0 : d.totalAwards)
                        : calculateBottom(d.totalAwards >= 5 ? 0 : d.totalAwards),
                      transition: "bottom 0.3s ease",
                    }}
                  >
                    <div className="awards-list">
                      {d.awards.map((award, awardIndex) => (
                        <div
                        key={awardIndex}
                        className="award-item"
                        style={{
                          display: hoveredIndex === index && d.totalAwards < 5 ? "flex" : "none",
                        }}
                        >
                          <img
                            src={AwardIcon}
                            alt="Award Icon"
                            className="award-icon"
                          />
                          <span>{award.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AboutProjects;
