// import { useState, useEffect } from 'react'
// import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
// import { Card } from 'react-bootstrap';
// import AlertGeneralApiService from '../../data/services/alertGeneral/alertGeneral-api-service';
// import { useParams } from 'react-router-dom';
// import Header from '../../layouts/header/header';
// import { AlretDataPayload, Level, createCustomerRequest } from '../../data/services/View/alertData/alertData_payload';
// import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
// import AlertDataApiService from '../../data/services/View/alertData/alertData_api-service';
// import { CardContent, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextareaAutosize } from '@mui/material';
// import { ChangeEvent } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
// import * as XLSX from 'xlsx';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import IconButton from '@mui/material/IconButton'; // Import IconButton
// import ClearIcon from '@mui/icons-material/Clear';

// interface AlertGeneral {
//     id: number;
//     transModeId: string;
//     transCount: string;
//     transCumulativeAmt: string;
//     customerId: string;
//     accountId: string;
//     alertDetails: string;
//     dt: string;
//     assignInvestigation: string;
//     txnAlert: string;
//     description: string;
//     customerName: string;
//     accountNum: string;
//     bankName: string;
//     branchName: string;
// }

// interface Transaction {
//     id: number;
//     senderCustomer: string;
//     withdrawals: string;
//     dt: string;
//     branch: string;
// }

// const AlertGeneral = () => {
//     const alertGeneralApiService = new AlertGeneralApiService();
//     const [alertGeneral, setAlertGeneral] = useState<AlertGeneral[]>([]);
//     const [transaction, setTransactions] = useState<Transaction[]>([]);
//     const { customerId, id: alertId } = useParams();
//     const [formData, setFormData] = useState<createCustomerRequest>({
//         id: 0,
//         levelId: 0,
//         customerId: '',
//         alertId: 0,
//         name: '',
//     })
//     const [bankId, setBankId] = useState<number>(0);
//     const [imgName, setImgName] = useState<number>(0);
//     const [setCustomerId] = useState<number>(0);
//     const [setAlertId] = useState<number>(0);


//     const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     // const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [level, setLevel] = useState<Level[]>([]);
//     const alertService = new AlertDataApiService();
//     useEffect(() => {
//         fetchAlertGeneral();
//         fetchTransaction();
//         fetchIdLevel();

//     }, []);

//     const fetchAlertGeneral = async () => {
//         try {
//             const fetchedGeneral = await alertGeneralApiService.getAlertGeneral();
//             const filteredAlertGeneral = fetchedGeneral.filter((item: { customerId: string | undefined; }) => item.customerId === customerId);
//             setAlertGeneral(filteredAlertGeneral);
//         } catch (error) {
//             console.error("Error fetching the AlertGeneral:", error);
//         }
//     }


//     const fetchTransaction = async () => {
//         try {
//             const fetchedTransactions = await alertGeneralApiService.getTransaction(customerId);
//             setTransactions(fetchedTransactions);
//         } catch (error) {
//             console.error("Error fetching the Transaction:", error);
//         }
//     }
//     const fetchIdLevel = async () => {
//         try {
//             const level = await alertService.getlevle();
//             setLevel(level);
//             console.log('levelService:', level);
//         } catch (error) {
//             console.error("Error fetching dead:", error);
//         }
//     };
//     // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     //     if (event.target.files && event.target.files.length > 0) {
//     //         setSelectedFile(event.target.files[0]);
//     //     }
//     // };
//     // const [selectedFile, setSelectedFile] = useState<File | null>(null);

//     // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     //     if (event.target.files && event.target.files.length > 0) {
//     //         setSelectedFile(event.target.files[0]);
//     //     }
//     // }

//     // const handleDeleteFile = () => {
//     //     setSelectedFile(null);
//     // };
//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             const filesArray = Array.from(event.target.files);
//             setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
//         }
//     };

//     const handleDeleteFile = (index: number) => {
//         const updatedFiles = [...selectedFiles];
//         updatedFiles.splice(index, 1);
//         setSelectedFiles(updatedFiles);
//     };

//     const handleSubmission = async (alertId: number, customerId: string, imgName: string) => {
//         try {
//             const CommanWriteDTO = {
//                 createAuditLogRequest: {
//                     id: 0,
//                     levelId: formData.levelId,
//                     customerId: customerId,
//                     alertId: alertId.toString(), // Convert alertId to string
//                     name: formData.name,
//                 }
//             };

