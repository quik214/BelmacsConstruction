import React, { useRef, useState } from "react";

import "./ContactForm.css";
import "./ContactForm-media.css";
import "../../../assets/fonts.css";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [capVal, setCapVal] = useState<string | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          },
          (error) => {
            console.log("FAILED...", error.text);
          }
        );
    }
  };

  return (
    <form ref={form} onSubmit={sendEmail} id="form">
      <div className="field-ctr">
        <legend className="contact-header">Contact Us</legend>
        <input type="checkbox" name="botcheck" style={{ display: "none" }} />
        <div className="name-field">
          <label htmlFor="name">Full Name</label>
          <br />
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            required
          />
          <br />
          <br />
        </div>

        <div className="name-field">
          <label htmlFor="email">Email Address</label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="you@mail.com"
            required
          />
          <br />
          <br />
        </div>

        <div className="name-field">
          <label htmlFor="enquiry-type">Enquiry Type</label>
          <br />
          <select name="enquiry-type" id="enquiry-type" required>
            <option value="" disabled selected>Select Enquiry Type</option>
            <option value="general">General</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="feedback">Feedback</option>
          </select>
          <br />
          <br />
        </div>

        <div className="name-field">
          <label htmlFor="message">Message</label>
          <br />
          <textarea
            rows={5}
            name="message"
            id="message"
            placeholder="Enter your message"
            required
          ></textarea>
          <br />
          <br />
        </div>

        
        <ReCAPTCHA
          sitekey="6Lf9YPIpAAAAAFnSu5xNGs-Ib8-BT88I9UnZf5ib"
          onChange={(val: string | null) => setCapVal(val)}
          className="recaptcha"
        />
        <button type="submit" disabled={!capVal}>
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
