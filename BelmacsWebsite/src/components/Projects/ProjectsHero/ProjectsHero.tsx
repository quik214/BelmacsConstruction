import React from 'react';
import "./ProjectsHero.css";
import "./ProjectsHero-media.css";
import "../../../assets/fonts.css";

interface ProjectsHeroProps {
    imageUrl: string;
    heroText: string; // Define a prop for the hero text
}

const ProjectsHero: React.FC<ProjectsHeroProps> = ({ imageUrl, heroText }) => {
    return (
        <div className="hero-container">
            <div className="hero-image" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${imageUrl})` }}>
                <div className="hero-text">
                    <p>{heroText}</p> {/* Use the heroText prop for the text content */}
                </div>
            </div>
        </div>
    );
}

export default ProjectsHero;
