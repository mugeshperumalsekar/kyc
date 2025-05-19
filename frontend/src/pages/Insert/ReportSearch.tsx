
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../../layouts/header/header';
import ViewService from '../../data/services/viewpage/view_api_service';
import Dialog from '@mui/material/Dialog';

export interface SanctionSearchData {
    searchData: SearchData[];
}

export interface SearchData {
    name: string;
    matchingScore: number | null;
    uid: number;
    typeId: number;
    listId: number;
    stateId: number;
    countryId: number;
    levelId: number;
    fromDate: string;
    toDate: string;
    hitRecordData: HitRecordData[];
}

export interface HitRecordData {
    searchId: number;
    name: string;
    matchingScore: number;
    uid: number;
    criminalId: number;
    display: string;
    statusNowId: number;
    cycleId: number;
    fromDate: string;
    toDate: string;
}

function SanctionSearch() {
    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchData, setSearchData] = useState<SearchData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHitRecordData, setSelectedHitRecordData] = useState<HitRecordData[]>([]);

    const handleRowClick = (hitRecordData: HitRecordData[]) => {
        setSelectedHitRecordData(hitRecordData);
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHitRecordData([]);
    };

    const handleSearch = () => {
        const apiService = new ViewService();
        apiService.getCustomDate(startDate, endDate)
            .then((fetchedData: SanctionSearchData[]) => {
                setSearchPerformed(true);

                // Extract searchData from fetchedData
                const extractedData = fetchedData.flatMap(entry => entry.searchData || []);

                // Log the normalized data to ensure it's correct
                console.log('searchData:', extractedData);

                // Set the searchData to the state variable
                setSearchData(extractedData);
            })
            .catch((error: any) => {
                console.error('API request error:', error);
            });
    };

    useEffect(() => {
        console.log('Search data:', searchData);
    }, [searchData]);

    const handleStartChange = (date: Date) => {
        setStartDate(date);
    };

    const handleEndChange = (date: Date) => {
        setEndDate(date);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

                        <h6 className='allheading'>REPORT</h6>
                    </Box>
                    <Card border='10px' style={{ padding: '2%', marginTop: '2%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', maxHeight: '400px' }}>
                        <Container className="alertreport-container">
                            <Form>
                                <Row>
                                    <Col xs={4}>
                                        <Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Label><strong>Start Date</strong></Form.Label>
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={handleStartChange}
                                                        dateFormat="MMMM d, yyyy"
                                                        className="form-control"
                                                        disabledKeyboardNavigation
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Label><strong>End Date</strong></Form.Label>
                                                    <DatePicker
                                                        selected={endDate}
                                                        onChange={handleEndChange}
                                                        dateFormat="MMMM d, yyyy"
                                                        className="form-control"
                                                        disabledKeyboardNavigation
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Button variant="primary" className='commonButton' style={{ marginTop: '8%' }} onClick={handleSearch}>
                                            Apply Dates
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                            <br />
                            {searchData.length === 0 && searchPerformed && (
                                <p>No data available</p>
                            )}
                            {searchData.length > 0 && (

                                <TableContainer style={{ maxHeight: '290px', overflow: 'auto' }}>
                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Sl.no</strong></TableCell>
                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Name</strong></TableCell>
                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Matching Score</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {searchData.length > 0 ? (
                                                searchData.map((item: SearchData, index: number) => (
                                                    <TableRow key={item.uid}
                                                        onClick={() => handleRowClick(item.hitRecordData)} // Pass hitRecordData here
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <TableCell><span>{index + 1}</span></TableCell>
                                                        <TableCell style={{ cursor: 'pointer', color: '#3F51B5', textDecoration: 'underline', }}>
                                                            <span>
                                                                {item.name.length > 20
                                                                    ? item.name.slice(0, 20) + '...'
                                                                    : item.name}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell><span>{item.matchingScore !== null ? Math.round(item.matchingScore) : 'N/A'}</span></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3}><span>No data available</span></TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>


                            )}
                        </Container>
                    </Card>
                </Box>

            </Box>
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle><strong>SEARCH DETAILS</strong></DialogTitle>
                <DialogContent>
                    {selectedHitRecordData.length > 0 ? (
                        <TableContainer style={{ maxHeight: '300px', overflow: 'auto' }}>
                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Search ID</strong></TableCell>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Name</strong></TableCell>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Score</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedHitRecordData.map((detail, index) => (
                                        <TableRow key={detail.uid}>
                                            <TableCell><span>{index + 1}</span></TableCell>
                                            <TableCell><span>{detail.name}</span></TableCell>
                                            <TableCell><span>{Math.round(detail.matchingScore)}</span></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    ) : (
                        <p>No details available</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default SanctionSearch;
