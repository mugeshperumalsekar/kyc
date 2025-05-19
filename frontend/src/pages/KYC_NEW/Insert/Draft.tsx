import { SelectChangeEvent, Box, Grid } from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
import { DeclarationFrom, CreateData, QuestionType, CreateDirectorsSignAuthorityRequest } from "../../../data/services/kyc/applicationfrom/applicationfrome-payload";
import Header from "../../../layouts/header/header";
import Declaration from "./Declaration";
import ListOfBoardDirector from "./ListOfBoardDirector";
import { saveQuestionnaire } from "./state/save-application-action";
import App from "./Letter";
import ApplicationForm from "./ApplicationForm";
import KycDocument from "./KycDocument";

function FormTabs() {

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

    const [section, setSection] = useState<string>('Application');
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const applicationfrome = new ApplicationfromeService();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const applicationTypeId = 1;
    const accountTypeId = 2;
    const [responseId, setResponseId] = useState(sessionStorage.getItem('responseId'));
    const [isKycApplicationSaved, setIsKycApplicationSaved] = useState(false);
    const [isDeclarationSaved, setIsDeclarationSaved] = useState(false);
    const [isListOfBoardSaved, setIsListOfBoardSaved] = useState(false);
    const { kycId } = useParams<{ kycId: string }>();
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
            console.log('formData:', questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleSectionChange = (newSection: React.SetStateAction<string>) => {
        setSection(newSection);
    };

    const handleInputChange = (sectionName: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            // setSignAuthority(formattedData);
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
            // setListOfShareHolders(formattedData);
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
            // setListOfDirectors(formattedData);
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
            console.error("Error fetching shareholder:", error);
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

    // const handleSignAuthorityChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, personIndex: number, isNewRecord?: boolean, response?: any) => {
    //     if (isNewRecord == true) {
    //         setSignAuthority((prevState: any) => [...prevState, {
    //             id: 0, kycId: 0, name: '', designation: '', uid: 0, euid: 0
    //         }]);
    //     } if (isNewRecord == false) {
    //         setSignAuthority(signAuthority.filter((person: any, index: any) => index !== personIndex));
    //     }
    // };

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
                return <App handleInputChange={handleInputChange} />;
            case 'Questionnaire':
                return <ApplicationForm questionData={fetchedQuestions} handleInputChange={handleInputChange} renderDeclarationContent={renderDeclarationContent} kycId={kycId} />
            case 'Declaration':
                return <Declaration handleInputChange={handleDeclarationFormChange} declarationData={declarationFrom} enableBoardContent={renderListOfBoardContent} kycId={kycId} />
            case 'ListofBoardDirectors':
                return <ListOfBoardDirector directorsData={listOfDirectors} shareholdersData={listOfShareHolders} signAuthorityData={signAuthority}
                    handleDirectorsChange={handleDirectorsChange} handleShareHoldersChange={handleShareHoldersChange} handleSignAuthorityChange={handleSignAuthorityChange} renderKycdocumentContent={renderKycdocumentContent} />;
            case 'KYCDocument':
                return <KycDocument handleInputChange={handleInputChange} />;
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
                                {/* <Grid item xs={12} sm={2}>
                                    <div className={`arrow ${section === 'Letterhead' ? 'active' : ''}`} onClick={() => handleSectionChange('Letterhead')}>
                                        <span style={{ textAlign: 'center' }}>Letter head</span>
                                    </div>
                                </Grid> */}
                                <Grid item xs={12} sm={2}>
                                    <div className={`arrow ${section === 'Questionnaire' ? 'active' : ''}`} onClick={() => handleSectionChange('Questionnaire')}>
                                        <span style={{ textAlign: 'center', marginLeft: '7%' }}> Aml Kyc Questionnaire</span>
                                    </div>
                                </Grid>
                                {/* <Grid item xs={12} sm={2}  className={isKycApplicationSaved ? " " : "container-disabled"}> */}
                                <Grid item xs={12} sm={2} className={isKycApplicationSaved ? " " : ""}>
                                    <div className={`arrow ${section === 'Declaration' ? 'active' : ''}`} onClick={() => handleSectionChange('Declaration')} >
                                        <span style={{ textAlign: 'center' }} aria-disabled >Declaration</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2} className={isDeclarationSaved ? " " : ""}>
                                    <div className={`arrow ${section === 'ListofBoardDirectors' ? 'active' : ''}`} onClick={() => handleSectionChange('ListofBoardDirectors')}>
                                        <span style={{ textAlign: 'center' }}>List of Board Directors</span>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={2} className={isListOfBoardSaved ? " " : ""}>
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