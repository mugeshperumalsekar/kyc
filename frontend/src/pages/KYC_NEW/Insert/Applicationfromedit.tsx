// import React, { useEffect, useRef, useState } from 'react';
// import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
// import Header from '../../../layouts/header/header';
// import { Card } from 'react-bootstrap';
// import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
// import { Type, AccountType, QuestionType, AppFormData, kycForm } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
// import { SelectChangeEvent } from '@mui/material/Select';
// import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';
// import contactImage from '../../../assets/contact.png';
// import ponsunImage from '../../../assets/ponsun.png';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDownload, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { useApplicationContext } from './ApplicationContext';
// import DocumentApiService from '../../../data/services/document/Document_api_service';
// import './Form.css';
// import { IconButton } from '@mui/material';
// import { CSSProperties } from 'react';
// import Download from './Download';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { useParams } from 'react-router-dom';
// import MuiAlert from '@mui/material/Alert';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


// interface ButtonFormValues {
//     buttonText: string;
// };

// interface TermsFormValues {
//     termsContent: string;
// };

// interface FormValues {
//     application: AppFormData;
//     button: ButtonFormValues;
//     terms: TermsFormValues;
// };


// interface Image {
//     name: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// };

// interface CustomerData {
//     kycFormDto: kycForm;
// };
// // interface ApplicationFromProps {
// //     formValues: AppFormData;
// //   }

// function ApplicationForm() {


//     const [formData, setFormData] = useState<AppFormData>({

//         applicantFormDto: {
//             id: 0,
//             name: '',
//             numberOfPrint: 0,
//             isCompleted:0,
//             applicantFormDetailsData: [],
//         },
//     });
//     const initialImageState: Image = {
//         name: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const documentApiService = new DocumentApiService();

//     const [images, setImages] = useState<Image[]>([initialImageState]);
//     const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
//     const [base64Images, setBase64Images] = useState<string | null>(null);
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [includeImageRequest, setIncludeImageRequest] = useState(false);
//     const [typeOptions, setTypeOptions] = useState<Type[]>([]);
//     const [accountTypeOptions, setAccountTypeOptions] = useState<AccountType[]>([]);
//     const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
//     const [errors, setErrors] = useState<string[]>([]);
//     const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
//     const [dataFetched, setDataFetched] = useState(false);
//     const [downloadingPDF, setDownloadingPDF] = useState(false);
//     const applicationfrome = new ApplicationfromeService();
//     const { setResponseId } = useApplicationContext();
//     const [downloadCount, setDownloadCount] = useState(0);
//     const [isFormDataUpdated, setIsFormDataUpdated] = useState(false);
//     const [formFullyRendered, setFormFullyRendered] = useState(false);
//     const [showDownloadButton, setShowDownloadButton] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [formDatas, setFormDatas] = useState<kycForm[]>([]);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [saveClicked, setSaveClicked] = useState(false);
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//     const [isErrorOpen, setIsErrorOpen] = useState(false);
//     const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
//     const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);


//     const { kycId } = useParams<{ kycId: string }>();



//     const fetchData = async (kycId: string) => {
//         try {
//             setLoading(true);
//             const customerData: CustomerData[] = await applicationfrome.getkycData(kycId);
//             console.log('customerData:', customerData);
//             if (customerData && customerData.length > 0) {
//                 setFormDatas(customerData.map((data: CustomerData) => data.kycFormDto));

//             } else {
//                 setErrors(["No data found"]);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error); // Log any errors
//             setErrors(["Error fetching data"]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (kycId) {
//             fetchData(kycId);
//         }
//     }, [kycId]);

//     useEffect(() => {
//         fetchType();
//         fetchQuestions()
//     }, []);

//     const fetchType = async () => {
//         try {
//             const recordtypes = await applicationfrome.getType();
//             setTypeOptions(recordtypes);
//         } catch (error) {
//             console.error("Error fetching application types:", error);
//         }
//     };

//     const fetchAccountType = async (applicationTypeId: number) => {
//         try {
//             const recordtypes = await applicationfrome.getappliction(applicationTypeId);
//             setAccountTypeOptions(recordtypes);
//         } catch (error) {
//             console.error("Error fetching account types:", error);
//         }
//     };

//     const showSuccessMessage = (message: string) => {
//         setSuccessMessage(message);
//         setIsSuccessOpen(true);
//         setTimeout(() => {
//             setIsSuccessOpen(false);
//             setSuccessMessage('');
//         }, 1000);
//     };

//     const showErrorMessage = (message: string) => {
//         setErrorMessage(message);
//         setIsErrorOpen(true);
//     };
//     useEffect(() => {
//         // Fetch questions from localStorage on component mount
//         const storedQuestions = localStorage.getItem('questions');
//         if (storedQuestions) {
//             const parsedQuestions = JSON.parse(storedQuestions);
//             setFetchedQuestions(parsedQuestions);
//             setDataFetched(true);
//         } else {
//             fetchQuestions(); // If not available in localStorage, fetch from the server
//         }
//     }, []);


