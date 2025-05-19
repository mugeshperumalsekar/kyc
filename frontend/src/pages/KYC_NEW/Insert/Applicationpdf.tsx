// // import React, { useState } from 'react';
// // import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// // import { Box, Button } from '@mui/material';
// // import Header from '../../../layouts/header/header';
// // import { Card } from 'react-bootstrap';
// // import ApplicationfromeService from '../../../data/services/applicationfrom/applicationfrome-api-service';

// // export const App = () => {

// //     const defaultLayoutPluginInstance = defaultLayoutPlugin();
// //     const [pdfFile, setPdfFile] = useState<File | null>(null);
// //     const [pdfFileError, setPdfFileError] = useState('');
// //     const applicationfrome = new ApplicationfromeService();
// //     const [viewPdf, setViewPdf] = useState<string | ArrayBuffer | null>(null);
// //     const fileType = ['application/pdf'];

// //     const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const selectedFile = e.target.files?.[0];
// //         if (selectedFile) {
// //             if (fileType.includes(selectedFile.type)) {
// //                 setPdfFile(selectedFile);
// //                 setPdfFileError('');
// //             } else {
// //                 setPdfFile(null);
// //                 setPdfFileError('Please select a valid PDF file');
// //             }
// //         } else {
// //             console.log('Select your file');
// //         }
// //     };

// //     const handlePdfFileSubmit = async () => {
// //         if (pdfFile) {
// //             try {
// //                 const response = await applicationfrome.InsertPdf(pdfFile);
// //                 console.log('File uploaded successfully', response);
// //                 setViewPdf(URL.createObjectURL(pdfFile));
// //             } catch (error) {
// //                 console.error('File upload failed', error);
// //             }
// //         } else {
// //             setViewPdf(null);
// //         }
// //     };

// //     return (
// //         <>
// //             <Box sx={{ display: 'flex' }}>
// //                 <Header />
// //                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
// //                     <Box m={2} style={{ marginTop: '5%' }}>
// //                         <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
// //                             <div className='container'>
// //                                 <br />
// //                                 <form className='form-group' >
// //                                     <input type="file" className='form-control' required onChange={handlePdfFileChange} />
// //                                     {pdfFileError &&
// //                                         <div className='pdf-container' style={{ color: 'red' }}>{pdfFileError}
// //                                         </div>}
// //                                     <br />
// //                                     <Button type="button" onClick={handlePdfFileSubmit}>
// //                                         UPLOAD PDF
// //                                     </Button>
// //                                 </form>
// //                                 <br />
// //                                 <div className='pdf-container'>
// //                                     {viewPdf && typeof viewPdf === 'string' && <iframe src={viewPdf} width="100%" height="600px" />}
// //                                 </div>
// //                             </div>
// //                         </Card>
// //                     </Box>
// //                 </Box>
// //             </Box>
// //         </>
// //     );
// // };

// // export default App;


// import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
// import { Box, Typography, TextField, Button, Grid, Card, Snackbar } from '@mui/material';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import './Form.css';
// import MuiAlert from '@mui/material/Alert';
// import Header from '../../../layouts/header/header';
// import ApplicationFrom from './ApplicationFrom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { useSelector } from 'react-redux';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import DocumentApiService from '../../../data/services/document/Document_api_service';
// import { useApplicationContext } from './ApplicationContext';
// import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import ponsunImage from '../../../assets/ponsun.png';
// import ApplicationfromeService from '../../../data/services/applicationfrom/applicationfrome-api-service';
// import { kycForm } from '../../../data/services/applicationfrom/applicationfrome-payload';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import contactImage from '../../../assets/contact.png';
// import { faDownload } from '@fortawesome/free-solid-svg-icons';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// interface ApplicationFormValues {
//     memberName: string;
//     officeAddress: string;
//     pepCount: string;
//     date: string;
//     place: string;
//     authorizedSignatory: string;
//     designation: string;
//     stamp: string;
// };

// interface ButtonFormValues {
//     buttonText: string;
// };

// interface TermsFormValues {
//     termsContent: string;
// };

// interface FormValues {
//     application: ApplicationFormValues;
//     button: ButtonFormValues;
//     terms: TermsFormValues;
// };

