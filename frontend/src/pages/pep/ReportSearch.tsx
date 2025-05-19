// import { useState } from 'react';
// import { Grid, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import PepSearchApiService from '../../data/services/pep/PepSearch/pepSearch-api-service';
// import Header from '../../layouts/header/header';
// import { Card } from 'react-bootstrap';

// export interface PepSearchData {
//     searchDtos: SearchDto[];
// }

// export interface SearchDto {
//     id: number;
//     name: string;
//     searchingScore: number | null;
//     uid: number;
//     fromDate: string;
//     toDate: string;
//     searchDetailsData: SearchDetailsData[];
// }

// export interface SearchDetailsData {
//     id: number;
//     searchId: number;
//     name: string;
//     matchingScore: number;
//     uid: number;
//     fromDate: string;
//     toDate: string;
// }

// function ReportSearch() {



//     const [startDate, setStartDate] = useState<Date>(new Date());
//     const [endDate, setEndDate] = useState<Date>(new Date());
//     const [data, setData] = useState<PepSearchData[]>([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedSearchDetails, setSelectedSearchDetails] = useState<SearchDetailsData[]>([]);

//     const handleSearch = () => {
//         const apiService = new PepSearchApiService();
//         apiService.getCustomDate(startDate, endDate)
//             .then((fetchedData: PepSearchData[]) => {
//                 const transformedData: PepSearchData[] = fetchedData.map(entry => {
//                     let searchDtos: SearchDto[] = [];
//                     if (Array.isArray(entry.searchDtos)) {
//                         searchDtos = entry.searchDtos;
//                     } else if (entry.searchDtos && typeof entry.searchDtos === 'object') {
//                         searchDtos = [entry.searchDtos as SearchDto];
//                     }
//                     const transformedEntry = {
//                         searchDtos: searchDtos.map(dto => ({
//                             ...dto,
//                             searchDetailsData: Array.isArray(dto.searchDetailsData) ? dto.searchDetailsData : []
//                         }))
//                     };
//                     return transformedEntry;
//                 });
//                 setData(transformedData);
//             })
//             .catch((error: any) => {
//                 console.error('API request error:', error);
//             });
//     };
//     const handleRowClick = (searchDetails: SearchDetailsData[]) => {
//         console.log("Row clicked!");  // Basic log to see if function is triggered
//         console.log("Search details data:", searchDetails);  // Log full search details array
//         searchDetails.forEach((detail) => {
//             console.log("ID:", detail.id);  // Log each individual ID in the search details
//         });
//         setSelectedSearchDetails(searchDetails);
//         setShowModal(true);
//     };


//     const handleCloseModal = () => {
//         setShowModal(false);
//         setSelectedSearchDetails([]);
//     };

//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3,mt:4 }}>
//                     <Box 
//                     sx={{
//                         marginLeft: '15px',
//                         marginBottom: '20px',
//                         marginTop:'44px'
//                       }}

