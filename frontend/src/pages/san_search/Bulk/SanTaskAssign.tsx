
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Box, Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Typography, Button } from '@mui/material';
import Header from '../../../layouts/header/header';
import { useSelector } from 'react-redux';
import SearchApiService from '../../../data/services/san_search/search-api-service';
import { SelectChangeEvent } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import CustomCheckbox from './CustomCheckbox';
import { SanBulkPayload } from '../../../data/services/san_search/search-payload';

interface BulkData {
    id: number;
    name: string;
    created_at: string;
    matching_score: number;
    listId: number;
    typeId: number;
    stateId: number;
    countryId: number;
    identity: number;
    levelId: number;
    uid: number;
    kycId: number;
    isBulkSearch: number;
    isTaskAssigned: number
};
interface AssignedData {
    id: number;
    assignTo: number;
    assignBy: number;
    searchName: string;
    searchId: number;
    isTaskAssigned: number;
    euid: number;
    uid: number;

};

interface BulkTaskAssign {
    id: number;
    searchId: number;
    display: number;
    criminalId: number;
    matchingScore: number;
    name: string;
    statusNowId: number;
    cycleId: number;
    uid: number;
    valid: Boolean;
};

interface User {
    id: number;
    userName: string;
};

const SanTaskAssign = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const uid = loginDetails?.id || '';
    const username = loginDetails?.username || '';
    const searchApi = new SearchApiService();
    const [bulkdata, setBulkData] = useState<BulkData[]>([]);
    const [assigneddata, setAssignedData] = useState<AssignedData[]>([]);
    const [detailedData, setDetailedData] = useState<BulkTaskAssign[]>([]);
    const [user, setUser] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [assignedRows, setAssignedRows] = useState<number[]>([]);
    useEffect(() => {
        fetchData();
        fetchSanBulkData();
        fetchSanUser();
        fetchAssignedData();
    }, []);

    useEffect(() => {
        setSelectAllChecked(selectedRows.size === bulkdata.length && bulkdata.length > 0);
    }, [selectedRows, bulkdata]);


    const [combinedData, setCombinedData] = useState<(BulkData & { isTaskAssigned: number })[]>([]);
        const fetchData = async () => {
            try {
                const sanDataResponse: BulkData[] = await searchApi.getSearch();
                console.log("Fetched sanDataResponse:", sanDataResponse);
        
                const assignedResponse: AssignedData[] = await searchApi.getAssignedData();
                console.log("Fetched assignedResponse:", assignedResponse);
        
                const assignedMap = new Map<number, AssignedData>();
                assignedResponse.forEach(item => {
                    if (!assignedMap.has(item.searchId)) {
                        assignedMap.set(item.searchId, item); 
                    }
                });
        
                const filteredSanData = sanDataResponse.filter(item => !assignedMap.has(item.id));
                const sanDataMap = new Map<number, BulkData>();
                sanDataResponse.forEach(item => {
                    if (!sanDataMap.has(item.id)) {
                        sanDataMap.set(item.id, item);
                    }
                });
        
                const filteredAssignedData = assignedResponse.filter(item => !sanDataMap.has(item.searchId));
                    const combined = [
                    ...filteredSanData.map(item => ({ ...item, isTaskAssigned: 0 })),
                    ...filteredAssignedData.map(item => ({
                        id: item.searchId,
                        name: item.searchName,
                        created_at: "",
                        matching_score: 0,
                        listId: 0,
                        typeId: 0,
                        stateId: 0,
                        countryId: 0,
                        identity: 0,
                        levelId: 0,
                        uid: item.uid,
                        kycId: 0,
                        isBulkSearch: 0,
                        isTaskAssigned: 1,
                    }))
                ];
        
                setCombinedData(combined);
                setAssignedRows(combined.filter(item => item.isTaskAssigned === 1).map(item => item.id));
                console.log("Combined Data:", combined);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        



    const fetchSanBulkData = async () => {
        try {
            const bulkdata = await searchApi.getSearch();
            console.log("sanBulkData", bulkdata)
            setBulkData(bulkdata);
        } catch (error) {
            console.error("Error fetching the sanBulkData:", error);
        }
    };
    const fetchAssignedData = async () => {
        try {
            const assigneddata = await searchApi.getAssignedData();
            console.log("assigneddata", assigneddata)
            setAssignedData(assigneddata);
        } catch (error) {
            console.error("Error fetching the TaskAssignedData:", error);
        }
    };

    const fetchSanUser = async () => {
        try {
            const users = await searchApi.getSanUser();
            setUser(users);
        } catch (error) {
            console.error("Error fetching the fetchSanUser:", error);
        }
    };

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        setSelectedUser(event.target.value as string);
    };

    const handleRowCheckboxChange = (id: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(id)) {
            newSelectedRows.delete(id);
        } else {
            newSelectedRows.add(id);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = new Set(bulkdata.map(item => item.id));
            setSelectedRows(allIds);
        } else {
            setSelectedRows(new Set());
        }
        setSelectAllChecked(event.target.checked);
    };

    const handleRowClick = async (searchId: number) => {
        try {
            if (expandedRowId === searchId) {
                setExpandedRowId(null);
            } else {
                const response = await searchApi.getSanBulkTaskAssign(searchId);
                setDetailedData(response.length > 0 ? response : []);
                setExpandedRowId(searchId);
            }
        } catch (error) {
            console.error('Error fetching detailed data:', error);
            setSnackbarMessage('Error fetching detailed data.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };


    const handleSubmit = async () => {
        if (selectedUser === '') {
            setSnackbarMessage('Please select a user to assign the task !');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        const selectedItems = bulkdata.filter((item) => selectedRows.has(item.id));
        if (selectedItems.length === 0) {
            setSnackbarMessage('Please select atleast one checkbox !');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
        try {
            for (const item of selectedItems) {
                const ofacDataList = selectedItems.map(item => ({
                    id: 0,
                    bulkAssignId: 0,
                    searchId: 0,
                    hitId: 0,
                    hitName: "",
                    hit: 0,
                    euid: 0,
                    uid: 0
                }));
                const payload: SanBulkPayload = {
                    assignTo: parseInt(selectedUser),
                    assignBy: uid,
                    searchName: item.name,
                    searchId: item.id,
                    matchingScore: item.matching_score,
                    euid: 1,
                    uid: uid,
                    ofacDataList
                };
                await searchApi.CreateSanBulkTask(payload);
            };
            setSnackbarMessage('Tasks assigned successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            window.location.reload();
        } catch (error) {
            console.error('Error in creating bulk tasks:', error);
            setSnackbarMessage('Error in assigning tasks.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace('Sept', 'Sep').replace(/ /g, '/');
    };


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

                        <Typography className='allHeading'>TASK ASSIGN</Typography>
                    </Box>

                    <Box component="form" noValidate autoComplete="off">
                        <Grid container spacing={1} item xs={12}>
                            <Grid item xs={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel className='allHeading'>Assign By</InputLabel>
                                    <Select
                                        label="Assign By"
                                        value={username}
                                        className='commonStyle'
                                        size="small"
                                        fullWidth
                                    >
                                        <MenuItem value={username}>{username}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel className='allHeading'>Assign User</InputLabel>
                                    <Select
                                        label="Assign User"
                                        value={selectedUser}
                                        className='commonStyle'
                                        size="small"
                                        fullWidth
                                        onChange={handleUserChange}
                                    >
                                        {user.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                <span>{user.userName}</span>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    <TableContainer
                        component={Paper}
                        sx={{
                            mt: 2,
                            padding: '1px',
                            boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                            // maxHeight: 500,
                            // overflowY: 'auto',
                            borderRadius: '8px',
                        }}
                    >
                        <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: 'lightgray',
                                                zIndex: 1,
                                                borderBottom: '1px solid #ddd',
                                                padding: '0px',

                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <CustomCheckbox
                                                checked={selectAllChecked}
                                                onChange={handleSelectAllChange}

                                                label="S.No"

                                                labelStyle={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: 'lightgray',
                                                zIndex: 1,
                                                borderBottom: '1px solid #ddd',
                                                padding: '0px',

                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <strong>Name</strong>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: 'lightgray',
                                                zIndex: 1,
                                                borderBottom: '1px solid #ddd',
                                                padding: '0px',

                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <strong>Matching Score</strong>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: 'lightgray',
                                                zIndex: 1,
                                                borderBottom: '1px solid #ddd',
                                                padding: '0px',

                                                fontWeight: 'bold',
                                            }}>
                                            <strong>Created At</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {combinedData.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <TableRow

                                                sx={{
                                                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                                    '&:nth-of-type(even)': { backgroundColor: 'white' },
                                                    '&:hover': { backgroundColor: '#f1f1f1' },
                                                    height: '40px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleRowClick(item.id)}
                                            >
                                                <TableCell sx={{ padding: '0px', }}>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <CustomCheckbox
                                                            checked={selectedRows.has(item.id)}
                                                            onChange={() => handleRowCheckboxChange(item.id)}
                                                            label={`${index + 1}`}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ padding: '0px', color: '#3F51B5', textDecoration: 'underline', }}>
                                                    <span> {item.name}</span>
                                                </TableCell>
                                                <TableCell sx={{ padding: '0px', }}>
                                                    <span> {item.matching_score}</span>
                                                </TableCell>
                                                <TableCell sx={{ padding: '0px', }}>
                                                    <span>{formatDate(item.created_at)}</span>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRowId === item.id && (
                                                <TableRow>
                                                    <TableCell colSpan={3}>
                                                        {detailedData.length > 0 ? (
                                                            <Box sx={{ width: '70%', margin: '0 auto' }}>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}><strong>Name</strong></TableCell>
                                                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'lightgray' }}><strong>MatchingScore</strong></TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {detailedData.map((detail) => (
                                                                            <TableRow key={detail.id}>
                                                                                <TableCell><span>{detail.name}</span></TableCell>
                                                                                <TableCell><span>{Math.round(detail.matchingScore)}</span></TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" align="center" sx={{ color: 'red' }}>Not Available</Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableContainer>
                    <br></br>
                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', }}>

                        <Button
                            variant="contained"
                            color="primary"

                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Box>

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setOpenSnackbar(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={() => setOpenSnackbar(false)}
                            severity={snackbarSeverity}
                            sx={{ width: '100%' }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>


                </Box>

            </Box>
        </>
    );
};

export default SanTaskAssign;