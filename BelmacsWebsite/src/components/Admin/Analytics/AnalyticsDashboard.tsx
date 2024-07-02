import "./AnalyticsDashboard.css";
import "./AnalyticsDashboard-media.css";

import React from "react";

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="analytics-ctr">
      <div className="analytic-dashboard">
        <iframe
          title="Google Analytics Dashboard"
          width="100%"
          height="800"
          src="https://lookerstudio.google.com/embed/reporting/27450813-5df6-47c1-a3aa-3a0778e68675/page/kIV1C"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
