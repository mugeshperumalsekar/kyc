import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, TablePagination, IconButton, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, FormControl, InputLabel, Select, MenuItem, Grid, TextField, SelectChangeEvent } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Header from '../../../layouts/header/header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PendingAlertApiService from '../../../data/services/seacrh/PendingAlert/pendingalert-api-service';
import HitdatalifecycleApiService from '../../../data/services/seacrh/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/seacrh/hitcase/hitcase-api-service';
import { SancHitSearchData, SancSearchData } from '../../../data/services/master/document/document_payload';
import DocumentApiService from '../../../data/services/master/document/Document_api_service';
import statusApiService from '../../../data/services/master/status/status-api-service';

interface Status {
    id: string;
    name: string;
};

function SancSearchDetails() {

    const [sanctionData, setSanctionData] = useState<SancSearchData[]>([]);
    const [hitRecordDataSanc, setHitRecordDataSanc] = useState<SancHitSearchData[] | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [statusData, setStatusData] = useState<Status[]>([]);
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const userId = loginDetails.uid;
    const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
    const navigate = useNavigate();

    const documentApiService = new DocumentApiService();
    const authService = new PendingAlertApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitcaseApiService = new HitcaseApiService();

    useEffect(() => {
        fetchStatus();
        handlePendingAlertClick();
    }, [page, rowsPerPage]);

    const handlePendingAlertClick = async () => {
        try {
            let results = await authService.getpendingalertdetails();
            setSearchResults(results);
        } catch (error) {
            console.log("Error fetching the handlePendingAlertClick:", error);
        }
    };

    useEffect(() => {
        fetchSancData();
        fetchStatus();
    }, []);

    const handleIconClick = (row: number) => {
        const currentIndex = page * rowsPerPage + row;
        const existingAction = selectedActions[currentIndex] || '';
        const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
        setSelectedStatus(existingAction);
        setRemarks(existingRemarks);
        setSelectedRow(currentIndex);
        setIsRemarksDialogOpen(true);
    };

    const getStatusName = (action: string) => {
        const status = statusData.find((status) => status.id === action);
        if (status) {
            const statusClassMap: { [key: string]: string } = {
                '1': 'green-text',
                '2': 'red-text',
                '3': 'yellow-text',
            };
            const statusClass = statusClassMap[status.id];
            if (statusClass) {
                return (
                    <span className={statusClass}>
                        {status.name}
                    </span>
                );
            } else {
                return status.name;
            }
        } else {
            return '';
        }
    };

    const fetchSancData = async () => {
        try {
            const data = await documentApiService.getSanSearch();
            setSanctionData(data);
        } catch (error) {
            console.error('Error fetching sanction data:', error);
        }
    };

    const fetchHitRecordDataSanc = async (searchId: number) => {
        try {
            const data = await documentApiService.getSanHitSearch(searchId);
            setHitRecordDataSanc(data);
        } catch (error) {
            console.error('Error fetching hit record data:', error);
        }
    };

    const handleRowClick = (id: number) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
        } else {
            fetchHitRecordDataSanc(id);
            setExpandedRowId(id);
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value as string);
    };

    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemarks(event.target.value);
    };

    const handleOpenRemarksDialog = () => {
        setIsRemarksDialogOpen(true);
    };

    const handleCloseRemarksDialog = () => {
        setIsRemarksDialogOpen(false);
        setSelectedStatus('');
        setRemarks('');
    };

    const status = new statusApiService();

    const fetchStatus = async () => {
        try {
            const statuses: Status[] = await status.getStatus();
            const filteredStatuses = statuses.filter(status => status.name === 'close' || status.name === 'Escalation');
            setStatusData(statuses);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    const handleRemarksSubmit = async () => {
        try {
            if (selectedRow !== null && selectedRow >= 0) {
                const updatedRemarksAndActions = [...remarksAndActions];
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
                setRemarksAndActions(updatedRemarksAndActions);
                const selectedSearchResult = searchResults[selectedRow];
                if (selectedSearchResult) {
                    const hitdatalifecyclePayload = {
                        searchId: selectedSearchResult.searchId,
                        criminalId: selectedSearchResult.criminalId,
                        statusId: selectedStatus,
                        remark: remarks,
                        hitId: selectedSearchResult.hitId,
                        levelId: '2',
                        caseId: '0',
                        uid: userId
                    };
                    const hitcasePayload = {
                        display: '-',
                        searchId: selectedSearchResult.searchId,
                        hitId: selectedSearchResult.hitId,
                        criminalId: selectedSearchResult.criminalId,
                        levelId: '2',
                        statusNowId: selectedStatus,
                        cycleId: '1',
                        remark: remarks,
                        uid: userId
                    };
                    if (parseInt(selectedStatus) == 1) {
                        await hitdatalifecycleApiService.CreateHitrecordlifecycle(hitdatalifecyclePayload);
                    }
                    if (parseInt(selectedStatus) == 2) {
                        alert(hitcasePayload.criminalId);
                        await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
                    }
                }
            }
            setIsRemarksDialogOpen(false);
        } catch (error) {
            console.error("Error submitting remarks:", error);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, justifyContent: 'center' }}>
                    <h4 style={{ marginTop: '6%', textAlign: 'center' }}>SANCTION SEARCH DETAILS</h4>
                    <div className="d-flex justify-content-end" style={{ marginRight: '24%' }}>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/ScreeningDetails')}>Back</button>
                    </div>
                    <Card sx={{ padding: '16px', boxShadow: 3, marginTop: 2, width: '50%', marginLeft: '25%' }}>
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '4px' }}>S.No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '4px' }}>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sanctionData && sanctionData.slice().reverse().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <React.Fragment key={row.id}>
                                            <TableRow
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                                                    '&:hover': { backgroundColor: '#e3f2fd' },
                                                    transition: 'background-color 0.3s ease',
                                                    height: '48px'
                                                }}
                                                onClick={() => handleRowClick(row.id)}
                                            >
                                                <TableCell sx={{ padding: '4px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell sx={{ padding: '4px' }}>{row.name}</TableCell>
                                            </TableRow>
                                            {expandedRowId === row.id && hitRecordDataSanc && hitRecordDataSanc.length > 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{ padding: 0 }}>
                                                        <Box
                                                            sx={{
                                                                padding: '8px',
                                                                backgroundColor: '#f5f5f5',
                                                                borderTop: '1px solid #e0e0e0',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '8px',
                                                                width: '100%',
                                                                boxSizing: 'border-box'
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Typography variant="h6" sx={{ flexGrow: 1 }}>Screening Record</Typography>
                                                                <IconButton onClick={() => setExpandedRowId(null)}>
                                                                    <ArrowDropUpIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                            <TableContainer>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Name</TableCell>
                                                                            <TableCell>Matching Score</TableCell>
                                                                            <TableCell>Display</TableCell>
                                                                            <TableCell>Status</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {hitRecordDataSanc.map((record, index) => {
                                                                            const selectedAction = selectedActions[index] || '';
                                                                            return (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{record.name}</TableCell>
                                                                                    <TableCell>{record.matchingScore}</TableCell>
                                                                                    <TableCell>{record.display}</TableCell>
                                                                                    <TableCell>
                                                                                        <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                                                                            {selectedAction ? (
                                                                                                <VisibilityIcon style={{ color: 'red' }} />
                                                                                            ) : (
                                                                                                <VisibilityIcon style={{ color: 'green' }} />
                                                                                            )}
                                                                                        </IconButton>
                                                                                        {selectedAction && <span>{getStatusName(selectedAction)}</span>}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={sanctionData ? sanctionData.length : 0}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                                sx={{ mt: 2 }}
                            />
                        </TableContainer>
                    </Card>
                    <Dialog
                        open={isRemarksDialogOpen}
                        onClose={handleCloseRemarksDialog}
                        fullWidth
                        maxWidth="md"
                    >
                        <DialogTitle>Enter Remarks</DialogTitle>
                        <DialogContentText style={{ textAlign: 'center' }}>
                            Select a status and enter remarks for this employee.
                        </DialogContentText>
                        <DialogContent>
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
                                                defaultValue="Default Value"
                                                onChange={handleRemarksChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleRemarksSubmit} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </>
    );
}

export default SancSearchDetails;