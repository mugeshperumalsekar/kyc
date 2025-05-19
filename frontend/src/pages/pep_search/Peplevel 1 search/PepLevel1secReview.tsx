import React, { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, CardContent, Typography, } from '@mui/material'
import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SelectChangeEvent } from '@mui/material';
import Header from '../../../layouts/header/header';
import SearchList from '../PepSearchList';
import statusApiService from '../../../data/services/master/status/status-api-service';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/pep_search/hitcase/hitcase-api-service';
import PendingAlertApiService from '../../../data/services/pep_search/PendingAlert/pendingalert-api-service';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../../CommonStyle/Style.css';
import '../../tracker/Tracker.css';
import PendingcasesApiService from '../../../data/services/pep_search/pendingcases/pending-api-service';

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
};

interface Status {
  id: string;
  name: string;
};

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
  searchName: string;
};

interface RemarkDetails {
  level: string;
  remark: string;
  createdAt: string;
  status: string;
};

const Levelcasedetails = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serialNumber, setSerialNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const status = new statusApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();
  const [statusData, setStatusData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
  const [selectedAction, setSelectedAction] = useState<string[]>([]);
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const authService = new PendingAlertApiService();
  const pendingcases = new PendingcasesApiService();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<PendingAlert | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      let results = await authService.getpendingalertdetails();
      setPendingAlert(results);
      setSearchResults(results);
      setShowPendingAlertTable(true);
    } catch (error) {
      console.log("Error fetching the handlePendingAlertClick:", error);
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

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
    setErrorMessage(null);
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
    setRemarks(filteredValue);
    setErrorMessage(null);
  };

  // const handleIconClick = (index: number) => {
  //   const currentIndex = page * rowsPerPage + index;
  //   const existingAction = selectedActions[currentIndex] || '';
  //   const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
  //   const selectedAlert = pendingAlert[index];
  //   setSelectedCourierTracker(selectedAlert);
  //   setSelectedStatus(existingAction);
  //   setRemarks(existingRemarks);
  //   setSelectedRow(currentIndex);
  //   setIsRemarksDialogOpen(true);
  // };

  const handleIconClick = (index: number) => {
    if (!pendingAlert || !Array.isArray(pendingAlert)) {
      console.error('pendingAlert is undefined or not an array');
      return;
    }
    const currentIndex = page * rowsPerPage + index;
    const selectedSearchResult = pendingAlert[currentIndex];
    if (!selectedSearchResult) {
      console.error('Selected search result is undefined');
      return;
    }
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    const hitdataId = Number(selectedSearchResult.hitId);
    setSelectedCourierTracker(selectedSearchResult);
    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRow(currentIndex);
    setIsRemarksDialogOpen(true);
    handleRemarkDetails(hitdataId);
  };

  const handleRemarkDetails = async (hitdataId: number) => {
    try {
      const response = await pendingcases.getRemarkDetails(hitdataId);
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
          const hitdatalifecyclePayload = {
            searchId: selectedSearchResult.searchId,
            criminalId: selectedSearchResult.criminalId,
            statusId: selectedStatus,
            remark: remarks,
            hitId: selectedSearchResult.hitId,
            levelId: '2',
            caseId: '0',
            uid: loginDetails.id
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
            uid: loginDetails.id
          };
          if (parseInt(selectedStatus) == 1) {
            await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
            handlePendingAlertClick();
          }
          if (parseInt(selectedStatus) == 2) {
            await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
            handlePendingAlertClick();
          }
        }
      }
      setIsRemarksDialogOpen(false);
    } catch (error) {
      console.error("Error submitting remarks:", error);
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

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3,m: 2, }}>
          <Box
            sx={{
              // marginLeft: '30px',
              // marginBottom: '20px',
       		marginTop:'60px',
              	marginLeft: '0px',
             	marginBottom: '24px',
            }}
          >
            <Typography className='allHeading'>LEVEL 1 SECOND REVIEW</Typography>
          </Box>
          <Box mb={4}>
            <Grid container spacing={2} justifyContent="center">
              {showPendingAlertTable && (
                <TableContainer
                  component={Card}
                  style={{
                    overflow: 'auto',
                    maxHeight: '400px',
                    width: '98%',
                  }}
                >
                  <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }} stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{
                            padding: '4px',
                            minWidth: '80px',
                            backgroundColor: '#D3D3D3'
                          }}
                        >
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <strong> S.No</strong>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <span>
                              Search Name
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }} >
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <span>
                              Hit Name
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <span>
                              Score
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                            <span>
                              Remark
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <span>
                              Action
                            </span>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingAlert.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} style={{ textAlign: 'center', padding: '4px', }}>
                            <Typography variant="caption" color="textSecondary">
                              <span> Not Available</span>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingAlert.map((alert, index) => (
                          <TableRow key={index} style={{ height: '32px' }}>
                            <TableCell style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
                            <TableCell style={{ padding: '4px', }}><span>{alert.searchName.charAt(0).toUpperCase() + alert.searchName.slice(1)}</span></TableCell>
                            <TableCell style={{ padding: '4px', }}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleTableRowClick(Number(alert.criminalId));
                                }}
                                style={{
                                  cursor: 'pointer',
                                  color: '#3F51B5',
                                  textDecoration: 'underline',
                                  padding: '4px',
                                }}
                              >
                                <span>
                                  {alert.criminalName.charAt(0).toUpperCase() + alert.criminalName.slice(1)}
                                </span>
                              </a>
                            </TableCell>
                            <TableCell style={{ padding: '4px', }}><span>{alert.matchingScore}</span></TableCell>
                            <TableCell style={{ padding: '4px', }}><span>{alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1) || 'Not Available'}</span></TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px' }}>
                                {selectedAction ? (
                                  <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                ) : (
                                  <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
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
      </Box>
      <Dialog
        open={isRemarksDialogOpen}
        onClose={handleCloseRemarksDialog}
        fullWidth
        maxWidth="md"
        scroll="body"
      >
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
                              <span className="Status-title" style={{ color: '#080807', fontSize: 'small' }}>
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
        <DialogContent sx={{
          padding: '0px',
          overflow: 'hidden',
        }}>
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
          <br></br>
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

export default Levelcasedetails;