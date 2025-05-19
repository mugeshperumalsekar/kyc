// // import React, { useEffect, useState } from 'react';
// // import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
// // import { Card } from 'react-bootstrap';
// // import { useParams } from 'react-router-dom';
// // import AlertDataApiService from '../../data/services/View/alertData/alertData_api-service';
// // import { Level, createCustomerRequest } from '../../data/services/View/alertData/alertData_payload';
// // import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

// // interface AlretDataPayload {
// //   id: number;
// //   alert: string;
// //   senderAccount: string;
// //   senderCustomerId: string;
// //   transCount: string;
// //   transCumulativeAmt: string;
// //   bankAccount: string;
// //   customerId: string;
// //   transModeId: string;
// // }

// // function Viewnew() {
// //   const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [level, setLevel] = useState<Level[]>([]);
// //   const [formData, setFormData] = useState<createCustomerRequest>({
// //     id: 0,
// //     levelId: 0,
// //     customerId: '',
// //     name: '', // Initialize name state
// //   });
// //   const alertService = new AlertDataApiService();
// //   const { id } = useParams();
// //   const [bankId, setBankId] = useState<number>(0);
// //   const [imgName, setImgName] = useState<number>(0);
// //   const [customerId, setCustomerId] = useState<number>(0); // Initialize with a default value

// //   // useEffect(() => {
// //   //   const fetchData = async (id: number) => {
// //   //     try {
// //   //       setIsLoading(true);
// //   //       const alertData = await alertService.getAlertData(id);
// //   //       console.log('API Response:', alertData);
// //   //       setAlertData(alertData);
// //   //     } catch (error) {
// //   //       console.error('Error fetching alert data:', error);
// //   //     } finally {
// //   //       setIsLoading(false);
// //   //     }
// //   //   };

// //   //   if (id) {
// //   //     fetchData(parseInt(id));
// //   //   }
// //   // }, [id]);
// //   // useEffect(() => {
// //   //   const fetchData = async (id: number) => {
// //   //     try {
// //   //       setIsLoading(true);
// //   //       const alertData = await alertService.getAlertData(id);
// //   //       console.log('API Response:', alertData);
// //   //       setAlertData(alertData);

// //   //       // Set customerId if alertData exists and has customerId
// //   //       if (alertData && alertData.customerId) {
// //   //         setBankId(parseInt(alertData.customerId)); // Assuming customerId is of type string
// //   //       }
// //   //     } catch (error) {
// //   //       console.error('Error fetching alert data:', error);
// //   //     } finally {
// //   //       setIsLoading(false);
// //   //     }
// //   //   };

// //   //   if (id) {
// //   //     fetchData(parseInt(id));
// //   //   }
// //   // }, [id]);

// //   useEffect(() => {
// //     const fetchData = async (id: number) => {
// //       try {
// //         setIsLoading(true);
// //         const alertData = await alertService.getAlertData(id);
// //         console.log('API Response:', alertData);

// //         // Extract alertId and customerId from the alertData
// //         const { id: alertId, customerId } = alertData;

// //         // Set the customerId state
// //         setCustomerId(customerId);

// //         // Pass alertId, customerId, and imgName to handleSubmission
// //         handleSubmission(alertId, customerId, imgName.toString());

// //         setAlertData(alertData);
// //       } catch (error) {
// //         console.error('Error fetching alert data:', error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (id) {
// //       fetchData(parseInt(id));
// //     }
// //   }, [id, imgName]);

