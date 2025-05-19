import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import {
    TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, FormControl, InputLabel, Select, MenuItem, Box, Snackbar
} from '@mui/material';
import { Container, Button } from 'react-bootstrap';
import CustomerApiService from '../../data/services/customerEdit/customeredit_api_service';
import { CustomerEditData } from '../../data/services/customerEdit/customeredit_payload';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../layouts/header/header';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Typography } from '@mui/material';
import AdminUser from '../Master/Adminuser/adminuser';
import AuthAdminApiService from '../../data/services/authadminuser/authu-admin-api-service';

interface CustomerPayload {
    recordTypeId: number;
    name: string;
    sourceLink: string;
    genderId: number;
    frmDate: string;
    toDate: string;
    created_at: string;
    userName: string;
    cmsId: number;
    uid: number;
}

interface All {
    id: number;
    recordTypeId: number;
    genderId: number;
    cmsId: number;
    userName: string;
    name: string;
    dob: string;
    panNum: string;
    sourceLink: string;
    uid: number;
    created_at: string;
}

function CustomerEdit() {

    const { cmsId } = useParams<{ cmsId: string }>();
    const [all, setAll] = useState<All[]>([]);

    const calculateWeekRange = (date: Date): [Date, Date] => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        return [startDate, endDate];
    };

    const customerEditService = new CustomerApiService();
    const [customers, setCustomers] = useState<CustomerEditData[]>([]);
    const customerApiService = new CustomerApiService();
    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date | null>(() => {
        const storedStartDate = localStorage.getItem('startDate');
        return storedStartDate ? new Date(storedStartDate) : null;
    });
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [data, setData] = useState<CustomerPayload[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
    const [selectedadminuser, setSelectedadminuser] = useState('');
    const [startDateError, setStartDateError] = useState<string | null>(null);
    const [endDateError, setEndDateError] = useState<string | null>(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const response = await customerApiService.getAll(); 
            setAll(response);
        } catch (error) {
            console.error("Error fetching all data:", error);
        }
    }

    const clearEndDateError = () => {
        setEndDateError(null);
    };

    useEffect(() => {
        fetchAdminusers();
    }, []);

    const authService = new AuthAdminApiService();

    const fetchAdminusers = async () => {
        try {
            let adminusers: AdminUser[] = await authService.getadminuser();
            adminusers = adminusers.map((adminuser: AdminUser) => ({
                ...adminuser,
            }));
            setAdminusers(adminusers);
        } catch (error) {
            console.error("Error fetching admin users:", error);
        }
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        setEndDate(null);
        clearStartDateError();
    };

    const isEndDateDisabled = (date: Date) => {
        return startDate ? date >= startDate : false;
    };

    function convert(str: string | number | Date) {
        const date = new Date(str);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleStartChange = (date: Date) => {
        let newStartDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newStartDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setCurrentDate(newStartDate);
        setStartDate(newStartDate);
    };

    const handleEndChange = (date: Date) => {
        let newEndDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newEndDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setEndDate(newEndDate);
    };

    const handleSearch = () => {
        if (!startDate) {
            setStartDateError('Please select a start date.');
            return;
        } else {
            setStartDateError(null);
        }
        if (!endDate) {
            setEndDateError('Please select an end date.');
            return;
        } else {
            setEndDateError(null);
        }
        const formattedStartDate = convert(startDate);
        const formattedEndDate = convert(endDate);
        const startDateAsDate = new Date(formattedStartDate);
        const endDateAsDate = new Date(formattedEndDate);
        customerApiService
            .getCustomDate(startDateAsDate, endDateAsDate)
            .then((fetchedData: CustomerEditData[]) => {
                setSearchPerformed(true);
                const transformedData: CustomerPayload[] = fetchedData.map((entry) => {
                    return {
                        fromDate: entry.frmDate,
                        toDate: entry.toDate,
                        name: entry.name,
                        userName: entry.userName,
                        created_at: entry.created_at,
                        recordTypeId: entry.recordTypeId,
                        genderId: entry.genderId,
                        sourceLink: entry.sourceLink,
                        cmsId: entry.cmsId,
                        uid: entry.uid,
                        frmDate: entry.frmDate,
                    };
                });
                setData(transformedData);
            })
            .catch((error) => {
                console.error('API request error:', error);
            });
    };

    useEffect(() => {
        const hiddenPepIdsString = localStorage.getItem('hiddenPepIds');
        const hiddenPepIds = hiddenPepIdsString ? JSON.parse(hiddenPepIdsString) : [];
        const storedData = localStorage.getItem('customerData');
        if (storedData) {
            const transformedData = JSON.parse(storedData) as CustomerPayload[];
            const filteredData = transformedData.filter(
                (item) =>
                    item.cmsId.toString() !== cmsId &&
                    !hiddenPepIds.includes(item.cmsId.toString())
            );
            setData(filteredData);
        }
    }, [cmsId]);

    const clearStartDateError = () => {
        setStartDateError(null);
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.toLowerCase();
        const filteredData: CustomerPayload[] = all.filter(item =>
            item.userName.toLowerCase().includes(inputValue) ||
            item.name.toLowerCase().includes(inputValue)
        ).map((item: All) => ({
            recordTypeId: item.recordTypeId,
            genderId: item.genderId,
            frmDate: '',
            toDate: '',
            userName: item.userName,
            name: item.name,
            created_at: item.created_at,
            sourceLink: item.sourceLink,
            cmsId: item.cmsId,
            uid: item.uid,
        }));
        setData(filteredData);
        setSearchInput(inputValue);
    };

    const handleNameInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAllButtonClick();
        }
    };

    const handleAllButtonClick = async () => {
        try {
            console.log("Fetching all data...");
            let response = await customerApiService.getAll();
            console.log("Respose:",response);
            let filteredData = response;
            setAll(filteredData);
            setSearchPerformed(true);
            setData(filteredData);
            setSelectedadminuser('');
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        handleAllButtonClick();
    }, []);

    const navigate = useNavigate();

    const handleTableRowClick = (uid: string, cmsId: string, recordTypeId: number) => {
        let route: string;
        switch (recordTypeId) {
            case 1:
                route = 'Entityview';
                break;
            case 2:
                route = 'Individualview';
                break;
            case 3:
                route = 'Shipview';
                break;
            case 4:
                route = 'Aircraftview';
                break;
            default:
                route = '';
        }
        navigate(`/View/${route}/${cmsId}/${uid}/${recordTypeId}`);
    };

    function getgenderrecoredtype(recordTypeId: number) {
        switch (recordTypeId) {
            case 1:
                return 'Entity';
            case 2:
                return 'Individual';
            case 3:
                return 'Ship';
            case 4:
                return 'Aircraft';
            default:
                return '';
        }
    }

    function getgenderName(genderId: number) {
        switch (genderId) {
            case 1:
                return 'Male';
            case 2:
                return 'Female';
            case 3:
                return 'Others';
        }
    };

    return (
        <>
         <Box sx={{display:'flex'}}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Box m={2}>
                <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "7px" }}>
                    <Box m={8}>
                        <div className="d-flex justify-content-center">
                            <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                                <div className="card-body">
                                    <div className="nav gap-2 p-3 small shadow-sm">
                                        <Grid container spacing={3} >
                                            <Button type="button" onClick={handleAllButtonClick} style={{ width: '64px', height: '43px', marginTop: '36px' }}>
                                                All
                                            </Button>
                                            <Grid item xs={12} sm={2}>
                                                <br />
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={handleStartDateChange}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="form-control"
                                                    disabledKeyboardNavigation
                                                    minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                    maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                    highlightDates={highlightedWeek}
                                                    placeholderText='Start Date'
                                                />
                                                {startDateError && <span style={{ color: 'red' }}>{startDateError}</span>}
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <br />
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date) => { setEndDate(date); clearEndDateError(); }}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="form-control"
                                                    disabledKeyboardNavigation
                                                    minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                    maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                    highlightDates={highlightedWeek}
                                                    placeholderText='End Date'
                                                    filterDate={isEndDateDisabled}
                                                />
                                                {endDateError && <span style={{ color: 'red' }}>{endDateError}</span>}
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <br />
                                                <Button type="button" onClick={handleSearch}>
                                                    Apply Dates
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <br />
                                                <FormControl fullWidth variant="outlined" >
                                                    <InputLabel htmlFor="adminuser">User Name</InputLabel>
                                                    <Select
                                                        label="adminuser"
                                                        value={selectedadminuser}
                                                        onChange={(e) => {
                                                            setSelectedadminuser(e.target.value as string);
                                                        }}
                                                        name="adminuser"
                                                        variant="outlined"
                                                        size="small"
                                                        required
                                                    >
                                                        <MenuItem value="">Select User</MenuItem>
                                                        {adminusers.map((adminuser) => (
                                                            <MenuItem key={adminuser.id} value={adminuser.userName}>
                                                                {adminuser.userName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <br />
                                                <TextField
                                                    type="text"
                                                    value={searchInput}
                                                    autoComplete="off"
                                                    label="Search name"
                                                    size="small"
                                                    onChange={handleSearchInputChange}
                                                    onKeyPress={handleNameInputKeyPress}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className="current-date"></div>
                                    <div className="table-container" style={{ overflow: 'auto', maxHeight: '480px' }}>
                                        {data.length === 0 && searchPerformed && (
                                            <Typography variant="body1">No data available</Typography>
                                        )}
                                        {data.length > 0 && (
                                            <Table size="small" className="table report-table" style={{ width: '100%' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Sl no</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>User Name</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Date of Entry</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Name</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>RecordType</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Gender</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.filter(item => selectedadminuser === '' || item.userName.toLowerCase() === selectedadminuser.toLowerCase())
                                                        .map((item: CustomerPayload, index: number) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell
                                                                    onClick={() =>
                                                                        handleTableRowClick(
                                                                            String(item.uid),
                                                                            String(item.cmsId),
                                                                            item.recordTypeId
                                                                        )
                                                                    }
                                                                >
                                                                    {item.userName}
                                                                </TableCell>
                                                                <TableCell>{format(new Date(item.created_at), 'MM/dd/yyyy')}</TableCell>
                                                                <TableCell>{item.name}</TableCell>
                                                                <TableCell>
                                                                    {item.recordTypeId ? getgenderrecoredtype(item.recordTypeId) : '-'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.genderId ? getgenderName(item.genderId) : '-'}
                                                                </TableCell>
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
            </Box>
        </>
    );
}

export default CustomerEdit;