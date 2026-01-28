import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { convertPdfToImages } from "../../util";
import { useGlobalContext } from "../../context/global.context";

import { TopBar } from "../../components/top-bar";

import "./pdf.styles.css";

const PDFProcessing = () => {
  const {
    files,
    selectedPages,
    setSelections,
    processedImages,
    setProcessedImages,
    handleFilesReset,
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (files.length <= 0) {
      navigate("/", { replace: true });
      return;
    }

    if (processedImages.length === 0) {
      handleConversion();
    }
  }, [files, processedImages.length, navigate]);

  const handleConversion = async () => {
    setLoading(true);
    try {
      const allProcessedPages = [];
      for (const file of files) {
        const pages = await convertPdfToImages(file);
        allProcessedPages.push(...pages);
      }

      setProcessedImages(allProcessedPages);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Error processing PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (checked, pageObj) => {
    if (checked) {
      setSelections([...selectedPages, pageObj]);
    } else {
      setSelections(
        selectedPages.filter((p) => p.identifier !== pageObj.identifier),
      );
    }
  };

  const selectAll = () => setSelections(processedImages);
  const deselectAll = () => setSelections([]);

  return (
    <div>
      {loading && (
        <div
          className="position-fixed top-50 start-50 translate-middle text-center"
          style={{ zIndex: 1000 }}
        >
          <div className="p-4 bg-dark rounded-3 shadow-lg">
            <div className="spinner-grow text-info" role="status"></div>
            <p className="mt-2 text-white">Extracting Labels...</p>
          </div>
        </div>
      )}
      <TopBar />

      <div className="container-fluid" style={{ margin: "5rem 0" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-white">Select Pages to Combine</h4>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-info" onClick={selectAll}>
              Select All
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={deselectAll}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="row g-4">
          {processedImages.map((page, index) => {
            const isSelected = selectedPages.some(
              (p) => p.identifier === page.identifier,
            );

            return (
              <div
                className="col-xl-2 col-lg-3 col-md-4 col-6"
                key={page.identifier}
              >
                <div
                  className={`card h-100 border-2 label-card ${isSelected ? "border-info shadow" : "border-secondary"}`}
                >
                  <label className="m-0 cursor-pointer w-100 h-100">
                    <div className="card-header d-flex justify-content-between align-items-center py-1 bg-transparent border-0">
                      <span
                        className={`badge ${isSelected ? "bg-info text-dark" : "bg-secondary"}`}
                      >
                        Page {index + 1}
                      </span>
                      <input
                        type="checkbox"
                        className="form-check-input mt-0"
                        checked={isSelected}
                        onChange={(e) =>
                          toggleSelection(e.target.checked, page)
                        }
                      />
                    </div>
                    <div
                      className="card-body p-2 d-flex align-items-center justify-content-center"
                      style={{ minHeight: "150px" }}
                    >
                      <img
                        alt="Preview"
                        src={page.content}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: 300 }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="fixed-bottom bg-dark border-top border-secondary p-3 text-end shadow-lg"
        style={{ zIndex: 1050 }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="text-secondary small">
            {selectedPages.length} pages selected
          </div>
          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={handleFilesReset}
            >
              Reset All
            </button>
            <button
              className="btn btn-info px-5"
              disabled={selectedPages.length === 0}
              onClick={() => navigate("/preview")}
            >
              Continue to Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFProcessing;
