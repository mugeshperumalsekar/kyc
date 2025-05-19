
import React, { useState, useEffect } from 'react';
import {
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle,
  DialogContent, Container, DialogActions, DialogContentText, TablePagination, IconButton, Typography,
  StepLabel,
  StepContent,
  Step,
  Stepper
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
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector, TimelineOppositeContent } from '@mui/lab';
import HitdatalifecycleApiService from '../../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/cms_search/hitcase/hitcase-api-service';
import PendingAlertApiService from '../../../data/services/cms_search/PendingAlert/pendingalert-api-service';
import { Col, Row, } from 'antd';
import SearchService from '../../../data/services/Search/search-api-service';
import { RecordTypeData } from '../../../data/services/Search/search-payload';
import Entityview from '../../CmsView/Entityview';
import Individualview from '../../CmsView/Individualview';
import Shipview from '../../CmsView/Shipview';
import Aircraftview from '../../CmsView/Aircraftview';
import SearchApiService from '../../../data/services/cms_search/search-api-service';



export interface Employee {
  id: number;
  name: string;
  dob: string;
  title: string;
  lastName: string;
  state: string;
  dist: string;
  searchName: string;
  address: string;
  designation: string;
  ministry: string;
  placeOfBirth: string;
  coName: string;
  department: string;

}


interface Status {
  id: string;
  name: string;

}

interface PendingAlert {
  id: string;
  searchId: string;
  hitId: string;
  criminalId: string;
  criminalName: string;
  searchName: string;
  matchingScore: string;
  remark: string;
  created_at: string
  statusId: string;
  case_id: string;
  dt: string;
  level_id: string;
  search_id: string;
  cmsId: string;
  recordTypeId: string;
}
interface DisabledIcons {
  [key: string]: boolean;
}

