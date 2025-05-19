// import React, { useState, useEffect } from 'react';
// import { TextField, Table, TableBody, CardContent, TableCell, Typography, TableContainer, TableHead, TableRow, Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogContent, DialogTitle, Container, DialogActions, DialogContentText, IconButton, } from '@mui/material'
// import { Card } from 'react-bootstrap';
// import ClearIcon from '@mui/icons-material/Clear';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import { SelectChangeEvent } from '@mui/material';
// import Header from '../../../layouts/header/header';
// import statusApiService from '../../../data/services/master/status/status-api-service';
// import { useSelector } from 'react-redux';
// import PendingcasesApiService from '../../../data/services/san_search/pendingcases/pending-api-service';
// import RIFApiService from '../../../data/services/san_search/rif/rif-api-service';
// import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';

// interface DisabledIcons {
//   [key: string]: boolean;
// };

// interface Pendingcase {
//   searchId: string;
//   criminalId: string;
//   hitId: string;
//   criminalName: string;
//   searchName: string;
//   matchingScore: string;
//   remark: string;
//   levelId: string;
//   statusId: string;
//   caseId: string;
// };

// interface RIF {
//   caseId: string;
//   criminalId: string;
//   hitdataId: string;
//   levelId: string;
//   searchId: string;
//   statusId: string;
//   matchScore: string;
//   country: string;
//   state: string;
//   dob: string;
//   remark: string;
//   uid: string;
//   criminalName: string;
//   name: string;
//   searchingScore: number;
//   hitId: number;
//   searchName: string;
// };

// interface Remark {
//   id: number;
//   criminalId: number;
//   hitdataId: number;
//   levelId: number;
//   remark: string;
//   searchId: number;
//   statusId: number;
// };

// interface RemarkRfi {
//   id: number;
//   criminalId: number;
//   hitdataId: number;
//   levelId: number;
//   remark: string;
//   searchId: number;
//   statusId: number;
// };

// interface RemarkTwo {
//   remark: string;
// };

// interface LevelTwo {
//   remark: string;
// };

// const Level3RIF = () => {

//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [name, setName] = useState('');
//   const [identity, setIdentity] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [serialNumber, setSerialNumber] = useState(1);
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
//   const [isRemarksDialogOpenRif, setIsRemarksDialogOpenRif] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const status = new statusApiService();
//   const [statusData, setStatusData] = useState<any[]>([]);
//   const [showTable, setShowTable] = useState(false);
//   const [pendingcase, setPendingcase] = useState<Pendingcase[]>([]);
//   const [pendingRif, setPendingRif] = useState<RIF[]>([]);
//   const authService = new PendingcasesApiService();
//   const [rowStatuses, setRowStatuses] = useState<{ [key: number]: { status: string; remarks: string } }>({});
//   const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
//   const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
//   const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
//   const [selectedAction, setSelectedAction] = useState<string | null>(null);
//   const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
//   const [showRIFTable, setShowRIFTable] = useState(false);
//   const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
//   const rifService = new RIFApiService();
//   const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
//   const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
//   const userDetails = useSelector((state: any) => state.loginReducer);
//   const loginDetails = userDetails.loginDetails;
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedCourierTracker, setSelectedCourierTracker] = useState<Pendingcase | null>(null);
//   const [activeButton, setActiveButton] = useState<string | null>(null);
//   const [selectedCourierTrackers, setSelectedCourierTrackers] = useState<RIF | null>(null);
//   const [pageRfi, setPageRfi] = useState(0);
//   const [rowsPerPageRfi, setRowsPerPageRfi] = useState(5);
//   const [serialNumberRfi, setSerialNumberRfi] = useState(1);
//   const [selectedStatusRfi, setSelectedStatusRfi] = useState('');
//   const [remarksRfi, setRemarksRfi] = useState('');
//   const [selectedRowRfi, setSelectedRowRfi] = useState<number | null>(null);
//   const [selectedActionsRfi, setSelectedActionsRfi] = useState<{ [key: number]: string }>({});
//   const [remarksAndActionsRfi, setRemarksAndActionsRfi] = useState<{ action: string; remarks: string }[]>([]);
//   const [selectedActionRfi, setSelectedActionRfi] = useState<string | null>(null);
//   const [selectedSerialNumberRfi, setSelectedSerialNumberRfi] = useState<number | null>(null);
//   const [selectedCourierTrackerRfi, setSelectedCourierTrackerRfi] = useState<RIF | null>(null);
//   const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
//   const [levelOneRemarkRfi, setLevelOneRemarkRfi] = useState<RemarkRfi[]>([]);
//   const [levelTwoRemarkRfi, setLevelTwoRemarkRfi] = useState<RemarkTwo[]>([]);
//   const [levelTwo, setLevelTwo] = useState<LevelTwo[]>([]);
//   const [levelThree, setLevelThree] = useState<LevelTwo[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [errorMessageRfi, setErrorMessageRfi] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState<React.ReactNode>(null);
//   const [selectedRow, setSelectedRow] = useState<number | null>(null);
//   const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);

//   useEffect(() => {
//     fetchStatus();
//     handlePendingAlertClick();
//   }, [page, rowsPerPage]);

//   const handlePendingAlertClick = async () => {
//     try {
//       let results = await authService.getPendingcaseRIF();
//       setShowPendingCaseTable(true);
//       setShowPendingRIFTable(false);
//       setPendingcase(results);
//       setSearchResults(results);
//       setActiveButton('pendingCase');
//     } catch (error) {
//       console.log("Error fetching the handlePendingAlertClick:", error);
//     }
//   };

//   const handlePendingRIFClick = async () => {
//     try {
//       let results = await rifService.getpendingRIF();
//       setShowPendingRIFTable(true);
//       setShowPendingCaseTable(false);
//       setPendingRif(results);
//       setSearchResults(results);
//       setActiveButton('pendingRIF');
//     } catch (error) {
//       console.log("Error fetching the handlePendingRIFClick:", error);
//     }
//   };

//   const fetchStatus = async () => {
//     try {
//       const filteredStatuses = await status.getStatus();
//       setStatusData(filteredStatuses)
//     } catch (error) {
//       console.error("Error fetching types:", error);
//     }
//   };

//   const handleCloseRemarksDialog = () => {
//     setIsRemarksDialogOpen(false);
//     setSelectedStatus('');
//     setRemarks('');
//     setErrorMessage(null);
//   };

//   const handleCloseRemarksDialogRif = () => {
//     setIsRemarksDialogOpenRif(false);
//     setSelectedStatusRfi('');
//     setRemarksRfi('');
//     setErrorMessageRfi(null);
//   };

//   const handleStatusChange = (event: SelectChangeEvent<string>) => {
//     setSelectedStatus(event.target.value);
//     setErrorMessage(null);
//   };

//   const handleStatusChangeRif = (event: SelectChangeEvent<string>) => {
//     setSelectedStatusRfi(event.target.value);
//     setErrorMessageRfi(null);
//   };

//   const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRemarks(event.target.value);
//     setErrorMessage(null);
//   };

//   const handleRemarksChangeRif = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRemarksRfi(event.target.value);
//     setErrorMessageRfi(null);
//   };

//   const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

//   const handleIconClick = (index: number) => {
//     const currentIndex = page * rowsPerPage + index;
//     const existingAction = selectedActions[currentIndex] || '';
//     const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
//     const selectedSearchResult = pendingcase[currentIndex];
//     const criminalId = Number(selectedSearchResult.criminalId);
//     const hitdataId = Number(selectedSearchResult.hitId);
//     setSelectedStatus(existingAction);
//     setSelectedCourierTracker(selectedSearchResult);
//     setRemarks(existingRemarks);
//     setSelectedRow(currentIndex);
//     setIsRemarksDialogOpen(true);
//     handleLevelOneRemark(criminalId, hitdataId);
//     handleLevelTwoRemarkRfi(criminalId, hitdataId);
//     handleLevelOneStatusTwo(criminalId, hitdataId);
//   };

