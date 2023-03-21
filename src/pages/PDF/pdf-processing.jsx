import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

import { useGlobalContext } from '../../context/global.context';

import "./pdf.styles.css";

GlobalWorkerOptions.workerSrc = "pdf.worker.js";

const PDFProcessing = () => {
    const { files, setSelections, selectedPages, handleFilesReset } = useGlobalContext();

    const [filesInImages, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchImageRef = useRef(false);
    useEffect(() => {

        const fetchPages = () => {
            setLoading(true)
            let promises = [];
            files.map((f) => promises.push(convertPdfToImages(f)))

            setImages([])
            Promise.all(promises).then((responses) => {
                setImages((prev) => [...prev, ...responses.flat(2)])
            }).finally(() => setLoading(false))
        }

        if (files.length <= 0) {
            navigate("/", { replace: true })
        } else {
            if (!fetchImageRef.current) {
                fetchImageRef.current = true;
                fetchPages()
            }
        }
    }, [files, navigate])

    const handleFileSelection = (checked, file) => {
        if (checked) {
            setSelections((prev) => [...prev, file])
        } else {
            setSelections((prev) => {
                const newFiles = [...prev]
                // newFiles.filter((f) => f.identifier === file.identifier)
                // newFiles.splice(newFiles.indexOf(file), 1)
                return newFiles.filter((f) => f.identifier !== file.identifier)
            })
        }
    }


    const isDefaultChecked = (file) => {
        return Boolean(selectedPages.find((selected) => selected.identifier === file.identifier))
    }

    return (
        <div className='page-margin'>
            {
                loading && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
            }
            {
                (filesInImages.length > 0) && (
                    <div className="container-fluid">
                        <div className="row">
                            {
                                filesInImages.flatMap((file) => {
                                    const d = Date.now();
                                    const page = file.identifier;
                                    
                                    return (
                                        <div className="col-xl-2 col-lg-3 col-md-6" key={page}>
                                            <div className="my-2">
                                                <label className="pdf-page-selector w-100 d-inline-block my-1" htmlFor={`page-selector_${d}_${page}`}>
                                                    <mark>{page}</mark>
                                                    <input type="checkbox" className='pdf-selector' name="pdf-page-selector"
                                                        id={`page-selector_${d}_${page}`} defaultChecked={isDefaultChecked(file)}
                                                        onChange={(e) => handleFileSelection(e.target.checked, file)} />
                                                    <img src={file.content} alt="pdf-preview" className="w-100 radio-image img-fluid" id={`page-image_${d}_${page}`} />
                                                </label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="text-end p-3 fixed-bottom">
                            <button className='btn btn-outline-light mx-1 px-4' onClick={handleFilesReset}>Reset</button>
                            {
                                selectedPages.length > 0 && (
                                    <Link to={"/preview"} className='btn btn-info mx-1 px-5'>Continue</Link>
                                )
                            }
                        </div>
                    </div>
                )
            }

        </div>
    );
};

const readFileData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsDataURL(file);
    });
};

//param: file -> the input file (e.g. event.target.files[0])
//return: images -> an array of images encoded in base64 
const convertPdfToImages = async (file) => {
    const images = [];
    const data = await readFileData(file);
    const pdf = await getDocument(data).promise;
    const canvas = document.createElement("canvas");
    if (pdf.numPages > 5) {
        throw new Error("max page count allowed is: 5")
    }

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 5 });
        const context = canvas.getContext("2d", { willReadFrequently: true });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        images.push({
            identifier: i,
            content: trimCanvas(canvas).toDataURL('image/png', 1)
        });
    }
    canvas.remove();
    return images;
}


const trimCanvas = (c) => {
    let ctx = c.getContext('2d', { willReadFrequently: true }),
        copy = document.createElement('canvas').getContext('2d', { willReadFrequently: true }),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        pix = pixels.data,
        l = pixels.data.length, i,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
        },
        x, y,
        newColor = { r: 0, g: 0, b: 0, a: 0 };

    for (let i = 0, n = pix.length; i < n; i += 4) {
        let r = pix[i],
            g = pix[i + 1],
            b = pix[i + 2];

        if (r === 255 && g === 255 && b === 255) {
            // Change the white to the new color.
            pix[i] = newColor.r;
            pix[i + 1] = newColor.g;
            pix[i + 2] = newColor.b;
            pix[i + 3] = newColor.a;
        }
    }

    ctx.putImageData(pixels, 0, 0);

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (i = 0; i < l; i += 4) {
        if (pix[i + 3] !== 0) {
            x = ((i / 4) % c.width) + 1.25;
            y = (~~((i / 4) / c.width)) + 1.25;

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    // Calculate the height and width of the content
    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;


    copy.putImageData(trimmed, 0, 0);
    // Return trimmed canvas
    return copy.canvas;
}

export default PDFProcessing;