//             if (selectedFiles) {
//                 console.log('createAuditLogRequest', CommanWriteDTO);
//                 const response = await alertService.uploadFiles(
//                     CommanWriteDTO,
//                     selectedFiles,
//                     // [selectedFile],

//                     alertId,
//                     customerId,
//                     imgName
//                 );
//                 console.log('Upload Response:', response);
//                 console.log('selectedFile', selectedFiles);
//                 console.log('customerId', customerId);
//                 console.log('alertId', alertId);

//             } else {
//                 console.error('No file selected');
//             }
//         } catch (error) {
//             console.error('Error uploading file:', error);
//         }
//     };


//     const handleLevelChange = (event: SelectChangeEvent<string>) => {
//         setFormData({ ...formData, levelId: parseInt(event.target.value) });
//     };

//     const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setFormData({ ...formData, name: event.target.value });
//     };

//     const exportToExcel = () => {
//         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//         const fileExtension = '.xlsx';
//         const fileName = 'transactions_data';
//         const filteredGenerals = alertGeneral.map(Generals => ({
//             'Alert Id': Generals.id,
//             'Customer Name': Generals.customerName,
//             'Rules': Generals.txnAlert,
//             'Alert Date': Generals.dt,
//             'Score': '95%',
//             'Status': 'To be Assigned',

//         }));
//         const filteredTransactions = transaction.map((transactions => ({
//             'Amount': transactions.withdrawals,
//             'Date': transactions.dt,
//             'Branch': transactions.branch
//         })));
//         const combinedData = [...filteredGenerals, ...filteredTransactions];
//         const ws = XLSX.utils.json_to_sheet(combinedData);
//         const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         const data = new Blob([excelBuffer], { type: fileType });
//         const url = window.URL.createObjectURL(data);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', fileName + fileExtension);
//         document.body.appendChild(link);
//         link.click();
//     }

//     return (
//         <>
//             <Header />
//             <Box m={3}>
//                 <Card style={{
//                     padding: '1%',
//                     boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                     width: '100%',
//                 }}>
//                     <Grid item xs={2}>
//                         <h5>Alert General </h5>
//                         <div style={{ marginTop: '-2%', marginRight: '3%' }}>
//                             <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}>
//                                 Help | Admin Login
//                             </div>

//                         </div>
//                     </Grid>
//                     {alertGeneral.map((General, index) => (
//                         <div key={index}>
//                             <Card style={{
//                                 padding: '1%',
//                                 boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                                 width: '100%',
//                                 marginTop: '1%'
//                             }}>

//                                 <Grid container xs={12} >
//                                     <Grid item xs={12} sm={4}>

//                                         <p><strong>Alert Id :</strong> {General.id}</p>
//                                         <p><strong>Customer Name :</strong> {General.customerName}</p>

//                                     </Grid>
//                                     <Grid item xs={12} sm={3}>
//                                         <p><strong>Alert Date :</strong> 21/02/2024</p>
//                                         <p><strong> Score :</strong> 95% </p>



//                                     </Grid>
//                                     <Grid item xs={12} sm={3}>
//                                         <p><strong>Rules :</strong> {General.txnAlert} </p>

//                                         {/* <p><strong>DOB :</strong> 21/02/2024</p> */}

//                                     </Grid>
//                                     <Grid item xs={12} sm={2}>
//                                         <p><strong>Status :</strong> To be Assigned</p>

//                                         {/* <p><strong>Location :</strong> Chennai</p> */}
//                                     </Grid>
//                                 </Grid>

//                             </Card>
//                         </div>
//                     ))}

//                     <Card style={{
//                         padding: '1%',
//                         boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                         width: '100%',
//                         marginTop: '1%'
//                     }}>
//                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                             <span><u><b>Transaction Details : </b></u></span>
//                             <div style={{ marginLeft: '10px' }}>
//                                 <IconButton onClick={exportToExcel} aria-label="download" color="primary">
//                                     <FileDownloadIcon />
//                                 </IconButton>
//                             </div>
//                         </div>
//                         <Table className="table search-table">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Amount</TableCell>

//                                     <TableCell>Date  Time</TableCell>

//                                     <TableCell>Branch</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {transaction.map((transactions, index) => (
//                                     <TableRow key={index} >
//                                         <TableCell>{parseFloat(transactions.withdrawals).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>