//   const handleRIFIconClick = (INDEX: number) => {
//     const currentIndex = pageRfi * rowsPerPageRfi + INDEX;
//     const existingAction = selectedActionsRfi[currentIndex] || '';
//     const existingRemarks = remarksAndActionsRfi[currentIndex]?.remarks || '';
//     const selectedSearchResult = pendingRif[currentIndex];
//     const criminalId = Number(selectedSearchResult.criminalId);
//     const hitdataId = Number(selectedSearchResult.hitdataId);
//     setSelectedCourierTrackerRfi(selectedSearchResult);
//     setSelectedStatusRfi(existingAction);
//     setRemarksRfi(existingRemarks);
//     setSelectedRowRfi(currentIndex);
//     setIsRemarksDialogOpenRif(true);
//     handleLevelOneRemark(criminalId, hitdataId);
//     handleLevelTwoRemarkRfi(criminalId, hitdataId);
//     handleLevelThreeRemarkRfi(criminalId, hitdataId);
//     handleLevelthreeStatusTwo(criminalId, hitdataId);
//     handleLevelOneStatusTwo(criminalId, hitdataId);
//   };

//   const handleLevelOneRemark = async (criminalId: number, hitdataId: number) => {
//     try {
//       const response = await authService.getLevelOneRemarkRfi(criminalId, hitdataId, 1, 1);
//       setLevelOneRemark(response);
//     } catch (error) {
//       console.log("Error fetching the handleLevelOneRemark:", error);
//     }
//   };

//   const handleLevelTwoRemarkRfi = async (criminalId: number, hitdataId: number) => {
//     try {
//       const response = await authService.getLevelOneRemarkRfi(criminalId, hitdataId, 2, 2);
//       setLevelTwoRemarkRfi(response);
//     } catch (error) {
//       console.log("Error fetching the handleLevelOneRemarkRfi:", error);
//     }
//   };

//   const handleLevelOneStatusTwo = async (criminalId: number, hitdataId: number) => {
//     try {
//       const response = await authService.getLevelOneRemarkRfi(criminalId, hitdataId, 1, 2);
//       setLevelTwo(response);
//     } catch (error) {
//       console.log("Error feching the handleLevelOneStatusTwo:", error);
//     }
//   };

//   const handleLevelthreeStatusTwo = async (criminalId: number, hitdataId: number) => {
//     try {
//       const response = await authService.getLevelOneRemarkRfi(criminalId, hitdataId, 3, 2);
//       setLevelThree(response);
//     } catch (error) {
//       console.log("Error fetching the handleLevelthreeStatusTwo:", error);
//     }
//   };

//   const handleLevelThreeRemarkRfi = async (criminalId: number, hitdataId: number) => {
//     try {
//       const response = await authService.getLevelOneRemarkRfi(criminalId, hitdataId, 3, 3);
//       setLevelOneRemarkRfi(response);
//     } catch (error) {
//       console.log("Error fetching the handleLevelOneRemarkRfi:", error);
//     }
//   };

//   const getStatusName = (action: string) => {
//     const status = statusData.find((status) => status.id === action);
//     if (status) {
//       const statusClassMap: { [key: string]: string } = {
//         '1': 'green-text',
//         '2': 'red-text',
//         '3': 'yellow-text',
//       };
//       const statusClass = statusClassMap[status.id];
//       if (statusClass) {
//         return (
//           <span className={statusClass}>
//             {status.name}
//           </span>
//         );
//       } else {
//         return status.name;
//       }
//     } else {
//       return '';
//     }
//   };

//   const handleRemarksSubmit = async () => {
//     try {
//       if (selectedStatus === '') {
//         setErrorMessage('Please select a status.');
//         return;
//       }
//       if (!remarks.trim()) {
//         setErrorMessage('Remarks cannot be empty.');
//         return;
//       }
//       setErrorMessage(null);
//       if (selectedRow !== null && selectedRow >= 0) {
//         const updatedRemarksAndActions = [...remarksAndActions];
//         updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
//         setRemarksAndActions(updatedRemarksAndActions);
//         const selectedSearchResult = searchResults[selectedRow];
//         if (selectedSearchResult) {
//           const PindingcasesPayload = {
//             searchId: selectedSearchResult.searchId,
//             criminalId: selectedSearchResult.criminalId,
//             statusId: selectedStatus,
//             remark: remarks,
//             hitId: selectedSearchResult.hitId,
//             levelId: '4',
//             caseId: selectedSearchResult.caseId,
//             uid: loginDetails.id,
//             criminalName: '',
//             matchingScore: '0'
//           };
//           await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
//           handlePendingAlertClick();
//         }
//       }
//       setIsRemarksDialogOpen(false);
//     } catch (error) {
//       console.error('Error submitting remarks:', error);
//       setErrorMessage('An error occurred while submitting remarks.');
//     }
//   };

//   const handleRemarksSubmitRfi = async () => {
//     try {
//       if (selectedStatusRfi === '') {
//         setErrorMessageRfi('Please select a status.');
//         return;
//       }
//       if (!remarksRfi.trim()) {
//         setErrorMessageRfi('Remarks cannot be empty.');
//         return;
//       }
//       setErrorMessageRfi(null);
//       if (selectedRowRfi !== null && selectedRowRfi >= 0) {
//         const updatedRemarksAndActions = [...remarksAndActionsRfi];
//         updatedRemarksAndActions[selectedRowRfi] = { action: selectedStatusRfi, remarks };
//         setRemarksAndActionsRfi(updatedRemarksAndActions);
//         const selectedSearchResult = searchResults[selectedRowRfi];
//         if (selectedSearchResult) {
//           const PindingcasesPayload = {
//             searchId: selectedSearchResult.searchId,
//             criminalId: selectedSearchResult.criminalId,
//             statusId: selectedStatusRfi,
//             remark: remarksRfi,
//             hitId: selectedSearchResult.hitdataId,
//             levelId: '4',
//             caseId: '0',
//             uid: '1',
//             criminalName: selectedSearchResult.name,
//             matchingScore: '0'
//           };
//           await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
//           handlePendingRIFClick();
//         }
//       }
//       setIsRemarksDialogOpenRif(false);
//     } catch (error) {
//       console.error('Error submitting remarks:', error);
//       setErrorMessageRfi('An error occurred while submitting remarks.');
//     }
//   };

//   const handleTableRowClick = (ids: number) => {
//   };

