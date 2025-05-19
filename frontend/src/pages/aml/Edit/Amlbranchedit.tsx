import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextareaAutosize, Snackbar } from '@mui/material';
import { Card } from 'react-bootstrap';
import MuiAlert from '@mui/material/Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RepalywriteDto } from '../../../data/services/aml/viewpage/view_payload';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import Header from '../../../layouts/header/header';

function Amldetails() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const { complaintId, uid } = useParams();
    const navigate = useNavigate();
    const [amlData, setAmlData] = useState<any>(null);

    const [AmlReplay, setAmlreplay] = useState<RepalywriteDto>({
        createAmlComplaintRemarkRequest: {
            remark: '',
            complaintId: 0,
            branchId: 0,
            uid: loginDetails.id,
        },
        createAmlComplaintReplyRequests: [
            {
                id: 0,
                complaintId: 0,
                complaintAlertId: 0,
                reply: '',
                uid: loginDetails.id,
            },
        ],
    });

    const [editRemarkDialogOpen, setEditRemarkDialogOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    useEffect(() => {
        if (complaintId) {
            fetchAmlData();
        }
    }, [complaintId]);

    const view = new ViewService();

    const fetchAmlData = async () => {
        try {
            const response = await view.getAmlCompleteTeam(complaintId);
            setAmlData(response);
            const createAmlComplaintReplyRequests = response.alertScenarioDtos.map((scenario: any) => ({
                id: 0,
                complaintId: 0,
                complaintAlertId: scenario.complaintAlertId || 0,
                reply: '',
                uid: loginDetails.id,
            }));
            setAmlreplay(prevState => ({
                ...prevState,
                createAmlComplaintReplyRequests,
            }));
        } catch (error) {
            console.error("Error fetching AML data:", error);
        }
    };

    const handleRemarkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAmlreplay({
            ...AmlReplay,
            createAmlComplaintRemarkRequest: {
                ...AmlReplay.createAmlComplaintRemarkRequest,
                remark: event.target.value
            }
        });
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

    const handleRemarkSubmit = async () => {
        try {
            if (complaintId) {
                console.log('AmlReplay:', AmlReplay);
                const createAmlComplaintReplyRequests: any[] = [];
                amlData?.alertScenarioDtos?.forEach((scenario: any, index: number) => {
                    const replyRequest = AmlReplay.createAmlComplaintReplyRequests[index];
                    if (replyRequest) {
                        const complaintAlertId = scenario.complaintAlertId || 0;
                        createAmlComplaintReplyRequests.push({
                            ...replyRequest,
                            complaintAlertId: complaintAlertId,
                            complaintId: parseInt(complaintId),
                        });
                    }
                });
                const remarkWithId: RepalywriteDto = {
                    createAmlComplaintRemarkRequest: {
                        remark: AmlReplay.createAmlComplaintRemarkRequest.remark,
                        complaintId: parseInt(complaintId),
                        branchId: 0,
                        uid: loginDetails.id,
                    },
                    createAmlComplaintReplyRequests: createAmlComplaintReplyRequests,
                };
                const response = await view.Remarkpost(remarkWithId);
                console.log('AML complaint submitted successfully:', response);
                showSuccessMessage('Aml To Branch Update successfully.');
            } else {
                console.error('Complaint ID is undefined or null.');
                showErrorMessage('Please provide a remark before submitting.');
            }
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
            showErrorMessage('Error Update Branch complaint.');
        }
    };

    const openEditRemarkDialog = (complaintId: string) => {
        setAmlreplay(prevRemark => ({
            ...prevRemark,
            complaintId: parseInt(complaintId)
        }));
        setEditRemarkDialogOpen(true);
    };

    const closeEditRemarkDialog = () => {
        setEditRemarkDialogOpen(false);
    };

    const handleUpdateRemark = async () => {
        try {
            const response = await view.Remarkpost(AmlReplay);
            console.log('AML complaint submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting AML complaint:', error);
        }
    };

    const handleReplyQryChange = (value: string, index: number) => {
        console.log(`Handling change for input box ${index + 1}:`, value);
        if (index >= 0 && index < AmlReplay.createAmlComplaintReplyRequests.length) {
            const updatedReplyRequests = AmlReplay.createAmlComplaintReplyRequests.map((request, i) => {
                const complaintAlertId = amlData?.alertScenarioDtos[index]?.complaintAlertId || 0;
                return i === index ? { ...request, reply: value, complaintAlertId } : request;
            });
            setAmlreplay(prevState => ({
                ...prevState,
                createAmlComplaintReplyRequests: updatedReplyRequests,
            }));
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
                        <h4>Aml To Branch</h4>
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
                            <Grid item xs={6}>
                                <h4>Replay</h4>
                                <Grid container spacing={2}>
                                    {amlData?.alertScenarioDtos?.map((scenario: any, index: number) => (
                                        <Grid item xs={12} key={index}>
                                            <TextField
                                                style={{ width: '100%' }}
                                                label={`Replay `}
                                                id={`replay-${index}`}
                                                size='small'
                                                variant="outlined"
                                                type="text"
                                                name={`replay-${index}`}
                                                autoComplete="off"
                                                value={AmlReplay.createAmlComplaintReplyRequests[index]?.reply || ''}
                                                onChange={(e) => handleReplyQryChange(e.target.value, index)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                    <br></br>
                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>
                        <Grid container spacing={2}>
                            <p>Remarks: {amlData?.remarkDtos?.map((remarkDto: { remark: any; }) => remarkDto.remark).join(', ')}</p>
                        </Grid>
                    </Card>
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
                                    value={AmlReplay.createAmlComplaintRemarkRequest.remark}
                                    onChange={handleRemarkChange}
                                />
                            </Grid>
                            <Grid item container xs={4} spacing={2} alignItems="center">
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleRemarkSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item>
                                </Grid>
                                <Grid item>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Dialog open={editRemarkDialogOpen} onClose={closeEditRemarkDialog} fullWidth maxWidth="md">
                            <DialogTitle>Edit Remark</DialogTitle>
                            <DialogContent>
                                <TextareaAutosize
                                    minRows={3}
                                    placeholder="Remark"
                                    style={{ width: '100%', resize: 'vertical' }}
                                    value={AmlReplay.createAmlComplaintRemarkRequest.remark}
                                    onChange={handleRemarkChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeEditRemarkDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateRemark} color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>
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
            </Box >
        </>
    )
}

export default Amldetails;