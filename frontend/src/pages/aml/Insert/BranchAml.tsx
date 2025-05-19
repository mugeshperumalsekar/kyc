
// // import React, { useState, useEffect } from 'react';
// // import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize } from '@mui/material';
// // import { Card } from 'react-bootstrap';
// // import { SelectChangeEvent } from '@mui/material/Select';
// // import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// // import Header from '../../layouts/header/header';
// // import { AlertScenariosData, AmlComplaintReply, Branch, ConfigBranchData, Remark } from '../../data/services/viewpage/view_payload';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// // import './Aml.css';
// // import ViewService from '../../data/services/viewpage/view_api_service';
// // import { useLocation, useNavigate, useParams } from 'react-router-dom';
// // import { useSelector } from 'react-redux';


// // function Amldetails() {
// //     const userDetails = useSelector((state: any) => state.loginReducer);
// //     const loginDetails = userDetails.loginDetails;
// //     const location = useLocation();
// //     const { ticketId, complaintId, uid } = useParams();
// //     const navigate = useNavigate();
// //     const [amlData, setAmlData] = useState<any>(null);
// //     const [remark, setRemark] = useState<Remark>({
// //         id: 0,
// //         remark: '',
// //         complaintId: 0,
// //         branchId: 0,
// //         uid: loginDetails.id,
// //     });

// //     useEffect(() => {
// //         fetchAmlData();
// //     }, []);

// //     const view = new ViewService();

// //     const fetchAmlData = async () => {
// //         try {
// //             const response = await view.getAmlCompleteTeam(5); // Assuming complaintId is hardcoded as 4
// //             setAmlData(response);
// //         } catch (error) {
// //             console.error("Error fetching AML data:", error);
// //         }
// //     };
// //     const handleRemarkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
// //         setRemark({
// //             ...remark,
// //             remark: event.target.value
// //         });
// //     };

// //     // const handleRemarkSubmit = async () => {
// //     //     try {
// //     //         // Call Remarkpost function with the remark data
// //     //         const response = await view.Remarkpost(remark);
// //     //         // Handle response if needed
// //     //     } catch (error) {
// //     //         console.error("Error submitting remark:", error);
// //     //     }
// //     // };
// //     const handleRemarkSubmit = async () => {
// //         try {
// //             const response = await view.Remarkpost(remark);
// //             console.log('AML complaint submitted successfully:', response);
// //         } catch (error) {
// //             console.error('Error submitting AML complaint:', error);

// //         }
// //     };

// //     return (
// //         <>
// //             <Box sx={{ display: 'flex' }}>
// //                 <Header />
// //                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
// //                     <Card style={{
// //                         marginTop: '7%',
// //                         padding: '1%',
// //                         boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //                         width: '100%',
// //                     }}>
// //                         <h4>Aml To Branch</h4>
// //                         <Card style={{
// //                             padding: '1%',
// //                             width: '100%',
// //                         }}>

// //                             <Grid container spacing={2}>
// //                                 <Grid item xs={2}>
// //                                     <p>Branch Name: {amlData?.complaintDto?.[0]?.branchName}</p>
// //                                 </Grid>
// //                                 <Grid item xs={2}>
// //                                     <p>Client ID: {amlData?.complaintDto?.[0]?.clientId}</p>
// //                                 </Grid>
// //                                 <Grid item xs={2}>
// //                                     <p>Account Numbers: {amlData?.complaintDto?.[0]?.accountNumber}</p>
// //                                 </Grid>
// //                                 <Grid item xs={2}>
// //                                     <p>Customer Name: {amlData?.complaintDto?.[0]?.targetCustomerName}</p>
// //                                 </Grid>
// //                             </Grid>
// //                         </Card>
// //                     </Card>
// //                     <br></br>

// //                     <Card style={{
// //                         padding: '1%',
// //                         width: '100%',
// //                     }}>

// //                         <Grid container spacing={2}>
// //                             <Grid item xs={6}>
// //                                 <h4>Alert Scenarios</h4>
// //                                 <div className="field-group-column">
// //                                     {amlData?.alertScenarioDtos?.map((scenario: any, index: number) => (

