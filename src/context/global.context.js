import React, { createContext, useCallback, useContext, useState } from 'react';

const GlobalContext = createContext({
    files: [],
    updateFiles: (f = []) => { },
    setSelections: (f = []) => { },
    handleFilesReset: () => { }
})

const GlobalContextProvider = ({ children }) => {
    const [files, setFiles] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);

    const updateFiles = useCallback((fs = []) => {
        setFiles(fs)
    }, [])
    
    const setSelections = useCallback((fs = []) => {
        setSelectedPages(fs)
    }, [])


    const handleFilesReset = () => {
        setSelectedPages([])
        updateFiles([])
    }

    const values = {
        files,
        selectedPages,
        updateFiles,
        setSelections,
        handleFilesReset
    }
    return (
        <GlobalContext.Provider value={values}>
            {children}
        </GlobalContext.Provider>
    );
};


export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("useGlobalContext must be used inside Global Context Provider")

    const { files, updateFiles, setSelections, selectedPages, handleFilesReset } = context;
    return { files, updateFiles, setSelections, selectedPages, handleFilesReset }
}

export default GlobalContextProvider;