//                                         <TableCell>{transactions.dt}</TableCell>

//                                         <TableCell>{transactions.branch}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                         {/* </div> */}

//                     </Card>

//                     <h5>Audit log</h5>
//                     <Card style={{
//                         padding: '1%',
//                         boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                         width: '100%',
//                     }}>

//                         <Grid container spacing={3} >

//                             <Grid item sm={9}>

//                                 <TextareaAutosize
//                                     style={{ minHeight: '100px', maxHeight: '250px', width: '97%', resize: 'none' }}
//                                     placeholder="Type here..."
//                                     autoFocus
//                                     id="outlined-multiline-static"
//                                     value={formData.name}
//                                     onChange={handleNameChange}
//                                     minRows={3} // Set the minimum number of rows to display
//                                 />





//                             </Grid>
//                             <Grid item sm={3} >

//                                 {/* <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}> */}
//                                 <FormControl style={{ width: '70%', marginRight: '20px' }}>
//                                     <InputLabel htmlFor="gender">Status </InputLabel>
//                                     <Select
//                                         label="Outlined"
//                                         id="outlined-basic"
//                                         variant="outlined"
//                                         size="small"
//                                         value={formData.levelId.toString()}
//                                         onChange={handleLevelChange}
//                                     >
//                                         {level.map((item) => (
//                                             <MenuItem key={item.id} value={item.id.toString()}>
//                                                 {item.name}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                                 {/* </div> */}
//                                 <input
//                                     type="file"
//                                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                     style={{ display: 'none', width: '70%' }}
//                                     id="upload-document"
//                                     onChange={handleFileChange}
//                                     multiple
//                                 />
//                                 <br></br>
//                                 <br></br>
//                                 <label htmlFor="upload-document" style={{ marginRight: '20px', width: '70%' }}>
//                                     <Button variant="outlined" component="span" style={{ width: '100%' }}>
//                                         Document Upload
//                                     </Button>
//                                 </label>
//                                 <br></br>
//                                 <br></br>
//                                 <TextField
//                                     style={{ width: '70%' }}
//                                     label="Attachments"
//                                     type="text"
//                                     size="small"
//                                     multiline
//                                     variant="outlined"
//                                     value={selectedFiles.map(file => file.name).join(', ')}
//                                     disabled={!selectedFiles.length}
//                                     InputProps={selectedFiles.length > 0 ? {
//                                         endAdornment: selectedFiles.map((file, index) => (
//                                             <IconButton key={index} onClick={() => handleDeleteFile(index)}>
//                                                 <ClearIcon />
//                                             </IconButton>
//                                         ))
//                                     } : undefined}
//                                 />

//                                 <br></br>
//                                 <br></br>

//                                 <Button style={{ width: '70%' }}
//                                     variant="contained"
//                                     onClick={() => {
//                                         if (customerId) {
//                                             const numericAlertId = alertId ? (typeof alertId === 'string' ? parseInt(alertId) : alertId) : 0;
//                                             handleSubmission(numericAlertId, customerId, imgName.toString());
//                                         } else {
//                                             console.error('customerId is undefined');
//                                         }
//                                     }}
//                                 >
//                                     Submit
//                                 </Button>

//                             </Grid>


//                         </Grid>

//                     </Card>
//                     <br></br>
//                     {/* <Grid container spacing={2}>
//                         <Grid item sm={2}>
//                             <input
//                                 type="file"
//                                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                 style={{ display: 'none' }}
//                                 id="upload-document"
//                                 onChange={handleFileChange}
//                             />
//                             <label htmlFor="upload-document">
//                                 <Button variant="outlined" component="span">
//                                     Document Upload
//                                 </Button>
//                             </label>
//                         </Grid>
//                         <Grid item sm={8}>
//                             <TextField label="Attachment" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
//                         </Grid>

