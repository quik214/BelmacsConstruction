import React, { useRef, useState } from "react";

import "./ContactForm.css";
import "./ContactForm-media.css";
import "../../../assets/fonts.css";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [capVal, setCapVal] = useState<string | null>(null);

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

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
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      <div className="form-ctr">
        <form ref={form} onSubmit={sendEmail} id="form">
          <div>
            <legend className="contact-header">Contact Us</legend>
            <input
              type="checkbox"
              name="botcheck"
              style={{ display: "none" }}
            />
            <div>
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

            <div>
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

            <div>
              <label htmlFor="enquiry-type">Enquiry Type</label>
              <br />
              <select name="enquiry-type" id="enquiry-type" required>
                <option value="" disabled selected>
                  Select Enquiry Type
                </option>
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </select>
              <br />
              <br />
            </div>

            <div>
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

            <div className="checkbox-ctr">
              <input
                type="checkbox"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                className="checkbox"
              />
              <p className="checkbox-text">
                By checking this box, you consent to the processing and sharing
                of your personal data for the purposes of addressing your
                specified queries
              </p>
            </div>

            <ReCAPTCHA
              sitekey="6Lf9YPIpAAAAAFnSu5xNGs-Ib8-BT88I9UnZf5ib"
              onChange={(val: string | null) => setCapVal(val)}
              className="recaptcha"
            />
            <button type="submit" disabled={!capVal || !isCheckboxChecked}>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
