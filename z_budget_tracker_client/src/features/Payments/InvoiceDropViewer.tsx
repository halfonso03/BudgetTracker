import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import data from '../../../src/images/sig.jpg';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const InvoiceDropViewer = () => {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // 2. Drop directly onto a specific page wrapper
  const handleDropOnPage = async (
    e: React.DragEvent<HTMLDivElement>,
    pageIndex: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const pageRect = e.currentTarget.getBoundingClientRect();

    // Adjust drop coordinates by where the user grabbed the image
    const dropX = e.clientX - pageRect.left - dragOffsetRef.current.x;
    const dropY = e.clientY - pageRect.top - dragOffsetRef.current.y;
    
    const src =
      e.dataTransfer.getData('text/plain') ||
      e.dataTransfer.getData('text/uri-list');

    if (!src || !pdfBytes) return;

    try {
      const response = await fetch(src);
      const contentType = response.headers.get('Content-Type') || '';
      const imageArrayBuffer = await response.arrayBuffer();

      // Measure the exact individual <Page> container, not the whole Document

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.getPage(pageIndex);
      const { width: pdfWidth, height: pdfHeight } = page.getSize();

      const isPng =
        contentType.includes('image/png') || src.toLowerCase().endsWith('.png');

      const embeddedImg = isPng
        ? await pdfDoc.embedPng(imageArrayBuffer)
        : await pdfDoc.embedJpg(imageArrayBuffer);

      // Map screen pixels to PDF points using this single page's dimensions
      const scaleX = pdfWidth / pageRect.width;
      const scaleY = pdfHeight / pageRect.height;

      // Match the rendered width of your dragged image (140px) scaled to PDF points
      const sigWidth = 140 * scaleX;
      const sigHeight = (embeddedImg.height / embeddedImg.width) * sigWidth;

      const pdfX = dropX * scaleX;
      const pdfY = pdfHeight - dropY * scaleY - sigHeight;

      page.drawImage(embeddedImg, {
        x: pdfX,
        y: pdfY,
        width: sigWidth,
        height: sigHeight,
      });

      const updatedPdfUint8 = await pdfDoc.save();
      setPdfBytes(updatedPdfUint8.slice().buffer);
    } catch (err) {
      console.error('Failed to stamp image onto PDF:', err);
    }
  };

  const handleDropOnPdf = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.log(e.dataTransfer.files);

    const src =
      e.dataTransfer.getData('text/plain') ||
      e.dataTransfer.getData('text/uri-list');

    if (!src) return;
    if (!invoiceFile) return;

    const response = await fetch(src);
    const contentType = response.headers.get('Content-Type') || '';
    // const imageArrayBuffer = await response.arrayBuffer();

    // const imageFile = e.dataTransfer.files[0];
    // if (!imageFile || !imageFile.type.startsWith('image/')) return;

    if (!pageContainerRef.current) return;

    try {
      const response = await fetch(src);
      const imageArrayBuffer = await response.arrayBuffer();

      // 1. Get drop position relative to the rendered PDF page
      const rect = pageContainerRef.current.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;

      // 2. Load the PDF and the dropped image into pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytes as ArrayBuffer);
      const page = pdfDoc.getPage(0); // Target page index

      const isPng =
        contentType.includes('image/png') || src.toLowerCase().endsWith('.png');
      const { width: pdfWidth, height: pdfHeight } = page.getSize();
      const embeddedImg = isPng
        ? await pdfDoc.embedPng(imageArrayBuffer)
        : await pdfDoc.embedJpg(imageArrayBuffer);

      // 4. Scale screen pixels to PDF points and flip the Y-axis
      const scaleX = pdfWidth / rect.width;
      const scaleY = pdfHeight / rect.height;
      const sigWidth = 120;
      const sigHeight = (embeddedImg.height / embeddedImg.width) * sigWidth;

      const pdfX = dropX * scaleX;
      const pdfY = pdfHeight - dropY * scaleY - sigHeight;

      page.drawImage(embeddedImg, {
        x: pdfX,
        y: pdfY,
        width: sigWidth,
        height: sigHeight,
      });

      // 5. Save and update state with a clean ArrayBuffer slice
      const updatedPdfUint8 = await pdfDoc.save();
      const cleanBuffer = updatedPdfUint8.slice().buffer;
      setPdfBytes(cleanBuffer);

      // Ready to pass into libraries like pdf-lib (e.g., pdfDoc.embedPng(arrayBuffer))
    } catch (err) {
      console.error('Failed to convert image to ArrayBuffer:', err);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setInvoiceFile(acceptedFiles[0]);
      const r = await acceptedFiles[0].arrayBuffer();
      setPdfBytes(r);
      setNumPages(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.dataTransfer.setData('text/plain', e.currentTarget.src);

    const imgRect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - imgRect.left,
      y: e.clientY - imgRect.top,
    };
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Required to allow dropping
    e.preventDefault();
  };

  //   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //     e.preventDefault();
  //     const src = e.dataTransfer.getData('text/plain');
  //     setDroppedSrc(src);
  //   };

  return (
    <div style={{ maxWidth: 850, margin: '0 auto' }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #888',
          borderRadius: 8,
          padding: 32,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          marginBottom: 24,
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF invoice here...</p>
        ) : (
          <p>Drag & drop a PDF invoice here, or click to select a file</p>
        )}
      </div>

      {invoiceFile && (
        <div>
          <div
            style={{
              border: '2px solid yellow',
              padding: '10px',
              maxHeight: 700,
              overflowY: 'auto',
            }}
          >
            <div
              ref={pageContainerRef}
              onDragOver={handleDragOver}
              //   onDrop={handleDropOnPdf}
              style={{
                position: 'relative',
                display: 'inline-block',
                padding: '10px',
                border: '2px dashed green',
              }}
            >
              <Document
                file={pdfBytes}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<p style={{ padding: 16 }}>Loading invoice...</p>}
                error={
                  <p style={{ padding: 16, color: 'red' }}>
                    Failed to load PDF.
                  </p>
                }
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnPage(e, index)}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      marginBottom: 8,
                    }}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={760}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: '14px' }}>Drag onto PDF:</p>
        <img
          src={data}
          alt="Signature"
          draggable={true}
          onDragStart={handleDragStart}
          style={{ width: '140px', cursor: 'grab', display: 'block' }}
        />
      </div>
      {/* 
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: 400,
          height: 300,
          border: '2px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {droppedSrc ? (
          <img src={droppedSrc} alt="Dropped" style={{ width: 120 }} />
        ) : (
          'Drop image here'
        )}
      </div> */}
    </div>
  );
};
export default InvoiceDropViewer;
