import "./AdminLogin.css";

import Login from "../../../components/Admin/Login/Login";

export default function AdminLogin() {
  return (
    <div className="admin-container">
      <div id="recaptcha-container"></div>
      <Login />
    </div>
  );
}
