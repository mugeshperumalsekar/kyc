import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize, Snackbar } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AlertScenariosData, AmlComplaintDto, CompleteTeamDto, Branch } from '../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import Header from '../../../layouts/header/header';
import MuiAlert from '@mui/material/Alert';

function Amldetails() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const { complaintId, uid } = useParams();

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

    const [Branch, setBranch] = useState<Branch[]>([]);
    const [AlertScenarios, setAlertScenarios] = useState<AlertScenariosData[]>([]);

    const [amlComplainted, setAmlComplainted] = useState<CompleteTeamDto>({
        complaintDto: [{
            complaintId: 0,
            branchName: '',
            branchCode: '',
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
        }],
        alertScenarioDtos: [{
            complaintAlertId: 0,
            replyQry: '',
            alertScenarios: '',
        }],
        remarkDtos: [{
            remark: '',
        }],
    });

    const view = new ViewService();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    useEffect(() => {
        const fetchData = async (complaintId: string, uid: string) => {
            try {
                const customerData = await view.getAmlCompleteTeam(complaintId);
                setAmlComplainted(customerData);
                console.log("API Response:", customerData);
                if (customerData && customerData.complaintDto.length > 0) {
                    setAmlComplaint({
                        createAmlComplaintTeamRequest: {
                            ...customerData.complaintDto[0],
                            uid: loginDetails.id,
                            ticketId: customerData.complaintDto[0]?.id || 0,
                            branchId: customerData.complaintDto[0]?.branchId || 0,
                        },
                        amlComplaintAlertScenariosData: customerData.alertScenarioDtos.map((scenario: { id: any; complaintId: any; scenarioId: any; replyQry: any }) => ({
                            id: scenario.id,
                            complaintId: scenario.complaintId,
                            replyQry: scenario.replyQry,
                            scenarioId: scenario.scenarioId,
                            uid: loginDetails.id,
                        })),
                        amlComplaintRemarkData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            complaintId: remark.complaintId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("Error: customerData.complaintDto is empty in the API response");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (complaintId && uid) {
            fetchData(complaintId, uid);
        }
    }, [complaintId, uid, loginDetails.id]);

    useEffect(() => {
        fetchBranch();
        fetchScenarios();
    }, []);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        } catch (error) {
            console.error("Error fetching branch list:", error);
        }
    };

    const fetchScenarios = async () => {
        try {
            const alertScenarios = await view.getScenarios();
            setAlertScenarios(alertScenarios);
            console.log('AlertScenarios:', alertScenarios);
        } catch (error) {
            console.error("Error fetching alert scenarios list:", error);
        }
    };

    const handleAmlComplaintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlComplaint(prevState => ({
            ...prevState,
            createAmlComplaintTeamRequest: {
                ...prevState.createAmlComplaintTeamRequest,
                [name]: value,
            },
        }));
    };

    const handleRemoveBoxAlertScenarios = (index: number) => {
        const updatedAmlComplaint = { ...AmlComplaint };
        updatedAmlComplaint.amlComplaintAlertScenariosData.splice(index, 1);
        setAmlComplaint(updatedAmlComplaint);
    };

    const handleAlertScenarioChange = (e: SelectChangeEvent<string>, index: number) => {
        const value = parseInt(e.target.value, 10);
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintAlertScenariosData: prevState.amlComplaintAlertScenariosData.map((scenario, i) => {
                if (i === index) {
                    return {
                        ...scenario,
                        scenarioId: value,
                    };
                }
                return scenario;
            }),
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
                },
            ],
        }));
    };

    const handlereplyQryChange = (value: string, index: number) => {
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintAlertScenariosData: prevState.amlComplaintAlertScenariosData.map((scenario, i) => {
                if (i === index) {
                    return {
                        ...scenario,
                        replyQry: value,
                    };
                }
                return scenario;
            }),
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlComplaint(prevState => ({
            ...prevState,
            amlComplaintRemarkData: [{
                ...prevState.amlComplaintRemarkData[0],
                [name]: value,
            }],
        }));
    };

    const handleCountryChange = (e: SelectChangeEvent<string>) => {
        const value = parseInt(e.target.value, 10);
        setAmlComplaint(prevState => ({
            ...prevState,
            createAmlComplaintTeamRequest: {
                ...prevState.createAmlComplaintTeamRequest,
                branchId: value,
            },
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

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const handleEdit = async () => {
        try {
            if (!complaintId || !loginDetails.id) {
                showErrorMessage('Complaint ID or User ID is missing.');
                return;
            }
            if (!AmlComplaint.amlComplaintRemarkData[0].remark) {
                showErrorMessage('Please provide a remark before submitting.');
                return;
            }
            const response = await view.Editpost(complaintId, loginDetails.id, AmlComplaint);
            console.log('AML complaint submitted successfully:', response);
            showSuccessMessage('Aml To Teams updated successfully.');
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
            showErrorMessage('Error updated AML complaint.');
        }
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
                                            value={AmlComplaint.createAmlComplaintTeamRequest.branchId ? AmlComplaint.createAmlComplaintTeamRequest.branchId.toString() : ''}
                                            onChange={handleCountryChange}
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                        >
                                            {Array.isArray(Branch) &&
                                                Branch.map((branch: any) => (
                                                    <MenuItem key={branch.id} value={branch.id}>
                                                        {branch.name}
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
                        <br></br>
                        <br></br>
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
                                                                value={scenario.scenarioId ? scenario.scenarioId.toString() : ''}
                                                                onChange={(e: SelectChangeEvent<string>) => handleAlertScenarioChange(e, index)}
                                                                variant="outlined"
                                                                size="small"
                                                            >
                                                                {AlertScenarios.map((alertScenario) => (
                                                                    <MenuItem key={alertScenario.id} value={alertScenario.id.toString()}>
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
                        <br></br>
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
                                        onClick={handleEdit}
                                    >
                                        Submit
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