//   return (
//     <>
//       <Box sx={{ display: 'flex' }}>
//         <Header />
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Box m={4}>
//             <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "1px", margin: "10px" }}>
//               <Box m={4}>
//                 <div className="d-flex justify-content-center" >
//                   <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%', height: "100%" }}>
//                     <div className="card-body">
//                       <Grid container spacing={2} alignItems="center" justifyContent="center">
//                         <Grid item xs={12} sm={6} md={3}>
//                           <Button
//                             variant="contained"
//                             sx={{
//                               backgroundColor: activeButton === 'pendingCase' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
//                               color: 'white',
//                               width: '100%',
//                               padding: '10px 20px',
//                               fontSize: '1rem'
//                             }}
//                             onClick={handlePendingAlertClick}
//                           >
//                             Pending Case
//                           </Button>
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={3}>
//                           <Button
//                             variant="contained"
//                             sx={{
//                               backgroundColor: activeButton === 'pendingRIF' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
//                               color: 'white',
//                               width: '100%',
//                               padding: '10px 20px',
//                               fontSize: '1rem'
//                             }}
//                             onClick={handlePendingRIFClick}
//                           >
//                             Pending RFI
//                           </Button>
//                         </Grid>
//                       </Grid>
//                       <br></br>
//                       <div>
//                         <Grid container spacing={1} alignItems="center" justifyContent="center">
//                           {showPendingCaseTable && (
//                             <TableContainer component={Card} style={{ width: "85%", margin: "20px" }}>
//                               <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
//                                 <TableHead sx={{ backgroundColor: '#cccdd1' }}>
//                                   <TableRow className="tableHeading">
//                                     <TableCell><strong>S.No</strong></TableCell>
//                                     <TableCell><strong>Search Name</strong></TableCell>
//                                     <TableCell><strong>Hit Name</strong></TableCell>
//                                     <TableCell><strong>Matching Score</strong></TableCell>
//                                     <TableCell><strong>Remark</strong></TableCell>
//                                     <TableCell><strong>Action</strong></TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {pendingcase.length === 0 ? (
//                                     <TableRow>
//                                       <TableCell colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
//                                         <Typography variant="h6" color="textSecondary">Not Available</Typography>
//                                       </TableCell>
//                                     </TableRow>
//                                   ) : (pendingcase.map((alert, index) => (
//                                     <TableRow key={index}>
//                                       <TableCell>{index + 1}</TableCell>
//                                       <TableCell>{alert.searchName}</TableCell>
//                                       <TableCell onClick={() => handleTableRowClick(Number(alert.criminalId))} style={{ cursor: 'pointer' }}>{alert.criminalName}</TableCell>
//                                       <TableCell>{alert.matchingScore}</TableCell>
//                                       <TableCell>{alert.remark}</TableCell>
//                                       <TableCell>
//                                         <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
//                                           {selectedAction ? (
//                                             <VisibilityOffIcon style={{ color: 'red' }} />
//                                           ) : (
//                                             <VisibilityIcon style={{ color: 'green' }} />
//                                           )}
//                                         </IconButton>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))
//                                   )}
//                                 </TableBody>
//                               </Table>
//                             </TableContainer>
//                           )}
//                         </Grid>
//                       </div>
//                       <div>
//                         <Grid container spacing={1} alignItems="center" justifyContent="center">
//                           {showPendingRIFTable && (
//                             <TableContainer component={Card} style={{ width: "85%", margin: "20px" }}>
//                               <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
//                                 <TableHead sx={{ backgroundColor: '#cccdd1' }}>
//                                   <TableRow className="tableHeading">
//                                     <TableCell><strong>S.No</strong></TableCell>
//                                     <TableCell><strong>Search Name</strong></TableCell>
//                                     <TableCell><strong>Hit Name</strong></TableCell>
//                                     <TableCell><strong>Matching Score</strong></TableCell>
//                                     <TableCell><strong>Remark</strong></TableCell>
//                                     <TableCell><strong>Action</strong></TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {pendingRif.length === 0 ? (
//                                     <TableRow>
//                                       <TableCell colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
//                                         <Typography variant="h6" color="textSecondary">
//                                           Not Available
//                                         </Typography>
//                                       </TableCell>
//                                     </TableRow>
//                                   ) : (pendingRif.map((alert, index) => (
//                                     <TableRow
//                                     >
//                                       <TableCell>{index + 1}</TableCell>
//                                       <TableCell>{alert.searchName}</TableCell>
//                                       <TableCell onClick={() => handleTableRowClick(Number(alert.criminalId))} style={{ cursor: 'pointer' }}>{alert.name}</TableCell>
//                                       <TableCell>{alert.searchingScore}</TableCell>
//                                       <TableCell>{alert.remark}</TableCell>
//                                       <TableCell>
//                                         <IconButton onClick={() => handleRIFIconClick(index)} style={{ padding: '1px 1px' }}>
//                                           {selectedActionRfi ? (
//                                             <VisibilityOffIcon style={{ color: 'red' }} />
//                                           ) : (
//                                             <VisibilityIcon style={{ color: 'green' }} />
//                                           )}
//                                         </IconButton>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))
//                                   )}
//                                 </TableBody>
//                               </Table>
//                             </TableContainer>
//                           )}
//                         </Grid>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Box>
//             </Container >
//           </Box >
//           <Dialog
//             open={isRemarksDialogOpen}
//             onClose={handleCloseRemarksDialog}
//             fullWidth
//             maxWidth="md"
//           >
//             <DialogActions>
//               <Button onClick={handleCloseRemarksDialog} color="primary">
//                 <ClearIcon />
//               </Button>
//             </DialogActions>
//             {selectedCourierTracker && (
//               <>
//                 <div style={{ textAlign: 'center' }}>
//                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{selectedCourierTracker.criminalName}</div>
//                   <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
//                     {`Matching Score : ${selectedCourierTracker.matchingScore}`}
//                   </div>
//                 </div>
//                 <Card style={{ margin: '20px 0', boxShadow: 'rgb(0 0 0/28%)0px 4px 8px', width: '90%', marginLeft: '5%', maxHeight: '230px', borderRadius: '8px' }}>
//                   <CardContent>
//                     <Timeline position="left">
//                       <TimelineItem>
//                         <TimelineContent>{levelOneRemark.length > 0 ? levelOneRemark[0].remark : "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#1976d2' }} />
//                           <TimelineConnector style={{ background: '#1976d2' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L1 First Review</TimelineContent>
//                       </TimelineItem>
//                       <TimelineItem>
//                         <TimelineContent>{levelTwoRemarkRfi.length > 0 && levelTwoRemarkRfi[0].remark ? levelTwoRemarkRfi[0].remark : levelTwo.length > 0 && levelTwo[0].remark ? levelTwo[0].remark : "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#1976d2' }} />
//                           <TimelineConnector style={{ background: '#1976d2' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L1 Second Review</TimelineContent>
//                       </TimelineItem>
//                       <TimelineItem>
//                         <TimelineContent>{selectedCourierTracker.remark || "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#388e3c' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L2 Search Review</TimelineContent>
//                       </TimelineItem>
//                     </Timeline>
//                   </CardContent>
//                 </Card>
//               </>
//             )}
//             <DialogTitle>Enter Remarks</DialogTitle>
//             <DialogContentText style={{ textAlign: 'center' }}>
//               Select a status and enter remarks for this employee.
//             </DialogContentText>
//             <DialogContent>
//               {errorMessage && (
//                 <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
//                   {errorMessage}
//                 </Typography>
//               )}
//               <Grid container alignItems="center" justifyContent="center">
//                 <Grid item xs={12} sm={3}>
//                   <FormControl fullWidth variant="outlined" margin="dense">
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       label="Status"
//                       value={selectedStatus}
//                       onChange={handleStatusChange}
//                     >
//                       <MenuItem value="">Select Status</MenuItem>
//                       {statusData.map((status) => (
//                         <MenuItem key={status.id} value={status.id}>
//                           {status.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//               {selectedStatus && (
//                 <div>
//                   <DialogContentText style={{ textAlign: 'center' }}>
//                     Enter your remarks for this action.
//                   </DialogContentText>
//                   <Grid container alignItems="center" justifyContent="center">
//                     <Grid item xs={12} sm={8}>
//                       <TextField
//                         autoFocus
//                         margin="dense"
//                         id="outlined-multiline-static"
//                         label="Remarks"
//                         type="text"
//                         fullWidth
//                         multiline
//                         rows={4}
//                         value={remarks}
//                         defaultValue="Default Value"
//                         onChange={handleRemarksChange}
//                       />
//                     </Grid>
//                   </Grid>
//                 </div>
//               )}
//             </DialogContent>
//             <DialogActions>
//               <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
//                 Save
//               </button>
//             </DialogActions>
//           </Dialog>
//           {/* RFI */}
//           <Dialog
//             open={isRemarksDialogOpenRif}
//             onClose={handleCloseRemarksDialogRif}
//             fullWidth
//             maxWidth="md"
//           >
//             <DialogActions>
//               <Button onClick={handleCloseRemarksDialogRif} color="primary">
//                 <ClearIcon />
//               </Button>
//             </DialogActions>

