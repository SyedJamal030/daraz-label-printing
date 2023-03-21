import React from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Home } from "./pages/Home"
import { PDFProcessing, PDFPreview } from "./pages/PDF"

const App = () => {
  const navigate = useNavigate();
  const { key: keyLocation, pathname } = useLocation();

  const handleGoBack = () => {
    let fallbackPath = '/';
    const isInitialLocation = keyLocation === 'default';
    const to = isInitialLocation ? fallbackPath : -1;
    navigate(to, { replace: true });
  };

  console.log(pathname);

  return (
    <div>
      {
        (pathname !== "/" && pathname !== "/process") && (
          <div className="fixed-top bg-white shadow-sm py-3 hide-for-print">
            <div className="container-fluid">
              <button className="btn btn-dark btn-sm btn-rounded" onClick={handleGoBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
                </svg>
              </button>
            </div>
          </div>
        )
      }
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/process" element={<PDFProcessing />} />
        <Route path="/preview" element={<PDFPreview />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  );
};

export default App;