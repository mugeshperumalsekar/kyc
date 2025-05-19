import React, { useState, useEffect, useRef } from 'react';
import { TextField, Table, CardContent, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton } from '@mui/material'
import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SelectChangeEvent } from '@mui/material';
import Header from '../../../layouts/header/header';
import statusApiService from '../../../data/services/master/status/status-api-service';
import { useSelector } from 'react-redux';
import PendingcasesApiService from '../../../data/services/pep_search/pendingcases/pending-api-service';
import RIFApiService from '../../../data/services/pep_search/rif/rif-api-service';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import '../../CommonStyle/Style.css';
import '../../../pages/tracker/Tracker.css';

interface Pendingcase {
    searchId: string;
    criminalId: string;
    hitId: string;
    criminalName: string;
    matchingScore: string;
    remark: string;
    levelId: string;
    statusId: string;
    caseId: string;
    searchName: string;
};

interface RIF {
    caseId: string;
    criminalId: string;
    hitdataId: string;
    levelId: string;
    searchId: string;
    statusId: string;
    matchScore: string;
    country: string;
    state: string;
    dob: string;
    remark: string;
    uid: string;
    criminalName: string;
    name: string;
    searchingScore: string;
};

interface Remark {
    id: number;
    criminalId: number;
    hitdataId: number;
    levelId: number;
    remark: string;
    searchId: number;
    statusId: number;
};

interface RemarkRfi {
    id: number;
    criminalId: number;
    hitdataId: number;
    levelId: number;
    remark: string;
    searchId: number;
    statusId: number;
};

interface RemarkTwo {
    remark: string;
};

interface LevelTwo {
    remark: string;
};

interface Status {
    id: string;
    name: string;
};

interface RemarkDetails {
    level: string;
    remark: string;
    createdAt: string;
    status: String;
};

