
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, IconButton, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { Slider } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';

import HitdatalifecycleApiService from '../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../data/services/cms_search/hitcase/hitcase-api-service';
import SearchApiService from '../../data/services/cms_search/search-api-service';
import ViewService from '../../data/services/viewpage/view_api_service';
import { RecordTypeData } from '../../data/services/Search/search-payload';
import SearchService from '../../data/services/Search/search-api-service';
import { RecordDTO, SearchDTO } from '../../data/services/viewservice/viewpagedetails-payload';
import ViewPageDetailsService from '../../data/services/viewservice/viewpagedetails-api-service';
import Entityview from '../CmsView/Entityview';
import Individualview from '../CmsView/Individualview';
import Shipview from '../CmsView/Shipview';
import Aircraftview from '../CmsView/Aircraftview';
import { useReactToPrint } from 'react-to-print';

interface DisabledIcons {
    [key: string]: boolean;
}


interface Status {
    id: string;
    name: string;
    // Add other properties if necessary
}

function SearchCms() {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const userId = loginDetails.uid;

    const location = useLocation();
    const { id, cmsId } = useParams();
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
    const [sliderValue, setSliderValue] = useState<number>(80);
    const [data, setData] = useState<RecordDTO[]>([
    ]);
    const [records, setRecords] = useState<RecordDTO[]>([]); // State to hold fetched records


    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const [statusData, setStatusData] = useState<Status[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
    const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});

    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<any | null>(null); // State to store the selected courier tracker
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [selectedRow, setSelectedRow] = useState<string | null>(null); // Initialize with null
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const authApiService = new SearchApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitcaseApiService = new HitcaseApiService();
    const [showModallogical, setShowModallogical] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);
    useEffect(() => {
        fetchAll();
        fetchStatus();

    }, [cmsId]);

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

    const handleSearch = async () => {
        const searchDTO = {
            name: formData.cmsName, // Name from form data
            searchingScore: sliderValue, // Score from slider
            recordTypeId: selectedRecordType, // Selected record type
            kycId: 1, // KYC ID, populate if necessary
            applicantFormId: '', // Applicant Form ID, populate if necessary
            screeningType: 1, // Set screening type as needed
            uid: loginDetails.id, // User ID from login details
        };
    
        try {
            setLoading(true); // Set loading state to true
    
            // Validate input before making the API call
            if (!formData.cmsName && sliderValue === 100) {
                setSearchError(true); // Set search error state if validation fails
                setLoading(false); // Reset loading state
                return; // Exit the function early
            }
    
            // Call the service to get the record count
            const result = await viewservice.getRecordsCountCms(searchDTO);
            console.log("Form data result:", result); 
    
            // Check if the result is an array and has records
            if (Array.isArray(result) && result.length > 0) {
                setRecords(result); // Update records state
                setSearchError(false); // Clear search error state
            } else {
                setSearchError(true); // Set search error if no records found
                setRecords([]); // Reset records state to empty array
            }
        } catch (error) {
            console.error('Error fetching records:', error); // Log the error
            setSearchError(true); // Set search error state
        } finally {
            setLoading(false); // Always reset loading state
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
    const myRef = useRef(null);
    const Ref = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => Ref.current,
        pageStyle: `
          @page {
            margin-left: 20mm; /* Adjust this value as per your requirement */
          }
          body {
            margin: 0;
          }
          .table-container {
            overflow: visible !important; /* Ensure table content is fully visible when printing */
            max-height: none !important;
          }
          table {
            margin: 0 auto; /* Center the table */
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd; /* Add borders to table cells for clarity */
          }
        `,
    });

    const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

    const handleTableRowClick = (
        cmsId: any,
        cmsRecordType: any,
        recordTypeId: any,
        index: number,
        searchId: string
    ) => {
        const id = String(cmsId);
        const uid = loginDetails.id;
        setShowModal(true);
        const currentIndex = `${searchId}-${cmsId}-${index}`;
        const existingAction = selectedActions[currentIndex] || '';
        const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

        setSelectedStatus(existingAction);
        setRemarks(existingRemarks);
        setSelectedRow(currentIndex);
        // alert('uid: ' + uid + ', recordTypeId: ' + recordTypeId + ', cmsId: ' + cmsId);

        // Pass the props when setting the dialog component
        switch (recordTypeId) {
            case 1:
                setDialogComponent(<Entityview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            case 2:
                setDialogComponent(<Individualview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            case 3:
                setDialogComponent(<Shipview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            case 4:
                setDialogComponent(<Aircraftview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            default:
                setDialogComponent(null);
        }
    };



    const handleCloseModal = () => {
        setShowModal(false);
    };
    const exportToExcel = () => {
        try {

            const dataForExport = filteredData.length > 0 ? filteredData.map((row) => ({

                Name: row.cmsName,
                // RecordType: row.getCountryNameById(recordTypeId),
                RecordType: getCountryNameById(row.recordTypeId), Score: row.score
            })) : [{ Message: "Your search has not returned any results." }];

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataForExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lookup Results");
            XLSX.writeFile(workbook, "lookup_results.xlsx");
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    const allValues = RecordType.map((item) => item.name).join(", ");


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


    const handleIconClick = (index: number, searchId: string, cmsId: string) => {
        const currentIndex = `${searchId}-${cmsId}-${index}`;
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
            if (selectedRow !== null && filteredData.some(row => `${row.searchId}-${row.cmsId}-${filteredData.indexOf(row)}` === selectedRow)) {
                const updatedRemarksAndActions = { ...remarksAndActions };
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

                setRemarksAndActions(updatedRemarksAndActions);

                const selectedSearchResult = filteredData.find(row => `${row.searchId}-${row.cmsId}-${filteredData.indexOf(row)}` === selectedRow);
                console.log("selectedRow:", selectedRow);
                console.log("filteredData:", filteredData);

                if (!selectedSearchResult) {
                    console.error("Selected search result is undefined");
                    // alert("Selected search result is undefined. Check console for more details.");
                    return;
                }

                // alert(JSON.stringify(selectedSearchResult)); // Display the selectedSearchResult in an alert

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
                    //     // alert(hitcasePayload.criminalId);
                    //     await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
                    // }
                }

                setSelectedActions({
                    ...selectedActions,
                    [selectedRow]: selectedStatus,
                });
                setDisabledIcons({
                    ...disabledIcons,
                    [selectedRow]: true,
                });

                setIsRemarksDialogOpen(false);
            } else {
                console.error("Selected row is null, invalid, or out of bounds");
            }
        } catch (error) {
            console.error("Error submitting remarks:", error);
        }
        handleCloseModal();
    };
    const getCountryNameById = (recordTypeId: number) => {
        const recordType = RecordType.find((c) => c.id === recordTypeId); // No need to convert here
        return recordType ? recordType.name : 'Not Available';
    };


    return (
        <>
            <Box sx={{
                display: 'flex', fontFamily: "Bookman Old Style",
                fontSize: "12px",
            }}>
                <Header />
                <Box component="main" sx={{
                    flexGrow: 1, p: 2, fontFamily: "Bookman Old Style",
                    fontSize: "12px"
                }}>
                    <Box

                        sx={{
                            marginTop: '5%',
                            fontFamily: "Bookman Old Style",
                            fontSize: "12px",
                            borderRadius: 1,
                        }}
                    >

                        <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>

                            <div className="card-body" >
                                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', }}>

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
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                    >
                                        <FileDownloadIcon />
                                    </IconButton>
                                </div>

                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <div style={{
                                        display: 'flex', gap: '2%', fontFamily: "Bookman Old Style",
                                        fontSize: "12px"
                                    }}>

                                        <FormControl style={{
                                            width: '50%', fontFamily: "Bookman Old Style",
                                            fontSize: "12px"
                                        }}>
                                            <InputLabel htmlFor="record-type">Type</InputLabel>
                                            <Select style={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px",
                                            }}
                                                label="Type"
                                                size='small'
                                                variant="outlined"
                                                value={selectedRecordType}
                                                onChange={handleRecordTypeChange}
                                            >

                                                {RecordType.map((item) => (
                                                    <MenuItem style={{
                                                        fontFamily: "Bookman Old Style",
                                                        fontSize: "12px",
                                                    }} key={item.id} value={item.id.toString()}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>



                                        <TextField
                                            sx={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px", width: '50%',
                                                '& .MuiInputBase-input': {  // Apply styles to the input element
                                                    fontFamily: "Bookman Old Style",
                                                    fontSize: "12px"
                                                }
                                            }}
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

                                        <Slider
                                            style={{
                                                width: '40%', fontFamily: "Bookman Old Style",
                                                fontSize: "12px"
                                            }}
                                            value={sliderValue}
                                            onChange={(e, newValue) => setSliderValue(newValue as number)}
                                            aria-labelledby="discrete-slider"
                                            step={1}
                                            marks
                                            min={50}
                                            max={100}
                                        />


                                        <TextField
                                            sx={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px", width: '20%',
                                                '& .MuiInputBase-input': {  // Apply styles to the input element
                                                    fontFamily: "Bookman Old Style",
                                                    fontSize: "12px"
                                                }
                                            }}
                                            id="max-score"
                                            size='small'
                                            variant="outlined"
                                            type="text"
                                            name="maxScore"
                                            autoComplete="off"
                                            value={sliderValue.toString()}
                                            onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                        />
                                        <div style={{
                                            display: 'flex', justifyContent: 'center', gap: '3%', fontFamily: "Bookman Old Style",
                                            fontSize: "12px"
                                        }} >

                                            <Button variant="contained" style={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px"
                                            }} onClick={handleSearch} onKeyPress={handleKeyPress} >Search</Button>

                                            <Button variant="contained" style={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px"
                                            }} onClick={handleReset}>Reset</Button>
                                        </div>
                                    </div>
                                </Card>
                                <br></br>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h6>LOOKUP RESULTS ({filteredData.length})</h6>
                                </div>

                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid item xs={12}>
                                        <div ref={Ref}>
                                            <TableContainer style={{
                                                maxHeight: '400px', overflow: 'auto', fontFamily: "Bookman Old Style",
                                                fontSize: "12px"
                                            }}>
                                                <Table size="small" aria-label="a dense table" style={{
                                                    margin: '0 auto', fontFamily: "Bookman Old Style",
                                                    fontSize: "12px"
                                                }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell
                                                                style={{
                                                                    position: 'sticky', top: 0, backgroundColor: 'white', fontFamily: "Bookman Old Style",
                                                                    fontSize: "12px"
                                                                }}
                                                                onClick={() => handleSort('name')}
                                                            >
                                                                Name {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                            </TableCell>
                                                            <TableCell
                                                                style={{
                                                                    position: 'sticky', top: 0, backgroundColor: 'white', fontFamily: "Bookman Old Style",
                                                                    fontSize: "12px"
                                                                }}
                                                                onClick={() => handleSort('address')}
                                                            >
                                                                RecordType {sortedColumn === 'cmsRecordType' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                            </TableCell>
                                                            <TableCell
                                                                style={{
                                                                    position: 'sticky', top: 0, backgroundColor: 'white', fontFamily: "Bookman Old Style",
                                                                    fontSize: "12px"
                                                                }}
                                                                onClick={() => handleSort('score')}
                                                            >
                                                                Score {sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                            </TableCell>
                                                            <TableCell style={{
                                                                position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, fontFamily: "Bookman Old Style",
                                                                fontSize: "12px"
                                                            }}>
                                                                Action
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {loading ? (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center">
                                                                    <Typography variant="body1">Loading...</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : filteredData.length > 0 ? (
                                                            filteredData.map((row, index) => {
                                                                const currentIndex = `${row.searchId}-${row.cmsId}-${index}`;
                                                                const selectedAction = selectedActions[currentIndex] || '';
                                                                return (
                                                                    <TableRow key={row.cmsId}>

                                                                        <TableCell
                                                                            style={{
                                                                                wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word', fontFamily: "Bookman Old Style",
                                                                                fontSize: "12px"
                                                                            }}>
                                                                            <button
                                                                                style={{
                                                                                    color: 'blue',
                                                                                    textDecoration: 'underline',
                                                                                    border: '0px solid blue',
                                                                                    backgroundColor: 'white'
                                                                                }}
                                                                                // onClick={() => handleTableRowClick(row.cmsId,
                                                                                //     row.cmsRecordType,
                                                                                //     row.recordTypeId,
                                                                                //     index,
                                                                                //     row.searchId)}
                                                                                // disabled={disabledIcons[`${row.searchId}-${row.cmsId}-${index}`]}
                                                                            >
                                                                                {row.cmsName}
                                                                            </button>
                                                                        </TableCell>
                                                                        {/* <TableCell>{row.cmsName}</TableCell> */}
                                                                        <TableCell style={{
                                                                            fontFamily: "Bookman Old Style",
                                                                            fontSize: "12px"
                                                                        }}>{getCountryNameById(row.recordTypeId)}</TableCell>



                                                                        <TableCell style={{
                                                                            fontFamily: "Bookman Old Style",
                                                                            fontSize: "12px"
                                                                        }}>{row.score}</TableCell>
                                                                        <TableCell style={{ minWidth: '120px', zIndex: 1 }}>
                                                                            <IconButton
                                                                                // onClick={() => handleIconClick(index, row.searchId, row.cmsId.toString())}
                                                                                style={{ padding: '1px 1px' }}
                                                                                disabled={disabledIcons[`${row.searchId}-${row.cmsId}-${index}`]}
                                                                            >
                                                                                {selectedAction ? (
                                                                                    <VisibilityOffIcon style={{ color: 'red' }} />
                                                                                ) : (
                                                                                    <VisibilityIcon style={{ color: 'green' }} />
                                                                                )}
                                                                            </IconButton>
                                                                            {selectedAction && <span>{getStatusName(selectedAction)}</span>}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })
                                                        ) : (
                                                            searchError && (
                                                                <TableRow>
                                                                    <TableCell colSpan={8} align="center">
                                                                        <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                                            {filteredData.length === 0 ? "Your search has not returned any results." : "At least one search parameter is required."}
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </div>

                                    </Grid>
                                </Card>
                            </div>
                        </Card>

                    </Box>
                </Box>
            </Box>
            <Dialog style={{ padding: '0px 16px' }}
                open={isRemarksDialogOpen}
                onClose={handleCloseRemarksDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogActions style={{ padding: '1px', }}>
                    <IconButton
                        onClick={handleCloseRemarksDialog}
                        color="primary"
                        sx={{ fontSize: 20 }}
                    >
                        <ClearIcon sx={{ fontSize: 'inherit' }} />
                    </IconButton>
                </DialogActions>

                <DialogTitle style={{
                    padding: '0px 24px', fontFamily: "Bookman Old Style",
                    fontSize: "16px",
                }}>Enter Remarks</DialogTitle>
                <DialogContentText style={{
                    textAlign: 'center', fontFamily: "Bookman Old Style",
                    fontSize: "14px",
                }}>
                    Select a status and enter remarks for this employee.
                </DialogContentText>
                {/* <DialogContent> */}
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={3}>
                        <FormControl style={{
                            fontFamily: "Bookman Old Style",
                            fontSize: "12px",
                        }} size='small' fullWidth variant="outlined" margin="dense">
                            <InputLabel style={{
                                fontFamily: "Bookman Old Style",
                                fontSize: "12px",
                            }}>Status</InputLabel>
                            <Select style={{
                                fontFamily: "Bookman Old Style",
                                fontSize: "12px",
                            }}
                                size='small'
                                label="Status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                            >
                                <MenuItem style={{
                                    fontFamily: "Bookman Old Style",
                                    fontSize: "12px",
                                }} value="">Select Status</MenuItem>
                                {statusData.map((status) => (
                                    <MenuItem style={{
                                        fontFamily: "Bookman Old Style",
                                        fontSize: "12px",
                                    }} key={status.id} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                    </Grid>
                </Grid>
                {selectedStatus && (
                    <div>
                        <DialogContentText style={{
                            textAlign: 'center', fontFamily: "Bookman Old Style",
                            fontSize: "12px"
                        }}>
                            Enter your remarks for this action.
                        </DialogContentText>

                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    sx={{
                                        fontFamily: "Bookman Old Style",
                                        fontSize: "12px",
                                        '& .MuiInputBase-input': {  // Apply styles to the input element
                                            fontFamily: "Bookman Old Style",
                                            fontSize: "12px"
                                        }
                                    }}
                                    size='small'
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
                                    style={{ maxHeight: '150px' }}
                                />

                            </Grid>
                        </Grid>

                    </div>
                )}
                {/* </DialogContent> */}
                <DialogActions>

                    {selectedStatus && (
                        <Button style={{
                            fontFamily: "Bookman Old Style",
                            fontSize: "12px",
                        }} onClick={handleRemarksSubmit} color="primary">
                            Submit
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
                <DialogContent>
                    {dialogComponent}
                    <div style={{
                        fontFamily: "Bookman Old Style",
                        fontSize: "16px",
                    }}>Enter Remarks</div>
                    <div style={{
                        textAlign: 'center', fontFamily: "Bookman Old Style",
                        fontSize: "16px",
                    }}>
                        Select a status and enter remarks for this employee.
                    </div>
                    <div>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid container alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={3}>
                                    <FormControl style={{
                                        fontFamily: "Bookman Old Style",
                                        fontSize: "12px",
                                    }} size='small' fullWidth variant="outlined" margin="dense">
                                        <InputLabel style={{
                                            fontFamily: "Bookman Old Style",
                                            fontSize: "12px",
                                        }}>Status</InputLabel>
                                        <Select style={{
                                            fontFamily: "Bookman Old Style",
                                            fontSize: "12px",
                                        }}
                                            size='small'
                                            label="Status"
                                            value={selectedStatus}
                                            onChange={handleStatusChange}
                                        >
                                            <MenuItem style={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px",
                                            }} value="">Select Status</MenuItem>
                                            {statusData.map((status) => (
                                                <MenuItem style={{
                                                    fontFamily: "Bookman Old Style",
                                                    fontSize: "12px",
                                                }} key={status.id} value={status.id}>
                                                    {status.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>


                                </Grid>
                            </Grid>
                        </Grid>
                        {selectedStatus && (
                            <div>
                                <DialogContentText style={{
                                    textAlign: 'center', fontFamily: "Bookman Old Style",
                                    fontSize: "12px"
                                }}>
                                    Enter your remarks for this action.
                                </DialogContentText>

                                <Grid container alignItems="center" justifyContent="center">
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            sx={{
                                                fontFamily: "Bookman Old Style",
                                                fontSize: "12px",
                                                '& .MuiInputBase-input': {  // Apply styles to the input element
                                                    fontFamily: "Bookman Old Style",
                                                    fontSize: "12px"
                                                }
                                            }}
                                            size='small'
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
                                            style={{ maxHeight: '150px' }}
                                        />

                                    </Grid>
                                </Grid>

                            </div>
                        )}
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'flex-end', fontFamily: "Bookman Old Style",
                        fontSize: "12px",
                    }}>
                        <DialogActions>
                            <Button style={{
                                fontFamily: "Bookman Old Style",
                                fontSize: "12px",
                            }} variant="contained" onClick={handleCloseModal}>Close</Button>
                            {selectedStatus && (
                                <Button style={{
                                    fontFamily: "Bookman Old Style",
                                    fontSize: "12px",
                                }} variant="contained" onClick={handleRemarksSubmit} color="primary">
                                    Submit
                                </Button>
                            )}
                        </DialogActions>
                    </div>
                </DialogContent>
            </Dialog>


        </>
    )
}

export default SearchCms;


