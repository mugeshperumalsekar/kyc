import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { Slider } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewService from '../../data/services/viewpage/view_api_service';
import { RecordTypeData } from '../../data/services/Search/search-payload';
import SearchService from '../../data/services/Search/search-api-service';
import { RecordDTO, SearchDTO } from '../../data/services/viewservice/viewpagedetails-payload';
import ViewPageDetailsService from '../../data/services/viewservice/viewpagedetails-api-service';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import HitdatalifecycleApiService from '../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../data/services/cms_search/hitcase/hitcase-api-service';
import SearchApiService from '../../data/services/cms_search/search-api-service';



interface Status {
    id: string;
    name: string;
    // Add other properties if necessary
}

function SearchCms() {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const userFirstName = userDetails.userData?.firstName;
    const loginDetails = userDetails.loginDetails;
    const userId = loginDetails.uid;

    const location = useLocation();
    const { id, ids } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RecordDTO>({
        cmsId: 0,
        cmsName: '',
        cmsRecordType: '',
        score: 0,
        recordTypeId: 0,
        criminalId: 0, 
        searchId: 0, 
        hitId: 0, 
        uid: loginDetails.id, 
    });



    const [RecordType, setRecordType] = useState<RecordTypeData[]>([
    ]);

    const viewservice = new ViewPageDetailsService();
    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [selectedList, setSelectedList] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [filteredData, setFilteredData] = useState<RecordDTO[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(100);
    const [data, setData] = useState<RecordDTO[]>([
    ]);
    const [records, setRecords] = useState<RecordDTO[]>([]); 


    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [statusData, setStatusData] = useState<Status[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
    const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);

    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<any | null>(null); // State to store the selected courier tracker
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [selectedRow, setSelectedRow] = useState<number | null>(null); // Initialize with null or -1 if no row is selected
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    useEffect(() => {
        fetchAll();
        fetchStatus();

    }, [ids]);





    const recordtype = new SearchService();
    const fetchAll = async () => {
        try {
            const AllData = await recordtype.getRecoredType();
            setRecordType(AllData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };









    const handleRecordTypeChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedRecordType(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleListChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedList(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleCountryChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedCountry(typeof value === 'string' ? parseInt(value) : value);
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

    const sortedData = (filteredData ?? []).length > 0 ? filteredData.sort((a, b) => {
        const valueA = String(a[sortedColumn as keyof RecordDTO]);
        const valueB = String(b[sortedColumn as keyof RecordDTO]);
        if (valueA && valueB) {
            return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return 0;
        }
    }) : [];

    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        const searchDTO = {
            name: formData.cmsName, 
            searchingScore: sliderValue, 
            recordTypeId: selectedRecordType,
            kycId: 1,
            applicantFormId: '',
            screeningType: 1, 
            uid: loginDetails.id,
        };
    
        try {
            setLoading(true);
                if (!formData.cmsName && sliderValue === 100) {
                setSearchError(true); 
                setLoading(false);
                return; 
            }
                const result = await viewservice.getRecordsCountCms(searchDTO);
            console.log("Form data result:", result); 
    
            if (Array.isArray(result) && result.length > 0) {
                setRecords(result); 
                setSearchError(false); 
            } else {
                setSearchError(true); 
                setRecords([]); 
            }
        } catch (error) {
            console.error('Error fetching records:', error); 
            setSearchError(true); 
        } finally {
            setLoading(false); 
        }
    };


    const handleReset = () => {
        setFormData({
            ...formData,
            cmsName: '',
            recordTypeId: 0,

        });
        setSliderValue(80);
        
        setRecords([]);
    };

    const handlePrint = () => {
        window.print();
    };


    const handleTableRowClick = (cmsId: string, cmsRecordType: string, recordTypeId: number) => {
        const uid = loginDetails.id;
        let route: string;
        switch (recordTypeId) {
            case 1:
                route = 'Entityview';
                break;
            case 2:
                route = 'Individualview';
                break;
            case 3:
                route = 'Shipview';
                break;
            case 4:
                route = 'Aircraftview';
                break;
            default:
                route = '';
        }
        navigate(`/view/${route}/${cmsId}/${uid}/${recordTypeId}`);
    };
    const exportToExcel = () => {
        try {

            const dataForExport = filteredData.map((row) => ({
                Name: row.cmsName,
                RecordType: row.cmsRecordType,
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

    const allValues = RecordType.map((item) => item.name).join(", ");
    const authApiService = new SearchApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitcaseApiService = new HitcaseApiService();

    const fetchStatus = async () => {
        try {
            const statuses: Status[] = await authApiService.getStatus(); // Specify the type as Status[]

            // Filter the statuses to keep only "close" and "Escalation" (matching the actual case)
            const filteredStatuses = statuses.filter((status: Status) => {
                return status.name === "close" || status.name === "Escalation";
            });

            console.log(filteredStatuses); // Add this line to check the filtered statuses
            setStatusData(filteredStatuses); // Update the statusData state with the filtered results
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };
    const handleCloseRemarksDialog = () => {
        console.log('Closing remarks dialog.');

        setIsRemarksDialogOpen(false);
        setSelectedAction(null);
        setRemarks('');
    };


    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
    };


    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
        setRemarks(filteredValue);
      };
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
            // Define a mapping from status ID to CSS class
            const statusClassMap: { [key: string]: string } = {
                '1': 'green-text', // Assuming '1' corresponds to 'Closed'
                '2': 'red-text',   // Assuming '2' corresponds to 'Escalation'
                '3': 'yellow-text', // Assuming '3' corresponds to 'Request For Information'
            };

            const statusClass = statusClassMap[status.id];

            if (statusClass) {
                return (
                    <span className={statusClass}>
                        {status.name}
                    </span>
                );
            } else {
                // If the status ID doesn't match any of the defined classes, return the status name as is
                return status.name;
            }
        } else {
            return ''; // Handle cases where the status is not found
        }
    };
    const handleRemarksSubmit = async () => {
        try {
            if (selectedRow !== null && selectedRow >= 0 && selectedRow < filteredData.length) {
                const updatedRemarksAndActions = [...remarksAndActions];
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

                setRemarksAndActions(updatedRemarksAndActions);

                const selectedSearchResult = filteredData[selectedRow];
                console.log("selectedRow:", selectedRow);
                console.log("filteredData:", filteredData);

                if (!selectedSearchResult) {
                    console.error("Selected search result is undefined");
                    alert("Selected search result is undefined. Check console for more details.");
                    return;
                }

                alert(JSON.stringify(selectedSearchResult)); // Display the selectedSearchResult in an alert

                if (selectedSearchResult) {
                    const hitdatalifecyclePayload = {
                        searchId: selectedSearchResult.searchId,
                        criminalId: selectedSearchResult.cmsId.toString(),  // Convert ids value to string

                        statusId: selectedStatus,
                        remark: remarks,
                        hitId: selectedSearchResult.hitId,
                        levelId: '1',
                        caseId: '0',
                        uid: userId
                    };

                    const hitcasePayload = {
                        display: '-',
                        searchId: selectedSearchResult.searchId,
                        hitId: selectedSearchResult.hitId,
                        criminalId: selectedSearchResult.cmsId.toString(),  // Convert ids value to string

                        levelId: '1',
                        statusNowId: selectedStatus,
                        cycleId: '1',
                        remark: remarks,
                        uid: userId
                    };

                    console.log("hitdatalifecycle Payload:", hitdatalifecyclePayload);
                    console.log("hitCasePayload:", hitcasePayload);

                    // if (parseInt(selectedStatus) == 1) {
                    //     await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
                    // } else if (parseInt(selectedStatus) == 2) {
                    //     alert(hitcasePayload.criminalId);
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
        }
    };



    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>

                            <div className="card-body" style={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>LOOK UP</h4>
                                    <Button variant="contained" color="primary" onClick={handlePrint}>
                                        <PrintIcon />
                                    </Button>
                                </div>
                                <br></br>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={2}>
                                            <FormControl style={{ width: '100%' }}>
                                                <InputLabel htmlFor="record-type">Type</InputLabel>
                                                <Select
                                                    label="Type"
                                                    size='small'
                                                    variant="outlined"
                                                    value={selectedRecordType}
                                                    onChange={handleRecordTypeChange}
                                                >

                                                    {RecordType.map((item) => (
                                                        <MenuItem key={item.id} value={item.id.toString()}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={2}>
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Name"
                                                id="Name"
                                                size='small'
                                                variant="outlined"
                                                type="text"
                                                name="name"
                                                autoComplete="off"
                                                value={formData.cmsName}
                                                onChange={(e) => setFormData({ ...formData, cmsName: e.target.value })}
                                            />
                                        </Grid>

                                        <Grid item xs={2}>
                                            <Slider
                                                style={{ width: '90%' }}
                                                value={Math.round(sliderValue)}
                                                onChange={(e, newValue) => setSliderValue(newValue as number)}
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
                                                variant="outlined"
                                                type="text"
                                                name="maxScore"
                                                autoComplete="off"
                                                value={sliderValue.toString()}
                                                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} justifyContent="center" >
                                        <Grid item xs={4}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={5}>
                                                    <br />
                                                    <Button variant="contained" onClick={handleSearch} onKeyPress={handleKeyPress} >Search</Button>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <br />
                                                    <Button variant="contained" onClick={handleReset}>Reset</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>LOOKUP RESULTS {filteredData.length > 0 && `(${filteredData.length})`}</h4>

                                    <Button
                                        variant="contained"
                                        onClick={exportToExcel}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        <FileDownloadIcon />
                                    </Button>
                                </div>
                                <br></br>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid item xs={12}>
                                        <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                <TableHead>
                                                    <TableRow>

                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('name')}>
                                                            UserName {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('address')}>
                                                            RecordType {sortedColumn === 'cmsRecordType' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>

                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('score')}>
                                                            Score {sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} >
                                                            Action
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {loading && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center">
                                                                <Typography variant="body1">Loading...</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {!loading && filteredData.length > 0 && filteredData.map((row, index) => {
                                                        const currentIndex = page * rowsPerPage + index;
                                                        const selectedAction = selectedActions[currentIndex] || '';
                                                        return (
                                                            <TableRow
                                                                key={row.cmsId}
                                                                onClick={() => handleTableRowClick(
                                                                    String(row.cmsId),
                                                                    row.cmsRecordType, // Assuming cmsRecordType is a string
                                                                    row.recordTypeId // Assuming recordTypeId is available in the row object
                                                                )}
                                                            >
                                                                <TableCell>{row.cmsName}</TableCell>
                                                                <TableCell>{row.cmsRecordType}</TableCell>
                                                                <TableCell>{row.score}</TableCell>
                                                                <TableCell>
                                                                    <IconButton onClick={(e) => { e.stopPropagation(); handleIconClick(currentIndex); }} style={{ padding: '1px 1px' }}>
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
                                                        );
                                                    })}

                                                    {searchError && (
                                                        <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                            {filteredData.length === 0 ? "Your search has not returned any results." : "At least one search parameter is required."}
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
                                {/* <TimelineConnector style={{ backgroundColor: 'green' }} /> */}
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
        </>
    )
}

export default SearchCms;


