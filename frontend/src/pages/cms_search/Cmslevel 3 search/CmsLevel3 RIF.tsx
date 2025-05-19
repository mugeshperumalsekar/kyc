import React, { useState, useEffect } from 'react';
import {
    TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
    Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle,
    DialogContent, Container, DialogActions, DialogContentText, TablePagination, IconButton,
} from '@mui/material'

import { Card } from 'react-bootstrap';

import ClearIcon from '@mui/icons-material/Clear';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; import { SelectChangeEvent } from '@mui/material';



import { start } from 'repl';
import classNames from 'classnames';
import CountryApiService from '../../../data/services/master/Country/country_api_service';

import Header from '../../../layouts/header/header';
import SearchList from '../CmsSearchList';
import statusApiService from '../../../data/services/master/status/status-api-service';
import StateApiService from '../../../data/services/master/State/state_api_service';
import { useSelector } from 'react-redux';
import SearchApiService from '../../../data/services/cms_search/search-api-service';
import PendingcasesApiService from '../../../data/services/cms_search/pendingcases/pending-api-service';
import HitcaseApiService from '../../../data/services/cms_search/hitcase/hitcase-api-service';
import RIFApiService from '../../../data/services/cms_search/rif/rif-api-service';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';

interface Pendingcase {
    searchId: string;
    criminalId: string;
    hitdataId: string;
    criminalName: string;
    matchingScore: string;
    remark: string;
    levelId: string;
    statusId: string;
    caseId: string;
}
interface Status {
    id: string;
    name: string;
    // Add other properties if necessary
}
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
}
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
interface DisabledIcons {
    [key: string]: boolean;
}

