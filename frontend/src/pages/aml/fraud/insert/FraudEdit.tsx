import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
// import { Branch, GetFraudDTO, FraudCommonDTO } from '../../../data/services/aml/viewpage/view_payload';
import { useParams } from 'react-router-dom';
import Header from '../../../../layouts/header/header';
import ViewService from '../../../../data/services/aml/viewpage/view_api_service';
import { FraudCommonDTO, Branch, GetFraudDTO } from '../../../../data/services/aml/viewpage/view_payload';

function FraudEdit() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [customerNameError, setCustomerNameError] = useState('');
    const [Branch, setBranch] = useState<Branch[]>([]);
    const view = new ViewService();
    const { fraudId, uid } = useParams();
    const [editable, setEditable] = useState(false);

    const [amlFraud, setAmlFraud] = useState<GetFraudDTO>({
        createFraudTeamRequest: {
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
        fraudStatusData: [
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
        fraudRemarkData: [
            {
                id: 0,
                remark: '',
                fraudId: 0,
                branchId: 0,
                uid: loginDetails.id,
                ticketId: 0
            }
        ],
        fraudObservationData: [
            {
                id: 0,
                observation: '',
                fraudId: 0,
                branchId: 0,
                ticketId: 0,
                uid: loginDetails.id,
            },
        ]
    });

    const FraudDTO = {
        createFraudTeamRequest: {
            id: amlFraud.createFraudTeamRequest.id,
            ticketId: amlFraud.createFraudTeamRequest.ticketId,
            branchId: amlFraud.createFraudTeamRequest.branchId,
            clientId: amlFraud.createFraudTeamRequest.clientId,
            accountNumber: amlFraud.createFraudTeamRequest.accountNumber,
            targetCustomerName: amlFraud.createFraudTeamRequest.targetCustomerName,
            branchCode: amlFraud.createFraudTeamRequest.branchCode,
            ticketStatus: amlFraud.createFraudTeamRequest.ticketStatus,
            uid: loginDetails.id
        },
        createFraudStatusRequest: amlFraud.fraudStatusData.map(status => ({
            id: status.id,
            fraudId: status.fraudId,
            fraudStatus: status.fraudStatus,
            uid: loginDetails.id,
            branchId: status.branchId,
            ticketId: status.ticketId,
            branchCode: status.branchCode
        })),
        createFraudRemarkRequest: amlFraud.fraudRemarkData.map(remark => ({
            id: remark.id,
            remark: remark.remark,
            fraudId: remark.fraudId,
            branchId: remark.branchId,
            uid: loginDetails.id,
            ticketId: remark.branchId,
        })),
        createFraudObservationRequest: amlFraud.fraudObservationData.map(observation => ({
            id: observation.id,
            observation: observation.observation,
            fraudId: observation.fraudId,
            branchId: observation.branchId,
            ticketId: observation.ticketId,
            uid: loginDetails.id,
        })),
    };

    const [Fraud, setFraud] = useState<FraudCommonDTO>(FraudDTO);

    useEffect(() => {
        const fetchData = async (fraudId: string, uid: string) => {
            try {
                const customerData = await view.getAmlFraudTeam(fraudId);
                setAmlFraud(customerData);
                if (customerData && customerData.fraudStatusDtos) {
                    setAmlFraud({
                        createFraudTeamRequest: {
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
                        fraudStatusData: customerData.fraudStatusDtos.map((scenario: { id: any; fraudId: any; branchId: any; uid: any; fraudStatus: any; ticketId: any; branchCode: any; }) => ({
                            id: scenario.id,
                            fraudId: scenario.fraudId,
                            branchId: scenario.branchId,
                            uid: scenario.uid,
                            fraudStatus: scenario.fraudStatus,
                            ticketId: scenario.ticketId,
                            branchCode: scenario.branchCode,
                        })),
                        fraudRemarkData: customerData.remarkDtos.map((reply: { id: any; replyQry: any; reply: any; complaintId: any; }) => ({
                            id: reply.id,
                            replyQry: reply.replyQry,
                            reply: reply.reply,
                            complaintId: reply.complaintId,
                            uid: loginDetails.id,
                        })),
                        fraudObservationData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            complaintId: remark.complaintId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("Error: fraudStatusDtos is undefined in the API response");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (fraudId && uid) {
            fetchData(fraudId, uid);
        }
    }, [fraudId, uid]);

    const handleEditButtonClick = () => {
        setEditable(!editable);
    };

    const handleSaveButtonClick = async () => {
        setEditable(false);
        try {
            if (!fraudId) {
                return;
            }
            const fraudWriteDTO = {
                updateFraudTeamRequest: {
                    id: amlFraud.createFraudTeamRequest.id,
                    ticketId: amlFraud.createFraudTeamRequest.ticketId,
                    branchId: amlFraud.createFraudTeamRequest.branchId,
                    clientId: amlFraud.createFraudTeamRequest.clientId,
                    accountNumber: amlFraud.createFraudTeamRequest.accountNumber,
                    targetCustomerName: amlFraud.createFraudTeamRequest.targetCustomerName,
                    branchCode: amlFraud.createFraudTeamRequest.branchCode,
                    ticketStatus: amlFraud.createFraudTeamRequest.ticketStatus,
                    uid: loginDetails.id
                },
                createFraudStatusRequest: amlFraud.fraudStatusData.map(status => ({
                    id: status.id,
                    fraudId: status.fraudId,
                    fraudStatus: status.fraudStatus,
                    uid: loginDetails.id,
                    branchId: status.branchId,
                    ticketId: status.ticketId,
                    branchCode: status.branchCode
                })),
                createFraudRemarkRequest: amlFraud.fraudRemarkData.map(remark => ({
                    id: remark.id,
                    remark: remark.remark,
                    fraudId: remark.fraudId,
                    branchId: remark.branchId,
                    uid: loginDetails.id,
                    ticketId: remark.branchId,
                })),
                createFraudObservationRequest: amlFraud.fraudObservationData.map(observation => ({
                    id: observation.id,
                    observation: observation.observation,
                    fraudId: observation.fraudId,
                    branchId: observation.branchId,
                    ticketId: observation.ticketId,
                    uid: loginDetails.id,
                })),
            };
            const formData = new FormData();
            formData.append('FraudWriteDTO', JSON.stringify(fraudWriteDTO));
            const response = await view.EditFraud(fraudWriteDTO, fraudId, 1);
        } catch (error) {
            console.error("Error updating the fraud:", error);
        }
    };


    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...amlFraud };
        updatedFormData.createFraudTeamRequest.branchId = parseInt(value, 10);
        setAmlFraud(updatedFormData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlFraud(prevState => ({
            ...prevState,
            fraudRemarkData: [{
                ...prevState.fraudRemarkData[0],
                [name]: value
            }]
        }));
    };

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlFraud(prevState => ({
            ...prevState,
            createFraudTeamRequest: {
                ...prevState.createFraudTeamRequest,
                clientId: value
            }
        }));
    };

    const handleAmlfraudChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlFraud(prevState => ({
            ...prevState,
            createFraudTeamRequest: {
                ...prevState.createFraudTeamRequest,
                [name]: value
            }
        }));
    };

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlFraud(prevState => ({
            ...prevState,
            createFraudTeamRequest: {
                ...prevState.createFraudTeamRequest,
                targetCustomerName: value
            }
        }));
    };

    const handleRemoveBoxreplyQry = (index: number) => {
        const updatedAmlComplaint = { ...amlFraud };
        updatedAmlComplaint.fraudObservationData.splice(index, 1);
        setAmlFraud(updatedAmlComplaint);
    };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...amlFraud };
        updatedAmlComplaint.fraudObservationData[index].observation = value;
        setAmlFraud(updatedAmlComplaint);
    };

    const handleAddreplyQryField = () => {
        const updatedAmlComplaint = { ...amlFraud };
        updatedAmlComplaint.fraudObservationData.push({
            id: 0,
            observation: '',
            fraudId: 0,
            branchId: 0,
            ticketId: 0,
            uid: loginDetails.id,
        });
        setAmlFraud(updatedAmlComplaint);
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
                                            value={amlFraud.createFraudTeamRequest.branchId.toString()}
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
                                        value={amlFraud.createFraudTeamRequest.clientId}
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
                                        value={amlFraud.createFraudTeamRequest.accountNumber}
                                        onChange={handleAmlfraudChange}
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
                                        value={amlFraud.createFraudTeamRequest.targetCustomerName}
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
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <h4>Observation</h4>
                                    <div className="key">
                                        <div className="scroll-box">
                                            {amlFraud.fraudObservationData.map((fraudObservationData, index) => (
                                                <div key={index} className="person-container">
                                                    {amlFraud.fraudObservationData.length > 1 && (
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
                                                                    value={amlFraud.fraudObservationData[0].observation}
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
                            </Grid>
                        </Card>
                        <br />
                        <Card style={{ padding: '1%', width: '100%' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={11}>
                                    <TextareaAutosize
                                        minRows={3}
                                        placeholder="Remark"
                                        value={amlFraud.fraudRemarkData[0].remark}
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

export default FraudEdit;   