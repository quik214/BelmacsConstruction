import "../../../assets/fonts.css";
import "./Login.css";
import "./Login-media.css";

import { useEffect, useState, useRef } from "react";
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
  PhoneMultiFactorInfo,
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
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(
    null
  );
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const navigate = useNavigate();
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const mfaLogin = sessionStorage.getItem("mfaLogin");
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");

    if (mfaLogin === "true" && !hasRefreshed) {
      window.location.reload();
      sessionStorage.setItem("hasRefreshed", "true");
    }
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

  const mfaErrorToast = () => {
    toast.error("Incorrect MFA code entered. Please try again.", {
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

  const mfaMaxAttemptsToast = () => {
    toast.error("You have exceeded the number of MFA ", {
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

      // to store phone number of admin and display in HTML
      const mfaInfo = resolver.hints[0] as PhoneMultiFactorInfo;
      setPhoneNumber(mfaInfo.phoneNumber);
    
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
      const otpCode = otp.join(""); // join all the numbers in each of the fields (from otp) together
      const phoneCredential = PhoneAuthProvider.credential(
        verificationId,
        otpCode // this is the OTP code
      );
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(phoneCredential);
      await mfaResolver.resolveSignIn(multiFactorAssertion);

      setMfaResolver(null);
      setOtp(["", "", "", "", "", ""]);

      sessionStorage.setItem("mfaLogin", "true");

      navigate("/admin/projects");
      loginSuccessToast(email);
    } catch (error) {

      if (
        isFirebaseError(error) &&
        error.code === "auth/invalid-verification-code"
      ) {
        mfaErrorToast();
      } else if (
        isFirebaseError(error) && 
        error.code === "auth/too-many-requests"
      ) {
        mfaMaxAttemptsToast();
      }

      console.error("MFA failed", error);
    }
  };

  // as the user types in a new otp
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp]; // we set a new const newOtp to be the array of otp values
    newOtp[index] = value; // and the value at the index (from the parameters passed in by the field change in HTML)
    setOtp(newOtp);

    if (value && index < otpInputsRef.current.length - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="signin-ctr">
      {/* If mfaResolver is true, means that MFA user has logged in and will proceed with MFA authentication */}
      {/* Otherwise if false, then MFA user is still logging in */}
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
          <p className="signin-header">Enter Verification Code</p>
          <p className="mfa-description">An SMS has been sent to {phoneNumber}, please enter the 6-digit OTP below.</p>
          <div className="otp-container">
            {/* For each value in otp (currently empty strings), we map an input element. Meaning that an input element is created for  */}
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                className="otp-input"
                ref={(el) => (otpInputsRef.current[index] = el)}
              />
            ))}
          </div>
          <button type="submit" className="otp-button">
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
