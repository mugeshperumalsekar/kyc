import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, Button, Grid, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { GetData, GetDatas, QuestionType, UpdateAppFormData, UpdateApplicantFormDetailsData } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import contactImage from '../../../assets/contact.png';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import { useApplicationContext } from '../Insert/ApplicationContext';
import jsPDF from 'jspdf';
import { useSelector } from 'react-redux';
import DocumentApiService from '../../../data/services/kyc/document/Document_api_service';
import { Document, Page, pdfjs } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Letter from './Letter';
import { Select, MenuItem } from '@mui/material';
import Kycdoument from '../View/Kycdoument';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface CustomerData {
    kycFormDto: kycForm;
};

interface kycForm {
    id: number;
    name: string;
    subQuestionId: number;
    description: string | null;
    ansTypeId: number;
    kycAnswerData: kycAnswerData[];
};

interface kycAnswerData {
    answer: string;
    score: number;
};

interface FormValues {
    Letterhead: any;
    Questionnaire: any;
    Declaration: any;
    ListofBoardDirectors: any;
    KYCDocument: any;
};

interface SectionProps {
    formData: any;
    handleInputChange: (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

interface Director {
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: string;
    citizenship: string;
    domicile: string;
};

interface ShareHolder {
    firstName: string;
    middleName: string;
    lastName: string;
    pan: string;
    nationality: string;
    citizenship: string;
    domicile: string;
};

function Letterhead({ formData, handleInputChange }: SectionProps) {
    return (
        <Box mt={2}>
            <Letter />
        </Box>
    );
}

function Questionnaire({ handleInputChange }: SectionProps) {
    const { responseId } = useSelector((state: any) => state.loginReducer);
    console.log('ApplicationForm responseId:', responseId);
    const location = useLocation();
    const { kycId } = useParams<{ kycId: string }>();
    const [formData, setFormData] = useState<kycForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const applicationfrome = new ApplicationfromeService();
    const [downloadCount, setDownloadCount] = useState(0);
    const [pageDisabled, setPageDisabled] = useState(true);
    const [editingFields, setEditingFields] = useState<number[]>([]);
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    const [updateFormData, setUpdateFormData] = useState<UpdateAppFormData>({
        applicantFormDto: {
            id: 0,
            name: '',
            numberOfPrint: 0,
            applicantFormDetailsData: [],
        },
    });

    useEffect(() => {
        const fetchData = async (kycId: string) => {
            try {
                setLoading(true);
                const customerData: CustomerData[] = await applicationfrome.getkycData(kycId);
                if (customerData && customerData.length > 0) {
                    setFormData(customerData.map((data: CustomerData) => data.kycFormDto));
                } else {
                    setErrors(["No data found"]);
                }
                console.log("customerData", customerData);
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

    useEffect(() => {
        const responseId = sessionStorage.getItem('responseId');
        if (responseId) {
            const kycId = Number(responseId);
            if (!isNaN(kycId)) {
            } else {
                console.error('Invalid kycId retrieved from session storage');
            }
        } else {
            console.error('No responseId found in session storage for edit');
        }
    }, [sessionStorage.getItem('responseId')]);

    const itemsPerPage = 22;

    const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
        const pages = [];
        for (let i = 0; i < data.length; i += itemsPerPage) {
            pages.push(data.slice(i, i + itemsPerPage));
        }
        return pages;
    };

    const pages = splitDataIntoPages(formData, itemsPerPage);

    const toggleFieldEditing = (fieldIndex: number) => {
        setEditingFields(prevEditingFields => {
            if (prevEditingFields.includes(fieldIndex)) {
                return prevEditingFields.filter(index => index !== fieldIndex);
            } else {
                return [...prevEditingFields, fieldIndex];
            }
        });
    };

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const customerApiService = new DocumentApiService();

    const handleImageClick = async () => {
        if (kycId) {
            try {
                const imageData = await customerApiService.getImage(kycId, "1");
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

    const handlePdfClick = async () => {
        if (kycId) {
            try {
                const pdfData = await customerApiService.getPDF(kycId, "1");
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
                setShowPdfModal(true);
            } catch (error) {
                console.error('Error fetching PDF:', error);
                setPdfData({ base64: null, filename: null });
                setErrorMessage("No PDF available");
                setShowPdfModal(true);
            }
        }
    };

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

    const handleAnswerChange = (questionIndex: number, fieldIndex: number, value: string | number) => {
        console.log('Before Update:', formData);
        setFormData(prevFormData => {
            const updatedFormData = [...prevFormData];
            if (updatedFormData[questionIndex]?.kycAnswerData && updatedFormData[questionIndex].kycAnswerData[fieldIndex]) {
                updatedFormData[questionIndex].kycAnswerData[fieldIndex].answer = value.toString();
            }
            console.log('After Update:', updatedFormData);
            return updatedFormData;
        });
    };

    const handleDropdownChange = (questionIndex: number, fieldIndex: number, value: string) => {
        console.log('Before Update:', formData);
        setFormData(prevFormData => {
            const updatedFormData = [...prevFormData];
            if (updatedFormData[questionIndex]?.kycAnswerData && updatedFormData[questionIndex].kycAnswerData[fieldIndex]) {
                updatedFormData[questionIndex].kycAnswerData[fieldIndex].answer = value;
            }
            console.log('After Update:', updatedFormData);
            return updatedFormData;
        });
    };

    const [saveClicked, setSaveClicked] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const { setResponseId } = useApplicationContext();

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    const handleEditSubmit = async () => {
        try {
            const updatedDetailsData: UpdateApplicantFormDetailsData[] = updateFormData.applicantFormDto.applicantFormDetailsData.map((data) => ({
                id: data.id || 0,
                kycId: data.kycId,
                accountTypeId: data.accountTypeId,
                applicationTypeId: data.applicationTypeId,
                questionId: data.questionId,
                subQuestionId: data.subQuestionId,
                ansTypeId: data.ansTypeId,
                ansId: data.ansId,
                isSubAnswer: data.isSubAnswer,
                answer: data.answer,
                score: data.score,
                uid: data.uid,
                euid: data.euid,
            }));
            const updatedFormData: UpdateAppFormData = {
                applicantFormDto: {
                    id: updateFormData.applicantFormDto.id || 0,
                    name: updateFormData.applicantFormDto.name,
                    numberOfPrint: updateFormData.applicantFormDto.numberOfPrint,
                    applicantFormDetailsData: updatedDetailsData,
                },
            };
            console.log('Payload to be sent:', updatedFormData);
            const response = await applicationfrome.ApllicationUpdate(updateFormData.applicantFormDto.id, updatedFormData);
            console.log('Updated formData:', updatedFormData);
            if (response && response.id) {
                console.log('Form updated successfully');
                showSuccessMessage('Form updated successfully.');
            } else {
                console.error('Form update failed, response:', response);
                showErrorMessage('Form update failed.');
            }
        } catch (error) {
            console.error('Error updating form:', error);
            showErrorMessage('Error updating form.');
        }
    };

    return (
        <Box mt={2}>
            <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                <Container style={{ minHeight: '297mm' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div id="pdfContent">
                            {pages.map((pageContent, pageIndex) => (
                                <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
                                    <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                        <div>
                                            {imageURL && (
                                                <img
                                                    src={imageURL}
                                                    alt="Ponsun"
                                                    style={{ display: 'block', margin: '0 auto', maxWidth: '35%', height: 'auto', maxHeight: '200px', marginBottom: '20px' }}
                                                />
                                            )}
                                        </div>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ fontSize: 'small' }}>
                                                        <TableCell sx={{ width: '5%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                                                        <TableCell sx={{ width: '60%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                                                        <TableCell sx={{ width: '30%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {pageContent.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ width: '10%', padding: '20px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                {(index + 1) + pageIndex * itemsPerPage}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                {item.name}
                                                                {item.description && (
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {item.description}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.ansTypeId === 1 ? (
                                                                    <TextField
                                                                        sx={{ fontSize: 'x-small' }}
                                                                        fullWidth
                                                                        size='small'
                                                                        autoComplete='off'
                                                                        multiline
                                                                        value={item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : ''}
                                                                        onChange={(e) => handleAnswerChange(pageIndex * itemsPerPage + index, 0, e.target.value)}
                                                                    />
                                                                ) : item.ansTypeId === 2 ? (
                                                                    <Select
                                                                        style={{ fontSize: 'small' }}
                                                                        fullWidth
                                                                        size='small'
                                                                        value={item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : ''}
                                                                        onChange={(e) => handleDropdownChange(pageIndex * itemsPerPage + index, 0, e.target.value)}
                                                                        displayEmpty
                                                                    >
                                                                        {item.kycAnswerData && item.kycAnswerData.map((answerData: any, optionIndex: number) => (
                                                                            <MenuItem key={optionIndex} value={answerData.answer}>
                                                                                {answerData.answer}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                ) : (
                                                                    <Typography variant="caption" color="error">
                                                                        No answer available
                                                                    </Typography>
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
                                        <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                                        <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
                                    </div>
                                </Paper>
                            ))}
                            <div style={a4SheetStyle}>
                                <table style={tableStyle}>
                                    <tbody>
                                        <tr style={evenRowStyle}>
                                            <td style={{ ...cellStyle, width: '30%' }}><strong>Name</strong></td>
                                            <td style={{ ...cellStyle, width: '70%' }}>                     </td>
                                        </tr>
                                        <tr>
                                            <td style={{ ...cellStyle, width: '30%' }}><strong>Designation(Principal Officer/Compliance Officer/MLRO)</strong></td>
                                            <td style={{ ...cellStyle, width: '70%' }}>                            </td>
                                        </tr>
                                        <tr style={evenRowStyle}>
                                            <td style={{ ...cellStyle, width: '30%' }}><strong>Signature</strong></td>
                                            <td style={{ ...cellStyle, width: '70%' }}>                          </td>
                                        </tr>
                                        <tr>
                                            <td style={{ ...cellStyle, width: '30%' }}><strong>Seal of the Member</strong></td>
                                            <td style={{ ...cellStyle, width: '70%' }}>                                   </td>
                                        </tr>
                                        <tr style={evenRowStyle}>
                                            <td style={{ ...cellStyle, width: '30%' }}><strong>Date</strong></td>
                                            <td style={{ ...cellStyle, width: '70%' }}>                     </td>
                                        </tr>
                                        <tr>
                                            <td style={{ ...cellStyle, width: '30%' }}><strong>Place</strong></td>
                                            <td style={{ ...cellStyle, width: '70%' }}>                      </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Button onClick={handleImageClick}>Show Image</Button>
                                <Button onClick={handlePdfClick}>Show PDF</Button>
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
                                            <Document
                                                file={`data:application/pdf;base64,${pdfData.base64}`}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                className="pdf-document"
                                            >
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
                                                <a
                                                    href={`data:application/pdf;base64,${pdfData.base64}`}
                                                    download={pdfData.filename}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                                                >
                                                    Download PDF
                                                </a>
                                            </div>
                                        )}
                                        <Button onClick={handleClosePdfModal}>Close</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '-70%' }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 1:</span>
                                    </div>
                                    <button style={{ width: '12%' }} className='btn btn-primary btn-sm' onClick={() => { handleEditSubmit(); setSaveClicked(true); }}>Save</button>
                                    <br />
                                </div>
                                <br></br>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 2:</span>
                                    </div>
                                    <button style={{ width: '12%' }} className='btn btn-primary btn-sm'>Download</button>
                                </div>
                                <br></br>
                                <Grid container spacing={1} style={{ marginTop: '10px' }}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} >
                                                <form encType="multipart/form-data">
                                                    <div className="person-container">
                                                        <div className="field-group">
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    style={{ display: 'none' }}
                                                                    multiple
                                                                />
                                                                <Button
                                                                    variant="outlined"
                                                                    style={{ marginRight: '10px' }}
                                                                >
                                                                    Document
                                                                </Button>
                                                                <TextField style={{ width: '50%' }}
                                                                    label="Attachment"
                                                                    type="text"
                                                                    size="small"
                                                                    variant="outlined"
                                                                    disabled
                                                                    fullWidth
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <div
                                        className="arroww"
                                        style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 3:</span>
                                    </div>
                                    <form>
                                        <button className='btn btn-primary btn-sm'>Sign on upload</button>
                                    </form>
                                </div>
                                <br></br>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 4:</span>
                                    </div>
                                    <button style={{ width: '12%' }} className='btn btn-primary btn-sm' >View</button>
                                </div>
                                <br></br>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 3:</span>
                                    </div>
                                    <div  >
                                        <button style={{ width: '200%' }} className='btn btn-primary btn-sm' >Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LocalizationProvider>
                </Container >
            </Card >
        </Box>
    );
}

function Declaration({ formData, handleInputChange }: SectionProps) {

    const [declarationFrom, setDeclarationFrom] = useState({
        id: 0,
        kycId: 0,
        memberName: '',
        registeredPlace: '',
        din: '',
        date: '',
        place: '',
        authorizeName: '',
        uid: 0,
    });

    const applicationfrome = new ApplicationfromeService();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const { kycId } = useParams<{ kycId: string }>();
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const customerApiService = new DocumentApiService();

    useEffect(() => {
        if (kycId) {
            handleDeclarationForm(kycId);
        }
    }, [kycId]);

    useEffect(() => {
        const handleImageClick = async (branchId: number) => {
            if (branchId) {
                try {
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

    useEffect(() => {
        const responseId = sessionStorage.getItem('responseId');
        if (responseId) {
            setDeclarationFrom(prevState => ({
                ...prevState,
                kycId: parseInt(responseId, 10),
            }));
        }
    }, []);

    const handleInputChanges = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setDeclarationFrom(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDeclarationForm = async (kycId: any) => {
        try {
            const response = await applicationfrome.getDeclarationForm(kycId);
            setDeclarationFrom(response[0]);
        } catch (error) {
            console.error("Error fetching declaration form:", error);
        }
    };

    if (!declarationFrom) return null;

    const handleImageClick = async () => {
        if (kycId) {
            try {
                const imageData = await customerApiService.getImage(kycId, "2");
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

    const handlePdfClick = async () => {
        if (kycId) {
            try {
                const pdfData = await customerApiService.getPDF(kycId, "2");
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
                setShowPdfModal(true);
            } catch (error) {
                console.error('Error fetching PDF:', error);
                setPdfData({ base64: null, filename: null });
                setErrorMessage("No PDF available");
                setShowPdfModal(true);
            }
        }
    };

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
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages!));
    };

    return (
        <Box mt={2}>
            <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                <Card style={{ width: '100%' }}>
                    <div id="pdfContent">
                        <Paper style={{ marginBottom: '20px' }}>
                            <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                <div>
                                    {imageURL && (
                                        <img
                                            src={imageURL}
                                            alt="Ponsun"
                                            style={{ display: 'block', margin: '0 auto', maxWidth: '35%', height: 'auto', maxHeight: '200px', marginBottom: '20px' }}
                                        />
                                    )}
                                </div>
                                <h4>Declaration Form</h4>
                                <Typography variant="body1" paragraph>
                                    We
                                    <TextField
                                        variant="standard"
                                        name="memberName"
                                        size='small'
                                        inputProps={{ style: { textAlign: 'center', fontWeight: "800" } }}
                                        style={{ textAlign: 'center', fontWeight: 800 }}
                                        value={declarationFrom.memberName}
                                        onChange={handleInputChanges}
                                    />
                                    with registered office at
                                    <TextField
                                        variant="standard"
                                        name="registeredPlace"
                                        size='small'
                                        inputProps={{ style: { textAlign: 'center', fontWeight: "800" } }}
                                        style={{ textAlign: 'center', fontWeight: 800 }}
                                        value={declarationFrom.registeredPlace}
                                        onChange={handleInputChanges}
                                        autoComplete="off"
                                    />
                                    have agreed to participate in the implementation of the products & services provided by National Payments Corporation of India (NPCI), with registered office at 1001 A, B wing 10th Floor, The Capital, Bandra-Kurla Complex, Bandra (East), Mumbai - 400051 and for that purpose, We hereby declare and undertake to NPCI that:
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    ✓ We hereby confirm to have an established process for Know Your Customer (KYC), Anti Money Laundering process (AML) & Combating of Financing of Terrorism (CFT) and that we shall comply with all the Reserve Bank of India (RBI) norms on KYC, AML & CFT.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    ✓ We hereby confirm that
                                    <TextField
                                        variant="standard"
                                        name="din"
                                        value={declarationFrom.din}
                                        onChange={handleInputChanges}
                                        autoComplete='off'
                                        size='small'
                                        inputProps={{ style: { textAlign: 'center', fontWeight: "800" } }}
                                        style={{ textAlign: 'center', fontWeight: 800 }}
                                    />
                                    number of our | the company’s Director(s) is/are a “Politically Exposed Person (PEP)” or “close relative(s) of a PEP” or appear in the “list of terrorist individuals / entities” provided by RBI. In the event of our existing Director(s) is/are “PEP” or “close relative(s) of PEP” or appear in the list of “terrorist individuals / entities” provided by RBI, the details of same shall be furnished to NPCI on letter head.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    ✓ We hereby confirm to have an appropriate procedure for PEP check and name screening of employees and customers against the list of terrorist individuals / entities provided by RBI/other Regulatory bodies.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    ✓ Keeping in view the new regulatory guidelines of Reserve Bank of India, we hereby confirm to have appropriate ongoing risk management procedures for Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) in case if any customer(s) or the beneficial owner(s) of an existing account is/are a “PEP” or “close relative(s) of a PEP” or appear in the list of “terrorist individuals / entities” provided by RBI.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    ✓ We hereby confirm to offer NPCI products & services only to the customers who are KYC compliant.
                                </Typography>
                            </div>
                            <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                        </Paper>
                        <div>
                            <Button onClick={handleImageClick}>Show Image</Button>
                            <Button onClick={handlePdfClick}>Show PDF</Button>
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
                                        <Document
                                            file={`data:application/pdf;base64,${pdfData.base64}`}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            className="pdf-document"
                                        >
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
                                            <a
                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                download={pdfData.filename}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    )}
                                    <Button onClick={handleClosePdfModal}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </Card>
            </Card>
        </Box>
    );
}

function ListofBoardDirectors({ formData, handleInputChange }: SectionProps) {

    const headingStyle = {
        fontFamily: 'Times New Roman',
    };

    const tableStyle = {
        fontFamily: 'Times New Roman',
        fontWeight: 'bold',
    };

    const sourceStyle = {
        fontFamily: 'Times New Roman',
    };

    const sourcesStyle = {
        fontFamily: 'Times New Roman',
        marginBottom: '-15px',
    };

    const proofStyle = {
        fontFamily: 'Times New Roman',
        backgroundColor: 'whitesmoke',
    };

    const applicationfrome = new ApplicationfromeService();
    const [directors, setDirectors] = useState<Director[]>([]);
    const [shareHolders, setShareHolder] = useState<ShareHolder[]>([]);
    const [responseId, setResponseId] = useState(null);
    const { kycId } = useParams<{ kycId: string }>();

    const [KycformData, setKycFormData] = useState<GetData[]>([
        {
            id: 0,
            kycId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            pan: '',
            nationality: 0,
            citizenship: 0,
            domicile: 0,
            isDirector: 1,
            isShareHolders: 0,
            uid: 0,
        }
    ]);

    const [KycformDataa, setKycFormDatas] = useState<GetDatas[]>([
        {
            id: 0,
            kycId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            pan: '',
            nationality: 0,
            citizenship: 0,
            domicile: 0,
            uid: 0,
            isDirector: 0,
            isShareHolders: 1,
        }
    ]);

    const handleRemoveBoxkycdetails = (index: number) => {
        const updatedDirectors = [...directorsState];
        updatedDirectors.splice(index, 1);
        setDirectorsState(updatedDirectors);
    };

    const handleRemovekycdetails = (index: number) => {
        const updatedShareHolders = [...shareHoldersState];
        updatedShareHolders.splice(index, 1);
        setShareHoldersState(updatedShareHolders);
    };

    useEffect(() => {
        handleDirectors(kycId);
        handleShareHolder(kycId);
    }, [kycId]);

    useEffect(() => {
        console.log('Props Directors:', directors);
        console.log('Props ShareHolders:', shareHolders);
        setDirectorsState(directors);
        setShareHoldersState(shareHolders);
    }, [directors, shareHolders]);

    useEffect(() => {
        if (responseId) {
        }
    }, [responseId]);

    const handleDirectors = async (kycId: any) => {
        try {
            const response = await applicationfrome.getKycDirectorsList(kycId);
            console.log('response:', response);
            setDirectors(response);
        } catch (error) {
            console.error("Error fetching directors:", error);
        }
    };

    const handleShareHolder = async (kycId: any) => {
        try {
            const response = await applicationfrome.getKycShareHolder(kycId);
            setShareHolder(response);
        } catch (error) {
            console.error("Error fetching shareholder:", error);
        }
    };

    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [imageURL, setImageURL] = useState('');
    const customerApiService = new DocumentApiService();

    const handleImageClick = async () => {
        if (kycId) {
            try {
                const imageData = await customerApiService.getImage(kycId, "3");
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

    const handlePdfClick = async () => {
        if (kycId) {
            try {
                const pdfData = await customerApiService.getPDF(kycId, "3");
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
                setShowPdfModal(true);
            } catch (error) {
                console.error('Error fetching PDF:', error);
                setPdfData({ base64: null, filename: null });
                setErrorMessage("No PDF available");
                setShowPdfModal(true);
            }
        }
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const binary = new Uint8Array(buffer);
        const bytes = [];
        for (let i = 0; i < binary.length; i++) {
            bytes.push(String.fromCharCode(binary[i]));
        }
        return `data:image/png;base64,${btoa(bytes.join(''))}`;
    };

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
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages!));
    };

    const [editing, setEditing] = useState(true);
    const [directorsState, setDirectorsState] = useState<Director[]>(directors);
    const [shareHoldersState, setShareHoldersState] = useState<ShareHolder[]>(shareHolders);

    const toggleEditing = () => {
        setEditing(!editing);
    };

    const handleDirectorInputChanges = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof Director) => {
        const updatedDirectors = [...directorsState];
        updatedDirectors[index][field] = e.target.value;
        setDirectorsState(updatedDirectors);
    };

    const handleShareholderInputChanges = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof ShareHolder) => {
        const updatedShareHolders = [...shareHoldersState];
        updatedShareHolders[index][field] = e.target.value;
        setShareHoldersState(updatedShareHolders);
    };

    return (
        <Box mt={2}>
            <Card style={{ padding: '3%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                <div id="pdfContent">
                    <Paper style={{ marginBottom: '20px' }}>
                        <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                            <div>
                                {imageURL && (
                                    <img
                                        src={imageURL}
                                        alt="Ponsun"
                                        style={{ display: 'block', margin: '0 auto', maxWidth: '35%', height: 'auto', maxHeight: '200px', marginBottom: '20px' }}
                                    />
                                )}
                            </div>
                            <Card style={{ padding: '1%', width: '100%' }}>
                                <div className="key">
                                    <h4>List of Directors</h4>
                                    <div className="scrollablebox">
                                        {directorsState.map((director, directorIndex) => (
                                            <div key={directorIndex} className="person-container">
                                                {directorsState.length > 1 && (
                                                    <div className="close-button" onClick={() => handleRemoveBoxkycdetails(directorIndex)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}
                                                <Grid container spacing={2}>
                                                    {['firstName', 'middleName', 'lastName', 'pan', 'nationality', 'citizenship', 'domicile'].map((field) => (
                                                        <Grid item xs={12} sm={3} key={field}>
                                                            {editing ? (
                                                                <TextField
                                                                    variant="standard"
                                                                    fullWidth
                                                                    value={(director as any)[field]}
                                                                    onChange={(e) => handleDirectorInputChanges(e, directorIndex, field as keyof Director)}
                                                                    InputProps={{
                                                                        disableUnderline: false
                                                                    }}
                                                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                                                />
                                                            ) : (
                                                                <p style={headingStyle}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {(director as any)[field] || 'Not Available'}</p>
                                                            )}
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                            <br />
                            <Card style={{ padding: '1%', width: '100%' }}>
                                <div className="key">
                                    <h4>List of Shareholders</h4>
                                    <div className="scrollablebox">
                                        {shareHoldersState.map((shareHolder, shareHolderIndex) => (
                                            <div key={shareHolderIndex} className="person-container">
                                                {shareHoldersState.length > 1 && (
                                                    <div className="close-button" onClick={() => handleRemovekycdetails(shareHolderIndex)}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </div>
                                                )}
                                                <Grid container spacing={2}>
                                                    {['firstName', 'middleName', 'lastName', 'pan', 'nationality', 'citizenship', 'domicile'].map((field) => (
                                                        <Grid item xs={12} sm={3} key={field}>
                                                            {editing ? (
                                                                <TextField
                                                                    variant="standard"
                                                                    fullWidth
                                                                    value={(shareHolder as any)[field]}
                                                                    onChange={(e) => handleShareholderInputChanges(e, shareHolderIndex, field as keyof ShareHolder)}
                                                                    InputProps={{
                                                                        disableUnderline: false
                                                                    }}
                                                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                                                />
                                                            ) : (
                                                                <p style={headingStyle}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {(shareHolder as any)[field] || 'Not Available'}</p>
                                                            )}
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                            <br />
                        </div>
                        <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                        <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}></div>
                        <div>
                            <Button onClick={handleImageClick}>Show Image</Button>
                            <Button onClick={handlePdfClick}>Show PDF</Button>
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
                                <DialogContent dividers style={{ height: '80vh', overflowY: 'auto' }}>
                                    {pdfData?.base64 && (
                                        <Document
                                            file={`data:application/pdf;base64,${pdfData.base64}`}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            className="pdf-document"
                                        >
                                            <Page pageNumber={pageNumber} width={window.innerWidth * 0.8} />
                                        </Document>
                                    )}
                                    {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handlePrevPage} disabled={pageNumber <= 1}>Prev</Button>
                                    <Button onClick={handleNextPage} disabled={pageNumber >= (numPages || 1)}>Next</Button>
                                    {pdfData?.filename && (
                                        <div>
                                            <a
                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                download={pdfData.filename}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    )}
                                    <Button onClick={handleClosePdfModal}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </Paper>
                </div>
            </Card>
        </Box>
    );
}

function KYCDocument({ formData: any, handleInputChange }: SectionProps) {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails?.loginDetails;
    const location = useLocation();
    const navigate = useNavigate();
    const documentApiService = new DocumentApiService();

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const [images, setImages] = useState<Image[]>([initialImageState]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const [base64Images, setBase64Images] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [includeImageRequest, setIncludeImageRequest] = useState(false);
    const [formData, setFormData] = useState<kycForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const applicationfrome = new ApplicationfromeService();
    const responseId = sessionStorage.getItem('responseId');

    useEffect(() => {
        if (responseId) {
            fetchData(responseId.toString());
        }
    }, [responseId]);

    const fetchData = async (responseId: string) => {
        try {
            setLoading(true);
            const response = await applicationfrome.getkycData(responseId);
            console.log('kycData:', response);
            const customerData: CustomerData[] = response;
            console.log('customerData:', customerData);
            setFormData(customerData.map((data: CustomerData) => data.kycFormDto));
        } catch (error) {
            setErrors(["Error fetching data"]);
        } finally {
            setLoading(false);
        }
    };

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
        setDownloadingPDF(true);
        try {
            const response = await applicationfrome.getPrintNumber(responseId);
            const printNumber = response;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const content = document.getElementById('pdfContent');
            if (!content) return;
            const padding = 10;
            const scale = 3;
            const pageWidth = 210;
            const pageHeight = 280;
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
                const textWidth = pdf.getTextWidth(`Count: ${printNumber}`);
                const xCoordinate = pageWidth - textWidth - padding;
                pdf.text(`Count: ${printNumber}`, xCoordinate, padding);
                pdf.addImage(imgData, 'PNG', padding, padding + 10, contentWidth, contentHeight);
                pdf.setLineWidth(0.2);
                pdf.setDrawColor(0, 0, 0);
                pdf.rect(padding, padding + 10, contentWidth, contentHeight);
            }
            pdf.save('application_form.pdf');
        } catch (error) {
            console.error('Error fetching print number:', error);
        } finally {
            setDownloadingPDF(false);
        }
    };

    const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        if (name === 'includeImageRequest') {
            setIncludeImageRequest(checked);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
        }
    };

    const handleChooseImagesClick1 = (index1: number) => {
        document.getElementById(`image-upload-input1-${index1}`)?.click();
    };

    const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            setImages(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    name: nameWithoutExtension,
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
        } else {
            setIsFileSelected(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                return;
            }
            const documentTypeId = 4;
            const uid = loginDetails.id;
            console.log('Submitting files:', selectedFiles);
            await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
        } catch (error) {
            console.error('Error submitting files:', error);
        }
    };

    const handleAddMoreFiles = () => {
        setImages([...images, initialImageState]);
    };

    const handleRemoveFileInput = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <Box mt={2}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Kycdoument />
                    <Grid container spacing={1}>
                        {images.map((image, index) => (
                            <Grid item xs={12} key={index}>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="person-container">
                                        <div className="field-group">
                                            <div style={{ marginLeft: '78%' }}>
                                                <IconButton
                                                    onClick={() => handleRemoveFileInput(index)}
                                                    aria-label="remove"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} style={{
                                                        color: 'red',
                                                    }} />
                                                </IconButton>
                                            </div>
                                            <div className="field-group-column">
                                                <input
                                                    type="file"
                                                    id={`image-upload-input1-${index}`}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    onChange={(event) => {
                                                        handleFileChange(event);
                                                        handleFileChange4(index, event);
                                                    }}
                                                    style={{ display: 'none' }}
                                                    multiple
                                                />
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleChooseImagesClick1(index)}
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Document
                                                </Button>
                                                <TextField style={{ width: '50%' }}
                                                    label="Attachment"
                                                    type="text"
                                                    size="small"
                                                    variant="outlined"
                                                    value={image.name}
                                                    disabled
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Grid>
                        ))}
                        <Grid item xs={12} style={{ marginTop: '-10px', marginLeft: '20%' }}>
                            <Button
                                variant="outlined"
                                onClick={handleAddMoreFiles}
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                            >
                                Add More Files
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Grid item>
                    <form onSubmit={handleSubmit}>
                        <button className='btn btn-primary'>
                            Save
                        </button>&nbsp;
                    </form>
                </Grid>
                <button className='btn btn-primary'>
                    Submit
                </button>
            </div>
        </Box>
    );
}

const ApplicationForm = () => {

    const [formsData, setFormsData] = useState<FormValues>({
        Letterhead: {
            id: 0,
            name: '',
        },
        Questionnaire: {
            applicantFormDto: {
                id: 0,
                name: '',
                numberOfPrint: 0,
                applicantFormDetailsData: [],
            },
        },
        Declaration: {
            id: 0,
            kycId: 0,
            memberName: '',
            registeredPlace: '',
            din: '',
            date: '',
            place: '',
            authorizeName: '',
            uid: 0,
        },
        ListofBoardDirectors: {
            id: 0,
            kycId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            pan: '',
            nationality: 0,
            citizenship: 0,
            domicile: 0,
            isDirector: 1,
            isShareHolders: 0,
            uid: 0,
        },
        KYCDocument: {
            name: '',
            uploading: false,
            uploadSuccess: false,
        },
    });

    const [section, setSection] = useState<string>('Application');

    const handleInputChange = (sectionName: any, event: any) => {
    };

    const handleSectionChange = (sectionName: string) => {
        setSection(sectionName);
    };

    const renderSectionContent = () => {
        switch (section) {
            case 'Letterhead':
                return <Letterhead formData={formsData.Letterhead} handleInputChange={handleInputChange} />;
            case 'Questionnaire':
                return <Questionnaire formData={formsData.Questionnaire} handleInputChange={handleInputChange} />;
            case 'Declaration':
                return <Declaration formData={formsData.Declaration} handleInputChange={handleInputChange} />;
            case 'ListofBoardDirectors':
                return <ListofBoardDirectors formData={formsData.ListofBoardDirectors} handleInputChange={handleInputChange} />;
            case 'KYCDocument':
                return <KYCDocument formData={formsData.KYCDocument} handleInputChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <br></br>
                    <Grid container spacing={3} style={{ marginTop: '10px' }}>
                        <Grid item xs={12} sm={2}>
                            <div className={`arrow ${section === 'Questionnaire' ? 'active' : ''}`} onClick={() => handleSectionChange('Questionnaire')}>
                                <span style={{ textAlign: 'center', marginLeft: '7%' }}> Aml Kyc Questionnaire</span>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <div className={`arrow ${section === 'Declaration' ? 'active' : ''}`} onClick={() => handleSectionChange('Declaration')}>
                                <span style={{ textAlign: 'center' }}>Declaration</span>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <div className={`arrow ${section === 'ListofBoardDirectors' ? 'active' : ''}`} onClick={() => handleSectionChange('ListofBoardDirectors')}>
                                <span style={{ textAlign: 'center' }}>List of Board Directors</span>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <div className={`arrow ${section === 'KYCDocument' ? 'active' : ''}`} onClick={() => handleSectionChange('KYCDocument')}>
                                <span style={{ textAlign: 'center' }}>KYC Document</span>
                            </div>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                        {renderSectionContent()}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default ApplicationForm;