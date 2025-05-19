import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, Paper, TableSortLabel, IconButton, SelectChangeEvent, Dialog, DialogActions, Button, DialogTitle, DialogContentText, DialogContent, Grid, FormControl, InputLabel, Select, MenuItem, TextField, } from '@mui/material';
import SearchApiService from '../../data/services/pep_search/search-api-service';
import Header from '../../layouts/header/header';
import VisibilityIcon from '@mui/icons-material/Visibility';
import statusApiService from '../../data/services/master/status/status-api-service';
import ClearIcon from '@mui/icons-material/Clear';
interface Status {
    id: string;
    name: string;
}

const CmsHitRecordDetails = () => {
    const { searchId } = useParams<{ searchId: string }>();
    const [hitRecordData, setHitRecordData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<Status[]>([]);
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const searchApiService = new SearchApiService();
    const status = new statusApiService();

    useEffect(() => {
        fetchStatus();
        if (searchId) {
            fetchHitRecordData(parseInt(searchId));
        }
    }, [searchId]);

    const fetchHitRecordData = async (searchId: number) => {
        try {
            const data = await searchApiService.getCmsHitSearch(searchId);
            setHitRecordData(data);
        } catch (error) {
            console.error('Error fetching hit record data:', error);
        }
    };

    const fetchStatus = async () => {
        try {
            const statuses: Status[] = await status.getStatus();
            setStatusData(statuses);
        } catch (error) {
            console.error('Error fetching statuses:', error);
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

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <h4 style={{ marginTop: '6%' }}>Cms HitRecord Details</h4>
                <Card sx={{ padding: 2, boxShadow: 3, height: '100%' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        <TableSortLabel>Sl.No</TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableSortLabel>Name</TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableSortLabel>Matching Score</TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center">Display</TableCell>
                                    <TableCell align="center" >Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hitRecordData.length ? (
                                    hitRecordData.map((record, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center">{record.name}</TableCell>
                                            <TableCell align="center">{record.matchingScore}</TableCell>
                                            <TableCell align="center">{record.display}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary" size="small" onClick={handleOpenRemarksDialog}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No hit records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
                <Dialog
                    open={isRemarksDialogOpen}
                    onClose={handleCloseRemarksDialog}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogActions>
                        <Button onClick={handleCloseRemarksDialog} color="primary">
                            <ClearIcon />
                        </Button>
                    </DialogActions>

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
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Remarks"
                                            value={remarks}
                                            onChange={handleRemarksChange}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={6}>
                                <Button
                                    onClick={handleCloseRemarksDialog}
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
};

export default CmsHitRecordDetails;
