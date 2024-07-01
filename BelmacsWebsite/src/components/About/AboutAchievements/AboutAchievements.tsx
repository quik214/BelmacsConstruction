import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./AboutAchievements.css";
import "./AboutAchievements-media.css";
import buildingLogo from "../../../assets/Icons/AboutAchievements/building-office.svg";
import hatLogo from "../../../assets/Icons/AboutAchievements/hard-hat.svg";
import certificateLogo from "../../../assets/Icons/AboutAchievements/certificate.svg";
import calendarLogo from "../../../assets/Icons/AboutAchievements/calendar-check.svg";

// for particles.js
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import CountUp from "react-countup";

import particlesJSON from "../../../assets/About/AboutAchievements/particles.json";

interface Award {
  id: string;
  title: string;
}
interface Project {
  id: string;
  type: string;
  awards: Award[];
}
const AboutAchievements = () => {
  const [totalAwards, setTotalAwards] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [inView, setInView] = useState(false);
  const achievementsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const projectTypes = [
          "residential",
          "commercial",
          "existingBuildingRetrofit",
          "institutional",
          "infrastructure",
          "industrial",
        ];
        let awardsCount = 0;
        let projectsCount = 0;
        const allProjects: Project[] = [];
        for (const type of projectTypes) {
          const projectsCollectionRef = collection(db, `${type}-projects`);
          const querySnapshot = await getDocs(projectsCollectionRef);
          projectsCount += querySnapshot.size;
          await Promise.all(
            querySnapshot.docs.map(
              async (doc: QueryDocumentSnapshot<DocumentData>) => {
                const projectData = doc.data();
                const awardsCollectionRef = collection(doc.ref, "awards");
                const awardsSnapshot = await getDocs(awardsCollectionRef);
                const awards = awardsSnapshot.docs.map((awardDoc) => ({
                  id: awardDoc.id,
                  title: awardDoc.data().title,
                }));
                awardsCount += awards.length;
                allProjects.push({
                  id: doc.id,
                  type: type,
                  ...projectData,
                  awards: awards,
                } as Project);
              }
            )
          );
        }
        const currentYear = new Date().getFullYear();
        const startYear = 1994;
        const experience = currentYear - startYear;
        setTotalAwards(awardsCount);
        setTotalProjects(projectsCount);
        setYearsOfExperience(experience);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchDataFromFirestore();
  }, []);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);
  const particlesLoaded = async (_container?: Container): Promise<void> => {
    
  };
  const particlesOptions: ISourceOptions =
    particlesJSON as unknown as ISourceOptions;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (achievementsRef.current) {
      observer.observe(achievementsRef.current);
    }
    return () => {
      if (achievementsRef.current) {
        observer.unobserve(achievementsRef.current);
      }
    };
  }, []);
  return (
    <div className="achievements-container reveal" ref={achievementsRef}>
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={particlesOptions}
      />
      <div className="achievements-header">Our Achievements</div>
      <div className="achievements">
        <div className="circle-wrapper">
          <div className="achievement">
            <img className="icon" src={hatLogo} alt="Hard Hat Icon"></img>
            <div className="info">
              <h3>
                {" "}
                {inView && <CountUp end={1994} duration={2} separator="" />}
              </h3>
              <p>Year Established</p>
            </div>
          </div>
        </div>
        <div className="circle-wrapper">
          <div className="achievement">
            <img className="icon" src={calendarLogo} alt="Calendar Icon"></img>
            <div className="info">
              <h3>
                {inView && <CountUp end={yearsOfExperience} duration={3} />}{" "}
                years
              </h3>
              <p>of Experience</p>
            </div>
          </div>
        </div>
        <div className="circle-wrapper">
          <div className="achievement">
            <img className="icon" src={buildingLogo} alt="Building Logo"></img>
            <div className="info">
              <h3>{inView && <CountUp end={totalProjects} duration={3} />}</h3>
              <p>Number of Projects</p>
            </div>
          </div>
        </div>
        <div className="circle-wrapper">
          <div className="achievement">
            <img
              className="icon"
              src={certificateLogo}
              alt="Certificate Logo"
            ></img>
            <div className="info">
              <h3>{inView && <CountUp end={totalAwards} duration={3} />}</h3>
              <p>Awards Won</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutAchievements;
