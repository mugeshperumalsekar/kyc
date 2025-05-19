import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import { ScamCommonDTO, Branch } from '../../../data/services/aml/viewpage/view_payload';

function AmlScam() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [customerNameError, setCustomerNameError] = useState('');
    const view = new ViewService();
    const [Branch, setBranch] = useState<Branch[]>([]);

    const [Amlscam, setAmlscam] = useState<ScamCommonDTO>({
        createScamTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            uid: loginDetails.id,
            branchCode: '',
            ticketStatus: ''
        },
        createScamStatusRequest: [
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
        createScamRemarkRequest: [
            {
                id: 0,
                remark: '',
                scamId: 0,
                branchId: 0,
                uid: loginDetails.id,
                ticketId: 0
            },
        ],
        createScamObservationRequest: [
            {
                id: 0,
                observation: '',
                scamId: 0,
                branchId: 0,
                ticketId: 0,
                uid: loginDetails.id,
            },
        ],
    });

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

    const handleAmlscamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlscam(prevState => ({
            ...prevState,
            createScamTeamRequest: {
                ...prevState.createScamTeamRequest,
                [name]: value
            }
        }));
    };

    const handleRemoveBoxreplyQry = (index: number) => {
        const updatedAmlComplaint = { ...Amlscam };
        updatedAmlComplaint.createScamObservationRequest.splice(index, 1);
        setAmlscam(updatedAmlComplaint);
    };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...Amlscam };
        updatedAmlComplaint.createScamObservationRequest[index].observation = value;
        setAmlscam(updatedAmlComplaint);
    };

    const handleAddreplyQryField = () => {
        const updatedAmlComplaint = { ...Amlscam };
        updatedAmlComplaint.createScamObservationRequest.push({
            id: 0,
            observation: '',
            scamId: 0,
            branchId: 0,
            ticketId: 0,
            uid: loginDetails.id,
        });
        setAmlscam(updatedAmlComplaint);
    };

    const handleSubmit = async () => {
        if (!Amlscam.createScamTeamRequest.targetCustomerName.trim()) {
            setCustomerNameError('Customer Name is required');
            return;
        }
        try {
            const ScamWriteDTO = {
                createScamTeamRequest: {
                    ticketId: Amlscam.createScamTeamRequest.ticketId,
                    branchId: Amlscam.createScamTeamRequest.branchId,
                    clientId: Amlscam.createScamTeamRequest.clientId,
                    accountNumber: Amlscam.createScamTeamRequest.accountNumber,
                    targetCustomerName: Amlscam.createScamTeamRequest.targetCustomerName,
                    uid: Amlscam.createScamTeamRequest.uid,
                    branchCode: Amlscam.createScamTeamRequest.branchCode,
                    ticketStatus: Amlscam.createScamTeamRequest.ticketStatus
                },
                createScamStatusRequest: Amlscam.createScamStatusRequest.map(status => ({
                    scamId: status.scamId,
                    scamStatus: status.scamStatus,
                    uid: status.uid,
                    branchId: status.branchId,
                    ticketId: status.ticketId,
                    branchCode: status.branchCode
                })),
                createScamRemarkRequest: Amlscam.createScamRemarkRequest.map(remark => ({
                    remark: remark.remark,
                    scamId: remark.scamId,
                    branchId: remark.branchId,
                    uid: remark.uid,
                    ticketId: remark.ticketId
                })),
                createScamObservationRequest: Amlscam.createScamObservationRequest.map(observation => ({
                    observation: observation.observation,
                    scamId: observation.scamId,
                    branchId: observation.branchId,
                    ticketId: observation.ticketId,
                    uid: observation.uid,
                })),
            };
            const formData = new FormData();
            formData.append('scamWriteDTO', JSON.stringify(ScamWriteDTO));
            const response = await view.scampost(ScamWriteDTO);
            setAmlscam({
                createScamTeamRequest: {
                    id: 0,
                    ticketId: 0,
                    branchId: 0,
                    clientId: '',
                    accountNumber: '',
                    targetCustomerName: '',
                    uid: loginDetails.id,
                    branchCode: '',
                    ticketStatus: ''
                },
                createScamStatusRequest: [
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
                createScamRemarkRequest: [
                    {
                        id: 0,
                        remark: '',
                        scamId: 0,
                        branchId: 0,
                        uid: loginDetails.id,
                        ticketId: 0
                    },
                ],
                createScamObservationRequest: [
                    {
                        id: 0,
                        observation: '',
                        scamId: 0,
                        branchId: 0,
                        ticketId: 0,
                        uid: loginDetails.id,
                    },
                ],
            });
            setCustomerNameError('');
            console.log('Form submitted successfully');
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
        }
    };

    const navigate = useNavigate();

    const handleview = () => {
        navigate('/ScamSearch');
    };

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlscam(prevState => ({
            ...prevState,
            createScamTeamRequest: {
                ...prevState.createScamTeamRequest,
                clientId: value
            }
        }));
    };

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlscam(prevState => ({
            ...prevState,
            createScamTeamRequest: {
                ...prevState.createScamTeamRequest,
                targetCustomerName: value
            }
        }));
    };

    const handleCustomerNameKeyPress = () => {
        setCustomerNameError('');
    };

    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...Amlscam };
        updatedFormData.createScamTeamRequest.branchId = parseInt(value, 10);
        setAmlscam(updatedFormData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlscam(prevState => ({
            ...prevState,
            createScamRemarkRequest: [{
                ...prevState.createScamRemarkRequest[0],
                [name]: value
            }]
        }));
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
                                            value={Amlscam.createScamTeamRequest.branchId.toString()}
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
                                        value={Amlscam.createScamTeamRequest.clientId}
                                        onChange={handleClientIdChange}
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
                                        value={Amlscam.createScamTeamRequest.accountNumber}
                                        onChange={handleAmlscamChange}
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
                                        value={Amlscam.createScamTeamRequest.targetCustomerName}
                                        onChange={handleCustomerNameChange}
                                        onKeyPress={handleCustomerNameKeyPress}
                                    />
                                    {customerNameError && <span style={{ color: 'red' }}>{customerNameError}</span>}
                                </Grid>
                            </Grid>
                        </Card>
                        <br />
                        <Card style={{ padding: '1%', width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <h4>Observation</h4>
                                    <div className="key">
                                        <div className="scroll-box">
                                            {Amlscam.createScamObservationRequest.map((createScamObservationRequest, index) => (
                                                <div key={index} className="person-container">
                                                    {Amlscam.createScamObservationRequest.length > 1 && (
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
                                                                    value={createScamObservationRequest.observation}
                                                                    onChange={(e) => handlereplyQryChange(e.target.value, index)}
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
                            </Grid>
                        </Card>
                        <br />
                        <Card style={{ padding: '1%', width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <TextareaAutosize
                                        minRows={3}
                                        placeholder="Remark"
                                        value={Amlscam.createScamRemarkRequest[0].remark}
                                        name="remark"
                                        onChange={handleChange}
                                        style={{ width: '50%', resize: 'vertical' }}
                                    />
                                </Grid>
                                <Grid item xs={3} style={{ marginBlockStart: 'auto' }}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>&nbsp;
                                    <Button variant="contained" color="primary" onClick={handleview}>View</Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default AmlScam;