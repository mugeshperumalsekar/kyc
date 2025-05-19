import React, { useState, useEffect } from 'react';
import {
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
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
import statusApiService from '../../../data/services/master/status/status-api-service';
import StateApiService from '../../../data/services/master/State/state_api_service';
import { useSelector } from 'react-redux';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import SearchApiService from '../../../data/services/pep_search/search-api-service';
import PendingcasesApiService from '../../../data/services/pep_search/pendingcases/pending-api-service';
import HitcaseApiService from '../../../data/services/pep_search/hitcase/hitcase-api-service';
import RIFApiService from '../../../data/services/pep_search/rif/rif-api-service';

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
}
interface Status {
  id: string;
  name: string;
  // Add other properties if necessary
}
interface RIF {
  caseId: string;
  criminalId: string;
  hitId: string;
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

const Level2casedetails: React.FC<{
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
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [rowStatuses, setRowStatuses] = useState<{ [key: number]: { status: string; remarks: string } }>({});
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const [showRIFTable, setShowRIFTable] = useState(false);
  const hitcaseApiService = new HitcaseApiService();
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const rifService = new RIFApiService();

  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
  const userDetails = useSelector((state: any) => state.loginReducer);
  const userFirstName = userDetails.userData?.firstName;
  const loginDetails = userDetails.loginDetails;
  const userId = loginDetails.uid;
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<Pendingcase | null>(null); // State to store the selected courier tracker

  useEffect(() => {
    fetchStatus();

    // const savedActions = JSON.parse(localStorage.getItem('savedActions') || '{}');
    // setSelectedActions(savedActions);
  }, [page, rowsPerPage]);



  const handlePendingAlertClick = async () => {
    try {
      // Call the API to get pending cases
      let results = await authService.getPendingcases();

      // Update the state to show the pending case table
      setShowPendingCaseTable(true);
      setShowPendingRIFTable(false);

      // Set the pending cases data to be displayed in the table
      setPendingcase(results);
      setSearchResults(results);
    } catch (error) {
      // Handle the error as needed
    }
  };
  const handlePendingRIFClick = async () => {
    try {
      let results = await rifService.getRIF();
      setPendingRif(results);
      setSearchResults(results);
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
  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const handleRemarksChangeRif = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };
  const handleIconClick = (index: number) => {
    const currentIndex = page * rowsPerPage + index;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    // If you meant 'pendingcase' or 'pendingRif' instead of 'selectedSearchResult', use it accordingly
    const selectedSearchResult = pendingcase[currentIndex]; // or pendingRif[currentIndex]
    setSelectedCourierTracker(selectedSearchResult);
    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRow(currentIndex);
    setIsRemarksDialogOpen(true);
  };



  const handleRemarksSubmit = async () => {

    try {
      if (selectedRow !== null && selectedRow >= 0) {
        const updatedRemarksAndActions = [...remarksAndActions];
        updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

        setRemarksAndActions(updatedRemarksAndActions);

        const selectedSearchResult = searchResults[selectedRow];

        if (selectedSearchResult) {
          // alert(selectedSearchResult.searchId + '' + selectedSearchResult.criminalId + '' + selectedSearchResult.hitId);
          const PindingcasesPayload = {
            searchId: selectedSearchResult.searchId,
            criminalId: selectedSearchResult.criminalId,
            statusId: selectedStatus,
            remark: remarks,
            hitId: selectedSearchResult.hitId,
            levelId: '3',
            caseId: selectedSearchResult.caseId,
            uid: '1', // Ensure 'userId' or a valid user ID is used here
            criminalName: '',
            matchingScore: '0' // You can set an appropriate value for matchingScore
          };
          // Assuming CreateCaseLifeCycleImplInsert is accessible from this scope

          await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
          // Handle the response if needed
        }
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
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box m={4}>
            <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "10px" }}>
              <Box m={4}>
                <Dialog open={isLevel2casedetailsOpen} fullWidth maxWidth="xl">
                  <DialogActions>
                    <Button onClick={() => setIsLevelcasedetailsOpen(false)} color="primary">
                      <ClearIcon />
                    </Button>
                  </DialogActions>
                  <div className="d-flex justify-content-center" >
                    <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%', height: "100%" }}>
                      <div className="card-body">


                        <Grid container spacing={3} alignItems="center" justifyContent="center">

                          <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="secondary" onClick={handlePendingAlertClick}>
                              Pending Case
                            </Button>
                          </Grid>



                          <Grid item xs={12} sm={2}>
                            <Button variant="contained" color="secondary" onClick={handlePendingRIFClick}>
                              Pending RIF
                            </Button>
                          </Grid>

                        </Grid>
                      </div>
                    </div>
                  </div>



                  {/* {isSearchTableVisible && ( */}
                  <div>



                    <div>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {showPendingCaseTable && (

                          <TableContainer component={Card} style={{ width: "85%", margin: "20px" }}>

                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                              <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                <TableRow className="tableHeading">
                                  <TableCell>S.No</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Matching Score</TableCell>
                                  <TableCell>Remark</TableCell>
                                  <TableCell>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {pendingcase.slice(startIndex, endIndex).map((alert, index) => (

                                  <TableRow

                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{alert.criminalName}</TableCell>
                                    <TableCell>{alert.matchingScore}</TableCell>
                                    <TableCell>{alert.remark}</TableCell>
                                    <TableCell>
                                      <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                        {selectedAction ? (
                                          <VisibilityOffIcon style={{ color: 'red' }} /> // Red color for 'VisibilityOffIcon'
                                        ) : (
                                          <VisibilityIcon style={{ color: 'green' }} /> // Green color for 'VisibilityIcon'
                                        )}
                                      </IconButton>

                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>

                            </Table>
                            <div>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={pendingcase.length}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                style={{ marginLeft: "500px" }}
                              />
                            </div>
                          </TableContainer>
                        )}


                      </Grid>





                    </div>
                    <div>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {showPendingRIFTable && (
                          <TableContainer component={Card} style={{ width: "85%", margin: "20px" }}>
                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                              <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                <TableRow className="tableHeading">
                                  <TableCell>S.No</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Matching Score</TableCell>
                                  <TableCell>Remark</TableCell>
                                  <TableCell>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {pendingRif.slice(startIndex, endIndex).map((alert, index) => (

                                  <TableRow

                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{alert.criminalName}</TableCell>
                                    <TableCell>{alert.matchScore}</TableCell>
                                    <TableCell>{alert.remark}</TableCell>
                                    <TableCell>
                                      <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                        {selectedAction ? (
                                          <VisibilityOffIcon style={{ color: 'red' }} /> // Red color for 'VisibilityOffIcon'
                                        ) : (
                                          <VisibilityIcon style={{ color: 'green' }} /> // Green color for 'VisibilityIcon'
                                        )}
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>

                            </Table>
                            <div>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={pendingRif.length}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                style={{ marginLeft: "500px" }}
                              />
                            </div>
                          </TableContainer>
                        )}


                      </Grid>





                    </div>
                  </div>
                </Dialog>

              </Box>
            </Container >

          </Box >
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
  );
}

export default Level2casedetails;