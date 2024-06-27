import "./AdminAbout.css";

import AdminAboutCompany from "../../../../components/Admin/About/AboutCompany/CompanyDashboard/CompanyDashboard"
import AdminAboutPeople from "../../../../components/Admin/About/AboutPeople/PeopleDashboard/PeopleDashboard"

export default function AdminDashboard() {
  return (
    <div className="container">
      <AdminAboutCompany />
      <AdminAboutPeople />
    </div>
  );
}
