import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './Counterfeit.css';
import { useSelector } from 'react-redux';
import { AlertScenariosData, Branch, CounterfeitDto } from '../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import Header from '../../../layouts/header/header';
import { useNavigate } from 'react-router-dom';

function CounterfeitDetails() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const [AmlCounterfeit, setAmlCounterfeit] = useState<CounterfeitDto>({
        createCounterfeitTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            uid: loginDetails.id,
        },
        createCounterfeitNumberRequest: [
            {
                id: 0,
                counterfeitNo: '',
                denomination: '',
                counterfeitId: 0,
                uid: loginDetails.id,
                branchId: 0,
            },
        ],
        createCounterfeitRemarkRequest: [
            {
                id: 0,
                remark: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,
            },
        ],
        createCounterfeitStatusRequest: [
            {
                id: 0,
                counterfeitStatus: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,
            },
        ],
    });

    const [AlertScenarios, setAlertScenarios] = useState<AlertScenariosData[]>([]);

    useEffect(() => {
        fetchBranch();
        fetchScenarios();
    }, []);

    const view = new ViewService();
    const [Branch, setBranch] = useState<Branch[]>([]);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const fetchScenarios = async () => {
        try {
            const AlertScenarios = await view.getScenarios();
            setAlertScenarios(AlertScenarios);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const handleAmlCounterfeitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAmlCounterfeit(prevState => ({
            ...prevState,
            createCounterfeitTeamRequest: {
                ...prevState.createCounterfeitTeamRequest,
                [name]: value
            }
        }));
    };

    const handleRemoveBoxreplyQry = (index: number) => {
        const updatedAmlCounterfeit = { ...AmlCounterfeit };
        updatedAmlCounterfeit.createCounterfeitNumberRequest.splice(index, 1);
        setAmlCounterfeit(updatedAmlCounterfeit);
    };

    const handlereplyQryChange = (value: string, index: number) => {
        const updatedAmlCounterfeit = { ...AmlCounterfeit };
        updatedAmlCounterfeit.createCounterfeitNumberRequest[index].counterfeitNo = value;
        setAmlCounterfeit(updatedAmlCounterfeit);
    };

    const handlereplyChange = (value: string, index: number) => {
        const updatedAmlCounterfeit = { ...AmlCounterfeit };
        updatedAmlCounterfeit.createCounterfeitNumberRequest[index].denomination = value;
        setAmlCounterfeit(updatedAmlCounterfeit);
    };

    const handleAddreplyQryField = () => {
        const updatedAmlCounterfeit = { ...AmlCounterfeit };
        updatedAmlCounterfeit.createCounterfeitNumberRequest.push({ id: 0, counterfeitNo: '', denomination: '', counterfeitId: 0, uid: loginDetails.id, branchId: 0 });
        setAmlCounterfeit(updatedAmlCounterfeit);
    };

    const handleSubmit = async () => {
        try {
            const response = await view.counterfeitpost(AmlCounterfeit);
            console.log('AML Counterfeit submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting AML Counterfeit:', error);

        }
    };

    const navigate = useNavigate();

    const handleview = () => {
        navigate('/CounterfeitCustomerEdit');
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAmlCounterfeit(prevState => ({
            ...prevState,
            createCounterfeitRemarkRequest: [{
                ...prevState.createCounterfeitRemarkRequest[0],
                [name]: value
            }]
        }));
    };

    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...AmlCounterfeit };
        updatedFormData.createCounterfeitTeamRequest.branchId = parseInt(value, 10);
        setAmlCounterfeit(updatedFormData);
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
                            <h4>Counterfeit</h4>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <FormControl style={{ width: '100%' }}>
                                        <InputLabel htmlFor="record-type">Branch Code</InputLabel>
                                        <Select
                                            label="Branch Code"
                                            id='Branch Code'
                                            value={AmlCounterfeit.createCounterfeitTeamRequest.branchId.toString()}
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
                                        value={AmlCounterfeit.createCounterfeitTeamRequest.clientId}
                                        onChange={handleAmlCounterfeitChange}
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
                                        value={AmlCounterfeit.createCounterfeitTeamRequest.accountNumber}
                                        onChange={handleAmlCounterfeitChange}
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
                                        value={AmlCounterfeit.createCounterfeitTeamRequest.targetCustomerName}
                                        onChange={handleAmlCounterfeitChange}
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
                                    <h4>CounterfeitNo / Denomination</h4>
                                    <div className="key">
                                        <div className="scroll-box">
                                            {AmlCounterfeit.createCounterfeitNumberRequest.map((createCounterfeitNumberRequest, index) => (
                                                <div key={index} className="person-container">
                                                    {AmlCounterfeit.createCounterfeitNumberRequest.length > 1 && (
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
                                                                    id="Query"
                                                                    size='small'
                                                                    variant="outlined"
                                                                    type="text"
                                                                    name="Query"
                                                                    autoComplete="off"
                                                                    value={createCounterfeitNumberRequest.counterfeitNo}
                                                                    onChange={(e) => handlereplyQryChange(e.target.value, index)}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    style={{ width: '100%' }}
                                                                    label="Denomination"
                                                                    id="Replay"
                                                                    size='small'
                                                                    variant="outlined"
                                                                    type="text"
                                                                    name="Replay"
                                                                    autoComplete="off"
                                                                    value={createCounterfeitNumberRequest.denomination}
                                                                    onChange={(e) => handlereplyChange(e.target.value, index)}
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
                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Counterfeit No / Denomination
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
                                        value={AmlCounterfeit.createCounterfeitRemarkRequest[0].remark}
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
    )
}

export default CounterfeitDetails;