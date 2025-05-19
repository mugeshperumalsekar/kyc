import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import Header from '../../../layouts/header/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Branch, CounterfeitDto, GetScamDTO, ScamCommonDTO } from '../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import { useParams } from 'react-router-dom';
import { CounterfeitGetDto } from '../../../data/services/aml/Reports/Counterfeit/counterfeit-payload';
import CounterfeitApiService from '../../../data/services/aml/Reports/Counterfeit/counterfeit-api-service';

function Edit() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [customerNameError, setCustomerNameError] = useState('');
    const [Branch, setBranch] = useState<Branch[]>([]);
    const view = new ViewService();
    const counterfeitview = new CounterfeitApiService();
    const { counterfeitId, uid } = useParams();
    const [editable, setEditable] = useState(false);

    const [amlCounterfeit, setAmlCounterfiet] = useState<CounterfeitGetDto>({
        createCounterfeitTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            branchCode: '',
            uid: 0
        },
        counterfeitStatusData: [
            {
                id: 0,
                counterfeitId: 0,
                counterfeitStatus: '',
                uid: loginDetails.id,
                branchId: 0,

            },
        ],
        counterfeitRemarkData: [
            {
                id: 0,
                remark: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,

            }
        ],
        counterfeitNumberData: [
            {
                id: 0,
                counterfeitNo: '',
                denomination: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,
            },
        ]
    });

    const CounterfeitDTO = {
        createCounterfeitTeamRequest: {
            id: amlCounterfeit.createCounterfeitTeamRequest.id,
            ticketId: amlCounterfeit.createCounterfeitTeamRequest.ticketId,
            branchId: amlCounterfeit.createCounterfeitTeamRequest.branchId,
            clientId: amlCounterfeit.createCounterfeitTeamRequest.clientId,
            accountNumber: amlCounterfeit.createCounterfeitTeamRequest.accountNumber,
            targetCustomerName: amlCounterfeit.createCounterfeitTeamRequest.targetCustomerName,
            branchCode: amlCounterfeit.createCounterfeitTeamRequest.branchCode,
            uid: loginDetails.id
        },
        createCounterfeitStatusRequest: amlCounterfeit.counterfeitStatusData.map(status => ({
            id: status.id,
            counterfeitId: status.counterfeitId,
            counterfeitStatus: status.counterfeitStatus,
            uid: loginDetails.id,
            branchId: status.branchId,
        })),
        createCounterfeitRemarkRequest: amlCounterfeit.counterfeitRemarkData.map(remark => ({
            id: remark.id,
            remark: remark.remark,
            counterfeitId: remark.counterfeitId,
            branchId: remark.branchId,
            uid: loginDetails.id,
            ticketId: remark.branchId,
        })),
        createCounterfeitNumberRequest: amlCounterfeit.counterfeitNumberData.map(observation => ({
            id: observation.id,
            counterfeitNo: observation.counterfeitNo,
            denomination: observation.denomination,
            counterfeitId: observation.counterfeitId,
            branchId: observation.branchId,
            uid: loginDetails.id,
        })),
    };

    const [Scam, setScam] = useState<CounterfeitDto>(CounterfeitDTO);

    useEffect(() => {
        const fetchData = async (counterfeitId: string, uid: string) => {
            try {
                const customerData = await counterfeitview.getAmlCounterfeit(counterfeitId);
                setAmlCounterfiet(customerData);
                if (customerData && customerData.counterfeitStatusDtos) {
                    setAmlCounterfiet({
                        createCounterfeitTeamRequest: {
                            id: 0,
                            ticketId: 0,
                            branchId: 0,
                            clientId: "",
                            accountNumber: "",
                            targetCustomerName: "",
                            branchCode: "",
                            uid: 0,
                        },
                        counterfeitStatusData: customerData.counterfeitStatusDtos.map((scenario: { id: any; counterfeitId: any; branchId: any; uid: any; counterfeitStatus: any; branchCode: any; }) => ({
                            id: scenario.id,
                            counterfeitId: scenario.counterfeitId,
                            branchId: scenario.branchId,
                            uid: scenario.uid,
                            counterfeitStatus: scenario.counterfeitStatus,
                            branchCode: scenario.branchCode,
                        })),
                        counterfeitNumberData: customerData.remarkDtos.map((reply: { id: any; counterfeitNo: any; denomination: any; counterfeitId: any; }) => ({
                            id: reply.id,
                            counterfeitNo: reply.counterfeitNo,
                            denomination: reply.denomination,
                            counterfeitId: reply.counterfeitId,
                            uid: loginDetails.id,
                        })),
                        counterfeitRemarkData: customerData.remarkDtos.map((remark: { id: any; remark: any; counterfeitId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            counterfeitId: remark.counterfeitId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("Error: counterfeitStatusDtos is undefined in the API response");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (counterfeitId && uid) {
            fetchData(counterfeitId, uid);
        }
    }, [counterfeitId, uid]);

    const handleEditButtonClick = () => {
        setEditable(!editable);
    };

    const handleSaveButtonClick = async () => {
        setEditable(false);
        try {
            if (!counterfeitId) {
                return;
            }
            const counterfeitWriteDTO = {
                updateCounterfeitTeamRequest: {
                    id: amlCounterfeit.createCounterfeitTeamRequest.id,
                    branchId: amlCounterfeit.createCounterfeitTeamRequest.branchId,
                    clientId: amlCounterfeit.createCounterfeitTeamRequest.clientId,
                    accountNumber: amlCounterfeit.createCounterfeitTeamRequest.accountNumber,
                    targetCustomerName: amlCounterfeit.createCounterfeitTeamRequest.targetCustomerName,
                    branchCode: amlCounterfeit.createCounterfeitTeamRequest.branchCode,
                    ticketId: amlCounterfeit.createCounterfeitTeamRequest.ticketId,
                    uid: loginDetails.id
                },
                createCounterfeitStatusRequest: amlCounterfeit.counterfeitStatusData.map(status => ({
                    id: status.id,
                    counterfeitId: status.counterfeitId,
                    counterfeitStatus: status.counterfeitStatus,
                    uid: loginDetails.id,
                    branchId: status.branchId,
                })),
                createCounterfeitRemarkRequest: amlCounterfeit.counterfeitRemarkData.map(remark => ({
                    id: remark.id,
                    remark: remark.remark,
                    counterfeitId: remark.counterfeitId,
                    branchId: remark.branchId,
                    uid: loginDetails.id,
                    ticketId: remark.branchId,
                })),
                createCounterfeitNumberRequest: amlCounterfeit.counterfeitNumberData.map(observation => ({
                    id: observation.id,
                    counterfeitNo: observation.counterfeitNo,
                    denomination: observation.denomination,
                    counterfeitId: observation.counterfeitId,
                    branchId: observation.branchId,
                    uid: loginDetails.id,
                })),
            };
            const formData = new FormData();
            formData.append('counterfeitWriteDTO', JSON.stringify(counterfeitWriteDTO));
            const response = await view.EditCounterfeit(counterfeitWriteDTO, counterfeitId, 1);
        } catch (error) {
            console.error("Error updating the scam:", error);
        }
    };

    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...amlCounterfeit };
        updatedFormData.createCounterfeitTeamRequest.branchId = parseInt(value, 10);
        setAmlCounterfiet(updatedFormData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlCounterfiet(prevState => ({
            ...prevState,
            counterfeitRemarkData: [{
                ...prevState.counterfeitRemarkData[0],
                [name]: value
            }]
        }));
    };

    const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlCounterfiet(prevState => ({
            ...prevState,
            createCounterfeitTeamRequest: {
                ...prevState.createCounterfeitTeamRequest,
                clientId: value
            }
        }));
    };

    const handleAmlscamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlCounterfiet(prevState => ({
            ...prevState,
            createCounterfeitTeamRequest: {
                ...prevState.createCounterfeitTeamRequest,
                [name]: value
            }
        }));
    };

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmlCounterfiet(prevState => ({
            ...prevState,
            createCounterfeitTeamRequest: {
                ...prevState.createCounterfeitTeamRequest,
                targetCustomerName: value
            }
        }));
    };

    const handleRemoveBoxreplyQry = (index: number) => {
        const updatedAmlComplaint = { ...amlCounterfeit };
        updatedAmlComplaint.counterfeitNumberData.splice(index, 1);
        setAmlCounterfiet(updatedAmlComplaint);
    };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...amlCounterfeit };
        updatedAmlComplaint.counterfeitNumberData[index].counterfeitNo = value;
        setAmlCounterfiet(updatedAmlComplaint);
    };

    const handledenominationChange = (value: string, index: number) => {
        const updatedAmlComplaint = { ...amlCounterfeit };
        updatedAmlComplaint.counterfeitNumberData[index].denomination = value;
        setAmlCounterfiet(updatedAmlComplaint);
    };

    const handleAddreplyQryField = () => {
        const updatedAmlComplaint = { ...amlCounterfeit };
        updatedAmlComplaint.counterfeitNumberData.push({
            id: 0,
            counterfeitNo: '',
            denomination: '',
            counterfeitId: 0,
            branchId: 0,
            uid: loginDetails.id,
        });
        setAmlCounterfiet(updatedAmlComplaint);
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
                                            value={amlCounterfeit.createCounterfeitTeamRequest.branchId.toString()}
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
                                        value={amlCounterfeit.createCounterfeitTeamRequest.clientId}
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
                                        value={amlCounterfeit.createCounterfeitTeamRequest.accountNumber}
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
                                        value={amlCounterfeit.createCounterfeitTeamRequest.targetCustomerName}
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
                                            {amlCounterfeit.counterfeitNumberData.map((counterfeitNumberData, index) => (
                                                <div key={index} className="person-container">
                                                    {amlCounterfeit.counterfeitNumberData.length > 1 && (
                                                        <div className="close-button" onClick={() => handleRemoveBoxreplyQry(index)}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </div>
                                                    )}
                                                    <div className="field-group-column">
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    style={{ width: '100%' }}
                                                                    label="CounterfeitNo"
                                                                    id="Observation"
                                                                    size='small'
                                                                    variant="outlined"
                                                                    type="text"
                                                                    name="Observation"
                                                                    autoComplete="off"
                                                                    value={amlCounterfeit.counterfeitNumberData[0].counterfeitNo}
                                                                    onChange={(e) => handlereplyQryChange(e.target.value, index)}
                                                                    disabled={!editable}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    style={{ width: '100%' }}
                                                                    label="Denomination"
                                                                    id="Observation"
                                                                    size='small'
                                                                    variant="outlined"
                                                                    type="text"
                                                                    name="Observation"
                                                                    autoComplete="off"
                                                                    value={amlCounterfeit.counterfeitNumberData[0].denomination}
                                                                    onChange={(e) => handledenominationChange(e.target.value, index)}
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
                                        value={amlCounterfeit.counterfeitRemarkData[0].remark}
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

export default Edit;   