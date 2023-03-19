import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../../context/global.context';

import "./pdf.styles.css";


const smalltalk = require('smalltalk');
const ipcRenderer = window.require("electron").ipcRenderer;

const PDFPreview = () => {

    const navigate = useNavigate();
    const { selectedPages, handleFilesReset } = useGlobalContext();

    const [loading, setLoading] = useState(false);
    const printDiv = useRef(null);

    useEffect(() => {
        if (selectedPages.length <= 0) {
            navigate("/", { replace: true })
        }
    }, [selectedPages, navigate])

    const printLabel = () => {
        if (printDiv.current) {
            setLoading(true)
            ipcRenderer.send("printPDF", printDiv.current.innerHTML)
            ipcRenderer.send("readyToPrintPDF");
            const timer = setTimeout(() => {
                setLoading(false)
                clearTimeout(timer)
            }, 300)
        }
    }

    return (
        <div className='page-margin print-m-p-0'>
            {
                loading && (
                    <div className="hide-for-print position-fixed top-50 start-50  translate-middle" style={{ zIndex: 999 }}>
                        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} className="p-5 rounded-2">
                            <div className="spinner-border text-center" style={{ zIndex: 9999 }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className="pdf-preview print-m-p-0">
                <div className="text-center container hide-for-print">
                    <button className="btn btn-success px-5 mx-1" onClick={printLabel}>Print</button>
                    <button className="btn btn-outline-light px-4 mx-1" onClick={handleFilesReset}>Close</button>
                </div>
                <div data-size="A4" data-layout="landscape" id='print-div' ref={printDiv} className='position-relative p-2'>
                    <div className="container-fluid">
                        {
                            (selectedPages.length > 0) && (
                                selectedPages.reduce(function (rows, key, index) {
                                    return (index % 2 === 0 ? rows.push([key])
                                        : rows[rows.length - 1].push(key)) && rows;
                                }, []).map((pages, _k) => (
                                    <div className={`row g-2 justify-content-between align-items-stretch ${_k > 0 ? "break-page" : ""}`} key={_k}>
                                        {
                                            pages.map((page) => <RenderCol page={page.content} key={page.identifier} />)
                                        }
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};


const RenderCol = ({ page }) => {

    const [width, setWidth] = useState("");
    const handleWidth = (ev) => {
        smalltalk.prompt('set width in percentage', "", width)
            .then((value) => setWidth(value))
            .catch(() => console.error("cancelled"))
    }

    return (
        <div className="col-5" onClick={handleWidth} style={{ width: `${width}%` }}>
            <img src={page} alt="print page preview" className="img-fluid print-m-p-0" />
        </div>
    )
}

export default PDFPreview;