// interface SectionProps {
//     formValues: any;
//     handleInputChange: (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
// };

// interface Image {
//     name: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// };

// function FormTabs() {

//     const [section, setSection] = useState<string>('Application');
//     const [activeButton, setActiveButton] = useState<string>('');
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isErrorOpen, setIsErrorOpen] = useState(false);

//     const [formValues, setFormValues] = useState<FormValues>({
//         application: {
//             memberName: '',
//             officeAddress: '',
//             pepCount: '',
//             date: '',
//             place: '',
//             authorizedSignatory: '',
//             designation: '',
//             stamp: ''
//         },
//         button: {
//             buttonText: 'Click Me'
//         },
//         terms: {
//             termsContent: ''
//         }
//     });

//     const handleSectionChange = (sectionName: string) => {
//         setSection(sectionName);
//     };

//     const handleInputChange = (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = event.target;
//         setFormValues((prevValues) => ({
//             ...prevValues,
//             [sectionName]: {
//                 ...prevValues[sectionName as keyof FormValues],
//                 [name]: value
//             }
//         }));
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
//     const saveSectionData = () => {
//         let message = '';
//         switch (section) {
//             case 'Application':
//                 message = 'Application data saved successfully.';
//                 break;
//             case 'Button':
//                 message = 'Button data saved successfully.';
//                 break;
//             case 'Terms':
//                 message = 'Terms data saved successfully.';
//                 break;
//             case 'Document Upload':
//                 message = 'Document Upload data saved successfully.';
//                 break;
//                 case 'List of Board Directors':
//                     message = 'List of Board Directors data saved successfully.';
//                     break;
//             default:
//                 message = 'Data saved successfully.';
//                 break;
//         }
//         showSuccessMessage(message);
//     };

//     const handleSubmit = () => {
//         showSuccessMessage('Form submitted successfully.');
//     };

//     const renderSectionContent = () => {
//         switch (section) {
//             case 'Application':
//                 return <ApplicationForm formValues={formValues.application} handleInputChange={handleInputChange} />;
//             case 'Button':
//                 return <ButtonContent formValues={formValues.button} handleInputChange={handleInputChange} />;
//             case 'Terms':
//                 return <TermsAndConditions formValues={formValues.terms} handleInputChange={handleInputChange} />;
//             case 'Document Upload':
//                 return <DocumentUpload formValues={formValues.terms} handleInputChange={handleInputChange} />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
//                     <Box m={2} style={{ marginTop: '5%' }}>
//                         <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <Typography variant="h5" gutterBottom>
//                                 FORM
//                             </Typography>

//                             <Grid container spacing={2} style={{ marginTop: '10px' }}>
//                                 <Grid item xs={12} sm={3}>
//                                     <div
//                                         className={`arrow ${activeButton === 'Application' ? 'active' : ''}`}
//                                         onClick={() => {
//                                             setActiveButton('Application');
//                                             handleSectionChange('Application');
//                                         }}
//                                     >
//                                         <span style={{ textAlign: 'center' }}>Application Form</span>
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={12} sm={3}>
//                                     <div
//                                         className={`arrow ${activeButton === 'Button' ? 'active' : ''}`}
//                                         onClick={() => {
//                                             setActiveButton('Button');
//                                             handleSectionChange('Button');
//                                         }}
//                                     >
//                                         <span style={{ textAlign: 'center' }}>Application</span>
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={12} sm={3}>
//                                     <div
//                                         className={`arrow ${activeButton === 'Document' ? 'active' : ''}`}
//                                         onClick={() => {
//                                             setActiveButton('Document');
//                                             handleSectionChange('Document Upload');
//                                         }}
//                                     >
//                                         <span style={{ textAlign: 'center' }}> List of Board Directors</span>
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={12} sm={3}>
//                                     <div
//                                         className={`arrow ${activeButton === 'Document' ? 'active' : ''}`}
//                                         onClick={() => {
//                                             setActiveButton('Document');
//                                             handleSectionChange('Document Upload');
//                                         }}
//                                     >
//                                         <span style={{ textAlign: 'center' }}>Document Upload</span>
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={12} sm={3}>
//                                     <div
//                                         className={`arrow ${activeButton === 'Terms' ? 'active' : ''}`}
//                                         onClick={() => {
//                                             setActiveButton('Terms');
//                                             handleSectionChange('Terms');
//                                         }}
//                                     >
//                                         <span style={{ textAlign: 'center' }}>Terms</span>
//                                     </div>
//                                 </Grid>
//                             </Grid>

