import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Typography, IconButton, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { Slider } from '@mui/material';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewService from '../../data/services/pep_search/viewpage/view_api_service';
import { Country, List, Program, SearchDTO, RecordDTO } from '../../data/services/pep_search/viewpage/view_payload';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../data/services/pep_search/hitcase/hitcase-api-service';
import statusApiService from '../../data/services/master/status/status-api-service';
import '../CommonStyle/Style.css';

export interface Employee {
    id: number;
    name: string;
    dob: string;
    title: string;
    lastName: string;
    state: string;
    dist: string;
    address: string;
    designation: string;
    ministry: string;
    placeOfBirth: string;
    coName: string;
    department: string;
    Country: string;
};

interface Status {
    id: string;
    name: string;
};

function PepDetails() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const { id } = useParams();

    const [formData, setFormData] = useState<RecordDTO>({
        id: 0,
        name: '',
        dob: '',
        placeOfBirth: '',
        pan: '',
        directorsIdentificationNumber: '',
        score: 0,
        hitId: 0,
        criminalId: 0,
        searchId: 0,
    });
    const [records, setRecords] = useState<RecordDTO[]>([]); 

    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [Program, setProgram] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [List, setList] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState(0);
    const [country, setCountry] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [filteredData, setFilteredData] = useState<RecordDTO[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(80);
    const [data, setData] = useState<RecordDTO[]>([]);
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    useEffect(() => {
        fetchStatus();
    }, [id]);

    const status = new statusApiService();

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

    const handleKeyPress = (e: { key: string }) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSort = (columnName: string) => {
        if (columnName === sortedColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(columnName);
            setSortDirection('asc');
        }
    };

    const [loading, setLoading] = useState<boolean>(false);
    const customer = new ViewService();

   
    const handleSearch = async () => {
        const searchDTO = {
            name: formData.name, // Name from form data
            searchingScore: sliderValue, // Score from slider
            kycId: 0, // KYC ID, populate if necessary
            applicantFormId: '', // Applicant Form ID, populate if necessary
            screeningType: 0, // Set screening type as needed
            uid: loginDetails.id,
        };

        try {
            setLoading(true);
            if (!formData.name && sliderValue === 100) {
                setSearchError(true);
                setLoading(false);
                return;
            }


            const result = await customer.getsearchDTOpep([searchDTO]);

            if (Array.isArray(result) && result.length > 0) {
                setRecords(result);
                setSearchError(false);
            } else {
                setSearchError(true);
                setRecords(result);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({ id: 0, name: '', dob: '', placeOfBirth: '', pan: '', directorsIdentificationNumber: '', score: 0, hitId: 0, criminalId: 0, searchId: 0, });
        setFilteredData([]);
        setSliderValue(80);
        setSearchError(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleTableRowClick = (ids: number) => {
        const uid = loginDetails.id;
        const id = String(ids);
        const content = (
            <iframe
                src={`scpk/ViewDesign/${id}/${uid}`}    
                title="View Design"
                style={{ width: '100%', height: '80vh', border: 'none' }}
            />
        );
        setModalContent(content);
        setIsModalOpen(true);
    };

    const exportToExcel = () => {
        try {
            const dataForExport = filteredData.map((row) => ({
                Name: row.name,
                Address: row.dob,
                Type: row.placeOfBirth,
                Program: row.pan,
                List: row.directorsIdentificationNumber,
                Score: row.score
            }));
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataForExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lookup Results");
            XLSX.writeFile(workbook, "lookup_results.xlsx");
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [remarks, setRemarks] = useState('');
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [serialNumber, setSerialNumber] = useState(1);
    const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<any | null>(null);
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitcaseApiService = new HitcaseApiService();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const remarksRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedStatus && remarksRef.current) {
            remarksRef.current.focus();
        }
    }, [selectedStatus]);

    const handleCloseRemarksDialog = () => {
        setIsRemarksDialogOpen(false);
        setSelectedStatus('');
        setRemarks('');
        setErrorMessage(null);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
        setErrorMessage(null);
    };

    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
        setRemarks(filteredValue);
        setErrorMessage(null);
    };

    useEffect(() => {
        console.log("Search results updated:", searchResults);
    }, [searchResults]);

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
            if (selectedRow !== null && selectedRow >= 0 && selectedRow < filteredData.length) {
                const updatedRemarksAndActions = [...remarksAndActions];
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
                setRemarksAndActions(updatedRemarksAndActions);
                const selectedSearchResult = filteredData[selectedRow];
                if (!selectedSearchResult) {
                    console.error("Selected search result is undefined");
                    return;
                }
                if (selectedSearchResult) {
                    const hitdatalifecyclePayload = {
                        searchId: selectedSearchResult.searchId,
                        criminalId: selectedSearchResult.id.toString(),
                        statusId: selectedStatus,
                        remark: remarks,
                        hitId: selectedSearchResult.hitId,
                        levelId: '1',
                        caseId: '0',
                        uid: loginDetails.id,
                    };
                    const hitcasePayload = {
                        display: '-',
                        searchId: selectedSearchResult.searchId,
                        hitId: selectedSearchResult.hitId,
                        criminalId: selectedSearchResult.id.toString(),
                        levelId: '1',
                        statusNowId: selectedStatus,
                        cycleId: '1',
                        remark: remarks,
                        uid: loginDetails.id,
                    };
                    // if (parseInt(selectedStatus) == 1) {
                    //     await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
                    // } else if (parseInt(selectedStatus) == 2) {
                    //     await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
                    // }
                }
                setSelectedActions({
                    ...selectedActions,
                    [selectedRow]: selectedStatus,
                });
                setIsRemarksDialogOpen(false);
            } else {
                console.error("Selected row is null, invalid, or out of bounds");
            }
        } catch (error) {
            console.error("Error submitting remarks:", error);
            setErrorMessage('An error occurred while submitting remarks.');
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card className='card' style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className="card-body" >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '95%' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={handlePrint}
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={exportToExcel}
                                        style={{ minWidth: 'unset', padding: '1px' }}
                                    >
                                        <FileDownloadIcon />
                                    </IconButton>
                                </div>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={2}>
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Name"
                                                id="Name"
                                                className="commonStyle"
                                                size='small'
                                                variant="outlined"
                                                type="text"
                                                name="name"
                                                autoComplete="off"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Slider
                                                style={{ width: '90%' }}
                                                value={sliderValue}
                                                onChange={(e, newValue) => {
                                                    console.log('Slider Value Changed:', newValue);
                                                    setSliderValue(newValue as number);
                                                }}
                                                aria-labelledby="discrete-slider"
                                                step={1}
                                                marks
                                                min={50}
                                                max={100}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                style={{ width: '55px' }}
                                                id="max-score"
                                                size='small'
                                                label="score"
                                                variant="outlined"
                                                type="text"
                                                name="maxScore"
                                                autoComplete="off"
                                                value={sliderValue.toString()}
                                                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button variant="contained" className='commonButton' onClick={handleSearch} onKeyPress={handleKeyPress} >Search</Button> &nbsp;
                                            <Button variant="contained" className='commonButton' onClick={handleReset}>Reset</Button>
                                        </Grid>
                                    </Grid>
                                </Card>
                                <br />
                                <div >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h6><strong>SEARCH RESULTS {filteredData.length > 0 && `(${filteredData.length})`}</strong></h6>
                                    </div>
                                </div>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid item xs={12}>
                                        <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', }} onClick={() => handleSort('name')}>
                                                            <strong>Name</strong>{sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', }} onClick={() => handleSort('address')}>
                                                            <strong>Date of Birth</strong> {sortedColumn === 'dob' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', }} onClick={() => handleSort('typeId')}>
                                                            <strong>Place Of Birth</strong> {sortedColumn === 'placeOfBirth' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', }} onClick={() => handleSort('programId')}>
                                                            <strong>Pan</strong>{sortedColumn === 'pan' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', }} onClick={() => handleSort('listId')}>
                                                            <strong>Directors Identification Number</strong> {sortedColumn === 'directorsIdentificationNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', }} onClick={() => handleSort('score')}>
                                                            <strong>Score</strong> {sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', zIndex: 1 }}><strong>Action</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {loading && (
                                                        <TableRow>
                                                            <TableCell colSpan={9} align="center">
                                                                <Typography variant="body1">Loading...</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    {!loading && filteredData.length > 0 && filteredData.map((row, index) => {
                                                        const currentIndex = page * rowsPerPage + index;
                                                        const selectedAction = selectedActions[currentIndex] || '';
                                                        return (
                                                            <React.Fragment key={row.id}>
                                                                <TableRow key={row.id} >
                                                                    <TableCell onClick={() => handleTableRowClick(row.id)} style={{
                                                                        cursor: 'pointer',
                                                                        color: 'blue',
                                                                        textDecoration: 'underline',
                                                                        backgroundColor: 'white'
                                                                    }}>{row.name}</TableCell>

                                                                    <TableCell>{row.dob}</TableCell>
                                                                    <TableCell>{row.placeOfBirth}</TableCell>
                                                                    <TableCell>{row.pan}</TableCell>
                                                                    <TableCell>{row.directorsIdentificationNumber}</TableCell>
                                                                    <TableCell>{row.score}</TableCell>
                                                                    <TableCell style={{ position: 'sticky', right: 0, backgroundColor: 'white' }}>
                                                                        <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                                                            {selectedAction ? (
                                                                                <VisibilityOffIcon style={{ color: 'red' }} />
                                                                            ) : (
                                                                                <VisibilityIcon style={{ color: 'green' }} />
                                                                            )}
                                                                        </IconButton>
                                                                        {selectedAction && (
                                                                            <span>{getStatusName(selectedAction)}</span>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                    {searchError && (
                                                        <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                            {filteredData.length === 0 ? "Your search has not returned any results." : "Atleast one search parameter is required."}
                                                        </Typography>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Card>
                            </div>
                        </Card>
                    </Box>
                </Box>
            </Box>
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
                {selectedCourierTracker && (
                    <Timeline position="left" style={{ marginRight: '50%' }}>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.name}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Name</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.matchingScore}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Matching Score</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.hitId}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">hitId</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.searchId}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">searchId</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.remark}</TimelineContent>
                            <TimelineSeparator >
                                <TimelineDot style={{ backgroundColor: 'green' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Remark</TimelineContent>
                        </TimelineItem>
                    </Timeline>
                )}
                <DialogTitle>Enter Remarks</DialogTitle>
                <DialogContentText style={{ textAlign: 'center' }}>
                    Select a status and enter remarks for this employee.
                </DialogContentText>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
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
    )
}


export default PepDetails;