//     const fetchQuestions = async () => {
//         const applicationTypeId = 1; // Manually setting applicationTypeId to 1
//         const accountTypeId = 2; // Manually setting accountTypeId to 2
//         try {
//             const questions = await applicationfrome.getQuestionTypes(applicationTypeId, accountTypeId);
//             setFetchedQuestions(questions);
//             setDataFetched(true);
//             setFormData(prevState => {
//                 const updatedFormData = {
//                     ...prevState,
//                     applicantFormDto: {
//                         ...prevState.applicantFormDto,

//                         applicantFormDetailsData: questions.map((question: { questionDto: { id: any; ansTypeId: any; }; }) => ({
//                             id: 0,
//                             kycId: 0,
//                             accountTypeId,
//                             applicationTypeId,
//                             questionId: question.questionDto.id,
//                             ansTypeId: question.questionDto.ansTypeId,
//                             answer: '', // Initialize answer field
//                             score: 0, // Initialize score field
//                             uid: 0,
//                             subQuestionId: 0
//                         }))
//                     }
//                 };
//                 setIsFormDataUpdated(true);

//                 return updatedFormData;
//             });
//             console.log('formData:', questions);

//             setErrors(Array(questions.length).fill(''));
//             setFormFullyRendered(true);
//         } catch (error) {
//             console.error("Error fetching questions:", error);
//         }
//     };


//     const handleApplicationTypeChange = (event: SelectChangeEvent<number>) => {
//         const applicationTypeId = event.target.value as number;
//         setFormData(prevState => ({
//             ...prevState,
//             applicantFormDto: {
//                 ...prevState.applicantFormDto,
//                 applicantFormDetailsData: [{
//                     ...prevState.applicantFormDto.applicantFormDetailsData[0],
//                     applicationTypeId,
//                     accountTypeId: 0,
//                 }]
//             }
//         }));
//         fetchAccountType(applicationTypeId);
//     };

//     const handleAccountTypeChange = (event: SelectChangeEvent<number>) => {
//         const accountTypeId = event.target.value as number;
//         setFormData(prevState => ({
//             ...prevState,
//             applicantFormDto: {
//                 ...prevState.applicantFormDto,
//                 applicantFormDetailsData: [{
//                     ...prevState.applicantFormDto.applicantFormDetailsData[0],
//                     accountTypeId
//                 }]
//             }
//         }));
//     };


//     const handleAnswerChange = (index: number, value: string) => {
//         const question = fetchedQuestions[index];
//         const answerTypeData = question.questionDto.answerTypeData.find(answer => answer.name === value);

//         const updatedFormDetails = formData.applicantFormDto.applicantFormDetailsData.map((item, idx) =>
//             idx === index ? {
//                 ...item,
//                 answer: value,
//                 score: answerTypeData ? answerTypeData.score : item.score,
//                 questionId: answerTypeData ? answerTypeData.questionId : item.questionId
//             } : item
//         );
//         setFormData({
//             ...formData,
//             applicantFormDto: {
//                 ...formData.applicantFormDto,
//                 applicantFormDetailsData: updatedFormDetails
//             }
//         });
//     };

//     const handleDropdownChange = (index: number, value: string) => {
//         const question = fetchedQuestions[index];
//         const answerTypeData = question.questionDto.answerTypeData.find(answer => answer.name === value);

//         const updatedFormDetails = formData.applicantFormDto.applicantFormDetailsData.map((item, idx) =>
//             idx === index ? {
//                 ...item,
//                 answer: value,
//                 score: answerTypeData ? answerTypeData.score : item.score,
//                 questionId: answerTypeData ? answerTypeData.questionId : item.questionId
//             } : item
//         );
//         setFormData({
//             ...formData,
//             applicantFormDto: {
//                 ...formData.applicantFormDto,
//                 applicantFormDetailsData: updatedFormDetails
//             }
//         });
//     };

//     const handleSubmit = async () => {
//         const hasErrors = errors.some(error => error !== '');
//         if (hasErrors) {
//             showErrorMessage('Please fix the errors before submitting.');
//             return;
//         }

//         try {
//             let responseId = sessionStorage.getItem('responseId');
//             let responseIdNumber;