//                             {renderSectionContent()}

//                             {/* <Box mt={2}>
//                                 <Button variant="contained" onClick={saveSectionData}>
//                                     Save
//                                 </Button>
//                             </Box> */}
//                         </Card>
//                         <Box mt={2} textAlign="center">
//                             {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
//                                 Submit
//                             </Button> */}
//                             <Snackbar
//                                 open={isSuccessOpen}
//                                 autoHideDuration={5000}
//                                 onClose={() => setIsSuccessOpen(false)}
//                                 anchorOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'right',
//                                 }}
//                             >
//                                 <MuiAlert
//                                     elevation={6}
//                                     variant="filled"
//                                     severity="success"
//                                     onClose={() => setIsSuccessOpen(false)}
//                                 >
//                                     {successMessage}
//                                 </MuiAlert>
//                             </Snackbar>
//                             <Snackbar
//                                 open={isErrorOpen}
//                                 autoHideDuration={5000}
//                                 onClose={() => setIsErrorOpen(false)}
//                                 anchorOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'right',
//                                 }}
//                             >
//                                 <MuiAlert
//                                     elevation={6}
//                                     variant="filled"
//                                     severity="error"
//                                     onClose={() => setIsErrorOpen(false)}
//                                 >
//                                     {errorMessage}
//                                 </MuiAlert>
//                             </Snackbar>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Box>
//         </>
//     );
// }

// function ApplicationForm({ formValues, handleInputChange }: SectionProps) {
//     return (
//         <Box mt={2}>
//             <Typography variant="h6" gutterBottom>
//                 {/* Application Form */}
//             </Typography>
//             <KycAmlDeclaration formValues={formValues} handleInputChange={handleInputChange} />
//         </Box>
//     );
// }

// function ButtonContent({ formValues, handleInputChange }: SectionProps) {
//     return (
//         <Box mt={2}>
//             <Typography variant="body1" paragraph>
//                 We <TextField variant="standard" name="memberName" value={formValues.memberName} onChange={(event) => handleInputChange('application', event)} style={{ marginBottom: '-7px' }} /> with registered office at <TextField variant="standard" name="officeAddress" value={formValues.officeAddress} onChange={(event) => handleInputChange('application', event)} /> have agreed to participate in the implementation of the products & services provided by National Payments Corporation of India (NPCI), with registered office at 1001 A, B wing 10th Floor, The Capital, Bandra-Kurla Complex, Bandra (East), Mumbai - 400051 and for that purpose, We hereby declare and undertake to NPCI that:
//             </Typography>
//             <Typography variant="body1" paragraph>
//                 ✓ We hereby confirm to have an established process for Know Your Customer (KYC), Anti Money Laundering process (AML) & Combating of Financing of Terrorism (CFT) and that we shall comply with all the Reserve Bank of India (RBI) norms on KYC, AML & CFT.
//             </Typography>
//             <Typography variant="body1" paragraph>
//                 ✓ We hereby confirm that <TextField variant="standard" name="pepCount" value={formValues.pepCount} onChange={(event) => handleInputChange('application', event)} /> number of our | the company’s Director(s) is/are a “Politically Exposed Person (PEP)” or “close relative(s) of a PEP” or appear in the “list of terrorist individuals / entities” provided by RBI. In the event of our existing Director(s) is/are “PEP” or “close relative(s) of PEP” or appear in the list of “terrorist individuals / entities” provided by RBI, the details of same shall be furnished to NPCI on letter head.
//             </Typography>
//             <Typography variant="body1" paragraph>
//                 ✓ We hereby confirm to have an appropriate procedure for PEP check and name screening of employees and customers against the list of terrorist individuals / entities provided by RBI/other Regulatory bodies.
//             </Typography>
//             <Typography variant="body1" paragraph>
//                 ✓ Keeping in view the new regulatory guidelines of Reserve Bank of India, we hereby confirm to have appropriate ongoing risk management procedures for Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) in case if any customer(s) or the beneficial owner(s) of an existing account is/are a “PEP” or “close relative(s) of a PEP” or appear in the list of “terrorist individuals / entities” provided by RBI.
//             </Typography>
//             <Typography variant="body1" paragraph>
//                 ✓ We hereby confirm to offer NPCI products & services only to the customers who are KYC compliant.
//             </Typography>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <div>
//                     <Typography variant="body1" paragraph>
//                         Date: <TextField variant="standard" name="date" type="date" value={formValues.date} onChange={(event) => handleInputChange('application', event as ChangeEvent<HTMLInputElement>)} />
//                     </Typography>
//                     <Typography variant="body1" paragraph>
//                         Place: <TextField variant="standard" name="place" value={formValues.place} onChange={(event) => handleInputChange('application', event as ChangeEvent<HTMLInputElement>)} />
//                     </Typography>
//                 </div>
//                 <div>
//                     <Typography variant="body1" paragraph align="right">
//                         Authorized Signatory(ies)
//                     </Typography>
//                     <Typography variant="body1" paragraph align="right">
//                         <TextField name="authorizedSignatory" value={formValues.authorizedSignatory} onChange={(event) => handleInputChange('application', event as ChangeEvent<HTMLInputElement>)} placeholder="Name & Designation" />
//                     </Typography>
//                     <Typography variant="body1" paragraph align="right">
//                         (Name & Designation)
//                     </Typography>
//                     <Typography variant="body1" paragraph align="right">
//                         (With Stamp)
//                     </Typography>
//                 </div>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <button className='btn btn-primary'>
//                     Save
//                 </button>
//             </div>
//         </Box>