const Level3RIF = () => {

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [name, setName] = useState('');
    const [identity, setIdentity] = useState('');
    const [page, setPage] = useState(0);
    const [pageRfi, setPageRfi] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rowsPerPageRfi, setRowsPerPageRfi] = useState(5);
    const [serialNumber, setSerialNumber] = useState(1);
    const [serialNumberRfi, setSerialNumberRfi] = useState(1);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [isRemarksDialogOpenRif, setIsRemarksDialogOpenRif] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedStatusRfi, setSelectedStatusRfi] = useState('');
    const [remarks, setRemarks] = useState('');
    const [remarksRfi, setRemarksRfi] = useState('');
    const status = new statusApiService();
    const [statusData, setStatusData] = useState<any[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [pendingcase, setPendingcase] = useState<Pendingcase[]>([]);
    const [pendingRif, setPendingRif] = useState<RIF[]>([]);
    const authService = new PendingcasesApiService();
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [selectedRowRfi, setSelectedRowRfi] = useState<number | null>(null);
    const [rowStatuses, setRowStatuses] = useState<{ [key: number]: { status: string; remarks: string } }>({});
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
    const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
    const [selectedActionsRfi, setSelectedActionsRfi] = useState<{ [key: number]: string }>({});
    const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
    const [remarksAndActionsRfi, setRemarksAndActionsRfi] = useState<{ action: string; remarks: string }[]>([]);
    const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedActionRfi, setSelectedActionRfi] = useState<string | null>(null);
    const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
    const [showRIFTable, setShowRIFTable] = useState(false);
    const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
    const [selectedSerialNumberRfi, setSelectedSerialNumberRfi] = useState<number | null>(null);
    const rifService = new RIFApiService();
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<Pendingcase | null>(null);
    const [selectedCourierTrackerRfi, setSelectedCourierTrackerRfi] = useState<RIF | null>(null);
    const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
    const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
    const [levelOneRemarkRfi, setLevelOneRemarkRfi] = useState<RemarkRfi[]>([]);
    const [levelTwoRemarkRfi, setLevelTwoRemarkRfi] = useState<RemarkTwo[]>([]);
    const [levelTwo, setLevelTwo] = useState<LevelTwo[]>([]);
    const [levelThree, setLevelThree] = useState<LevelTwo[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorMessageRfi, setErrorMessageRfi] = useState<string | null>(null);
    const [activeButton, setActiveButton] = useState<null | 'pendingCase' | 'pendingRIF'>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [remarkDetails, setRemarkDetails] = useState<RemarkDetails[]>([]);

    useEffect(() => {
        fetchStatus();
        handlePendingAlertClick();
    }, [page, rowsPerPage]);

    const remarksRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedStatus && remarksRef.current) {
            remarksRef.current.focus();
        }
    }, [selectedStatus]);

    const handlePendingAlertClick = async () => {
        try {
            let results = await authService.getPendingcaseRIF();
            setShowPendingCaseTable(true);
            setShowPendingRIFTable(false);
            setPendingcase(results);
            setSearchResults(results);
            setActiveButton('pendingCase');
        } catch (error) {
            console.log("Error fetching the handlePendingAlertClick:", error);
        }
    };

    const handlePendingRIFClick = async () => {
        try {
            let results = await rifService.getpendingRIF();
            setShowPendingRIFTable(true);
            setShowPendingCaseTable(false);
            setPendingRif(results);
            setSearchResults(results);
            setActiveButton('pendingRIF');
        } catch (error) {
            console.log("Error fetching the handlePendingRIFClick:", error);
        }
    };

    const fetchStatus = async () => {
        try {
            const statuses: Status[] = await status.getPepStatus();
            const filteredStatuses = statuses.filter((status: Status) => {
                return status.name === "Close" || status.name === "Escalation";
            });
            setStatusData(filteredStatuses);
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };

    const handleCloseRemarksDialog = () => {
        setIsRemarksDialogOpen(false);
        setSelectedStatus('');
        setRemarks('');
        setErrorMessage(null);
    };

    const handleCloseRemarksDialogRif = () => {
        setIsRemarksDialogOpenRif(false);
        setSelectedStatusRfi('');
        setRemarksRfi('');
        setErrorMessageRfi(null);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
        setErrorMessage(null);
    };

    const handleStatusChangeRif = (event: SelectChangeEvent<string>) => {
        setSelectedStatusRfi(event.target.value);
        setErrorMessageRfi(null);
    };

    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemarks(event.target.value);
        setErrorMessage(null);
    };

    const handleRemarksChangeRif = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemarksRfi(event.target.value);
        setErrorMessageRfi(null);
    };

    const handleIconClick = (index: number) => {
        if (!pendingcase || !Array.isArray(pendingcase)) {
            console.error('pendingcase is undefined or not an array');
            return;
        }
        const currentIndex = page * rowsPerPage + index;
        const selectedSearchResult = pendingcase[currentIndex];
        if (!selectedSearchResult) {
            console.error('Selected search result is undefined');
            return;
        }
        const existingAction = selectedActions[currentIndex] || '';
        const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
        const criminalId = Number(selectedSearchResult.criminalId);
        const hitdataId = Number(selectedSearchResult.hitId);
        setSelectedStatus(existingAction);
        setSelectedCourierTracker(selectedSearchResult);
        setRemarks(existingRemarks);
        setSelectedRow(currentIndex);
        setIsRemarksDialogOpen(true);
        handleRemarkDetails(hitdataId);
    };

    const handleRIFIconClick = (INDEX: number) => {
        const currentIndex = pageRfi * rowsPerPageRfi + INDEX;
        const existingAction = selectedActionsRfi[currentIndex] || '';
        const existingRemarks = remarksAndActionsRfi[currentIndex]?.remarks || '';
        const selectedSearchResult = pendingRif[currentIndex];
        const hitdataId = Number(selectedSearchResult.hitdataId);
        setSelectedCourierTrackerRfi(selectedSearchResult);
        setSelectedStatusRfi(existingAction);
        setRemarksRfi(existingRemarks);
        setSelectedRowRfi(currentIndex);
        setIsRemarksDialogOpenRif(true);
        handleRemarkDetails(hitdataId);
    };

    const handleRemarkDetails = async (hitdataId: number) => {
        try {
            const response = await authService.getRemarkDetails(hitdataId);
            setRemarkDetails(response);
        } catch (error) {
            console.log("Error fetching the handleRemarkDetails:", error);
        }
    };

    const handleRemarksSubmit = async () => {
        try {
            if (selectedStatus === '') {
                setErrorMessage('Please select a status.');
                return;
            }
            if (!remarks.trim()) {
                setErrorMessage('Remarks cannot be empty.');
                return;
            }
            setErrorMessage(null);
            if (selectedRow !== null && selectedRow >= 0) {
                const updatedRemarksAndActions = [...remarksAndActions];
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
                setRemarksAndActions(updatedRemarksAndActions);
                const selectedSearchResult = searchResults[selectedRow];
                if (selectedSearchResult) {
                    const PindingcasesPayload = {
                        searchId: selectedSearchResult.searchId,
                        criminalId: selectedSearchResult.criminalId,
                        statusId: selectedStatus,
                        remark: remarks,
                        hitId: selectedSearchResult.hitId,
                        levelId: '4',
                        caseId: selectedSearchResult.caseId,
                        uid: loginDetails.id,
                        criminalName: '',
                        matchingScore: '0'
                    };
                    await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
                    handlePendingAlertClick();
                }
            }
            setIsRemarksDialogOpen(false);
        } catch (error) {
            console.error('Error submitting remarks:', error);
            setErrorMessage('An error occurred while submitting remarks.');
        }
    };

    const handleTableRowClick = (ids: number) => {
        const uid = loginDetails.id;
        const id = String(ids);
        const content = (
            <iframe
                src={`/ViewDesign/${id}/${uid}`}
                title="View Design"
                style={{ width: '100%', height: '80vh', border: 'none' }}
            />
        );
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleRemarksSubmitRfi = async () => {
        try {
            if (selectedStatusRfi === '') {
                setErrorMessageRfi('Please select a status.');
                return;
            }
            if (!remarksRfi.trim()) {
                setErrorMessageRfi('Remarks cannot be empty.');
                return;
            }
            setErrorMessageRfi(null);
            if (selectedRowRfi !== null && selectedRowRfi >= 0) {
                const updatedRemarksAndActions = [...remarksAndActionsRfi];
                updatedRemarksAndActions[selectedRowRfi] = { action: selectedStatusRfi, remarks };
                setRemarksAndActionsRfi(updatedRemarksAndActions);
                const selectedSearchResult = searchResults[selectedRowRfi];
                if (selectedSearchResult) {
                    const PindingcasesPayload = {
                        searchId: selectedSearchResult.searchId,
                        criminalId: selectedSearchResult.criminalId,
                        statusId: selectedStatusRfi,
                        remark: remarksRfi,
                        hitId: selectedSearchResult.hitdataId,
                        levelId: '4',
                        caseId: '0',
                        uid: loginDetails.id,
                        criminalName: selectedSearchResult.name,
                        matchingScore: '0'
                    };
                    await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
                    handlePendingRIFClick();
                }
            }
            setIsRemarksDialogOpenRif(false);
        } catch (error) {
            console.error('Error submitting remarks:', error);
            setErrorMessageRfi('An error occurred while submitting remarks.');
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
                    <Box sx={{ marginLeft: '15px', marginBottom: '20px', marginTop: '44px' }}>
                        <Typography className='allHeading'>LEVEL 3 SEARCH</Typography>
                    </Box>
                    <Box mb={4}>
                        <Grid container spacing={2} justifyContent="center">
                            {showPendingCaseTable && (
                                <TableContainer
                                    component={Card}
                                    style={{ overflow: 'auto', maxHeight: '400px', width: '95%', }}>
                                    {/* <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}> */}
                                    <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                            <TableRow className="tableHeading">
                                                <TableCell style={{ padding: '4px', minWidth: '80px', backgroundColor: '#D3D3D3' }}>
                                                    <Typography variant="caption" style={{ fontWeight: 'bold', }}> <span>S.No</span></Typography>   </TableCell>
                                                <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }} >
                                                    <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Search Name</span></Typography></TableCell>
                                                <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }} >
                                                    <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Hit Name</span></Typography></TableCell>
                                                <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                                                    <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Score</span></Typography>  </TableCell>
                                                <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                                                    <Typography variant="caption" style={{ fontWeight: 'bold' }}><span>Remark</span></Typography>  </TableCell>
                                                <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                                                    <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Action</span></Typography></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pendingcase && pendingcase.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '4px', }}>
                                                        <Typography variant="h6" color="textSecondary"><span>Not Available</span></Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (pendingcase && pendingcase.map((alert, index) => (
                                                <TableRow key={index} style={{ height: '32px' }}>
                                                    <TableCell style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
                                                    <TableCell style={{ padding: '4px', }}><span>{alert.searchName.charAt(0).toUpperCase() + alert.searchName.slice(1)}</span></TableCell>
                                                    <TableCell onClick={() => handleTableRowClick(Number(alert.criminalId))} style={{
                                                        cursor: 'pointer',
                                                        color: '#3F51B5',
                                                        textDecoration: 'underline',
                                                        padding: '4px',
                                                    }}>
                                                        <span>{alert.criminalName.charAt(0).toUpperCase() + alert.criminalName.slice(1)}</span></TableCell>
                                                    <TableCell style={{ padding: '4px', }} > <span>{alert.matchingScore}</span></TableCell>
                                                    {/* <TableCell style={{ padding: '4px', }}><span> {alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}</span> </TableCell> */}
                                                    <TableCell style={{ padding: '4px' }}>
                                                        <span>
                                                            {alert.remark.length > 20
                                                                ? alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1, 20) + '...'
                                                                : alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                                            {selectedAction ? (
                                                                <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                                            ) : (
                                                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                                            )}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Grid>
                        <Grid container spacing={1} alignItems="center" justifyContent="center">
                            {showPendingRIFTable && (
                                <TableContainer component={Card} style={{ width: "85%", margin: "20px" }}>
                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                            <TableRow className="tableHeading">
                                                <TableCell><strong>S.No</strong></TableCell>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Matching Score</strong></TableCell>
                                                <TableCell><strong>Remark</strong></TableCell>
                                                <TableCell><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pendingRif.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
                                                        <Typography variant="h6" color="textSecondary">
                                                            <span>
                                                                Not Available
                                                            </span>
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (pendingRif.map((alert, index) => (
                                                <TableRow>
                                                    <TableCell><span>{index + 1}</span></TableCell>
                                                    <TableCell onClick={() => handleTableRowClick(Number(alert.criminalId))} style={{ cursor: 'pointer' }}>
                                                        <span>{alert.name.charAt(0).toUpperCase() + alert.name.slice(1) || 'Not Available'}</span></TableCell>
                                                    <TableCell><span>{alert.searchingScore.charAt(0).toUpperCase() + alert.searchingScore.slice(1) || 'Not Available'}</span></TableCell>
                                                    <TableCell><span>{alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}</span></TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleRIFIconClick(index)} style={{ padding: '1px 1px' }}>
                                                            {selectedActionRfi ? (
                                                                <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                                            ) : (
                                                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                                            )}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Box >
            <Dialog
                open={isRemarksDialogOpen}
                onClose={handleCloseRemarksDialog}
                scroll="body"
                maxWidth="md"
                fullWidth>
                <DialogActions>
                    <Button onClick={handleCloseRemarksDialog} color="primary">
                        <ClearIcon />
                    </Button>
                </DialogActions>
                {selectedCourierTracker && (
                    <>
                        <Card
                            style={{
                                margin: '-3px 0',
                                boxShadow: 'rgb(0 0 0/28%) 0px 4px 8px',
                                width: '90%',
                                marginLeft: '4%',
                                borderRadius: '8px',
                                fontFamily: 'Bookman Old Style',
                                marginTop: '-1%',
                                maxHeight: '250px',
                                overflowY: 'auto',
                            }}>
                            <span style={{ marginLeft: '3%', marginTop: '1%', fontSize: 'Large', fontWeight: 'bold' }}>
                                {selectedCourierTracker.criminalName.charAt(0).toUpperCase() + selectedCourierTracker.criminalName.slice(1) || 'Not Available'}
                            </span>
                            <span style={{ marginLeft: '3%' }}>
                                Search Name : {selectedCourierTracker.searchName.charAt(0).toUpperCase() + selectedCourierTracker.searchName.slice(1) || 'Not Available'}
                            </span>
                            <span style={{ marginLeft: '3%' }}>
                                Matching Score : {selectedCourierTracker.matchingScore || 'Not Available'}
                            </span>
                            <ul className="timeline">
                                {remarkDetails && remarkDetails.length > 0 ? (
                                    (() => {
                                        let displayedLevels = new Set();
                                        return remarkDetails.map((detail, index) => {
                                            const isLevelDisplayed = displayedLevels.has(detail.level);
                                            displayedLevels.add(detail.level);
                                            return (
                                                <li className="list active" key={index}>
                                                    <div className="list-content">
                                                        <div className="details">
                                                            {!isLevelDisplayed && (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span className="status-title" style={{ fontSize: 'small', fontWeight: 'bold', marginRight: '8px' }}>
                                                                        {detail.level || 'Not Available'}
                                                                    </span>
                                                                    <span className="status-title" style={{ color: '#8f98a1', fontSize: 'small' }}>
                                                                        {detail.status || 'Not Available'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div></div>
                                                            <span className="status-title" style={{ color: '#8f98a1', fontSize: 'smaller' }}>
                                                                {detail.createdAt || 'Not Available'}
                                                            </span>
                                                            <div></div>
                                                            <span className="status-title" style={{ color: '#080807', fontSize: 'small' }}>
                                                                {detail.remark.charAt(0).toUpperCase() + detail.remark.slice(1) || 'Not Available'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        });
                                    })()
                                ) : (
                                    <span style={{ color: '#8f98a1' }}>No Remarks Available</span>
                                )}
                            </ul>
                        </Card>
                    </>
                )}
                <DialogContentText style={{ textAlign: 'center', marginTop: '2%' }}>
                    Select a status and enter remarks for this employee.
                </DialogContentText>
                {errorMessage && (
                    <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                        {errorMessage}
                    </Typography>
                )}
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                            >
                                <MenuItem value="">Select Status</MenuItem>
                                {statusData.map((status) => (
                                    <MenuItem key={status.id} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {selectedStatus && (
                    <div>
                        <DialogContentText style={{ textAlign: 'center' }}>
                            Enter your remarks for this action.
                        </DialogContentText>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="outlined-multiline-static"
                                    label="Remarks"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={remarks}
                                    inputRef={remarksRef}
                                    defaultValue="Default Value"
                                    onChange={handleRemarksChange}
                                />
                            </Grid>
                        </Grid>
                    </div>
                )}
                <DialogActions>
                    <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                        Save
                    </button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={isRemarksDialogOpenRif}
                onClose={handleCloseRemarksDialogRif}
                fullWidth
                maxWidth="md"
            >
                <DialogActions>
                    <Button onClick={handleCloseRemarksDialogRif} color="primary">
                        <ClearIcon />
                    </Button>
                </DialogActions>
                {selectedCourierTrackerRfi && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                                {selectedCourierTrackerRfi.name}
                            </div>
                            <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
                                {`Matching Score: ${selectedCourierTrackerRfi.searchingScore}`}
                            </div>
                        </div>
                        <Card style={{ margin: '20px 0', boxShadow: 'rgb(0 0 0/28%)0px 4px 8px', width: '90%', marginLeft: '5%', maxHeight: '300px', borderRadius: '8px' }}>
                            <CardContent>
                                <Timeline position="left">
                                    <TimelineItem>
                                        <TimelineContent>{levelOneRemark.length > 0 && levelOneRemark[0].remark
                                            ? levelOneRemark[0].remark : levelTwo.length > 0 && levelTwo[0].remark ? levelTwo[0].remark : "Not Available"}</TimelineContent>
                                        <TimelineSeparator>
                                            <TimelineDot style={{ background: '#1976d2' }} />
                                            <TimelineConnector style={{ background: '#1976d2' }} />
                                        </TimelineSeparator>
                                        <TimelineContent style={{ fontWeight: 'bold' }}>L1 First Review</TimelineContent>
                                    </TimelineItem>
                                    <TimelineItem>
                                        <TimelineContent>{levelTwoRemarkRfi.length > 0 ? levelTwoRemarkRfi[0].remark : "Not Available"}</TimelineContent>
                                        <TimelineSeparator>
                                            <TimelineDot style={{ background: '#1976d2' }} />
                                            <TimelineConnector style={{ background: '#1976d2' }} />
                                        </TimelineSeparator>
                                        <TimelineContent style={{ fontWeight: 'bold' }}>L1 Second Review</TimelineContent>
                                    </TimelineItem>
                                    <TimelineItem>
                                        <TimelineContent>{levelOneRemarkRfi.length > 0 && levelOneRemarkRfi[0].remark
                                            ? levelOneRemarkRfi[0].remark
                                            : levelThree.length > 0 && levelThree[0].remark
                                                ? levelThree[0].remark
                                                : "Not Available"}</TimelineContent>
                                        <TimelineSeparator>
                                            <TimelineDot style={{ background: '#1976d2' }} />
                                            <TimelineConnector style={{ background: '#1976d2' }} />
                                        </TimelineSeparator>
                                        <TimelineContent style={{ fontWeight: 'bold' }}>L2 Search Review</TimelineContent>
                                    </TimelineItem>
                                    <TimelineItem>
                                        <TimelineContent>{selectedCourierTrackerRfi.remark || "Not Available"}</TimelineContent>
                                        <TimelineSeparator>
                                            <TimelineDot style={{ background: '#388e3c' }} />
                                        </TimelineSeparator>
                                        <TimelineContent style={{ fontWeight: 'bold' }}>L3 Search Review</TimelineContent>
                                    </TimelineItem>
                                </Timeline>
                            </CardContent>
                        </Card>
                    </>
                )}
                <DialogTitle style={{ marginLeft: '2%' }}>Enter Remarks</DialogTitle>
                <DialogContentText style={{ textAlign: 'center' }}>
                    Select a status and enter remarks for this employee.
                </DialogContentText>
                <DialogContent>
                    {errorMessageRfi && (
                        <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                            {errorMessageRfi}
                        </Typography>
                    )}
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={selectedStatusRfi}
                                    onChange={handleStatusChangeRif}
                                >
                                    <MenuItem value="">Select Status</MenuItem>
                                    {statusData.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {selectedStatusRfi && (
                        <div>
                            <DialogContentText style={{ textAlign: 'center' }}>
                                Enter your remarks for this action.
                            </DialogContentText>
                            <Grid container alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="outlined-multiline-static"
                                        label="Remarks"
                                        type="text"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={remarksRfi}
                                        defaultValue="Default Value"
                                        onChange={handleRemarksChangeRif}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmitRfi}>
                        Save
                    </button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullWidth
                maxWidth="lg"
            >
                <DialogContent sx={{
                    padding: '0px',
                    overflowY: 'unset',
                }}>
                    {modalContent}
                </DialogContent>
                <DialogActions>
                    <button type="button" className="btn btn-outline-primary" onClick={() => setIsModalOpen(false)}>Close</button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Level3RIF;