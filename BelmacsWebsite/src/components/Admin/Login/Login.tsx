import "../../../assets/fonts.css";
import "./Login.css";
import "./Login-media.css";

import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneAuthProvider,
  RecaptchaVerifier,
  PhoneMultiFactorGenerator,
  MultiFactorResolver,
  MultiFactorError,
} from "firebase/auth";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseError } from "firebase/app";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

// Type guard for FirebaseError
function isFirebaseError(error: unknown): error is FirebaseError {
  return (error as FirebaseError).code !== undefined;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [verificationCode, setVerificationCode] = useState(""); // For MFA
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(
    null
  ); // For MFA
  const [verificationId, setVerificationId] = useState<string | null>(null); // For MFA

  const navigate = useNavigate();

  useEffect(() => {
    const mfaLogin = sessionStorage.getItem("mfaLogin");
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");

    // if admin has already logged in with mfa once AND the page has not been refreshed
    if (mfaLogin === "true" && !hasRefreshed) {
      // then we reload the page
      window.location.reload();
      // and we set hasRefreshed to true in sessionStorage, so that after refresh,
      // when the useEffect triggers again, then hasRefreshed will be 1, !1 = 0, and we will not refresh again
      sessionStorage.setItem("hasRefreshed", "true");
    }

    // below the code, after pressing sign in, we will clear hasRefreshed from sessionStorage, such that when they go to the admin page again,
    // we will refresh the page again once

  }, []);

  const validate = () => {
    let valid = true;
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email field must not be empty";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password field must not be empty";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

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

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      loginErrorToast();
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userEmail = userCredential.user.email ?? "unknown email";

      loginSuccessToast(userEmail);
      window.localStorage.setItem("approvedSignIn", JSON.stringify(true));
      navigate("admin/projects");
    } catch (error: unknown) {
      if (
        isFirebaseError(error) &&
        error.code === "auth/multi-factor-auth-required"
      ) {
        const resolver = getMultiFactorResolver(
          auth,
          error as MultiFactorError
        );

        sessionStorage.removeItem("hasRefreshed");
        setMfaResolver(resolver);
        sendOtp(resolver);
      } else {
        console.error("Login error", error);
        loginFailureToast();
      }
    }
  };

  const sendOtp = async (resolver: MultiFactorResolver) => {
    try {
      // Ensure that the recaptcha container exists
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (!recaptchaContainer) {
        throw new Error("recaptcha-container element not found in the DOM.");
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );
      }

      const phoneInfoOptions = {
        multiFactorHint: resolver.hints[0],
        session: resolver.session,
      };

      console.log("phoneInfoOptions:", phoneInfoOptions);

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        window.recaptchaVerifier
      );
      setVerificationId(verificationId);
      console.log(`OTP sent, verificationId: ${verificationId}`);
    } catch (error: unknown) {
      console.error("Error sending OTP", error);

      // If error is a FirebaseError, log additional details
      if (isFirebaseError(error)) {
        console.error("Firebase Error Code:", error.code);
        console.error("Firebase Error Message:", error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaResolver || !verificationId) return;

    try {
      const phoneCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(phoneCredential);
      await mfaResolver.resolveSignIn(multiFactorAssertion);

      // Clear the resolver
      setMfaResolver(null);
      setVerificationCode("");

      // add login success to session storage
      sessionStorage.setItem("mfaLogin", "true");
      

      navigate("/admin/projects");
      loginSuccessToast(email);
    } catch (error) {
      console.error("MFA failed", error);
    }
  };

  return (
    <div className="signin-ctr">
      {!mfaResolver ? (
        <form onSubmit={signIn}>
          <p className="signin-header">Admin Log In</p>
          <div className="signin-details">
            <div className="email-portion">
              <input
                className="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <input
              className="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <p className="signin-header">Multi-Factor Authentication</p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit" className="login-button">
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