const Levelcasedetails = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serialNumber, setSerialNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [remarks, setRemarks] = useState('');
  const status = new statusApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();
  const [statusData, setStatusData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [remarksData, setRemarksData] = useState<{ [key: number]: string }>({});
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const authService = new PendingAlertApiService();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const userFirstName = userDetails.userData?.firstName;
  const loginDetails = userDetails.loginDetails;
  const userId = loginDetails.uid;
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<PendingAlert | null>(null); // State to store the selected courier tracker
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStatus();
    handlePendingAlertClick();

  }, []);

  const handlePendingAlertClick = async () => {
    try {
      let results = await authService.getpendingalertdetails();

      setPendingAlert(results);
      console.log("results:", results);
      setSearchResults(results);
      setShowPendingAlertTable(true);
    } catch (error) {

    }
  };
  const authApiService = new SearchApiService();
  const fetchStatus = async () => {
    try {
      const statuses: Status[] = await authApiService.getStatus();

      const filteredStatuses = statuses.filter((status: Status) => {
        return status.name === "close" || status.name === "Escalation";
      });

      console.log(filteredStatuses);
      setStatusData(filteredStatuses);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };


  const startIndex = page * rowsPerPage;


  const handleTableRowClick = (
    cmsId: any,

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
     alert('uid: ' + uid + ', recordTypeId: ' + recordTypeId + ', cmsId: ' + cmsId);


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

  const [RecordType, setRecordType] = useState<RecordTypeData[]>([
  ]);

  const recordtype = new SearchService();
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

  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

  const handleIconClick = (index: number, searchId: string, cmsId: string) => {
    // alert(index);
    const currentIndex = `${searchId}-${cmsId}-${index}`;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    const selectedAlert = pendingAlert[index];
    setSelectedCourierTracker(selectedAlert);
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

  const handleRemarksSubmit = async () => {
    try {
      if (selectedRow !== null && searchResults.some(alert => `${alert.searchId}-${alert.id}-${searchResults.indexOf(alert)}` === selectedRow)) {
        const updatedRemarksAndActions = { ...remarksAndActions };
        updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

        setRemarksAndActions(updatedRemarksAndActions);

        const selectedSearchResult = searchResults.find(alert => `${alert.searchId}-${alert.ids}-${searchResults.indexOf(alert)}` === selectedRow);

        if (selectedSearchResult) {
          const hitdatalifecyclePayload = {
            searchId: selectedSearchResult.searchId,
            criminalId: selectedSearchResult.criminalId,
            statusId: selectedStatus,
            remark: remarks,
            hitId: selectedSearchResult.hitId,
            levelId: '2',
            caseId: '0',
            uid: loginDetails.id,
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
            uid: loginDetails.id,
          };

          console.log("hitdatalifecycle Payload:", hitdatalifecyclePayload);
          console.log("hitCasePayload:", hitcasePayload);

          if (parseInt(selectedStatus) == 1) {// Insert into hitdatalifecycle table
            await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
          }
          if (parseInt(selectedStatus) == 2) { // Insert into hitcase table
            // alert(hitcasePayload.criminalId);

            await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
          }
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
      console.error("Error submitting remarks:", error);
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);




  return (

    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }} >
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px', fontFamily: "Bookman Old Style", fontSize: "14px"
                // marginTop: { xs: '64px', sm: '80px', md: '70px' },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Bookman Old Style", fontSize: "14px",
                  color: '#343a40',

                  lineHeight: '2.5',
                }}
              >
                LEVEL 1 SECOND REVIEW
              </Typography>


            </Box>
            <Box m={2}>
              <div  >
                <div className="table-responsive">
                  {showPendingAlertTable && (
                    <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                      <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                        <TableHead sx={{ backgroundColor: '#cccdd1', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                          <TableRow className="tableHeading">
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>S.No</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Search Name</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Hit Name</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Score</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Remark</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Action</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                <Typography style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }} variant="body1">Loading...</Typography>
                              </TableCell>
                            </TableRow>
                          ) : pendingAlert.length > 0 ? (
                            pendingAlert.map((alert, index) => {
                              const currentIndex = `${alert.searchId}-${alert.id}-${index}`;
                              const selectedAction = selectedActions[currentIndex] || '';

                              return (
                                <React.Fragment key={alert.id}>
                                  <TableRow key={alert.cmsId} style={{ height: '32px' }}>
                                    <TableCell style={{ padding: '4px', fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                      {alert.searchName.trim().length > 20
                                        ? `${alert.searchName.trim().substring(0, 20)}...`
                                        : alert.searchName.trim()}
                                    </TableCell>
                                    <TableCell
                                      onClick={
                                        disabledIcons[`${alert.searchId}-${alert.id}-${index}`]
                                          ? () => { } // Prevent click when disabled
                                          : () => handleTableRowClick(alert.criminalId, alert.recordTypeId, index, alert.searchId)
                                      }
                                      style={{
                                        cursor: disabledIcons[`${alert.searchId}-${alert.id}-${index}`] ? 'not-allowed' : 'pointer',
                                        color: disabledIcons[`${alert.searchId}-${alert.id}-${index}`] ? 'gray' : '#3F51B5',
                                        textDecoration: 'underline',
                                        padding: '4px',
                                        fontFamily: 'Bookman Old Style',
                                        fontSize: '12px',
                                      }}
                                    >
                                      {alert.criminalName.trim().length > 30
                                        ? `${alert.criminalName.trim().substring(0, 30)}...`
                                        : alert.criminalName.trim()}
                                    </TableCell>


                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>{alert.matchingScore}</TableCell>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                      {alert.remark || 'Not Available'}
                                    </TableCell>

                                    <TableCell style={{ padding: '4px' }}>
                                      <IconButton
                                        onClick={() =>
                                          handleIconClick(index, alert.searchId, alert.id,)
                                        }
                                        disabled={disabledIcons[`${alert.searchId}-${alert.id}-${index}`]}
                                        style={{ padding: '1px' }}
                                      >
                                        {selectedAction ? (
                                          <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                        ) : (
                                          <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                        )}
                                      </IconButton>
                                      {selectedAction && (
                                        <span>{getStatusName(selectedAction)}</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>
                                <Typography variant="h6" color="textSecondary" style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                  Not Available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>

                      </Table>
                    </TableContainer>
                  )}


                </div>
              </div>
            </Box>
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


        {selectedCourierTracker && (
          <>
            <Box sx={{ textAlign: 'center', fontFamily: 'Bookman Old Style' }}>
              <Typography style={{ fontWeight: 'bold', color: '#333' }}>
                {selectedCourierTracker.criminalName || 'Name Not Available'}
              </Typography>
              <Typography style={{ color: '#555' }}>
                {`Matching Score: ${selectedCourierTracker.matchingScore || 'Matching Score Not Available'}`}
              </Typography>

              {/* Vertical Stepper */}
              <Card
                style={{
                  padding: '1%',
                  boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                  width: '50%',
                  margin: '0 auto',
                }}
              >
                <Stepper
                
              orientation="vertical"
                  style={{
                    fontFamily: "Bookman Old Style",
                    fontSize: "12px",
                  }}
                >


                  <Step active>
                    <StepLabel
                      style={{
                        fontFamily: "Bookman Old Style",
                        fontSize: "12px",
                      }}
                    >
                      Remark
                    </StepLabel>
                    <StepContent>
                    <Typography style={{
                      fontFamily: "Bookman Old Style",
                      fontSize: "12px", width:'50%'
                    }}>    {selectedCourierTracker.remark || 'Remark Not Available'}</Typography>
                  </StepContent>
                   
                  </Step>
                </Stepper>
              </Card>
            </Box>
          </>
        )}

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

        </DialogContent>
      </Dialog>
    </>
  );
}

export default Levelcasedetails;


