import React, { useRef, useState } from "react";

import "./ContactForm.css";
import "./ContactForm-media.css";
import "../../../assets/fonts.css";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

import mailbox from "../../../assets/Contact/mainbox.svg";

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [message, setMessage] = useState("");

  // const [capVal, setCapVal] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  // const [isValid, setIsValid] = useState(false);

  const handleRecaptchaChange = (value: string | null) => {
    if (name && email && enquiryType && message && value && isCheckboxChecked) {
      const sidebar = document.querySelector(".submit-button");
      if (sidebar) {
        sidebar.classList.add("enabled");
      }
    }
  };

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [enquiryTypeError, setEnquiryTypeError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");

  const validateName = () => {
    if (!name) {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email Address is required");
      return false;
    } else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateEnquiryType = () => {
    if (!enquiryType) {
      setEnquiryTypeError("Enquiry Type is required");
      return false;
    }
    setEnquiryTypeError("");
    return true;
  };

  const validateMessage = () => {
    if (!message) {
      setMessageError("Message is required");
      return false;
    }
    setMessageError("");
    return true;
  };

  const validateCheckbox = () => {
    if (!isCheckboxChecked) {
      setCheckboxError(
        "You must consent to the processing and sharing of your personal data"
      );
      return false;
    }
    setCheckboxError("");
    return true;
  };

  const validateForm = () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isEnquiryTypeValid = validateEnquiryType();
    const isMessageValid = validateMessage();
    const isCheckboxValid = validateCheckbox();
    return (
      isNameValid &&
      isEmailValid &&
      isEnquiryTypeValid &&
      isMessageValid &&
      isCheckboxValid
    );
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, proceed with form submission
      // Add your form submission logic here
      console.log("Form submitted");
    } else {
      console.log("Form validation failed");
    }
    if (form.current) {
      emailjs
        .sendForm(
          "service_qg5cvnh",
          "template_mwoj0us",
          form.current,
          "vxGlYoV0lBJb0JYi2"
        )
        .then(
          () => {
            console.log("SUCCESS!");
            const form = document.querySelector(".form-ctr");
            const submittext = document.querySelector(".on-submit-ctr");
            if (form && submittext) {
              form.classList.add("hidden");
              submittext.classList.add("message-appear");
            }
          },
          (error) => {
            console.log("FAILED...", error.text);
          }
        );
    }
  };

  return (
    <div>
      <div className="company-info-ctr">
        <p className="singapore-header">Singapore</p>
        <p className="company-address">
          2 Leng Kee Road #03-08<br></br>Thye Hong Centre<br></br>Singapore
          159086
        </p>
      </div>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31910.443477732275!2d103.77878131083983!3d1.2910719999999982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a2c8fcb8bcf%3A0x686207b4efd1b40!2sBELMACS%20Pte%20Ltd!5e0!3m2!1sen!2ssg!4v1686929055442!5m2!1sen!2ssg"
        loading="lazy"
        width="100%"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="google-maps"
      ></iframe>

      <div className="form-ctr">
        <form ref={form} onSubmit={sendEmail} id="form">
          <div>
            <div className="contact-header">Contact Us</div>
            <input
              type="checkbox"
              name="botcheck"
              style={{ display: "none" }}
            />
            <div>
              <p className="field-label">Full Name</p>
              <br />
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
                placeholder="Enter your name"
                required
              />
              {nameError && <p className="form-error">{nameError}</p>}
            </div>

            <div>
              <p className="field-label">Email Address</p>
              <br />
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                placeholder="you@mail.com"
                required
              />
              {emailError && <p className="form-error">{emailError}</p>}
            </div>

            <div>
              <p className="field-label">Enquiry Type</p>
              <br />
              <select
                name="enquiry-type"
                id="enquiry-type"
                className="enquiry-dropdown"
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                onBlur={validateEnquiryType}
                required
              >
                <option value="" disabled>
                  Select Enquiry Type
                </option>
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </select>
              {enquiryTypeError && (
                <p className="form-error">{enquiryTypeError}</p>
              )}
            </div>
            <div>
              <p className="field-label">Message</p>
              <br />
              <textarea
                rows={5}
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={validateMessage}
                placeholder="Enter your message"
                className="message-field"
                required
              ></textarea>
              {messageError && <p className="form-error">{messageError}</p>}
            </div>

            <div className="checkbox-ctr">
              <input
                type="checkbox"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                onBlur={validateCheckbox}
                className="checkbox"
              />
              <p className="checkbox-text">
                By checking this box, you consent to the processing and sharing
                of your personal data for the purposes of addressing your
                specified queries
              </p>
            </div>
            {checkboxError && <p className="form-error">{checkboxError}</p>}

            <ReCAPTCHA
              sitekey="6Lf9YPIpAAAAAFnSu5xNGs-Ib8-BT88I9UnZf5ib"
              onChange={handleRecaptchaChange}
              className="recaptcha"
            />
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </div>
        </form>
      </div>

      <div className="on-submit-ctr">
        <img className="mailbox" src={mailbox}></img>
        <p className="on-submit-text">
          Thank you for your submission. <br></br> A confirmation email has been
          sent to the provided email address.{" "}
        </p>
      </div>
    </div>
  );
};

export default ContactForm;
