import "../../../assets/fonts.css";

import AboutHeroVideo from "../../../assets/About/about-hero.mp4";

import "./AboutHero.css";
import "./AboutHero-media.css";

export default function AboutHero() {
  return (
    <div className="hero">
      <video autoPlay muted loop id="hero-video">
        <source src={AboutHeroVideo} type="video/mp4" />
      </video>

      <div className="video-text">
        <p className="video-header">Belmacs Consulting Engineers</p>
        <p className="video-desc">Envision Possibilities, Building Solutions</p>
      </div>
    </div>
  );
}
