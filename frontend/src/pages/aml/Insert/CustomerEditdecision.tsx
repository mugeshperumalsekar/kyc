
// import React, { ReactNode, useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { CardContent } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';

// import {
//     TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Grid, FormControl, InputLabel, Select, MenuItem, Box, Snackbar
// } from '@mui/material';

// import { Typography } from '@mui/material';
// import CustomerApiService from '../../../data/services/aml/Reports/CustomerEdit/customeredit-api-service';
// import { CustomerEditData } from '../../../data/services/aml/Reports/CustomerEdit/customeredit-payload';
// import AdminUser from '../../Master/Adminuser/adminuser';
// import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
// import Header from '../../../layouts/header/header';


// interface CustomerPayload {
//     fromDate: string;
//     toDate: string;
//     targetCustomerName: string;
//     count: string;
//     username: string;
//     created_at: string;
//     ticketId: number;
//     complaintId: number;
//     uid: number;

// }

// interface All {
//     id: number;
//     complaintId: number;
//     username: string;
//     targetCustomerName: string;
//     sourceLink: string;
//     ticketId: number;
//     uid: string;
//     created_at: string;

// }

// function CustomerEdit() {
//     const { complaintId } = useParams<{ complaintId: string }>();
//     const [all, setAll] = useState<All[]>([]);
//     const [showTable, setShowTable] = useState(false);

//     useEffect(() => {
//         fetchAll();
//     }, []);

//     const fetchAll = async () => {
//         try {
//             const response = await customerApiService.getAll();
//             setAll(response);
//         } catch (error) {
//             console.error("Error fetching the all datas:", error);
//         }
//     }

//     const calculateWeekRange = (date: Date): [Date, Date] => {
//         const currentDate = new Date(date);
//         const dayOfWeek = currentDate.getDay();
//         const startDate = new Date(currentDate);
//         startDate.setDate(currentDate.getDate() - dayOfWeek);
//         const endDate = new Date(currentDate);
//         endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
//         return [startDate, endDate];
//     };


//     const [selectedOption, setSelectedOption] = useState<string>('daily');
//     const [currentDate, setCurrentDate] = useState<Date>(new Date());
//     const [startDate, setStartDate] = useState<Date | null>(() => {
//         const storedStartDate = localStorage.getItem('startDate');
//         return storedStartDate ? new Date(storedStartDate) : null;
//     });
//     const [endDate, setEndDate] = useState<Date | null>(null);
//     const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
//     const customerApiService = new CustomerApiService();
//     const [searchPerformed, setSearchPerformed] = useState(false);
//     const [data, setData] = useState<CustomerPayload[]>([]);
//     // const [searchInput, setSearchInput] = useState('');
//     const [searchInput, setSearchInput] = useState<string>('');

//     const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
//     const [selectedadminuser, setSelectedadminuser] = useState('');
//     const [startDateError, setStartDateError] = useState<string | null>(null);
//     const [endDateError, setEndDateError] = useState<string | null>(null);


//     useEffect(() => {
//         // Retrieve search input from browser storage on component mount
//         const savedSearchInput = localStorage.getItem('searchInput');
//         if (savedSearchInput) {
//             setSearchInput(savedSearchInput);
//         }
//     }, []);
//     const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedOption(event.target.value);
//         setCurrentDate(new Date());
//         setStartDate(new Date());
//         setEndDate(new Date());
//     };

//     const formatDate = (date: Date): string => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     function convert(str: string | number | Date) {
//         const date = new Date(str);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     }



//     const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const inputValue = event.target.value.trim();
//         const searchLower = inputValue.toLowerCase();
//         const filteredData: CustomerPayload[] = all.filter(item =>
//             (item.username && item.username.toLowerCase().includes(searchLower)) ||
//             (item.targetCustomerName && item.targetCustomerName.toLowerCase().includes(searchLower))
//         ).map((item: All) => ({
//             fromDate: '',
//             toDate: '',
//             targetCustomerName: '',
//             count: '',
//             username: item.username,
//             created_at: item.created_at,
//             complaintId: item.complaintId,
//             ticketId: item.ticketId,
//             uid: parseInt(item.uid),

