import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Document, Page, pdfjs } from 'react-pdf';
import './document.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFModalProps {
    open: boolean;
    onClose: () => void;
    pdfData: string | null;
};

const CustomPage = ({ pageNumber, width }: { pageNumber: number; width: number }) => {

    const [height, setHeight] = useState<number | null>(null);

    const onRenderSuccess = () => {
        const pageContainer = document.getElementById(`page_${pageNumber}`);
        if (pageContainer) {
            const canvas = pageContainer.querySelector('canvas');
            if (canvas) {
                setHeight(canvas.clientHeight);
            }
        }
    };

    return (
        <div id={`page_${pageNumber}`} style={{ width, height: height || 'auto' }}>
            <Page
                key={`page_${pageNumber}`}
                pageNumber={pageNumber}
                width={width}
                onLoadSuccess={onRenderSuccess}
            />
        </div>
    );
};

const PDFModal: React.FC<PDFModalProps> = ({ open, onClose, pdfData }) => {

    const [error, setError] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(1);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setError(null);
    };

    const onError = (err: any) => {
        setError('Error loading PDF. Please try again.');
        console.error('Error loading PDF:', err);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                PDF Viewer
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0' }}>
                {pdfData ? (
                    <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onError}>
                        {Array.from(new Array(numPages), (_, index) => (
                            <CustomPage key={`page_${index + 1}`} pageNumber={index + 1} width={800} />
                        ))}
                    </Document>
                ) : (
                    <div>No PDF data available</div>
                )}
                {error && <div>Error: {error}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PDFModal;