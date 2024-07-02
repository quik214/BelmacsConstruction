import "./AnalyticsDashboard.css";
import "./AnalyticsDashboard-media.css";

import React, { useState, useEffect } from "react";

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="analytic-ctr">
      <div className="analytic-header">Analytic Dashboard</div>
      <iframe
        title="Google Analytics Dashboard"
        width="100%"
        height="600"
        src="https://lookerstudio.google.com/embed/reporting/0fabd31e-947c-48e8-b44f-a2d3d49471d1/page/1M"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default AnalyticsDashboard;
