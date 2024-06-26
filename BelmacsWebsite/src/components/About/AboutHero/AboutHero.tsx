import "../../../assets/fonts.css";

import AboutHeroVideo from "../../../assets/About/AboutHero/about-hero.mp4";

import "./AboutHero.css";
import "./AboutHero-media.css";

export default function AboutHero() {
  return (
    <div className="hero">
      <video autoPlay muted loop playsInline id="hero-video">
        <source src={AboutHeroVideo} type="video/mp4" />
      </video>

      <div className="video-overlay"></div> {/* Transparent overlay */}

      <div className="video-text">
        <p className="video-header">Belmacs Consulting Engineers</p>
        <p className="video-desc">Possibilities Through Design</p>
      </div>
    </div>
  );
}