// //                                         <p key={index}>Alert Scenario {index + 1}: {scenario.alertScenarios}</p>
// //                                     ))}
// //                                 </div>
// //                             </Grid>
// //                             <Grid item xs={6}>
// //                                 <h4>Query / Replay</h4>
// //                                 <Grid container spacing={2}>
// //                                     {amlData?.replyDtos?.map((reply: any, index: number) => (
// //                                         <Grid item xs={6} key={index}>
// //                                             <p>Query: {reply.replyQry}</p>
// //                                             <p>Replay: {reply.reply}</p>
// //                                         </Grid>
// //                                     ))}
// //                                 </Grid>
// //                             </Grid>
// //                         </Grid>
// //                     </Card>

// //                     <br></br>
// //                     <Card style={{
// //                         padding: '1%',
// //                         width: '100%',
// //                     }}>
// //                         <Grid container spacing={2}>

// //                             {/* <p>Remark: {amlData?.remarkDtos?.[0]?.remark}</p> */}

// //                             <p>Remarks: {amlData?.remarkDtos?.map((remarkDto: { remark: any; }) => remarkDto.remark).join(', ')}</p>

// //                         </Grid>
// //                     </Card>

// //                     <Card style={{
// //                         padding: '1%',
// //                         width: '100%',
// //                     }}>
// //                         <Grid container spacing={2}>
// //                             <Grid item xs={8}>
// //                                 <TextareaAutosize
// //                                     minRows={3}
// //                                     placeholder="Remark"
// //                                     style={{ width: '50%', resize: 'vertical' }}
// //                                     value={remark.remark} // Bind value to state
// //                                     onChange={handleRemarkChange} // Handle change event
// //                                 />
// //                             </Grid>
// //                             <Grid item xs={2}>
// //                                 <Button
// //                                     variant="contained"
// //                                     color="primary"
// //                                     onClick={handleRemarkSubmit} // Handle click event
// //                                 >
// //                                     Submit
// //                                 </Button>
// //                                 <Grid item xs={2}>
// //                                     <Button
// //                                         variant="contained"
// //                                         color="primary"

// //                                     >
// //                                         Edit
// //                                     </Button>
// //                                 </Grid>
// //                             </Grid>
// //                         </Grid>
// //                     </Card>

// //                 </Box>

// //             </Box>

// //         </>
// //     )
// // }

// // export default Amldetails;
// import React, { useState, useEffect } from 'react';
// import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import { Card } from 'react-bootstrap';
// import { SelectChangeEvent } from '@mui/material/Select';
// import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// import './Aml.css';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Remark } from '../../../data/services/aml/viewpage/view_payload';
// import ViewService from '../../../data/services/aml/viewpage/view_api_service';
// import Header from '../../../layouts/header/header';


// function Amldetails() {
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const location = useLocation();
//     const { ticketId, complaintId, uid } = useParams();
//     const navigate = useNavigate();
//     const [amlData, setAmlData] = useState<any>(null);
//     const [remark, setRemark] = useState<Remark>({
    
//         remark: '',
//         complaintId: 0,
//         branchId: 0,
//         uid: loginDetails.id,
//     });
//     const [editRemarkDialogOpen, setEditRemarkDialogOpen] = useState(false);


//     useEffect(() => {
//         if (complaintId) {
//             fetchAmlData();
//         }
//     }, [complaintId]);

//     const view = new ViewService();

//     const fetchAmlData = async () => {
//         try {
//             const response = await view.getAmlCompleteTeam(complaintId); // Assuming complaintId is hardcoded as 4
//             setAmlData(response);
//         } catch (error) {
//             console.error("Error fetching AML data:", error);
//         }
//     };
//     const handleRemarkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setRemark({
//             ...remark,
//             remark: event.target.value
//         });
//     };



//     const handleRemarkSubmit = async () => {
//         try {
//             // Check if complaintId is defined and not null
//             if (complaintId) {

//                 const remarkWithId = { ...remark, complaintId: parseInt(complaintId) };

//                 // Call the backend API to submit the remark along with the complaint ID
//                 const response = await view.Remarkpost(remarkWithId);

//                 console.log('AML complaint submitted successfully:', response);
//             } else {
//                 console.error('Complaint ID is undefined or null.');
//             }
//         } catch (error) {
//             console.error('Error submitting AML complaint:', error);
//         }
//     };


//     const openEditRemarkDialog = (complaintId: string) => {
//         setRemark(prevRemark => ({
//             ...prevRemark,
//             complaintId: parseInt(complaintId)
//         }));
//         setEditRemarkDialogOpen(true);
//     };