//             if (responseId) {
//                 responseIdNumber = Number(responseId);
//                 if (isNaN(responseIdNumber)) {
//                     console.error('Invalid responseId found in session storage');
//                     showErrorMessage('Invalid responseId found in session storage');
//                     return;
//                 }
//             } else {
//                 const initialResponse = await applicationfrome.Apllicationinsert(formData);
//                 if (initialResponse && initialResponse.id) {
//                     responseIdNumber = initialResponse.id;
//                     sessionStorage.setItem('responseId', responseIdNumber.toString());
//                     setResponseId(responseIdNumber);
//                 } else {
//                     console.error('Failed to generate a new responseId');
//                     showErrorMessage('Failed to generate a new responseId');
//                     return;
//                 }
//             }

//             const updatedNumberOfPrint = formData.applicantFormDto.numberOfPrint + 1;

//             const updatedFormData = {
//                 ...formData,
//                 applicantFormDto: {
//                     ...formData.applicantFormDto,
//                     id: responseIdNumber,
//                     numberOfPrint: updatedNumberOfPrint,
//                 },
//             };

//             // Save updated form data to local storage
//             localStorage.setItem('formData', JSON.stringify(updatedFormData));

//             const response = await applicationfrome.Apllicationinsert(updatedFormData);
//             console.log('Updated formData:', updatedFormData);

//             if (response && response.id) {
//                 setDataFetched(true);
//                 setShowDownloadButton(true);
//                 setFormData(updatedFormData);
//                 setResponseId(response.id);
//                 await fetchData(response.id);
//                 showSuccessMessage('Aml Kyc Questionnaire added successfully.');
//             } else {
//                 showErrorMessage('Submission failed, please try again.');
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             showErrorMessage('Error submitting form, please try again.');
//         }
//     };
//     const formatDateToDDMMYYYY = (dateString: any) => {
//         if (!dateString) return '';
//         const [day, month, year] = dateString.split('-');
//         return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
//     };

//     const itemsPerPage = 10;

//     const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
//         const pages = [];
//         for (let i = 0; i < data.length; i += itemsPerPage) {
//             pages.push(data.slice(i, i + itemsPerPage));
//         }
//         return pages;
//     };

//     const pages = splitDataIntoPages(fetchedQuestions, itemsPerPage);

//     const itemsPerPages = 12;

//     const splitDataIntoPage = (data: any[], itemsPerPages: number) => {
//         const pageView = [];
//         for (let i = 0; i < data.length; i += itemsPerPages) {
//             pageView.push(data.slice(i, i + itemsPerPages));
//         }
//         return pageView;
//     };

//     const pageView = splitDataIntoPage(formDatas, itemsPerPages);
//     const downloadPDFRef = React.useRef<() => void | null>(null);

//     const handleDownloadClick = () => {
//         if (downloadPDFRef.current) {
//             downloadPDFRef.current();
//         }
//     };



//     const responseId = sessionStorage.getItem('responseId');

//     console.log('image responseId:', responseId);
//     useEffect(() => {
//         if (responseId) {
//             console.log('Declaration responseId:', responseId);

//             setImages(prevImages => prevImages.map(image => ({
//                 ...image,
//                 kycId: parseInt(responseId, 10),
//             })));
//         }
//     }, [responseId]);



//     const handleSubmits = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         try {
//             const responseId = sessionStorage.getItem('responseId');
//             if (!responseId) {
//                 console.error('No responseId found in session storage');
//                 return;
//             }
//             const documentTypeId = 1;

//             console.log('Selected files:', selectedFiles);

//             if (selectedFiles.length === 0) {
//                 console.error('No files selected for submission');
//                 return;
//             }

//             console.log('Submitting files with responseId:', responseId, 'and documentTypeId:', documentTypeId);
//             await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId);
//             console.log('Files submitted successfully');
//         } catch (error) {
//             console.error('Error submitting files:', error);
//         }
//     };



//     const handleAddMoreFiles = () => {
//         setImages([...images, initialImageState]);
//     };



//     //



//     const componentRef = useRef<HTMLDivElement | null>(null);


//     const [showImageModal, setShowImageModal] = useState(false);
//     const [showPdfModal, setShowPdfModal] = useState(false);
//     const [base64Image, setBase64Image] = useState<string | null>(null);
//     const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [numPages, setNumPages] = useState<number | null>(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const customerApiService = new DocumentApiService();



//     const handleView = async () => {
//         console.log('handleView called');
//         setShowPdfModal(true);

//         try {
//             const responseId = sessionStorage.getItem('responseId');
//             if (!responseId) {
//                 console.error('No responseId found in session storage');
//                 return;
//             }
//             const pdfData = await customerApiService.getPDF(responseId,1);
//             console.log('PDF data:', pdfData);

//             setPdfData({ base64: pdfData.data, filename: pdfData.filename });
//             setShowPdfModal(true);
//             console.log('PDF modal set to open');
//         } catch (error) {
//             console.error('Error fetching PDF:', error);
//             setPdfData({ base64: null, filename: null });
//             setErrorMessage("No PDF available");
//             setShowPdfModal(true);
//         }
//     };