//     );
// }

// function TermsAndConditions({ formValues, handleInputChange }: SectionProps) {
//     return (
//         <Box mt={2}>
//             <Typography variant="h6" gutterBottom>
//                 Terms and Conditions
//             </Typography>
//             <TextField
//                 label="Terms and Conditions"
//                 name="termsContent"
//                 value={formValues.termsContent}
//                 onChange={(event) => handleInputChange('terms', event)}
//                 fullWidth
//                 multiline
//                 rows={4}
//                 margin="normal"
//             />
//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <button className='btn btn-primary'>
//                     Save
//                 </button>&nbsp;
//                 <button className='btn btn-primary'>
//                     Submit
//                 </button>
//             </div>
//         </Box>
//     );
// }

// interface CustomerData {
//     kycFormDto: kycForm;
// };

// function DocumentUpload({ formValues, handleInputChange }: SectionProps) {
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails?.loginDetails;
//     const location = useLocation();
//     const navigate = useNavigate();
//     const documentApiService = new DocumentApiService();

//     const initialImageState: Image = {
//         name: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const [images, setImages] = useState<Image[]>([initialImageState]);
//     const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
//     const [base64Images, setBase64Images] = useState<string | null>(null);
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [includeImageRequest, setIncludeImageRequest] = useState(false);
//     // const { responseId } = useApplicationContext();
//     // console.log('ApplicationForm responseId:', responseId);
//     const [formData, setFormData] = useState<kycForm[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [errors, setErrors] = useState<string[]>([]);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [downloadingPDF, setDownloadingPDF] = useState(false);
//     const applicationfrome = new ApplicationfromeService();
//     // Retrieve the response.id from session storage
//     const responseId = sessionStorage.getItem('responseId');
//     // Use the responseId as needed


//     useEffect(() => {
//         if (responseId) {
//             fetchData(responseId.toString());
//         }
//     }, [responseId]);

//     const fetchData = async (responseId: string) => {
//         try {
//             setLoading(true);
//             const response = await applicationfrome.getkycData(responseId);
//             console.log('kycData:', response);
//             const customerData: CustomerData[] = response;
//             console.log('customerData:', customerData);
//             setFormData(customerData.map((data: CustomerData) => data.kycFormDto));
//             // setFormData(response); // Assuming response contains the array of customer data
//         } catch (error) {
//             setErrors(["Error fetching data"]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const itemsPerPage = 10;

