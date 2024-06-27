import "./Footer.css";
import "./Footer-media.css";
import "../../assets/fonts.css";

import BelmacsWhiteWhite from "../../assets/Logos/BelmacsDefaultWhiteWhite.png";
import PhoneIcon from "../../assets/Icons/Footer/phone.svg";
import MailIcon from "../../assets/Icons/Footer/mail.svg";
import MapIcon from "../../assets/Icons/Footer/map.svg";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-ctr">
        <div className="footer-left">
          <img src={BelmacsWhiteWhite} className="belmacs-logo"></img>
          <p className="copy-text">
            Copyright © 2024 BELMACS | All Rights Reserved
          </p>
        </div>

        <div className="footer-center-right">
          <div className="footer-center">
            <p className="contact-text">Contact Us</p>
            <div className="phone">
              <img src={PhoneIcon} className="phone-icon"></img>
              <a href="tel:+65 6225 6118" className="phone-number">
                +65 6225 6118
              </a>
            </div>

            <div className="mail">
              <img src={MailIcon} className="mail-icon"></img>
              <a href="mailto:inq@belmacs.com.sg" className="mail-email">
                inq@belmacs.com.sg
              </a>
            </div>
          </div>

          <div className="footer-right">
            <p className="address-text">Our Address</p>

            <div className="map">
              <img src={MapIcon} className="map-icon"></img>
              <p className="map-address">
                2 Leng Kee Road <br></br> #03-08 Thye Hong Centre <br></br>{" "}
                Singapore 159086
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
