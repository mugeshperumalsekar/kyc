import React from "react";
import { useState, useEffect, ChangeEvent } from "react";
import { Paper, Typography, TextField, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Container, IconButton } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import MuiAlert from '@mui/material/Alert';
import { Document, Page } from 'react-pdf';
import DocumentApiService from "../../../data/services/document/Document_api_service";
import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
import CloseIcon from '@mui/icons-material/Close';
import { pdfjs } from 'react-pdf';
import axios from "axios";
import Loader from "../../loader/loader";
import '../../loader/loader.css';
import './Form.css';
import './Form.css';
import './pdf.css';
import { useSelector } from "react-redux";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

const Declaration = (props: any) => {

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const [images, setImages] = useState<Image[]>([initialImageState]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const [base64Images, setBase64Images] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showSaveBtn, setShowSaveBtn] = useState(true);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const customerApiService = new DocumentApiService();
    const declarationId = sessionStorage.getItem('declarationId');
    const [saveClicked, setSaveClicked] = useState(false);
    const [downlodClicked, setDownlodClicked] = useState(false);
    const [signUploadBtnClicked, setSignUploadBtnClicked] = useState(false);
    const [viewBtnClicked, setViewBtnClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const canvasRef = React.createRef();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [pdfRendered, setPdfRendered] = useState(false);

    const [declarationData, setDeclarationData] = useState({
        authorizeDesignation: '',
        authorizeName: '',
        date: '',
        din: '',
        euid: 0,
        id: 0,
        kycId: 0,
        memberName: '',
        place: '',
        registeredPlace: '',
        uid: 0,
    });

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const applicationFormApiService = new ApplicationfromeService();
    const responseId = sessionStorage.getItem('responseId');

    useEffect(() => {
        if (responseId || props.kycId) {
            props.handleInputChange('kycId', parseInt(responseId || props.kycId, 10));
        }
    }, []);

    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [downloadCount, setDownloadCount] = useState(0);
    const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
    const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
    const [isSaveActive, setIsSaveActive] = useState(false);
    const documentApiService = new DocumentApiService();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            setLoading(true);
            const uid = loginDetails.id;
            if (!uid) {
                console.error('User ID (uid) is missing.');
                return;
            }
            if (props.kycId === 0) {
                console.error('Invalid kycId');
                return;
            }
            const dataToSubmit = {
                ...props.declarationData,
                uid: parseInt(uid)
            };
            console.log("Submitting declaration data:", props.declarationData);
            const response = await applicationFormApiService.DeclarationForm(dataToSubmit);
            console.log('API response:', response);
            if (!response || !response.id) {
                console.error('Failed to create declaration. Response is undefined or invalid:', response);
                return;
            }
            showSuccessMessage('Declaration added successfully.');
            setIsSaveActive(true);
            props.enableBoardContent();
            sessionStorage.setItem('declarationId', response.id);
            console.log('Declaration Response Id:', response.id);
            setSaveClicked(true);
            console.log('About to enable board content');
            await updateUiFromDbData(response.id);
        } catch (error) {
            setSaveClicked(false);
            console.error("Error submitting form:", error);
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const { kycId } = useParams<{ kycId: any }>();

    // useEffect(() => {
    //     if (declarationId || kycId) {
    //         console.log('declarationId:', declarationId);
    //         updateUiFromDbData(declarationId || kycId);
    //     }
    // }, [declarationId, kycId]);

    useEffect(() => {
        const idToUse = (!declarationId || Number(declarationId) === 0) ? responseId : declarationId;

        if (idToUse) {
            console.log('Using ID:', idToUse);
            updateUiFromDbData(idToUse);
        }
    }, [declarationId, responseId]);

    const updateUiFromDbData = async (kycId: string) => {
        try {
            const declarationdata = await applicationFormApiService.getDeclarationFormById(kycId);
            console.log('Declaration data:', declarationdata);
            if (declarationdata.length > 0) {
                setDeclarationData(declarationdata[0]);
                props.handleInputChange('dbData', declarationdata[0]);
            }
            setShowSaveBtn(false);
            props.enableBoardContent();
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const handleDownload = async () => {
        setDownloadingPDF(true);
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 0));
            const pdf = new jsPDF('p', 'mm', 'a4');
            const content = document.getElementById('pdfContent');
            if (!content) return;
            const fontSizeInPoints = 11;
            pdf.setFontSize(fontSizeInPoints);
            pdf.setFont('helvetica');
            const padding = 15;
            const scale = 4;
            const pageWidth = 210;
            const pageHeight = 200;
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
            }
            pdf.save('declaration_form.pdf');
            showSuccessMessage('Download successfully.');
            setIsLevelcasedetailsOpen(false);
            setIsUploadSectionOpen(true);
        } catch (error) {
            setErrors(["Error generating PDF"]);
            setDownlodClicked(false);
            setIsLevelcasedetailsOpen(true);
            setIsUploadSectionOpen(false);
        } finally {
            setDownloadingPDF(false);
            setDownloadCount(prevCount => prevCount + 1);
            setDownlodClicked(true);
            setLoading(false);
        }
        setIsLevelcasedetailsOpen(true);
    };

    const Signonupload = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            setLoading(true);
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                showErrorMessage('No responseId found in session storage');
                return;
            }
            const documentTypeId = 2;
            const uid = loginDetails.id;
            if (selectedFiles.length === 0) {
                console.error('No files selected for submission');
                showErrorMessage('No files selected for submission');
                return;
            }
            console.log('Submitting files with responseId:', responseId, 'and documentTypeId:', documentTypeId);
            await documentApiService.saveFormCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
            showSuccessMessage('Signonupload added successfully.');
            setSignUploadBtnClicked(true);
            console.log('Files submitted successfully');
        } catch (error) {
            setSignUploadBtnClicked(false);
            console.error('Error submitting files:', error);
            showErrorMessage('Error submitting files.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmits = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                return;
            }
            const documentTypeId = 2;
            const uid = loginDetails.id;
            console.log('Submitting files:', selectedFiles);
            await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
        } catch (error) {
            console.error('Error submitting files:', error);
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

    const handleView = async () => {
        console.log('handleView called');
        setLoading(true);
        try {
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                setLoading(false);
                return;
            }
            const pdfData = await customerApiService.getkycPDF(responseId, 2);
            console.log('PDF data:', pdfData);
            if (pdfData && pdfData.data) {
                setPdfData({ base64: pdfData.data, filename: "declaration_form.pdf" });
                setPdfRendered(false);
                setShowPdfModal(true);
            } else {
                setErrorMessage("No PDF available");
            }
            setViewBtnClicked(true);
            console.log('PDF modal set to open');
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setPdfData({ base64: null, filename: null });
            setErrorMessage("No PDF available");
        } finally {
            setLoading(false);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        console.log('Document loaded with', numPages, 'pages');
        setNumPages(numPages);
        setPdfRendered(true);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };

    const handleClosePdfModal = () => {
        setShowPdfModal(false);
        setPdfRendered(false);
    };

    const handlePrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages!));
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

    const handlestep5Submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        showSuccessMessage("Declaration added successfully.");
    };

    return (
        <Container
            style={{ width: "274mm", minHeight: "297mm", marginTop: "5%" }}>

            <div id="pdfContent">
                <Paper elevation={10} style={{ marginBottom: '20px', fontFamily: 'Roboto,Helvetica,Arial,sans-serif', padding: '15px', margin: 'auto' }}>
                    <div style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
                        <Typography variant="body1" paragraph className="mt-3" style={{ fontSize: '12px' }}>
                            We {' '}
                            <TextField
                                variant="standard"
                                name="memberName"
                                size='small'
                                inputProps={{ style: { fontSize: '12px' } }}
                                style={{ width: '25%' }}
                                value={props.declarationData?.memberName}
                                autoComplete="off"
                                onChange={(event) => props.handleInputChange('application', event)}
                            />
                            with registered office at {' '}
                            <TextField
                                variant="standard"
                                name="registeredPlace"
                                size='small'
                                value={props.declarationData?.registeredPlace}
                                autoComplete="off"
                                onChange={(event) => props.handleInputChange('application', event)}
                            /> {' '}
                            have agreed to participate in the implementation of the products & services provided by National Payments Corporation of India (NPCI), with registered office at 1001 A, B wing 10th Floor, The Capital, Bandra-Kurla Complex, Bandra (East), Mumbai - 400051 and for that purpose, We hereby declare and undertake to NPCI that:
                        </Typography>
                        <Typography variant="body1" paragraph>
                            ✓ We hereby confirm to have an established process for Know Your Customer (KYC), Anti Money Laundering process (AML) & Combating of Financing of Terrorism (CFT) and that we shall comply with all the Reserve Bank of India (RBI) norms on KYC, AML & CFT.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            ✓ We hereby confirm that <TextField variant="standard" size='small' name="din" value={props.declarationData?.din} autoComplete='off' onChange={(event) => props.handleInputChange('application', event)} /> number of our | the company’s Director(s) is/are a “Politically Exposed Person (PEP)” or “close relative(s) of a PEP” or appear in the “list of terrorist individuals / entities” provided by RBI. In the event of our existing Director(s) is/are “PEP” or “close relative(s) of PEP” or appear in the list of “terrorist individuals / entities” provided by RBI, the details of same shall be furnished to NPCI on letter head.
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                            <div>
                                <Typography variant="body1" paragraph style={{ display: 'flex', alignItems: 'baseline' }}>
                                    Date : {' '}
                                    <TextField
                                        variant="standard"
                                        size="small"
                                        name="date"
                                        type="date"
                                        value={props.declarationData?.date}
                                        onChange={(event) => props.handleInputChange('application', event as ChangeEvent<HTMLInputElement>)}
                                        InputProps={{ style: { width: '160px', marginLeft: '10px' } }}
                                    />
                                </Typography>

                                <Typography variant="body1" paragraph>
                                    Place : {' '}
                                    <TextField
                                        variant="standard"
                                        size='small'
                                        name="place"
                                        type="text"
                                        value={props.declarationData?.place}
                                        autoComplete='off'
                                        onChange={(event) => props.handleInputChange('application', event as ChangeEvent<HTMLInputElement>)}
                                        InputProps={{ style: { width: '160px' } }}
                                    />
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="body1" paragraph align="right">
                                    Authorized Signatory(ies)
                                </Typography>
                                <Typography variant="body1" paragraph align="right">
                                    <TextField name="authorizeName" variant="standard" size='small' value={props.declarationData?.authorizeName} autoComplete='off' onChange={(event) => props.handleInputChange('application', event as ChangeEvent<HTMLInputElement>)} placeholder="Name" />
                                </Typography>
                                <Typography variant="body1" paragraph align="right">
                                    <TextField name="authorizeDesignation" variant="standard" size='small' value={props.declarationData?.authorizeDesignation} autoComplete='off' onChange={(event) => props.handleInputChange('application', event as ChangeEvent<HTMLInputElement>)} placeholder="Designation" />
                                </Typography>
                                <Typography variant="body1" paragraph align="right">
                                    (Name & Designation)
                                </Typography>
                                <Typography variant="body1" paragraph align="right">
                                    (With Stamp)
                                </Typography>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}></div>
                    </div>
                </Paper>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 1:</span>
                </div>
                <button style={{ width: '12%' }} className='btn btn-primary' disabled={isSaveActive} onClick={handleSubmit}>
                    Save
                </button>
                {loading && <Loader />}
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 2:</span>
                </div>
                <button style={{ width: '12%' }} className={`btn btn-sm ${saveClicked ? 'btn-primary' : 'btn-secondary'}`} onClick={handleDownload} disabled={!saveClicked} >Download</button>
                {loading && <Loader />}
            </div>
            <br></br>
            {downloadingPDF && (
                <p style={{ color: "red" }}>
                    Please wait for the download...
                </p>
            )}
            {isLevelcasedetailsOpen && (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            {images.map((image, index) => (
                                <Grid item xs={12} key={index}>
                                    <form onSubmit={handleSubmits} encType="multipart/form-data">
                                        <div className="person-container">
                                            <div className="field-group">
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
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    className="arroww"
                    style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 3:</span>
                </div>
                <form onSubmit={Signonupload} style={{ width: '11%' }}>
                    <button
                        style={{ width: '109%', marginLeft: '-1%' }}
                        className={`btn btn-sm ${downlodClicked ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={selectedFiles.length === 0}
                    >
                        Sign on upload
                    </button>
                    {errorMessage && (
                        <Typography
                            variant="body1"
                            style={{ color: "red", textAlign: "center", marginLeft: "1%", fontFamily: "'Bookman Old Style', serif", fontSize: '14px' }}
                        >
                            {errorMessage}
                        </Typography>
                    )}
                </form>
                {loading && <Loader />}
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 4:</span>
                </div>
                <button style={{ width: '12%' }}
                    className={`btn btn-sm ${signUploadBtnClicked ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={!signUploadBtnClicked}
                    onClick={handleView}>View</button>  {loading && <Loader />}
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center', }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 5:</span>
                </div>
                <form onSubmit={handlestep5Submit} style={{ width: '6%' }}>
                    <button style={{ width: "200%" }}
                        className={`btn btn-sm ${viewBtnClicked ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={!viewBtnClicked} >Submit</button>
                </form>
            </div>
            <div>

                <Dialog open={showImageModal} onClose={handleCloseImageModal} fullWidth maxWidth='xl'>
                    <DialogTitle>Image Preview</DialogTitle>
                    <DialogContent>
                        {base64Image && <img src={`data:image/png;base64,${base64Image}`} alt="Image Preview" />}
                        {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseImageModal}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showImageModal} onClose={handleCloseImageModal} fullWidth maxWidth='xl'>
                    {loading && <Loader />}
                    <DialogTitle>Image Preview</DialogTitle>
                    <DialogContent>
                        {base64Image && <img src={base64Image} alt="Image Preview" />}
                        {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseImageModal}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showPdfModal} onClose={handleClosePdfModal} maxWidth="md">
                    {loading && <Loader />}
                    <DialogTitle>PDF Preview
                        <IconButton aria-label="close" onClick={handleClosePdfModal} style={{ position: "absolute", right: 8, top: 8, color: "#aaa" }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers={true} style={{ overflow: "auto", padding: 0, margin: 0, maxHeight: '90vh' }}>
                        {pdfData.base64 && (
                            <div
                                style={{
                                    border: "1px solid #e0e0e0",
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    height: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <Document file={`data:application/pdf;base64,${pdfData.base64}`} onLoadSuccess={onDocumentLoadSuccess} loading={<Loader />} className="pdf-document" >
                                    {Array.from(new Array(numPages), (el, index) => (
                                        <div
                                            key={`page_${index + 1}`}
                                            style={{
                                                margin: 0,
                                                padding: 0,
                                                display: "flex",
                                                justifyContent: "center",
                                                height: 'auto',
                                            }}
                                        >
                                            <Page
                                                pageNumber={index + 1}
                                                renderMode="canvas"
                                                width={Math.min(window.innerWidth * 0.8, 650)}
                                                renderTextLayer={true}
                                                scale={1.25}
                                                renderAnnotationLayer={false}
                                                imageResourcesPath=""
                                            />
                                        </div>
                                    ))}
                                </Document>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {pdfData.filename && (
                            <div>
                                <a
                                    href={`data:application/pdf;base64,${pdfData.base64}`}
                                    download={pdfData.filename}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer', float: 'right' }}
                                >
                                    Download PDF
                                </a>
                            </div>
                        )}
                    </DialogActions>
                </Dialog>

            </div>

            <Snackbar
                open={isSuccessOpen}
                autoHideDuration={5000}
                onClose={() => setIsSuccessOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    onClose={() => setIsSuccessOpen(false)}
                >
                    {successMessage}
                </MuiAlert>
            </Snackbar>

            <Snackbar
                open={isErrorOpen}
                autoHideDuration={5000}
                onClose={() => setIsErrorOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={() => setIsErrorOpen(false)}
                >
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </Container >
    );
}

export default Declaration;