const Level3RIF: React.FC<{
    isLevel2casedetailsOpen: boolean;
    setIsLevelcasedetailsOpen: (value: boolean) => void;
    handleLevelDetailsDialogOpen: () => void;
}> = ({ isLevel2casedetailsOpen, setIsLevelcasedetailsOpen, handleLevelDetailsDialogOpen }) => {


    const [selectedCountry, setSelectedCountry] = useState('');

    const [selectedState, setSelectedState] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const [name, setName] = useState('');
    const [identity, setIdentity] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [serialNumber, setSerialNumber] = useState(1);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    // const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // State to store the selected employee
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State 
    const countryService = new CountryApiService(); // Create an instance of CountryApiService
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [isRemarksDialogOpenRif, setIsRemarksDialogOpenRif] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const authApiService = new SearchApiService();
    const status = new statusApiService();
    const stateApiService = new StateApiService();
    const [statusData, setStatusData] = useState<any[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [pendingcase, setPendingcase] = useState<Pendingcase[]>([]);
    const [pendingRif, setPendingRif] = useState<RIF[]>([]);

    const authService = new PendingcasesApiService();
    const [selectedRow, setSelectedRow] = useState<string | null>(null); // Initialize with null
    const [rowStatuses, setRowStatuses] = useState<{ [key: number]: { status: string; remarks: string } }>({});
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
    const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
    const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
    const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
    const [showRIFTable, setShowRIFTable] = useState(false);
    const hitcaseApiService = new HitcaseApiService();
    const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
    const rifService = new RIFApiService();
    const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
    const [levelOneRemarkRfi, setLevelOneRemarkRfi] = useState<RemarkRfi[]>([]);
    const [levelTwoRemarkRfi, setLevelTwoRemarkRfi] = useState<RemarkTwo[]>([]);
    const [levelTwo, setLevelTwo] = useState<LevelTwo[]>([]);
    const [levelThree, setLevelThree] = useState<LevelTwo[]>([]);
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<Pendingcase | null>(null);
    const [selectedCourierTrackers, setSelectedCourierTrackers] = useState<RIF | null>(null); // State to store the selected courier tracker
    const [loading, setLoading] = useState<boolean>(false);

    const [activeButton, setActiveButton] = useState<string | null>(null); // Changed type to 'string | null'


    const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
    const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const userFirstName = userDetails.userData?.firstName;
    const loginDetails = userDetails.loginDetails;
    const userId = loginDetails.uid;
    useEffect(() => {
        fetchStatus();
        handlePendingAlertClick();

        // const savedActions = JSON.parse(localStorage.getItem('savedActions') || '{}');
        // setSelectedActions(savedActions);
    }, [page, rowsPerPage]);



    const handlePendingAlertClick = async () => {
        try {
            setLoading(true);
            setActiveButton('case');
            // Call the API to get pending cases
            let results = await authService.getPendingcaseRIF();

            // Update the state to show the pending case table
            setShowPendingCaseTable(true);
            setShowPendingRIFTable(false);

            setLoading(false);
            // Set the pending cases data to be displayed in the table
            setPendingcase(results);
            setSearchResults(results);
        } catch (error) {
            // Handle the error as needed
        }
    };
    const handlePendingRIFClick = async () => {
        try {
            setLoading(true);
            setActiveButton('rif');
            let results = await rifService.getpendingRIF();
            setPendingRif(results);
            setSearchResults(results); setLoading(false);
            setShowPendingRIFTable(true);
            setShowPendingCaseTable(false);


        } catch (error) {

        }
    };
    const fetchStatus = async () => {
        try {
            const filteredStatuses = await status.getStatus(); // Call getType from TypeApiService
            setStatusData(filteredStatuses)
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    };







    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        setSerialNumber(newPage * rowsPerPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        const newPage = selectedSerialNumber !== null ? Math.floor(selectedSerialNumber / newRowsPerPage) : 0;
        setRowsPerPage(newRowsPerPage);
        setPage(newPage);
        setSerialNumber(newPage * newRowsPerPage + 1);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const handleCloseRemarksDialog = () => {
        setIsRemarksDialogOpen(false);
        setSelectedStatus('');
        setRemarks('');
    };
    const handleCloseRemarksDialogRif = () => {
        setIsRemarksDialogOpen(false);
        setSelectedStatus('');
        setRemarks('');
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
    };
    const handleStatusChangeRif = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
    };
    // const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRemarks(event.target.value);
    // };
    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
        setRemarks(filteredValue);
    };
    const handleRemarksChangeRif = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemarks(event.target.value);
    };




    const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

    const handleIconClick = (index: number, searchId: string, criminalId: string, hitdataId: string) => {
        console.log("Clicked icon at row:", index);
        console.log("Search ID:", searchId);
        console.log("ids:", criminalId);

        const currentIndex = `${searchId}-${criminalId}-${index}`;
        const existingAction = selectedActions[currentIndex] || '';
        const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
        const selectedSearchResult = pendingcase[index];
        const selectedSearchResults = pendingRif[index]
        setSelectedCourierTracker(selectedSearchResult);
        setSelectedCourierTrackers(selectedSearchResults)
        setSelectedStatus(existingAction);

        setRemarks(existingRemarks);
        setSelectedRow(currentIndex);
        setIsRemarksDialogOpen(true);
        handleLevelOneRemark(criminalId, hitdataId);
        handleLevelTwoRemarkRfi(criminalId, hitdataId);
        handleLevelThreeRemarkRfi(criminalId, hitdataId);
        handleLevelthreeStatusTwo(criminalId, hitdataId);
        handleLevelOneStatusTwo(criminalId, hitdataId);

    };
    const handleLevelOneRemark = async (criminalId: any, hitdataId: any) => {
        try {
            const response = await authService.getPendingOneRemarkDetails(criminalId, hitdataId, 1, 1);
            setLevelOneRemark(response);
        } catch (error) {
            console.log("Error fetching the handleLevelOneRemark:", error);
        }
    };

    const handleLevelTwoRemarkRfi = async (criminalId: any, hitdataId: any) => {
        try {
            const response = await authService.getPendingOneRemarkDetails(criminalId, hitdataId, 2, 2);
            setLevelTwoRemarkRfi(response);
        } catch (error) {
            console.log("Error fetching the handleLevelOneRemarkRfi:", error);
        }
    };

    const handleLevelOneStatusTwo = async (criminalId: any, hitdataId: any) => {
        try {
            const response = await authService.getPendingOneRemarkDetails(criminalId, hitdataId, 1, 2);
            setLevelTwo(response);
        } catch (error) {
            console.log("Error feching the handleLevelOneStatusTwo:", error);
        }
    };

    const handleLevelthreeStatusTwo = async (criminalId: any, hitdataId: any) => {
        try {
            const response = await authService.getPendingOneRemarkDetails(criminalId, hitdataId, 3, 2);
            setLevelThree(response);
        } catch (error) {
            console.log("Error fetching the handleLevelthreeStatusTwo:", error);
        }
    };

    const handleLevelThreeRemarkRfi = async (criminalId: any, hitdataId: any) => {
        try {
            const response = await authService.getPendingOneRemarkDetails(criminalId, hitdataId, 3, 3);
            setLevelOneRemarkRfi(response);
        } catch (error) {
            console.log("Error fetching the handleLevelOneRemarkRfi:", error);
        }
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
            if (selectedRow !== null && searchResults.some(alert => `${alert.searchId}-${alert.criminalId}-${searchResults.indexOf(alert)}` === selectedRow)) {
                const updatedRemarksAndActions = { ...remarksAndActions };
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

                setRemarksAndActions(updatedRemarksAndActions);
                const selectedSearchResult = searchResults.find(alert => `${alert.searchId}-${alert.criminalId}-${searchResults.indexOf(alert)}` === selectedRow);

                if (selectedSearchResult) {
                    //   alert(selectedSearchResult.searchId + '' + selectedSearchResult.criminalId + '' + selectedSearchResult.hitId);
                    const PindingcasesPayload = {
                        searchId: selectedSearchResult.searchId,
                        criminalId: selectedSearchResult.criminalId,
                        statusId: selectedStatus,
                        remark: remarks,
                        hitId: selectedSearchResult.hitId,
                        levelId: '4',
                        caseId: selectedSearchResult.caseId,
                        uid: '1', // Ensure 'userId' or a valid user ID is used here
                        criminalName: '',
                        matchingScore: '0' // You can set an appropriate value for matchingScore
                    };
                    // Assuming CreateCaseLifeCycleImplInsert is accessible from this scope

                    await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
                    // Handle the response if needed
                }
                setSelectedActions({
                    ...selectedActions,
                    [selectedRow]: selectedStatus,
                });

                setDisabledIcons({
                    ...disabledIcons,
                    [selectedRow]: true,
                });

            }

            setIsRemarksDialogOpen(false);
        } catch (error) {
            console.error('Error submitting remarks:', error);
            // Handle any other errors that might occur
        }
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'Close':
                return 'red';
            case 'Escalation':
                return 'green';
            case 'Request for information':
                return 'yellow';
            default:
                return 'white';
        }
    }

    // const handleRemarksSubmitRif = async () => {
    //     try {
    //         if (selectedRow !== null && selectedRow >= 0) {
    //             const updatedRemarksAndActions = [...remarksAndActions];
    //             updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

    //             setRemarksAndActions(updatedRemarksAndActions);

    //             const selectedSearchResult = searchResults[selectedRow];

    //             if (selectedSearchResult) {
    //                 //   alert(selectedSearchResult.searchId+''+selectedSearchResult.criminalId+''+selectedSearchResult.hitId);
    //                 const PindingcasesPayload = {
    //                     searchId: selectedSearchResult.searchId,
    //                     criminalId: selectedSearchResult.criminalId,
    //                     // statusId: '2',
    //                     statusId: selectedStatus,
    //                     remark: remarks,
    //                     hitdataId: selectedSearchResult.hitId,
    //                     levelId: '4',
    //                     caseId: selectedSearchResult.caseId,
    //                     uid: '1', // Ensure 'userId' or a valid user ID is used here
    //                     criminalName: '',
    //                     matchingScore: '0' // You can set an appropriate value for matchingScore
    //                 };
    //                 // Assuming CreateCaseLifeCycleImplInsert is accessible from this scope

    //                 await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
    //                 // Handle the response if needed
    //             }
    //         }

    //         setIsRemarksDialogOpen(false);
    //     } catch (error) {
    //         console.error('Error submitting remarks:', error);
    //         // Handle any other errors that might occur
    //     }
    // }




    return (
        <>
            <Header />
            <Box m={4}>
            <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "1px", margin: "10px" }}>
              <Box m={4}>




                <Grid container spacing={3} alignItems="center" justifyContent="center">

                  <Grid item xs={12} sm={2}>
                    <div
                      style={{
                        backgroundColor: activeButton === 'case' ? '#3f51b5' : '#007BFF',
                        color: '#fff',
                        padding: '9px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        width: '81%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease',
                      }}
                      onClick={handlePendingAlertClick}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.backgroundColor = '#1976d2';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.backgroundColor = activeButton === 'case' ? '#3f51b5' : '#007BFF';
                      }}
                    >
                      Pending Case
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <div
                      style={{
                        backgroundColor: activeButton === 'rif' ? '#3f51b5' : '#007BFF',
                        color: '#fff',
                        padding: '9px 24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        width: '81%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease',
                      }}
                      onClick={handlePendingRIFClick}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.backgroundColor = '#1976d2';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.backgroundColor = activeButton === 'rif' ? '#3f51b5' : '#007BFF';
                      }}
                    >
                      Pending RFI
                    </div>
                  </Grid>

                </Grid>



                            {/* {isSearchTableVisible && ( */}
                            <div>



                                <div>
                                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                                        {showPendingCaseTable && (

                                            <TableContainer component={Card} style={{ width: "85%", margin: "2%" }}>

                                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                    <TableHead sx={{ backgroundColor: '#cccdd1', position: 'sticky', top: 0 }}>
                                                        <TableRow className="tableHeading">
                                                            <TableCell>S.No</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Matching Score</TableCell>
                                                            <TableCell>Remark</TableCell>
                                                            <TableCell>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {loading ? (
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">
                                                                    <Typography variant="body1">Loading...</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : pendingcase.length > 0 ? (
                                                            pendingcase.map((alert, index) => {
                                                                const currentIndex = `${alert.searchId}-${alert.criminalId}-${index}`;
                                                                const selectedAction = selectedActions[currentIndex] || '';

                                                                return (
                                                                    <TableRow key={alert.searchId} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                        <TableCell>{serialNumber + index}</TableCell>
                                                                        <TableCell>{alert.criminalName}</TableCell>
                                                                        <TableCell>{alert.matchingScore}</TableCell>
                                                                        <TableCell>{alert.remark}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => handleIconClick(index, alert.searchId, alert.criminalId, alert.hitdataId)} style={{ padding: '1px 1px' }}
                                                                                disabled={disabledIcons[`${alert.searchId}-${alert.criminalId}-${index}`]}
                                                                            >

                                                                                {/* <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}> */}
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
                                                            })
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">
                                                                    No data available
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>

                                                </Table>
                                                <div>
                                                    {/* <TablePagination
                                                        rowsPerPageOptions={[5, 10, 20]}
                                                        component="div"
                                                        count={pendingcase.length}
                                                        page={page}
                                                        onPageChange={handlePageChange}
                                                        rowsPerPage={rowsPerPage}
                                                        onRowsPerPageChange={handleRowsPerPageChange}
                                                        style={{ marginLeft: "500px" }}
                                                    /> */}
                                                </div>
                                            </TableContainer>
                                        )}


                                    </Grid>





                                </div>
                                <div>
                                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                                        {showPendingRIFTable && (

                                            <TableContainer component={Card} style={{ maxHeight: '520px', overflow: 'auto', width: "85%", margin: "1%" }}>

                                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                    <TableHead sx={{ backgroundColor: '#cccdd1', position: 'sticky', top: 0 }}>
                                                        <TableRow className="tableHeading">
                                                            <TableCell >S.No</TableCell>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Matching Score</TableCell>
                                                            <TableCell>Remark</TableCell>
                                                            <TableCell>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {loading ? (
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">
                                                                    <Typography variant="body1">Loading...</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : pendingRif.length > 0 ? (
                                                            pendingRif.map((alert, index) => {
                                                                const currentIndex = `${alert.searchId}-${alert.criminalId}-${index}`;
                                                                const selectedAction = selectedActions[currentIndex] || '';

                                                                return (
                                                                    <TableRow key={alert.searchId}>
                                                                        <TableCell>{serialNumber + index}</TableCell>
                                                                        <TableCell>{alert.criminalName}</TableCell>
                                                                        <TableCell>{alert.matchScore}</TableCell>
                                                                        <TableCell>{alert.remark}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => handleIconClick(index, alert.searchId, alert.criminalId, alert.hitdataId)} style={{ padding: '1px 1px' }}
                                                                                disabled={disabledIcons[`${alert.searchId}-${alert.criminalId}-${index}`]}
                                                                            >

                                                                                {/* <IconButton onClick={() => handleIconClick(currentIndex)} style={{ padding: '1px 1px' }}> */}
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
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">
                                                                    No data available
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>

                                                </Table>
                                                <div>
                                                    {/* <TablePagination
                                                        rowsPerPageOptions={[5, 10, 20]}
                                                        component="div"
                                                        count={pendingRif.length}
                                                        page={page}
                                                        onPageChange={handlePageChange}
                                                        rowsPerPage={rowsPerPage}
                                                        onRowsPerPageChange={handleRowsPerPageChange}
                                                        style={{ marginLeft: "500px" }}
                                                    /> */}
                                                </div>
                                            </TableContainer>
                                        )}


                                    </Grid>





                                </div>
                            </div>
              

                    </Box>
                </Container >

        
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
                {showPendingCaseTable && selectedCourierTracker && (
                    <Timeline position="left">
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.criminalName}</TimelineContent>
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
                            <TimelineContent>{selectedCourierTracker.remark}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ backgroundColor: 'green' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Remark</TimelineContent>
                        </TimelineItem>
                    </Timeline>
                )}

                {showPendingRIFTable && selectedCourierTrackers && (
                    <>
                        <Timeline position="left" >
                            <TimelineItem>
                                <TimelineContent>{selectedCourierTrackers.criminalName}</TimelineContent>
                                <TimelineSeparator>
                                    <TimelineDot style={{ background: 'blue' }} />
                                    <TimelineConnector style={{ background: 'blue' }} />
                                </TimelineSeparator>
                                <TimelineContent color="text.secondary">Name</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineContent>{selectedCourierTrackers.matchScore}</TimelineContent>
                                <TimelineSeparator>
                                    <TimelineDot style={{ background: 'blue' }} />
                                    <TimelineConnector style={{ background: 'blue' }} />
                                </TimelineSeparator>
                                <TimelineContent color="text.secondary">Matching Score</TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineContent>{selectedCourierTrackers.remark}</TimelineContent>
                                <TimelineSeparator>
                                    <TimelineDot style={{ backgroundColor: 'green' }} />
                                </TimelineSeparator>
                                <TimelineContent color="text.secondary">Remark</TimelineContent>
                            </TimelineItem>
                        </Timeline>

                    </>

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
          </Box>

        </>
    );
}

export default Level3RIF;