//                     </Grid> */}
//                     {/* <Grid container spacing={2}>
//                         <Grid item sm={2}>
//                             <input
//                                 type="file"
//                                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                 style={{ display: 'none' }}
//                                 id="upload-document"
//                                 onChange={handleFileChange}
//                             />
//                             <label htmlFor="upload-document">
//                                 <Button variant="outlined" component="span">
//                                     Document Upload
//                                 </Button>
//                             </label>
//                         </Grid>
//                         <Grid item sm={8}>
//                             {selectedFiles.map((file, index) => (
//                                 <TextField
//                                     key={index}
//                                     label="Attachment"
//                                     type="text"
//                                     size="small"
//                                     variant="outlined"
//                                     value={file.name}
//                                     disabled
//                                 />
//                             ))}
//                             <div className="field label">
//                                 <div className="add-button" onClick={() => document.getElementById('upload-document')?.click()}>
//                                     <FontAwesomeIcon icon={faPlusCircle} /> Add More Document
//                                 </div>
//                             </div>
//                         </Grid>
//                     </Grid> */}
//                     {/* <Grid container spacing={2}>
//                         <Grid item sm={2}>
//                             <input
//                                 type="file"
//                                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                 style={{ display: 'none' }}
//                                 id="upload-document"
//                                 onChange={handleFileChange}
//                                 multiple  
//                             />
//                             <label htmlFor="upload-document">
//                                 <Button variant="outlined" component="span">
//                                     Document Upload
//                                 </Button>
//                             </label>
//                         </Grid>
//                         <Grid item sm={8}>
                           
//                             <TextField
//                                 label="Attachments"
//                                 type="text"
//                                 size="small"
//                                 multiline
//                                 variant="outlined"
//                                 value={selectedFiles ? selectedFiles.map(file => file.name).join(', ') : ''}
//                                 disabled
//                             />

                           
//                         </Grid>
//                     </Grid> */}

//                 </Card >
//                 <br></br>
//                 {/* <Button
//                     variant="contained"
//                     onClick={() => {
//                         if (customerId) {
//                             const numericAlertId = alertId ? (typeof alertId === 'string' ? parseInt(alertId) : alertId) : 0;
//                             handleSubmission(numericAlertId, customerId, imgName.toString());
//                         } else {
//                             console.error('customerId is undefined');
//                         }
//                     }}
//                 >
//                     Submit
//                 </Button> */}


//             </Box >
//         </>
//     )
// }

// export default AlertGeneral;


