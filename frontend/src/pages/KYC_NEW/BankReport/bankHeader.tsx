import { useState, ChangeEvent, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import '../BankReport/bank.css';
import MuiAlert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { CreateData } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { Document, Page, } from 'react-pdf';
import Periodic from '../periodicview/Periodic';
import Header from '../../../layouts/header/header';
import DocumentApiService from '../../../data/services/document/Document_api_service';
import Kycdoument from '../view/Kycdoument';
import ApplicationFromView from '../view/ApplicationFromView';
import Documented from '../document/Documented';
import ClientFiles from '../../ClientView/ClientFiles';

interface ApplicationFormValues {
    memberName: string;
    officeAddress: string;
    pepCount: string;
    date: string;
    place: string;
    authorizedSignatory: string;
    designation: string;
    stamp: string;
};

interface ButtonFormValues {
    buttonText: string;
};

interface TermsFormValues {
    termsContent: string;
};

interface FormValues {
    application: ApplicationFormValues;
    button: ButtonFormValues;
    terms: TermsFormValues;
};

interface SectionProps {
    formValues: any;
    handleInputChange: (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function BankHeader() {

    const [section, setSection] = useState<string>('Application');
    const [activeButton, setActiveButton] = useState<string>('Application');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [formValues, setFormValues] = useState<FormValues>({
        application: {
            memberName: '',
            officeAddress: '',
            pepCount: '',
            date: '',
            place: '',
            authorizedSignatory: '',
            designation: '',
            stamp: ''
        },
        button: {
            buttonText: 'Click Me'
        },
        terms: {
            termsContent: ''
        }
    });

    const handleSectionChange = (sectionName: string) => {
        setSection(sectionName);
    };

    const handleInputChange = (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [sectionName]: {
                ...prevValues[sectionName as keyof FormValues],
                [name]: value
            }
        }));
    };

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    const renderSectionContent = () => {
        switch (section) {
            case 'Application':
                return <ApplicationForm formValues={formValues.application} handleInputChange={handleInputChange} />;
            case 'Button':
                return <ButtonContent formValues={formValues.button} handleInputChange={handleInputChange} />;
            case 'Terms':
                return <TermsAndConditions formValues={formValues.terms} handleInputChange={handleInputChange} />;
            case 'KyCdoument':
                return <KyCdoument formValues={formValues.terms} handleInputChange={handleInputChange} />;
            case 'Pep':
                return <Pep formValues={formValues.terms} handleInputChange={handleInputChange} />;
            case 'Client from Files':
                return <Client formValues={formValues.terms} handleInputChange={handleInputChange} />;
            case 'PeriodicView':
                return <PeriodicView formValues={formValues.terms} handleInputChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', height: '81%', marginTop: '4%' }}>
                            <Grid container>
                                <div>
                                    <h5 style={{ textAlign: 'center', marginTop: '5%' }}>CLIENT FORM</h5>
                                </div>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Application' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Application');
                                            handleSectionChange('Application');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Aml Kyc Questionnaire</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Button' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Button');
                                            handleSectionChange('Button');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Declaration</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Terms' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Terms');
                                            handleSectionChange('Terms');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>List of Board Directors</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'KyCdoument' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('KyCdoument');
                                            handleSectionChange('KyCdoument');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>KYC Document</span>
                                    </div>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <div>
                                    <h5 style={{ textAlign: 'center', marginTop: '5%' }}>NPCI REVIEW</h5>
                                </div>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Client from Files' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Client from Files');
                                            handleSectionChange('Client from Files');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Client Files</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Pep' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Pep');
                                            handleSectionChange('Pep');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Entity Screening</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'PeriodicView' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('PeriodicView');
                                            handleSectionChange('PeriodicView');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Risk Assessment</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Aml' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Aml');
                                            handleSectionChange('Aml');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Queries</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <div
                                        className={`arrow ${activeButton === 'Periodic Review' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveButton('Periodic Review');
                                            handleSectionChange('Aml');
                                        }}
                                    >
                                        <span style={{ textAlign: 'center' }}>Periodic Review</span>
                                    </div>
                                </Grid>
                            </Grid>
                            <div>
                                {renderSectionContent()}
                            </div>
                        </Card>
                        <Box mt={2} textAlign="center">
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
                        </Box>
                    </Box>
                </Box>
            </Box >
        </>
    );
};

function ButtonContent({ formValues, handleInputChange }: SectionProps) {

    const [declarationFrom, setDeclarationFrom] = useState({
        id: 0,
        kycId: 0,
        memberName: '',
        registeredPlace: '',
        din: '',
        date: '',
        place: '',
        authorizeName: '',
        authorizeDesignation: '',
        uid: 0,
    });

    const applicationfrome = new ApplicationfromeService();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const { kycId } = useParams<{ kycId: string }>();
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

    useEffect(() => {
        const responseId = sessionStorage.getItem('responseId');
        if (responseId) {
            console.log('Declaration responseId:', responseId);
            setDeclarationFrom(prevState => ({
                ...prevState,
                kycId: parseInt(responseId, 10),
            }));
        }
    }, []);

    const handleDeclarationForm = async (kycId: any) => {
        try {
            const response = await applicationfrome.getDeclarationForm(kycId);
            setDeclarationFrom(response[0]);
        } catch (error) {
            console.error("Error fetching declaration form:", error);
        }
    };

    if (!declarationFrom) return null;

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

    return (
        <Box mt={2}>
            <div id="pdfContent">
                <h4>Declaration Form</h4>
                <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                    <Typography variant="body1" paragraph>
                        We
                        <TextField
                            variant="standard"
                            name="memberName"
                            size='small'
                            inputProps={{ style: { textAlign: 'center', fontWeight: "800" }, readOnly: true }}
                            style={{ textAlign: 'center', fontWeight: 800 }}
                            value={declarationFrom.memberName}
                            multiline
                            minRows={1}
                            maxRows={4}
                        />
                        with registered office at <TextField
                            variant="standard"
                            name="registeredPlace"
                            size='small'
                            inputProps={{ style: { textAlign: 'center', fontWeight: "800" }, readOnly: true }}
                            style={{ textAlign: 'center', fontWeight: 800 }}
                            value={declarationFrom.registeredPlace}
                            autoComplete="off"
                            multiline
                            minRows={1}
                            maxRows={4}
                        /> have agreed to participate in the implementation of the products & services provided by National Payments Corporation of India (NPCI), with registered office at 1001 A, B wing 10th Floor, The Capital, Bandra-Kurla Complex, Bandra (East), Mumbai - 400051 and for that purpose, We hereby declare and undertake to NPCI that:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        ✓ We hereby confirm to have an established process for Know Your Customer (KYC), Anti Money Laundering process (AML) & Combating of Financing of Terrorism (CFT) and that we shall comply with all the Reserve Bank of India (RBI) norms on KYC, AML & CFT.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        ✓ We hereby confirm that <TextField
                            variant="standard"
                            name="din"
                            value={declarationFrom.din}
                            autoComplete='off'
                            size='small'
                            inputProps={{ style: { textAlign: 'center', fontWeight: "800" }, readOnly: true }}
                            style={{ textAlign: 'center', fontWeight: 800 }}
                        /> number of our | the company’s Director(s) is/are a “Politically Exposed Person (PEP)” or “close relative(s) of a PEP” or appear in the “list of terrorist individuals / entities” provided by RBI. In the event of our existing Director(s) is/are “PEP” or “close relative(s) of PEP” or appear in the list of “terrorist individuals / entities” provided by RBI, the details of same shall be furnished to NPCI on letter head.
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Typography variant="body1" paragraph>
                            Date: <TextField variant="standard" size='small' name="date" value={declarationFrom.date} inputProps={{ readOnly: true }} />
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Place: <TextField variant="standard" size='small' name="place" value={declarationFrom.place} inputProps={{ readOnly: true }} multiline minRows={1} maxRows={4} />
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="body1" paragraph align="right">
                            Authorized Signatory(ies)
                        </Typography>
                        <Typography variant="body1" paragraph align="right">
                            <TextField name="authorizeName" size='small' variant="standard" value={declarationFrom.authorizeName} autoComplete='off' inputProps={{ readOnly: true }} placeholder='Name' multiline minRows={1} maxRows={4} />
                        </Typography>
                        <Typography variant="body1" paragraph align="right">
                            <TextField name="authorizeDesignation" size='small' variant="standard" value={declarationFrom.authorizeDesignation} autoComplete='off' inputProps={{ readOnly: true }} placeholder='Designation' multiline minRows={1} maxRows={4} />
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
                <div>
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
        </Box>
    );
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

interface SignAuthority {
    name: string;
    designation: string;
};

function TermsAndConditions({ formValues, handleInputChange }: SectionProps) {

    const headingStyle = {
        fontFamily: 'Times New Roman',
    };

    const applicationfrome = new ApplicationfromeService();
    const [directors, setDirectors] = useState<Director[]>([]);
    const [shareHolders, setShareHolder] = useState<ShareHolder[]>([]);
    const [signAuthority, setSignAuthority] = useState<SignAuthority[]>([]);
    const [responseId, setResponseId] = useState(null);
    const { kycId } = useParams<{ kycId: string }>();

    const [KycformData, setKycFormData] = useState<CreateData[]>([
        {
            id: 0,
            kycId: 0,
            authorityId: 0,
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
            euid: 0,
            isScreening: 0
        }
    ]);

    const [KycformDataa, setKycFormDatas] = useState<CreateData[]>([
        {
            id: 0,
            kycId: 0,
            authorityId: 0,
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
            euid: 0,
            isScreening: 0
        }
    ]);

    useEffect(() => {
        handleDirectors(kycId);
        handleShareHolder(kycId);
        handleSignAuthority(kycId);
    }, [kycId]);

    useEffect(() => {
        if (responseId) {
        }
    }, [responseId]);

    const handleDirectors = async (kycId: any) => {
        try {
            const response = await applicationfrome.getKycDirectorsList(kycId);
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

    const handleSignAuthority = async (kycId: any) => {
        try {
            const response = await applicationfrome.getSignAuthority(kycId);
            setSignAuthority(response);
        } catch (error) {
            console.error("Error fetching shareholder:", error);
        }
    };

    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [imageURL, setImageURL] = useState('');
    const customerApiService = new DocumentApiService();

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

    const nationalityMap: { [key: string]: string } = {
        "1": "American",
        "2": "Canadian",
        "3": "Indian",
        "4": "Other"
    };

    const citizenshipMap: { [key: string]: string } = {
        "1": "American",
        "2": "Canadian",
        "3": "Indian",
        "4": "Other"
    };

    const DomicileMap: { [key: string]: string } = {
        "1": "American",
        "2": "Canadian",
        "3": "Indian",
        "4": "Other"
    };

    return (
        <Box mt={2}>
            <div id="pdfContent">
                <div className="key">
                    <h4>List of Directors</h4>
                    <div className="scrollablebox">
                        {directors.map((director, directorIndex) => (
                            <div key={directorIndex} className="person-container">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <p style={headingStyle}><strong>Name  :</strong>  {director.firstName || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Middle Name  :</strong>  {director.middleName || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Last Name  :</strong>  {director.lastName || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>PAN  :</strong>  {director.pan || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}>
                                            <strong>Nationality  :</strong> {nationalityMap[director.nationality] || 'Not Available'}
                                        </p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Citizenship :</strong> {citizenshipMap[director.citizenship] || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Domicile :</strong> {DomicileMap[director.domicile] || 'Not Available'}</p>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                    </div>
                </div>
                <br></br>
                <div className="key">
                    <h4>List of ShareHolders</h4>
                    <div className="scrollablebox">
                        {shareHolders.map((shareHolder, shareHolderIndex) => (
                            <div key={shareHolderIndex} className="person-container">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                        <p style={headingStyle}><strong>Name  :</strong>  {shareHolder.firstName || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Middle Name  :</strong>  {shareHolder.middleName || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Last Name  :</strong>  {shareHolder.lastName || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>PAN  :</strong>  {shareHolder.pan || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}>
                                            <strong>Nationality  :</strong> {nationalityMap[shareHolder.nationality] || 'Not Available'}
                                        </p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Citizenship :</strong> {citizenshipMap[shareHolder.citizenship] || 'Not Available'}</p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <p style={headingStyle}><strong>Domicile :</strong> {DomicileMap[shareHolder.domicile] || 'Not Available'}</p>
                                    </Grid>
                                </Grid>
                            </div>
                        ))
                        }
                    </div>
                </div>
                {signAuthority.map((authority, signAuthorityIndex) => (
                    <div key={signAuthorityIndex}>
                        <Typography variant="body1" paragraph align="right">
                            Authorized Signatory(ies)
                        </Typography>
                        <Typography variant="body1" paragraph align="right">
                            <TextField name="authorizeName" size='small' variant="standard" value={authority.name} autoComplete='off' inputProps={{ readOnly: true }} />
                        </Typography>
                        <Typography variant="body1" paragraph align="right">
                            <TextField name="authorizeDesignation" size='small' variant="standard" value={authority.designation} autoComplete='off' inputProps={{ readOnly: true }} />
                        </Typography>
                        <Typography variant="body1" paragraph align="right">
                            (Name & Designation)
                        </Typography>
                        <Typography variant="body1" paragraph align="right">
                            (With Stamp)
                        </Typography>
                    </div>
                ))}
                <br></br>
                <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}></div>
                <div>
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
        </Box>
    );
};

function Pep({ formValues, handleInputChange }: SectionProps) {

    return (
        <Box mt={2}>
            <Documented />
        </Box>
    );
};

function Client({ formValues, handleInputChange }: SectionProps) {

    return (
        <Box mt={2}>
            <ClientFiles />
        </Box>
    );
};

function PeriodicView({ formValues, handleInputChange }: SectionProps) {

    return (
        <Box mt={2}>
            <Periodic />
        </Box>
    );
};

function KyCdoument({ formValues, handleInputChange }: SectionProps) {

    return (
        <Box mt={2}>
            <Kycdoument />
        </Box>
    );
};

function ApplicationForm({ formValues, handleInputChange }: SectionProps) {

    const [section, setSection] = useState<string>('Application');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    return (
        <Box mt={2}>
            <ApplicationFromView />
        </Box>
    );
}

export default BankHeader;