import "../../../assets/fonts.css";
import "./ProjectsIndividual.css";
import "./ProjectsIndividual-media.css";

import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useLocation } from "react-router-dom";

import Hero from "../../Hero/Hero";
import { FaCheckCircle } from "react-icons/fa"; // Import an icon from react-icons

interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
  awards: string;
  type: string;
  completion: string;
  client: string;
  location: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]); // create a useState hook, where we have a variable projects and a function that updates the variable
  // currently, projects is set to be an empty array of Project objects
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(6); // Initial number of projects to display
  const { type } = useParams<{ type: string }>(); // captures the part of the URL after the last /
  const location = useLocation();

  const { paramData } = location.state || {}; // Destructure paramData from location.state

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSentinel, setShowSentinel] = useState(false); // State to manage sentinel visibility

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      if (!type) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, `${type}-projects`) // get the documents from the Firestore collection with the name of (type)-projects
        );
        // console.log(category + "-projects");
        const data: Project[] = []; // empty array to hold each project's data
        querySnapshot.forEach((doc) => {
          // iterate over each project and its data (in the Firebase collection), assign it to doc
          const docData = doc.data(); // assign the data to a variable
          data.push({ id: doc.id, ...docData } as Project); // push everything from docData to the data array (from id, to the last piece of data)
        });

        // Sort the data by completionDate
        data.sort((a, b) => {
          const dateA: any = new Date(a.completion);
          const dateB: any = new Date(b.completion);
          return dateB - dateA;
        });

        setProjects(data); // update projects state with the fetched data
        setDisplayedProjects(data.slice(0, visibleCount)); // Display initial projects
      } catch (error) {
        console.error("Error fetching projects: ", error); // if there is error, log to console
      }
    };

    fetchDataFromFirestore();
  }, [type]); // whenever there is a change to type (which is the current project type), the entirety of the above code will re-run

  const loadMoreProjects = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  useEffect(() => {
    setDisplayedProjects(projects.slice(0, visibleCount));
  }, [projects, visibleCount]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (visibleCount < projects.length) {
          loadMoreProjects();
        } else {
          setShowSentinel(true);
          setTimeout(() => {
            setShowSentinel(false);
          }, 1000); // Hide the sentinel after 1 seconds
        }
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => observer.current?.disconnect();
  }, [visibleCount, projects.length]);

  useEffect(() => {
    setDisplayedProjects(projects.slice(0, visibleCount));
  }, [projects, visibleCount]);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedProject(null);
  };

  return (
    <div className="projects-individual">
      <Hero
        imageUrl={paramData.image}
        heroText={paramData.title + " Projects"}
      />
      <div className="projects-individual-container">
        <div className="projects-individual-grid-container">
          {displayedProjects.map((projectItem) => (
            <div
              className="project-individual-card"
              key={projectItem.id}
              onClick={() => handleCardClick(projectItem)}
            >
              <img
                className="project-individual-img"
                src={projectItem.image}
                alt={projectItem.name + " images"}
              />
              <p className="project-individual-title">{projectItem.name}</p>
            </div>
          ))}
        </div>
        <div
          ref={sentinelRef}
          className={`sentinel ${showSentinel ? "" : "sentinel-hidden"}`}
        >
          {showSentinel && (
            <>
              <FaCheckCircle className="sentinel-icon" />
              <p>All projects loaded</p>
            </>
          )}
        </div>
      </div>

      {showPopup && selectedProject && (
        <div className="project-popup" onClick={closePopup}>
          <div
            className="project-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-btn" onClick={closePopup}>
              &times;
            </span>
            <div className="project-popup-header">
              <img src={selectedProject.image} alt={selectedProject.name} />
              <div className="project-popup-info">
                <div className="project-popup-name">{selectedProject.name}</div>
                {selectedProject.type && (
                  <div className="project-popup-buildingtype">
                    <p style={{ color: "#364FC7" }}>
                      Building Type: <br></br>
                    </p>
                    {selectedProject.type}
                  </div>
                )}
                {selectedProject.location && (
                  <div className="project-popup-location">
                    <p style={{ color: "#364FC7" }}>
                      Location: <br></br>
                    </p>
                    {selectedProject.location}
                  </div>
                )}
                {selectedProject.developer && (
                  <div className="project-popup-developer">
                    <p style={{ color: "#364FC7" }}>
                      Developer: <br></br>
                    </p>
                    {selectedProject.developer}
                  </div>
                )}
                {selectedProject.client && (
                  <div className="project-popup-client">
                    <p style={{ color: "#364FC7" }}>
                      Client: <br></br>
                    </p>
                    {selectedProject.client}
                  </div>
                )}
                {selectedProject.awards && (
                  <div className="project-popup-awards">
                    <p style={{ color: "#364FC7" }}>
                      Awards: <br></br>
                    </p>
                    {selectedProject.awards.split("\\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {selectedProject.completion && (
                  <div className="project-popup-completion">
                    <p style={{ color: "#364FC7" }}>
                      Completion: <br></br>
                    </p>
                    {selectedProject.completion}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
