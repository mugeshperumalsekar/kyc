import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import Header from '../../../layouts/header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Branch, GetScamDTO, ScamCommonDTO } from '../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import { useParams } from 'react-router-dom';

function ScamEdit() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [customerNameError, setCustomerNameError] = useState('');
    const [Branch, setBranch] = useState<Branch[]>([]);
    const view = new ViewService();
    const { scamId, uid } = useParams();
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        fetchBranch();
    }, []);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        } catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const [amlScam, setAmlScam] = useState<GetScamDTO>({
        createScamTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            branchCode: '',
            ticketStatus: '',
            uid: 0
        },
        scamStatusData: [
            {
                id: 0,
                scamId: 0,
                scamStatus: '',
                uid: loginDetails.id,
                branchId: 0,
                ticketId: 0,
                branchCode: 0
            },
        ],
        scamRemarkData: [
            {
                id: 0,
                remark: '',
                scamId: 0,
                branchId: 0,
                uid: loginDetails.id,
                ticketId: 0
            }
        ],
        scamObservationData: [
            {
                id: 0,
                observation: '',
                scamId: 0,
                branchId: 0,
                ticketId: 0,
                uid: loginDetails.id,
            },
        ]
    });

    const ScamDTO = {
        createScamTeamRequest: {
            id: amlScam.createScamTeamRequest.id,
            ticketId: amlScam.createScamTeamRequest.ticketId,
            branchId: amlScam.createScamTeamRequest.branchId,
            clientId: amlScam.createScamTeamRequest.clientId,
            accountNumber: amlScam.createScamTeamRequest.accountNumber,
            targetCustomerName: amlScam.createScamTeamRequest.targetCustomerName,
            branchCode: amlScam.createScamTeamRequest.branchCode,
            ticketStatus: amlScam.createScamTeamRequest.ticketStatus,
            uid: loginDetails.id
        },
        createScamStatusRequest: amlScam.scamStatusData.map(status => ({
            id: status.id,
            scamId: status.scamId,
            scamStatus: status.scamStatus,
            uid: loginDetails.id,
            branchId: status.branchId,
            ticketId: status.ticketId,
            branchCode: status.branchCode
        })),
        createScamRemarkRequest: amlScam.scamRemarkData.map(remark => ({
            id: remark.id,
            remark: remark.remark,
            scamId: remark.scamId,
            branchId: remark.branchId,
            uid: loginDetails.id,
            ticketId: remark.branchId,
        })),
        createScamObservationRequest: amlScam.scamObservationData.map(observation => ({
            id: observation.id,
            observation: observation.observation,
            scamId: observation.scamId,
            branchId: observation.branchId,
            ticketId: observation.ticketId,
            uid: loginDetails.id,
        })),
    };

    const [Scam, setScam] = useState<ScamCommonDTO>(ScamDTO);

    useEffect(() => {
        const fetchData = async (scamId: string, uid: string) => {
            try {
                const customerData = await view.getAmlScamTeam(scamId);
                setAmlScam(customerData);
                if (customerData && customerData.scamStatusDtos) {
                    setAmlScam({
                        createScamTeamRequest: {
                            id: 0,
                            ticketId: 0,
                            branchId: 0,
                            clientId: "",
                            accountNumber: "",
                            targetCustomerName: "",
                            branchCode: "",
                            ticketStatus: "",
                            uid: 0,
                        },
                        scamStatusData: customerData.scamStatusDtos.map((scenario: { id: any; scamId: any; branchId: any; uid: any; scamStatus: any; ticketId: any; branchCode: any; }) => ({
                            id: scenario.id,
                            scamId: scenario.scamId,
                            branchId: scenario.branchId,
                            uid: scenario.uid,
                            scamStatus: scenario.scamStatus,
                            ticketId: scenario.ticketId,
                            branchCode: scenario.branchCode,
                        })),
                        scamRemarkData: customerData.remarkDtos.map((reply: { id: any; replyQry: any; reply: any; complaintId: any; }) => ({
                            id: reply.id,
                            replyQry: reply.replyQry,
                            reply: reply.reply,
                            complaintId: reply.complaintId,
                            uid: loginDetails.id,
                        })),
                        scamObservationData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            complaintId: remark.complaintId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("Error: scamStatusDtos is undefined in the API response");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (scamId && uid) {
            fetchData(scamId, uid);
        }
    }, [scamId, uid]);

    const handleEditButtonClick = () => {
        setEditable(!editable);
    };

    const handleSaveButtonClick = async () => {
        setEditable(false);
        try {
            if (!scamId) {
                return;
            }
            const scamWriteDTO = {
                updateScamTeamRequest: {
                    id: amlScam.createScamTeamRequest.id,
                    ticketId: amlScam.createScamTeamRequest.ticketId,
                    branchId: amlScam.createScamTeamRequest.branchId,
                    clientId: amlScam.createScamTeamRequest.clientId,
                    accountNumber: amlScam.createScamTeamRequest.accountNumber,
                    targetCustomerName: amlScam.createScamTeamRequest.targetCustomerName,
                    branchCode: amlScam.createScamTeamRequest.branchCode,
                    ticketStatus: amlScam.createScamTeamRequest.ticketStatus,
                    uid: loginDetails.id
                },
                createScamStatusRequest: amlScam.scamStatusData.map(status => ({
                    id: status.id,
                    scamId: status.scamId,
                    scamStatus: status.scamStatus,
                    uid: loginDetails.id,
                    branchId: status.branchId,
                    ticketId: status.ticketId,
                    branchCode: status.branchCode
                })),
                createScamRemarkRequest: amlScam.scamRemarkData.map(remark => ({
                    id: remark.id,
                    remark: remark.remark,
                    scamId: remark.scamId,
                    branchId: remark.branchId,
                    uid: loginDetails.id,
                    ticketId: remark.branchId,
                })),
                createScamObservationRequest: amlScam.scamObservationData.map(observation => ({
                    id: observation.id,
                    observation: observation.observation,
                    scamId: observation.scamId,
                    branchId: observation.branchId,
                    ticketId: observation.ticketId,
                    uid: loginDetails.id,
                })),
            };
            const formData = new FormData();
            formData.append('ScamWriteDTO', JSON.stringify(scamWriteDTO));
            const response = await view.EditScam(scamWriteDTO, scamId, 1);
        } catch (error) {
            console.error("Error updating the scam:", error);
        }
    };

    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...amlScam };
        updatedFormData.createScamTeamRequest.branchId = parseInt(value, 10);
        setAmlScam(updatedFormData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlScam(prevState => ({
            ...prevState,
            scamRemarkData: [{
                ...prevState.scamRemarkData[0],
                [name]: value
            }]
        }));
    };

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlScam(prevState => ({
            ...prevState,
            createScamTeamRequest: {
                ...prevState.createScamTeamRequest,
                clientId: value
            }
        }));
    };

    const handleAmlscamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlScam(prevState => ({
            ...prevState,
            createScamTeamRequest: {
                ...prevState.createScamTeamRequest,
                [name]: value
            }
        }));
    };

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlScam(prevState => ({
            ...prevState,
            createScamTeamRequest: {
                ...prevState.createScamTeamRequest,
                targetCustomerName: value
            }
        }));
    };

    const handleRemoveBoxreplyQry = (index: number) => {
        const updatedAmlComplaint = { ...amlScam };
        updatedAmlComplaint.scamObservationData.splice(index, 1);
        setAmlScam(updatedAmlComplaint);
    };

    // const handlereplyQryChange = (value: string, index: number) => {
    //     const updatedAmlComplaint = { ...amlScam };
    //     updatedAmlComplaint.scamObservationData[index].observation = value;
    //     setAmlScam(updatedAmlComplaint);
    // };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...amlScam };
        const observationsArray = value.split(' ');
        observationsArray.forEach((obs, i) => {
            if (updatedAmlComplaint.scamObservationData[i]) {
                updatedAmlComplaint.scamObservationData[i].observation = obs;
            } else {
                updatedAmlComplaint.scamObservationData.push({
                    id: 0,
                    observation: obs,
                    scamId: 0,
                    branchId: 0,
                    ticketId: 0,
                    uid: loginDetails.id,
                });
            }
        });
        updatedAmlComplaint.scamObservationData = updatedAmlComplaint.scamObservationData.slice(0, observationsArray.length);
        setAmlScam(updatedAmlComplaint);
    };

    const handleAddreplyQryField = () => {
        const updatedAmlComplaint = { ...amlScam };
        updatedAmlComplaint.scamObservationData.push({
            id: 0,
            observation: '',
            scamId: 0,
            branchId: 0,
            ticketId: 0,
            uid: loginDetails.id,
        });
        setAmlScam(updatedAmlComplaint);
    };

    const handleCustomerNameKeyPress = () => {
        setCustomerNameError('');
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Card style={{ marginTop: '7%', padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <Card style={{ padding: '1%', width: '100%' }}>
                            <h4>Branch To Aml</h4>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <FormControl style={{ width: '100%' }}>
                                        <InputLabel htmlFor="record-type">Branch Code</InputLabel>
                                        <Select
                                            label="Branch Code"
                                            id='Branch Code'
                                            value={amlScam.createScamTeamRequest.branchId.toString()}
                                            onChange={handlecountry}
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                            disabled={!editable}
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
                                <Grid item xs={3}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label="Client ID"
                                        id="Client ID"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="clientId"
                                        autoComplete="off"
                                        value={amlScam.createScamTeamRequest.clientId}
                                        onChange={handleClientIdChange}
                                        disabled={!editable}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label="Account Numbers"
                                        id="Account Numbers"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="accountNumber"
                                        autoComplete="off"
                                        value={amlScam.createScamTeamRequest.accountNumber}
                                        onChange={handleAmlscamChange}
                                        disabled={!editable}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label="Customer Name"
                                        id="Customer Name"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="targetCustomerName"
                                        autoComplete="off"
                                        value={amlScam.createScamTeamRequest.targetCustomerName}
                                        onChange={handleCustomerNameChange}
                                        onKeyPress={handleCustomerNameKeyPress}
                                        disabled={!editable}
                                    />
                                    {customerNameError && <span style={{ color: 'red' }}>{customerNameError}</span>}
                                </Grid>
                            </Grid>
                        </Card>
                        <br />
                        <Card style={{ padding: '1%', width: '100%' }}>
                            {/* <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <h4>Observation</h4>
                                    <div className="key">
                                        <div className="scroll-box">
                                            {amlScam.scamObservationData.map((scamObservationData, index) => (
                                                <div key={index} className="person-container">
                                                    {amlScam.scamObservationData.length > 1 && (
                                                        <div className="close-button" onClick={() => handleRemoveBoxreplyQry(index)}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </div>
                                                    )}
                                                    <div className="field-group-column">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    style={{ width: '100%' }}
                                                                    label="Observation"
                                                                    id="Observation"
                                                                    size='small'
                                                                    variant="outlined"
                                                                    type="text"
                                                                    name="Observation"
                                                                    autoComplete="off"
                                                                    multiline
                                                                    value={amlScam.scamObservationData[0].observation}
                                                                    onChange={(e) => handlereplyQryChange(e.target.value, index)}
                                                                    disabled={!editable}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="field-group">
                                            <div className="field-group-container">
                                                <div className="field-group-row">
                                                    <div className="field label">
                                                        <div className="add-button" onClick={handleAddreplyQryField}>
                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Observation
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid> */}
                            <Grid item xs={12} sm={12} md={12}>
                                <InputLabel>Observations</InputLabel>
                                {amlScam.scamObservationData.map((observation, index) => (
                                    <TextField
                                        key={index}
                                        value={observation.observation}
                                        disabled={!editable}
                                        fullWidth
                                        onChange={(e) => {
                                            const newObservations = [...amlScam.scamObservationData];
                                            newObservations[index].observation = e.target.value;
                                            setAmlScam(prevState => ({
                                                ...prevState,
                                                scamObservationData: newObservations,
                                            }));
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                ))}
                            </Grid>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddreplyQryField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Observation
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <br />
                        <Card style={{ padding: '1%', width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={11}>
                                    <TextareaAutosize
                                        minRows={3}
                                        placeholder="Remark"
                                        value={amlScam.scamRemarkData[0].remark}
                                        name="remark"
                                        onChange={handleChange}
                                        disabled={!editable}
                                        style={{ width: '50%', resize: 'vertical' }}

                                    />
                                </Grid>
                                <Grid item xs={1} style={{ marginBlockStart: 'auto' }}>
                                    <Button variant="contained" color="primary" onClick={editable ? handleSaveButtonClick : handleEditButtonClick}>
                                        {editable ? 'Save' : 'Edit'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default ScamEdit;   