import { useState, useEffect } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
import { Card, Col ,Image} from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
import { CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from 'xlsx';
import AlertGeneralApiService from '../../../data/services/btms/alertGeneral/alertGeneral-api-service';
import AlertDataApiService from '../../../data/services/btms/View/alertData/alertData_api-service';
import { AlretDataPayload, createCustomerRequest ,Level} from '../../../data/services/btms/View/alertData/alertData_payload';
import AdminUserRightsApiService from '../../../data/services/btms/adminuserrights/athu-adminuserrights-api-service';


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

const AlertGeneralview = () => {



    const headingStyle = {
        fontFamily: 'Times New Roman',

    };

    const alertGeneralApiService = new AlertGeneralApiService();
    const alertService = new AlertDataApiService();
    const [alertGeneral, setAlertGeneral] = useState<AlertGeneral[]>([]);
    const [AuditLog, setAuditLog] = useState<createCustomerRequest[]>([]);
    const [transaction, setTransactions] = useState<Transaction[]>([]);
  
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
    const [showFullPosition, setShowFullPosition] = useState(false);
    const maxDisplayLength = 100;
    const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [level, setLevel] = useState<Level[]>([]);
    useEffect(() => {
        fetchAlertGeneral();
        fetchTransaction();
        fetchIdLevel();
        fetchAuditLog();

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
    const fetchAuditLog = async () => {
        try {
            const fetchedLogs = await alertService.getAuditLog();
            console.log('Fetched Audit Log:', fetchedLogs);

            // Access the auditLogs array from the fetchedLogs object
            const auditLogs = fetchedLogs.auditLogs;

            // Check if auditLogs is an array before filtering
            if (Array.isArray(auditLogs)) {
                // Filter the auditLogs array based on the customerId
                const filteredAuditLog = auditLogs.filter((item: { customerId: string | undefined; }) => item.customerId === customerId);
                setAuditLog(filteredAuditLog);
                console.log('Filtered Audit Log:', filteredAuditLog);
            } else {
                console.error('Fetched audit logs is not an array:', auditLogs);
            }
        } catch (error) {
            console.error("Error fetching the fetchAuditLog:", error);
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
    function getlevel(levelId: number) {
        switch (levelId) {
            case 1:
                return 'Close';
            case 2:
                return 'RFI';
            case 3:
                return 'Escalation';

        }
    };
    const handleLevelChange = (event: SelectChangeEvent<string>) => {
        setFormData({ ...formData, levelId: parseInt(event.target.value) });
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: event.target.value });
    };
    const togglePosition = () => {
        setShowFullPosition(!showFullPosition);
    };

    const renderPositionContent = (content: string | any[]) => {
        if (showFullPosition || content.length <= maxDisplayLength) {
            return content;
        }
        return (
            <>
                {content.slice(0, maxDisplayLength)}
                <span onClick={togglePosition} style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1))' }}>
                    {' Show More'}
                </span>
            </>
        );
    };

    const showLessPositionContent = (content: string) => (
        <>
            {content}
            <span onClick={togglePosition} style={{ cursor: 'pointer', color: 'rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1))' }}>
                {' Show Less'}
            </span>
        </>
    );

    // const toggleShowMore = () => {
    //     setShowMore(!showMore);
    // };
    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'transactions_data';
        const filteredGenerals = alertGeneral.map(Generals => ({
            'Alert Id': Generals.id,
            'Customer Name': Generals.customerName,
            'Rules': Generals.txnAlert,
            'Alert Date': Generals.dt,
            'Score': '95%',
            'status': 'To be Assigned',

        }));
        const filteredTransactions = transaction.map((transactions => ({
            'Amount': transactions.withdrawals,
            'Date': transactions.dt,
            'Branch': transactions.branch
        })));
        const filteredAuditLog = AuditLog.map((AuditLog => ({
            // 'Remark': AuditLog.name,
            // 'levelId': AuditLog.levelId,
         
        })));
        const combinedData = [...filteredGenerals, ...filteredTransactions,...filteredAuditLog];
        const ws = XLSX.utils.json_to_sheet(combinedData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName + fileExtension);
        document.body.appendChild(link);
        link.click();
    }
//     const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [base64Image, setBase64Image] = useState<string | null>(null);

//   const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({
//     base64: null,
//     filename: null,
//   });
//   const addressApiService = new AdminUserRightsApiService();
//   const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//     const binary = new Uint8Array(buffer);
//     const bytes = new Array(binary.length);
//     for (let i = 0; i < binary.length; i++) {
//       bytes[i] = String.fromCharCode(binary[i]);
//     }
//     const base64String = btoa(bytes.join(''));
//     return `data:image/png;base64,${base64String}`;
//   };


//   useEffect(() => {
//     const fetchImageData = async () => {
//         try {
//           setLoading(true);
//           console.log('Fetching image data for customerId:', customerId, 'and alertId:', alertId);
//           if (!customerId || !alertId) {
//             console.log('customerId or alertId is missing.');
//             return;
//           }
//           const imageData = await addressApiService.getImage(customerId, parseInt(alertId));
//           console.log('Image data fetched successfully.');
//           console.log('ImageCustomerID:', customerId);
//           const base64Image = arrayBufferToBase64(imageData);
//           setBase64Image(base64Image);
//           setPdfData({ base64: null, filename: null });
//         } catch (error) {
//           setError('Error fetching image data');
//         } finally {
//           setLoading(false);
//         }
//       };
      
//     fetchImageData();
//   }, [customerId, alertId]);
const addressApiService = new AdminUserRightsApiService();
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { customerId, id :alertId} = useParams();


  useEffect(() => {
    const fetchImageData = async () => {
     
      
        try {
            setLoading(true);
            if (!customerId || !alertId) {
              return;
            }

        const imageData = await addressApiService.getImage(customerId, parseInt(alertId));
        console.log('ImageCustomerID', customerId);
        const base64Image = arrayBufferToBase64(imageData);
        setBase64Image(base64Image);
        console.log('customerId:', customerId);
        console.log('alertId:', alertId);
        setError(null); 
      } catch (error) {
        console.error('Error fetching image data:', error);
        setError('Error fetching image data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchImageData();
  }, [customerId, alertId]);
  

  // Function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const binary = new Uint8Array(buffer);
    const bytes = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = String.fromCharCode(binary[i]);
    }
    const base64String = btoa(bytes.join(''));
    return `data:image/png;base64,${base64String}`;
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
                            <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray', marginTop: '1%' }}>
                                <button onClick={exportToExcel} type="button" className="btn btn-outline-primary">DOWNLOAD EXCEL</button>
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

                                {/* <Grid container xs={12} >
                                    <Grid item xs={12} sm={4}>
                                        <p><strong>Rules :</strong> {General.txnAlert} </p>
                                        <p><strong>Alert Id :</strong> {General.id}</p>

                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p><strong> Score :</strong> 95% </p>

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
                                </Grid> */}
                                <Grid container xs={12} >
                                    <Grid item xs={12} sm={4}>

                                        <p><strong>Alert Id :</strong> {General.id}</p>
                                        <p><strong>Customer Name :</strong> {General.customerName}</p>

                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p><strong>Alert Date :</strong> 21/02/2024</p>
                                        <p><strong> Score :</strong> 95% </p>



                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p><strong>Rules :</strong> {General.txnAlert} </p>

                                        {/* <p><strong>DOB :</strong> 21/02/2024</p> */}

                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <p><strong>Status :</strong> To be Assigned</p>

                                        {/* <p><strong>Location :</strong> Chennai</p> */}
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



                        <span><u><b>Transaction Details : </b></u></span>
                        {transaction.map((transactions, index) => (
                            <div key={index}>
                                <br></br>
                                <Grid container xs={12} >
                                    <Grid item xs={12} sm={5}>
                                        <p><strong> </strong>{parseFloat(transactions.withdrawals).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>

                                        <p><strong>Date :</strong> {transactions.dt}  </p>

                                    </Grid>
                                    <Grid item xs={12} sm={3}>


                                        <p><strong>Branch :</strong>{transactions.branch}</p>
                                    </Grid>

                                </Grid>
                            </div>
                        ))}
                        {/* <Table className="table search-table">
    <TableHead>
        <TableRow>
            <TableCell>Remark</TableCell>
            <TableCell>Status</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {AuditLog.length > 0 ? (
            AuditLog.map((transaction, index) => (
                <TableRow key={index}>
                    <TableCell>
                        {showFullPosition
                            ? showLessPositionContent(transaction.name)
                            : renderPositionContent(transaction.name)}
                    </TableCell>
                    <TableCell>{getlevel(transaction.levelId)}</TableCell>
                </TableRow>
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={2}>Not Available</TableCell>
            </TableRow>
        )}
    </TableBody>
</Table> */}
                        <Table className="table search-table">
                            <TableHead>
                                <TableRow>

                                    <TableCell>Remark</TableCell>
                                    <TableCell>Status</TableCell>


                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {AuditLog.map((transactions, index) => (
                                    <TableRow key={index} >

                                        <TableCell>{transactions.name}</TableCell>
                                        <TableCell>{getlevel(transactions.levelId)}</TableCell>



                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* <Grid item xs={12} sm={12}>
                                        <h5 style={{ marginTop: 'revert' }}>AuditLog</h5>
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <p style={headingStyle}>
                                            <strong>Remark : </strong>
                                            {AuditLog.map((transactions, index) => transactions.name).join('') ? (
                                                showFullPosition
                                                    ? showLessPositionContent(
                                                        AuditLog.map((transactions, index) => transactions.name).join('')
                                                    )
                                                    : renderPositionContent(
                                                        AuditLog.map((transactions, index) => transactions.name).join('')
                                                    )
                                            ) : (
                                                <span>Not Available</span>
                                            )}
                                        </p>
                                    </Grid> */}

{/* <Grid item xs={12}>
          {base64Image && (
            <Col xs={12} style={{ marginTop: '2%' }}>
              <div>
                <h2>Image Preview</h2>
                <Image src={base64Image} alt="Preview" style={{ maxHeight: '250px', maxWidth: '300px' }} />
              </div>
            </Col>
          )}
          {pdfData.base64 && (
            <Col xs={12} style={{ marginTop: '2%' }}>
              <div>
                <h2>PDF Preview</h2>
                <iframe
                  title="PDF Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  src={`data:application/pdf;base64,${pdfData.base64}`}
                />
                {pdfData.filename && (
                  <div style={{ marginTop: '10px' }}>
                    <a
                      href={`data:application/pdf;base64,${pdfData.base64}`}
                      download={pdfData.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', padding: '10px', backgroundColor: '#2a75bb', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            </Col>

          )}

        </Grid> */}
          
                    </Card>
                    <br></br>

                </Card >
                <br></br>




            </Box >
        </>
    )
}

export default AlertGeneralview;
