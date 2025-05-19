import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Container, Autocomplete } from '@mui/material';
import './Form.css';
import './pdf.css';
import MuiAlert from '@mui/material/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@mui/material';
import { Paper } from '@mui/material';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { NewPayload } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import DocumentApiService from '../../../data/services/document/Document_api_service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Page } from 'react-pdf';
import { useParams } from 'react-router-dom';
import Loader from '../../loader/loader';
import CloseIcon from '@mui/icons-material/Close';
import { pdfjs } from 'react-pdf';
import { useSelector } from "react-redux";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

interface Director {
    name: string;
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
    id: number;
    kycId: number;
    name: string;
    designation: string;
    uid: number;
    euid: number;
}

const initialDirectorsData: Director[] = [];

const ListOfBoardDirector = (props: any) => {

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const [images, setImages] = useState<Image[]>([initialImageState]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const [base64Images, setBase64Images] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    const [name, setAuthorizeName] = useState('');
    const [designation, setAuthorizeDesignation] = useState('');
    const [hideAddBtn, setHideAddBtn] = useState(false);
    const [saveClicked, setSaveClicked] = useState(false);
    const [downlodClicked, setDownlodClicked] = useState(false);
    const [signUploadBtnClicked, setSignUploadBtnClicked] = useState(false);
    const [viewBtnClicked, setViewBtnClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [designationError, setDesignationError] = useState('');
    const [pdfRendered, setPdfRendered] = useState(false);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [openNationalities, setOpenNationalities] = useState<boolean[]>([]);
    const [openCitizenships, setOpenCitizenships] = useState<boolean[]>([]);
    const [openDomiciles, setOpenDomiciles] = useState<boolean[]>([]);

    const customerApiService = new DocumentApiService();
    const documentApiService = new DocumentApiService();
    const applicationFormApiSevice = new ApplicationfromeService();

    const handleNationalityOpen = (index: number) => {
        setOpenNationalities((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    const handleNationalityClose = (index: number) => {
        setOpenNationalities((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const handleCitizenshipOpen = (index: number) => {
        setOpenCitizenships((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    const handleCitizenshipClose = (index: number) => {
        setOpenCitizenships((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const handleDomicileOpen = (index: number) => {
        setOpenDomiciles((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    const handleDomicileClose = (index: number) => {
        setOpenDomiciles((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
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
        const savedName = sessionStorage.getItem('authorizeName');
        const savedDesignation = sessionStorage.getItem('authorizeDesignation');
        if (savedName) {
            setAuthorizeName(savedName);
        }
        if (savedDesignation) {
            setAuthorizeDesignation(savedDesignation);
        }
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAuthorizeName(value);
        sessionStorage.setItem('authorizeName', value);
    };

    const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAuthorizeDesignation(value);
        sessionStorage.setItem('authorizeDesignation', value);
    };

    const handleAddNewDirectorsList = () => {
        props.handleDirectorsChange(null, null, true);
    };

    const handleAddNewShareholdersList = () => {
        props.handleShareHoldersChange(null, null, true);
    };

    const handleRemoveDirectorsdata = (personIndex: number) => {
        props.handleDirectorsChange(null, personIndex, false);
    };

    const handleRemoveShareHoldersData = (personIndex: number) => {
        props.handleShareHoldersChange(null, personIndex, false);
    };

    const responseId = sessionStorage.getItem('responseId');
    console.log('ApplicationForm responseId:', responseId);

    useEffect(() => {
        if (responseId) {
            console.log(responseId.toString());
        }
    }, [responseId]);

    const { kycId } = useParams<{ kycId: any }>();

    const handleSubmit = async () => {
        let valid = true;
        setNameError('');
        setDesignationError('');
        const responseId = sessionStorage.getItem('responseId');
        const validResponseId = responseId ? Number(responseId) : props.kycId;
        if (!validResponseId) {
            console.error('No valid responseId or kycId found');
            return;
        }
        const invalidSignatories = props.signAuthorityData.filter(
            (person: { name: string; designation: string }) => !person.name || !person.designation
        );
        if (invalidSignatories.length > 0) {
            console.error('Name and designation are required fields for all signatories');
            if (!invalidSignatories[0].name) {
                setNameError('Name is required');
            }
            if (!invalidSignatories[0].designation) {
                setDesignationError('Designation is required');
            }
            valid = false;
        }
        if (!valid) {
            return;
        }
        try {
            setLoading(true);
            const directorsPayload = props.directorsData.map((person: any) => ({
                ...person,
                responseId: validResponseId,
                kycId: validResponseId,
                uid: loginDetails.id,
                nationality: person.nationality || 0,
                citizenship: person.citizenship || 0,
                domicile: person.domicile || 0,
                euid: 1,
                isScreening: 0
            }));
            console.log('DirectorsPayload:', directorsPayload);
            const shareholdersPayload = props.shareholdersData.map((person: any) => ({
                ...person,
                responseId: validResponseId,
                kycId: validResponseId,
                uid: loginDetails.id,
                nationality: person.nationality || 0,
                citizenship: person.citizenship || 0,
                domicile: person.domicile || 0,
                euid: 1,
                isScreening: 0
            }));
            console.log('Shareholders Payload:', shareholdersPayload);
            const payload: NewPayload = {
                createDirectorsSignAuthorityRequests: {
                    id: 0,
                    kycId: validResponseId,
                    name: props.signAuthorityData.map((person: { name: any; }) => person.name).join(', '),
                    designation: props.signAuthorityData.map((person: { designation: any; }) => person.designation).join(', '),
                    uid: loginDetails.id,
                    euid: 1,
                },
                createDirectorsListRequest: [...directorsPayload, ...shareholdersPayload],
            };
            console.log('Payload:', payload);
            const response = await applicationFormApiSevice.Directorslist(payload);
            console.log('API Response:', response);
            if (response && response.id) {
                console.log('Submission successful', response);
                setHideAddBtn(true);
                props.renderKycdocumentContent();
                showSuccessMessage('List of Board Directors unblocked successfully.');
                setSaveClicked(true);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error submitting data', error);
            setHideAddBtn(false);
            setSaveClicked(false);
            showErrorMessage('Failed to submit the list. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmits = async () => {
        showSuccessMessage('List of Board Directors unblocked successfully.');
    };

    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [downloadCount, setDownloadCount] = useState(0);
    const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
    const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);

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
            const padding = 10;
            const scale = 5;
            const pageWidth = 210;
            const pageHeight = 180;
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
            pdf.save('Director_form.pdf');
            setDownlodClicked(true);
            showSuccessMessage('Download successfully.');
        } catch (error) {
            setDownlodClicked(false);
            setErrors(["Error generating PDF"]);
        } finally {
            const content = document.getElementById('pdfContent');
            setDownloadingPDF(false);
            setDownlodClicked(true);
            setDownloadCount(prevCount => prevCount + 1);
            setLoading(false);
        }
        setIsLevelcasedetailsOpen(true);
        setIsUploadSectionOpen(false);
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
            const pdfData = await customerApiService.getkycPDF(responseId, 3);
            if (pdfData && pdfData.data) {
                setPdfData({ base64: pdfData.data, filename: "director_form.pdf" });
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
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };

    const handleClosePdfModal = () => {
        setShowPdfModal(false);
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

    const Signonupload = async (event: any) => {
        event.preventDefault();
        try {
            setLoading(true);
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                return;
            }
            const documentTypeId = 3;
            const uid = loginDetails.id;
            console.log('Submitting files:', selectedFiles);
            await documentApiService.saveFormCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
            setSignUploadBtnClicked(true);
            showSuccessMessage('Signonupload added successfully.');
        } catch (error) {
            setSignUploadBtnClicked(false);
            console.error('Error submitting files:', error);
        } finally {
            setLoading(false);
            setIsUploadSectionOpen(false);
        }
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

    const { person, personIndex } = props;

    const nationalities = [
        { value: "1", label: "American" },
        { value: "2", label: "Canadian" },
        { value: "3", label: "Indian" },
        { value: "4", label: "Other" },
    ];

    const citizenship = [
        { value: "1", label: "American" },
        { value: "2", label: "Canadian" },
        { value: "3", label: "Indian" },
        { value: "4", label: "Other" },
    ];

    const domicile = [
        { value: "1", label: "American" },
        { value: "2", label: "Canadian" },
        { value: "3", label: "Indian" },
        { value: "4", label: "Other" },
    ];

    const nationalitie = [
        { value: "1", label: "American" },
        { value: "2", label: "Canadian" },
        { value: "3", label: "Indian" },
        { value: "4", label: "Other" },
    ];

    const citizenships = [
        { value: "1", label: "American" },
        { value: "2", label: "Canadian" },
        { value: "3", label: "Indian" },
        { value: "4", label: "Other" },
    ];

    const domiciles = [
        { value: "1", label: "American" },
        { value: "2", label: "Canadian" },
        { value: "3", label: "Indian" },
        { value: "4", label: "Other" },
    ];

    const [inputValue, setInputValue] = useState(person?.nationality || '');
    const [selectedValue, setSelectedValue] = useState(person?.nationality || '');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(true);

    const clearInput = () => {
        setInputValue('');
        setSelectedValue('');
        props.handleDirectorsChange({ target: { value: '' } }, personIndex);
    };

    const handleSelectChange = (event: any, newValue: string) => {
        if (newValue) {
            const selectedNationality = nationalities.find(n => n.label === newValue);
            if (selectedNationality) {
                setInputValue(selectedNationality.label);
                setSelectedValue(selectedNationality.value);
                props.handleDirectorsChange({ target: { value: selectedNationality.value } }, personIndex);
                setIsOpen(false);
            }
        } else {
            clearInput();
        }
    };

    const handleInputChange = (event: any, newInputValue: any) => {
        setIsTyping(true);
        if (newInputValue !== null && newInputValue !== undefined) {
            setInputValue(newInputValue);
            const matchingOption = nationalities.find(n =>
                n.label.toLowerCase().startsWith(newInputValue.toLowerCase())
            );
            if (!matchingOption) {
                clearInput();
            } else if (matchingOption && isTyping) {
                setInputValue(matchingOption.label);
            }
        }
    };

    const handleCombinedTabChange = (event: any) => {
        if (event.key === 'Tab') {
            if (highlightedValue) {
                const selectedNationality = nationalities.find(n => n.label === highlightedValue);
                if (selectedNationality) {
                    setSelectedValue(selectedNationality.value);
                    setInputValue(highlightedValue);
                    props.handleDirectorsChange({ target: { value: selectedNationality.value } }, personIndex);
                }
            }
            if (highlightedValues) {
                const selectedCitizenship = citizenship.find(n => n.label === highlightedValues);
                if (selectedCitizenship) {
                    setSelectedValues(selectedCitizenship.value);
                    setInputValues(highlightedValues);
                    props.handleDirectorsChange({ target: { value: selectedCitizenship.value } }, personIndex);
                }
            }
            if (highlightValues) {
                const selectedDomicile = domicile.find(n => n.label === highlightValues);
                if (selectedDomicile) {
                    setSelectValues(selectedDomicile.value);
                    setValues(highlightValues);
                    props.handleDirectorsChange({ target: { value: selectedDomicile.value } }, personIndex);
                }
            }
            setIsOpen(false);
            setOnOpen(false);
            setOnOpens(false);
        }
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Backspace') {
            clearInput();
            setHighlightedValue(null);
        }
        handleCombinedTabChange(event);
    };

    const handleKeysDown = (event: any) => {
        if (event.key === 'Backspace') {
            clearInputs();
            setHighlightedValues(null);
        }
        handleCombinedTabChange(event);
    };

    const handleKeyDowns = (event: any) => {
        if (event.key === 'Backspace') {
            inputClear();
            setHighlightValues(null);
        }
        handleCombinedTabChange(event);
    };

    const [inputValues, setInputValues] = useState(person?.citizenship || '');
    const [selectedValues, setSelectedValues] = useState(person?.citizenship || '');
    const [onOpen, setOnOpen] = useState(false);
    const [highlightedValues, setHighlightedValues] = useState(null);
    const [onTyping, setOnTyping] = useState(true);

    const clearInputs = () => {
        setInputValues('');
        setSelectedValues('');
        props.handleDirectorsChange({ target: { value: '' } }, personIndex);
    };

    const handleChange = (event: any, newValue: string) => {
        if (newValue) {
            const selectedCitizenship = citizenship.find(n => n.label === newValue);
            if (selectedCitizenship) {
                setInputValues(selectedCitizenship.label);
                setSelectedValues(selectedCitizenship.value)
                props.handleDirectorsChange({ target: { value: selectedCitizenship.value } }, personIndex);
                setOnOpen(false);
            }
        } else {
            clearInputs();
        }
    };

    const handleInput = (event: any, newInputValue: any) => {
        setOnTyping(true);
        if (newInputValue !== null && newInputValue !== undefined) {
            setInputValues(newInputValue);
            const matchingOption = citizenship.find(n =>
                n.label.toLowerCase().startsWith(newInputValue.toLowerCase())
            )
            if (!matchingOption) {
                clearInputs();
            } else if (matchingOption && onTyping) {
                setInputValues(matchingOption.label);
            }
        }
    };

    const [Values, setValues] = useState(person?.Domicile || '');
    const [selectValues, setSelectValues] = useState(person?.Domicile || '');
    const [onOpens, setOnOpens] = useState(false);
    const [highlightValues, setHighlightValues] = useState(null);
    const [letTyping, setLetTyping] = useState(true)

    const inputClear = () => {
        setValues('');
        setSelectValues('');
        props.handleShareHoldersChange({ target: { value: '' } }, personIndex);
    };

    const handleChanged = (event: any, newValue: string) => {
        if (newValue) {
            const selectedDomicile = domicile.find(n => n.label === newValue);
            if (selectedDomicile) {
                setValues(selectedDomicile.label);
                setSelectValues(selectedDomicile.value);
                props.handleDirectorsChange({ target: { value: selectedDomicile.value } }, personIndex);
                setOnOpens(false);
            }
        } else {
            inputClear();
        }
    };

    const handleInputs = (event: any, newInputValue: any) => {
        setLetTyping(true);
        if (newInputValue !== null && newInputValue !== undefined) {
            setValues(newInputValue);
            const matchingOption = domicile.find(n =>
                n.label.toLowerCase().startsWith(newInputValue.toLowerCase())
            );
            if (!matchingOption) {
                inputClear();
            } else if (matchingOption && letTyping) {
                setValues(matchingOption.label);
            }
        }
    };

    const [input, setInput] = useState(person?.nationalitys || '');
    const [Value, setValue] = useState(person?.nationalitys || '');
    const [Open, setOpen] = useState(false);
    const [pointedValue, setPointedValue] = useState(null);
    const [isType, setIsType] = useState(true)

    const clearValue = () => {
        setInput('');
        setValue('');
        props.handleShareHoldersChange({ target: { value: '' } }, personIndex)
    };

    const handleSelectChanged = (event: any, newValue: string) => {
        if (newValue) {
            const selectedNationalitys = nationalitie.find(n => n.label === newValue);
            if (selectedNationalitys) {
                setInput(selectedNationalitys.label);
                setValue(selectedNationalitys.value)
                props.handleShareHoldersChange({ target: { value: selectedNationalitys.value } }, personIndex);
                setOpen(false);
            }
        }
    };

    const handleInputChanged = (event: any, newInputValue: any) => {
        setIsType(true);
        if (newInputValue !== null && newInputValue !== undefined) {
            setInput(newInputValue);
            const matchingOption = nationalitie.find(n =>
                n.label.toLowerCase().startsWith(newInputValue.toLowerCase())
            );
            if (!matchingOption) {
                clearValue();
            } else if (matchingOption && isType) {
                setInput(matchingOption.label)

            }
        }
    };

    const handleCombinedTabChanges = (event: any) => {
        if (event.key === 'Tab') {
            if (pointedValue) {
                const selectedNationalitys = nationalitie.find(n => n.label === pointedValue);
                if (selectedNationalitys) {
                    setValue(selectedNationalitys.value);
                    setInput(pointedValue);
                    props.handleShareHoldersChange({ target: { value: selectedNationalitys.value } }, personIndex);
                }
            }
            if (topValues) {
                const selectedCitizenships = citizenships.find(n => n.label === topValues);
                if (selectedCitizenships) {
                    setValueSelected(selectedCitizenships.value);
                    setValueInput(topValues);
                    props.handleShareHoldersChange({ target: { value: selectedCitizenships.value } }, personIndex);
                }
            }
            if (topedValues) {
                const selectedDomiciles = domiciles.find(n => n.label === topedValues);
                if (selectedDomiciles) {
                    setValueSelecteds(selectedDomiciles.value);
                    setValueInputs(topedValues);
                    props.handleShareHoldersChange({ target: { value: selectedDomiciles.value } }, personIndex);
                }
            }
            setOpen(false);
            setAtOpen(false);
            setAtOpens(false);
        }
    };

    const handleArrowDown = (event: any) => {
        if (event.key === 'Backspace') {
            clearValue();
            setPointedValue(null)
        }
        handleCombinedTabChanges(event)
    };

    const handleDownKey = (event: any) => {
        if (event.key === 'Backspace') {
            clearValues();
            setTopValues(null)
        }
        handleCombinedTabChanges(event)
    };

    const handleDown = (event: any) => {
        if (event.key === 'Backspace') {
            inputClears()
            setTopedValues(null)
        }
        handleCombinedTabChanges(event)
    };

    const [valueInput, setValueInput] = useState(person?.citizenships || '');
    const [valueSelected, setValueSelected] = useState(person?.citizenships || '');
    const [atOpen, setAtOpen] = useState(false);
    const [topValues, setTopValues] = useState(null);
    const [isTypes, setIsTypes] = useState(true);

    const clearValues = () => {
        setValueInput('');
        setValueSelected('');
        props.handleShareHoldersChange({ target: { value: '' } }, personIndex)
    };

    const handleChanges = (event: any, newValue: string) => {
        if (newValue) {
            const selectedCitizenships = citizenships.find(n => n.label === newValue);
            if (selectedCitizenships) {
                setValueInput(selectedCitizenships.label);
                setValueSelected(selectedCitizenships.value)
                props.handleShareHoldersChange({ target: { value: selectedCitizenships.value } }, personIndex);
                setAtOpen(false);
            }
        } else {
            clearValues();
        }
    };

    const handleInputed = (event: any, newInputValue: any) => {
        setIsTypes(true);
        if (newInputValue !== null && newInputValue !== undefined) {
            setValueInput(newInputValue);
            const matchingOption = citizenships.find(n =>
                n.label.toLowerCase().startsWith(newInputValue.toLowerCase())
            );
            if (!matchingOption) {
                clearValues();
            } else if (matchingOption && isTypes) {
                setValueInput(matchingOption.label)
            }
        }
    };

    const [valueInputs, setValueInputs] = useState(person?.Domiciles || '');
    const [valueSelecteds, setValueSelecteds] = useState(person?.Domiciles || '');
    const [atOpens, setAtOpens] = useState(false);
    const [topedValues, setTopedValues] = useState<string | null>(null);
    const [isTyped, setIsTyped] = useState(true);

    const inputClears = () => {
        setValueInputs('');
        setValueSelecteds('');
        props.handleShareHoldersChange({ target: { value: '' } }, personIndex);
    };

    const handleChanging = (event: any, newValue: string) => {
        if (newValue) {
            const selectedDomiciles = domiciles.find(n => n.label === newValue);
            if (selectedDomiciles) {
                setValueInputs(selectedDomiciles.label);
                setValueSelecteds(selectedDomiciles.value)
                props.handleShareHoldersChange({ target: { value: selectedDomiciles.value } }, personIndex);
                setAtOpens(false);
            }
        } else {
            inputClears();
        }
    };

    const handleInputValue = (event: any, newInputValue: any) => {
        setIsTyped(true)
        if (newInputValue !== null && newInputValue !== undefined) {
            setValueInputs(newInputValue);
            const matchingOption = domiciles.find(n =>
                n.label.toLowerCase().startsWith(newInputValue.toLowerCase())
            )
            if (!matchingOption) {
                inputClears();
            } else if (matchingOption && isTyped) {
                setValueInputs(matchingOption.label)
            }
        }
    };

    const handleShareHoldersChange = (event: any, index: number) => {
        const { name, value } = event.target;
        props.handleShareHoldersChange({ target: { name, value } }, index);
    };

    return (
        <Container style={{ width: "274mm", minHeight: "297mm", marginTop: "5%" }}>
            <div id="pdfContent">
                <Paper elevation={10} style={{ marginBottom: '20px' }}>
                    <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                        <div className="key p-3">
                            <h4>List of Directors</h4>
                            <div className="scrollablebox">
                                {props.directorsData.map((person: any, personIndex: any) => (
                                    <div key={personIndex} className="person-container">
                                        {props.directorsData.length > 1 && !hideAddBtn && (
                                            <div className="close-button" onClick={() => handleRemoveDirectorsdata(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="firstName"
                                                    label="Name"
                                                    size='small'
                                                    autoComplete='off'
                                                    variant="standard"
                                                    value={person.firstName}
                                                    onChange={(e) => props.handleDirectorsChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="middleName"
                                                    label="Middle Name"
                                                    size='small'
                                                    autoComplete='off'
                                                    variant="standard"
                                                    value={person.middleName}
                                                    onChange={(e) => props.handleDirectorsChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="lastName"
                                                    label="Last Name"
                                                    size='small'
                                                    autoComplete='off'
                                                    variant="standard"
                                                    value={person.lastName}
                                                    onChange={(e) => props.handleDirectorsChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="pan"
                                                    label="PAN"
                                                    size='small'
                                                    autoComplete='off'
                                                    variant="standard"
                                                    value={person.pan}
                                                    onChange={(e) => props.handleDirectorsChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    {/* <Autocomplete
                                                        fullWidth
                                                        open={isOpen}
                                                        onOpen={() => setIsOpen(true)}
                                                        onClose={() => setIsOpen(false)}
                                                        options={nationalities}
                                                        getOptionLabel={(option) => (typeof option === "string" ? option : String(option.label))}
                                                        value={nationalities.find((n) => n.value === person.nationality) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleDirectorsChange(
                                                                { target: { name: "nationality", value: newValue?.value || 0 } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Nationality"
                                                                variant="standard"
                                                                onKeyDown={handleKeyDown}
                                                                onFocus={() => setIsOpen(true)}
                                                            />
                                                        )}
                                                    /> */}
                                                    <Autocomplete
                                                        fullWidth
                                                        open={openNationalities[personIndex] || false}
                                                        onOpen={() => handleNationalityOpen(personIndex)}
                                                        onClose={() => handleNationalityClose(personIndex)}
                                                        options={nationalities}
                                                        getOptionLabel={(option) => (typeof option === "string" ? option : String(option.label))}
                                                        value={nationalities.find((n) => n.value === person.nationality) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleDirectorsChange(
                                                                { target: { name: "nationality", value: newValue?.value || 0 } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Nationality"
                                                                variant="standard"
                                                                onFocus={() => handleNationalityOpen(personIndex)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    <Autocomplete
                                                        fullWidth
                                                        // open={onOpen}
                                                        // onOpen={() => setOnOpen(true)}
                                                        // onClose={() => setOnOpen(false)}
                                                        open={openCitizenships[personIndex] || false}
                                                        onOpen={() => handleCitizenshipOpen(personIndex)}
                                                        onClose={() => handleCitizenshipClose(personIndex)}
                                                        options={citizenship}
                                                        getOptionLabel={(option) => (typeof option === "string" ? option : String(option.label))}
                                                        value={citizenship.find((c) => c.value === person.citizenship) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleDirectorsChange(
                                                                { target: { name: "citizenship", value: newValue?.value || 0 } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Citizenship"
                                                                variant="standard"
                                                                onKeyDown={handleKeysDown}
                                                                onFocus={() => handleCitizenshipOpen(personIndex)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    <Autocomplete
                                                        fullWidth
                                                        // open={onOpens}
                                                        // onOpen={() => setOnOpens(true)}
                                                        // onClose={() => setOnOpens(false)}
                                                        open={openDomiciles[personIndex] || false}
                                                        onOpen={() => handleDomicileOpen(personIndex)}
                                                        onClose={() => handleDomicileClose(personIndex)}
                                                        options={domicile}
                                                        getOptionLabel={(option) => (typeof option === "string" ? option : String(option.label))}
                                                        value={domicile.find((d) => d.value === person.domicile) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleDirectorsChange(
                                                                { target: { name: "domicile", value: newValue?.value || 0 } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Domicile"
                                                                variant="standard"
                                                                onKeyDown={handleKeyDowns}
                                                                // onFocus={() => setOnOpens(true)}
                                                                onFocus={() => handleDomicileOpen(personIndex)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="autocomplete-nationality"></InputLabel>
                                                    <Autocomplete
                                                        fullWidth
                                                        open={isOpen}
                                                        onOpen={() => setIsOpen(true)}
                                                        onClose={() => setIsOpen(false)}
                                                        options={nationalities.map((option) => option.label)}
                                                        value={inputValue}
                                                        onChange={handleSelectChange}
                                                        inputValue={inputValue}
                                                        onInputChange={handleInputChange}
                                                        onHighlightChange={(event, option) => {
                                                            if (option) {
                                                                setHighlightedValue(option);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Nationality"
                                                                variant="standard"
                                                                onKeyDown={handleKeyDown}
                                                                onFocus={() => setIsOpen(true)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="autocomplete-citizenship"></InputLabel>
                                                    <Autocomplete
                                                        fullWidth
                                                        open={onOpen}
                                                        onOpen={() => setOnOpen(true)}
                                                        onClose={() => setOnOpen(false)}
                                                        options={citizenship.map((option) => option.label)}
                                                        value={inputValues}
                                                        onChange={handleChange}
                                                        inputValue={inputValues}
                                                        onInputChange={handleInput}
                                                        onHighlightChange={(event, option) => {
                                                            if (option) {
                                                                setHighlightedValues(option);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Citizenship"
                                                                variant="standard"
                                                                onKeyDown={handleKeysDown}
                                                                onFocus={() => setOnOpen(true)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="contact-select"></InputLabel>
                                                    <Autocomplete
                                                        fullWidth
                                                        open={onOpens}
                                                        onOpen={() => setOnOpens(true)}
                                                        onClose={() => setOnOpens(false)}
                                                        options={domicile.map((option) => option.label)}
                                                        value={Values}
                                                        onChange={handleChanged}
                                                        inputValue={Values}
                                                        onInputChange={handleInputs}
                                                        onHighlightChange={(event, option) => {
                                                            if (option) {
                                                                setHighlightValues(option);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Domicile"
                                                                variant="standard"
                                                                onKeyDown={handleKeyDowns}
                                                                onFocus={() => setOnOpens(true)}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid> */}
                                        </Grid>
                                    </div>
                                ))}
                            </div>
                            <div className="button-container">
                                {!hideAddBtn && <Button
                                    className="add-people"
                                    variant="contained"
                                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                                    onClick={() => handleAddNewDirectorsList()}>
                                    Add New Directors List
                                </Button>
                                }
                            </div>
                        </div>
                        <div className="key mt-2 p-3">
                            <h4>List of ShareHolders</h4>
                            <div className="scrollablebox">
                                {/* {shareHolders.map((person: any, personIndex: any) => ( */}
                                {props.shareholdersData.map((person: any, personIndex: any) => (
                                    <div key={personIndex} className="person-container">
                                        {props.shareholdersData.length > 1 && !hideAddBtn && (
                                            <div className="close-button" onClick={() => handleRemoveShareHoldersData(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="firstName"
                                                    label="Name"
                                                    size='small'
                                                    autoComplete='off'
                                                    value={person.firstName}
                                                    variant="standard"
                                                    onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="middleName"
                                                    label="Middle Name"
                                                    size='small'
                                                    autoComplete='off'
                                                    value={person.middleName}
                                                    variant="standard"
                                                    onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="lastName"
                                                    label="Last Name"
                                                    size='small'
                                                    autoComplete='off'
                                                    value={person.lastName}
                                                    variant="standard"
                                                    onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name="pan"
                                                    label="PAN"
                                                    size='small'
                                                    autoComplete='off'
                                                    value={person.pan}
                                                    variant="standard"
                                                    onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    {/* <InputLabel htmlFor="autocomplete-nationality"></InputLabel>
                                                    <Autocomplete
                                                        fullWidth
                                                        open={Open}
                                                        onOpen={() => setOpen(true)}
                                                        onClose={() => setOpen(false)}
                                                        options={nationalitie.map((option) => option.label)}
                                                        value={input}
                                                        onChange={handleSelectChanged}
                                                        inputValue={input}
                                                        onInputChange={handleInputChanged}
                                                        onHighlightChange={(event, option) => {
                                                            if (option) {
                                                                setPointedValue(option);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Nationality"
                                                                variant="standard"
                                                                onKeyDown={handleArrowDown}
                                                                onFocus={() => setOpen(true)}
                                                            />
                                                        )}
                                                    /> */}
                                                    <Autocomplete
                                                        fullWidth
                                                        options={nationalitie}
                                                        getOptionLabel={(option) => option.label}
                                                        value={nationalitie.find((n) => n.value === person.nationality) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleShareHoldersChange(
                                                                { target: { name: "nationality", value: newValue?.value || "" } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => <TextField {...params} label="Nationality" variant="standard" />}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    {/* <InputLabel htmlFor="autocomplete-citizenship"></InputLabel>
                                                    <Autocomplete
                                                        fullWidth
                                                        open={atOpen}
                                                        onOpen={() => setAtOpen(true)}
                                                        onClose={() => setAtOpen(false)}
                                                        options={citizenships.map((option) => option.label)}
                                                        value={valueInput}
                                                        onChange={handleChanges}
                                                        inputValue={valueInput}
                                                        onInputChange={handleInputed}
                                                        onHighlightChange={(event, option) => {
                                                            if (option) {
                                                                setTopValues(option);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Citizenship"
                                                                variant="standard"
                                                                onKeyDown={handleDownKey}
                                                                onFocus={() => setAtOpen(true)}
                                                            />
                                                        )}
                                                    /> */}
                                                    <Autocomplete
                                                        fullWidth
                                                        options={citizenships}
                                                        getOptionLabel={(option) => option.label}
                                                        value={citizenships.find((c) => c.value === person.citizenship) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleShareHoldersChange(
                                                                { target: { name: "citizenship", value: newValue?.value || "" } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => <TextField {...params} label="Citizenship" variant="standard" />}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <FormControl variant="standard" fullWidth>
                                                    {/* <InputLabel htmlFor="contact-select"></InputLabel>
                                                    <Autocomplete
                                                        fullWidth
                                                        open={atOpens}
                                                        onOpen={() => setAtOpens(true)}
                                                        onClose={() => setAtOpens(false)}
                                                        options={domicile.map((option) => option.label)}
                                                        value={valueInputs}
                                                        onChange={handleChanging}
                                                        inputValue={valueInputs}
                                                        onInputChange={handleInputValue}
                                                        onHighlightChange={(event, option) => {
                                                            if (option) {
                                                                setTopedValues(option);
                                                            }
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Domicile"
                                                                variant="standard"
                                                                onKeyDown={handleDown}
                                                                onFocus={() => setAtOpens(true)}
                                                            />
                                                        )}
                                                    /> */}
                                                    <Autocomplete
                                                        fullWidth
                                                        options={domiciles}
                                                        getOptionLabel={(option) => option.label}
                                                        value={domiciles.find((d) => d.value === person.domicile) || null}
                                                        onChange={(event, newValue) =>
                                                            props.handleShareHoldersChange(
                                                                { target: { name: "domicile", value: newValue?.value || "" } },
                                                                personIndex
                                                            )
                                                        }
                                                        renderInput={(params) => <TextField {...params} label="Domicile" variant="standard" />}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </div>
                                ))}
                            </div>
                            <div className="button-container">
                                {!hideAddBtn && <Button
                                    className="add-people"
                                    variant="contained"
                                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                                    onClick={() => handleAddNewShareholdersList()}>
                                    Add ShareHolders Details
                                </Button>}
                            </div>
                        </div>
                        {props.signAuthorityData.map((person: any, personIndex: any) => (
                            <div key={personIndex}>
                                <Typography variant="body1" paragraph align="right">
                                    Authorized Signatory(ies)
                                </Typography>
                                <Typography variant="body1" paragraph align="right">
                                    <TextField
                                        name="name"
                                        size="small"
                                        variant="standard"
                                        autoComplete="off"
                                        value={person.name}
                                        onChange={(event) => {
                                            props.handleSignAuthorityChange(event, personIndex);
                                            if (nameError && personIndex === 0) {
                                                setNameError('');
                                            }
                                        }}
                                        placeholder="Name"
                                        required
                                        error={Boolean(nameError && personIndex === 0)}
                                        helperText={personIndex === 0 ? nameError : ''}
                                    />
                                </Typography>
                                <Typography variant="body1" paragraph align="right">
                                    <TextField
                                        name="designation"
                                        size="small"
                                        variant="standard"
                                        autoComplete="off"
                                        value={person.designation}
                                        onChange={(event) => {
                                            props.handleSignAuthorityChange(event, personIndex);
                                            if (designationError && personIndex === 0) {
                                                setDesignationError('');
                                            }
                                        }}
                                        placeholder="Designation"
                                        required
                                        error={Boolean(designationError && personIndex === 0)}
                                        helperText={personIndex === 0 ? designationError : ''}
                                    />
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
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}></div>
                </Paper>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 1:</span>
                </div>
                <button style={{ width: '12%' }} className='btn btn-primary' disabled={hideAddBtn} onClick={handleSubmit}>
                    Save
                </button>
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 2:</span>
                </div>
                <button style={{ width: '12%' }} className={`btn btn-sm ${saveClicked ? 'btn-primary' : 'btn-secondary'}`} disabled={!saveClicked} onClick={handleDownload}>Download</button>
            </div>
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

            {/* Pdf part */}
            <Dialog open={showPdfModal} onClose={handleClosePdfModal} maxWidth="md">
                {loading && <Loader />}
                <DialogTitle>PDF Preview
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfModal}
                        style={{ position: "absolute", right: 8, top: 8, color: "#aaa" }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    dividers={true}
                    style={{
                        overflow: "auto",
                        padding: 0,
                        margin: 0,
                        maxHeight: "85vh",
                    }}>
                    {pdfData.base64 && (
                        <div
                            style={{
                                border: "1px solid #e0e0e0",
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <Document
                                file={`data:application/pdf;base64,${pdfData.base64}`}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="pdf-document"
                            >
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div
                                        key={`page_${index + 1}`}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            height: 'auto',
                                            margin: '10px 0',
                                        }}
                                    >
                                        <Page
                                            pageNumber={index + 1}
                                            width={Math.min(window.innerWidth * 0.8, 650)}
                                            renderMode="canvas"
                                            scale={1.3}
                                            renderTextLayer={true}
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
                        <div style={{ marginRight: '15px' }}>
                            <a
                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                download={pdfData.filename}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    textDecoration: 'none',
                                    padding: '10px',
                                    backgroundColor: '#2a75bb',
                                    color: 'white',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    float: 'right',
                                }}
                            >
                                Download PDF
                            </a>
                        </div>
                    )}
                </DialogActions>
            </Dialog>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 3:</span>
                </div>
                <form onSubmit={Signonupload} style={{ width: '11%' }}>
                    <button style={{ width: '109%', marginLeft: '-1%' }}
                        className={`btn btn-sm ${downlodClicked ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={!downlodClicked}>Sign on upload</button>
                </form>
                {loading && <Loader />}
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 4:</span>
                </div>
                <button style={{ width: '12%' }} className={`btn btn-sm ${signUploadBtnClicked ? 'btn-primary' : 'btn-secondary'}`} disabled={!signUploadBtnClicked} onClick={handleView}>View</button>
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="arroww" style={{ marginRight: '10px' }}>
                    <span style={{ textAlign: 'center' }}>Step 5:</span>
                </div>
                <button style={{ width: '12%' }} className={`btn btn-sm ${viewBtnClicked ? 'btn-primary' : 'btn-secondary'}`} disabled={!viewBtnClicked} onClick={handleSubmit}>Submit</button>
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
        </Container>
    );
}

export default ListOfBoardDirector;

// import React, { useState, useEffect } from 'react';
// import { Typography, TextField, Button, Grid, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Container } from '@mui/material';
// import './Form.css';
// import './pdf.css';
// import MuiAlert from '@mui/material/Alert';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
// import DocumentApiService from '../../../data/services/document/Document_api_service';
// import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
// import { Paper } from '@mui/material';
// import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
// import { NewPayload } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { Document, Page } from 'react-pdf';
// import { useParams } from 'react-router-dom';
// import CloseIcon from '@mui/icons-material/Close';
// import { pdfjs } from 'react-pdf';
// import Loader from '../../loader/loader';
// import { useSelector } from 'react-redux';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// interface Image {
//     name: string;
//     uploading: boolean;
//     uploadSuccess: boolean;
// };

// interface Director {
//     name: string;
//     firstName: string;
//     middleName: string;
//     lastName: string;
//     pan: string;
//     nationality: string;
//     citizenship: string;
//     domicile: string;
// };

// interface ShareHolder {
//     firstName: string;
//     middleName: string;
//     lastName: string;
//     pan: string;
//     nationality: string;
//     citizenship: string;
//     domicile: string;
// };

// const initialDirectorsData: Director[] = [];

// const ListOfBoardDirector = (props: any) => {

//     const initialImageState: Image = {
//         name: '',
//         uploading: false,
//         uploadSuccess: false,
//     };

//     const [images, setImages] = useState<Image[]>([initialImageState]);
//     const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
//     const [base64Images, setBase64Images] = useState<string | null>(null);
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [isErrorOpen, setIsErrorOpen] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//     const [showImageModal, setShowImageModal] = useState(false);
//     const [showPdfModal, setShowPdfModal] = useState(false);
//     const [base64Image, setBase64Image] = useState<string | null>(null);
//     const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({ base64: null, filename: null });
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [numPages, setNumPages] = useState<number | null>(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const customerApiService = new DocumentApiService();
//     const documentApiService = new DocumentApiService();
//     const applicationFormApiSevice = new ApplicationfromeService();
//     const [name, setAuthorizeName] = useState('');
//     const [designation, setAuthorizeDesignation] = useState('');
//     const [hideAddBtn, setHideAddBtn] = useState(false);
//     const [saveClicked, setSaveClicked] = useState(false);
//     const [downlodClicked, setDownlodClicked] = useState(false);
//     const [signUploadBtnClicked, setSignUploadBtnClicked] = useState(false);
//     const [viewBtnClicked, setViewBtnClicked] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [nameError, setNameError] = useState('');
//     const [designationError, setDesignationError] = useState('');
//     const [pdfRendered, setPdfRendered] = useState(false);
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     console.log('Declaration loginDetails uid:', loginDetails);
//     const [directors, setDirectors] = useState<Director[]>([]);
//     const [shareHolders, setShareHolder] = useState<ShareHolder[]>([]);
//     const [directorsState, setDirectorsState] = useState<Director[]>(directors);
//     const [shareHoldersState, setShareHoldersState] = useState<ShareHolder[]>(shareHolders);

//     const responseId = sessionStorage.getItem('responseId');
//     console.log('ApplicationForm responseId:', responseId);

//     useEffect(() => {
//         if (responseId) {
//             console.log(responseId.toString());
//         }
//     }, [responseId]);

//     const { kycId } = useParams<{ kycId: any }>();

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
//         const savedName = sessionStorage.getItem('authorizeName');
//         const savedDesignation = sessionStorage.getItem('authorizeDesignation');
//         if (savedName) {
//             setAuthorizeName(savedName);
//         }
//         if (savedDesignation) {
//             setAuthorizeDesignation(savedDesignation);
//         }
//     }, []);

//     useEffect(() => {
//         handleDirectors(responseId);
//         handleShareHolder(responseId);
//     }, [responseId]);

//     useEffect(() => {
//         console.log('Props Directors:', directors);
//         console.log('Props ShareHolders:', shareHolders);
//         setDirectorsState(directors);
//         setShareHoldersState(shareHolders);
//     }, [directors, shareHolders]);

//     const handleDirectors = async (responseId: any) => {
//         try {
//             const response = await applicationFormApiSevice.getKycDirectorsList(responseId);
//             console.log('handleDirectors response:', response);
//             setDirectors(response);
//         } catch (error) {
//             console.error("Error fetching handleDirectors:", error);
//         }
//     };

//     const handleShareHolder = async (responseId: any) => {
//         try {
//             const response = await applicationFormApiSevice.getKycShareHolder(responseId);
//             console.log('handleShareHolder details response:', response);
//             setShareHolder(response);
//         } catch (error) {
//             console.error("Error fetching handleShareHolder:", error);
//         }
//     };

//     const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setAuthorizeName(value);
//         sessionStorage.setItem('authorizeName', value);
//     };

//     const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setAuthorizeDesignation(value);
//         sessionStorage.setItem('authorizeDesignation', value);
//     };

//     const handleAddNewDirectorsList = () => {
//         props.handleDirectorsChange(null, null, true);
//     };

//     const handleAddNewShareholdersList = () => {
//         props.handleShareHoldersChange(null, null, true);
//     };

//     const handleRemoveDirectorsdata = (personIndex: number) => {
//         props.handleDirectorsChange(null, personIndex, true);
//     };

//     const handleRemoveShareHoldersData = (personIndex: number) => {
//         props.handleShareHoldersChange(null, personIndex, true);
//     };

//     const handleSubmit = async () => {
//         let valid = true;
//         setNameError('');
//         setDesignationError('');
//         const responseId = sessionStorage.getItem('responseId');
//         const validResponseId = responseId ? Number(responseId) : props.kycId;
//         if (!validResponseId) {
//             console.error('No valid responseId or kycId found');
//             return;
//         }
//         const invalidSignatories = props.signAuthorityData.filter(
//             (person: { name: string; designation: string }) => !person.name || !person.designation
//         );
//         if (invalidSignatories.length > 0) {
//             console.error('Name and designation are required fields for all signatories');
//             if (!invalidSignatories[0].name) {
//                 setNameError('Name is required');
//             }
//             if (!invalidSignatories[0].designation) {
//                 setDesignationError('Designation is required');
//             }
//             valid = false;
//         }
//         if (!valid) {
//             return;
//         }
//         try {
//             setLoading(true);
//             const directorsPayload = props.directorsData.map((person: any) => ({
//                 ...person,
//                 responseId: validResponseId,
//                 kycId: validResponseId,
//                 uid: loginDetails.id,
//             }));
//             const shareholdersPayload = props.shareholdersData.map((person: any) => ({
//                 ...person,
//                 responseId: validResponseId,
//                 kycId: validResponseId,
//                 uid: loginDetails.id,
//             }));
//             const payload: NewPayload = {
//                 createDirectorsSignAuthorityRequests: {
//                     id: 0,
//                     kycId: validResponseId,
//                     name: props.signAuthorityData.map((person: { name: any; }) => person.name).join(', '),
//                     designation: props.signAuthorityData.map((person: { designation: any; }) => person.designation).join(', '),
//                     uid: loginDetails.id,
//                     euid: 0,
//                 },
//                 createDirectorsListRequest: [...directorsPayload, ...shareholdersPayload],
//             };
//             const response = await applicationFormApiSevice.Directorslist(payload);
//             console.log('API Response:', response);
//             if (response && response.id) {
//                 console.log('Submission successful', response);
//                 setHideAddBtn(true);
//                 props.renderKycdocumentContent();
//                 showSuccessMessage('List of Board Directors unblocked successfully.');
//                 setSaveClicked(true);
//             } else {
//                 throw new Error('Unexpected response format');
//             }
//         } catch (error) {
//             console.error('Error submitting data', error);
//             setHideAddBtn(false);
//             setSaveClicked(false);
//             showErrorMessage('Failed to submit the list. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmits = async () => {
//         showSuccessMessage('List of Board Directors unblocked successfully.');
//     };

//     const [downloadingPDF, setDownloadingPDF] = useState(false);
//     const [errors, setErrors] = useState<string[]>([]);
//     const [downloadCount, setDownloadCount] = useState(0);
//     const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
//     const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);

//     const handleDownload = async () => {
//         setDownloadingPDF(true);
//         try {
//             setLoading(true);
//             await new Promise(resolve => setTimeout(resolve, 0));
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const content = document.getElementById('pdfContent');
//             if (!content) return;
//             const fontSizeInPoints = 11;
//             pdf.setFontSize(fontSizeInPoints);
//             pdf.setFont('helvetica');
//             const padding = 10;
//             const scale = 5;
//             const pageWidth = 210;
//             const pageHeight = 180;
//             const contentWidth = pageWidth - 2 * padding;
//             const contentHeight = pageHeight - 2 * padding;
//             const totalPages = content.childNodes.length;
//             for (let i = 0; i < totalPages; i++) {
//                 const page = content.childNodes[i];
//                 const canvas = await html2canvas(page as HTMLElement, {
//                     scale: scale,
//                     useCORS: true,
//                     logging: true,
//                 });
//                 const imgData = canvas.toDataURL('image/png');
//                 if (i > 0) pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight);
//                 pdf.setLineWidth(0.2);
//                 pdf.setDrawColor(0, 0, 0);
//                 pdf.rect(padding, padding, contentWidth, contentHeight);
//             }
//             // pdf.save('Director_form.pdf');
//             pdf.save('director_form.pdf');
//             setDownlodClicked(true);
//             showSuccessMessage('Download successfully.');
//         } catch (error) {
//             setDownlodClicked(false);
//             setErrors(["Error generating PDF"]);
//         } finally {
//             const content = document.getElementById('pdfContent');
//             setDownloadingPDF(false);
//             setDownlodClicked(true);
//             setDownloadCount(prevCount => prevCount + 1);
//             setLoading(false);
//         }
//         setIsLevelcasedetailsOpen(true);
//         setIsUploadSectionOpen(false);
//     };

//     useEffect(() => {
//         if (responseId) {
//             console.log('responseId11:', responseId);
//         }
//     }, [responseId]);

//     const handleView = async () => {
//         console.log('handleView called');
//         setLoading(true);
//         try {
//             const responseId = sessionStorage.getItem('responseId');
//             if (!responseId) {
//                 console.error('No responseId found in session storage');
//                 setLoading(false);
//                 return;
//             }
//             const pdfData = await customerApiService.getkycPDF(responseId, 3);
//             if (pdfData && pdfData.data) {
//                 setPdfData({ base64: pdfData.data, filename: "director_form.pdf" });
//                 setPdfRendered(false);
//                 setShowPdfModal(true);
//             } else {
//                 setErrorMessage("No PDF available");
//             }
//             setViewBtnClicked(true);
//             console.log('PDF modal set to open');
//         } catch (error) {
//             console.error('Error fetching PDF:', error);
//             setPdfData({ base64: null, filename: null });
//             setErrorMessage("No PDF available");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//         console.log('Document loaded with', numPages, 'pages');
//         setNumPages(numPages);
//     };

//     const handleCloseImageModal = () => {
//         setShowImageModal(false);
//     };

//     const handleClosePdfModal = () => {
//         setShowPdfModal(false);
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

//     const Signonupload = async (event: any) => {
//         event.preventDefault();
//         try {
//             setLoading(true);
//             const responseId = sessionStorage.getItem('responseId');
//             if (!responseId) {
//                 console.error('No responseId found in session storage');
//                 return;
//             }
//             const documentTypeId = 3;
//             const uid = loginDetails.id;
//             console.log('Submitting files:', selectedFiles);
//             await documentApiService.saveFormCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
//             setSignUploadBtnClicked(true);
//             showSuccessMessage('Signonupload added successfully.');
//         } catch (error) {
//             setSignUploadBtnClicked(false);
//             console.error('Error submitting files:', error);
//         } finally {
//             setLoading(false);
//             setIsUploadSectionOpen(false);
//         }
//     };

//     const [imageURL, setImageURL] = useState('');

//     useEffect(() => {
//         const handleImageClick = async (branchId: number) => {
//             if (branchId) {
//                 try {
//                     const branchId = 1;
//                     const imageData = await customerApiService.getLetterHead(branchId);
//                     const base64String = arrayBufferToBase64(imageData);
//                     setImageURL(base64String);
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
//         <Container style={{ width: "274mm", minHeight: "297mm", marginTop: "5%" }}>
//             <div id="pdfContent">
//                 <Paper elevation={10} style={{ marginBottom: '20px' }}>
//                     <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
//                         <div className="key p-3">
//                             <h4>List of Directors</h4>
//                             <div className="scrollablebox">
//                                 {props.directorsData.map((person: any, personIndex: any) => (
//                                     <div key={personIndex} className="person-container">
//                                         {props.directorsData.length > 1 && !hideAddBtn && (
//                                             <div className="close-button" onClick={() => handleRemoveDirectorsdata(personIndex)}>
//                                                 <FontAwesomeIcon icon={faTimes} />
//                                             </div>
//                                         )}
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="firstName"
//                                                     label="Name"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     variant="standard"
//                                                     value={person.firstName}
//                                                     onChange={(e) => props.handleDirectorsChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="middleName"
//                                                     label="Middle Name"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     variant="standard"
//                                                     value={person.middleName}
//                                                     onChange={(e) => props.handleDirectorsChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="lastName"
//                                                     label="Last Name"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     variant="standard"
//                                                     value={person.lastName}
//                                                     onChange={(e) => props.handleDirectorsChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="pan"
//                                                     label="PAN"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     variant="standard"
//                                                     value={person.pan}
//                                                     onChange={(e) => props.handleDirectorsChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <FormControl variant="standard" fullWidth>
//                                                     <InputLabel htmlFor="contact-select">Nationality</InputLabel>
//                                                     <Select
//                                                         fullWidth
//                                                         name="nationality"
//                                                         label="Nationality"
//                                                         size='small'
//                                                         value={person.nationality}
//                                                         variant="standard"
//                                                         onChange={(e) => props.handleDirectorsChange(e as SelectChangeEvent<string>, personIndex)}
//                                                     >
//                                                         <MenuItem value="">Select the Nationality</MenuItem>
//                                                         <MenuItem value="1">American</MenuItem>
//                                                         <MenuItem value="2">Canadian</MenuItem>
//                                                         <MenuItem value="3">Indian</MenuItem>
//                                                         <MenuItem value="4">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <FormControl variant="standard" fullWidth>
//                                                     <InputLabel htmlFor="contact-select">Citizenship</InputLabel>
//                                                     <Select
//                                                         fullWidth
//                                                         name="citizenship"
//                                                         label="Citizenship"
//                                                         size='small'
//                                                         value={person.citizenship}
//                                                         variant="standard"
//                                                         onChange={(e) => props.handleDirectorsChange(e as SelectChangeEvent<string>, personIndex)}
//                                                     >
//                                                         <MenuItem value="">Select the Citizenship</MenuItem>
//                                                         <MenuItem value="1">American</MenuItem>
//                                                         <MenuItem value="2">Canadian</MenuItem>
//                                                         <MenuItem value="3">Indian</MenuItem>
//                                                         <MenuItem value="4">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <FormControl variant="standard" fullWidth>
//                                                     <InputLabel htmlFor="contact-select">Domicile</InputLabel>
//                                                     <Select
//                                                         fullWidth
//                                                         name="domicile"
//                                                         label="Domicile"
//                                                         size='small'
//                                                         value={person.domicile}
//                                                         variant="standard"
//                                                         onChange={(e) => props.handleDirectorsChange(e as SelectChangeEvent<string>, personIndex)}
//                                                     >
//                                                         <MenuItem value="">Select the Domicile</MenuItem>
//                                                         <MenuItem value="1">American</MenuItem>
//                                                         <MenuItem value="2">Canadian</MenuItem>
//                                                         <MenuItem value="3">Indian</MenuItem>
//                                                         <MenuItem value="4">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                         </Grid>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="button-container">
//                                 {!hideAddBtn && <Button
//                                     className="add-people"
//                                     variant="contained"
//                                     startIcon={<FontAwesomeIcon icon={faPlus} />}
//                                     onClick={() => handleAddNewDirectorsList()}>
//                                     Add Directors Details
//                                 </Button>
//                                 }
//                             </div>
//                         </div>
//                         <div className="key mt-2 p-3">
//                             <h4>List of ShareHolders</h4>
//                             <div className="scrollablebox">
//                                 {props.shareholdersData.map((person: any, personIndex: any) => (
//                                     <div key={personIndex} className="person-container">
//                                         {props.shareholdersData.length > 1 && !hideAddBtn && (
//                                             <div className="close-button" onClick={() => handleRemoveShareHoldersData(personIndex)}>
//                                                 <FontAwesomeIcon icon={faTimes} />
//                                             </div>
//                                         )}
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="firstName"
//                                                     label="Name"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     value={person.firstName}
//                                                     variant="standard"
//                                                     onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="middleName"
//                                                     label="Middle Name"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     value={person.middleName}
//                                                     variant="standard"
//                                                     onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="lastName"
//                                                     label="Last Name"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     value={person.lastName}
//                                                     variant="standard"
//                                                     onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <TextField
//                                                     fullWidth
//                                                     name="pan"
//                                                     label="PAN"
//                                                     size='small'
//                                                     autoComplete='off'
//                                                     value={person.pan}
//                                                     variant="standard"
//                                                     onChange={(e) => props.handleShareHoldersChange(e, personIndex)}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <FormControl variant="standard" fullWidth>
//                                                     <InputLabel htmlFor="contact-select">Nationality</InputLabel>
//                                                     <Select
//                                                         fullWidth
//                                                         name="nationality"
//                                                         label="Nationality"
//                                                         size="small"
//                                                         autoComplete="off"
//                                                         value={person.nationality}
//                                                         variant="standard"
//                                                         onChange={(e) => props.handleShareHoldersChange(e as SelectChangeEvent<string>, personIndex)}>
//                                                         <MenuItem value="">Select the Nationality</MenuItem>
//                                                         <MenuItem value="1">American</MenuItem>
//                                                         <MenuItem value="2">Canadian</MenuItem>
//                                                         <MenuItem value="3">Indian</MenuItem>
//                                                         <MenuItem value="4">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <FormControl variant="standard" fullWidth>
//                                                     <InputLabel htmlFor="contact-select">Citizenship</InputLabel>
//                                                     <Select
//                                                         fullWidth
//                                                         name="citizenship"
//                                                         label="Citizenship"
//                                                         size="small"
//                                                         value={person.citizenship}
//                                                         variant="standard"
//                                                         onChange={(e) => props.handleShareHoldersChange(e as SelectChangeEvent<string>, personIndex)}>
//                                                         <MenuItem value="">Select the Citizenship</MenuItem>
//                                                         <MenuItem value="1">American</MenuItem>
//                                                         <MenuItem value="2">Canadian</MenuItem>
//                                                         <MenuItem value="3">Indian</MenuItem>
//                                                         <MenuItem value="4">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={3}>
//                                                 <FormControl variant="standard" fullWidth>
//                                                     <InputLabel htmlFor="contact-select">Domicile</InputLabel>
//                                                     <Select
//                                                         fullWidth
//                                                         name="domicile"
//                                                         label="Domicile"
//                                                         size="small"
//                                                         value={person.domicile}
//                                                         variant="standard"
//                                                         onChange={(e) => props.handleShareHoldersChange(e as SelectChangeEvent<string>, personIndex)}>
//                                                         <MenuItem value="">Select the Domicile</MenuItem>
//                                                         <MenuItem value="1">American</MenuItem>
//                                                         <MenuItem value="2">Canadian</MenuItem>
//                                                         <MenuItem value="3">Indian</MenuItem>
//                                                         <MenuItem value="4">Other</MenuItem>
//                                                     </Select>
//                                                 </FormControl>
//                                             </Grid>
//                                         </Grid>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="button-container">
//                                 {!hideAddBtn && <Button
//                                     className="add-people"
//                                     variant="contained"
//                                     startIcon={<FontAwesomeIcon icon={faPlus} />}
//                                     onClick={() => handleAddNewShareholdersList()}>
//                                     Add ShareHolders Details
//                                 </Button>}
//                             </div>
//                         </div>
//                         {props.signAuthorityData.map((person: any, personIndex: any) => (
//                             <div key={personIndex}>
//                                 <Typography variant="body1" paragraph align="right">
//                                     Authorized Signatory(ies)
//                                 </Typography>
//                                 <Typography variant="body1" paragraph align="right">
//                                     <TextField
//                                         name="name"
//                                         size="small"
//                                         variant="standard"
//                                         autoComplete="off"
//                                         value={person.name}
//                                         onChange={(event) => {
//                                             props.handleSignAuthorityChange(event, personIndex);
//                                             if (nameError && personIndex === 0) {
//                                                 setNameError('');
//                                             }
//                                         }}
//                                         placeholder="Name"
//                                         required
//                                         error={Boolean(nameError && personIndex === 0)}
//                                         helperText={personIndex === 0 ? nameError : ''}
//                                     />
//                                 </Typography>
//                                 <Typography variant="body1" paragraph align="right">
//                                     <TextField
//                                         name="designation"
//                                         size="small"
//                                         variant="standard"
//                                         autoComplete="off"
//                                         value={person.designation}
//                                         onChange={(event) => {
//                                             props.handleSignAuthorityChange(event, personIndex);
//                                             if (designationError && personIndex === 0) {
//                                                 setDesignationError('');
//                                             }
//                                         }}
//                                         placeholder="Designation"
//                                         required
//                                         error={Boolean(designationError && personIndex === 0)}
//                                         helperText={personIndex === 0 ? designationError : ''}
//                                     />
//                                 </Typography>
//                                 <Typography variant="body1" paragraph align="right">
//                                     (Name & Designation)
//                                 </Typography>
//                                 <Typography variant="body1" paragraph align="right">
//                                     (With Stamp)
//                                 </Typography>
//                             </div>
//                         ))}
//                         <br></br>
//                     </div>
//                     <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}></div>
//                 </Paper>
//             </div>

//             <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <div className="arroww" style={{ marginRight: '10px' }}>
//                     <span style={{ textAlign: 'center' }}>Step 1:</span>
//                 </div>
//                 <button style={{ width: '12%' }} className='btn btn-primary' disabled={hideAddBtn} onClick={handleSubmit}>
//                     Save
//                 </button>
//             </div>

//             <br></br>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <div className="arroww" style={{ marginRight: '10px' }}>
//                     <span style={{ textAlign: 'center' }}>Step 2:</span>
//                 </div>
//                 <button style={{ width: '12%' }} className={`btn btn-sm ${saveClicked ? 'btn-primary' : 'btn-secondary'}`} disabled={!saveClicked} onClick={handleDownload}>Download</button>
//                 {loading && <Loader />}
//             </div>
//             {isLevelcasedetailsOpen && (
//                 <Grid container spacing={1}>
//                     <Grid item xs={12}>
//                         <Grid container spacing={1}>
//                             {images.map((image, index) => (
//                                 <Grid item xs={12} key={index}>
//                                     <form onSubmit={handleSubmits} encType="multipart/form-data">
//                                         <div className="person-container">
//                                             <div className="field-group">
//                                                 <div className="field-group-column">
//                                                     <input
//                                                         type="file"
//                                                         id={`image-upload-input1-${index}`}
//                                                         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                                         onChange={(event) => {
//                                                             handleFileChange(event);
//                                                             handleFileChange4(index, event);
//                                                         }}
//                                                         style={{ display: 'none' }}
//                                                         multiple
//                                                     />
//                                                     <Button
//                                                         variant="outlined"
//                                                         onClick={() => handleChooseImagesClick1(index)}
//                                                         style={{ marginRight: '10px' }}
//                                                     >
//                                                         Document
//                                                     </Button>
//                                                     <TextField style={{ width: '50%' }}
//                                                         label="Attachment"
//                                                         type="text"
//                                                         size="small"
//                                                         variant="outlined"
//                                                         value={image.name}
//                                                         disabled
//                                                         fullWidth
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             )}
//             <Dialog open={showImageModal} onClose={handleCloseImageModal} fullWidth maxWidth='xl'>
//                 <DialogTitle>Image Preview</DialogTitle>
//                 <DialogContent>
//                     {base64Image && <img src={base64Image} alt="Image Preview" />}
//                     {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseImageModal}>Close</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Pdf part */}
//             <Dialog open={showPdfModal} onClose={handleClosePdfModal} maxWidth="md">
//                 {loading && <Loader />}
//                 <DialogTitle>PDF Preview
//                     <IconButton
//                         aria-label="close"
//                         onClick={handleClosePdfModal}
//                         style={{ position: "absolute", right: 8, top: 8, color: "#aaa" }}>
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent
//                     dividers={true}
//                     style={{
//                         overflow: "auto",
//                         padding: 0,
//                         margin: 0,
//                         maxHeight: "85vh",
//                     }}>
//                     {pdfData.base64 && (
//                         <div
//                             style={{
//                                 border: "1px solid #e0e0e0",
//                                 padding: 0,
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 width: '100%',
//                                 overflow: 'hidden',
//                             }}
//                         >
//                             <Document
//                                 file={`data:application/pdf;base64,${pdfData.base64}`}
//                                 onLoadSuccess={onDocumentLoadSuccess}
//                                 className="pdf-document"
//                             >
//                                 {Array.from(new Array(numPages), (el, index) => (
//                                     <div
//                                         key={`page_${index + 1}`}
//                                         style={{
//                                             display: "flex",
//                                             justifyContent: "center",
//                                             overflow: "hidden",
//                                             height: 'auto',
//                                             margin: '10px 0',
//                                         }}
//                                     >
//                                         <Page
//                                             pageNumber={index + 1}
//                                             width={Math.min(window.innerWidth * 0.8, 650)}
//                                             renderMode="canvas"
//                                             scale={1.3}
//                                             renderTextLayer={true}
//                                             renderAnnotationLayer={false}
//                                             imageResourcesPath=""
//                                         />
//                                     </div>
//                                 ))}
//                             </Document>
//                         </div>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     {pdfData.filename && (
//                         <div style={{ marginRight: '15px' }}>
//                             <a
//                                 href={`data:application/pdf;base64,${pdfData.base64}`}
//                                 download={pdfData.filename}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 style={{
//                                     textDecoration: 'none',
//                                     padding: '10px',
//                                     backgroundColor: '#2a75bb',
//                                     color: 'white',
//                                     borderRadius: '5px',
//                                     cursor: 'pointer',
//                                     float: 'right',
//                                 }}
//                             >
//                                 Download PDF
//                             </a>
//                         </div>
//                     )}
//                 </DialogActions>
//             </Dialog>
//             <br></br>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <div className="arroww" style={{ marginRight: '10px' }}>
//                     <span style={{ textAlign: 'center' }}>Step 3:</span>
//                 </div>
//                 <form onSubmit={Signonupload} style={{ width: '11%' }}>
//                     <button style={{ width: '109%', marginLeft: '-1%' }}
//                         className={`btn btn-sm ${downlodClicked ? 'btn-primary' : 'btn-secondary'}`}
//                         disabled={!downlodClicked}>Sign on upload</button>
//                 </form>
//                 {loading && <Loader />}
//             </div>
//             <br></br>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <div className="arroww" style={{ marginRight: '10px' }}>
//                     <span style={{ textAlign: 'center' }}>Step 4:</span>
//                 </div>
//                 <button style={{ width: '12%' }} className={`btn btn-sm ${signUploadBtnClicked ? 'btn-primary' : 'btn-secondary'}`} disabled={!signUploadBtnClicked} onClick={handleView}>View</button>
//             </div>
//             <br></br>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <div className="arroww" style={{ marginRight: '10px' }}>
//                     <span style={{ textAlign: 'center' }}>Step 5:</span>
//                 </div>
//                 <button style={{ width: '12%' }} className={`btn btn-sm ${viewBtnClicked ? 'btn-primary' : 'btn-secondary'}`} disabled={!viewBtnClicked} onClick={handleSubmit}>Submit</button>
//             </div>
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
//         </Container>
//     );
// }

// export default ListOfBoardDirector;