//     const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//         console.log('Document loaded with', numPages, 'pages'); // Added logging
//         setNumPages(numPages);
//     };

//     const handleCloseImageModal = () => {
//         setShowImageModal(false);
//     };

//     const handleClosePdfModal = () => {
//         setShowPdfModal(false);
//     };

//     const handlePrevPage = () => {
//         setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
//     };

//     const handleNextPage = () => {
//         setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages!));
//     };
//     const [imageURL, setImageURL] = useState('');

//     useEffect(() => {
//         const handleImageClick = async (branchId: number) => {
//             if (branchId) {
//                 try {
//                     const branchId = 1; // Or fetch it from your data source
//                     const imageData = await customerApiService.getLetterHead(branchId);
//                     const base64String = arrayBufferToBase64(imageData);
//                     setImageURL(base64String); // Set imageURL to base64String
//                 } catch (error) {
//                     console.error('Error fetching image:', error);
//                     setImageURL('');
//                     setErrorMessage("No image available");

//                 }
//             }
//         };

//         handleImageClick(1);
//     }, []);

//     const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//         const binary = new Uint8Array(buffer);
//         const bytes = [];
//         for (let i = 0; i < binary.length; i++) {
//             bytes.push(String.fromCharCode(binary[i]));
//         }
//         return `data:image/png;base64,${btoa(bytes.join(''))}`;
//     };




//     return (
//         <>

//             <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                 <Container style={{ width: '274mm', minHeight: '297mm', marginTop: '2%' }}>
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         {pages.map((pageContent, pageIndex) => (
//                             <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
//                                 <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
//                                     <div>
//                                         {imageURL && (
//                                             <img
//                                                 src={imageURL}
//                                                 alt="Ponsun"
//                                                 style={{ display: 'block', margin: '0 auto', maxWidth: '35%', height: 'auto', maxHeight: '200px', marginBottom: '20px' }}
//                                             />
//                                         )}
//                                     </div>
//                                     <TableContainer>
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow sx={{ fontSize: 'small' }}>
//                                                     <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
//                                                     <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
//                                                     <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {pageContent.map((item, index) => (
//                                                     <TableRow key={index}>
//                                                         <TableCell>{index + 1}</TableCell>
//                                                         <TableCell>{item.questionDto.name}</TableCell>
//                                                         <TableCell>
//                                                             {item.questionDto.ansTypeId === 2 ? (
//                                                                 <Select
//                                                                     value={formData.applicantFormDto.applicantFormDetailsData[index]?.answer || ''}
//                                                                     onChange={(e) => handleDropdownChange(index, e.target.value)}
//                                                                 >
//                                                                     {item.questionDto.answerTypeData.map((answer: { name: string }, answerIndex: React.Key) => (
//                                                                         <MenuItem key={answerIndex} value={answer.name}>{answer.name}</MenuItem>
//                                                                     ))}
//                                                                 </Select>
//                                                             ) : (
//                                                                 <TextField
//                                                                     value={formData.applicantFormDto.applicantFormDetailsData[index]?.answer || ''}
//                                                                     onChange={(e) => handleAnswerChange(index, e.target.value)}
//                                                                 />
//                                                             )}
//                                                             {errors[index] && (
//                                                                 <Typography variant="caption" color="error">{errors[index]}</Typography>
//                                                             )}
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>


//                                         </Table>
//                                     </TableContainer>
//                                     <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
//                                     <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
//                                 </div>
//                                 <h3>Update: {formData.applicantFormDto.numberOfPrint}</h3>
//                             </Paper>
//                         ))}
//                     </LocalizationProvider>

//                 </Container>
//             </Card>
//             <Card>

//             </Card>
//             <Snackbar
//                 open={isSuccessOpen}
//                 autoHideDuration={5000}
//                 onClose={() => setIsSuccessOpen(false)}
//                 anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                 }}
//             >
//                 <MuiAlert
//                     elevation={6}
//                     variant="filled"
//                     severity="success"
//                     onClose={() => setIsSuccessOpen(false)}
//                 >
//                     {successMessage}
//                 </MuiAlert>
//             </Snackbar>
//             <Snackbar
//                 open={isErrorOpen}
//                 autoHideDuration={5000}
//                 onClose={() => setIsErrorOpen(false)}
//                 anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                 }}
//             >
//                 <MuiAlert
//                     elevation={6}
//                     variant="filled"
//                     severity="error"
//                     onClose={() => setIsErrorOpen(false)}
//                 >
//                     {errorMessage}
//                 </MuiAlert>
//             </Snackbar>
//             {/* </Box>
//             </Box> */}
//         </>
//     );
// }

// export default ApplicationForm;
import React from 'react'

const Applicationfromedit = () => {
  return (
    <div>Applicationfromedit</div>
  )
}

export default Applicationfromedit