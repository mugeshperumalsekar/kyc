import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../../layouts/header/header';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { useNavigate } from 'react-router-dom';

interface ApplicantForm {
    id: number;
    name: string;
    numberOfPrint: number;
    isCompleted: number;
    euid: number;
    uid: number;
}

function Pending() {

    const [data, setData] = useState<ApplicantForm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const applicationfrome = new ApplicationfromeService();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRiskRange = async () => {
            try {
                const response = await applicationfrome.getIsCompleted();
                setData(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching risk range:", error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
                setLoading(false);
            }
        };
        fetchRiskRange();
    }, []);

    const handleRowClick = (id: any) => {
        sessionStorage.setItem("responseId", id);
        console.log("sessionStorage", sessionStorage)
        navigate(`/Draft/${id}`);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Card border='10px' style={{ marginTop: '6%', padding: '20px' }}>
                        <Card.Header as="h5">Pending Items</Card.Header>
                        <Card.Body>
                            {loading && <Spinner animation="border" />}
                            {error && <Alert variant="danger">{error}</Alert>}
                            {!loading && !error && (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Number of Print</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map(item => (
                                            <TableRow key={item.id} onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.numberOfPrint}</TableCell>
                                                <TableCell>{item.isCompleted ? 'Completed' : 'Pending'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default Pending;