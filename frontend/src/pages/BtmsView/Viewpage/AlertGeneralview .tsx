import { useState, useEffect } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Container, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';

import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

import { CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import * as XLSX from 'xlsx';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import AlertGeneralApiService from '../../../data/services/btms/alertGeneral/alertGeneral-api-service';
import AlertDataApiService from '../../../data/services/btms/View/alertData/alertData_api-service';
import { AlretDataPayload, Level, createCustomerRequest } from '../../../data/services/btms/View/alertData/alertData_payload';
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
    const [imageData, setImageData] = useState<Array<string>>([]);

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
                console.log('base64Image:', base64Image);
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
    // useEffect(() => {
    //     const fetchImageData = async () => {
    //         try {
    //             setLoading(true);
    //             if (!customerId || !alertId) {
    //                 return;
    //             }

    //             const imageDataResponse = await addressApiService.getImage(customerId, parseInt(alertId));

    //             if (Array.isArray(imageDataResponse)) {
    //                 console.log('Number of images received:', imageDataResponse.length);
    //                 setImageData(imageDataResponse.map(arrayBufferToBase64));
    //                 setError(null);
    //             } else if (imageDataResponse instanceof ArrayBuffer) {
    //                 console.log('Single image received');
    //                 const base64Image = arrayBufferToBase64(imageDataResponse);
    //                 setImageData([base64Image]);
    //                 setError(null);
    //             } else {
    //                 console.error('Unexpected response:', imageDataResponse);
    //                 setError('Unexpected response');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching image data:', error);
    //             setError('Error fetching image data');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchImageData();
    // }, [customerId, alertId]);


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



                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span><u><b>Transaction Details : </b></u></span>
                                    <div style={{ marginLeft: '10px' }}>
                                        <IconButton onClick={exportToExcel} aria-label="download" color="primary">
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </div>
                                </div>
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
                                <Grid item xs={12}>
                                    <h2>Image Preview</h2>
                                    {imageData && imageData.map((imageSrc, index) => (
                                        <img key={index} src={imageSrc} alt={`Preview ${index}`} style={{ maxHeight: '250px', maxWidth: '300px' }} />
                                    ))}

                                    {!imageData && <p>No image available.</p>}
                                </Grid>

                            </Card>
                            <br></br>

                        </Card >
                        <br></br>




                    </Box >
                </Box>

            </Box>

        </>
    )
}

export default AlertGeneralview;
