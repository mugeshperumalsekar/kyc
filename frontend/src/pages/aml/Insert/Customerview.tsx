import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerApiService from '../../../data/services/aml/Reports/CustomerEdit/customeredit-api-service';
import Header from '../../../layouts/header/header';
import { useSelector } from 'react-redux';

interface All {
    id: number;
    complaintId: number;
    clientId: string;
    targetCustomerName: string;
    branchName: string;
    ticketId: number;
    uid: string;
    created_at: string;
}

const CustomerEdit = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const { complaintId, branchId ,ticketId} = useParams<{ complaintId: string; branchId: string;ticketId:string; }>();
    const [all, setAll] = useState<All[]>([]);
    const customerApiService = new CustomerApiService();
    const navigate = useNavigate();


    useEffect(() => {
        fetchAll();
    }, [branchId,complaintId,ticketId]);

    const fetchAll = async () => {
        try {
            const response = await customerApiService.getAllrepaly(1);
            setAll(response);
        } catch (error) {
            console.error("Error fetching the data:", error);
        }
    };

    const handleTableRowClick = ( ticketId: number) => {
        const uid = loginDetails.id;
        navigate(`/AmlBranch/${ticketId}/${uid}`);
    }
    
   
    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: '30px', margin: '5px' }}>
                    <Box m={4}>
                        <div className="d-flex justify-content-center">
                            <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                                <div className="card-body">
                                    <div className="table-container" style={{ overflow: 'auto', maxHeight: '480px' }}>
                                        {all.length === 0 ? (
                                            <Typography variant="body1">No data available</Typography>
                                        ) : (
                                            <Table size="small" className="table report-table" style={{ width: '100%' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Sl no</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>TargetCustomerName</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Branch Name</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Ticket Id</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {all.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell
                                                                   onClick={() => handleTableRowClick( item.ticketId)}

                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {item.targetCustomerName}
                                                            </TableCell>
                                                            <TableCell>{item.branchName}</TableCell>
                                                            <TableCell>{item.ticketId}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default CustomerEdit;
