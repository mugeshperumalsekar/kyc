


import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Aml.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import Header from '../../../layouts/header/header';
import { AmlComplaintStatus, Status, Branch } from '../../../data/services/aml/viewpage/view_payload';

// Import Snackbar component and Alert for displaying messages
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Amldetails() {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const location = useLocation();
    const { ticketId, complaintId, uid } = useParams();
    const [ticketIdValue, setTicketIdValue] = useState<string | undefined>(undefined);

    const navigate = useNavigate();
    const [amlData, setAmlData] = useState<any>(null);
    const [remark, setRemark] = useState<AmlComplaintStatus>({
        id: 0,
        ticketId: 0,
        ticketStatusId: 0,
        complaintId: 0,
        remark: '',
        branchId: 0,
        uid: loginDetails.id,
    });
    const [Status, setStatus] = useState<Status[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBranchSelectOpen, setIsBranchSelectOpen] = useState(false); // State for controlling the branch select dropdown
    const [Branch, setBranch] = useState<Branch[]>([]);


    useEffect(() => {
        fetchAmlData();
        fetchStatus();
    }, []);
    useEffect(() => {
        if (complaintId) {
            setRemark(prevRemark => ({
                ...prevRemark,
                complaintId: parseInt(complaintId), // Assuming complaintId is a string and needs conversion to integer
                ticketId: parseInt(complaintId) // Setting ticketId to the same value as complaintId
            }));
        }
    }, [complaintId]);

    useEffect(() => {
        if (remark.ticketStatusId === 4) { // Fetch branches only when status is "Move To Other Branch"
            fetchBranch();
        }
    }, [remark.ticketStatusId]);


    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        } catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const fetchStatus = async () => {
        try {
            const Status = await view.getStatus();
            setStatus(Status);
            console.log('AML Status:', Status);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const view = new ViewService();

    const fetchAmlData = async () => {
        try {
            const response = await view.getAmlCompleteTeam(complaintId); // Assuming complaintId is hardcoded as 4
            setAmlData(response);
        } catch (error) {
            console.error("Error fetching AML data:", error);
        }
    };

    const handleRemarkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRemark({
            ...remark,
            remark: event.target.value
        });
    };


    const handleRemarkSubmit = async () => {
        try {
            // Check if the remark value is not empty or null
            if (remark.remark.trim() !== '') {
                // Insert the complaintId value here
                let updatedRemark = { ...remark };
                if (complaintId) {
                    updatedRemark = { ...remark, complaintId: parseInt(complaintId), ticketId: parseInt(complaintId) };
                } else {
                    // Provide default values if complaintId is undefined
                    updatedRemark = { ...remark, complaintId: 0, ticketId: 0 }; // Or any other default values you prefer
                }
                const response = await view.AmlComplaintStatus(updatedRemark);

                console.log('AML complaint submitted successfully:', response);
                setOpenSnackbar(true);
                showSuccessMessage('Aml Decision added successfully.');
            } else {
                // If the remark value is empty or null, show an error message
                showErrorMessage('Please provide a remark before submitting.');
            }
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
        }
    };



    const handlecountry = (e: SelectChangeEvent<string>) => {
        const value = e.target.value;
        const updatedFormData = { ...remark, ticketStatusId: parseInt(value, 10) };
        setRemark(updatedFormData);
    };
    const handleBranchChange = (e: SelectChangeEvent<string>) => {
        const value = parseInt(e.target.value, 10);
        setRemark(prevRemark => ({
            ...prevRemark,
            branchId: value
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
                        <h4>Aml Decision</h4>
                        <Card style={{
                            padding: '1%',
                            width: '100%',
                        }}>

                            <Grid container spacing={2}>

                                <Grid item xs={2}>
                                    <p>Branch Name: {amlData?.complaintDto?.[0]?.branchName}</p>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>Client ID: {amlData?.complaintDto?.[0]?.clientId}</p>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>Account Numbers: {amlData?.complaintDto?.[0]?.accountNumber}</p>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>Customer Name: {amlData?.complaintDto?.[0]?.targetCustomerName}</p>
                                </Grid>
                            </Grid>
                        </Card>
                    </Card>
                    <br></br>


                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>

                        {/* <Grid container spacing={2}> */}

                        {/* <h4>Bank Replay</h4> */}
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <h4>Alert Scenarios</h4>
                                {amlData?.alertScenarioDtos?.map((scenario: any, index: number) => (
                                    <React.Fragment key={index}>
                                        <p style={{ marginBottom: '-14px', maxWidth: '100%' }}>{scenario.alertScenarios}</p>
                                        {index < amlData.alertScenarioDtos.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </Grid>
                            <Grid item xs={3}>
                                <h4>ReplyQry</h4>
                                {amlData?.alertScenarioDtos?.map((scenario: any, index: number) => (
                                    <React.Fragment key={index}>
                                        <p style={{ marginBottom: '-14px', maxWidth: '100%' }}>{scenario.replyQry}</p>
                                        {index < amlData.alertScenarioDtos.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </Grid>
                        </Grid>
                        {/* </Grid> */}

                    </Card>

                    <br></br>

                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <h4>Aml Decision</h4>

                                <FormControl style={{ width: '50%' }}>
                                    <InputLabel htmlFor="record-type">Status</InputLabel>

                                    <Select
                                        label="Status"
                                        id='Status'
                                        value={remark.ticketStatusId.toString()}
                                        onChange={handlecountry}
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                    >
                                        {Array.isArray(Status) &&
                                            Status.map((lists: any) => (
                                                <MenuItem key={lists.id} value={lists.id}>
                                                    {lists.name}
                                                </MenuItem>
                                            ))}
                                    </Select>

                                </FormControl>
                            </Grid>

                            {remark.ticketStatusId === 4 && ( // Render the branch dropdown only when status is "Move To Other Branch"
                                <Grid item xs={6}>
                                    <FormControl style={{ width: '50%' }}>
                                        <InputLabel htmlFor="branch">Branch</InputLabel>
                                        <Select
                                            label="Branch"
                                            id='Branch'
                                            value={remark.branchId.toString()}
                                            onChange={handleBranchChange}
                                            variant="outlined"
                                            type="text"
                                            size="small"
                                        >
                                            {Branch.map((branch: any) => (
                                                <MenuItem key={branch.id} value={branch.id}>
                                                    {branch.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
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
                                    style={{ width: '50%', resize: 'vertical' }}
                                    value={remark.remark}
                                    onChange={handleRemarkChange}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleRemarkSubmit}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>

                    {/* Snackbar for displaying success message */}
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

