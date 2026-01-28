import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TopBar = ({ children }) => {
  const navigate = useNavigate();
  const { key: keyLocation, pathname } = useLocation();

  const handleGoBack = () => {
    let fallbackPath = "/";
    const isInitialLocation = keyLocation === "default";
    const to = isInitialLocation ? fallbackPath : -1;
    navigate(to, { replace: true });
  };

  return (
    <div
      className="hide-for-print position-sticky top-0 border-bottom"
      style={{ zIndex: 9999 }}
    >
      <div className="d-flex justify-content-between align-items-center bg-dark p-3">
        <button className="btn btn-outline-light" onClick={handleGoBack}>
          ← Back to Selection
        </button>

        {children}
      </div>
    </div>
  );
};

export default TopBar;
