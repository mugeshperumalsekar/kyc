// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, TextField, Grid, Box, Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Typography, FormControlLabel, Checkbox, Button } from '@mui/material';
// import Header from '../../../layouts/header/header';
// import { useSelector } from 'react-redux';
// import SearchApiService from '../../../data/services/san_search/search-api-service';
// import { SelectChangeEvent } from '@mui/material';
// import { Snackbar, Alert } from '@mui/material';

// interface BulkData {
//     id: number;
//     name: string;
//     createdAt: string;
//     matching_score: number;
//     listId: number;
//     typeId: number;
//     stateId: number;
//     countryId: number;
//     identity: number;
//     levelId: number;
//     uid: number;
//     kycId: number;
// };

// interface User {
//     id: number;
//     userName: string;
// };

// const SanTaskAssign = () => {

//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const uid = loginDetails?.id || '';
//     const username = loginDetails?.username || '';
//     const searchApi = new SearchApiService();
//     const [bulkdata, setBulkData] = useState<BulkData[]>([]);
//     const [user, setUser] = useState<User[]>([]);
//     const [selectedUser, setSelectedUser] = useState<string>('');
//     const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
//     const [selectAllChecked, setSelectAllChecked] = useState(false);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

//     useEffect(() => {
//         fetchSanBulkData();
//         fetchSanUser();
//     }, []);

//     useEffect(() => {
//         setSelectAllChecked(selectedRows.size === bulkdata.length && bulkdata.length > 0);
//     }, [selectedRows, bulkdata]);

//     const fetchSanBulkData = async () => {
//         try {
//             const bulkdata = await searchApi.getSearch();
//             setBulkData(bulkdata);
//         } catch (error) {
//             console.error("Error fetching the sanBulkData:", error);
//         }
//     };

//     const fetchSanUser = async () => {
//         try {
//             const users = await searchApi.getSanUser();
//             setUser(users);
//         } catch (error) {
//             console.error("Error fetching the fetchSanUser:", error);
//         }
//     };

//     const handleUserChange = (event: SelectChangeEvent<string>) => {
//         setSelectedUser(event.target.value as string);
//     };

//     const handleRowCheckboxChange = (id: number) => {
//         const newSelectedRows = new Set(selectedRows);
//         if (newSelectedRows.has(id)) {
//             newSelectedRows.delete(id);
//         } else {
//             newSelectedRows.add(id);
//         }
//         setSelectedRows(newSelectedRows);
//     };

//     const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.checked) {
//             const allIds = new Set(bulkdata.map(item => item.id));
//             setSelectedRows(allIds);
//         } else {
//             setSelectedRows(new Set());
//         }
//         setSelectAllChecked(event.target.checked);
//     };

//     const handleSubmit = async () => {
//         if (selectedUser === '') {
//             setSnackbarMessage('Please select a user to assign the task!');
//             setSnackbarSeverity('error');
//             setOpenSnackbar(true);
//             return;
//         }
//         const selectedItems = bulkdata.filter((item) => selectedRows.has(item.id));
//         if (selectedItems.length === 0) {
//             setSnackbarMessage('Please select at least one task!');
//             setSnackbarSeverity('error');
//             setOpenSnackbar(true);
//             return;
//         }
//         try {
//             for (const item of selectedItems) {
//                 const payload = {
//                     assignTo: parseInt(selectedUser),
//                     assignBy: uid,
//                     searchName: item.name,
//                     searchId: item.id,
//                     euid: 1,
//                     uid: uid
//                 };
//                 await searchApi.CreateSanBulkTask(payload);
//             }
//             setSnackbarMessage('Tasks assigned successfully!');
//             setSnackbarSeverity('success');
//             setOpenSnackbar(true);
//         } catch (error) {
//             console.error('Error in creating bulk tasks:', error);
//             setSnackbarMessage('Error in assigning tasks.');
//             setSnackbarSeverity('error');
//             setOpenSnackbar(true);
//         }
//     };

