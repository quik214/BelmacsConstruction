import "../../../assets/fonts.css";
import "./Login.css";
import "./Login-media.css";

import { useState } from "react";
import { auth } from "../../../firebase";

import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "../../Toast/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const navigate = useNavigate();

  const signIn = (e: any) => {
    e.preventDefault(); // ensure that the page does not get reloaded
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // if login is successful
        console.log(userCredential);
        showToast("Successfully Authenticated", "success");
        navigate("/admin/dashboard"); // navigate user to the dashboard
      })
      .catch((error) => {
        console.log(error);
        showToast("Inaviled login Credential", "error");
      });
  };

  return (
    <div className="signin-ctr">
      <form onSubmit={signIn}>
        <p className="signin-header">Log In</p>
        <div className="signin-details">
          <p className="username-text"></p>
          <input
            className="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            className="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
