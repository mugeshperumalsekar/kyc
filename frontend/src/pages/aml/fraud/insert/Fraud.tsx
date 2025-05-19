import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FraudCommonDTO, Branch } from '../../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../../data/services/aml/viewpage/view_api_service';
import Header from '../../../../layouts/header/header';

function Fraud() {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const [Amlfraud, setAmlfarud] = useState<FraudCommonDTO>({
        createFraudTeamRequest: {
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
        createFraudStatusRequest: [
            {
                id: 0,
                fraudId: 0,
                fraudStatus: '',
                uid: loginDetails.id,
                branchId: 0,
                ticketId: 0,
                branchCode: 0
            },
        ],
        createFraudRemarkRequest: [
            {
                id: 0,
                remark: '',
                fraudId: 0,
                branchId: 0,
                uid: loginDetails.id,
                ticketId: 0
            },
        ],
        createFraudObservationRequest: [
            {
                id: 0,
                observation: '',
                fraudId: 0,
                branchId: 0,
                ticketId: 0,
                uid: loginDetails.id,
            },
        ],
    });

    useEffect(() => {
        fetchBranch();
    }, []);

    const view = new ViewService();
    const [Branch, setBranch] = useState<Branch[]>([]);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        } catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const handleAmlfraudChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlfarud(prevState => ({
            ...prevState,
            createFraudTeamRequest: {
                ...prevState.createFraudTeamRequest,
                [name]: value
            }
        }));
    };

    const handleRemoveBoxreplyQry = (index: number) => {
        const updatedAmlComplaint = { ...Amlfraud };
        updatedAmlComplaint.createFraudObservationRequest.splice(index, 1);
        setAmlfarud(updatedAmlComplaint);
    };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...Amlfraud };
        updatedAmlComplaint.createFraudObservationRequest[index].observation = value;
        setAmlfarud(updatedAmlComplaint);
    };

    const handleAddreplyQryField = () => {
        const updatedAmlComplaint = { ...Amlfraud };
        updatedAmlComplaint.createFraudObservationRequest.push({
            id: 0,
            observation: '',
            fraudId: 0,
            branchId: 0,
            ticketId: 0,
            uid: loginDetails.id,
        });
        setAmlfarud(updatedAmlComplaint);
    };
    // const handleSubmit = async () => {
    //     try {
    //         const response = await view.fraudpost(Amlfraud); // Make sure to pass fraudDto if needed
    //         console.log('AML complaint submitted successfully:', response);
    //     } catch (error) {
    //         console.error('Error submitting AML complaint:', error);
    //     }
    // };
    const handleSubmit = async () => {
        try {
            // Make sure to construct the fraudDTO object properly
            const FraudWriteDTO = {
                createFraudTeamRequest: {
                
                    ticketId: Amlfraud.createFraudTeamRequest.ticketId,
                    branchId: Amlfraud.createFraudTeamRequest.branchId,
                    clientId: Amlfraud.createFraudTeamRequest.clientId,
                    accountNumber: Amlfraud.createFraudTeamRequest.accountNumber,
                    targetCustomerName: Amlfraud.createFraudTeamRequest.targetCustomerName,
                    uid: Amlfraud.createFraudTeamRequest.uid,
                    branchCode: Amlfraud.createFraudTeamRequest.branchCode,
                    ticketStatus: Amlfraud.createFraudTeamRequest.ticketStatus
                },
                createFraudStatusRequest: Amlfraud.createFraudStatusRequest.map(status => ({
                    fraudId: status.fraudId,
                    fraudStatus: status.fraudStatus,
                    uid: status.uid,
                    branchId: status.branchId,
                    ticketId: status.ticketId,
                    branchCode: status.branchCode
                })),
                createFraudRemarkRequest: Amlfraud.createFraudRemarkRequest.map(remark => ({
                    remark: remark.remark,
                    fraudId: remark.fraudId,
                    branchId: remark.branchId,
                    uid: remark.uid,
                    ticketId: remark.ticketId
                })),
                createFraudObservationRequest: Amlfraud.createFraudObservationRequest.map(observation => ({
                    observation: observation.observation,
                    fraudId: observation.fraudId,
                    branchId: observation.branchId,
                    ticketId: observation.ticketId,
                    uid: observation.uid,
                })),
            };
            console.log("fraudWriteDTO", FraudWriteDTO);
            const formData = new FormData();
            formData.append('FraudWriteDTO', JSON.stringify(FraudWriteDTO)); // Correct parameter name
    
            
    
            const response = await view.fraudpost(FraudWriteDTO); // Pass formData instead of fraudDTO
            console.log('AML complaint submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
        }
    };
    
    
    

    const navigate = useNavigate();
    const handleview = () => {
        navigate('/QcViewfraud');
    };

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlfarud(prevState => ({
            ...prevState,
            createFraudTeamRequest: {
                ...prevState.createFraudTeamRequest,
                clientId: value
            }
        }));
    };

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlfarud(prevState => ({
            ...prevState,
            createFraudTeamRequest: {
                ...prevState.createFraudTeamRequest,
                targetCustomerName: value
            }
        }));
    };

    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...Amlfraud };
        updatedFormData.createFraudTeamRequest.branchId = parseInt(value, 10);
        setAmlfarud(updatedFormData);
    };
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlfarud(prevState => ({
            ...prevState,
            createFraudRemarkRequest: [{
                ...prevState.createFraudRemarkRequest[0],
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
                            <h4>Aml To Teams </h4>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <FormControl style={{ width: '100%' }}>
                                        <InputLabel htmlFor="record-type">Branch Code</InputLabel>
                                        <Select
                                            label="Branch Code"
                                            id='Branch Code'
                                            value={Amlfraud.createFraudTeamRequest.branchId.toString()}
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
                                        value={Amlfraud.createFraudTeamRequest.clientId}
                                        onChange={handleClientIdChange}
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
                                        value={Amlfraud.createFraudTeamRequest.accountNumber}
                                        onChange={handleAmlfraudChange}
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
                                        value={Amlfraud.createFraudTeamRequest.targetCustomerName}
                                        onChange={handleCustomerNameChange}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                        <br />
                        <Card style={{ padding: '1%', width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <h4>Observation</h4>
                                    <div className="key">
                                        <div className="scroll-box">
                                            {Amlfraud.createFraudObservationRequest.map((createFraudObservationRequest, index) => (
                                                <div key={index} className="person-container">
                                                    {Amlfraud.createFraudObservationRequest.length > 1 && (
                                                        <div className="close-button" onClick={() => handleRemoveBoxreplyQry(index)}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </div>
                                                    )}
                                                    <div className="field-group-column">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    style={{ width: '100%' }}
                                                                    label="observation"
                                                                    id="observation"
                                                                    size='small'
                                                                    variant="outlined"
                                                                    type="text"
                                                                    name="observation"
                                                                    autoComplete="off"
                                                                    value={createFraudObservationRequest.observation}
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
                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More observation
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
                                <Grid item xs={8}>
                                    <TextareaAutosize
                                        minRows={3}
                                        placeholder="Remark"
                                        value={Amlfraud.createFraudRemarkRequest[0].remark}
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
                </Box>
            </Box>
        </>
    );
}

export default Fraud;