// //   useEffect(() => {
// //     fetchIdLevel();
// //   }, []);

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     if (event.target.files && event.target.files.length > 0) {
// //       setSelectedFile(event.target.files[0]);
// //     }
// //   };

// //   const fetchIdLevel = async () => {
// //     try {
// //       const level = await alertService.getlevle();
// //       setLevel(level);
// //       console.log('levelService:', level);
// //     } catch (error) {
// //       console.error("Error fetching dead:", error);
// //     }
// //   };


// //   const handleSubmission = async (alertId: number, customerId: number, imgName: string) => {
// //     try {
// //       const CommanWriteDTO = {
// //         createAuditLogRequest: {
// //           id: 0,
// //           levelId: formData.levelId,
// //           customerId: alertData?.customerId,

// //           name: formData.name,
// //         }
// //       };

// //       if (selectedFile) {
// //         console.log('createAuditLogRequest', CommanWriteDTO);
// //         const response = await alertService.uploadFiles(
// //           CommanWriteDTO,
// //           [selectedFile],
// //           alertId,
// //           customerId,
// //           imgName
// //         );
// //         console.log('Upload Response:', response);
// //         console.log('selectedFile', selectedFile);
// //         console.log('customerId', customerId);
// //         console.log('alertId', alertId);

// //       } else {
// //         console.error('No file selected');
// //       }
// //     } catch (error) {
// //       console.error('Error uploading file:', error);

// //     }
// //   };



// //   // const handleSubmission = () => {
// //   //   console.log('Form Submitted');
// //   //   // Logic for form submission
// //   // };

// //   const handleLevelChange = (event: SelectChangeEvent<string>) => {
// //     setFormData({ ...formData, levelId: parseInt(event.target.value) });
// //   };

// //   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     setFormData({ ...formData, name: event.target.value }); // Update the name state
// //   };

// //   return (
// //     <Box m={1}>
// // <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 2px 4px' }}>
// //   <Card.Text style={{ marginTop: '2%' }}>
// //     <div className='row' style={{ margin: '10px' }}>
// // <Grid container xs={12}>
// //   <Grid item xs={12} sm={8}>
// //     <p><strong>Name:</strong>{alertData && alertData.bankAccount}</p>
// //     <p><strong>Customer Id:</strong>{alertData && alertData.customerId}</p>
// //     <p><strong>Account Number:</strong>{alertData && alertData.senderAccount}</p>
// //   </Grid>
// //   <Grid item xs={12} sm={3}>
// //     <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
// //     <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
// //     <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p>
// //   </Grid>
// // </Grid>
// //       <hr style={{ borderTop: '2px solid bold' }} />
// //       <Grid item xs={12} sm={12} style={{ overflowY: 'auto', maxHeight: '200px' }}>
// //         <h5 style={{ marginTop: '10px' }}>Transactions</h5>
// //       </Grid>
// //       <div>
// //         <hr />
// //       </div>
// // <h5 style={{ marginTop: '10px' }}>Audit log</h5>
// // <Grid container spacing={4} xs={12}>
// //   <Grid item sm={4}>
// //     <FormControl style={{ width: '100%' }}>
// //       <InputLabel htmlFor="gender">Level 1</InputLabel>
// //       <Select
// //         label="Gender"
// //         variant="standard"
// //         value={formData.levelId.toString()}
// //         onChange={handleLevelChange}
// //       >
// //         {level.map((item) => (
// //           <MenuItem key={item.id} value={item.id.toString()}>
// //             {item.name}
// //           </MenuItem>
// //         ))}
// //       </Select>
// //     </FormControl>
// //   </Grid>
// //   <Grid item sm={4}>
// //     <TextField
// //       style={{ width: '100%' }}
// //       label="Typing"
// //       variant="standard"
// //       type="text"
// //       size="small"
// //       autoComplete="off"
// //       value={formData.name}
// //       onChange={handleNameChange}
// //     />
// //   </Grid>
// // </Grid>
// //     </div>
// //   </Card.Text>
// // </Card>
// //       <br></br>
// // <Grid container xs={8} spacing={2}>
// //   <Grid item sm={2}>
// //     <input
// //       type="file"
// //       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
// //       style={{ display: 'none' }}
// //       id="upload-document"
// //       onChange={handleFileChange}
// //     />
// //     <label htmlFor="upload-document">
// //       <Button variant="outlined" component="span">
// //         Document Upload
// //       </Button>
// //     </label>
// //   </Grid>
// //   <Grid item sm={3}>
// //     <TextField label="Attachment" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
// //   </Grid>
// //   <Grid item xs={12} sm={3}></Grid>
// // </Grid>
// // <br></br>
// // {/* <Button variant="contained" onClick={handleSubmission}>
// //   Submit
// // </Button> */}
// // <Button
// //   variant="contained"
// //   onClick={() => {
// //     if (id) {
// //       handleSubmission(parseInt(id), customerId, imgName.toString());
// //     } else {
// //       console.error("ID is undefined or null");
// //     }
// //   }}
// // >
// //   Submit
// // </Button>



// //     </Box>
// //   )
// // }

// // export default Viewnew;


// // import React, { useEffect, useState } from 'react';
// // import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
// // import { Card } from 'react-bootstrap';
// // import { useParams } from 'react-router-dom';
// // import AlertDataApiService from '../../data/services/View/alertData/alertData_api-service';
// // import { Level, createCustomerRequest } from '../../data/services/View/alertData/alertData_payload';
// // import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

// // interface AlretDataPayload {
// //   id: number;
// //   alert: string;
// //   senderAccount: string;
// //   senderCustomerId: string;
// //   transCount: string;
// //   transCumulativeAmt: string;
// //   bankAccount: string;
// //   customerId: string;
// //   transModeId: string;
// // }

// // function Viewnew() {
// //   const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [level, setLevel] = useState<Level[]>([]);
// //   const [formData, setFormData] = useState<createCustomerRequest>({
// //     id: 0,
// //     levelId: 0,
// //     customerId: '',
// //     name: '', // Initialize name state
// //   });
// //   const alertService = new AlertDataApiService();
// //   const { id } = useParams();
// //   const [bankId, setBankId] = useState<number>(0);
// //   const [imgName, setImgName] = useState<number>(0);
// //   const [customerId, setCustomerId] = useState<number>(0); // Initialize with a default value

// //   // useEffect(() => {
// //   //   const fetchData = async (id: number) => {
// //   //     try {
// //   //       setIsLoading(true);
// //   //       const alertData = await alertService.getAlertData(id);
// //   //       console.log('API Response:', alertData);
// //   //       setAlertData(alertData);
// //   //     } catch (error) {
// //   //       console.error('Error fetching alert data:', error);
// //   //     } finally {
// //   //       setIsLoading(false);
// //   //     }
// //   //   };

// //   //   if (id) {
// //   //     fetchData(parseInt(id));
// //   //   }
// //   // }, [id]);
// //   // useEffect(() => {
// //   //   const fetchData = async (id: number) => {
// //   //     try {
// //   //       setIsLoading(true);
// //   //       const alertData = await alertService.getAlertData(id);
// //   //       console.log('API Response:', alertData);
// //   //       setAlertData(alertData);

// //   //       // Set customerId if alertData exists and has customerId
// //   //       if (alertData && alertData.customerId) {
// //   //         setBankId(parseInt(alertData.customerId)); // Assuming customerId is of type string
// //   //       }
// //   //     } catch (error) {
// //   //       console.error('Error fetching alert data:', error);
// //   //     } finally {
// //   //       setIsLoading(false);
// //   //     }
// //   //   };

// //   //   if (id) {
// //   //     fetchData(parseInt(id));
// //   //   }
// //   // }, [id]);

// //   useEffect(() => {
// //     const fetchData = async (id: number) => {
// //       try {
// //         setIsLoading(true);
// //         const alertData = await alertService.getAlertData(id);
// //         console.log('API Response:', alertData);

// //         // Extract alertId and customerId from the alertData
// //         const { id: alertId, customerId } = alertData;

// //         // Set the customerId state
// //         setCustomerId(customerId);

// //         // Pass alertId, customerId, and imgName to handleSubmission
// //         handleSubmission(alertId, customerId, imgName.toString());

// //         setAlertData(alertData);
// //       } catch (error) {
// //         console.error('Error fetching alert data:', error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (id) {
// //       fetchData(parseInt(id));
// //     }
// //   }, [id, imgName]);

// //   useEffect(() => {
// //     fetchIdLevel();
// //   }, []);

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     if (event.target.files && event.target.files.length > 0) {
// //       setSelectedFile(event.target.files[0]);
// //     }
// //   };

// //   const fetchIdLevel = async () => {
// //     try {
// //       const level = await alertService.getlevle();
// //       setLevel(level);
// //       console.log('levelService:', level);
// //     } catch (error) {
// //       console.error("Error fetching dead:", error);
// //     }
// //   };


// //   const handleSubmission = async (alertId: number, customerId: number, imgName: string) => {
// //     try {
// //       const CommanWriteDTO = {
// //         createAuditLogRequest: {
// //           id: 0,
// //           levelId: formData.levelId,
// //           customerId: alertData?.customerId,

// //           name: formData.name,
// //         }
// //       };

// //       if (selectedFile) {
// //         console.log('createAuditLogRequest', CommanWriteDTO);
// //         const response = await alertService.uploadFiles(
// //           CommanWriteDTO,
// //           [selectedFile],
// //           alertId,
// //           customerId,
// //           imgName
// //         );
// //         console.log('Upload Response:', response);
// //         console.log('selectedFile', selectedFile);
// //         console.log('customerId', customerId);
// //         console.log('alertId', alertId);

// //       } else {
// //         console.error('No file selected');
// //       }
// //     } catch (error) {
// //       console.error('Error uploading file:', error);

// //     }
// //   };



// //   // const handleSubmission = () => {
// //   //   console.log('Form Submitted');
// //   //   // Logic for form submission
// //   // };

// //   const handleLevelChange = (event: SelectChangeEvent<string>) => {
// //     setFormData({ ...formData, levelId: parseInt(event.target.value) });
// //   };

// //   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     setFormData({ ...formData, name: event.target.value }); // Update the name state
// //   };

// //   return (
// //     <Box m={1}>

// //       <h3>ALERT DETAILS</h3>
// //       <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 2px 4px' ,margin: '20px' }}>
// //         <Card.Text style={{ marginTop: '2%' }}>
// //           <div className='row' style={{ margin: '10px' }}>
// // <Grid container xs={12}>
// //   <Grid item xs={12} sm={8}>
// //     <p><strong>TXN Alert:</strong>{alertData && alertData.bankAccount}</p>
// //     <p><strong>Customer Name:</strong>{ }</p>
// //   </Grid>
// //   <Grid item xs={12} sm={3}>
// //     <p><strong></strong>95% To be Assigned</p>
// //     <p><strong>Alert Date:</strong>{ }</p>
// //     {/* <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p> */}
// //   </Grid>
// // </Grid>
// //           </div>
// //         </Card.Text>
// //       </Card>
// //       <br></br>
// //       <h3>Rule Details:</h3>
// //       <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 2px 4px',margin: '20px' }}>

// //         <Card.Text style={{ marginTop: '2%' }}>

// //           <div className='row' style={{ margin: '10px' }}>

// // <Grid container xs={12}>
// //   <Grid item xs={12} sm={4}>
// //     <p><strong>Created By:</strong>{ }</p>
// //     <p><strong>last Modified:</strong>{ }</p>

// //     {/* <p><strong>Name:</strong>{alertData && alertData.bankAccount}</p>
// //     <p><strong>Customer Id:</strong>{alertData && alertData.customerId}</p>
// //     <p><strong>Account Number:</strong>{alertData && alertData.senderAccount}</p> */}
// //   </Grid>
// //   <Grid item xs={12} sm={4}>
// //     <p><strong>Creation Date:</strong>{ }</p>
// //     <p><strong>last Modified Date:</strong>{ }</p>

// //     {/* <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
// //     <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
// //     <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p> */}
// //   </Grid>
// //   <Grid item xs={12} sm={4}>
// //     <p><strong>User Role:</strong>{ }</p>

// //     {/* <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
// //     <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
// //     <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p> */}
// //   </Grid>
// // </Grid>
// // <h3>Alert Details</h3>
// // <Grid container xs={12}>
// //   <Grid item xs={12} sm={4}>
// //     <p><strong>Assigned By:</strong>{ }</p>

// //     {/* <p><strong>Name:</strong>{alertData && alertData.bankAccount}</p>
// //     <p><strong>Customer Id:</strong>{alertData && alertData.customerId}</p>
// //     <p><strong>Account Number:</strong>{alertData && alertData.senderAccount}</p> */}
// //   </Grid>
// //   <Grid item xs={12} sm={4}>
// //     <p><strong>Permission Details:</strong>{ }</p>

// //     {/* <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
// //     <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
// //     <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p> */}
// //   </Grid>
// // </Grid>
// //             <Card.Text style={{ marginTop: '2%' }}>
// //               <div className='row' style={{ margin: '10px' }}>
// //                 <Grid container xs={12}>
// //                   <Grid item xs={12} sm={8}>
// //                     <p><strong>Name:</strong>{alertData && alertData.bankAccount}</p>
// //                     <p><strong>Customer Id:</strong>{alertData && alertData.customerId}</p>
// //                     <p><strong>Account Number:</strong>{alertData && alertData.senderAccount}</p>
// //                   </Grid>
// //                   <Grid item xs={12} sm={3}>
// //                     <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
// //                     <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
// //                     <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p>
// //                   </Grid>
// //                 </Grid>



// //               </div>
// //             </Card.Text>

// //             <hr style={{ borderTop: '2px solid bold' }} />
// //             <Grid item xs={12} sm={12} style={{ overflowY: 'auto', maxHeight: '200px' }}>
// //               <h5 style={{ marginTop: '10px' }}>Transactions</h5>
// //             </Grid>
// //             <div>
// //               <hr />
// //             </div>
// //             <h5 style={{ marginTop: '10px' }}>Audit log</h5>
// //             <Grid container spacing={4} xs={12}>
// //               <Grid item sm={4}>
// //                 <FormControl style={{ width: '100%' }}>
// //                   <InputLabel htmlFor="gender">Level 1</InputLabel>
// //                   <Select
// //                     label="Gender"
// //                     variant="standard"
// //                     value={formData.levelId.toString()}
// //                     onChange={handleLevelChange}
// //                   >
// //                     {level.map((item) => (
// //                       <MenuItem key={item.id} value={item.id.toString()}>
// //                         {item.name}
// //                       </MenuItem>
// //                     ))}
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //               <Grid item sm={4}>
// //                 <TextField
// //                   style={{ width: '100%' }}
// //                   label="Typing"
// //                   variant="standard"
// //                   type="text"
// //                   size="small"
// //                   autoComplete="off"
// //                   value={formData.name}
// //                   onChange={handleNameChange}
// //                 />
// //               </Grid>
// //             </Grid>
// //           </div>
// //         </Card.Text>
// //       </Card>
// //       <br></br>
// //       <Grid container xs={8} spacing={2}>
// //         <Grid item sm={2}>
// //           <input
// //             type="file"
// //             accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
// //             style={{ display: 'none' }}
// //             id="upload-document"
// //             onChange={handleFileChange}
// //           />
// //           <label htmlFor="upload-document">
// //             <Button variant="outlined" component="span">
// //               Document Upload
// //             </Button>
// //           </label>
// //         </Grid>
// //         <Grid item sm={3}>
// //           <TextField label="Attachment" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
// //         </Grid>
// //         <Grid item xs={12} sm={3}></Grid>
// //       </Grid>
// //       <br></br>
// //       {/* <Button variant="contained" onClick={handleSubmission}>
// //         Submit
// //       </Button> */}
// //       <Button
// //         variant="contained"
// //         onClick={() => {
// //           if (id) {
// //             handleSubmission(parseInt(id), customerId, imgName.toString());
// //           } else {
// //             console.error("ID is undefined or null");
// //           }
// //         }}
// //       >
// //         Submit
// //       </Button>



// //     </Box>
// //   )
// // }

// // export default Viewnew;

// // import React, { useEffect, useState } from 'react';
// // import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
// // import { Card } from 'react-bootstrap';
// // import { useParams } from 'react-router-dom';
// // import AlertDataApiService from '../../data/services/View/alertData/alertData_api-service';
// // import { Level, TransactionData, TransactionGetData, createCustomerRequest } from '../../data/services/View/alertData/alertData_payload';
// // import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

// // interface AlretDataPayload {
// //   id: number;
// //   alert: string;
// //   senderAccount: string;
// //   senderCustomerId: string;
// //   transCount: string;
// //   transCumulativeAmt: string;
// //   bankAccount: string;
// //   customerId: string;
// //   transModeId: string;
// // }

// // function Details() {
// //   const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [level, setLevel] = useState<Level[]>([]);
// //   const [transaction, setTransaction] = useState<TransactionGetData[]>([]);
// //   const [transactiondetails, setTransactiondetails] = useState<TransactionData[]>([]);

// //   const [formData, setFormData] = useState<createCustomerRequest>({
// //     id: 0,
// //     levelId: 0,
// //     customerId: '',
// //     name: '', 
// //   });
// //   const alertService = new AlertDataApiService();
// //   const { id } = useParams();
// //   const { senderCustomerId  } = useParams();
// //   const [bankId, setBankId] = useState<number>(0);
// //   const [imgName, setImgName] = useState<number>(0);
// //   const [customerId, setCustomerId] = useState<number>(0); 



// //   useEffect(() => {
// //     const fetchData = async (id: number) => {
// //       try {
// //         setIsLoading(true);
// //         const alertData = await alertService.getAlertData(id);
// //         console.log('API Response:', alertData);

// //         const { id: alertId, customerId } = alertData;

// //         setCustomerId(customerId);

// //         handleSubmission(alertId, customerId, imgName.toString());

// //         setAlertData(alertData);
// //       } catch (error) {
// //         console.error('Error fetching alert data:', error);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (id) {
// //       fetchData(parseInt(id));
// //     }
// //   }, [id, imgName]);

// //   useEffect(() => {
// //     fetchIdLevel();
// //     fetchTransaction();
// //     // fetchTransactiondetails(senderCustomer); 
// //   }, []);

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     if (event.target.files && event.target.files.length > 0) {
// //       setSelectedFile(event.target.files[0]);
// //     }
// //   };

// //   const fetchIdLevel = async () => {
// //     try {
// //       const level = await alertService.getlevle();
// //       setLevel(level);
// //       console.log('levelService:', level);
// //     } catch (error) {
// //       console.error("Error fetching dead:", error);
// //     }
// //   };
// //   const fetchTransaction = async () => {
// //     try {
// //       const transaction = await alertService.getTransaction();
// //       setTransaction(transaction);

// //       console.log('transaction:', transaction);
// //     } catch (error) {
// //       console.error('Error fetching associated list:', error);
// //     }
// //   };
// //   // const fetchTransactiondetails = async (senderCustomer: string) => {
// //   //   try {
// //   //     const transactiondetails = await alertService.getTransactiondetails(senderCustomer);
// //   //     setTransactiondetails(transactiondetails);

// //   //     console.log('transaction:', transactiondetails);
// //   //   } catch (error) {
// //   //     console.error('Error fetching associated list:', error);
// //   //   }
// //   // };


// //   const handleSubmission = async (alertId: number, customerId: number, imgName: string) => {
// //     try {
// //       const CommanWriteDTO = {
// //         createAuditLogRequest: {
// //           id: 0,
// //           levelId: formData.levelId,
// //           customerId: alertData?.customerId,

// //           name: formData.name,
// //         }
// //       };

// //       if (selectedFile) {
// //         console.log('createAuditLogRequest', CommanWriteDTO);
// //         const response = await alertService.uploadFiles(
// //           CommanWriteDTO,
// //           [selectedFile],
// //           alertId,
// //           customerId,
// //           imgName
// //         );
// //         console.log('Upload Response:', response);
// //         console.log('selectedFile', selectedFile);
// //         console.log('customerId', customerId);
// //         console.log('alertId', alertId);

// //       } else {
// //         console.error('No file selected');
// //       }
// //     } catch (error) {
// //       console.error('Error uploading file:', error);

// //     }
// //   };

// //   const handleLevelChange = (event: SelectChangeEvent<string>) => {
// //     setFormData({ ...formData, levelId: parseInt(event.target.value) });
// //   };

// //   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     setFormData({ ...formData, name: event.target.value }); 
// //   };

// //   return (
// //     <>
// //       <Box m={3}>
// //         <Card style={{
// //           padding: '1%',
// //           boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //           width: '100%',
// //         }}>
// //           {/* <Grid item xs={2}>
// //             <h5>Alerts Details</h5>
// //             <div style={{ marginTop: '-2%', marginRight: '3%' }}>
// //               <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}>
// //                 Help | Admin Login
// //               </div>
// //             </div>
// //           </Grid> */}
// //           {/* <hr></hr> */}
// //           {/* <div style={{ marginTop: '3%' }}></div>
// //                     Today<hr></hr> */}
// //           <Card style={{
// //             padding: '1%',
// //             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //             width: '100%',
// //           }}>

// //             <Grid container xs={12} >
// //               <Grid item xs={12} sm={10}>
// //                 <p><strong>TXN Alert:</strong> HIGH VALUE TRANSACTION </p>
// //                 <p><strong>Customer Name:</strong></p>
// //               </Grid>
// //               <Grid item xs={12} sm={2}>
// //                 <p><strong></strong>95% To be Assigned</p>
// //                 <p><strong>Alert Date:</strong>{ }</p>
// //               </Grid>
// //             </Grid>
// //           </Card>
// //           <br></br>
// //           <h5>Rule Details</h5>
// //           <Card style={{
// //             padding: '1%',
// //             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //             width: '100%',
// //           }}>
// //             <Grid container xs={12}>
// //               <Grid item xs={12} sm={5}>
// //                 <p><strong>Created By:</strong>{ }</p>
// //                 <p><strong>last Modified:</strong>{ }</p>
// //               </Grid>
// //               <Grid item xs={12} sm={4}>
// //                 <p><strong>Creation Date:</strong>{ }</p>
// //                 <p><strong>last Modified Date:</strong>{ }</p>
// //               </Grid>
// //               <Grid item xs={12} sm={3}>
// //                 <p><strong>User Role:</strong>{ }</p>
// //               </Grid>
// //             </Grid>
// //             <h5>Alert Details</h5>
// //             <Grid container xs={12}>
// //               <Grid item xs={12} sm={5}>
// //                 <p><strong>Assigned By:</strong>{ }</p>

// //               </Grid>
// //               <Grid item xs={12} sm={4}>
// //                 <p><strong>Permission Details:</strong>{ }</p>
// //               </Grid>
// //             </Grid>
// //           </Card>
// //           <br></br>
// //           <Card style={{
// //             padding: '1%',
// //             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //             width: '100%',
// //           }}>
// //             <Grid container xs={12}>
// //               <Grid item xs={12} sm={9}>
// //                 <p><strong>Name:</strong> {alertData && alertData.bankAccount}</p>
// //                 <p><strong>Customer Id:</strong> {alertData && alertData.customerId}</p>
// //                 <p><strong>Account Number:</strong> {alertData && alertData.senderAccount}</p>
// //               </Grid>
// //               <Grid item xs={12} sm={3}>
// //                 <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
// //                 <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
// //                 <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p>
// //               </Grid>
// //             </Grid>
// //           </Card>
// //           <br></br>
// //           <Card style={{
// //             padding: '1%',
// //             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //             width: '100%',
// //           }}>
// //             <Grid item xs={12} sm={12} style={{ overflowY: 'auto', maxHeight: '200px' }}>
// //               <h5 style={{ marginTop: '10px' }}>Transactions</h5>
// //             </Grid>
// //           </Card>
// //           <br></br>
// //           <h5>Audit log</h5>
// //           <Card style={{
// //             padding: '1%',
// //             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //             width: '100%',
// //           }}>

// //             <Grid container spacing={4} xs={12}>
// //               <Grid item sm={6}>
// //                 <FormControl style={{ width: '100%' }}>
// //                   <InputLabel htmlFor="gender">Level 1</InputLabel>
// //                   <Select
// //                     label="Gender"
// //                     variant="standard"
// //                     value={formData.levelId.toString()}
// //                     onChange={handleLevelChange}
// //                   >
// //                     {level.map((item) => (
// //                       <MenuItem key={item.id} value={item.id.toString()}>
// //                         {item.name}
// //                       </MenuItem>
// //                     ))}
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //               <Grid item sm={6}>
// //                 <TextField
// //                   style={{ width: '100%' }}
// //                   label="Typing"
// //                   variant="standard"
// //                   type="text"
// //                   size="small"
// //                   autoComplete="off"
// //                   value={formData.name}
// //                   onChange={handleNameChange}
// //                 />
// //               </Grid>
// //             </Grid>

// //           </Card>
// //           <br></br>
// //           <Grid container xs={8} spacing={2}>
// //             <Grid item sm={3}>
// //               <input
// //                 type="file"
// //                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
// //                 style={{ display: 'none' }}
// //                 id="upload-document"
// //                 onChange={handleFileChange}
// //               />
// //               <label htmlFor="upload-document">
// //                 <Button variant="outlined" component="span">
// //                   Document Upload
// //                 </Button>
// //               </label>
// //             </Grid>
// //             <Grid item sm={8}>
// //               <TextField label="Attachment" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
// //             </Grid>

// //           </Grid>
// //           <br></br>
// //         </Card>
// //         <br></br>
//       //   {/* <h5>Customer Details</h5>
//       // {transaction.map((data, index) => (
//       //   <Card
//       //     key={index}
//       //     style={{
//       //       padding: '1%',
//       //       boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//       //       width: '100%',
//       //       marginBottom: '20px', 
//       //     }}
//       //   >
//       //     <Grid container>
//       //       <Grid item xs={12} sm={5}>
//       //         <p>
//       //           <strong>Customer Id:</strong> {data.customerId}
//       //         </p>
//       //         <p>
//       //           <strong>Nationality:</strong> {data.branchName}
//       //         </p>

//       //       </Grid>
//       //       <Grid item xs={12} sm={4}>
//       //         <p>
//       //           <strong>Customer Name:</strong> {data.customerName}
//       //         </p>
//       //         <p>
//       //           <strong>Residence Location:</strong> {}
//       //         </p>
//       //       </Grid>
//       //       <Grid item xs={12} sm={3}>
//       //         <p>
//       //           <strong>DOB:</strong> {}
//       //         </p>

//       //       </Grid>
//       //     </Grid>
//       //   </Card>
//       // ))}
//       //        <h5>Transaction Details</h5>
//       // {transactiondetails.map((data, index) => (
//       //   <Card
//       //     key={index}
//       //     style={{
//       //       padding: '1%',
//       //       boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//       //       width: '100%',
//       //       marginBottom: '20px', 
//       //     }}
//       //   >
//           // <Grid container>
//           //   <Grid item xs={12} sm={5}>
//           //     <p>
//           //       <strong>Account Number:</strong> {data.senderAccount}
//           //     </p>
//           //     <p>
//           //       <strong>Amount:</strong> {data.withdrawals}
//           //     </p>
//           //     <p>
//           //       <strong>Beneficiary Name:</strong> {data.receiver}
//           //     </p>


//           //   </Grid>
//           //   <Grid item xs={12} sm={4}>
//           //     <p>
//           //     <strong></strong> 

//           //     </p>
//           //     <p>
//           //       <strong>Date:</strong> {}
//           //     </p>
//           //     <p>
//           //       <strong>Beneficiary Bank:</strong> {data.receiverBankName}
//           //     </p>
//           //   </Grid>
//           //   <Grid item xs={12} sm={3}>
//           //     <p>
//           //       <strong>Branch:</strong> {}
//           //     </p>
//           //     <p>
//           //       <strong>Branch:</strong> {}
//           //     </p>

//           //   </Grid>

//           // </Grid>
//       //   </Card>
//       // ))} */}

// //         <Button
// //           variant="contained"
// //           onClick={() => {
// //             if (id) {
// //               handleSubmission(parseInt(id), customerId, imgName.toString());
// //             } else {
// //               console.error("ID is undefined or null");
// //             }
// //           }}
// //         >
// //           Submit
// //         </Button>
// //       </Box>
// //     </>
// //   )
// // }

// // export default Details;
// import React, { useEffect, useState } from 'react';
// import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
// import { Card } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import AlertDataApiService from '../../data/services/View/alertData/alertData_api-service';
// import { Level, TransactionData, CustomerGetData, createCustomerRequest } from '../../data/services/View/alertData/alertData_payload';
// import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
// import Header from '../../layouts/header/header';

// interface AlretDataPayload {
//   id: number;
//   alert: string;
//   senderAccount: string;
//   senderCustomerId: string;
//   transCount: string;
//   transCumulativeAmt: string;
//   bankAccount: string;
//   customerId: string;
//   transModeId: string;
// }

// function Details() {
//   const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [level, setLevel] = useState<Level[]>([]);
//   const [transaction, setTransaction] = useState<CustomerGetData[]>([]);
//   const [transactiondetails, setTransactiondetails] = useState<TransactionData[]>([]);

//   const [formData, setFormData] = useState<createCustomerRequest>({
//     id: 0,
//     levelId: 0,
//     customerId: '',
//     alertId:0,
//     name: '',
//   });
//   const alertService = new AlertDataApiService();
//   const { id } = useParams();
//   const { senderCustomerId } = useParams();
//   const [bankId, setBankId] = useState<number>(0);
//   const [imgName, setImgName] = useState<number>(0);
//   const [customerId, setCustomerId] = useState<number>(0);



//   useEffect(() => {
//     const fetchData = async (id: number) => {
//       try {
//         setIsLoading(true);
//         const alertData = await alertService.getAlertData(id);
//         console.log('API Response:', alertData);

//         const { id: alertId, customerId } = alertData;

//         setCustomerId(customerId);

//         handleSubmission(alertId, customerId, imgName.toString());

//         setAlertData(alertData);
//       } catch (error) {
//         console.error('Error fetching alert data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       fetchData(parseInt(id));
//     }
//   }, [id, imgName]);

//   useEffect(() => {
//     fetchIdLevel();
//     fetchTransaction();
//     // fetchTransactiondetails(senderCustomer); 
//   }, []);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   const fetchIdLevel = async () => {
//     try {
//       const level = await alertService.getlevle();
//       setLevel(level);
//       console.log('levelService:', level);
//     } catch (error) {
//       console.error("Error fetching dead:", error);
//     }
//   };
//   const fetchTransaction = async () => {
//     try {
//       const transaction = await alertService.getTransaction();
//       setTransaction(transaction);

//       console.log('transaction:', transaction);
//     } catch (error) {
//       console.error('Error fetching associated list:', error);
//     }
//   };
 


//   const handleSubmission = async (alertId: number, customerId: string, imgName: string) => {
//     try {
//       const CommanWriteDTO = {
//         createAuditLogRequest: {
//           id: 0,
//           levelId: formData.levelId,
//           customerId: customerId,
//           alertId:customerId,
//           name: formData.name,
//         }
//       };

//       if (selectedFile) {
//         console.log('createAuditLogRequest', CommanWriteDTO);
//         const response = await alertService.uploadFiles(
//           CommanWriteDTO,
//           [selectedFile],
//           alertId,
//           customerId,
//           imgName
//         );
//         console.log('Upload Response:', response);
//         console.log('selectedFile', selectedFile);
//         console.log('customerId', customerId);
//         console.log('alertId', alertId);

//       } else {
//         console.error('No file selected');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);

//     }
//   };

//   const handleLevelChange = (event: SelectChangeEvent<string>) => {
//     setFormData({ ...formData, levelId: parseInt(event.target.value) });
//   };

//   const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, name: event.target.value });
//   };

//   return (
//     <>
//     <Header/>
//       <Box m={3}>
//         <Card style={{
//           padding: '1%',
//           boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//           width: '100%',
//         }}>
//           {/* <Grid item xs={2}>
//             <h5>Alerts Details</h5>
//             <div style={{ marginTop: '-2%', marginRight: '3%' }}>
//               <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}>
//                 Help | Admin Login
//               </div>
//             </div>
//           </Grid> */}
//           {/* <hr></hr> */}
//           {/* <div style={{ marginTop: '3%' }}></div>
//                     Today<hr></hr> */}
//           <Card style={{
//             padding: '1%',
//             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//             width: '100%',
//           }}>

//             <Grid container xs={12} >
//               <Grid item xs={12} sm={10}>
//                 <p><strong>TXN Alert:</strong> HIGH VALUE TRANSACTION </p>
//                 <p><strong>Customer Name:</strong></p>
//               </Grid>
//               <Grid item xs={12} sm={2}>
//                 <p><strong></strong>95% To be Assigned</p>
//                 <p><strong>Alert Date:</strong>{ }</p>
//               </Grid>
//             </Grid>
//           </Card>
//           <br></br>
//    <h5> Details</h5>
//       {transaction.map((data, index) => (
//         <Card
//           key={index}
//           style={{
//             padding: '1%',
//             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//             width: '100%',
//             marginBottom: '20px', 
//           }}
//         >
//           <Grid container>
//             <Grid item xs={12} sm={8}>
//               <p>
//                 <strong>Name:</strong> {data.customerName}
//               </p>
//               <p>
//                 <strong>Customer Id:</strong> {data.customerId}
//               </p>
//               <p>
//                 <strong>Account Number:</strong> {data.accountNum}
//               </p>

//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <p>
//                 <strong>Data Scenario:</strong> {}
//               </p>
//               <p>
//                 <strong>Number of Transaction:</strong> {data.transCount}
//               </p>
//               <p>
//                 <strong>Cumulative Value:</strong> {data.transCumulativeAmt}
//               </p>
//             </Grid>
           
//           </Grid>
//         </Card>
//       ))}

//           <br></br>
          
//           {/* <Card style={{
//             padding: '1%',
//             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//             width: '100%',
//           }}>
//             <Grid container xs={12}>
//               <Grid item xs={12} sm={9}>
//                 <p><strong>Name:</strong> {alertData && alertData.bankAccount}</p>
//                 <p><strong>Customer Id:</strong> {alertData && alertData.customerId}</p>
//                 <p><strong>Account Number:</strong> {alertData && alertData.senderAccount}</p>
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <p><strong>Data Scenario:</strong>{alertData && alertData.transModeId}</p>
//                 <p><strong>Number of Transaction:</strong>{alertData && alertData.transCount}</p>
//                 <p><strong>Cumulative Value:</strong>{alertData && alertData.transCumulativeAmt}</p>
//               </Grid>
//             </Grid>
//           </Card> */}
//           <br></br>
//           <Card style={{
//             padding: '1%',
//             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//             width: '100%',
//           }}>
//             <Grid item xs={12} sm={12} style={{ overflowY: 'auto', maxHeight: '200px' }}>
//               <h5 style={{ marginTop: '10px' }}>Transactions</h5>
//             </Grid>
//           </Card>
//           <br></br>
//           <h5>Audit log</h5>
//           <Card style={{
//             padding: '1%',
//             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//             width: '100%',
//           }}>

//             <Grid container spacing={4} xs={12}>
//               <Grid item sm={6}>
//                 <FormControl style={{ width: '100%' }}>
//                   <InputLabel htmlFor="gender">Level 1</InputLabel>
//                   <Select
//                     label="Gender"
//                     variant="standard"
//                     value={formData.levelId.toString()}
//                     onChange={handleLevelChange}
//                   >
//                     {level.map((item) => (
//                       <MenuItem key={item.id} value={item.id.toString()}>
//                         {item.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item sm={6}>
//                 <TextField
//                   style={{ width: '100%' }}
//                   label="Typing"
//                   variant="standard"
//                   type="text"
//                   size="small"
//                   autoComplete="off"
//                   value={formData.name}
//                   onChange={handleNameChange}
//                 />
//               </Grid>
//             </Grid>

//           </Card>
//           <br></br>
//           <Grid container xs={8} spacing={2}>
//             <Grid item sm={3}>
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                 style={{ display: 'none' }}
//                 id="upload-document"
//                 onChange={handleFileChange}
//               />
//               <label htmlFor="upload-document">
//                 <Button variant="outlined" component="span">
//                   Document Upload
//                 </Button>
//               </label>
//             </Grid>
//             <Grid item sm={8}>
//               <TextField label="Attachment" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
//             </Grid>

//           </Grid>
//           <br></br>
//         </Card>
//         <br></br>


//         <Button
//           variant="contained"
//           onClick={() => {
//             if (id) {
//               // handleSubmission(parseInt(id), customerId, imgName.toString());
//             } else {
//               console.error("ID is undefined or null");
//             }
//           }}
//         >
//           Submit
//         </Button>
//       </Box>
//     </>
//   )
// }

// export default Details;


import { useState, useEffect } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
import { CardContent, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextareaAutosize } from '@mui/material';
import { ChangeEvent } from 'react';
import AlertGeneralApiService from '../../../data/services/btms/alertGeneral/alertGeneral-api-service';
import { AlretDataPayload, Level, createCustomerRequest } from '../../../data/services/btms/View/alertData/alertData_payload';
import AlertDataApiService from '../../../data/services/btms/View/alertData/alertData_api-service';

interface AlertGeneral {
    id: number;
    transModeId: string;
    transCount: string;
    transCumulativeAmt: string;
    customerId: string;
    accountId: string;
    alertDetails: string;
    dt: string;
    assignInvestigation: string;
    txnAlert: string;
    description: string;
    customerName: string;
    accountNum: string;
    bankName: string;
    branchName: string;
}

interface Transaction {
    id: number;
    senderCustomer: string;
    withdrawals: string;
    dt: string;
    branch: string;
}

const AlertGeneral = () => {
    const alertGeneralApiService = new AlertGeneralApiService();
    const [alertGeneral, setAlertGeneral] = useState<AlertGeneral[]>([]);
    const [transaction, setTransactions] = useState<Transaction[]>([]);
    const { customerId, id: alertId } = useParams();
    const [formData, setFormData] = useState<createCustomerRequest>({
        id: 0,
        levelId: 0,
        customerId: '',
        alertId: 0,
        name: '',
    })
    const [bankId, setBankId] = useState<number>(0);
    const [imgName, setImgName] = useState<number>(0);
    const [setCustomerId] = useState<number>(0);
    const [setAlertId] = useState<number>(0);


    const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [level, setLevel] = useState<Level[]>([]);
    const alertService = new AlertDataApiService();
    useEffect(() => {
        fetchAlertGeneral();
        fetchTransaction();
        fetchIdLevel();

    }, []);

    const fetchAlertGeneral = async () => {
        try {
            const fetchedGeneral = await alertGeneralApiService.getAlertGeneral();
            const filteredAlertGeneral = fetchedGeneral.filter((item: { customerId: string | undefined; }) => item.customerId === customerId);
            setAlertGeneral(filteredAlertGeneral);
        } catch (error) {
            console.error("Error fetching the AlertGeneral:", error);
        }
    }


    const fetchTransaction = async () => {
        try {
            const fetchedTransactions = await alertGeneralApiService.getTransaction(customerId);
            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error("Error fetching the Transaction:", error);
        }
    }
    const fetchIdLevel = async () => {
        try {
            const level = await alertService.getlevle();
            setLevel(level);
            console.log('levelService:', level);
        } catch (error) {
            console.error("Error fetching dead:", error);
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmission = async (alertId: number, customerId: string, imgName: string) => {
        try {
            const CommanWriteDTO = {
                createAuditLogRequest: {
                    id: 0,
                    levelId: formData.levelId,
                    customerId: customerId,
                    alertId: alertId.toString(), // Convert alertId to string
                    name: formData.name,
                }
            };

            if (selectedFile) {
                console.log('createAuditLogRequest', CommanWriteDTO);
                const response = await alertService.uploadFiles(
                    CommanWriteDTO,
                    [selectedFile],
                    alertId,
                    customerId,
                    imgName
                );
                console.log('Upload Response:', response);
                console.log('selectedFile', selectedFile);
                console.log('customerId', customerId);
                console.log('alertId', alertId);

            } else {
                console.error('No file selected');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    const handleLevelChange = (event: SelectChangeEvent<string>) => {
        setFormData({ ...formData, levelId: parseInt(event.target.value) });
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, name: event.target.value });
    };

    return (
        <>
            <Header />
            <Box m={6}>
                <Card style={{
                    padding: '1%',
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                    width: '100%',
                }}>
                    <Grid item xs={2}>
                        <h5>Alert General </h5>
                        <div style={{ marginTop: '-2%', marginRight: '3%' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}>
                                Help | Admin Login
                            </div>
                        </div>
                    </Grid>
                    {alertGeneral.map((General, index) => (
                        <div key={index}>
                            <Card style={{
                                padding: '1%',
                                boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                                width: '100%',
                                marginTop: '1%'
                            }}>

                                <Grid container xs={12} >
                                    <Grid item xs={12} sm={4}>
                                        <p><strong>Rules:</strong> {General.txnAlert} </p>
                                        <p><strong>Alert Id :</strong> {General.id}</p>
                                        
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p><strong> Priority</strong>95% </p>
                                     
                                        <p><strong>Customer Name :</strong> {General.customerName}</p>
                                        
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                    <p><strong>Status :</strong> To be Assigned</p>
                                    <p><strong>DOB :</strong> 21/02/2024</p>
                                        
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                   
                                        <p><strong>Alert Date :</strong> 21/02/2024</p>
                                          <p><strong>Location :</strong> Chennai</p>
                                    </Grid>
                                </Grid>

                            </Card>
                        </div>
                    ))}

                    <Card style={{
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                        marginTop: '1%'
                    }}>
                        <span><b>Name Of Alert : </b></span><div></div>
                        {/* {alertGeneral.map((General, index) => (
                            <div key={index}>
                                
                                <Grid container xs={12} >
                                    <Grid item xs={12} sm={8}>
                                        <p><strong>TXN Alert : </strong>{General.txnAlert}</p>
                                        <p><strong>Description :</strong> {General.description}</p>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>

                                        <p><strong>Priority :</strong> 95% </p>

                                    </Grid>
                                    <Grid item xs={12} sm={2}>


                                        <p><strong>Status :</strong> To be Assigned</p>
                                    </Grid>

                                </Grid>

                            </div>
                        ))} */}

                        <span><u><b>Name Of Customer : </b></u></span>
                        {alertGeneral.map((General, index) => (
                            <div key={index}>
                                {/* {General.customerName}
                                <br></br>
                                < div style={{ marginTop: '-2%', marginRight: '3%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        DOB : 21/02/2024 &nbsp; &nbsp; &nbsp; &nbsp; Location : Chennai
                                    </div>
                                </div> */}
                                <Grid container xs={12} >
                                    <Grid item xs={12} sm={8}>
                                        <p><strong>  </strong>{General.customerName}</p>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>

                                        <p><strong>DOB :</strong> 21/02/2024</p>

                                    </Grid>
                                    <Grid item xs={12} sm={2}>


                                        <p><strong>Location :</strong> Chennai</p>
                                    </Grid>

                                </Grid>

                            </div>
                        ))}
                        <br></br>
                        {/* <Table className="tablesearch-able">
                                    <TableHead>
                                        <TableRow>
                                            
                                            <TableCell>Customer Name</TableCell>
                                            <TableCell>DOB</TableCell>
                                            
                                            <TableCell>Location</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(alertGeneral) && alertGeneral.map((alertGeneral, index) => (
                                            <TableRow key={index} className="highlighted-row">
                                                
                                                <TableCell>{alertGeneral.customerName}</TableCell>
                                                <TableCell>21/02/2024</TableCell>
                                           
                                                <TableCell>Chennai</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table> */}

                        <span><u><b>Transaction Details : </b></u></span>
                        <Table className="table search-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Amount</TableCell>

                                    <TableCell>Date  Time</TableCell>

                                    <TableCell>Branch</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transaction.map((transactions, index) => (
                                    <TableRow key={index} >
                                        <TableCell>{parseFloat(transactions.withdrawals).toFixed(2)}</TableCell>


                                        <TableCell>{transactions.dt}</TableCell>

                                        <TableCell>{transactions.branch}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </Card>

                    <h5>Audit log</h5>
                    <Card style={{
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                    }}>

                        <Grid container spacing={4} xs={12}>

                            <Grid item sm={8}>
                                {/* <TextField
                                    style={{ width: '100%' }}
                                    label="Typing"
                                    variant="standard"
                                    autoFocus
                                    margin="dense"
                                    id="outlined-multiline-static"
                                    multiline
                                    type="text"
                                    size="small"
                                    autoComplete="off"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                /> */}
                                <TextareaAutosize
                                    style={{ width: '100%', minHeight: '16px', resize: 'none' }}
                                    placeholder="Type here..."
                                    autoFocus
                                    id="outlined-multiline-static"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    minRows={3} // Set the minimum number of rows to display
                                />





                            </Grid>
                            <Grid item sm={4}>
                                <FormControl style={{ width: '30%' }}>
                                    <InputLabel htmlFor="gender">Level 1</InputLabel>
                                    <Select
                                        label="Gender"
                                        variant="standard"
                                        value={formData.levelId.toString()}
                                        onChange={handleLevelChange}
                                    >
                                        {level.map((item) => (
                                            <MenuItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>

                    </Card>
                    <br></br>
                    <Grid container spacing={2}>
                        <Grid item sm={2}>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                style={{ display: 'none' }}
                                id="upload-document"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="upload-document">
                                <Button variant="outlined" component="span">
                                    Document Upload
                                </Button>
                            </label>
                        </Grid>
                        <Grid item sm={8}>
                            <TextField label="Attachment" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
                        </Grid>

                    </Grid>
                </Card >
                <br></br>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (customerId) {
                            const numericAlertId = alertId ? (typeof alertId === 'string' ? parseInt(alertId) : alertId) : 0;
                            handleSubmission(numericAlertId, customerId, imgName.toString());
                        } else {
                            console.error('customerId is undefined');
                        }
                    }}
                >
                    Submit
                </Button>


            </Box >
        </>
    )
}

export default AlertGeneral;