//                     >
//                        <Typography><strong>REPORT</strong> </Typography>
//                         <Paper elevation={3} sx={{ p: 3, mb: 5,mt:2 }}>
//                             <Grid container spacing={3} alignItems="center" style={{marginTop:'0px'}}>
//                                 <Grid item xs={2}>
//                                     <Typography><strong>Start Date</strong></Typography>
//                                     <DatePicker
//                                         selected={startDate}
//                                         onChange={(date: Date) => setStartDate(date)}
//                                         dateFormat="MMMM d, yyyy"
//                                         className="form-control"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={2}>
//                                     <Typography><strong>End Date</strong></Typography>
//                                     <DatePicker
//                                         selected={endDate}
//                                         onChange={(date: Date) => setEndDate(date)}
//                                         dateFormat="MMMM d, yyyy"
//                                         className="form-control"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={2} style={{ marginTop: '18px' }}>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         startIcon={<SearchIcon />}
//                                         onClick={handleSearch}
//                                         fullWidth
//                                     >
//                                         Search
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                             {data.length > 0 && (

//                                 <TableContainer
//                                     component={Card}
//                                     style={{
//                                         overflow: 'auto',
//                                         maxHeight: '400px',
//                                         width: '95%',
//                                         marginTop:'3%',
//                                     }}
//                                 >
//                                     <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }} stickyHeader>
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell style={{padding: '4px',minWidth: '80px',backgroundColor: '#D3D3D3'}}><strong>Sl No</strong></TableCell>
//                                                 <TableCell style={{padding: '4px',minWidth: '80px', backgroundColor: '#D3D3D3'}}><strong>Name</strong></TableCell>
//                                                 <TableCell style={{padding: '4px', minWidth: '80px', backgroundColor: '#D3D3D3'}}><strong>Searching Score</strong></TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {data.flatMap((item: PepSearchData, idx: number) =>
//                                                 item.searchDtos.map((dto: SearchDto, index: number) => (
//                                                     <TableRow key={dto.uid} 
//                                                      hover 
//                                                     onClick={() => handleRowClick(dto.searchDetailsData)} 
//                                                     style={{ cursor: 'pointer',height:'32px' }}>
//                                                         <TableCell  style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
//                                                         <TableCell  style={{ padding: '4px', }}><span>{dto.name}</span></TableCell>
//                                                         <TableCell  style={{ padding: '4px', }}><span>{dto.searchingScore ?? 'N/A'}</span></TableCell>
//                                                     </TableRow>
//                                                 ))
//                                             )}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             )}
//                         </Paper>



//                     </Box>
//                 </Box>
//             </Box>

//             {/* Modal to display search details */}
//             <Dialog open={showModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
//                 <DialogTitle><strong>Search Details</strong></DialogTitle>
//                 <DialogContent>
//                     {selectedSearchDetails.length > 0 ? (
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell><strong>Search ID</strong></TableCell>
//                                         <TableCell><strong>Name</strong></TableCell>
//                                         <TableCell><strong>Matching Score</strong></TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectedSearchDetails.map((detail, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{detail.searchId}</TableCell>
//                                             <TableCell>{detail.name}</TableCell>
//                                             <TableCell>{detail.matchingScore}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     ) : (
//                         <Typography><span>No details available</span></Typography>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseModal} color="primary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// }

// export default ReportSearch;

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../../layouts/header/header';
import Dialog from '@mui/material/Dialog';
import PepSearchApiService from '../../data/services/pep/PepSearch/pepSearch-api-service';
// src/types.ts
export interface PepSearchData {
    searchDtos: SearchDto[];
  }
  
  export interface SearchDto {
    name: string;
    searchingScore: number | null;
    uid: number;
  hitName:string;
    fromDate: string;
    toDate: string;
    hitRecordData: HitRecordData[];
  }
  
  export interface HitRecordData {
    id:number;
    searchId: number;
    name: string;
    matchingScore: number;
    uid: number;
  hitName:string;
    fromDate: string;
    toDate: string;
  }
  function SanctionSearch() {
    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchData, setSearchData] = useState<SearchDto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedHitRecordData, setSelectedHitRecordData] = useState<HitRecordData[]>([]);

    const handleRowClick = (hitRecordData: HitRecordData[] = []) => {
        setSelectedHitRecordData(hitRecordData || []);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedHitRecordData([]);
    };

    const handleSearch = () => {
        const apiService = new PepSearchApiService();
        apiService.getCustomDate(startDate, endDate)
            .then((fetchedData: PepSearchData[]) => {
                setSearchPerformed(true);

                // Extract searchData from fetchedData
                const extractedData = fetchedData.flatMap(entry => entry.searchDtos || []);

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
                    <h5>DATA ENTRY</h5>
                    <Form>
                        <Row>
                            <Col xs={4}>
                                <Form.Group>
                                    <Row>
                                        <Col>
                                            <Form.Label>Start Date</Form.Label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleStartChange}
                                                dateFormat="MMMM d, yyyy"
                                                className="form-control"
                                                disabledKeyboardNavigation
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Label>End Date</Form.Label>
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
                                <Button variant="primary" style={{ marginTop: '8%' }} onClick={handleSearch}>
                                    Apply Dates
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <br />
                    {searchPerformed && searchData.length === 0 && <p>No data available</p>}
                    {searchData.length > 0 && (
                        <div className="table-wrapper">
                            <TableContainer component={Card} style={{ maxHeight: '400px', overflow: 'auto' }}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Sl no</TableCell>
                                            <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Name</TableCell>
                                            <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Matching Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {searchData.map((item: SearchDto, index: number) => (
                                            <TableRow
                                                key={item.uid}
                                                onClick={() => handleRowClick(item.hitRecordData || [])}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.searchingScore !== null ? Math.round(item.searchingScore) : 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </Box>
            </Box>
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>Search Details</DialogTitle>
                <DialogContent>
                    {selectedHitRecordData.length > 0 ? (
                        <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Search ID</TableCell>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Name</TableCell>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Matching Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedHitRecordData.map((detail, index) => (
                                        <TableRow key={detail.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{detail.name}</TableCell>
                                            <TableCell>{detail.matchingScore}</TableCell>
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
                    <Button variant="contained" onClick={handleCloseModal}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SanctionSearch;
