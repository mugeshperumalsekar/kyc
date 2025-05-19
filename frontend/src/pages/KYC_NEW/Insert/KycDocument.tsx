import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Grid, IconButton } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
import { kycForm, QuestionType } from "../../../data/services/kyc/applicationfrom/applicationfrome-payload";
import DocumentApiService from "../../../data/services/document/Document_api_service";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Loader from "../../loader/loader";
import { removeQuestionnaire } from "../../kyc/Insert/state/save-application-action";

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

interface CustomerData {
    kycFormDto: kycForm;
}

function KYCDocument(props: any) {

    const userDetails = useSelector((state: any) => state.loginReducer);
    console.log('userDetails', userDetails);
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
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (responseId) {
            fetchData(responseId.toString());
        }
        // sessionStorage.clear();
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

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
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

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (!selectedFiles || selectedFiles.length === 0) {
                showErrorMessage('File is required. Please select atleast one file.');
                setLoading(false);
                return;
            }
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                setLoading(false);
                return;
            }
            const documentTypeId = 4;
            const uid = loginDetails.id;
            console.log('Submitting files:', selectedFiles);
            await documentApiService.saveFormCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
            showSuccessMessage('Signonupload added successfully.');
        } catch (error) {
            console.error('Error submitting files:', error);
            showErrorMessage('Error submitting files.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmits = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFiles || selectedFiles.length === 0) {
            showErrorMessage('File is required. Please select atleast one file.');
            setLoading(false);
            return;
        }
        const responseId = sessionStorage.getItem('responseId');
        if (!responseId) {
            console.error('No responseId found in session storage');
            return;
        }
        const numericKycId = parseInt(responseId, 10);
        if (isNaN(numericKycId)) {
            console.error('Response ID is not a valid number');
            return;
        }
        const documentTypeId = 4;
        const uid = loginDetails.id;
        try {
            setLoading(true);
            const uploadResponse = await documentApiService.saveFormCustomerRequest(selectedFiles, numericKycId, documentTypeId, uid);
            console.log('File Upload Response:', uploadResponse);
            const updateResponse = await applicationfrome.KycDocumentUpdate(numericKycId);
            console.log('KYC Document Update Response:', updateResponse);
            showSuccessMessage('Files uploaded and KYC document updated successfully.');
            dispatch(removeQuestionnaire());
        } catch (error) {
            console.error('Error during submission:', error);
        } finally {
            setLoading(false);
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
                    <Grid container spacing={1}>
                        {images.map((image, index) => (
                            <Grid item xs={12} key={index}>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {/* <div className="person-container"> */}
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
                                    {/* </div> */}
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
                    {loading && <Loader />}
                    <form onSubmit={handleSubmit}>
                        <button className='btn btn-primary'>
                            Save
                        </button>&nbsp;
                    </form>
                </Grid>
                {/* <button className='btn btn-primary' >
                    Submit
                </button> */}
                {loading && <Loader />}
                <form onSubmit={handleSubmits}>
                    <button type="submit" className='btn btn-primary'>
                        Submit
                    </button>
                    {loading && <Loader />}
                </form>
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

        </Box>
    );
}

export default KYCDocument;