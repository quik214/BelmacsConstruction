import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProjectSkeleton: React.FC = () => (
  <div className="project-skeleton">
    <Skeleton height={245} width={300} />
    <Skeleton height={20} width={200} style={{ margin: '10px 0' }} />
    <Skeleton height={20} width={100} />
  </div>
);

export default ProjectSkeleton;