import * as pdfjsLib from "pdfjs-dist";
import PDFWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;


/**
 * PDF ENGINE: Converts PDF to Transparent trimmed PNGs
 */
export const convertPdfToImages = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  // Limit check to prevent memory overflow
  if (pdf.numPages > 10)
    throw new Error("File has too many pages. Max 10 per file.");

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    // Scale 2.0 provides high quality for printing without massive file sizes
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: true });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    // Custom trimming logic to remove white margins
    const trimmedCanvas = trimCanvas(canvas);

    pages.push({
      identifier: `${file.name}-p${i}`, // Unique ID for selection persistence
      content: trimmedCanvas.toDataURL("image/png"),
      originalWidth: trimmedCanvas.width,
      originalHeight: trimmedCanvas.height,
    });
  }
  return pages;
};

export const trimCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let top = null,
    bottom = null,
    left = null,
    right = null;

  // Scan pixels for non-white, non-transparent content
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx],
        g = data[idx + 1],
        b = data[idx + 2],
        a = data[idx + 3];

      const isWhite = r > 248 && g > 248 && b > 248;
      if (!isWhite && a > 0) {
        if (top === null) top = y;
        bottom = y;
        if (left === null || x < left) left = x;
        if (right === null || x > right) right = x;
      }
    }
  }

  // If page is empty, return original
  if (top === null) return canvas;

  const trimWidth = right - left + 4; // Adding small padding
  const trimHeight = bottom - top + 4;

  const trimmed = document.createElement("canvas");
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const trimmedCtx = trimmed.getContext("2d");

  trimmedCtx.putImageData(
    ctx.getImageData(left, top, trimWidth, trimHeight),
    0,
    0,
  );
  return trimmed;
};
