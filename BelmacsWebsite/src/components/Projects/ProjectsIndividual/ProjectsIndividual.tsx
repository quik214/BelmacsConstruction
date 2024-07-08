import "../../../assets/fonts.css";
import "./ProjectsIndividual.css";
import "./ProjectsIndividual-media.css";

import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";

import Hero from "../../Hero/Hero";
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
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { type } = useParams<{ type: string }>();

  const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);

  const projectsPerPage = 9;
  const projectContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
          return dateB - dateA;
        });

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

  // Pagination functions for ongoing and completed projects
  const totalOngoingPages = Math.ceil(ongoingProjects.length / projectsPerPage);
  const totalCompletedPages = Math.ceil(completedProjects.length / projectsPerPage);

  const handleOngoingPageChange = (page: number) => {
    setCurrentOngoingPage(page);
    setTimeout(() => {
      if (projectContainerRef.current) {
        const { top } = projectContainerRef.current.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + top + 200, // Adjust the pixel value as needed
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const handleCompletedPageChange = (page: number) => {
    setCurrentCompletedPage(page);
    setTimeout(() => {
      if (projectContainerRef.current) {
        const { top } = projectContainerRef.current.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + top + 200, // Adjust the pixel value as needed
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const displayedOngoingProjects = ongoingProjects.slice(
    (currentOngoingPage - 1) * projectsPerPage,
    currentOngoingPage * projectsPerPage
  );

  const displayedCompletedProjects = completedProjects.slice(
    (currentCompletedPage - 1) * projectsPerPage,
    currentCompletedPage * projectsPerPage
  );

  // Pagination component
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    const maxButtons = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxButtons / 2));

    if (endPage - startPage + 1 < maxButtons) {
      if (currentPage <= Math.floor(maxButtons / 2)) {
        endPage = Math.min(totalPages, maxButtons);
      } else if (currentPage + Math.floor(maxButtons / 2) >= totalPages) {
        startPage = Math.max(1, totalPages - maxButtons + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <div className="desktop-view">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
        <div className="mobile-view">
        <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button
            onClick={() => onPageChange(currentPage)}
            className="active"
          >
            {currentPage}
          </button>
          {totalPages > 1 && (
            <>
              {totalPages > 2 && (
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              )}
              {totalPages > 2 && (
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="projects-individual">
      <Hero
        imageUrl={
          type === "residential" ? ResidentialImage :
          type === "commercial" ? CommercialImage :
          type === "institutional" ? InstitutionalImage :
          type === "existingBuildingRetrofit" ? ExisitingBuildingRetrofitImage :
          type === "infrastructure" ? InfrastructureImage :
          type === "industrial" ? IndustrialImage :
          ResidentialImage
        }
        heroText={
          type === "residential" ? "Residential Projects":
          type === "commercial" ? "Commercial Projects":
          type === "institutional" ? "Institutional Projects":
          type === "existingBuildingRetrofit" ? "Existing Building Retrofit":
          type === "infrastructure" ? "Infrastructure Projects":
          type === "industrial" ? "Industrial Projects":
          "Projects"
        }
      />
      <div className="projects-individual-container"  ref={projectContainerRef}>
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
                  {displayedOngoingProjects.map((projectItem) => (
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
                {totalOngoingPages > 1 && (
                  <Pagination
                    currentPage={currentOngoingPage}
                    totalPages={totalOngoingPages}
                    onPageChange={handleOngoingPageChange}
                  />
                )}
              </>
            )}
            {completedProjects.length > 0 && (
              <>
                <div className="projects-individual-header">Completed Projects</div>
                <div className="projects-individual-grid-container">
                  {displayedCompletedProjects.map((projectItem) => (
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
                {totalCompletedPages > 1 && (
                  <Pagination
                    currentPage={currentCompletedPage}
                    totalPages={totalCompletedPages}
                    onPageChange={handleCompletedPageChange}
                  />
                )}
              </>
            )}
          </>
        )}
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