//         }));
//         setData(filteredData);
//         setSearchInput(inputValue);
//     };




//     const handleNameInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//         if (event.key === 'Enter') {
//             handleAllButtonClick();
//         }
//     };

//     const handleSearch = () => {
//         if (!startDate) {
//             setStartDateError('Please select a start date.');
//         } else {
//             setStartDateError(null);
//         }
//         if (!endDate) {
//             setEndDateError('Please select an end date.');
//         } else {
//             setEndDateError(null);
//         }
//         if (!startDate || !endDate) {
//             console.error('Start date or end date is null.');
//             return;
//         }
//         const formattedStartDate = convert(startDate);
//         const formattedEndDate = convert(endDate);
//         const startDateAsDate = new Date(formattedStartDate);
//         const endDateAsDate = new Date(formattedEndDate);

//         customerApiService
//             .getCustomDate(startDateAsDate, endDateAsDate)
//             .then((fetchedData: CustomerEditData[]) => {
//                 setSearchPerformed(true);
//                 const transformedData: CustomerPayload[] = fetchedData.map((entry) => {
//                     return {
//                         fromDate: entry.frmDate,
//                         toDate: entry.toDate,
//                         targetCustomerName: entry.targetCustomerName,
//                         count: entry.count,
//                         username: entry.username,
//                         created_at: entry.created_at,
//                         ticketId: parseInt(entry.ticketId),
//                         complaintId: entry.complaintId,
//                         uid: entry.uid,
//                     };
//                 });


//                 const hiddencomplaintIdsString = localStorage.getItem('hiddencomplaintIds');
//                 const hiddencomplaintIds = hiddencomplaintIdsString ? JSON.parse(hiddencomplaintIdsString) : [];
//                 const filteredData = transformedData.filter(
//                     (item) =>
//                         !hiddencomplaintIds.includes(item.complaintId.toString()) &&
//                         ((item.username?.toLowerCase().includes(searchInput.toLowerCase()) ?? false) ||
//                             (item.targetCustomerName?.toLowerCase().includes(searchInput.toLowerCase()) ?? false)) &&

//                         (selectedadminuser === '' || (item.username?.toLowerCase() === selectedadminuser.toLowerCase()))
//                 );


//                 setData(filteredData);
                
//                 // localStorage.setItem('customerData', JSON.stringify(filteredData));
//                 // localStorage.setItem('searchInput', JSON.stringify(searchInput));

//             })
//             .catch((error) => {
//                 console.error('API request error:', error);
//             });
//     };

//     const clearStartDateError = () => {
//         setStartDateError(null);
//     };

//     const clearEndDateError = () => {
//         setEndDateError(null);
//     };

//     const handleStartDateChange = (date: Date | null) => {
//         setStartDate(date);
//         setEndDate(null);
//         clearStartDateError();
//     };

//     const isEndDateDisabled = (date: Date) => {
//         return startDate ? date >= startDate : false;
//     };


//     const getDisabledDates = (): [Date | null, Date | null] => {
//         const today = new Date();
//         let minDate: Date | null = new Date(today);
//         let maxDate: Date | null = new Date(today);

//         return [minDate, maxDate];
//     };

//     const disabledDates = getDisabledDates();
//     const navigate = useNavigate();

//     const handleTableRowClick = (uid: string, complaintId: string) => {
//         navigate(`/Amldecision/${complaintId}/${uid}`);
//     };

//     useEffect(() => {
//         const hiddencomplaintIdsString = localStorage.getItem('hiddencomplaintIds');
//         const hiddencomplaintIds = hiddencomplaintIdsString ? JSON.parse(hiddencomplaintIdsString) : [];
//         const storedData = localStorage.getItem('customerData');
//         if (storedData) {
//             const transformedData = JSON.parse(storedData) as CustomerPayload[];
//             const filteredData = transformedData.filter(
//                 (item) =>
//                     item.complaintId.toString() !== complaintId &&
//                     !hiddencomplaintIds.includes(item.complaintId.toString())
//             );
//             setData(filteredData);
//         }
//     }, [complaintId]);

