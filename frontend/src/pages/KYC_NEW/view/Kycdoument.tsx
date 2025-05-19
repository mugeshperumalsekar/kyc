import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Dialog, DialogActions, DialogContent, CircularProgress } from '@mui/material';
import { Document, Page } from 'react-pdf';
import { useParams } from 'react-router-dom';
import DocumentApiService from '../../../data/services/kyc/document/Document_api_service';
import Loader from '../../loader/loader';

const KycDocument = () => {

    const { kycId } = useParams<{ kycId: string }>();
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [pdfIds, setPdfIds] = useState<string[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [currentPdfIndex, setCurrentPdfIndex] = useState<number>(0);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const customerApiService = new DocumentApiService();
    const [loading, setLoading] = useState(false);
    const [numPagesArray, setNumPagesArray] = useState<number[]>([]);
    const [pdfDataList, setPdfDataList] = useState<{ base64: string; filename: string }[]>([]);

    const handleImageClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
        setPdfError(null);
        setShowPdfModal(false);
        if (kycId) {
            try {
                setLoading(true);
                const fetchedImageIds = await customerApiService.getAllImageID(kycId, 4);
                if (Array.isArray(fetchedImageIds)) {
                    setImageIds(fetchedImageIds);
                    setImageError(null);
                    setCurrentImageIndex(0);
                    await fetchAndShowImage(fetchedImageIds[0]);
                } else {
                    setImageIds([]);
                    setImageError('Unexpected response format.');
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    setImageIds([]);
                    setImageError('No image IDs available.');
                } else {
                    setImageIds([]);
                    setImageError('Error fetching image IDs.');
                }
            }
            finally {
                setLoading(false);
            }
        }
    };

    const handleNextImage = async () => {
        if (imageIds.length > 0 && currentImageIndex < imageIds.length - 1) {
            const nextIndex = currentImageIndex + 1;
            setCurrentImageIndex(nextIndex);
            await fetchAndShowImage(imageIds[nextIndex]);
        }
    };

    const handlePreviousImage = async () => {
        if (imageIds.length > 0 && currentImageIndex > 0) {
            const prevIndex = currentImageIndex - 1;
            setCurrentImageIndex(prevIndex);
            await fetchAndShowImage(imageIds[prevIndex]);
        }
    };

    const fetchAndShowImage = async (imgId: string) => {
        if (kycId) {
            try {
                const imageData = await customerApiService.getAllImage(kycId, imgId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Image(base64String);
                setShowImageModal(true);
                setErrorMessage(null);
            } catch (error) {
                console.error('Error fetching image:', error);
                setBase64Image(null);
                setErrorMessage("No image available");
                setShowImageModal(true);
            }
        }
    };

    const handleCloseImageModals = () => {
        setShowImageModal(false);
    };

    const currentImageId = imageIds.length > 0 ? imageIds[currentImageIndex] : null;

    const handleImageClicks = async (imgId: string) => {
        if (kycId) {
            try {
                const imageData = await customerApiService.getAllImage(kycId, imgId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Image(base64String);
                setShowImageModal(true);
            } catch (error) {
                console.error('Error fetching image:', error);
                setBase64Image(null);
                setErrorMessage("No image available");
                setShowImageModal(true);
            }
        }
    };

    const handlePdfClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
        setImageError(null);
        setShowImageModal(false);
        if (kycId) {
            try {
                setLoading(true);
                const pdfIds = await customerApiService.getAllImageID(kycId, 4);
                console.log('PDF IDs:', pdfIds);
                if (Array.isArray(pdfIds)) {
                    setPdfIds(pdfIds);
                    setPdfError(null);
                    const allPdfData = await Promise.all(pdfIds.map(id => fetchAndShowPdf(id)));
                    const validPdfData = allPdfData.filter((pdf): pdf is { base64: string; filename: string } => pdf !== null && pdf !== undefined);
                    setPdfDataList(validPdfData);
                    if (validPdfData.length === 0) {
                        setPdfError('No PDFs available for the selected KYC ID.');
                    } else {
                        setShowPdfModal(true);
                    }
                } else {
                    setPdfIds([]);
                    setPdfError('Unexpected response format.');
                }
            } catch (error: any) {
                console.error('Error fetching PDFs:', error);
                setPdfError('Error fetching PDFs.');
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchAndShowPdf = async (pdfId: string) => {
        if (kycId) {
            try {
                const pdfData = await customerApiService.getPDF(kycId, pdfId);
                return { base64: pdfData.data, filename: pdfData.filename };
            } catch (error) {
                console.error('Error fetching PDF:', error);
                return null;
            }
        }
    };

    const currentPDFId = pdfIds.length > 0 ? pdfIds[currentPdfIndex] : null;

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const binary = new Uint8Array(buffer);
        const bytes = [];
        for (let i = 0; i < binary.length; i++) {
            bytes.push(String.fromCharCode(binary[i]));
        }
        return `data:image/png;base64,${btoa(bytes.join(''))}`;
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setLoading(false);
        setNumPages(numPages);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };

    const handleClosePdfModal = () => {
        setShowPdfModal(false);
    };

    const handlePrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    };

    return (
        <>
            <div>
                <Button onClick={handleImageClick}>Show Image IDs</Button>
                {loading && <Loader />}
                <Button onClick={handlePdfClick}>Show PDFs</Button>
                {pdfError && !loading && <Typography color="error">{pdfError}</Typography>}
                {loading && <Loader />}
            </div>

            {/* Image Modal */}
            <Dialog open={showImageModal} onClose={handleCloseImageModals} fullWidth maxWidth='md'>
                <DialogContent>
                    {base64Image && <img src={base64Image} alt="Image" style={{ maxWidth: '100%', height: 'auto' }} />}
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePreviousImage} disabled={currentImageIndex === 0}>
                        &lt; Previous
                    </Button>
                    <Button onClick={handleNextImage} disabled={currentImageIndex === imageIds.length - 1}>
                        Next &gt;
                    </Button>
                    <Button onClick={handleCloseImageModals}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Pdf view */}
            <Dialog
                open={showPdfModal}
                onClose={handleClosePdfModal}
                maxWidth="md"
            >
                <DialogContent
                    style={{
                        textAlign: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {loading && <CircularProgress />}
                    {pdfDataList.length > 0 && (
                        pdfDataList.map((pdfData: { base64: string; filename: string }, index: number) => (
                            <div key={`pdf_${index}`}>
                                <Document
                                    file={`data:application/pdf;base64,${pdfData.base64}`}
                                    onLoadSuccess={({ numPages }) => {
                                        setNumPagesArray(prev => {
                                            const newNumPagesArray = [...prev];
                                            newNumPagesArray[index] = numPages;
                                            return newNumPagesArray;
                                        });
                                    }}
                                >
                                    {Array.from(new Array(numPagesArray[index]), (el, pageIndex) => (
                                        <Page
                                            key={`page_${pageIndex + 1}`}
                                            pageNumber={pageIndex + 1}
                                            scale={1.4}
                                        />
                                    ))}
                                </Document>
                            </div>
                        ))
                    )}
                    {pdfError && <Typography color="error">{pdfError}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePdfModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default KycDocument;