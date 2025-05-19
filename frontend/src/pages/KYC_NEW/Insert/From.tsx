import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, TextField, Button, Grid, Card, Snackbar, IconButton } from '@mui/material';
import './Form.css';
import MuiAlert from '@mui/material/Alert';
import Header from '../../../layouts/header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DocumentApiService from '../../../data/services/document/Document_api_service';
import { SelectChangeEvent } from '@mui/material';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { kycForm, CreateData, DeclarationFrom, QuestionType, CreateDirectorsSignAuthorityRequest } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import Letter from './Letter';
import { saveQuestionnaire } from './state/save-application-action';
import Declaration from './Declaration';
import ListOfBoardDirector from './ListOfBoardDirector';
import ApplicationForm from '../../KYC_NEW/Insert/ApplicationForm';
import Loader from '../../loader/loader';
import { removeQuestionnaire } from '../../kyc/Insert/state/save-application-action';

interface SectionProps {
    formData?: any;
    questionData?: any;
    declarationData?: any;
    handleInputChange?: (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    renderDeclarationContent?: any;
};

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

function Letterhead({ formData, handleInputChange }: SectionProps) {
    return (
        <Box mt={2}>
            <Letter />
        </Box>
    );
};

interface CustomerData {
    kycFormDto: kycForm;
};

function KYCDocument({ formData: any, handleInputChange }: SectionProps) {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const documentApiService = new DocumentApiService();

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const [images, setImages] = useState<Image[]>([initialImageState]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<kycForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const applicationfrome = new ApplicationfromeService();
    const responseId = sessionStorage.getItem('responseId');
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
    const [kycId, setKycId] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (responseId) {
            fetchData(responseId.toString());
        }
    }, [responseId]);