//     const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
//         const pages = [];
//         for (let i = 0; i < data.length; i += itemsPerPage) {
//             pages.push(data.slice(i, i + itemsPerPage));
//         }
//         return pages;
//     };

//     const pages = splitDataIntoPages(formData, itemsPerPage);

//     const downloadPDF = async () => {
//         setDownloadingPDF(true);
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const content = document.getElementById('pdfContent');
//         if (!content) return;
//         const padding = 10;
//         const scale = 3;
//         const pageWidth = 210;
//         const pageHeight = 297;
//         const contentWidth = pageWidth - 2 * padding;
//         const contentHeight = pageHeight - 2 * padding;
//         const totalPages = content.childNodes.length;
//         for (let i = 0; i < totalPages; i++) {
//             const page = content.childNodes[i];
//             const canvas = await html2canvas(page as HTMLElement, {
//                 scale: scale,
//                 useCORS: true,
//                 logging: true,
//             });
//             const imgData = canvas.toDataURL('image/png');
//             if (i > 0) pdf.addPage();
//             pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight);
//             pdf.setLineWidth(0.2);
//             pdf.setDrawColor(0, 0, 0);
//             pdf.rect(padding, padding, contentWidth, contentHeight);
//         }
//         pdf.save('application_form.pdf');
//         setDownloadingPDF(false);
//     };

//     const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = event.target;
//         if (name === 'includeImageRequest') {
//             setIncludeImageRequest(checked);
//         }
//     };

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const filesArray = Array.from(event.target.files);
//             setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
//         }
//     };

//     const handleChooseImagesClick1 = (index1: number) => {
//         document.getElementById(`image-upload-input1-${index1}`)?.click();
//     };

//     const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const selectedFiles = Array.from(event.target.files) as File[];
//             const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
//             setImages(prevFields => {
//                 const updatedFields = [...prevFields];
//                 updatedFields[index] = {
//                     ...updatedFields[index],
//                     name: nameWithoutExtension,
//                     uploading: false,
//                     uploadSuccess: false,
//                 };
//                 return updatedFields;
//             });
//             setIsFileSelected(true);
//         } else {
//             setIsFileSelected(false);
//         }
//     };

// //     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
// //     event.preventDefault();
// //     try {
// //         const responseId = sessionStorage.getItem('responseId');
// //         if (!responseId) {
// //             console.error('No responseId found in session storage');
// //             return;
// //         }

// //         console.log('Submitting files:', selectedFiles);
// //         await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10));
// //     } catch (error) {
// //         console.error('Error submitting files:', error);
// //     }
// // };
// const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   try {
//       const responseId = sessionStorage.getItem('responseId');
//       if (!responseId) {
//           console.error('No responseId found in session storage');
//           return;
//       }
//       const documentTypeId = 3;

//       console.log('Submitting files:', selectedFiles);
//       await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId);
//   } catch (error) {
//       console.error('Error submitting files:', error);
//   }
// };

//     const handleAddMoreFiles = () => {
//         setImages([...images, initialImageState]);
//     };

//     const handleRemoveFileInput = (index: number) => {
//         setImages(images.filter((_, i) => i !== index));
//     };

