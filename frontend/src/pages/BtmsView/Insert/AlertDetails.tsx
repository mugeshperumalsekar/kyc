import { useState, useEffect } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent
import { CardContent, Table, TableHead, TableRow, TableCell, TableBody, TextareaAutosize } from '@mui/material';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import ClearIcon from '@mui/icons-material/Clear';
import { AlretDataPayload, Level, createCustomerRequest } from '../../../data/services/btms/View/alertData/alertData_payload';
import AlertDetailsApiService from '../../../data/services/btms/alertDetails/alertDetails-api-service';
import AlertDataApiService from '../../../data/services/btms/View/alertData/alertData_api-service';

interface AlertDetails {
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
    senderCustomer: string;
    withdrawals: string;
    dt: string;
    branch: string;
    senderAccount: string;
    country: string;
    receiver: string;
    receiverBankName: string;
    receiverCountry: string;
}

const AlertDetails = () => {
    const alertDetailsApiService = new AlertDetailsApiService();
    const [alertDetails, setAlertDetails] = useState<AlertDetails[]>([]);
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
    // const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [level, setLevel] = useState<Level[]>([]);
    const alertService = new AlertDataApiService();

    useEffect(() => {
        fetchAlertDetails();
        fetchTransaction();
        fetchIdLevel();
    }, []);

    const fetchAlertDetails = async () => {
        try {
            const fetchedAlertDetails = await alertDetailsApiService.getAlertDetails();
            const filteredAlertDetails = fetchedAlertDetails.filter((item: { customerId: string | undefined; }) => item.customerId === customerId);
            setAlertDetails(filteredAlertDetails);
        } catch (error) {
            console.error("Error fetching the AlertDetails:", error);
        }
    }

    const fetchTransaction = async () => {
        try {
            const fetchedTransactions = await alertDetailsApiService.getTransaction(customerId);
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
    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files && event.target.files.length > 0) {
    //         setSelectedFile(event.target.files[0]);
    //     }
    // };
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    }
    const handleDeleteFile = () => {
        setSelectedFile(null);
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

    // const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormData({ ...formData, name: event.target.value });
    // };
    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, name: event.target.value });
    };

    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'transactions_data';
        const filteredGenerals = alertDetails.map(alert => ({
            'Rules ': alert.txnAlert,
            'Score': '95%',
            'Status': 'To be Assigned',
            'Customer Name': alert.customerName,
            'Alert Date': '21/02/2024',

            'Description': alert.description,
            'Customer ID': alert.customerId,
            // 'DOB': '21/02/2024',
            // 'Nationality': 'Indian',
            // 'Residence Location': 'Chennai'
        }));
        const filteredTransactions = transaction.map((transactions => ({
            'Account Number': transactions.senderAccount,
            'Amount': transactions.withdrawals,
            'Branch': transactions.branch,
            'Date Time': transactions.dt,
            'Beneficiary Name': transactions.receiver,
            'Beneficiary Bank': transactions.receiverBankName,
        })));
        const combinedData = [...filteredGenerals, ...filteredTransactions];
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
    return (
        <>
            <Header />
            <Box m={4}>
                <Card style={{
                    padding: '1%',
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                    width: '100%',
                }}>
                    <Grid item xs={2}>
                        <h5>Alert Details</h5>
                        <div style={{ marginTop: '-2%', marginRight: '3%' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}>
                                Help | Admin Login
                            </div>

                        </div>
                    </Grid>
                    {alertDetails.map((alertDetail, index) => (
                        <div key={index}>
                            <Card style={{
                                padding: '1%',
                                boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                                width: '100%',
                                marginTop: '1%'
                            }}>

                                <Grid container xs={12} >
                                    <Grid item xs={12} sm={4}>
                                        <p><strong>Alert Id :</strong> {alertDetail.id}</p>
                                        <p><strong>Rules :</strong> {alertDetail.txnAlert} </p>

                                        <p><strong>Description :</strong> {alertDetail.description}</p>

                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p><strong> Score :</strong> 95% </p>

                                        {/* <p><strong>Customer Name :</strong> {alertDetail.customerName}</p> */}

                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <p><strong>Status :</strong> To be Assigned</p>
                                        {/* <p><strong>DOB :</strong> 21/02/2024</p> */}

                                    </Grid>
                                    <Grid item xs={12} sm={2}>

                                        <p><strong>Alert Date :</strong> 21/02/2024</p>
                                        {/* <p><strong>Location :</strong> Chennai</p> */}
                                    </Grid>
                                </Grid>
                                <h6><u><b>Customer Details</b></u></h6>
                                <Table size="small" className="tablesearch-able" style={{ backgroundColor: '#eeeff1' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Customer ID</TableCell>
                                            <TableCell>Customer Name</TableCell>
                                            <TableCell>DOB</TableCell>
                                            <TableCell>Nationality</TableCell>
                                            <TableCell>Home Branch</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(alertDetails) && alertDetails.map((alertDetail, index) => (
                                            <TableRow key={index} className="highlighted-row">
                                                <TableCell>{alertDetail.customerId}</TableCell>
                                                <TableCell>{alertDetail.customerName}</TableCell>
                                                <TableCell>21/02/2024</TableCell>
                                                <TableCell>Indian</TableCell>
                                                <TableCell>Chennai</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </Card>
                        </div>
                    ))}


                    {alertDetails.map((alertDetail, index) => (
                        <div key={index}>
                            <Card style={{
                                padding: '1%',
                                boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                                width: '100%',
                                marginTop: '1%'
                            }}>

                                {/* <h6><u><b>Alert Details</b></u></h6> */}
                                {/* <Grid container xs={12} >
                                    <Grid item xs={12} sm={8}>
                                        <p><strong>Name : </strong>{alertDetail.txnAlert}</p>
                                        <p><strong>Description :</strong> {alertDetail.description}</p>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>

                                        <p><strong>Priority :</strong> 95% </p>

                                    </Grid>
                                    <Grid item xs={12} sm={2}>


                                        <p><strong>Status :</strong> To be Assigned</p>
                                    </Grid>

                                </Grid> */}



                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span><u><b>Transaction Details : </b></u></span>
                                    <div style={{ marginLeft: '10px' }}>
                                        <IconButton onClick={exportToExcel} aria-label="download" color="primary">
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <div style={{ overflowY: 'scroll', maxHeight: '200px' }}>

                                    <Table size="small" className="table search-table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Account Number</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Branch</TableCell>
                                                <TableCell>Date  Time</TableCell>
                                                <TableCell>Beneficiary Name</TableCell>
                                                <TableCell>Beneficiary Bank</TableCell>
                                                <TableCell>Branch</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transaction.map((transactions, index) => (
                                                <TableRow key={index} >
                                                    <TableCell>{transactions.senderAccount}</TableCell>
                                                    <TableCell>{parseFloat(transactions.withdrawals).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>

                                                    <TableCell>{transactions.branch}</TableCell>
                                                    <TableCell>{transactions.dt}</TableCell>
                                                    <TableCell>{transactions.receiver}</TableCell>
                                                    <TableCell>{transactions.receiverBankName}</TableCell>
                                                    <TableCell>{transactions.branch}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                            <br></br>
                        </div>
                    ))}

                    <h6><u><b>Audit Log</b></u></h6>
                    {/* <Card style={{
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                    }}> */}

                    {/* <Grid container xs={12} spacing={2}>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="person-container">
                                    <div className="field-group-column">


                                        <FormControl style={{ width: '50%' }}>
                                            <InputLabel htmlFor="gender">Level 1</InputLabel>
                                            <Select
                                                label="Level 1"
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




                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="key">
                                <div className="person-container">
                                    <div className="field-group-column">



                                        <TextField
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
                                        />



                                    </div>
                                </div>
                            </div>
                        </Grid>

                    </Grid> */}
                    <Grid container spacing={3}>

                        <Grid item sm={9}>

                            <TextareaAutosize
                                style={{ minHeight: '100px', maxHeight: '250px', width: '97%', resize: 'none' }}
                                placeholder="Type here..."
                                autoFocus
                                id="outlined-multiline-static"
                                value={formData.name}
                                onChange={handleNameChange}
                                minRows={3} // Set the minimum number of rows to display
                            />





                        </Grid>
                        <Grid item sm={3}>

                            {/* <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}> */}
                            <FormControl style={{ width: '70%' }}>
                                <InputLabel htmlFor="gender">Status </InputLabel>
                                <Select
                                    label="Outlined"
                                    id="outlined-basic"
                                    variant="outlined"
                                    size="small"
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

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                style={{ display: 'none', width: '70%' }}
                                id="upload-document"
                                onChange={handleFileChange}
                            />
                            <br></br>
                            <br></br>
                            <label htmlFor="upload-document" style={{ marginRight: '20px', width: '70%' }}>
                                <Button variant="outlined" component="span" style={{ width: '100%' }}>
                                    Document Upload
                                </Button>
                            </label>
                            <br></br>
                            <br></br>
                            <TextField
                style={{ width: '70%' }}
                label="Attachments"
                type="text"
                size="small"
                multiline
                variant="outlined"
                value={selectedFile ? selectedFile.name : ''}
                disabled={!selectedFile}
                InputProps={selectedFile ? {
                    endAdornment: (
                        <IconButton onClick={handleDeleteFile}>
                            <ClearIcon />
                        </IconButton>
                    )
                } : undefined}
            />                            <br></br>
                            <br></br>
                            <Button style={{ width: '70%' }}
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
                        </Grid>

                    </Grid>

                    {/* </Card> */}
                    <br></br>

                    {/* <Grid container xs={8} spacing={2}>
                        <Grid item sm={3}>
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

                    </Grid> */}

                </Card>
                <br></br>
                {/* <Button
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
                </Button> */}
            </Box >
        </>
    )
}

export default AlertDetails
