

import React, { useState, useEffect } from 'react';
import {
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle,
  DialogContent, Container, DialogActions, DialogContentText, TablePagination, IconButton,
} from '@mui/material'

import { Card } from 'react-bootstrap';

import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; import { SelectChangeEvent } from '@mui/material';

import * as XLSX from 'xlsx';
import { GetApp } from '@mui/icons-material';
import { AiFillFileExcel, AiFillPrinter } from 'react-icons/ai';
import Header from '../../../layouts/header/header';
import SearchList from '../CmsSearchList';
import statusApiService from '../../../data/services/master/status/status-api-service';

import { useSelector } from 'react-redux';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import HitdatalifecycleApiService from '../../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/cms_search/hitcase/hitcase-api-service';
import PendingAlertApiService from '../../../data/services/cms_search/PendingAlert/pendingalert-api-service';


interface PindingcasesPayload {
  id: string;
  id1: string;
  criminalId: string;
  name: string;
  MatchScore: string;
  remark: string;
}
// In 'SearchList.tsx'
// In 'Search.tsx'
// In 'Search.tsx'
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
  coName: string; // Add the missing properties 'coName' and 'department'
  department: string;
  // Add any other missing properties as needed
}
interface Hitdata {
  id: string;
  name: string;
  display: string;
  criminalId: string;
  searchId: string;
  MatchScore: string
  statusNowId: string;
  cycleId: string;
}

interface Status {
  id: string;
  name: string;
  // Add other properties if necessary
}
// interface PendingAlert {
//   id: string;
//   searchId: string;
//   hitId: string;
//   criminalId: string;
//   criminalName: string;
//   matchingScore: string;
//   remark: string;
// }
interface PendingAlert {
  id: string;
  searchId: string;
  hitId: string;
  criminalId: string;
  criminalName: string;
  matchingScore: string;
  remark: string;
  statusId: string;
  case_id: string;
  dt: string;
  level_id: string;
  search_id: string;
  // Add other properties as needed
}
const Levelcasedetails: React.FC<{
  isLevelDetailsDialogOpen: boolean;
  setIsLevelDetailsDialogOpen: (value: boolean) => void;
  handleLevelDetailsDialogOpen: () => void;
}> = ({ isLevelDetailsDialogOpen, setIsLevelDetailsDialogOpen, handleLevelDetailsDialogOpen }) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serialNumber, setSerialNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // State to store the selected employee
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State 
  // const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null); // State to store the selected action for the selected row
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const status = new statusApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();

  const hitcaseApiService = new HitcaseApiService();

  const [statusData, setStatusData] = useState<any[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null); // Initialize with null or -1 if no row is selected
  const [remarksData, setRemarksData] = useState<{ [key: number]: string }>({});
  const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
  const [isSearchTableVisible, setIsSearchTableVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedAction, setSelectedAction] = useState<string[]>([]);
  const [showSearchTable, setShowSearchTable] = useState(false);
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const authService = new PendingAlertApiService();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const userFirstName = userDetails.userData?.firstName;
  const loginDetails = userDetails.loginDetails;
  const userId = loginDetails.uid;
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<PendingAlert | null>(null); // State to store the selected courier tracker

  useEffect(() => {
    fetchStatus();
    handlePendingAlertClick();

    // const savedActions = JSON.parse(localStorage.getItem('savedActions') || '{}');
    // setSelectedActions(savedActions);
  }, [page, rowsPerPage]);



  const handlePendingAlertClick = async () => {
    try {
      let results = await authService.getpendingalertdetails();
      setPendingAlert(results);
      setSearchResults(results);
      setShowPendingAlertTable(true);


    } catch (error) {

    }
  };

  const fetchStatus = async () => {
    try {
      const statuses: Status[] = await status.getStatus(); // Specify the type as Status[]

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

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };
  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
    setRemarks(filteredValue);
  };
  // const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRemarks(event.target.value);
  // };

  const handleIconClick = (index: number) => {
    // alert(index);
    const currentIndex = page * rowsPerPage + index;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    const selectedAlert = pendingAlert[index];
    setSelectedCourierTracker(selectedAlert);
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
        //alert(selectedSearchResult);

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
            //id:'null',    
            display: '-', // Replace with actual value for 'display'
            searchId: selectedSearchResult.searchId,
            hitId: selectedSearchResult.hitId,
            criminalId: selectedSearchResult.criminalId,
            levelId: '2', // Replace with the appropriate level ID
            statusNowId: selectedStatus,
            cycleId: '1', // Replace with actual value for 'cycleId'
            remark: remarks,
            uid: userId
            //valid:'1'



          };

          console.log("hitdatalifecycle Payload:", hitdatalifecyclePayload);
          console.log("hitCasePayload:", hitcasePayload);

          if (parseInt(selectedStatus) == 1) {// Insert into hitdatalifecycle table
            await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
          }
          if (parseInt(selectedStatus) == 2) { // Insert into hitcase table
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box m={4}>
            <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "10px" }}>
              <Box m={4}>
                <Dialog open={isLevelDetailsDialogOpen} fullWidth maxWidth="xl">
                  <DialogActions>
                    <Button onClick={() => setIsLevelDetailsDialogOpen(false)} color="primary">
                      <ClearIcon />
                    </Button>
                  </DialogActions>

                  <div className="d-flex justify-content-center" >
                    <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%', height: "100%" }}>
                      <div className="card-body">


                        <Grid container spacing={3} alignItems="center" justifyContent="center">

                          <Grid item xs={12} sm={2}>
                            {/* <Button variant="contained" color="secondary" onClick={handlePendingAlertClick}>
                              Pending Alert
                            </Button> */}
                          </Grid>




                        </Grid>
                      </div>
                    </div>
                  </div>



                  {/* {isSearchTableVisible && ( */}
                  <div>



                    <div>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {showPendingAlertTable && (
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
                                {pendingAlert.slice(startIndex, endIndex).map((alert, index) => (

                                  <TableRow

                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{alert.criminalName}</TableCell>
                                    <TableCell>{alert.matchingScore}</TableCell>
                                    <TableCell>{alert.remark}</TableCell>
                                    <TableCell>

                                      <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                                        {selectedAction ? <VisibilityIcon /> : null}
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
                                count={pendingAlert.length}
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
      <Dialog open={isDialogOpen} fullWidth maxWidth="xl">
        <DialogActions>
          <Button
            onClick={() => setIsDialogOpen(false)}
            color="primary"
          >
            <ClearIcon />
          </Button>
        </DialogActions>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && <SearchList employee={selectedEmployee} />}
        </DialogContent>
      </Dialog>

    </>
  );
}

export default Levelcasedetails;


