import "../../../assets/fonts.css";
import "./ProjectsIndividual.css";
import "./ProjectsIndividual-media.css";

import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useLocation } from "react-router-dom";

import Hero from "../../Hero/Hero";
import { FaCheckCircle } from "react-icons/fa"; // Import an icon from react-icons

import ProjectSkeleton from './ProjectSkeleton';

import ResidentialImage from "../../../assets/Projects/HeroImages/ResidentialHero.jpg";
import CommercialImage from "../../../assets/Projects/HeroImages/CommercialHero.jpg";
import InstitutionalImage from "../../../assets/Projects/HeroImages/InstitutionalHero.jpg";
import ExisitingBuildingRetrofitImage from "../../../assets/Projects/HeroImages/ExistingBuildingHero.jpg";
import InfrastructureImage from "../../../assets/Projects/HeroImages/InfrastructureHero.jpg";
import IndustrialImage from "../../../assets/Projects/HeroImages/IndustrialHero.jpg";

interface Project {
  id: string;
  image: string;
  name: string;
  developer: string;
  awards: string[];
  type: string;
  status: string;
  completion: string;
  client: string;
  location: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      const awardsCollection = collection(
        db,
        `${type}-projects`,
        projectId,
        "awards"
      );
      const awardsSnapshot = await getDocs(awardsCollection);
      return awardsSnapshot.docs.map((doc) => doc.id);
    };

    const fetchDataFromFirestore = async () => {
      if (!type) return;

      try {
        const querySnapshot = await getDocs(collection(db, `${type}-projects`));

        const data: Project[] = [];
        for (const doc of querySnapshot.docs) {
          const docData = doc.data();
          const awards = await fetchAwards(doc.id);
          data.push({ id: doc.id, ...docData, awards } as Project);
        }

        data.sort((a, b) => {
          const dateA = a.completion
            ? new Date(a.completion).getTime()
            : Infinity;
          const dateB = b.completion
            ? new Date(b.completion).getTime()
            : Infinity;
          return dateA - dateB;
        });

        setProjects(data);

        const ongoing = data.filter((project) => !project.completion);
        const completed = data.filter((project) => project.completion);

        setOngoingProjects(ongoing);
        setCompletedProjects(completed);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromFirestore();
  }, [type]);

  const loadMoreProjects = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        if (visibleCount < projects.length) {
          loadMoreProjects();
        } else if (visibleCount >= projects.length) {
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
  }, [visibleCount, projects.length, isLoading]);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setShowPopup(true);
    document.body.classList.add("no-scroll");
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedProject(null);
    document.body.classList.remove("no-scroll");
  };

  return (
    <div className="projects-individual">
      <Hero
        imageUrl={
          paramData.title === "Residential" ? ResidentialImage :
          paramData.title === "Commercial" ? CommercialImage :
          paramData.title === "Institutional" ? InstitutionalImage :
          paramData.title === "Existing Building Retrofit" ? ExisitingBuildingRetrofitImage :
          paramData.title === "Infrastructure" ? InfrastructureImage :
          paramData.title === "Industrial" ? IndustrialImage :
          ResidentialImage
        }
        heroText={
          paramData.title === "Existing Building Retrofit"
            ? paramData.title
            : paramData.title + " Projects"
        }
      />
      <div className="projects-individual-container">
        {isLoading ? (
          <div className="projects-individual-grid-container">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <ProjectSkeleton key={index} />
              ))}
          </div>
        ) : (
          <>
            {ongoingProjects.length > 0 && (
              <>
                <div className="projects-individual-header">
                  Ongoing Projects
                </div>
                <div className="projects-individual-grid-container">
                  {ongoingProjects.map((projectItem) => (
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
                      <p className="project-individual-title">
                        {projectItem.name}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="projects-individual-header">Completed Projects</div>
            <div className="projects-individual-grid-container">
              {completedProjects.map((projectItem) => (
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
          </>
        )}
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
                {selectedProject.awards &&
                  selectedProject.awards.length > 0 && (
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
                {selectedProject.status && (
                  <div className="project-popup-status">
                    <p style={{ color: "#364FC7" }}>
                      Status: <br />
                    </p>
                    {selectedProject.status}
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
