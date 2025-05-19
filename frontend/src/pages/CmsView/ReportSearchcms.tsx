

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Header from '../../layouts/header/header';
import Dialog from '@mui/material/Dialog';
import CmsSearchApiService from '../../data/services/CmsSearch/cmsSearch-api-service';
export interface CmsSearchData {
  searchDtos: SearchDto[];
}

export interface SearchDto {
  name: string;
  matchingScore: number | null;
  uid: number;
  fromDate: string;
  toDate: string;
  hitRecordData: HitRecordData[];
}

export interface HitRecordData {
  id: number;
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
    const [searchData, setSearchData] = useState<SearchDto[]>([]);
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
      const apiService = new CmsSearchApiService();
        apiService.getCustomDate(startDate, endDate)
            .then((fetchedData: CmsSearchData[]) => {
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
                <Box component="main" sx={{ flexGrow: 1, p: 3,m:4 }}>
                 
                        <h5 >DATA ENTRY</h5>
                     
                          
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
                                {searchData.length === 0 && searchPerformed && (
                                    <p>No data available</p>
                                )}
                                {searchData.length > 0 && (
                                    <div className="table-wrapper">
                                        <TableContainer  component={Card}style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Sl no</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Name</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Matching Score</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {searchData.length > 0 ? (
                                                        searchData.map((item: SearchDto, index: number) => (
                                                            <TableRow key={item.uid}
                                                                onClick={() => handleRowClick(item.hitRecordData)} // Pass hitRecordData here
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell style={{ cursor: 'pointer' }}>{item.name}</TableCell>
                                                                <TableCell>{item.matchingScore !== null ? Math.round(item.matchingScore) : 'N/A'}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={3}>No data available</TableCell>
                                                        </TableRow>
                                                    )}
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
                                        <TableRow key={detail.uid}>
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
                    <Button variant="contained" onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default SanctionSearch;



// import React, { useState } from 'react';
// import { Table, Modal, Button, DatePicker, Row, Col } from 'antd';
// import CmsSearchApiService from '../../data/services/CmsSearch/cmsSearch-api-service';
// import Header from '../../layouts/header/header';
// import { Box } from '@mui/material';
// import moment, { Moment } from 'moment';

// // Define TypeScript interfaces
// export interface CmsSearchData {
//   searchDtos: SearchDto[];
// }

// export interface SearchDto {
//   name: string;
//   matchingScore: number | null;
//   uid: number;
//   fromDate: string;
//   toDate: string;
//   hitRecordData: HitRecordData[];
// }

// export interface HitRecordData {
//   id: number;
//   searchId: number;
//   name: string;
//   matchingScore: number;
//   uid: number;
//   criminalId: number;
//   display: string;
//   statusNowId: number;
//   cycleId: number;
//   fromDate: string;
//   toDate: string;
// }

// // Define columns for the main table and modal dialog
// const columns = [
//   {
//     title: 'S.No',
//     dataIndex: 'key',
//     key: 'key',
//   },
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: 'Matching Score',
//     dataIndex: 'matchingScore',
//     key: 'matchingScore',
//   },
// ];

// const hitRecordColumns = [
//   {
//     title: 'ID',
//     dataIndex: 'id',
//     key: 'id',
//   },
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: 'Matching Score',
//     dataIndex: 'matchingScore',
//     key: 'matchingScore',
//   },
//   {
//     title: 'Display',
//     dataIndex: 'display',
//     key: 'display',
//   },
//   // Add more columns as needed
// ];

// // Main component
// const App: React.FC = () => {
//   const [data, setData] = useState<SearchDto[]>([]);
//   const [selectedRecord, setSelectedRecord] = useState<HitRecordData[]>([]);
//   const [visible, setVisible] = useState(false);
//   const [startDate, setStartDate] = useState<Moment | null>(null);
//   const [endDate, setEndDate] = useState<Moment | null>(null);

//   // Handle DatePicker change
//   const handleStartChange = (date: Moment | null) => setStartDate(date);
//   const handleEndChange = (date: Moment | null) => setEndDate(date);

//   const handleSearch = async () => {
//     if (startDate && endDate) {
//       const apiService = new CmsSearchApiService();
//       try {
//         const response = await apiService.getCustomDate(startDate.toDate(), endDate.toDate());
//         const searchData: CmsSearchData[] = response as CmsSearchData[];
//         const allSearchDtos = searchData.flatMap(data => data.searchDtos);
//         setData(allSearchDtos || []);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//   };
  
//   // Handle row click to open modal
//   const handleRowClick = (record: SearchDto) => {
//     setSelectedRecord(record.hitRecordData);
//     setVisible(true);
//   };

//   return (
//     <Box sx={{ display: 'flex',fontFamily: "Bookman Old Style",
//       fontSize: "12px"}}>
//       <Header />
//       <Box component="main" sx={{ flexGrow: 1, p: 3,m:4 }}>
       
//           <h5 style={{fontFamily: "Bookman Old Style",
//               fontSize: "16px"}}>DATA ENTRY</h5>
//           <Row style={{ marginBottom: 16 }}>
//             <Col>
//               <DatePicker
//                 value={startDate}
//                 onChange={handleStartChange}
//                 format="MMMM D, YYYY"
//                 className="form-control"
//                 placeholder="Start Date"
//               />
//             </Col>
//             <Col style={{ marginLeft: 8 }}>
//               <DatePicker
//                 value={endDate}
//                 onChange={handleEndChange}
//                 format="MMMM D, YYYY"
//                 className="form-control"
//                 placeholder="End Date"
//               />
//             </Col>
//             <Col style={{ marginLeft: 8 }}>
//               <Button type="primary" onClick={handleSearch}>
//                 Search
//               </Button>
//             </Col>
//           </Row>

//           <Table
//             columns={columns}
//             dataSource={data.map((item, index) => ({
//               key: index + 1,
//               name: item.name,
//               matchingScore: item.matchingScore,
//               uid: item.uid,
//               fromDate: item.fromDate,
//               toDate: item.toDate,
//               hitRecordData: item.hitRecordData,
//             }))}
//             size="small"
          
//             onRow={(record) => ({
//               onClick: () => handleRowClick(record as SearchDto),
//             })}
           
//           />

//           <Modal
//             title="Hit Records"
         
//             visible={visible}
//             onCancel={() => setVisible(false)}
//             centered
//             style={{ top: 20 }}
//             // width={750}
           
//             footer={[
//               <Button key="close" onClick={() => setVisible(false)}>
//                 Close
//               </Button>,
//             ]}
//           >
//             <Table
//               columns={hitRecordColumns}
//               dataSource={selectedRecord}
//               pagination={false}
//               size="small"
           
//             />
//           </Modal>
//         </Box>
//       </Box>
   
//   );
// };

// export default App;
