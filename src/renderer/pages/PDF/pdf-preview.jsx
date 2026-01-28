import React, { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/global.context";
import smalltalk from "smalltalk";

import "./pdf.styles.css";
import TopBar from "../../components/top-bar/top-bar";

const RenderCol = ({ pageId, content }) => {
  const { pageWidths, setPageWidths, setSelections } = useGlobalContext();
  const currentWidth = pageWidths[pageId] || 45;

  const adjustLayout = () => {
    smalltalk
      .prompt(
        "Adjust Page Width",
        "Enter width percentage (e.g., 30, 45, 90):",
        currentWidth,
      )
      .then((value) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
          setPageWidths((prev) => ({
            ...prev,
            [pageId]: parseFloat(value),
          }));
        }
      })
      .catch(() => {});
  };

  return (
    <div className="label-item-wrapper" style={{ width: `${currentWidth}%` }}>
      <div className="label-card border rounded">
        <img src={content} alt="Label" />

        <div className="label-controls hide-for-print">
          <button
            className="btn btn-sm btn-info py-0 px-1"
            onClick={adjustLayout}
          >
            {currentWidth}%
          </button>
          <button
            className="btn btn-sm btn-danger py-0 px-1"
            onClick={() =>
              setSelections((prev) =>
                prev.filter((p) => p.identifier !== pageId),
              )
            }
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

const PDFPreview = () => {
  const { selectedPages, pageWidths, labelsPerPage, setLabelsPerPage } =
    useGlobalContext();
  const [loading, setLoading] = useState(false);
  const printDiv = useRef();
  const navigate = useNavigate();

  const chunkedPages = useMemo(() => {
    if (selectedPages.length === 0) return [];

    const pages = [];
    let currentPage = [];
    let currentWidthSum = 0;

    selectedPages.forEach((page) => {
      const pageWidth = pageWidths[page.identifier] || 45;

      if (
        currentWidthSum + pageWidth > 101 ||
        currentPage.length >= labelsPerPage
      ) {
        pages.push(currentPage);
        currentPage = [page];
        currentWidthSum = pageWidth;
      } else {
        currentPage.push(page);
        currentWidthSum += pageWidth;
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    return pages;
  }, [selectedPages, pageWidths, labelsPerPage]);

  const handlePrint = () => {
    if (!printDiv.current) return;
    setLoading(true);

    const images = printDiv.current.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(imagePromises).then(() => {
      setTimeout(() => {
        window.electronAPI.printPDF();
      }, 700);
    });

    window.electronAPI.onPdfSaved(() => setLoading(false));
  };

  return (
    <div>
      <TopBar>
        <div className="d-flex align-items-center gap-3">
          <label className="text-white mb-0">Labels per Page:</label>
          <select
            className="form-select form-select-sm w-auto"
            value={labelsPerPage}
            onChange={(e) => setLabelsPerPage(parseInt(e.target.value))}
          >
            <option value="1">1 Label</option>
            <option value="2">2 Labels</option>
            <option value="4">4 Labels</option>
            <option value="6">6 Labels</option>
          </select>
        </div>

        <button
          className="btn btn-info px-4 fw-bold"
          onClick={handlePrint}
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Confirm & Print PDF"}
        </button>
      </TopBar>
      <div id="print-area" ref={printDiv}>
        {chunkedPages.map((pageGroup, index) => (
          <div key={index} className="preview-canvas-a4">
            {pageGroup.map((page) => (
              <RenderCol
                key={page.identifier}
                pageId={page.identifier}
                content={page.content}
              />
            ))}

            <div className="position-absolute bottom-0 end-0 p-3 text-secondary x-small hide-for-print">
              Sheet {index + 1} of {chunkedPages.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFPreview;
