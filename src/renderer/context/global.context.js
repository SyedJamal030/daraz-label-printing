import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [pageWidths, setPageWidths] = useState({});
  const [labelsPerPage, setLabelsPerPage] = useState(2); 

  const handleFilesReset = useCallback(() => {
    setFiles([]);
    setSelectedPages([]);
    setProcessedImages([]);
    setPageWidths({});
  }, []);

  const value = useMemo(() => ({
    files,
    selectedPages,
    updateFiles: setFiles,
    setSelections: setSelectedPages,
    processedImages,
    setProcessedImages,
    pageWidths,
    setPageWidths,
    labelsPerPage,
    setLabelsPerPage,
    handleFilesReset
  }), [files, selectedPages, processedImages, pageWidths, labelsPerPage, handleFilesReset]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
