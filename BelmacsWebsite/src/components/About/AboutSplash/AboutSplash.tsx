import "./AboutSplash.css"
import "./AboutSplash-media.css"


import React, { useEffect, useState } from 'react';


interface SplashScreenProps {
    logo: string;
    duration: number;
    onFinish: () => void;
  }
  
  const SplashScreen: React.FC<SplashScreenProps> = ({ logo, duration, onFinish }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const fadeOutTimer = setTimeout(() => {
          onFinish();
        }, 1000); // Match the duration of the fadeOut animation
        return () => clearTimeout(fadeOutTimer);
      }, duration);
  
      return () => clearTimeout(timer);
    }, [duration, onFinish]);
  
    return (
      <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
        <img src={logo} alt="Logo" className="splash-logo" />
      </div>
    );
  };
  
  export default SplashScreen;