//             {selectedCourierTrackerRfi && (
//               <>
//                 <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
//                     {selectedCourierTrackerRfi.name}
//                   </div>
//                   <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
//                     {`Matching Score: ${selectedCourierTrackerRfi.searchingScore}`}
//                   </div>
//                 </div>
//                 <Card style={{ margin: '20px 0', boxShadow: 'rgb(0 0 0/28%)0px 4px 8px', width: '90%', marginLeft: '5%', maxHeight: '300px', borderRadius: '8px' }}>
//                   <CardContent>
//                     <Timeline position="left">
//                       <TimelineItem>
//                         <TimelineContent>{levelOneRemark.length > 0 && levelOneRemark[0].remark
//                           ? levelOneRemark[0].remark : levelTwo.length > 0 && levelTwo[0].remark ? levelTwo[0].remark : "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#1976d2' }} />
//                           <TimelineConnector style={{ background: '#1976d2' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L1 First Review</TimelineContent>
//                       </TimelineItem>
//                       <TimelineItem>
//                         <TimelineContent>{levelTwoRemarkRfi.length > 0 ? levelTwoRemarkRfi[0].remark : "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#1976d2' }} />
//                           <TimelineConnector style={{ background: '#1976d2' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L1 Second Review</TimelineContent>
//                       </TimelineItem>
//                       <TimelineItem>
//                         <TimelineContent>{levelOneRemarkRfi.length > 0 && levelOneRemarkRfi[0].remark
//                           ? levelOneRemarkRfi[0].remark
//                           : levelThree.length > 0 && levelThree[0].remark
//                             ? levelThree[0].remark
//                             : "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#1976d2' }} />
//                           <TimelineConnector style={{ background: '#1976d2' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L2 Search Review</TimelineContent>
//                       </TimelineItem>
//                       <TimelineItem>
//                         <TimelineContent>{selectedCourierTrackerRfi.remark || "Not Available"}</TimelineContent>
//                         <TimelineSeparator>
//                           <TimelineDot style={{ background: '#388e3c' }} />
//                         </TimelineSeparator>
//                         <TimelineContent style={{ fontWeight: 'bold' }}>L3 Search Review</TimelineContent>
//                       </TimelineItem>
//                     </Timeline>
//                   </CardContent>
//                 </Card>
//               </>
//             )}
//             <DialogTitle>Enter Remarks</DialogTitle>
//             <DialogContentText style={{ textAlign: 'center' }}>
//               Select a status and enter remarks for this employee.
//             </DialogContentText>
//             <DialogContent>
//               {errorMessageRfi && (
//                 <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
//                   {errorMessageRfi}
//                 </Typography>
//               )}
//               <Grid container alignItems="center" justifyContent="center">
//                 <Grid item xs={12} sm={3}>
//                   <FormControl fullWidth variant="outlined" margin="dense">
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                       label="Status"
//                       value={selectedStatusRfi}
//                       onChange={handleStatusChangeRif}
//                     >
//                       <MenuItem value="">Select Status</MenuItem>
//                       {statusData.map((status) => (
//                         <MenuItem key={status.id} value={status.id}>
//                           {status.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//               {selectedStatusRfi && (
//                 <div>
//                   <DialogContentText style={{ textAlign: 'center' }}>
//                     Enter your remarks for this action.
//                   </DialogContentText>
//                   <Grid container alignItems="center" justifyContent="center">
//                     <Grid item xs={12} sm={8}>
//                       <TextField
//                         autoFocus
//                         margin="dense"
//                         id="outlined-multiline-static"
//                         label="Remarks"
//                         type="text"
//                         fullWidth
//                         multiline
//                         rows={4}
//                         value={remarksRfi}
//                         defaultValue="Default Value"
//                         onChange={handleRemarksChangeRif}
//                       />
//                     </Grid>
//                   </Grid>
//                 </div>
//               )}
//             </DialogContent>
//             <DialogActions>
//               <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmitRfi}>
//                 Save
//               </button>
//             </DialogActions>
//           </Dialog>
//           <Dialog
//             open={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             fullWidth
//             maxWidth="lg"
//           >
//             <DialogContent>
//               {modalContent}
//             </DialogContent>
//             <DialogActions>
//               <button type="button" className="btn btn-outline-primary" onClick={() => setIsModalOpen(false)}>Close</button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Box>
//     </>
//   );
// }