//     useEffect(() => {
//         fetchAdminusers();

//     }, []);
//     const authService = new AuthAdminApiService();
//     const fetchAdminusers = async () => {
//         try {
//             let adminusers: AdminUser[] = await authService.getadminuser();
//             adminusers = adminusers.map((adminuser: AdminUser) => ({
//                 ...adminuser,
//             }));
//             setAdminusers(adminusers);
//         } catch (error) {
//             console.error("Error fetching admin users:", error);
//         }
//     };

//     const handleAllButtonClick = async () => {
//         try {
//             console.log("Fetching all data...");
//             let response = await customerApiService.getAll();
//             console.log("Response from API:", response);

//             // Filter data locally based on search input
//             let filteredData = response;



//             // Update state variables
//             setAll(filteredData);
//             setSearchPerformed(true);
//             setData(filteredData); // Update the data state with filtered data
//             setSelectedadminuser('');

//             console.log("State updated successfully:", { all, searchPerformed, data, selectedadminuser, searchInput });

//             // Save search input to browser storage
//             // localStorage.setItem('searchInput', searchInput);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         handleAllButtonClick();
//     }, []);




//     return (

//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                     <Box m={2}>
//                         <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "5px" }}>
//                             <Box m={4}>
//                                 <div className="d-flex justify-content-center">
//                                     <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
//                                         <div className="card-body">

//                                             <div className="nav gap-2 p-3 small shadow-sm">

//                                                 <Grid container spacing={3} >

//                                                     <Button type="button" onClick={handleAllButtonClick} style={{ width: '64px', height: '43px', marginTop: '36px' }}>
//                                                         All
//                                                     </Button>

//                                                     <Grid item xs={12} sm={2}>
//                                                         <br></br>
//                                                         <DatePicker
//                                                             selected={startDate}
//                                                             // onChange={handleStartChange}
//                                                             onChange={handleStartDateChange}
//                                                             // onChange={(date) => { setStartDate(date); clearStartDateError(); }}
//                                                             dateFormat="MMMM d, yyyy"
//                                                             className="form-control"
//                                                             disabledKeyboardNavigation
//                                                             minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
//                                                             maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
//                                                             highlightDates={highlightedWeek}
//                                                             placeholderText='Start Date'
//                                                         />
//                                                         {startDateError && <span style={{ color: 'red' }}>{startDateError}</span>}
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={2}>
//                                                         <br></br>
//                                                         <DatePicker
//                                                             selected={endDate}
//                                                             // onChange={handleEndChange}
//                                                             onChange={(date) => { setEndDate(date); clearEndDateError(); }}
//                                                             dateFormat="MMMM d, yyyy"
//                                                             className="form-control"
//                                                             disabledKeyboardNavigation
//                                                             minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
//                                                             maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
//                                                             highlightDates={highlightedWeek}
//                                                             placeholderText='End Date'
//                                                             filterDate={isEndDateDisabled}
//                                                         />
//                                                         {endDateError && <span style={{ color: 'red' }}>{endDateError}</span>}
//                                                     </Grid>


//                                                     <Grid item xs={12} sm={2}>
//                                                         <br></br>

//                                                         <Button type="button" onClick={handleSearch}>
//                                                             Apply Dates
//                                                         </Button>

//                                                     </Grid>
//                                                     <Grid item xs={12} sm={2}>
//                                                         {/* <InputLabel htmlFor="adminuser">User Name:</InputLabel> */}
//                                                         <br></br>
//                                                         <FormControl fullWidth variant="outlined" >
//                                                             <InputLabel htmlFor="adminuser">User Name</InputLabel>
//                                                             <Select
//                                                                 label="adminuser"
//                                                                 value={selectedadminuser}
//                                                                 onChange={(e) => {
//                                                                     setSelectedadminuser(e.target.value as string);

