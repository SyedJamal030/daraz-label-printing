import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { PDFProcessing, PDFPreview } from "./pages/PDF";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} exact />
      <Route path="/process" element={<PDFProcessing />} />
      <Route path="/preview" element={<PDFPreview />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};

export default App;
