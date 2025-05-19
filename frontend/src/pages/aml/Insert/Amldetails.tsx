

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { AlertScenariosData, AmlComplaintDto, Branch } from '../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import Header from '../../../layouts/header/header';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './Aml.css';

function Amldetails() {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const [AmlComplaint, setAmlComplaint] = useState<AmlComplaintDto>({
        createAmlComplaintTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            uid: loginDetails.id,
        },
        amlComplaintAlertScenariosData: [
            {
                id: 0,
                complaintId: 0,
                scenarioId: 0,
                replyQry: '',
                uid: loginDetails.id,
            },
        ],
        amlComplaintRemarkData: [
            {
                id: 0,
                remark: '',
                complaintId: 0,
                branchId: 0,
                uid: loginDetails.id,
            },
        ],
    });

    const [AlertScenarios, setAlertScenarios] = useState<AlertScenariosData[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [Branch, setBranch] = useState<Branch[]>([]);
    const view = new ViewService();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBranch();
        fetchScenarios();
    }, []);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        } catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const fetchScenarios = async () => {
        try {
            const AlertScenarios = await view.getScenarios();
            setAlertScenarios(AlertScenarios);
        } catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const handleAmlComplaintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlComplaint(prevState => ({
            ...prevState,
            createAmlComplaintTeamRequest: {
                ...prevState.createAmlComplaintTeamRequest,
                [name]: value
            }
        }));
    };

    const handleRemoveBoxAlertScenarios = (index: number) => {
        const updatedAmlComplaint = { ...AmlComplaint };
        updatedAmlComplaint.amlComplaintAlertScenariosData.splice(index, 1);
        setAmlComplaint(updatedAmlComplaint);
    };

    const handleAlertScenarioChange = (e: SelectChangeEvent<{ value: unknown }>, index: number) => {
        const value = typeof e.target.value === 'number' ? e.target.value : parseInt(e.target.value as string, 10);
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintAlertScenariosData: prevState.amlComplaintAlertScenariosData.map((scenario, i) => {
                if (i === index) {
                    return {
                        ...scenario,
                        scenarioId: value
                    };
                }
                return scenario;
            })
        }));
    };

    const handleAddAlertScenarioField = () => {
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintAlertScenariosData: [
                ...prevState.amlComplaintAlertScenariosData,
                {
                    id: 0,
                    complaintId: 0,
                    scenarioId: 0,
                    replyQry: '',
                    uid: loginDetails.id,
                }
            ]
        }));
    };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...AmlComplaint };
        updatedAmlComplaint.amlComplaintAlertScenariosData[index].replyQry = value;
        setAmlComplaint(updatedAmlComplaint);
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

    const handleSubmit = async () => {
        try {
            if (AmlComplaint.amlComplaintRemarkData[0].remark) {
                const response = await view.post(AmlComplaint);
                console.log('Aml:', AmlComplaint);
                console.log('AML complaint submitted successfully:', response);
                showSuccessMessage('Aml To Teams added successfully.');
            } else {
                showErrorMessage('Please provide a remark before submitting.');
            }
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
            showErrorMessage('Error submitting AML complaint.');
        }
    };

    const handleview = () => {
        navigate('/QcViewed');
    };

    // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setAmlComplaint(prevState => ({
    //         ...prevState,
    //         amlComplaintRemarkData: [{
    //             ...prevState.amlComplaintRemarkData[0],
    //             [name]: value
    //         }]
    //     }));
    // };

