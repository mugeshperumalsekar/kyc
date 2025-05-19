import React, { useEffect, useState, useRef } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, Button, Grid, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Typography } from '@mui/material';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { kycForm } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import { useApplicationContext } from '../Insert/ApplicationContext';
import jsPDF from 'jspdf';
import { useSelector } from 'react-redux';
import DocumentApiService from '../../../data/services/kyc/document/Document_api_service';
import { Document, Page, pdfjs } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '../../loader/loader';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface CustomerData {
    kycFormDto: kycForm;
};

const ApplicationForm = () => {

    const { responseId } = useApplicationContext();
    console.log('ApplicationForm responseId:', responseId);
    const { kycId } = useParams<{ kycId: string }>();
    const [formData, setFormData] = useState<kycForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const applicationfrome = new ApplicationfromeService();
    const [downloadCount, setDownloadCount] = useState(0);

    useEffect(() => {
        if (responseId) {
            console.log('responseId:', responseId);
        }
    }, [responseId]);

    // Disable scrolling
    // document.documentElement.style.overflow = 'hidden';  // html
    // document.body.style.overflow = 'hidden';             // body

    useEffect(() => {
        const fetchData = async (kycId: string) => {
            try {
                setLoading(true);
                const customerData: CustomerData[] = await applicationfrome.getkycData(kycId);
                if (customerData && customerData.length > 0) {
                    const seenIds = new Set();
                    const uniqueData = customerData.filter((data: CustomerData) => {
                        const id = data.kycFormDto.id;
                        if (seenIds.has(id)) {
                            return false;
                        } else {
                            seenIds.add(id);
                            return true;
                        }
                    });
                    console.log("Filtered Data:", uniqueData);
                    setFormData(uniqueData.map((data: CustomerData) => data.kycFormDto));
                } else {
                    setErrors(["No data found"]);
                }
            } catch (error) {
                setErrors(["Error fetching data"]);
            } finally {
                setLoading(false);
            }
        };
        if (kycId) {
            fetchData(kycId);
        }
    }, [kycId]);

    const itemsPerPage = 22;

    const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
        const pages = [];
        for (let i = 0; i < data.length; i += itemsPerPage) {
            pages.push(data.slice(i, i + itemsPerPage));
        }
        return pages;
    };

    const pages = splitDataIntoPages(formData, itemsPerPage);

    const downloadPDF = async () => {
        setLoading(true);
        setDownloadingPDF(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 0));
            const pdf = new jsPDF('p', 'mm', 'a4');
            const content = document.getElementById('pdfContent');
            if (!content) return;
            pdf.setFontSize(10);
            pdf.setFont('helvetica');
            content.style.display = 'block';
            const padding = 10;
            const scale = 3;
            const pageWidth = 210;
            const pageHeight = 297;
            const contentWidth = pageWidth - 2 * padding;
            const contentHeight = pageHeight - 2 * padding;
            const totalPages = content.childNodes.length;
            for (let i = 0; i < totalPages; i++) {
                const page = content.childNodes[i];
                const canvas = await html2canvas(page as HTMLElement, {
                    scale: scale,
                    useCORS: true,
                    logging: true,
                });
                const imgData = canvas.toDataURL('image/png');
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight);
                pdf.setLineWidth(0.2);
                pdf.setDrawColor(0, 0, 0);
                pdf.rect(padding, padding, contentWidth, contentHeight);
                const pageNumberText = `${i + 1} / ${totalPages}`;
                pdf.setFontSize(10);
                const pageNumberY = pageHeight - padding + 5;
                pdf.text(pageNumberText, pageWidth - padding, pageNumberY, { align: "right" });
            }
            pdf.save('application_form.pdf');
        } catch (error) {
            setErrors(["Error generating PDF"]);
        } finally {
            setDownloadingPDF(false);
            setLoading(false);
            setDownloadCount(prevCount => prevCount + 1);
        }
    };

    const userDetails = useSelector((state: any) => state.loginReducer);
    const { uid, recordTypeId, positionId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const customerApiService = new DocumentApiService();

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };

    const handleClosePdfModal = () => {
        setShowPdfModal(false);
    };

    const handlePrevPage = () => {
        setPageNumber((prevPageNumber) => prevPageNumber - 1);
    };

    const handleNextPage = () => {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };

    const a4SheetStyle = {
        width: '210mm',
        minHeight: '297mm',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px',
    };

    const cellStyle = {
        padding: '8px',
        border: '1px solid #000',
    };

    const evenRowStyle = {
        backgroundColor: '#f2f2f2',
    };

    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        const handleImageClick = async (branchId: number) => {
            if (branchId) {
                try {
                    const branchId = 1;
                    const imageData = await customerApiService.getLetterHead(branchId);
                    const base64String = arrayBufferToBase64(imageData);
                    setImageURL(base64String);
                } catch (error) {
                    console.error('Error fetching image:', error);
                    setImageURL('');
                    setErrorMessage("No image available");
                }
            }
        };
        handleImageClick(1);
    }, []);

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const binary = new Uint8Array(buffer);
        const bytes = [];
        for (let i = 0; i < binary.length; i++) {
            bytes.push(String.fromCharCode(binary[i]));
        }
        return `data:image/png;base64,${btoa(bytes.join(''))}`;
    };

    return (
        <>
            <Container style={{ minHeight: '297mm' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container item xs={12} justifyContent="flex-end" alignItems="center" style={{ marginBottom: '-5px' }}>
                        <FontAwesomeIcon
                            icon={faDownload}
                            onClick={downloadPDF}
                            style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '25px' }}
                            title="Download PDF"
                        />
                        {downloadingPDF && (
                            <Typography variant="body2" color="error" style={{ marginLeft: '10px' }}>
                                Please wait for the download...
                                {loading && <Loader />}
                            </Typography>
                        )}
                    </Grid>
                    <div id="pdfContent">
                        {pages.map((pageContent, pageIndex) => (
                            <Paper key={pageIndex} style={{ marginBottom: '20px', boxShadow: '0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)' }}>
                                <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ fontSize: 'small' }}>
                                                    <TableCell sx={{ width: '5%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                                                    <TableCell sx={{ width: '60%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                                                    <TableCell sx={{ width: '30%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {/* <TableBody>
                                                {pageContent && pageContent.map((item, index) => (
                                                    <TableRow key={index} sx={{ height: '24px' }}>
                                                        <TableCell sx={{ width: '5%', padding: '12px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                            {index + 1 + pageIndex * itemsPerPage}
                                                        </TableCell>
                                                        <TableCell sx={{ width: '60%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                            {item && item.name}
                                                            {item && item.description && (
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {item.description}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell sx={{ width: '30%', padding: '4px', fontSize: '0.75rem' }}>
                                                            {item && item.id === 17 && Array.isArray(item.kycSubQueFormData) ? (
                                                                (() => {
                                                                    const displayOrder = ['Name', 'Designation', 'Contact no', 'Email ID'];
                                                                    const subItemMap = item.kycSubQueFormData.reduce((acc: { [x: string]: any; }, subItem: { name: string | number; kycAnswerData: { answer: string; }[]; }) => {
                                                                        acc[subItem.name] = subItem.kycAnswerData[0]?.answer || 'No answer available';
                                                                        return acc;
                                                                    }, {} as Record<string, string>);
                                                                    return displayOrder.map((field) => (
                                                                        <div key={field}>
                                                                            <strong>{field}:</strong> {subItemMap[field] || 'No answer available'}
                                                                        </div>
                                                                    ));
                                                                })()
                                                            ) : (
                                                                item && item.kycAnswerData && item.kycAnswerData.length > 0 ? (
                                                                    <>
                                                                        {item.kycAnswerData[0]?.answer}
                                                                        {item.kycAnswerData[0]?.answer === "Under Process" && item.kycAnswerData[0]?.additionalDetails && (
                                                                            <div><strong>Additional Details : </strong>{item.kycAnswerData[0].additionalDetails}</div>
                                                                        )}
                                                                    </>
                                                                ) : 'No answer available'
                                                            )}
                                                            {errors[index + pageIndex * itemsPerPage] && (
                                                                <Typography variant="caption" color="error">
                                                                    {errors[index + pageIndex * itemsPerPage]}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody> */}
                                            <TableBody>
                                                {pageContent && pageContent.map((item, index) => (
                                                    <TableRow key={index} sx={{ height: '24px' }}>
                                                        <TableCell
                                                            sx={{
                                                                width: '5%',
                                                                padding: '12px',
                                                                fontSize: '0.75rem',
                                                                whiteSpace: 'pre-wrap',
                                                                fontWeight: '900',
                                                            }}
                                                        >
                                                            {index + 1 + pageIndex * itemsPerPage}
                                                        </TableCell>

                                                        <TableCell
                                                            sx={{
                                                                width: '60%',
                                                                padding: '4px',
                                                                fontSize: '0.75rem',
                                                                whiteSpace: 'pre-wrap',
                                                                fontWeight: '900',
                                                            }}
                                                        >
                                                            {item?.name}
                                                            {item?.description && (
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {item.description}
                                                                </Typography>
                                                            )}
                                                        </TableCell>

                                                        <TableCell sx={{ width: '30%', padding: '4px', fontSize: '0.75rem' }}>
                                                            {item?.id === 17 && Array.isArray(item.kycSubQueFormData) ? (
                                                                (() => {
                                                                    const displayOrder = ['Name', 'Designation', 'Contact no', 'Email ID'];
                                                                    const subItemMap = item.kycSubQueFormData.reduce((acc: { [x: string]: any }, subItem: { name: string | number, kycAnswerData: { answer: string }[] }) => {
                                                                        acc[subItem.name] = subItem.kycAnswerData[0]?.answer || 'No answer available';
                                                                        return acc;
                                                                    }, {} as Record<string, string>);
                                                                    return displayOrder.map((field) => (
                                                                        <div key={field}>
                                                                            <strong>{field}:</strong> {subItemMap[field] || 'No answer available'}
                                                                        </div>
                                                                    ));
                                                                })()
                                                            ) : (
                                                                item?.kycAnswerData && item.kycAnswerData.length > 0 ? (
                                                                    <>
                                                                        {item.kycAnswerData[0]?.answer?.trim() ? (
                                                                            <>
                                                                                {item.kycAnswerData[0].answer}
                                                                                {item.kycAnswerData[0].answer === "Under Process" &&
                                                                                    item.kycAnswerData[0]?.additionalDetails && (
                                                                                        <div>
                                                                                            <strong>Additional Details:</strong>{' '}
                                                                                            {item.kycAnswerData[0].additionalDetails}
                                                                                        </div>
                                                                                    )}
                                                                            </>
                                                                        ) : (
                                                                            'No answer available'
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    'No answer available'
                                                                )
                                                            )}

                                                            {errors[index + pageIndex * itemsPerPage] && (
                                                                <Typography variant="caption" color="error">
                                                                    {errors[index + pageIndex * itemsPerPage]}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {/* <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '0px', right: '20px', fontSize: 'small' }}>
                                            Page: {pageIndex + 1}
                                        </div> */}
                                </div>
                            </Paper>
                        ))}
                        <div style={a4SheetStyle}>
                            <table style={tableStyle}>
                                <tbody>
                                    <tr style={evenRowStyle}>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Name</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Designation (Principal Officer/Compliance Officer/MLRO)</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}></td>
                                    </tr>
                                    <tr style={evenRowStyle}>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Signature</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Seal of the Member</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}></td>
                                    </tr>
                                    <tr style={evenRowStyle}>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Date</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Place</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}></td>
                                    </tr>
                                </tbody>
                            </table>

                            <Dialog open={showImageModal} onClose={handleCloseImageModal} fullWidth maxWidth='xl'>
                                <DialogTitle>Image Preview</DialogTitle>
                                <DialogContent>
                                    {base64Image && <img src={base64Image} alt="Image Preview" />}
                                    {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseImageModal}>Close</Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={showPdfModal} onClose={handleClosePdfModal} fullWidth maxWidth='xl'>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent dividers={true} style={{ height: '80vh', overflowY: 'auto' }}>
                                    {pdfData.base64 && (
                                        <Document file={`data:application/pdf;base64,${pdfData.base64}`} onLoadSuccess={onDocumentLoadSuccess} className="pdf-document">
                                            <Page pageNumber={pageNumber} width={window.innerWidth * 0.8} />
                                        </Document>
                                    )}
                                    {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handlePrevPage} disabled={pageNumber <= 1}>Prev</Button>
                                    <Button onClick={handleNextPage} disabled={pageNumber >= numPages!}>Next</Button>
                                    {pdfData.filename && (
                                        <div>
                                            <a href={`data:application/pdf;base64,${pdfData.base64}`} download={pdfData.filename} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>
                                                Download PDF
                                            </a>
                                        </div>
                                    )}
                                    <Button onClick={handleClosePdfModal}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </LocalizationProvider>
            </Container>
        </>
    );
};

export default ApplicationForm; 