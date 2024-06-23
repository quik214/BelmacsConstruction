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
  awards: string[];
  type: string;
  completion: string;
  client: string;
  location: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const { type } = useParams<{ type: string }>();
  const location = useLocation();

  const { paramData } = location.state || {};

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSentinel, setShowSentinel] = useState(false);

  useEffect(() => {
    const fetchAwards = async (projectId: string) => {
      const awardsCollection = collection(db, `${type}-projects`, projectId, 'awards');
      const awardsSnapshot = await getDocs(awardsCollection);
      return awardsSnapshot.docs.map(doc => doc.id);
    };

    const fetchDataFromFirestore = async () => {
      if (!type) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, `${type}-projects`)
        );

        const data: Project[] = [];
        for (const doc of querySnapshot.docs) {
          const docData = doc.data();
          const awards = await fetchAwards(doc.id);
          data.push({ id: doc.id, ...docData, awards } as Project);
        }

        data.sort((a, b) => {
          const dateA: any = new Date(a.completion);
          const dateB: any = new Date(b.completion);
          return dateB - dateA;
        });

        setProjects(data);
        setDisplayedProjects(data.slice(0, visibleCount));
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchDataFromFirestore();
  }, [type]);

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
          }, 1500);
        }
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => observer.current?.disconnect();
  }, [visibleCount, projects.length]);

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
        heroText = {
          paramData.title === "Existing Building Retrofit"
            ? paramData.title
            : paramData.title + " Projects"
        }
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
              <p>All projects displayed</p>
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
                      Building Type: <br />
                    </p>
                    {selectedProject.type}
                  </div>
                )}
                {selectedProject.location && (
                  <div className="project-popup-location">
                    <p style={{ color: "#364FC7" }}>
                      Location: <br />
                    </p>
                    {selectedProject.location}
                  </div>
                )}
                {selectedProject.developer && (
                  <div className="project-popup-developer">
                    <p style={{ color: "#364FC7" }}>
                      Developer: <br />
                    </p>
                    {selectedProject.developer}
                  </div>
                )}
                {selectedProject.client && (
                  <div className="project-popup-client">
                    <p style={{ color: "#364FC7" }}>
                      Client: <br />
                    </p>
                    {selectedProject.client}
                  </div>
                )}
                {selectedProject.awards && selectedProject.awards.length > 0 && (
                  <div className="project-popup-awards">
                    <p style={{ color: "#364FC7" }}>
                      Awards: <br />
                    </p>
                    {selectedProject.awards.map((award, index) => (
                      <React.Fragment key={index}>
                        - {award}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {selectedProject.completion && (
                  <div className="project-popup-completion">
                    <p style={{ color: "#364FC7" }}>
                      Completion: <br />
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
