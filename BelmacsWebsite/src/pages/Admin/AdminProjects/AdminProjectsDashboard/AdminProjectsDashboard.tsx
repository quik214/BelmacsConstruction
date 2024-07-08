import React, { useState } from "react";
import AdminProjectsDashboard from "../../../../components/Admin/Projects/ProjectsDashboard/ProjectsDashboard";
import AdminProjectsTypesDashboard from "../../../../components/Admin/Projects/ProjectsTypeDashboard/ProjectsTypesDashboard";
import "./AdminProjectsDashboard.css";
import "./AdminProjectsDashboard-media.css";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "projectsTypes">(
    "projects"
  );

  const handleTabClick = (tab: "projects" | "projectsTypes") => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-container">
      <div className="tabs">
        <div
          className={`tab-button ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => handleTabClick("projects")}
        >
          Projects
        </div>
        <div
          className={`tab-button ${
            activeTab === "projectsTypes" ? "active" : ""
          }`}
          onClick={() => handleTabClick("projectsTypes")}
        >
          Projects Category Image
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "projects" && <AdminProjectsDashboard />}
        {activeTab === "projectsTypes" && <AdminProjectsTypesDashboard />}
      </div>
    </div>
  );
};

export default AdminDashboard;
