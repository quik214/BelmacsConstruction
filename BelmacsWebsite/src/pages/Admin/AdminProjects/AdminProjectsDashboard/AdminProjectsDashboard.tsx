import "./AdminProjectsDashboard.css";

import AdminProjectsDashboard from "../../../../components/Admin/Projects/ProjectsDashboard/ProjectsDashboard";
import AdminProjectsTypesDashboard from "../../../../components/Admin/Projects/ProjectsTypeDashboard/ProjectsTypesDashboard";

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <AdminProjectsDashboard />
      <AdminProjectsTypesDashboard />
    </div>
  );
}
