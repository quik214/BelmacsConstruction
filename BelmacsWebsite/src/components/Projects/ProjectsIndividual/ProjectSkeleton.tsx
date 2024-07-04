import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ProjectSkeleton.css';
import './ProjectSkeleton-media.css';

const ProjectSkeleton: React.FC = () => (
  <div className="project-skeleton">
    <Skeleton className="skeleton-img" />
    <Skeleton className="skeleton-title" />
    <Skeleton className="skeleton-subtitle" />
  </div>
);

export default ProjectSkeleton;