import { useState, useEffect } from 'react'
import { Box, Grid } from '@mui/material';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton';
import AlertViewApiService from '../../../data/services/btms/alert/alert-api-service';

interface Alert {
    assignInvestigation: number;
}

interface Transaction {
    transModeId: string;
    transCount: string;
    transCumulativeAmt: string;
    customerId: string;
    accountId: string;
    alertDetails: string;
    dt: string;
    assignInvestigation: number;
    txnAlert: string;
    description: string;
    customerName: string;
    accountNum: string;
    bankName: string;
    branchName: string;
    pocId: number;
    id: number;
    isCumulativeEntry: number;
}

const Alert = () => {

    const alertApiService = new AlertViewApiService();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransaction();
    }, []);

    const fetchTransaction = async () => {
        try {
            const fetchedTransactions = await alertApiService.getTransactionDet();
            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error("Error fetching the Transaction:", error);
        }
    };

    const handleCardClick = (customerId: string, pocId: number, id: number) => {
        if (pocId === 2) { navigate(`/AlertGeneral/${customerId}/${id}`); }
        else if (pocId === 3) { navigate(`/AlertDetails/${customerId}/${id}`) }
    };

    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'transactions_data';
        const filteredTransactions = transactions.map(transaction => ({
            'Customer Id': transaction.customerId,
            'Customer Name': transaction.customerName,
            'Rules': transaction.txnAlert,
            'Alert Date': transaction.dt,
            'Score': '95%',
            'Status': 'To be Assigned'
        }));
        const ws = XLSX.utils.json_to_sheet(filteredTransactions);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName + fileExtension);
        document.body.appendChild(link);
        link.click();
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
                        <h5>Alerts/Today</h5>
                        <div style={{ marginTop: '-2%', marginRight: '3%' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'gray' }}>
                                Help | Admin Login
                            </div>
                        </div>
                    </Grid>
                    <hr></hr>
                    <div style={{ marginTop: '1%' }}></div>
                    Today <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ marginLeft: '10px' }}>
                            <IconButton onClick={exportToExcel} aria-label="download" color="primary">
                                <FileDownloadIcon />
                            </IconButton>
                        </div>
                    </span><hr></hr>
                    {/* {transactions.map((transaction, index) => (
                        <div key={index} onClick={() => handleCardClick(transaction.customerId, transaction.pocId, transaction.id)}>
                            <Card key={index} style={{
                                padding: '1%',
                                boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                                width: '100%',
                                marginTop: '1%',
                                cursor: 'pointer'
                            }}>
                                {transaction.assignInvestigation === 0 ? (
                                    <>
                                       
                                        <Grid container xs={12} >
                                            <Grid item xs={12} sm={10}>
                                                <p><strong>TXN Alert : <span style={{ fontWeight: 'bold' }}>{transaction.txnAlert}</span></strong></p>
                                                <p><strong>Customer Name : <span style={{ fontWeight: 'bold' }}>{transaction.customerName}</span></strong></p>
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <p><strong style={{ fontWeight: 'bold' }}>95% To be Assigned</strong></p>
                                                <p><strong>Alert Date : <span style={{ fontWeight: 'bold' }}>{transaction.dt}</span></strong></p>
                                            </Grid>
                                        </Grid>
                                
                                    </>
                                ) : (
                                    <>
                                     
                                        <Grid container xs={12} >
                                            <Grid item xs={12} sm={10}>
                                                <p><strong>TXN Alert: <span style={{ fontWeight: 'bold' }}>{transaction.txnAlert}</span></strong></p>
                                                <p><strong>Customer Name: <span style={{ fontWeight: 'bold' }}>{transaction.customerName}</span></strong></p>
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <p><strong style={{ fontWeight: 'bold' }}>95% To be Assigned</strong></p>
                                                <p><strong>Alert Date: <span style={{ fontWeight: 'bold' }}>{transaction.dt}</span></strong></p>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Card>
                        </div>
                    ))} */}
                    <TableContainer component={Paper}>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Customer Id</strong></TableCell>
                                    <TableCell><strong>Customer Name</strong></TableCell>
                                    <TableCell><strong>Rules</strong></TableCell>
                                    <TableCell><strong>Alert Date</strong></TableCell>
                                    <TableCell><strong>Score</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction, index) => (
                                    <TableRow key={index} onClick={() => handleCardClick(transaction.customerId, transaction.pocId, transaction.id)} style={{ cursor: 'pointer' }}>
                                        <TableCell>{transaction.customerId}</TableCell>
                                        <TableCell>{transaction.customerName}</TableCell>
                                        <TableCell>{transaction.txnAlert}</TableCell>
                                        <TableCell>{transaction.dt}</TableCell>
                                        <TableCell>95% </TableCell>
                                        <TableCell> To be Assigned</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                </Card>
            </Box>
        </>
    )
}

export default Alert
