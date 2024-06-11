import "./AdminDashboard.css";
import "./AdminDashboard-media.css";

import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";

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

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedType, setSelectedType] = useState<string>("");

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [showSentinel, setShowSentinel] = useState(false);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      if (!selectedType) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, `${selectedType}-projects`)
        );

        const data: Project[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData } as Project);
        });

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
  }, [selectedType, visibleCount]);

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

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    setVisibleCount(6); // Reset visible count when type changes
  };

  const handleEdit = (project: Project) => {
    // Add your edit logic here
    console.log("Edit project:", project);
  };

  const handleDelete = (projectId: string) => {
    // Add your delete logic here
    console.log("Delete project ID:", projectId);
  };

  const handleAddProject = () => {
    // Add your add project logic here
    console.log("Add project button clicked");
  };

  return (
    <div className="dashboard-ctr">
      <div className="dashboard-header">
        Projects
      </div>
      <div className="dropdown-ctr">
        <label htmlFor="project-type">Select Project Type: </label>
        <select
          id="project-type"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">--Select Type--</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="existingBuildingRetrofit">
            Exisiting Building Retrofit
          </option>
          <option value="institutional">Institutional</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="industrial">Industrial</option>
        </select>
      </div>
      <button className="add-project-button" onClick={handleAddProject}>Add Project</button>
      <div className="dashboard-table-ctr">
        <table className="project-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Developer</th>
              <th>Awards</th>
              <th>Type</th>
              <th>Completion</th>
              <th>Client</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProjects.map((projectItem) => (
              <tr key={projectItem.id}>
                <td>
                  <img
                    src={projectItem.image}
                    alt={projectItem.name + " image"}
                    className="project-image"
                  />
                </td>
                <td>{projectItem.name}</td>
                <td>{projectItem.developer}</td>
                <td>{projectItem.awards}</td>
                <td>{projectItem.type}</td>
                <td>{projectItem.completion}</td>
                <td>{projectItem.client}</td>
                <td>{projectItem.location}</td>
                <td className="table-actions">
                  <button
                    className="action-button edit-button"
                    onClick={() => handleEdit(projectItem)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(projectItem.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default AdminDashboard;
