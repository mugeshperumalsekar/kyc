import React, { useState, ChangeEvent, MouseEvent } from 'react';
import { Container, Card, Box, Button, TextField, Grid, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { CreateData } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from '../../../layouts/header/header';
import './Form.css';

const ApplicationForm = () => {

    const applicationfrome = new ApplicationfromeService();

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

    const handleInputChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, personIndex: number) => {
        const { name, value } = event.target as HTMLInputElement | { name: string, value: string };
        setKycFormData(prevState => {
            return prevState.map((person, index) => {
                if (index === personIndex) {
                    return { ...person, [name]: value };
                }
                return person;
            });
        });
    };

    const handleInputChanges = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, personIndex: number) => {
        const { name, value } = event.target as HTMLInputElement | { name: string, value: string };
        setKycFormDatas(prevState => {
            return prevState.map((person, index) => {
                if (index === personIndex) {
                    return { ...person, [name]: value };
                }
                return person;
            });
        });
    };

    const handleRemoveBoxkycdetails = (personIndex: number) => {
        setKycFormData(KycformData.filter((person, index) => index !== personIndex));
    };

    const handleRemovekycdetails = (personIndex: number) => {
        setKycFormDatas(KycformData.filter((person, index) => index !== personIndex));
    };

    // const handleSubmit = async () => {
    //     try {
    //         const response = await applicationfrome.Directorslist(KycformData);
    //         const responses = await applicationfrome.Directorslists(KycformDataa);
    //         console.log("Form submitted successfully:", response, responses);
    //         console.log("Form Data:", KycformData);
    //         console.log("Form Data:", KycformDataa);
    //     } catch (error) {
    //         console.error("Error submitting form:", error);
    //     }
    // };

    // const handleSubmit = async () => {
    //     try {
    //         // Assuming response contains the updated KycformData with IDs
    //         const response = await applicationfrome.Directorslist(KycformData);
    //         const responses = await applicationfrome.Directorslists(KycformDataa);
    //         // Update the state with the received IDs
    //         setKycFormData(prevState => prevState.map((person, index) => ({
    //             ...person,
    //             id: response[index]?.id ?? person.id, // Update with the new ID or retain old ID
    //         })));
    //         setKycFormDatas(prevState => prevState.map((person, index) => ({
    //             ...person,
    //             id: responses[index]?.id ?? person.id, // Update with the new ID or retain old ID
    //         })));
    //         console.log("Form submitted successfully:", response, responses);
    //         console.log("Form Data:", KycformData);
    //         console.log("Form Data:", KycformDataa);
    //     } catch (error) {
    //         console.error("Error submitting form:", error);
    //     }
    // };

    return (
        <>
            {/* <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <br></br> */}
            <br />
            <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                {/* <Container style={{ width: '274mm', minHeight: '297mm', marginTop: '2%' }}> */}
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <div className="scrollablebox">
                            {KycformData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {KycformData.length > 1 && (
                                        <div className="close-button" onClick={() => handleRemoveBoxkycdetails(personIndex)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    )}
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="firstName"
                                                label="Name"
                                                size='small'
                                                autoComplete='off'
                                                value={person.firstName}
                                                onChange={(e) => handleInputChanged(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="middleName"
                                                label="Middle Name"
                                                size='small'
                                                autoComplete='off'
                                                value={person.middleName}
                                                onChange={(e) => handleInputChanged(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="lastName"
                                                label="Last Name"
                                                size='small'
                                                value={person.lastName}
                                                onChange={(e) => handleInputChanged(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="pan"
                                                label="PAN"
                                                size='small'
                                                autoComplete='off'
                                                value={person.pan}
                                                onChange={(e) => handleInputChanged(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="contact-select">Nationality</InputLabel>
                                                <Select
                                                    name="nationality"
                                                    label="Nationality"
                                                    size='small'
                                                    autoComplete='off'
                                                    value={person.nationality}
                                                    onChange={(e) => handleInputChanged(e as SelectChangeEvent<string>, personIndex)}
                                                >
                                                    {/* <MenuItem value="American">American</MenuItem>
                                                                <MenuItem value="Canadian">Canadian</MenuItem>
                                                                <MenuItem value="Indian">Indian</MenuItem>
                                                                <MenuItem value="Other">Other</MenuItem> */}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="contact-select">Citizenship</InputLabel>
                                                <Select
                                                    name="citizenship"
                                                    label="Citizenship"
                                                    size='small'
                                                    value={person.citizenship}
                                                    onChange={(e) => handleInputChanged(e as SelectChangeEvent<string>, personIndex)}
                                                >
                                                    {/* <MenuItem value="American">American</MenuItem>
                                                                <MenuItem value="Canadian">Canadian</MenuItem>
                                                                <MenuItem value="Indian">Indian</MenuItem>
                                                                <MenuItem value="Other">Other</MenuItem> */}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="contact-select">Domicile</InputLabel>
                                                <Select
                                                    name="domicile"
                                                    label="Domicile"
                                                    size='small'
                                                    value={person.domicile}
                                                    onChange={(e) => handleInputChanged(e as SelectChangeEvent<string>, personIndex)}
                                                >
                                                    {/* <MenuItem value="American">American</MenuItem>
                                                                <MenuItem value="Canadian">Canadian</MenuItem>
                                                                <MenuItem value="Indian">Indian</MenuItem>
                                                                <MenuItem value="Other">Other</MenuItem> */}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                        </div>
                        <div className="button-container">
                            <Button
                                className="add-people"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setKycFormData([...KycformData, {
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
                                    isShareHolders: 0,
                                    euid: 0,
                                    isScreening: 0
                                }])}>
                                Add Directors Details
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <div className="scrollablebox">
                            {KycformDataa.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {KycformDataa.length > 1 && (
                                        <div className="close-button" onClick={() => handleRemovekycdetails(personIndex)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    )}
                                    <Grid container spacing={2}>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="firstName"
                                                label="Name"
                                                size='small'
                                                value={person.firstName}
                                                onChange={(e) => handleInputChanges(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="middleName"
                                                label="Middle Name"
                                                size='small'
                                                value={person.middleName}
                                                onChange={(e) => handleInputChanges(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="lastName"
                                                label="Last Name"
                                                size='small'
                                                value={person.lastName}
                                                onChange={(e) => handleInputChanges(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                name="pan"
                                                label="PAN"
                                                size='small'
                                                value={person.pan}
                                                onChange={(e) => handleInputChanges(e, personIndex)}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="contact-select">Nationality</InputLabel>
                                                <Select
                                                    name="nationality"
                                                    label="Nationality"
                                                    size='small'
                                                    value={person.nationality}
                                                    onChange={(e) => handleInputChanged(e as SelectChangeEvent<string>, personIndex)}
                                                >
                                                    <MenuItem value="American">American</MenuItem>
                                                    <MenuItem value="Canadian">Canadian</MenuItem>
                                                    <MenuItem value="Indian">Indian</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="contact-select">Citizenship</InputLabel>
                                                <Select
                                                    name="citizenship"
                                                    label="Citizenship"
                                                    size='small'
                                                    value={person.citizenship}
                                                    onChange={(e) => handleInputChanged(e as SelectChangeEvent<string>, personIndex)}
                                                >
                                                    <MenuItem value="American">American</MenuItem>
                                                    <MenuItem value="Canadian">Canadian</MenuItem>
                                                    <MenuItem value="Indian">Indian</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="contact-select">Domicile</InputLabel>
                                                <Select
                                                    name="domicile"
                                                    label="Domicile"
                                                    size='small'
                                                    value={person.domicile}
                                                    onChange={(e) => handleInputChanged(e as SelectChangeEvent<string>, personIndex)}
                                                >
                                                    <MenuItem value="American">American</MenuItem>
                                                    <MenuItem value="Canadian">Canadian</MenuItem>
                                                    <MenuItem value="Indian">Indian</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                        </div>
                        <div className="button-container">
                            <Button
                                className="add-people"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setKycFormDatas([...KycformDataa, {
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
                                    isShareHolders: 0,
                                    uid: 0,
                                    euid: 0,
                                    isScreening: 0,
                                }])}>
                                Add Directors Details
                            </Button>
                        </div>
                    </div>
                </Card>
                <br></br>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        className="submit-form"
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: '10px' }}
                    // onClick={handleSubmit}
                    >
                        Save
                    </Button>&nbsp;
                </div>
                {/* </Container> */}
            </Card>
            {/* </Box>
            </Box> */}
        </>
    );
};

export default ApplicationForm;