//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 10 }}>
//                     <div style={{ padding: '20px' }}>
//                         <Card style={{ marginTop: '1%', padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <CardContent>
//                                 <Box component="form" noValidate autoComplete="off">
//                                     <Grid container spacing={1} item xs={12}>
//                                         <Grid item xs={3}>
//                                             <FormControl fullWidth variant="outlined">
//                                                 <InputLabel>Assign By</InputLabel>
//                                                 <Select
//                                                     label="Assign By"
//                                                     value={username}
//                                                     size="small"
//                                                     fullWidth
//                                                 >
//                                                     <MenuItem value={username}>{username}</MenuItem>
//                                                 </Select>
//                                             </FormControl>
//                                         </Grid>
//                                         <Grid item xs={3}>
//                                             <FormControl fullWidth variant="outlined">
//                                                 <InputLabel>Assign User</InputLabel>
//                                                 <Select
//                                                     label="Assign User"
//                                                     value={selectedUser}
//                                                     size="small"
//                                                     fullWidth
//                                                     onChange={handleUserChange}
//                                                 >
//                                                     {user.map((user) => (
//                                                         <MenuItem key={user.id} value={user.id}>
//                                                             {user.userName}
//                                                         </MenuItem>
//                                                     ))}
//                                                 </Select>
//                                             </FormControl>
//                                         </Grid>
//                                     </Grid>
//                                 </Box>
//                                 <TableContainer
//                                     component={Paper}
//                                     sx={{
//                                         mt: 4,
//                                         padding: '1px',
//                                         boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                                         maxHeight: 500,
//                                         overflowY: 'auto',
//                                         borderRadius: '8px',
//                                     }}
//                                 >
//                                     <Table size="small" stickyHeader>
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell
//                                                     sx={{
//                                                         position: 'sticky',
//                                                         top: 0,
//                                                         backgroundColor: 'white',
//                                                         zIndex: 1,
//                                                         borderBottom: '1px solid #ddd',
//                                                         padding: '4px',
//                                                         fontSize: '0.875rem',
//                                                         fontWeight: 'bold',
//                                                     }}
//                                                 >
//                                                     <FormControlLabel
//                                                         control={
//                                                             <Checkbox
//                                                                 checked={selectAllChecked}
//                                                                 onChange={handleSelectAllChange}
//                                                             />
//                                                         }
//                                                         label={
//                                                             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                                                                 S.No
//                                                             </Typography>
//                                                         }
//                                                         style={{ margin: 0 }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell
//                                                     sx={{
//                                                         position: 'sticky',
//                                                         top: 0,
//                                                         backgroundColor: 'white',
//                                                         zIndex: 1,
//                                                         borderBottom: '1px solid #ddd',
//                                                         padding: '4px',
//                                                         fontSize: '0.875rem',
//                                                         fontWeight: 'bold',
//                                                     }}
//                                                 >
//                                                     Set Name
//                                                 </TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {bulkdata.map((item, index) => (
//                                                 <TableRow
//                                                     key={item.id}
//                                                     sx={{
//                                                         '&:nth-of-type(odd)': {
//                                                             backgroundColor: '#f9f9f9',
//                                                         },
//                                                         '&:nth-of-type(even)': {
//                                                             backgroundColor: 'white',
//                                                         },
//                                                         '&:hover': {
//                                                             backgroundColor: '#f1f1f1',
//                                                         },
//                                                         height: '40px',
//                                                     }}
//                                                 >
//                                                     <TableCell
//                                                         sx={{
//                                                             padding: '4px',
//                                                             fontSize: '0.875rem',
//                                                         }}
//                                                     >
//                                                         <Checkbox
//                                                             checked={selectedRows.has(item.id)}
//                                                             onChange={() => handleRowCheckboxChange(item.id)}
//                                                         />
//                                                         {index + 1}
//                                                     </TableCell>
//                                                     <TableCell
//                                                         sx={{
//                                                             padding: '4px',
//                                                             fontSize: '0.875rem',
//                                                         }}
//                                                     >
//                                                         {item.name}
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                                 <div className="d-grid gap-1 d-md-flex justify-content-md-end">
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         style={{ margin: '3%' }}
//                                         onClick={handleSubmit}
//                                     >
//                                         Save
//                                     </Button>
//                                 </div>
//                                 <Snackbar
//                                     open={openSnackbar}
//                                     autoHideDuration={6000}
//                                     onClose={() => setOpenSnackbar(false)}
//                                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//                                 >
//                                     <Alert
//                                         onClose={() => setOpenSnackbar(false)}
//                                         severity={snackbarSeverity}
//                                         sx={{ width: '100%' }}
//                                     >
//                                         {snackbarMessage}
//                                     </Alert>
//                                 </Snackbar>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </Box>
//             </Box>
//         </>
//     );
// };

// export default SanTaskAssign;

import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

interface CustomCheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    labelStyle?: React.CSSProperties;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label, labelStyle }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                />
            }
            label={
                <Typography variant="body2" style={labelStyle}>
                    {label}
                </Typography>
            }
            style={{ margin: 0 }}
        />
    );
};

export default CustomCheckbox;