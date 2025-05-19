import { useState, useEffect } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent


import { CardContent, Table, TableHead, TableRow, TableCell, TableBody, TextareaAutosize } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import * as XLSX from 'xlsx';
import AlertDetailsApiService from '../../../data/services/btms/alertDetails/alertDetails-api-service';
import AdminUserRightsApiService from '../../../data/services/btms/adminuserrights/athu-adminuserrights-api-service';
import AlertDataApiService from '../../../data/services/btms/View/alertData/alertData_api-service';
import { AlretDataPayload, Level, createCustomerRequest } from '../../../data/services/btms/View/alertData/alertData_payload';

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

const AlertDetailsview = () => {
    const alertDetailsApiService = new AlertDetailsApiService();
    const [alertDetails, setAlertDetails] = useState<AlertDetails[]>([]);
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
    const [AuditLog, setAuditLog] = useState<createCustomerRequest[]>([]);


    const [alertData, setAlertData] = useState<AlretDataPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [level, setLevel] = useState<Level[]>([]);
    const alertService = new AlertDataApiService();

    useEffect(() => {
        fetchAlertDetails();
        fetchTransaction();
        fetchIdLevel();
        fetchAuditLog();
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
        const filteredAuditLog = AuditLog.map((AuditLog => ({
            // 'Remark': AuditLog.name,
            // 'levelId': AuditLog.levelId,

        })));
        const combinedData = [...filteredGenerals, ...filteredTransactions, ...filteredAuditLog];
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
    const addressApiService = new AdminUserRightsApiService();
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { customerId, id: alertId } = useParams();


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
        <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

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

                    <h6><u><b>AuditLog : </b></u></h6>
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
                    <Grid item xs={12}>
                            <h2>Image Preview</h2>
                            {base64Image && (
                                <img src={base64Image} alt="Preview" style={{ maxHeight: '250px', maxWidth: '300px' }} />
                            )}
                            {!base64Image && <p>No image available.</p>}
                        </Grid>
                </Card>
                <br></br>

            </Box > 
        </Box>
            
        </Box>
         
        </>
    )
}

export default AlertDetailsview