//     return (
//         <Box mt={2}>
//             {/* <Typography variant="h6" gutterBottom>
//                 Terms and Conditions
//             </Typography>
//             <Typography variant="body1">
//                 [Your terms and conditions content here.]
//             </Typography> */}
//             <Grid item xs={12} style={{ float: 'inline-end', marginTop: '3%' }}>
//                 <FontAwesomeIcon icon={faDownload} onClick={downloadPDF} style={{ cursor: 'pointer' }} />
//                 {downloadingPDF && <p style={{ color: 'red' }}>Please wait for the download...</p>}
//             </Grid>
//             <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                 <Container style={{ width: '274mm', minHeight: '297mm', marginTop: '2%' }}>
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <div id="pdfContent">
//                             {pages.map((pageContent, pageIndex) => (
//                                 <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
//                                     <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
//                                         <img src={ponsunImage} alt="Ponsun" style={{ display: 'block', margin: '0 auto', maxWidth: '45%', marginBottom: '20px' }} />
//                                         <TableContainer>
//                                             <Table>
//                                                 <TableHead>
//                                                     <TableRow sx={{ fontSize: 'small' }}>
//                                                         <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
//                                                         <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
//                                                         <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
//                                                     </TableRow>
//                                                 </TableHead>
//                                                 <TableBody>
//                                                     {pageContent && pageContent.map((item, index) => (
//                                                         <TableRow key={index}>
//                                                             <TableCell sx={{ width: '10%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                                                                 {index + 1 + pageIndex * itemsPerPage}
//                                                             </TableCell>
//                                                             <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                                                                 {item && item.name}
//                                                                 {item && item.description && (
//                                                                     <Typography variant="body2" color="textSecondary">
//                                                                         {item.description}
//                                                                     </Typography>
//                                                                 )}
//                                                             </TableCell>
//                                                             <TableCell>
//                                                                 {item && item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : 'No answer available'}
//                                                                 {errors[index + pageIndex * itemsPerPage] && (
//                                                                     <Typography variant="caption" color="error">
//                                                                         {errors[index + pageIndex * itemsPerPage]}
//                                                                     </Typography>
//                                                                 )}
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </TableContainer>
//                                         <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
//                                         <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
//                                     </div>
//                                 </Paper>
//                             ))}
//                         </div>
//                     </LocalizationProvider>
//                 </Container>
//             </Card>
//             <Grid container justifyContent="center">
//                 <Grid item xs={12}>
//                     <Card style={{ padding: '2%', marginTop: '20px' }}>
//                         <form onSubmit={handleSubmit} encType="multipart/form-data">
//                             {images.map((image, index) => (
//                                 <Grid container key={index} alignItems="center" spacing={1}>
//                                     <Grid item xs={12} sm={8}>
//                                         <input
//                                             type="file"
//                                             id={`image-upload-input1-${index}`}
//                                             accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                             onChange={(event) => {
//                                                 handleFileChange(event);
//                                                 handleFileChange4(index, event);
//                                             }}
//                                             style={{ display: 'none' }}
//                                             multiple
//                                         />
//                                         <Button
//                                             variant="outlined"
//                                             onClick={() => handleChooseImagesClick1(index)}
//                                             style={{ marginRight: '10px' }}
//                                         >
//                                             Photo
//                                         </Button>
//                                         <TextField
//                                             label="Attachment"
//                                             type="text"
//                                             size="small"
//                                             variant="outlined"
//                                             value={image.name}
//                                             disabled
//                                             fullWidth
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12} sm={4} style={{ textAlign: 'right' }}>
//                                         <Button
//                                             variant="contained"
//                                             color="secondary"
//                                             onClick={() => handleRemoveFileInput(index)}
//                                         >
//                                             <FontAwesomeIcon icon={faTimes} />
//                                         </Button>
//                                     </Grid>
//                                 </Grid>
//                             ))}
//                             <Grid container spacing={1} justifyContent="center" style={{ marginTop: '10px' }}>
//                                 <Grid item>
//                                     <Button
//                                         variant="outlined"
//                                         onClick={handleAddMoreFiles}
//                                         startIcon={<FontAwesomeIcon icon={faPlus} />}
//                                     >
//                                         Add More Files
//                                     </Button>
//                                 </Grid>
//                                 <Grid item>
//                                     <Button type="submit" variant="contained" color="primary">
//                                         Submit
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </form>
//                     </Card>
//                 </Grid>
//                 {base64Images && (
//                     <Grid item xs={12} md={8} style={{ marginTop: '20px' }}>
//                         <Typography variant="h6">Image Preview</Typography>
//                         <Box mt={2} display="flex" justifyContent="center">
//                             <img src={base64Images} alt="Preview" style={{ maxHeight: '250px', maxWidth: '300px' }} />
//                         </Box>
//                     </Grid>
//                 )}
//             </Grid>
//         </Box>
//     );
// }



// function KycAmlDeclaration({ formValues, handleInputChange }: SectionProps) {

//     const [section, setSection] = useState<string>('Application');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);

//     const showSuccessMessage = (message: string) => {
//         setSuccessMessage(message);
//         setIsSuccessOpen(true);
//         setTimeout(() => {
//             setIsSuccessOpen(false);
//             setSuccessMessage('');
//         }, 1000);
//     };