//                                                                 }}
//                                                                 name="adminuser"
//                                                                 variant="outlined"
//                                                                 size="small"
//                                                                 required
//                                                             >
//                                                                 <MenuItem value="">Select User</MenuItem>
//                                                                 {adminusers.map((adminuser) => (
//                                                                     <MenuItem key={adminuser.id} value={adminuser.userName}>
//                                                                         {adminuser.userName}
//                                                                     </MenuItem>
//                                                                 ))}
//                                                             </Select>

//                                                         </FormControl>


//                                                     </Grid>
//                                                     <Grid item xs={12} sm={2}>
//                                                         <br></br>

//                                                         <TextField
//                                                             type="text"
//                                                             value={searchInput}
//                                                             autoComplete="off"
//                                                             label="Search Name"
//                                                             size="small"
//                                                             onChange={handleSearchInputChange}
//                                                             onKeyPress={handleNameInputKeyPress}
//                                                         />
//                                                     </Grid>


//                                                 </Grid>
//                                             </div>

//                                             <div className="current-date"></div>
//                                             <div className="table-container" style={{ overflow: 'auto', maxHeight: '480px' }}>
//                                                 {data.length === 0 && searchPerformed && (
//                                                     <Typography variant="body1">No data available</Typography>
//                                                 )}
//                                                 {data.length > 0 && (
//                                                     <Table size="small" className="table report-table" style={{ width: '100%' }}>
//                                                         <TableHead>
//                                                             <TableRow>
//                                                                 <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Sl no</TableCell>
//                                                                 <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>User Name</TableCell>
//                                                                 <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Date of Entry</TableCell>
//                                                                 <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}> Name</TableCell>
//                                                                 <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}> Ticket Id</TableCell>

//                                                             </TableRow>
//                                                         </TableHead>
//                                                         <TableBody>
//                                                             {data
//                                                                 .filter(item => selectedadminuser === '' || item.username.toLowerCase() === selectedadminuser.toLowerCase())
//                                                                 .map((item: CustomerPayload, index: number) => (
//                                                                     <TableRow key={index}>
//                                                                         <TableCell>{index + 1}</TableCell>
//                                                                         <TableCell
//                                                                             onClick={() =>
//                                                                                 handleTableRowClick(
//                                                                                     String(item.uid),
//                                                                                     String(item.complaintId)
//                                                                                 )
//                                                                             }
//                                                                             style={{ cursor: 'pointer' }}
//                                                                         >
//                                                                             {item.username}
//                                                                         </TableCell>
//                                                                         <TableCell
//                                                                             onClick={() =>
//                                                                                 handleTableRowClick(
//                                                                                     String(item.uid),
//                                                                                     String(item.complaintId)
//                                                                                 )
//                                                                             }
//                                                                             style={{ cursor: 'pointer' }}
//                                                                         >
//                                                                             {formatDate(new Date(item.created_at))}
//                                                                         </TableCell>
//                                                                         <TableCell>{item.targetCustomerName}</TableCell>
//                                                                         <TableCell>{item.ticketId}</TableCell>

//                                                                     </TableRow>
//                                                                 ))}
//                                                         </TableBody>
//                                                     </Table>
//                                                 )}
//                                             </div>




//                                         </div>
//                                     </div>

//                                 </div>
//                             </Box>
//                         </Container>
//                     </Box>
//                 </Box>
//             </Box>
//         </>
//     );
// }

// export default CustomerEdit;

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerApiService from '../../../data/services/aml/Reports/CustomerEdit/customeredit-api-service';
import Header from '../../../layouts/header/header';
import { useSelector } from 'react-redux';

interface All {
    id: number;
    // complaintId: number;
    clientId: string;
    targetCustomerName: string;
    branchName: string;
    ticketId: number;
    uid: string;
    created_at: string;
    ticketStatus:string;
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
            const response = await customerApiService.getAlldecision();
            setAll(response);
        } catch (error) {
            console.error("Error fetching the data:", error);
        }
    };

    const handleTableRowClick = ( ticketId: number) => {
        const uid = loginDetails.id;
        navigate(`/Amldecision/${ticketId}/${uid}`);
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
