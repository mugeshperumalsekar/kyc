import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, IconButton, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { Slider } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewService from '../../data/services/pep_search/viewpage/view_api_service';
import { Country, List, Program, All, Customer, CustomerRequest, Address, IdentificationData, AliasesData, PlaceOfBirthData, NationalityData, Birthdate, DetailsData, SearchDTO, RecordDTO } from '../../data/services/pep_search/viewpage/view_payload';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../data/services/pep_search/hitcase/hitcase-api-service';
import statusApiService from '../../data/services/master/status/status-api-service';
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
}
interface Status {
    id: string;
    name: string;
  }

function PepDetails() {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const location = useLocation();
    const { id, ids, uid } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RecordDTO>({
        id: 0,
        name: '',
        dob: '',
        placeOfBirth: '',
        pan: '',
        directorsIdentificationNumber: '',
        score: 0,
        hitId:0,
        criminalId:0,
        searchId:0,

    });


    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [Program, setProgram] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [List, setList] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState(0);
    const [country, setCountry] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [filteredData, setFilteredData] = useState<RecordDTO[]>([]); // Ensure this state is correctly updated

    const [searchError, setSearchError] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(100);
    const [data, setData] = useState<RecordDTO[]>([
    ]);
    ;
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [records, setRecords] = useState<RecordDTO[]>([]); 

    useEffect(() => {
        fetchStatus();
    }, [id]);
  
      const status = new statusApiService();

    const fetchStatus = async () => {
        try {
          const statuses: Status[] = await status.getStatus(); // Specify the type as Status[]
          const filteredStatuses = statuses.filter((status: Status) => {
            return status.name === "close" || status.name === "Escalation";
          });
    
          console.log(filteredStatuses); // Add this line to check the filtered statuses
          setStatusData(filteredStatuses); // Update the statusData state with the filtered results
        } catch (error) {
          console.error("Error fetching statuses:", error);
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
    const customer = new ViewService();
    // const handleSearch = async () => {
    //     try {
    //         setLoading(true);
    //         if (!formData.name && !formData.dob && sliderValue === 100) {
    //             setSearchError(true);
    //             setFilteredData([]);
    //             setLoading(false);
    //             return;
    //         }
    //         const searchDTO: SearchDTO = {
    //             name: formData.name,
    //             matching_score: sliderValue,
    //             listID: selectedList,
    //             partySubTypeID: selectedRecordType,
    //             countryId: selectedCountry,
    //         };
    //         const filtered = await customer.getsearchDTOpep(searchDTO);
    //         console.log('Filtered Data:', filtered);
    //         if (Array.isArray(filtered) && filtered.length > 0) {
    //             setFilteredData(filtered);
    //             setSearchError(false);
    //         } else {
    //             setSearchError(true);
    //             setFilteredData([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching lookup data:", error);
    //         setSearchError(true);
    //         setFilteredData([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    //new
  
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
        setFormData({ id: 0, name: '', dob: '', placeOfBirth: '', pan: '', directorsIdentificationNumber: '', score: 0 ,hitId:0,criminalId:0,searchId:0,});
        setFilteredData([]);
        setSliderValue(100);
        setSearchError(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleTableRowClick = (ids: number,) => {
        const uid = loginDetails.id;
        const id = String(ids);
        navigate(`/ViewDesign/${id}/${uid}`);
    }

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
    const [selectedStatus, setSelectedStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [selectedRow, setSelectedRow] = useState<number | null>(null); // Initialize with null or -1 if no row is selected
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [serialNumber, setSerialNumber] = useState(1);
    const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // State to store the selected employee
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State 
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<any | null>(null); // State to store the selected courier tracker
    const userId = loginDetails.uid;
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitcaseApiService = new HitcaseApiService();
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
    const filterResults = () => {
        return searchResults.filter((result) =>
            (
                (typeof result.name === 'string' && result.name.toLowerCase().includes(searchInput.toLowerCase())) ||

                (typeof result.score === 'string' && result.score.toLowerCase().includes(searchInput.toLowerCase()))
            ) ||
            (
                (typeof result.name === 'number' && result.name === parseInt(searchInput, 10)) ||

                (typeof result.score === 'number' && result.score === parseInt(searchInput, 10))
            )
        );
    };
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const handleRowClick = (employee: Employee, index: number) => {
        const currentIndex = page * rowsPerPage + index; // Calculate the current index
        setSelectedEmployee(employee);
        setSelectedRow(currentIndex);
        setIsDialogOpen(true);
    };
    const handleCloseRemarksDialog = () => {
        setIsRemarksDialogOpen(false);
        setSelectedStatus('');
        setRemarks('');
      };
      const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
      };
      const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
        setRemarks(filteredValue);
      };
    //   const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRemarks(event.target.value);
    //   };
      // Assuming searchResults is being set somewhere in your component
useEffect(() => {
    console.log("Search results updated:", searchResults);
}, [searchResults]);


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

            // alert(JSON.stringify(selectedSearchResult)); // Display the selectedSearchResult in an alert

            if (selectedSearchResult) {
                const hitdatalifecyclePayload = {
                    searchId: selectedSearchResult.searchId,
                    criminalId: selectedSearchResult.id.toString(),  // Convert ids value to string

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
                    criminalId: selectedSearchResult.id.toString(),  // Convert ids value to string

                    levelId: '1',
                    statusNowId: selectedStatus,
                    cycleId: '1',
                    remark: remarks,
                    uid: userId
                };

                console.log("hitdatalifecycle Payload:", hitdatalifecyclePayload);
                console.log("hitCasePayload:", hitcasePayload);

               
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
                                    <h4>SEARCH</h4>
                                    <Button variant="contained" color="primary" onClick={handlePrint}>
                                        <PrintIcon />
                                    </Button>
                                </div>
                                <br></br>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <br></br>
                                    <Grid container spacing={2} justifyContent="center">

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
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </Grid>

                                        <Grid item xs={2}>
                                            <Slider
                                                style={{ width: '90%' }}
                                                value={sliderValue}
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

                                        <Grid item xs={4}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={5}>

                                                    <Button variant="contained" onClick={handleSearch} onKeyPress={handleKeyPress} >Search</Button>
                                                </Grid>
                                                <Grid item xs={4}>

                                                    <Button variant="contained" onClick={handleReset}>Reset</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br></br>
                                </Card>
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>SEARCH RESULTS {filteredData.length > 0 && `(${filteredData.length})`}</h4>

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
                                                            Name {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('address')}>
                                                            Date of Birth {sortedColumn === 'dob' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('typeId')}>
                                                            Place Of Birth {sortedColumn === 'placeOfBirth' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('programId')}>
                                                            Pan {sortedColumn === 'pan' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('listId')}>
                                                            Directors Identification Number {sortedColumn === 'directorsIdentificationNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell> */}
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('score')}>
                                                            Score {sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {/* <TableBody>
                                                    {loading && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center">
                                                                <Typography variant="body1">Loading...</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {!loading && filteredData.length > 0 && filteredData.map((row) => (
                                                        <TableRow key={row.id} onClick={() => handleTableRowClick(row.id)}>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.dob}</TableCell>
                                                            <TableCell>{row.placeOfBirth}</TableCell>
                                                            <TableCell>{row.pan}</TableCell>
                                                            <TableCell>{row.directorsIdentificationNumber}</TableCell>
                                                            <TableCell>{row.score}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {searchError && (
                                                        <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                            {filteredData.length === 0 ? "Your search has not returned any results." : "At least one search parameter is required."}
                                                        </Typography>
                                                    )}
                                                </TableBody> */}
                                                {/* <TableBody>
                                                    {loading && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center">
                                                                <Typography variant="body1">Loading...</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {!loading && filteredData.length > 0 && filteredData.map((row) => (
                                                        <TableRow key={row.id} onClick={() => handleTableRowClick(row.id)}>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.dob}</TableCell>
                                                            <TableCell>{row.placeOfBirth}</TableCell>
                                                            <TableCell>{row.pan}</TableCell>
                                                            <TableCell>{row.directorsIdentificationNumber}</TableCell>
                                                            <TableCell>{row.score}</TableCell>
                                                            <TableCell>
                                                                <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                                                    {selectedAction ? (
                                                                        <VisibilityOffIcon style={{ color: 'red' }} /> // Red color for 'VisibilityOffIcon'
                                                                    ) : (
                                                                        <VisibilityIcon style={{ color: 'green' }} /> // Green color for 'VisibilityIcon'
                                                                    )}
                                                                </IconButton>
                                                                {selectedAction && (
                                                                    <span>{getStatusName(selectedAction)}</span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {!loading && filteredData.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center">
                                                                <Typography variant="body2" color="textSecondary">No data found.</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {searchError && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center">
                                                                <Typography variant="body2" color="error">Your search has not returned any results.</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody> */}
                                                <TableBody>
                                                    {loading && (
                                                        <TableRow>
                                                            <TableCell colSpan={8} align="center">
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
                                                                    <TableCell onClick={() => handleTableRowClick(row.id)}>{row.name}</TableCell>
                                                                    <TableCell>{row.dob}</TableCell>
                                                                    <TableCell>{row.placeOfBirth}</TableCell>
                                                                    <TableCell>{row.pan}</TableCell>
                                                                    <TableCell>{row.directorsIdentificationNumber}</TableCell>
                                                                    <TableCell>{row.score}</TableCell>
                                                                    <TableCell>
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

                                                    {/* {filteredData.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={8} align="center">
                                                                <Typography variant="body1">Your search has not returned any results.</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )} */}

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

export default PepDetails;