//     const saveSectionData = () => {
//         let message = '';
//         switch (section) {
//             case 'Application':
//                 message = 'Application data saved successfully.';
//                 break;
//             case 'Button':
//                 message = 'Button data saved successfully.';
//                 break;
//             case 'Terms':
//                 message = 'Terms data saved successfully.';
//                 break;
//             case 'Document Upload':
//                 message = 'Document Upload data saved successfully.';
//                 break;
//             default:
//                 message = 'Data saved successfully.';
//                 break;
//         }
//         showSuccessMessage(message);
//     };
//     return (
//         <Box mt={2}>
//             <ApplicationFrom />

//         </Box>
//         // <Box mt={2}>
//         //       <KycAmlDeclaration formValues={formValues} handleInputChange={handleInputChange} />
//         // </Box>

//     );
// }

// export default FormTabs;

// import React, { useState } from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import ApplicationFrom from './ApplicationFrom';  // Ensure this component is correctly imported
// import { AppFormData, DeclarationFrom, CreateData, Image } from '../../../data/services/applicationfrom/applicationfrome-payload';

// interface FormValues {
//   Questionnaire: AppFormData;
//   Declaration: DeclarationFrom;
//   ListofBoardDirectors: CreateData;
//   KYCDocument: Image;
// }

// function FormTabs() {
//   const [formValues, setFormValues] = useState<FormValues>({
//     Questionnaire: {
//       applicantFormDto: {
//         id: 0,
//         name: '',
//         numberOfPrint: 0,
//         applicantFormDetailsData: [],
//       },
//     },
//     Declaration: {
//       id: 0,
//       kycId: 0,
//       memberName: '',
//       registeredPlace: '',
//       din: '',
//       date: '',
//       place: '',
//       authorizeName: '',
//       uid: 0,
//     },
//     ListofBoardDirectors: {
//       id: 0,
//       kycId: 0,
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       pan: '',
//       nationality: 0,
//       citizenship: 0,
//       domicile: 0,
//       isDirector: 1,
//       isShareHolders: 0,
//       uid: 0,
//     },
//     KYCDocument: {
//       name: '',
//       uploading: false,
//       uploadSuccess: false,
//     },
//   });

//   const [selectedTab, setSelectedTab] = useState<'Questionnaire' | 'Declaration' | 'ListofBoardDirectors' | 'KYCDocument'>('Questionnaire');

//   const handleTabClick = (tab: 'Questionnaire' | 'Declaration' | 'ListofBoardDirectors' | 'KYCDocument') => {
//     setSelectedTab(tab);
//   };

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-around" mb={2}>
//         <Button variant={selectedTab === 'Questionnaire' ? 'contained' : 'outlined'} onClick={() => handleTabClick('Questionnaire')}>
//           Questionnaire
//         </Button>
//         <Button variant={selectedTab === 'Declaration' ? 'contained' : 'outlined'} onClick={() => handleTabClick('Declaration')}>
//           Declaration
//         </Button>
//         <Button variant={selectedTab === 'ListofBoardDirectors' ? 'contained' : 'outlined'} onClick={() => handleTabClick('ListofBoardDirectors')}>
//           List of Board Directors
//         </Button>
//         <Button variant={selectedTab === 'KYCDocument' ? 'contained' : 'outlined'} onClick={() => handleTabClick('KYCDocument')}>
//           KYC Document
//         </Button>
//       </Box>

//       {selectedTab === 'Questionnaire' && (
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>
//             <ApplicationFrom formValues={formValues.Questionnaire} />
//           </Typography>
//         </Box>
//       )}

//       {selectedTab === 'Declaration' && (
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>
//             Declaration Form
//           </Typography>
//           {/* Add the content for Declaration */}
//         </Box>
//       )}

//       {selectedTab === 'ListofBoardDirectors' && (
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>
//             List of Board Directors
//           </Typography>
//           {/* Add the content for List of Board Directors */}
//         </Box>
//       )}

//       {selectedTab === 'KYCDocument' && (
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>
//             KYC Document
//           </Typography>
//           {/* Add the content for KYC Document */}
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default FormTabs;
import React from 'react'

function Applicationpdf() {
  return (
    <div>Applicationpdf</div>
  )
}

export default Applicationpdf;