//     // Function to close the edit remark dialog
//     const closeEditRemarkDialog = () => {
//         setEditRemarkDialogOpen(false);
//     };

//     const handleUpdateRemark = async () => {
//         try {

//             const response = await view.RemarkEdit(remark.toString(), remark);
//             console.log('AML complaint remark updated successfully:', response);

//             closeEditRemarkDialog();
//         } catch (error) {
//             console.error('Error updating AML complaint remark:', error);

//         }
//     };



//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                     <Card style={{
//                         marginTop: '7%',
//                         padding: '1%',
//                         boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                         width: '100%',
//                     }}>
//                         <h4>Aml To Branch</h4>
//                         <Card style={{
//                             padding: '1%',
//                             width: '100%',
//                         }}>

//                             <Grid container spacing={2}>
//                                 <Grid item xs={2}>
//                                     <p>Branch Name: {amlData?.complaintDto?.[0]?.branchName}</p>
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                     <p>Client ID: {amlData?.complaintDto?.[0]?.clientId}</p>
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                     <p>Account Numbers: {amlData?.complaintDto?.[0]?.accountNumber}</p>
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                     <p>Customer Name: {amlData?.complaintDto?.[0]?.targetCustomerName}</p>
//                                 </Grid>
//                             </Grid>
//                         </Card>
//                     </Card>
//                     <br></br>

//                     <Card style={{
//                         padding: '1%',
//                         width: '100%',
//                     }}>

//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <h4>Alert Scenarios</h4>
//                                 <div className="field-group-column">
//                                     {amlData?.alertScenarioDtos?.map((scenario: any, index: number) => (

//                                         <p key={index}>Alert Scenario {index + 1}: {scenario.alertScenarios}</p>
//                                     ))}
//                                 </div>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <h4>Query / Replay</h4>
//                                 <Grid container spacing={2}>
//                                     {amlData?.replyDtos?.map((reply: any, index: number) => (
//                                         <Grid item xs={6} key={index}>
//                                             <p>Query: {reply.replyQry}</p>
//                                             <p>Replay: {reply.reply}</p>
//                                         </Grid>
//                                     ))}
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                     </Card>

//                     <br></br>
//                     <Card style={{
//                         padding: '1%',
//                         width: '100%',
//                     }}>
//                         <Grid container spacing={2}>

//                             {/* <p>Remark: {amlData?.remarkDtos?.[0]?.remark}</p> */}

//                             <p>Remarks: {amlData?.remarkDtos?.map((remarkDto: { remark: any; }) => remarkDto.remark).join(', ')}</p>

//                         </Grid>
//                     </Card>

//                     <Card style={{
//                         padding: '1%',
//                         width: '100%',
//                     }}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={8}>
//                                 <TextareaAutosize
//                                     minRows={3}
//                                     placeholder="Remark"
//                                     style={{ width: '50%', resize: 'vertical' }}
//                                     value={remark.remark}
//                                     onChange={handleRemarkChange}
//                                 />
//                             </Grid>
//                             <Grid item container xs={4} spacing={2} alignItems="center">
//                                 <Grid item>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         onClick={handleRemarkSubmit}
//                                     >
//                                         Submit
//                                     </Button>
//                                 </Grid>
//                                 <Grid item>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         onClick={() => complaintId && openEditRemarkDialog(complaintId)}
//                                     >
//                                         Edit
//                                     </Button>


//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                         <Dialog open={editRemarkDialogOpen} onClose={closeEditRemarkDialog} fullWidth maxWidth="md">
//                             <DialogTitle>Edit Remark</DialogTitle>
//                             <DialogContent>
//                                 <TextareaAutosize
//                                     minRows={3}
//                                     placeholder="Remark"
//                                     style={{ width: '100%', resize: 'vertical' }}
//                                     value={remark.remark}
//                                     onChange={handleRemarkChange}
//                                 />
//                             </DialogContent>
//                             <DialogActions>
//                                 <Button onClick={closeEditRemarkDialog} color="primary">
//                                     Cancel
//                                 </Button>
//                                 <Button onClick={handleUpdateRemark} color="primary">
//                                     Save
//                                 </Button>
//                             </DialogActions>
//                         </Dialog>
//                     </Card>

//                 </Box>

//             </Box>

//         </>
//     )
// }

// export default Amldetails;
import React from 'react'

function BranchAml() {
  return (
    <div>BranchAml</div>
  )
}

export default BranchAml