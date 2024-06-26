import "../../../assets/fonts.css";
import "./Login.css";
import "./Login-media.css";

import { useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const navigate = useNavigate();

  const validate = () => {
    let valid = true; // valid will be the return variable
    const newErrors: { email?: string; password?: string } = {}; // stores error messages for email and password, will be used to set with above useState
    // ? specifies that the keys can be there, but are not a requirement for this "dictionary"

    if (!email) {
      // if the email field is empty, perform the following
      newErrors.email = "Email field must be not be empty"; // error message
      valid = false; // since the field is empty, valid will be false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      // using regex, check if email field contains valid email format
      newErrors.email = "Invalid email format"; // if invalid email format, this is the message displayed
      valid = false;
    }

    if (!password) {
      // if password is empty ,perform the following
      newErrors.password = "Password field must not be empty"; // error message
      valid = false; // set valid to false
    }

    setErrors(newErrors); // sets the error messages array (declared above) to hold the error messages
    return valid;
  };

  // toast setup for login error
  const loginErrorToast = () => {
    toast.error("Please fix the errors in the form", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // toast setup for login success
  const loginSuccessToast = (email: string) => {
    toast.success(
      <div>
        Welcome, <b>{email}</b>
      </div>,
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };

  // toast setup for login failure
  const loginFailureToast = () => {
    toast.error("Please enter a valid email address and Password", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const signIn = (e: any) => {
    e.preventDefault(); // ensure that the page does not get reloaded

    if (!validate()) {
      // if validate() function returns false, then we will perform the following
      // calls the validate function, and does the following
      loginErrorToast(); // displays a toast specifying that the user must fix errors in the form
      return; // does this to immediately return once validation fails
    }

    signInWithEmailAndPassword(auth, email, password) // for authentication
      .then((userCredential) => {
        // if the sign-in attempt (through Firebase) is successful, this executes
        console.log(userCredential); // log the user credentials to check login success

        const userEmail = userCredential.user.email ?? "unknown email"; // get user's email address, if unknown, will display unknown email (will not happen)
        // "unknown email is just a fallback"
        loginSuccessToast(userEmail); // display the success toast
        navigate("/admin/projects"); // navigate user to the dashboard upon a successful login
      })
      .catch((error) => {
        console.log(error); // catch any errors
        loginFailureToast(); // any invalid login credentials will be further caught
      });
  };

  return (
    <div className="signin-ctr">
      <form onSubmit={signIn}>
        <p className="signin-header">Admin Log In</p>
        <div className="signin-details">
          <p className="username-text"></p>
          <div className="email-portion">
            <input
              className="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}{" "}
            {/* If there is input error for email, this will show*/}
          </div>
          <input
            className="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}{" "}
          {/* If there is input error for password, this will show*/}
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