//     const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (name === 'remark') {
//         setAmlComplaint(prevState => ({
//             ...prevState,
//             amlComplaintRemarkData: [{
//                 ...prevState.amlComplaintRemarkData[0],
//                 [name]: value
//             }]
//         }));
//     } else if (name === 'branchId') {
//         setAmlComplaint(prevState => ({
//             ...prevState,
//             amlComplaintRemarkData: [{
//                 ...prevState.amlComplaintRemarkData[0],
//                 [name]: parseInt(value, 10)
//             }]
//         }));
        
       
//     }
// };
const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'remark') {
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintRemarkData: [{
                ...prevState.amlComplaintRemarkData[0],
                [name]: value
            }]
        }));
    } else if (name === 'branchId') {
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintRemarkData: [{
                ...prevState.amlComplaintRemarkData[0],
                [name]: parseInt(value, 10)
            }]
        }));
    }
};


    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...AmlComplaint };
        updatedFormData.createAmlComplaintTeamRequest.branchId = parseInt(value, 10);
        setAmlComplaint(updatedFormData);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Card style={{
                        marginTop: '7%',
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                    }}>
                        <Card style={{
                            padding: '1%',
                            width: '100%',
                        }}>
                            <h4>Aml To Teams </h4>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <FormControl style={{ width: '100%' }}>
                                        <InputLabel htmlFor="record-type">Branch Code</InputLabel>
                                        <Select
                                            label="Branch Code"
                                            id='Branch Code'
                                            value={AmlComplaint.createAmlComplaintTeamRequest.branchId.toString()}
                                            onChange={handlecountry}
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                        >
                                            {Array.isArray(Branch) &&
                                                Branch.map((lists: any) => (
                                                    <MenuItem key={lists.id} value={lists.id}>
                                                        {lists.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label="Client ID"
                                        id="Client ID"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="clientId"
                                        autoComplete="off"
                                        value={AmlComplaint.createAmlComplaintTeamRequest.clientId}
                                        onChange={handleAmlComplaintChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label="Account Numbers"
                                        id="Account Numbers"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="accountNumber"
                                        autoComplete="off"
                                        value={AmlComplaint.createAmlComplaintTeamRequest.accountNumber}
                                        onChange={handleAmlComplaintChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label="Customer Name"
                                        id="Customer Name"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="targetCustomerName"
                                        autoComplete="off"
                                        value={AmlComplaint.createAmlComplaintTeamRequest.targetCustomerName}
                                        onChange={handleAmlComplaintChange}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                        <br />
                        <br />
                        <Card style={{
                            padding: '1%',
                            width: '100%',
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <h4>Alert Scenarios</h4>
                                    <div className="key">
                                        <div className="scroll-box">
                                            {AmlComplaint.amlComplaintAlertScenariosData.map((scenario, index) => (
                                                <div key={index} className="person-container">
                                                    {AmlComplaint.amlComplaintAlertScenariosData.length > 1 && (
                                                        <div className="close-button" onClick={() => handleRemoveBoxAlertScenarios(index)}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </div>
                                                    )}
                                                    <div className="field-group-column">
                                                        <FormControl style={{ width: '100%' }}>
                                                            <InputLabel htmlFor={`alert-scenario-${index}`}>Alert Scenarios</InputLabel>
                                                            <Select
                                                                label="Alert Scenarios"
                                                                id={`alert-scenario-${index}`}
                                                                value={scenario.scenarioId as any}
                                                                onChange={(e: SelectChangeEvent<{ value: unknown }>) => handleAlertScenarioChange(e, index)}
                                                                variant="outlined"
                                                                size="small"
                                                            >
                                                                {AlertScenarios.map((alertScenario) => (
                                                                    <MenuItem key={alertScenario.id} value={alertScenario.id}>
                                                                        {alertScenario.alertScenarios}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                style={{ width: '100%' }}
                                                                label="Query"
                                                                id="Query"
                                                                size='small'
                                                                variant="outlined"
                                                                type="text"
                                                                name="Query"
                                                                autoComplete="off"
                                                                value={scenario.replyQry}
                                                                onChange={(e) => handlereplyQryChange(e.target.value, index)}
                                                            />
                                                        </Grid>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="field-group">
                                            <div className="field-group-container">
                                                <div className="field-group-row">
                                                    <div className="field label">
                                                        <div className="add-button" onClick={handleAddAlertScenarioField}>
                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Alert Scenarios
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                        <br />
                        <Card style={{
                            padding: '1%',
                            width: '100%',
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <TextareaAutosize
                                        minRows={3}
                                        placeholder="Remark"
                                        value={AmlComplaint.amlComplaintRemarkData[0].remark}
                                        name="remark"
                                        onChange={handleChange}
                                        style={{ width: '50%', resize: 'vertical' }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleview}
                                    >
                                        View
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
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
                </Box>
            </Box>
        </>
    )
}

export default Amldetails;
