import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button, Grid, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { Card } from 'react-bootstrap';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { Type, AccountType, QuestionType, AppFormData, kycForm, AnswerTypeData } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import contactImage from '../../../assets/contact.png';
import ponsunImage from '../../../assets/ponsun.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useApplicationContext } from './ApplicationContext';
import DocumentApiService from '../../../data/services/kyc/document/Document_api_service';
import './Form.css';
import { CSSProperties } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import { useSelector } from 'react-redux';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

interface CustomerData {
    kycFormDto: kycForm;
};

function ApplicationForm() {

    const [formData, setFormData] = useState<AppFormData>({
        applicantFormDto: {
            id: 0,
            name: '',
            numberOfPrint: 0,
            isCompleted: 0,
            isScreening: 0,
            uid: 0,
            applicantFormDetailsData: [],
        },
    });

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
    const [typeOptions, setTypeOptions] = useState<Type[]>([]);
    const [accountTypeOptions, setAccountTypeOptions] = useState<AccountType[]>([]);
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const { setResponseId } = useApplicationContext();
    const [downloadCount, setDownloadCount] = useState(0);
    const [isFormDataUpdated, setIsFormDataUpdated] = useState(false);
    const [formFullyRendered, setFormFullyRendered] = useState(false);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formDatas, setFormDatas] = useState<kycForm[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [saveClicked, setSaveClicked] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
    const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
    const [showInputBox, setShowInputBox] = useState<{ [key: number]: boolean }>({});
    const [additionalAnswers, setAdditionalAnswers] = useState<{ [key: number]: string }>({});
    const [errorMessages, setErrorMessages] = useState<string | null>(null);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails?.loginDetails;

    const documentApiService = new DocumentApiService();
    const applicationfrome = new ApplicationfromeService();

    useEffect(() => {
        fetchType();
        fetchQuestions()
    }, []);

    const showErrorMessages = (message: string) => {
        setErrorMessages(message);
    };

    const fetchData = async (kycId: string) => {
        try {
            setLoading(true);
            const customerData: CustomerData[] = await applicationfrome.getkycData(kycId);
            if (customerData && customerData.length > 0) {
                setFormDatas(customerData.map((data: CustomerData) => data.kycFormDto));
            } else {
                setErrors(["No data found"]);
            }
        } catch (error) {
            setErrors(["Error fetching data"]);
        } finally {
            setLoading(false);
        }
    };

    const validateFormFields = () => {
        const hasFilledField = formData.applicantFormDto.applicantFormDetailsData.some(item => item.answer.trim() !== '');
        return hasFilledField;
    };

    const fetchType = async () => {
        try {
            const recordtypes = await applicationfrome.getType();
            setTypeOptions(recordtypes);
        } catch (error) {
            console.error("Error fetching application types:", error);
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

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    useEffect(() => {
        const storedQuestions = localStorage.getItem('questions');
        if (storedQuestions) {
            const parsedQuestions = JSON.parse(storedQuestions);
            setFetchedQuestions(parsedQuestions);
            setDataFetched(true);
        } else {
            fetchQuestions();
        }
    }, []);

    const fetchQuestions = async () => {
        const applicationTypeId = 1;
        const accountTypeId = 2;
        try {
            const questions = await applicationfrome.getQuestionTypes(applicationTypeId, accountTypeId);
            setFetchedQuestions(questions);
            setDataFetched(true);
            setFormData(prevState => {
                const updatedFormData = {
                    ...prevState,
                    applicantFormDto: {
                        ...prevState.applicantFormDto,
                        applicantFormDetailsData: questions.map((question: { questionDto: { id: any; ansTypeId: any; }; }) => ({
                            id: 0,
                            kycId: 0,
                            accountTypeId,
                            applicationTypeId,
                            questionId: question.questionDto.id,
                            ansTypeId: question.questionDto.ansTypeId,
                            answer: '',
                            score: 0,
                            uid: 0,
                            subQuestionId: 0,
                            isSubAnswer: 0,
                            ansId: 0
                        }))
                    }
                };
                setIsFormDataUpdated(true);
                return updatedFormData;
            });
            setErrors(Array(questions.length).fill(''));
            setFormFullyRendered(true);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleAnswerChange = (index: number, value: string, isSubQuestion: boolean, subQuestionId: number | null = null) => {
        const question = fetchedQuestions[index];
        let answerTypeData: AnswerTypeData | undefined;
        if (isSubQuestion && subQuestionId) {
            const subQuestion = question.questionDto.subQuestionTypeData.find(subQ => subQ.id === subQuestionId);
            answerTypeData = subQuestion?.answerTypeData.find(answer => answer.name === value);
        } else {
            answerTypeData = question.questionDto.answerTypeData.find(answer => answer.name === value);
        }
        const updatedFormDetails = formData.applicantFormDto.applicantFormDetailsData.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    answer: value,
                    ansId: value === 'Under Process' ? answerTypeData?.id ?? 0 : item.ansId,
                    score: answerTypeData ? answerTypeData.score : item.score,
                    questionId: answerTypeData ? answerTypeData.questionId : item.questionId,
                    subQuestionId: isSubQuestion && subQuestionId ? subQuestionId : item.subQuestionId,
                };
            }
            return item;
        });
        setFormData({
            ...formData,
            applicantFormDto: {
                ...formData.applicantFormDto,
                applicantFormDetailsData: updatedFormDetails
            }
        });
        setShowInputBox(prev => ({ ...prev, [index]: value === "Under Process" }));
    };

    const handleAdditionalAnswerChange = (index: number, value: string) => {
        const isSubAnswerNumber = value.trim() === '' || isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10);
        setAdditionalAnswers(prev => ({ ...prev, [index]: value }));
        setFormData(prevFormData => {
            const updatedFormDetails = prevFormData.applicantFormDto.applicantFormDetailsData.map((item, idx) =>
                idx === index ? { ...item, isSubAnswer: isSubAnswerNumber } : item
            );
            return {
                ...prevFormData,
                applicantFormDto: {
                    ...prevFormData.applicantFormDto,
                    applicantFormDetailsData: updatedFormDetails
                }
            };
        });
    };

    const handleSubmit = async () => {
        const hasErrors = errors.some(error => error !== '');
        const isValid = validateFormFields();

        if (!isValid) {
            showErrorMessages('At least one input field must be filled.');
            return;
        }
        if (hasErrors) {
            showErrorMessages('Please fix the errors before submitting.');
            return;
        }
        try {
            let responseId = sessionStorage.getItem('responseId');
            let responseIdNumber;
            if (responseId) {
                responseIdNumber = Number(responseId);
                if (isNaN(responseIdNumber)) {
                    console.error('Invalid responseId found in session storage');
                    showErrorMessage('Invalid responseId found in session storage');
                    return;
                }
            } else {
                const initialResponse = await applicationfrome.Apllicationinsert(formData);
                if (initialResponse && initialResponse.id) {
                    responseIdNumber = initialResponse.id;
                    sessionStorage.setItem('responseId', responseIdNumber.toString());
                    setResponseId(responseIdNumber);
                } else {
                    console.error('Failed to generate a new responseId');
                    showErrorMessage('Failed to generate a new responseId');
                    return;
                }
            }
            const updatedNumberOfPrint = formData.applicantFormDto.numberOfPrint + 1;
            const updatedFormData = {
                ...formData,
                applicantFormDto: {
                    ...formData.applicantFormDto,
                    id: responseIdNumber,
                    numberOfPrint: updatedNumberOfPrint,
                },
            };
            localStorage.setItem('formData', JSON.stringify(updatedFormData));
            const response = await applicationfrome.Apllicationinsert(updatedFormData);
            if (response && response.id) {
                setDataFetched(true);
                setShowDownloadButton(true);
                setFormData(updatedFormData);
                setResponseId(response.id);
                await fetchData(response.id);
                showSuccessMessage('Aml Kyc Questionnaire added successfully.');
                setErrorMessages(null);
            } else {
                showErrorMessage('Submission failed, please try again.');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            showErrorMessage('Error submitting form, please try again.');
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

    const pages = splitDataIntoPages(fetchedQuestions, itemsPerPage);

    const itemsPerPages = 12;

    const splitDataIntoPage = (data: any[], itemsPerPages: number) => {
        const pageView = [];
        for (let i = 0; i < data.length; i += itemsPerPages) {
            pageView.push(data.slice(i, i + itemsPerPages));
        }
        return pageView;
    };

    const pageView = splitDataIntoPage(formDatas, itemsPerPages);

    const downloadPDF = async () => {
        setDownloadingPDF(true);
        try {
            const response = await applicationfrome.getPrintNumber(responseId);
            const printNumber = response;
            await new Promise(resolve => setTimeout(resolve, 0));
            const pdf = new jsPDF('p', 'mm', 'a4');
            const content = document.getElementById('pdfContent');
            if (!content) return;
            pdf.setFontSize(10);
            pdf.setFont('helvetica');
            content.style.display = 'block';
            const padding = 10;
            const scale = 2;
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
                pdf.text(`Update: ${printNumber}`, xCoordinate, padding);
                pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight);
                pdf.setLineWidth(0.2);
                pdf.setDrawColor(0, 0, 0);
                pdf.rect(padding, padding, contentWidth, contentHeight);
            }
            pdf.save('application_form.pdf');
            showSuccessMessage('Download successfully.');
        } catch (error) {
            setErrors(["Error generating PDF"]);
        } finally {
            const content = document.getElementById('pdfContent');
            if (content) content.style.display = 'none';
            setDownloadingPDF(false);
            setDownloadCount(prevCount => prevCount + 1);
        }
        setIsLevelcasedetailsOpen(true);
        setIsUploadSectionOpen(false);
    };

    const Signonupload = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }
        try {
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                showErrorMessage('No responseId found in session storage');
                return;
            }
            const documentTypeId = 1;
            const uid = loginDetails.id;
            if (selectedFiles.length === 0) {
                console.error('No files selected for submission');
                showErrorMessage('No files selected for submission');
                return;
            }
            console.log('Submitting files with responseId:', responseId, 'and documentTypeId:', documentTypeId);
            await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
            showSuccessMessage('Signonupload added successfully.');
            console.log('Files submitted successfully');
        } catch (error) {
            console.error('Error submitting files:', error);
            showErrorMessage('Error submitting files.');
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

    const responseId = sessionStorage.getItem('responseId');

    useEffect(() => {
        if (responseId) {
            setImages(prevImages => prevImages.map(image => ({
                ...image,
                kycId: parseInt(responseId, 10),
            })));
        }
    }, [responseId]);

    const handleSubmits = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }
        try {
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                return;
            }
            const documentTypeId = 1;
            const uid = loginDetails.id;
            if (selectedFiles.length === 0) {
                console.error('No files selected for submission');
                return;
            }
            console.log('Submitting files with responseId:', responseId, 'and documentTypeId:', documentTypeId);
            await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
            console.log('Files submitted successfully');
        } catch (error) {
            console.error('Error submitting files:', error);
        }
    };

    const handlesave = async () => {
        await handleSubmits();
        await Signonupload();
    };

    const a4SheetStyle = {
        width: '210mm',
        minHeight: '297mm',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    };

    const footerStyle: CSSProperties = {
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px',
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

    const pageContentStyle = {
        flex: '1 0 auto',
    };

    const tableContainerStyle = {
        width: '100%',
        marginBottom: '20px',
    };

    const tableCellStyle = {
        width: '10%',
        padding: '5px',
    };

    const contactImageStyle = {
        display: 'block',
        margin: '20px auto 0',
        maxWidth: '75%',
    };

    const contactImagesStyle: CSSProperties = {
        display: 'block',
        margin: '20px auto 0',
        maxWidth: '85%',
        textAlign: 'center' as 'center',
    };

    const pageNumberStyle: React.CSSProperties = {
        position: 'relative',
        bottom: '10px',
        right: '20px',
        fontSize: 'small',
        display: 'flex',
        justifyContent: 'flex-end',
    };

    const a4SheetStyles = {
        width: '270mm',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    };

    const tableStyles: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px',
    };

    const evenRowStyles = {
        backgroundColor: '#f2f2f2',
    };

    const { kycId } = useParams<{ kycId: string }>();
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const customerApiService = new DocumentApiService();

    const handleView = async () => {
        console.log('handleView called');
        setShowPdfModal(true);
        try {
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                return;
            }
            const pdfData = await customerApiService.getPDF(responseId, "1");
            setPdfData({ base64: pdfData.data, filename: pdfData.filename });
            setShowPdfModal(true);
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setPdfData({ base64: null, filename: null });
            setErrorMessage("No PDF available");
            setShowPdfModal(true);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        console.log('Document loaded with', numPages, 'pages');
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
            <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                <Container style={{ width: '274mm', minHeight: '297mm', marginTop: '2%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {pages.map((pageContent, pageIndex) => (
                            <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
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
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ fontSize: 'small' }}>
                                                    <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                                                    <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                                                    <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pageContent.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <TableRow>
                                                            <TableCell sx={{ width: '10%', padding: '20px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                {index + 1 + pageIndex * itemsPerPage}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                {item.questionDto.name}
                                                                {item.questionDto.multiQuestion === 1 && (
                                                                    item.questionDto.subQuestionTypeData && item.questionDto.subQuestionTypeData.map((subQuestion: any) => (
                                                                        <Typography key={subQuestion.id}>{subQuestion.name}:</Typography>
                                                                    ))
                                                                )}
                                                                {item.questionDto.ansTypeId === 2 && (
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {item.questionDto.description}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '50%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                                                                {item.questionDto.multiQuestion === 1 && item.questionDto.subQuestionTypeData && (
                                                                    item.questionDto.subQuestionTypeData.map((subQuestion: any) => (
                                                                        <React.Fragment key={subQuestion.id}>
                                                                            {subQuestion.ansTypeId === 2 ? (
                                                                                <>
                                                                                    <Select
                                                                                        style={{ fontSize: 'small' }}
                                                                                        fullWidth
                                                                                        size='small'
                                                                                        value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.subQuestionId === subQuestion.id)?.answer || ''}
                                                                                        onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, true, subQuestion.id)}
                                                                                    >
                                                                                        {subQuestion.answerTypeData.map((answer: { name: string }, answerIndex: React.Key) => (
                                                                                            <MenuItem
                                                                                                style={{ height: '2rem', fontSize: '0.75rem' }}
                                                                                                key={answerIndex}
                                                                                                value={answer.name}
                                                                                            >
                                                                                                {answer.name}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Select>
                                                                                    {showInputBox[index + pageIndex * itemsPerPage] && (
                                                                                        <TextField
                                                                                            sx={{ fontSize: 'x-small', marginTop: '10px' }}
                                                                                            fullWidth
                                                                                            size='small'
                                                                                            autoComplete='off'
                                                                                            multiline
                                                                                            placeholder="Please provide additional details"
                                                                                            value={additionalAnswers[index + pageIndex * itemsPerPage]}
                                                                                            onChange={(e) => handleAdditionalAnswerChange(index + pageIndex * itemsPerPage, e.target.value)}
                                                                                        />
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <TextField
                                                                                    sx={{ fontSize: 'x-small' }}
                                                                                    fullWidth
                                                                                    size='small'
                                                                                    autoComplete='off'
                                                                                    multiline
                                                                                    value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.subQuestionId === subQuestion.id)?.answer || ''}
                                                                                    onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, true, subQuestion.id)}
                                                                                />
                                                                            )}
                                                                            {errors[index + pageIndex * itemsPerPage] && (
                                                                                <Typography variant="caption" color="error">
                                                                                    {errors[index + pageIndex * itemsPerPage]}
                                                                                </Typography>
                                                                            )}
                                                                        </React.Fragment>
                                                                    ))
                                                                )}
                                                                {!item.questionDto.multiQuestion && item.questionDto.ansTypeId === 2 && (
                                                                    <>
                                                                        <Select
                                                                            style={{ fontSize: 'small' }}
                                                                            fullWidth
                                                                            size='small'
                                                                            value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.questionId === item.questionDto.id)?.answer || ''}
                                                                            onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, false)}
                                                                        >
                                                                            {item.questionDto.answerTypeData.map((answer: { name: string }, answerIndex: React.Key) => (
                                                                                <MenuItem
                                                                                    style={{ height: '2rem', fontSize: '0.75rem' }}
                                                                                    key={answerIndex}
                                                                                    value={answer.name}
                                                                                >
                                                                                    {answer.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        {showInputBox[index + pageIndex * itemsPerPage] && (
                                                                            <TextField
                                                                                sx={{ fontSize: 'x-small', marginTop: '10px' }}
                                                                                fullWidth
                                                                                size='small'
                                                                                autoComplete='off'
                                                                                multiline
                                                                                placeholder="Please provide additional details"
                                                                                value={additionalAnswers[index + pageIndex * itemsPerPage]}
                                                                                onChange={(e) => handleAdditionalAnswerChange(index + pageIndex * itemsPerPage, e.target.value)}
                                                                            />
                                                                        )}
                                                                    </>
                                                                )}
                                                                {!item.questionDto.multiQuestion && item.questionDto.ansTypeId !== 2 && (
                                                                    <TextField
                                                                        sx={{ fontSize: 'x-small' }}
                                                                        fullWidth
                                                                        size='small'
                                                                        autoComplete='off'
                                                                        multiline
                                                                        value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.questionId === item.questionDto.id)?.answer || ''}
                                                                        onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, false)}
                                                                    />
                                                                )}
                                                                {errors[index + pageIndex * itemsPerPage] && (
                                                                    <Typography variant="caption" color="error">
                                                                        {errors[index + pageIndex * itemsPerPage]}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                                    <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
                                </div>
                                &nbsp;<h4>Update: {formData.applicantFormDto.numberOfPrint}</h4>
                            </Paper>
                        ))}
                        <div style={a4SheetStyles}>
                            <div>
                                {imageURL && (
                                    <img
                                        src={imageURL}
                                        alt="Ponsun"
                                        style={{ display: 'block', margin: '0 auto', maxWidth: '35%', height: 'auto', maxHeight: '200px', marginBottom: '20px' }}
                                    />
                                )}
                            </div>
                            <table style={tableStyles}>
                                <tbody>
                                    <tr style={evenRowStyles}>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Name</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}>                     </td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Designation</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}>                            </td>
                                    </tr>
                                    <tr style={evenRowStyles}>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Signature</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}>                          </td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Seal of the Member</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}>                                   </td>
                                    </tr>
                                    <tr style={evenRowStyles}>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Date</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}>                     </td>
                                    </tr>
                                    <tr>
                                        <td style={{ ...cellStyle, width: '30%' }}><strong>Place</strong></td>
                                        <td style={{ ...cellStyle, width: '70%' }}>                      </td>
                                    </tr>
                                </tbody>
                            </table>
                            <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                            <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}></div>
                        </div>

                        {errorMessages && <Typography variant="caption" color="error">{errorMessages}</Typography>}

                        {dataFetched && isFormDataUpdated && formFullyRendered && (
                            <div>
                                {formData.applicantFormDto.applicantFormDetailsData[0]?.applicationTypeId === 1 &&
                                    formData.applicantFormDto.applicantFormDetailsData[0]?.accountTypeId === 2 && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="arroww" style={{ marginRight: '10px' }}>
                                                <span style={{ textAlign: 'center' }}>Step 1:</span>
                                            </div>
                                            <button style={{ width: '12%' }} className='btn btn-primary btn-sm' onClick={() => { handleSubmit(); setSaveClicked(true); }}>Save</button>
                                            <br />
                                        </div>
                                    )}
                                <br></br>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 2:</span>
                                    </div>
                                    <button style={{ width: '12%' }} className='btn btn-primary btn-sm' onClick={downloadPDF} disabled={!saveClicked}>Download</button>
                                </div>
                                <br></br>
                                {downloadingPDF && <p style={{ color: 'red' }}>Please wait for the download...</p>}
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
                                    <form onSubmit={Signonupload}>
                                        <button className='btn btn-primary btn-sm'>Sign on upload</button>
                                    </form>
                                </div>
                                <br></br>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 4:</span>
                                    </div>
                                    <button style={{ width: '12%' }} className='btn btn-primary btn-sm' onClick={handleView}>View</button>
                                </div>
                                <br></br>
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <div className="arroww" style={{ marginRight: '10px' }}>
                                        <span style={{ textAlign: 'center' }}>Step 3:</span>
                                    </div>
                                    <div>
                                        <button style={{ width: '200%' }} className='btn btn-primary btn-sm' onClick={handlesave}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <br></br>
                    </LocalizationProvider>
                </Container>
            </Card>
            <Card>
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
                    <Dialog open={showPdfModal} onClose={handleClosePdfModal} fullWidth maxWidth={false}>
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
                <div id="pdfContent" style={{ display: 'none', fontFamily: 'Arial, sans-serif' }}>
                    {pageView.map((pageContent, pageIndex) => (
                        <div key={pageIndex} style={a4SheetStyle}>
                            <Paper style={{ marginBottom: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                                <div ref={contentRef} style={pageContentStyle}>
                                    {/* <img src={ponsunImage} alt="Ponsun" style={{ ...contactImageStyle, marginBottom: '20px' }} /> */}
                                    <TableContainer style={tableContainerStyle}>
                                        <Table>
                                            <TableHead>
                                                <TableRow style={{ fontSize: '12px', backgroundColor: '#d6d0d09e' }}>
                                                    <TableCell style={tableCellStyle}>Sl.no</TableCell>
                                                    <TableCell style={{ ...tableCellStyle, width: '60%' }}>Question</TableCell>
                                                    <TableCell style={{ ...tableCellStyle, width: '30%' }}>Answer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pageContent && pageContent.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell style={{ ...tableCellStyle, fontWeight: 'bold' }}>{index + 1 + pageIndex * itemsPerPages} </TableCell>
                                                        <TableCell style={{ width: '40%', padding: '4px' }}>
                                                            {item && item.name}
                                                            {item && item.description && (
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {item.description}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item && item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : 'No answer available'}
                                                            {errors[index + pageIndex * itemsPerPage] && (
                                                                <Typography variant="caption" color="error">
                                                                    {errors[index + pageIndex * itemsPerPages]}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                                <div style={footerStyle}>
                                    <img src={contactImage} alt="Contact" style={contactImagesStyle} />
                                    <div style={pageNumberStyle}>Update: {formData.applicantFormDto.numberOfPrint}, Page : {pageIndex + 1}</div>
                                </div>
                            </Paper>
                        </div>
                    ))}
                    <div style={a4SheetStyle}>
                        <table style={tableStyle}>
                            <tbody>
                                <tr style={evenRowStyle}>
                                    <td style={{ ...cellStyle, width: '30%' }}><strong>Name</strong></td>
                                    <td style={{ ...cellStyle, width: '70%' }}>                     </td>
                                </tr>
                                <tr>
                                    <td style={{ ...cellStyle, width: '30%' }}><strong>Designation</strong></td>
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
                    </div>
                </div>
            </Card>
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

        </>
    );
}

export default ApplicationForm;