    const fetchData = async (responseId: string) => {
        try {
            setLoading(true);
            const response = await applicationfrome.getkycData(responseId);
            const customerData: CustomerData[] = response;
            setFormData(customerData.map((data: CustomerData) => data.kycFormDto));
        } catch (error) {
            setErrors(["Error fetching data"]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setErrorMessage(null);
            const filesArray = Array.from(event.target.files);
            setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
        }
    };

    const handleChooseImagesClick1 = (index1: number) => {
        document.getElementById(`image-upload-input1-${index1}`)?.click();
    };

    const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setErrorMessage(null);
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
            setTimeout(() => setSuccessMessage(''), 500);
        }, 3000);
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFiles || selectedFiles.length === 0) {
            setErrorMessage("Please upload some documents before submitting.");
            return;
        }
        try {
            setLoading(true);
            setErrorMessage(null);
            const responseId = sessionStorage.getItem('responseId');
            if (!responseId) {
                console.error('No responseId found in session storage');
                return;
            }
            const documentTypeId = 4;
            const uid = loginDetails.id;
            const filesList = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
            console.log('Submitting files:', filesList);
            await documentApiService.saveFormCustomerRequest(filesList, parseInt(responseId, 10), documentTypeId, uid);
            showSuccessMessage('Attachment added successfully.');
        } catch (error) {
            console.error('Error submitting files:', error);
            setErrorMessage('Total file size cannot exceed 200MB.');
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubmits = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                                <form onSubmit={handleSave} encType="multipart/form-data">
                                    <div className="field-group" >
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
            {errorMessage && (
                <div style={{ color: 'red', textAlign: 'center', marginTop: '5px' }}>
                    {errorMessage}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Grid item>
                    <form onSubmit={handleSave}>
                        <button className='btn btn-primary'>
                            Save
                        </button>&nbsp;
                    </form>
                    {loading && <Loader />}
                </Grid>
                <form onSubmit={handleSubmits}>
                    <button type="submit" className="btn btn-primary">
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
        </Box>
    );
}

//List Of Board Directors Part
function FormTabs() {

    const [formData, setFormData] = useState({
        Letterhead: {},
        Questionnaire: {},
        Declaration: {},
        ListofBoardDirectors: {},
        KYCDocument: {},
    });

    const [declarationFrom, setDeclarationFrom] = useState<DeclarationFrom>({
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

    const [listOfDirectors, setListOfDirectors] = useState<CreateData[]>([
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

    const [listOfShareHolders, setListOfShareHolders] = useState<CreateData[]>([
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
            isDirector: 0,
            isShareHolders: 1,
            uid: 0,
            euid: 0,
            isScreening: 0
        }
    ]);

    const [signAuthority, setSignAuthority] = useState<CreateDirectorsSignAuthorityRequest[]>([
        {
            id: 0,
            kycId: 0,
            name: '',
            designation: '',
            uid: 0,
            euid: 0,
        }
    ]);

    const [section, setSection] = useState<string>('Questionnaire');
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const applicationfrome = new ApplicationfromeService();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const applicationTypeId = 1;
    const accountTypeId = 2;
    const kycId = sessionStorage.getItem('responseId');
    const [isKycApplicationSaved, setIsKycApplicationSaved] = useState(false);
    const [isDeclarationSaved, setIsDeclarationSaved] = useState(false);
    const [isListOfBoardSaved, setIsListOfBoardSaved] = useState(false);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    useEffect(() => {
        fetchQuestions();
        updateDirectorsData(kycId);
        updateShareHoldersData(kycId);
        updateSignAuthorityData(kycId);
    }, [applicationTypeId, accountTypeId, kycId]);

    const fetchQuestions = async () => {
        try {
            const questions: any = await applicationfrome.getQuestionTypes(applicationTypeId, accountTypeId);
            setFetchedQuestions(questions);
            dispatch(saveQuestionnaire(questions));
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleSectionChange = (newSection: React.SetStateAction<string>) => {
        setSection(newSection);
    };

    const handleInputChange = (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    };

    const updateSignAuthorityData = async (kycId: any) => {
        try {
            const response: any[] = await applicationfrome.getSignAuthority(kycId);
            const formattedData = response.map((authority: any) => ({
                id: 0,
                kycId: authority.kycId,
                name: authority.name,
                designation: authority.designation,
                uid: loginDetails.id,
                euid: 1,
            }));
            setSignAuthority(formattedData.length > 0 ? formattedData : [{
                id: 0, kycId: 0, name: '', designation: '', uid: loginDetails.id, euid: 1
            }]);
        } catch (error) {
            console.error("Error fetching Authority:", error);
        }
    };

    const updateShareHoldersData = async (kycId: any) => {
        try {
            const response: any[] = await applicationfrome.getKycShareHolder(kycId);
            const formattedData = response.map((shareHolder: any) => ({
                id: 0,
                kycId: shareHolder.kycId,
                authorityId: shareHolder.authorityId,
                firstName: shareHolder.firstName,
                middleName: shareHolder.middleName,
                lastName: shareHolder.lastName,
                pan: shareHolder.pan,
                nationality: shareHolder.nationality,
                citizenship: shareHolder.citizenship,
                domicile: shareHolder.domicile,
                isDirector: 0,
                isShareHolders: 1,
                uid: loginDetails.id,
                euid: 1,
                isScreening: 0
            }));
            setListOfShareHolders(formattedData.length > 0 ? formattedData : [{
                id: 0, kycId: 0, authorityId: 0, firstName: '', middleName: '', lastName: '', pan: '', nationality: '',
                citizenship: '', domicile: '', isDirector: 0, isShareHolders: 1, uid: loginDetails.id, euid: 1, isScreening: 0
            }]);
        } catch (error) {
            console.error("Error fetching shareholder:", error);
        }
    };

    const updateDirectorsData = async (kycId: any) => {
        try {
            const response: any[] = await applicationfrome.getKycDirectorsList(kycId);
            const formattedData = response.map((director: any) => ({
                id: 0,
                kycId: director.kycId,
                authorityId: director.authorityId,
                firstName: director.firstName,
                middleName: director.middleName,
                lastName: director.lastName,
                pan: director.pan,
                nationality: director.nationality,
                citizenship: director.citizenship,
                domicile: director.domicile,
                isDirector: 1,
                isShareHolders: 0,
                uid: loginDetails.id,
                euid: 1,
                isScreening: 0
            }));
            setListOfDirectors(
                formattedData.length > 0
                    ? formattedData
                    : [{
                        id: 0,
                        kycId: 0,
                        authorityId: 0,
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        pan: '',
                        nationality: '',
                        citizenship: '',
                        domicile: '',
                        isDirector: 1,
                        isShareHolders: 0,
                        uid: loginDetails.id,
                        euid: 1,
                        isScreening: 0
                    }]
            );
        } catch (error) {
            console.error("Error fetching director:", error);
        }
    };

    const handleDeclarationFormChange = (section: any, event: any) => {
        if (section == 'dbData') {
            setDeclarationFrom((prevState: any) => ({
                ...prevState,
                id: event.id, kycId: event.kycId, memberName: event.memberName,
                registeredPlace: event.registeredPlace, din: event.din, date: event.date,
                place: event.place, authorizeName: event.authorizeName, authorizeDesignation: event.authorizeDesignation, uid: event.uid
            }));
        }
        if (section == 'kycId') {
            setDeclarationFrom((prevState: any) => ({
                ...prevState,
                [section]: event
            }));
        } else {
            const { name, value } = event.target;
            setDeclarationFrom((prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleDirectorsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, personIndex: number, isNewRecord?: boolean, response?: any) => {
        if (isNewRecord == true) {
            setListOfDirectors((prevState: any) => [...prevState, {
                id: 0, kycId: 0, firstName: '', middleName: '', lastName: '', pan: '', nationality: 0, citizenship: 0, domicile: 0, isDirector: 1, isShareHolders: 0, uid: 0, euid: 0
            }]);
        } if (isNewRecord == false) {
            setListOfDirectors(listOfDirectors.filter((person: any, index: any) => index !== personIndex));
        } if (response && !isNewRecord) {
            setListOfDirectors(prevState =>
                prevState.map((person, index) => ({
                    ...person,
                    id: response[index]?.id ?? person.id,
                }))
            )
        } if (event) {
            const { name, value } = event.target as HTMLInputElement | { name: string, value: string };
            setListOfDirectors(prevState => {
                return prevState.map((person, index) => {
                    if (index === personIndex) {
                        return { ...person, [name]: value };
                    }
                    return person;
                });
            });
        }
    };

    const handleShareHoldersChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, personIndex: number, isNewRecord?: boolean, response?: any) => {
        if (isNewRecord == true) {
            setListOfShareHolders((prevState: any) => [...prevState, {
                id: 0, kycId: 0, firstName: '', middleName: '', lastName: '', pan: '', nationality: 0, citizenship: 0, domicile: 0, isDirector: 0, isShareHolders: 1, uid: 0, euid: 0
            }]);
        } if (isNewRecord == false) {
            setListOfShareHolders(listOfShareHolders.filter((person: any, index: any) => index !== personIndex));
        }
        if (response && !isNewRecord) {
            setListOfDirectors(prevState =>
                prevState.map((person, index) => ({
                    ...person,
                    id: response[index]?.id ?? person.id,
                }))
            )
        } if (event) {
            const { name, value } = event.target as HTMLInputElement | { name: string, value: string };
            setListOfShareHolders(prevState => {
                return prevState.map((person, index) => {
                    if (index === personIndex) {
                        return { ...person, [name]: value };
                    }
                    return person;
                });
            });
        }
    };

    const handleSignAuthorityChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
        personIndex: number,
        isNewRecord?: boolean,
        response?: any
    ) => {
        const { name, value } = event.target;
        if (isNewRecord === true) {
            setSignAuthority((prevState: any) => [
                ...prevState,
                { id: 0, kycId: 0, name: '', designation: '', uid: 0, euid: 0 }
            ]);
        } else if (isNewRecord === false) {
            setSignAuthority(signAuthority.filter((person: any, index: number) => index !== personIndex));
        } else {
            setSignAuthority((prevState: any) =>
                prevState.map((person: any, index: number) =>
                    index === personIndex ? { ...person, [name]: value } : person
                )
            );
        }
    };

    const renderDeclarationContent = (value: any) => {
        setIsKycApplicationSaved(true);
    };

    const renderListOfBoardContent = (value: any) => {
        setIsDeclarationSaved(true);
    };

    const renderKycdocumentContent = (value: any) => {
        setIsListOfBoardSaved(true);
    };

    const renderSectionContent = () => {
        switch (section) {
            case 'Letterhead':
                return <Letterhead formData={formData.Letterhead} questionData={fetchedQuestions} handleInputChange={handleInputChange} />;
            case 'Questionnaire':
                return <ApplicationForm formData={formData} questionData={fetchedQuestions} handleInputChange={handleInputChange} renderDeclarationContent={renderDeclarationContent} />
            case 'Declaration':
                return <Declaration formData={formData.Declaration} handleInputChange={handleDeclarationFormChange} declarationData={declarationFrom} enableBoardContent={renderListOfBoardContent} />
            case 'ListofBoardDirectors':
                return (
                    <ListOfBoardDirector
                        formData={formData.ListofBoardDirectors}
                        directorsData={listOfDirectors}
                        shareholdersData={listOfShareHolders}
                        signAuthorityData={signAuthority}
                        handleDirectorsChange={handleDirectorsChange}
                        handleShareHoldersChange={handleShareHoldersChange}
                        handleSignAuthorityChange={handleSignAuthorityChange}
                        renderKycdocumentContent={renderKycdocumentContent}
                    />
                );
            case 'KYCDocument':
                return <KYCDocument formData={formData.KYCDocument} questionData={fetchedQuestions} handleInputChange={handleInputChange} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Box m={2} style={{ marginTop: '2%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid container spacing={3} style={{ marginTop: '10px' }}>
                                <Grid item xs={12} sm={2}>
                                    <div className={`arrow ${section === 'Questionnaire' ? 'active' : ''}`} onClick={() => handleSectionChange('Questionnaire')}>
                                        <span style={{ textAlign: 'center', marginLeft: '7%' }}> Aml Kyc Questionnaires</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2} className={isKycApplicationSaved ? " " : "container-disabled"}>
                                    <div className={`arrow ${section === 'Declaration' ? 'active' : ''}`} onClick={() => handleSectionChange('Declaration')} >
                                        <span style={{ textAlign: 'center' }} aria-disabled >Declaration</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2} className={isDeclarationSaved ? " " : "container-disabled"}>
                                    <div className={`arrow ${section === 'ListofBoardDirectors' ? 'active' : ''}`} onClick={() => handleSectionChange('ListofBoardDirectors')}>
                                        <span style={{ textAlign: 'center' }}>List of Board Directors</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2} className={isListOfBoardSaved ? " " : "container-disabled"}>
                                    <div className={`arrow ${section === 'KYCDocument' ? 'active' : ''}`} onClick={() => handleSectionChange('KYCDocument')}>
                                        <span style={{ textAlign: 'center' }}>KYC Document</span>
                                    </div>
                                </Grid>
                            </Grid>
                            {renderSectionContent()}
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default FormTabs;