import React, { useRef, useState, useEffect } from 'react'; 
import "./ContactForm.css";
import "./ContactForm-media.css";
import "../../../assets/fonts.css";

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [captchaResponse, setCaptchaResponse] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://hcaptcha.com/1/api.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaResponse) {
      setCaptchaError(true);
      return;
    } else {
      setCaptchaError(false);
    }

    if (formRef.current) {
      // Create form data and append hidden fields
      const formData = new FormData(formRef.current);
      formData.append('access_key', '7bfd764b-90c7-4931-bbfc-c68f7948ac86');
      formData.append('subject', 'Someone dropped you a message from ContactUsForm');
      formData.append('h-captcha-response', captchaResponse);

      // Form submission logic
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            setResultMessage('Your message has been sent successfully!');
          } else {
            console.error('Form submission error:', response.statusText);
          }
        })
        .catch((error) => setResultMessage('Form submission error: ' + error.message));

      // Reset the form
      formRef.current.reset();
      setCaptchaResponse(null);  // Reset captcha response
    } else {
      console.error('Form reference is null');
      setResultMessage('Form reference is null');
    }
  };

  const onCaptchaSuccess = (token: string) => {
    setCaptchaResponse(token);
    setCaptchaError(false);
  };

  const onCaptchaError = () => {
    setCaptchaResponse(null);
    setCaptchaError(true);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} id="form">
      <fieldset>
        <legend>Contact Us</legend>
        <input type="checkbox" name="botcheck" style={{   display: 'none' }} />
        
        <div>
          <label htmlFor="name">Full Name</label><br />
          <input type="text" name="name" id="name" placeholder="Lee Hsien Looong" required /><br /><br />
        </div>
        
        <div>
          <label htmlFor="email">Email Address</label><br />
          <input type="email" name="email" id="email" placeholder="you@company.com" required /><br /><br />
        </div>
        
        <div>
          <label htmlFor="enquiry-type">Enquiry Type</label><br />
          <select name="enquiry-type" id="enquiry-type" required>
            <option value="">Select Enquiry Type</option>
            <option value="general">General</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="feedback">Feedback</option>
          </select><br /><br />
        </div>
        
        <div>
          <label htmlFor="message">Message</label><br />
          <textarea rows={5} name="message" id="message" placeholder="Your Message" required></textarea><br /><br />
        </div>

        
        <div className="h-captcha" data-sitekey="00c8b5f3-b304-4395-a249-05da8ae57c27" data-callback="onCaptchaSuccess" data-error-callback="onCaptchaError"></div>
        {captchaError && <div className="error">Please complete the captcha.</div>}

        <button type="submit">Send Message</button>

        {resultMessage && <p className="result" id="result">{resultMessage}</p>}
      </fieldset>
    </form>
  );
};

export default ContactForm;
