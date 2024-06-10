import "../../../assets/fonts.css";
import "./AdminLogin.css";
import "./AdminLogin-media.css";


import React, { useState } from "react";
import { auth } from "../../../firebase";

import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signIn = (e: any) => {
    e.preventDefault(); // ensure that the page does not get reloaded
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // if login is successful
        console.log(userCredential);
        navigate("/admin/dashboard"); // navigate user to the dashboard
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="signin-ctr">
      <form onSubmit={signIn}>
        <p className="signin-header">Log In</p>
        <div className="signin-details">
          <p className="username-text"></p>
        <input className="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input className="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default SignIn;
