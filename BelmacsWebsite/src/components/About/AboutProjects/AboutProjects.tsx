import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./AboutProjects.css";
import "./AboutProjects-media.css";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";


interface Project {
  name: string;
  image: string;
  location: string;
}

const AboutProjects: React.FC = () => {
  const [data, setData] = useState<Project[]>([]);
  const projectTypes = [
    "residential-projects",
    "industrial-projects",
    "commercial-projects",
    "institutional-projects",
    "existingBuildingRetrofit-projects",
    "infrastructure-projects"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const allProjects: Project[] = [];

      try {
        for (const type of projectTypes) {
          const q = query(collection(db, type), where("featured", "==", "yes"));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            allProjects.push(doc.data() as Project);
          });
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
    speed: 1000,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    autoplay: data.length > 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(data.length, 2),
          slidesToScroll: 1,
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

  return (
    <div className="projects reveal">
      <p className="projects-header">Featured Projects</p>
      <div className="flex-container">
        <Slider {...settings}>
          {data.map((d) => (
            <div className="card" key={d.name}>
              <img className="card-img" src={d.image} alt={d.image} />
              <div className="card-text-container">
                <p className="card-header">{d.name}</p>
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

export default AboutProjects;