// export default Level3RIF;

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, CardContent, TableCell, Paper, Typography, TableContainer, TableHead, TableRow, Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogContent, DialogTitle, Container, DialogActions, DialogContentText, IconButton, } from '@mui/material'
import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SelectChangeEvent } from '@mui/material';
import Header from '../../../layouts/header/header';
import statusApiService from '../../../data/services/master/status/status-api-service';
import { useSelector } from 'react-redux';
import PendingcasesApiService from '../../../data/services/san_search/pendingcases/pending-api-service';
import RIFApiService from '../../../data/services/san_search/rif/rif-api-service';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import ViewService from '../../../data/services/san_search/viewpage/view_api_service';
import { Country, List, Program, All, Customer, Address, IdentificationData, AliasesData, DetailsData, RecordDTO, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../../data/services/san_search/viewpage/view_payload';
import { useParams } from 'react-router-dom';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import '../../tracker/Tracker.css';

interface DisabledIcons {
  [key: string]: boolean;
};

interface Pendingcase {
  searchId: number;
  criminalId: number;
  hitId: string;
  criminalName: string;
  searchName: string;
  matchingScore: number;
  remark: string;
  levelId: number;
  statusId: number;
  caseId: number;
  fileType: number;
};

interface RIF {
  caseId: number;
  criminalId: number;
  hitdataId: number;
  levelId: number;
  searchId: number;
  statusId: number;
  matchScore: string;
  country: string;
  state: string;
  dob: string;
  remark: string;
  uid: string;
  criminalName: string;
  name: string;
  searchingScore: number;
  hitId: number;
  searchName: string;
};

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

interface RemarkDetails {
  level: string;
  remark: string;
  createdAt: string;
  status: String;
};

const Level3RIF = () => {

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serialNumber, setSerialNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [isRemarksDialogOpenRif, setIsRemarksDialogOpenRif] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const status = new statusApiService();
  const [statusData, setStatusData] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [pendingcase, setPendingcase] = useState<Pendingcase[]>([]);
  const [pendingRif, setPendingRif] = useState<RIF[]>([]);
  const authService = new PendingcasesApiService();
  const [rowStatuses, setRowStatuses] = useState<{ [key: number]: { status: string; remarks: string } }>({});
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const [showRIFTable, setShowRIFTable] = useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const rifService = new RIFApiService();
  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<Pendingcase | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [selectedCourierTrackers, setSelectedCourierTrackers] = useState<RIF | null>(null);
  const [pageRfi, setPageRfi] = useState(0);
  const [rowsPerPageRfi, setRowsPerPageRfi] = useState(5);
  const [serialNumberRfi, setSerialNumberRfi] = useState(1);
  const [selectedStatusRfi, setSelectedStatusRfi] = useState('');
  const [remarksRfi, setRemarksRfi] = useState('');
  const [selectedRowRfi, setSelectedRowRfi] = useState<number | null>(null);
  const [selectedActionsRfi, setSelectedActionsRfi] = useState<{ [key: number]: string }>({});
  const [remarksAndActionsRfi, setRemarksAndActionsRfi] = useState<{ action: string; remarks: string }[]>([]);
  const [selectedActionRfi, setSelectedActionRfi] = useState<string | null>(null);
  const [selectedSerialNumberRfi, setSelectedSerialNumberRfi] = useState<number | null>(null);
  const [selectedCourierTrackerRfi, setSelectedCourierTrackerRfi] = useState<RIF | null>(null);
  const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
  const [levelOneRemarkRfi, setLevelOneRemarkRfi] = useState<RemarkRfi[]>([]);
  const [levelTwoRemarkRfi, setLevelTwoRemarkRfi] = useState<RemarkTwo[]>([]);
  const [levelTwo, setLevelTwo] = useState<LevelTwo[]>([]);
  const [levelThree, setLevelThree] = useState<LevelTwo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorMessageRfi, setErrorMessageRfi] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
  const [showModal, setShowModal] = useState(false);
  const [showModallogical, setShowModallogical] = useState(false);
  const [showModalgroup, setShowModalgroup] = useState(false);
  const [showModalun, setShowModalun] = useState(false);
  const viewservice = new ViewService();
  const [Groupaliases, setGroupaliases] = useState<GroupAliases[]>([]);
  const [CityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const [groupidentification, setGroupIdentification] = useState<GroupIdentification[]>([]);
  const [UnDetails, setUnDetails] = useState<UnDetails[]>([]);
  const [Unaliases, setUnaliases] = useState<UnAliases[]>([]);
  const [UnDesignationDetails, setUnDesignationDetails] = useState<UnDesignationDetails[]>([]);
  const [details, setdetails] = useState<DetailsData[]>([]);
  const [address, setaddress] = useState<Address[]>([]);
  const [identification, setIdentification] = useState<IdentificationData[]>([]);
  const [aliases, setAliases] = useState<AliasesData[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { id, ids } = useParams();
  const [List, setList] = useState<List[]>([]);
  const [country, setCountry] = useState<Country[]>([]);
  const [Program, setProgram] = useState<Program[]>([]);
  const [RecordType, setRecordType] = useState<All[]>([]);
  const [logicalidentification, setLogicalIdentification] = useState<logicalIdentification[]>([]);
  const [logicalAddress, setLogicalAddress] = useState<logicaAddress[]>([]);
  const [logicaldetails, setLogicaldetails] = useState<LogicalDetails[]>([]);
  const [logicalcitiy, setLogicalcitiy] = useState<Logicalcitiy[]>([]);
  const [logicalBirthDetails, setLogicalBirthDetails] = useState<LogicalBirthDetails[]>([]);
  const [logicalAka, setLogicalAka] = useState<LogicalAKADetails[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number | null>(null);
  const [remarkDetails, setRemarkDetails] = useState<RemarkDetails[]>([]);

  const [countryData, setcountryData] = useState<Customer>({
    id: 0,
    city: '',
    State: '',
  });

  const [formData, setFormData] = useState<RecordDTO>({
    ids: 0,
    name: '',
    address: '',
    program: '',
    entityType: '',
    list: '',
    score: 0,
    fileType: 0,
    fileList: '',
    criminalId: '',
    searchId: '',
    hitId: '',
    nationality: '',
    citizenship: '',
    passport: '',
    Country: '',
    accountNumber: '',
  });

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

  useEffect(() => {
    fetchCountry();
    fetchList();
    fetchProgram();
    fetchAll();
    fetchAddresses();
    fetchIdentification();
    fetchAliases();
    fetchDetails();
    fetchiden();
    fetchaddress();
    fetchadetails();
    fetchacitiy();
    fetchBirthDetails();
    fetchAka();
    fetchaliase();
    fetchanationalid();
    fetchCityDetails();
    fetchUnDetails();
    fetchunaliase();
    fetchundesingation();
  }, [ids]);

  useEffect(() => {
    const handleKeyDown = (event: { key: any; }) => {
      if (!cardRef.current) return;
      const { key } = event;
      const element = cardRef.current;
      if (key === 'ArrowUp') {
        element.scrollTop -= 50;
      } else if (key === 'ArrowDown') {
        element.scrollTop += 50;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchCountry = async () => {
    try {
      const countryData = await viewservice.getCountryList();
      setCountry(countryData);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchList = async () => {
    try {
      const ListData = await viewservice.getList();
      setList(ListData);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchProgram = async () => {
    try {
      const ProgramData = await viewservice.getProgram();
      setProgram(ProgramData);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchAll = async () => {
    try {
      const AllData = await viewservice.getAll();
      setRecordType(AllData);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const Address = await viewservice.getAddresses(id);
      setaddress(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchAliases = async () => {
    try {
      const aliases = await viewservice.getAliases(id);
      setAliases(aliases);
    } catch (error) {
      console.error("Error fetching aliases list:", error);
    }
  };

  const fetchIdentification = async () => {
    try {
      const identification = await viewservice.getIdentification(id);
      setIdentification(identification);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const details = await viewservice.getDetails(id);
      setdetails(details);
    } catch (error) {
      console.error("Error fetching the details:", error);
    }
  };

  const fetchiden = async () => {
    try {
      const Address = await viewservice.getLogicalIdentification(id);
      setLogicalIdentification(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchaddress = async () => {
    try {
      const Address = await viewservice.getLogicalAddress(id);
      setLogicalAddress(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchadetails = async () => {
    try {
      const Address = await viewservice.getLogicaldetails(id);
      setLogicaldetails(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchacitiy = async () => {
    try {
      const Address = await viewservice.getLogicalcity(id);
      setLogicalcitiy(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchBirthDetails = async () => {
    try {
      const Address = await viewservice.getLogicalBirthDetails(id);
      setLogicalBirthDetails(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchAka = async () => {
    try {
      const Address = await viewservice.getLogicalAka(id);
      setLogicalAka(Address);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchaliase = async () => {
    try {
      const Groupaliases = await viewservice.getGroupAliases(id);
      setGroupaliases(Groupaliases);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchCityDetails = async () => {
    try {
      const CityDetails = await viewservice.getGroupCityDetails(id);
      setCityDetails(CityDetails);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchanationalid = async () => {
    try {
      const groupidentification = await viewservice.getGroupIdentification(id);
      setGroupIdentification(groupidentification);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchUnDetails = async () => {
    try {
      const UnDetails = await viewservice.getUnDetails(id);
      setUnDetails([UnDetails]);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchunaliase = async () => {
    try {
      const Unaliases = await viewservice.getUnAliases(id);
      setUnaliases(Unaliases);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const fetchundesingation = async () => {
    try {
      const UnDesignationDetails = await viewservice.getUnDesignationDetailss(id);
      setUnDesignationDetails(UnDesignationDetails);
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };

  const handlePendingAlertClick = async () => {
    try {
      let results = await authService.getPendingcaseRIF();
      setShowPendingCaseTable(true);
      setShowPendingRIFTable(false);
      setPendingcase(results);
      setSearchResults(results);
      setActiveButton('pendingCase');
    } catch (error) {
      console.log("Error fetching the handlePendingAlertClick:", error);
    }
  };

  const handlePendingRIFClick = async () => {
    try {
      let results = await rifService.getpendingRIF();
      setShowPendingRIFTable(true);
      setShowPendingCaseTable(false);
      setPendingRif(results);
      setSearchResults(results);
      setActiveButton('pendingRIF');
    } catch (error) {
      console.log("Error fetching the handlePendingRIFClick:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const filteredStatuses = await status.getStatus();
      setStatusData(filteredStatuses)
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleCloseRemarksDialog = () => {
    setIsRemarksDialogOpen(false);
    setSelectedStatus('');
    setRemarks('');
    setErrorMessage(null);
  };

  const handleCloseRemarksDialogRif = () => {
    setIsRemarksDialogOpenRif(false);
    setSelectedStatusRfi('');
    setRemarksRfi('');
    setErrorMessageRfi(null);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
    setErrorMessage(null);
  };

  const handleStatusChangeRif = (event: SelectChangeEvent<string>) => {
    setSelectedStatusRfi(event.target.value);
    setErrorMessageRfi(null);
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
    setErrorMessage(null);
  };

  const handleRemarksChangeRif = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarksRfi(event.target.value);
    setErrorMessageRfi(null);
  };

  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

  const handleIconClick = (index: number) => {
    const currentIndex = page * rowsPerPage + index;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    const selectedSearchResult = pendingcase[currentIndex];
    const hitdataId = Number(selectedSearchResult.hitId);
    setSelectedStatus(existingAction);
    setSelectedCourierTracker(selectedSearchResult);
    setRemarks(existingRemarks);
    setSelectedRows(currentIndex);
    setIsRemarksDialogOpen(true);
    handleRemarkDetails(hitdataId);
  };

  const handleRIFIconClick = (INDEX: number) => {
    const currentIndex = pageRfi * rowsPerPageRfi + INDEX;
    const existingAction = selectedActionsRfi[currentIndex] || '';
    const existingRemarks = remarksAndActionsRfi[currentIndex]?.remarks || '';
    const selectedSearchResult = pendingRif[currentIndex];
    const hitdataId = Number(selectedSearchResult.hitdataId);
    setSelectedCourierTrackerRfi(selectedSearchResult);
    setSelectedStatusRfi(existingAction);
    setRemarksRfi(existingRemarks);
    setSelectedRowRfi(currentIndex);
    setIsRemarksDialogOpenRif(true);
    handleRemarkDetails(hitdataId);
  };

  const handleRemarkDetails = async (hitdataId: number) => {
    try {
      const response = await authService.getRemarkDetails(hitdataId);
      setRemarkDetails(response);
    } catch (error) {
      console.log("Error fetching the handleRemarkDetails:", error);
    }
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
      if (selectedStatus === '') {
        setErrorMessage('Please select a status.');
        return;
      }
      if (!remarks.trim()) {
        setErrorMessage('Remarks cannot be empty.');
        return;
      }
      setErrorMessage(null);
      if (selectedRows !== null) {
        const updatedRemarksAndActions = { ...remarksAndActions };
        const rowKey = `${formData.searchId}-${formData.ids}`;
        updatedRemarksAndActions[rowKey] = { action: selectedStatus, remarks };
        setRemarksAndActions(updatedRemarksAndActions);
        const selectedSearchResult = searchResults[selectedRows];
        const PindingcasesPayload = {
          searchId: selectedSearchResult.searchId,
          criminalId: selectedSearchResult.criminalId,
          statusId: selectedStatus,
          remark: remarks,
          hitId: selectedSearchResult.hitId,
          levelId: '4',
          caseId: selectedSearchResult.caseId,
          uid: loginDetails.id,
          criminalName: '',
          matchingScore: '0'
        };
        await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
        handlePendingAlertClick();
      }
      setIsRemarksDialogOpen(false);
    } catch (error) {
      console.error('Error submitting remarks:', error);
      setErrorMessage('An error occurred while submitting remarks.');
    }
  };

  const handleRemarksSubmitRfi = async () => {
    try {
      if (selectedStatusRfi === '') {
        setErrorMessageRfi('Please select a status.');
        return;
      }
      if (!remarksRfi.trim()) {
        setErrorMessageRfi('Remarks cannot be empty.');
        return;
      }
      setErrorMessageRfi(null);
      if (selectedRowRfi !== null && selectedRowRfi >= 0) {
        const updatedRemarksAndActions = [...remarksAndActionsRfi];
        updatedRemarksAndActions[selectedRowRfi] = { action: selectedStatusRfi, remarks };
        setRemarksAndActionsRfi(updatedRemarksAndActions);
        const selectedSearchResult = searchResults[selectedRowRfi];
        if (selectedSearchResult) {
          const PindingcasesPayload = {
            searchId: selectedSearchResult.searchId,
            criminalId: selectedSearchResult.criminalId,
            statusId: selectedStatusRfi,
            remark: remarksRfi,
            hitId: selectedSearchResult.hitdataId,
            levelId: '4',
            caseId: '0',
            uid: '1',
            criminalName: selectedSearchResult.name,
            matchingScore: '0'
          };
          await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
          handlePendingRIFClick();
        }
      }
      setIsRemarksDialogOpenRif(false);
    } catch (error) {
      console.error('Error submitting remarks:', error);
      setErrorMessageRfi('An error occurred while submitting remarks.');
    }
  };

  const handleTableRowClick = async (criminalId: number, fileType: number, index: number, searchId: string) => {
    const id = String(criminalId);
    if (fileType === 1) {
      setShowModal(true);
      const currentIndex = `${searchId}-${criminalId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);
      try {
        setLoading(true);
        const detailsData = await viewservice.getDetails(id);
        setdetails(detailsData);
        const identificationData = await viewservice.getIdentification(id);
        setIdentification(identificationData);
        const aliasesData = await viewservice.getAliases(id);
        setAliases(aliasesData);
        const addressData = await viewservice.getAddresses(id);
        setaddress(addressData);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
      setLoading(false);
    } else if (fileType === 2) {
      setShowModallogical(true);
      const currentIndex = `${searchId}-${criminalId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);
      try {
        setLoading(true);
        const logicalidentification = await viewservice.getLogicalIdentification(id);
        setLogicalIdentification(logicalidentification);
        const logicalAddress = await viewservice.getLogicalAddress(id);
        setLogicalAddress(logicalAddress);
        const logicaldetails = await viewservice.getLogicaldetails(id);
        setLogicaldetails(logicaldetails);
        const logicalcitiy = await viewservice.getLogicalcity(id);
        setLogicalcitiy(logicalcitiy);
        const logicalBirthDetails = await viewservice.getLogicalBirthDetails(id);
        setLogicalBirthDetails(logicalBirthDetails);
        const logicalAka = await viewservice.getLogicalAka(id);
        setLogicalAka(logicalAka);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
      setLoading(false);
    } else if (fileType === 3) {
      setShowModalgroup(true);
      const currentIndex = `${searchId}-${criminalId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex)
      try {
        setLoading(true);
        const Groupaliases = await viewservice.getGroupAliases(id);
        setGroupaliases(Groupaliases);
        const CityDetails = await viewservice.getGroupCityDetails(id);
        setCityDetails(CityDetails);
        const groupidentification = await viewservice.getGroupIdentification(id);
        setGroupIdentification(groupidentification);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
      setLoading(false);
    }
    else if (fileType === 4) {
      setShowModalun(true);
      const currentIndex = `${searchId}-${criminalId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);
      try {
        setLoading(true);
        const UnDetails = await viewservice.getUnDetails(id);
        setUnDetails([UnDetails]);
        const Unaliases = await viewservice.getUnAliases(id);
        setUnaliases(Unaliases);
        const UnDesignationDetails = await viewservice.getUnDesignationDetailss(id);
        setUnDesignationDetails(UnDesignationDetails);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModallogical = () => {
    setShowModallogical(false);
  };

  const handleCloseModalgroup = () => {
    setShowModalgroup(false);
  };

  const handleCloseModalun = () => {
    setShowModalun(false);
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

  const handlePrinted = useReactToPrint({
    content: () => myRef.current,
    pageStyle: `
        @page {
          margin-left: 20mm; /* Adjust this value as per your requirement */
        }
        body {
          margin: 0;
        }
      `,
  });

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
          <Box sx={{ marginLeft: '15px', marginBottom: '20px', marginTop: '44px' }}>
            <Typography className='allHeading'>LEVEL 3 SEARCH</Typography>
          </Box>
          <Box m={4}>
            <Grid container spacing={2} justifyContent="center">
              {showPendingCaseTable && (
                <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px' }}>
                  <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                    <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                      <TableRow className="tableHeading">
                        <TableCell style={{ padding: '4px', minWidth: '80px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}> <span>S.No</span></Typography>   </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }} >
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Search Name</span></Typography></TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }} >
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Hit Name</span></Typography></TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Score</span></Typography>  </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold' }}><span>Remark</span></Typography>  </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}><span>Action</span></Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingcase.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} style={{ textAlign: 'center', padding: '4px' }}>
                            <Typography variant="h6" color="textSecondary"><span>Not Available</span></Typography>
                          </TableCell>
                        </TableRow>
                      ) : (pendingcase.map((alert, index) => (
                        <TableRow key={index} style={{ height: '32px' }}>
                          <TableCell style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
                          <TableCell style={{ padding: '4px', }}><span>{alert.searchName.charAt(0).toUpperCase() + alert.searchName.slice(1)}</span></TableCell>
                          <TableCell onClick={() => handleTableRowClick(alert.criminalId, alert.fileType, index, alert.searchId.toString())} style={{
                            cursor: 'pointer',
                            color: '#3F51B5',
                            textDecoration: 'underline',
                            padding: '4px',
                          }}>
                            <span>{alert.criminalName.charAt(0).toUpperCase() + alert.criminalName.slice(1)}</span></TableCell>
                          <TableCell style={{ padding: '4px', }}><span>{alert.matchingScore}</span></TableCell>
                          {/* <TableCell style={{ padding: '4px', }}><span>{alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}</span></TableCell> */}
                          <TableCell style={{ padding: '4px' }}>
                            <span>
                              {alert.remark.length > 20
                                ? alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1, 20) + '...'
                                : alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleIconClick(index)} style={{ padding: '1px 1px' }}>
                              {selectedAction ? (
                                <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                              ) : (
                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
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
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              {showPendingRIFTable && (
                <TableContainer component={Card} style={{ width: "85%", margin: "20px" }}>
                  <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                    <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                      <TableRow className="tableHeading">
                        <TableCell><strong>S.No</strong></TableCell>
                        <TableCell><strong>Search Name</strong></TableCell>
                        <TableCell><strong>Hit Name</strong></TableCell>
                        <TableCell><strong>Score</strong></TableCell>
                        <TableCell><strong>Remark</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingRif.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
                            <Typography variant="h6" color="textSecondary">
                              Not Available
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (pendingRif.map((alert, index) => (
                        <TableRow
                        >
                          <TableCell><span>{index + 1}</span></TableCell>
                          <TableCell><span>{alert.searchName.charAt(0).toUpperCase() + alert.searchName.slice(1)}</span></TableCell>
                          <TableCell style={{ cursor: 'pointer' }}><span>{alert.name.charAt(0).toUpperCase() + alert.name.slice(1)}</span></TableCell>
                          <TableCell><span>{alert.searchingScore}</span></TableCell>
                          <TableCell><span>{alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}</span></TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleRIFIconClick(index)} style={{ padding: '1px 1px' }}>
                              {selectedActionRfi ? (
                                <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                              ) : (
                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
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
          {/* Pending Case Dialog Box */}
          <Dialog
            open={isRemarksDialogOpen}
            onClose={handleCloseRemarksDialog}
            fullWidth
            maxWidth="md"
            scroll="body"
            sx={{
              maxHeight: '100vh',
            }}
          >
            <DialogActions>
              <Button onClick={handleCloseRemarksDialog} color="primary">
                <ClearIcon />
              </Button>
            </DialogActions>
            {/* Vertical Tracker */}
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
                                  <span className="status-title" style={{ color: '#080807', fontSize: 'small' }}>
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
            <DialogContent sx={{ padding: '0px', }}>
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
                      onChange={handleStatusChange}>
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
                    <Grid item xs={12} sm={8} md={6} lg={4}>
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
            open={isRemarksDialogOpenRif}
            onClose={handleCloseRemarksDialogRif}
            fullWidth
            maxWidth="md"
          >
            <DialogActions>
              <Button onClick={handleCloseRemarksDialogRif} color="primary">
                <ClearIcon />
              </Button>
            </DialogActions>
            {selectedCourierTrackerRfi && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                    {selectedCourierTrackerRfi.name}
                  </div>
                  <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
                    {`Matching Score: ${selectedCourierTrackerRfi.searchingScore}`}
                  </div>
                </div>
                <Card style={{ margin: '20px 0', boxShadow: 'rgb(0 0 0/28%)0px 4px 8px', width: '90%', marginLeft: '5%', maxHeight: '300px', borderRadius: '8px' }}>
                  <CardContent>
                    <Timeline position="left">
                      <TimelineItem>
                        <TimelineContent>{levelOneRemark.length > 0 && levelOneRemark[0].remark
                          ? levelOneRemark[0].remark : levelTwo.length > 0 && levelTwo[0].remark ? levelTwo[0].remark : "Not Available"}</TimelineContent>
                        <TimelineSeparator>
                          <TimelineDot style={{ background: '#1976d2' }} />
                          <TimelineConnector style={{ background: '#1976d2' }} />
                        </TimelineSeparator>
                        <TimelineContent style={{ fontWeight: 'bold' }}>L1 First Review</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineContent>{levelTwoRemarkRfi.length > 0 ? levelTwoRemarkRfi[0].remark : "Not Available"}</TimelineContent>
                        <TimelineSeparator>
                          <TimelineDot style={{ background: '#1976d2' }} />
                          <TimelineConnector style={{ background: '#1976d2' }} />
                        </TimelineSeparator>
                        <TimelineContent style={{ fontWeight: 'bold' }}>L1 Second Review</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineContent>{levelOneRemarkRfi.length > 0 && levelOneRemarkRfi[0].remark
                          ? levelOneRemarkRfi[0].remark
                          : levelThree.length > 0 && levelThree[0].remark
                            ? levelThree[0].remark
                            : "Not Available"}</TimelineContent>
                        <TimelineSeparator>
                          <TimelineDot style={{ background: '#1976d2' }} />
                          <TimelineConnector style={{ background: '#1976d2' }} />
                        </TimelineSeparator>
                        <TimelineContent style={{ fontWeight: 'bold' }}>L2 Search Review</TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineContent>{selectedCourierTrackerRfi.remark || "Not Available"}</TimelineContent>
                        <TimelineSeparator>
                          <TimelineDot style={{ background: '#388e3c' }} />
                        </TimelineSeparator>
                        <TimelineContent style={{ fontWeight: 'bold' }}>L3 Search Review</TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  </CardContent>
                </Card>
              </>
            )}
            <DialogTitle>Enter Remarks</DialogTitle>
            <DialogContentText style={{ textAlign: 'center' }}>
              Select a status and enter remarks for this employee.
            </DialogContentText>
            <DialogContent>
              {errorMessageRfi && (
                <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                  {errorMessageRfi}
                </Typography>
              )}
              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={selectedStatusRfi}
                      onChange={handleStatusChangeRif}
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
              {selectedStatusRfi && (
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
                        value={remarksRfi}
                        defaultValue="Default Value"
                        onChange={handleRemarksChangeRif}
                      />
                    </Grid>
                  </Grid>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmitRfi}>
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
            <DialogContent>
              {modalContent}
            </DialogContent>
            <DialogActions>
              <button type="button" className="btn btn-outline-primary" onClick={() => setIsModalOpen(false)}>Close</button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Dialog open={showModal} onClose={handleCloseModal} fullWidth
        maxWidth="lg">
        <DialogContent sx={{
          padding: '0px',
          overflowY: 'unset',
        }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={handlePrinted}
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body" >
                    <div ref={myRef}>
                      <h4>DETAILS</h4>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <Grid container spacing={2} justifyContent="space-between">
                          <Grid item xs={3}>
                            {details.slice(0, Math.ceil(details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                          <Grid item xs={3}>
                            {details.slice(Math.ceil(details.length / 3), Math.ceil(2 * details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                          <Grid item xs={3}>
                            {details.slice(Math.ceil(2 * details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                        </Grid>
                      </Card>
                      <br />
                      {identification.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>IDENTIFICATIONS:</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Type</TableCell>
                                      <TableCell>ID</TableCell>
                                      <TableCell>Country</TableCell>
                                      <TableCell>Issue Date </TableCell>
                                      <TableCell>Expire Date</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {identification.map((identification, index) => (
                                      <TableRow key={identification.type + identification.country + identification.issue_Date} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{identification.type}</TableCell>
                                        <TableCell>{identification.ids}</TableCell>
                                        <TableCell>{identification.country}</TableCell>
                                        <TableCell>{identification.dateClarification === "Issue Date" ? identification.issue_Date : ''}
                                        </TableCell>
                                        <TableCell>
                                          {identification.dateClarification === "Expiration Date" ? identification.issue_Date : ''}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      {aliases.filter(alias => alias.aliasesType !== "Name").length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Type</TableCell>
                                      <TableCell>Category</TableCell>
                                      <TableCell>Name</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {aliases.filter(alias => alias.aliasesType !== "Name").map((alias, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{alias.aliasesType}</TableCell>
                                        <TableCell>{alias.category}</TableCell>
                                        <TableCell>{alias.aliasesName}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      {address.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ADDRESSES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Region</TableCell>
                                      <TableCell>Address1</TableCell>
                                      <TableCell>Address2</TableCell>
                                      <TableCell>Address3</TableCell>
                                      <TableCell>City</TableCell>
                                      <TableCell>Province</TableCell>
                                      <TableCell>Postal Code</TableCell>
                                      <TableCell>Country </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {address.map((addres, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{addres.region}</TableCell>
                                        <TableCell>{addres.address1}</TableCell>
                                        <TableCell>{addres.address2}</TableCell>
                                        <TableCell>{addres.address3}</TableCell>
                                        <TableCell>{addres.city}</TableCell>
                                        <TableCell>{addres.province}</TableCell>
                                        <TableCell>{addres.postal}</TableCell>
                                        <TableCell>{addres.countryName}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                        </>
                      )}
                      <br></br>
                      <div>Enter Remarks</div>
                      <div style={{ textAlign: 'center' }}>
                        Select a status and enter remarks for this employee.
                      </div>
                      <div>
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
                            <div style={{ textAlign: 'center' }}>
                              Enter your remarks for this action.
                            </div>
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
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <DialogActions>
                        <Button variant="contained" onClick={handleCloseModal}>Close</Button>
                        {selectedStatus && (
                          <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                            Submit
                          </button>
                        )}
                      </DialogActions>
                    </div>
                  </div>
                </Card>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showModallogical} onClose={handleCloseModallogical} fullWidth
        maxWidth="lg">
        <DialogContent sx={{
          padding: '0px',
          overflowY: 'unset',
        }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Box m={2} style={{ marginTop: '5%' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={handlePrinted}
                    style={{ minWidth: 'unset', padding: '2px' }}
                    className="non-printable"
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body">
                    <br />
                    <div ref={myRef}>
                      <h4>DETAILS</h4>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <Grid container spacing={2} justifyContent="space-between">
                          {logicaldetails.length > 0 ? (
                            logicaldetails.map((detail, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4}>
                                  <Typography><b>First Name</b>: {detail.naal_firstname}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Middle Name</b>: {detail.naal_middlename}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Last Name</b>: {detail.naal_lastname}</Typography>
                                </Grid>
                              </React.Fragment>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography>No details available</Typography>
                            </Grid>
                          )}
                          {logicalBirthDetails.length > 0 ? (
                            logicalBirthDetails.map((detail, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4}>
                                  <Typography><b>Birth Country</b>: {detail.birt_country}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Birth Place</b>: {detail.birt_plcae}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Birth Date</b>: {detail.birt_date}</Typography>
                                </Grid>
                              </React.Fragment>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography>No details available</Typography>
                            </Grid>
                          )}
                          {logicalcitiy.length > 0 ? (
                            logicalcitiy.map((detail, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4}>
                                  <Typography><b>City Country</b>: {detail.citi_country}</Typography>
                                </Grid>
                              </React.Fragment>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography>No details available</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Card>
                      <br />
                      {logicalidentification.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>IDENTIFICATIONS</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Identification Leba publication date</TableCell>
                                      <TableCell>Entity logical id Identification</TableCell>
                                      <TableCell>Identification leba numtitle</TableCell>
                                      <TableCell>Identification</TableCell>
                                      <TableCell>Identification</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalidentification.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.entity_logical_id_Iden !== 0 ? id.entity_logical_id_Iden : null}</TableCell>
                                        <TableCell>{id.iden_Leba_publication_date}</TableCell>
                                        <TableCell>{id.iden_country}</TableCell>
                                        <TableCell>{id.iden_leba_numtitle}</TableCell>
                                        <TableCell>{id.iden_number}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      <br />
                      {logicalAddress.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ADDRESSES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Address Number </TableCell>
                                      <TableCell>Address Street </TableCell>
                                      <TableCell>Address Zipcode </TableCell>
                                      <TableCell>Address City </TableCell>
                                      <TableCell>Address Country</TableCell>
                                      <TableCell>Address Other </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalAddress.map((addr, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{addr.addr_number}</TableCell>
                                        <TableCell>{addr.addr_street}</TableCell>
                                        <TableCell>{addr.addr_zipcod}</TableCell>
                                        <TableCell>{addr.addr_city}</TableCell>
                                        <TableCell>{addr.addr_country}</TableCell>
                                        <TableCell>{addr.addr_other}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      <br />
                      {logicalAka.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Name </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalAka.map((addr, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{addr.name}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      <br />
                    </div>
                    <br></br>
                    <div>Enter Remarks</div>
                    <div style={{ textAlign: 'center' }}>
                      Select a status and enter remarks for this employee.
                    </div>
                    <div>
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
                          <div style={{ textAlign: 'center' }}>
                            Enter your remarks for this action.
                          </div>
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
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <DialogActions>
                      <Button variant="contained" onClick={handleCloseModallogical}>Close</Button>
                      {selectedStatus && (
                        <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                          Submit
                        </button>
                      )}
                    </DialogActions>
                  </div>
                </Card>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showModalgroup} onClose={handleCloseModalgroup} fullWidth
        maxWidth="lg">
        <DialogContent sx={{
          padding: '0px',
          overflowY: 'unset',
        }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={handlePrinted}
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body">
                    <br />
                    <div ref={myRef}>
                      <Typography variant="h5">DETAILS</Typography>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        {CityDetails.length > 0 && (
                          <>
                            {CityDetails.map((detail, index) => (
                              <Grid container spacing={2} justifyContent="space-between">
                                <React.Fragment key={index}>
                                  <Grid item xs={4}>
                                    <Typography><b>Name</b> : {detail.name}</Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography><b>Place of Birth</b>: {detail.place_of_Birth}</Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography><b>Date of Birth</b>: {detail.dob}</Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography><b>Group Type</b>: {detail.group_Type}</Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography><b>Citizenship</b>: {detail.citizenship}</Typography>
                                  </Grid>
                                </React.Fragment>
                              </Grid>
                            ))}
                          </>
                        )}
                      </Card>
                      <br />
                      {groupidentification.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5">IDENTIFICATIONS</Typography>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Identity</TableCell>
                                      <TableCell>Number</TableCell>
                                      <TableCell>det</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {groupidentification.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.identity}</TableCell>
                                        <TableCell>{id.number}</TableCell>
                                        <TableCell>{id.det}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      <br />
                      <br />
                      {Groupaliases.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Type</TableCell>
                                      <TableCell>Quality</TableCell>
                                      <TableCell>Name</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {Groupaliases.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.alias_Type}</TableCell>
                                        <TableCell>{id.alias_Quality}</TableCell>
                                        <TableCell>{id.name}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                    </div>
                    <br></br>
                    <div>Enter Remarks</div>
                    <div style={{ textAlign: 'center' }}>
                      Select a status and enter remarks for this employee.
                    </div>
                    <div>
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
                          <div style={{ textAlign: 'center' }}>
                            Enter your remarks for this action.
                          </div>
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
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <DialogActions>
                      <Button variant="contained" onClick={handleCloseModalgroup}>Close</Button>
                      {selectedStatus && (
                        <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                          Submit
                        </button>
                      )}
                    </DialogActions>
                  </div>
                </Card>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showModalun} onClose={handleCloseModalun} fullWidth
        maxWidth="lg">
        <DialogContent sx={{
          padding: '0px',
          overflowY: 'unset',
        }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={handlePrinted}
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body">
                    <br />
                    <div ref={myRef}>
                      <Typography variant="h5">DETAILS</Typography>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        {UnDetails.length > 0 ? (
                          UnDetails.map((detail, index) => (
                            <React.Fragment key={index}>
                              <Grid container spacing={2} justifyContent="space-between">
                                <Grid item xs={3}>
                                  <Typography><b>First Name</b>: {detail.firstName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Sec Name</b>: {detail.secName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Third Name</b>: {detail.thirdName}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>List</b>: {detail._list}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Birth Place</b>: {detail.birthPlace}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Birth Type</b>: {detail.birthType}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Citizenship</b>: {detail.citizenship}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Date of Birth</b>: {detail.dob}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Gender</b>: {detail.gender}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Data ID</b>: {detail.dataid}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Nationality</b>: {detail.nationality}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography><b>Remarks</b>: {detail.remarks}</Typography>
                                </Grid>
                              </Grid>
                            </React.Fragment>
                          ))
                        ) : (
                          <Typography>No details available</Typography>
                        )}
                      </Card>
                      <br />
                      {Unaliases.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Type</TableCell>
                                      <TableCell>Quality</TableCell>
                                      <TableCell>Name</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {Unaliases.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id._Type}</TableCell>
                                        <TableCell>{id.quality}</TableCell>
                                        <TableCell>{id.name}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                      <br />
                      {UnDesignationDetails.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Identity</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {UnDesignationDetails.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.identity}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>
                          <br />
                        </>
                      )}
                    </div>
                    <br></br>
                    <div>Enter Remarks</div>
                    <div style={{ textAlign: 'center' }}>
                      Select a status and enter remarks for this employee.
                    </div>
                    <div>
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
                          <div style={{ textAlign: 'center' }}>
                            Enter your remarks for this action.
                          </div>
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
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <DialogActions>
                      <Button variant="contained" onClick={handleCloseModalun}>Close</Button>
                      {selectedStatus && (
                        <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                          Submit
                        </button>
                      )}
                    </DialogActions>
                  </div>
                </Card>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Level3RIF;