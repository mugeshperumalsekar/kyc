// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Box, Snackbar } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';
// import { Card, Col, Container, Row } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
// import ViewService from '../../../data/services/aml/viewpage/view_api_service';
// import { Branch } from '../../../data/services/aml/viewpage/view_payload';
// import Header from '../../../layouts/header/header';

// interface AdminUser {
//     id: string;
//     userName: string;
// }

// interface Branchmapping {
//     id: number;
//     uid: number;
//     branchId: number;
//     userId: string;
//     entryDate: string;
// }

// const AdminUserrights = () => {
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
//     const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined);
//     const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // State to store selected user IDs
//     const [branches, setBranches] = useState<Branch[]>([]);
//     const [mapping, setBranchesmapping] = useState<Branchmapping[]>([]);
//     const view = new ViewService();
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
//     const [snackbarMessage, setSnackbarMessage] = useState('');

//     useEffect(() => {
//         fetchAdminusers();
//         fetchBranch();
//         fetchBranchesmapping();
//     }, []);

//     useEffect(() => {
//         // When selectedBranchId or mapping changes, filter mapping to get corresponding user IDs for selectedBranchId
//         if (selectedBranchId !== undefined && mapping.length > 0) {
//             const filteredUserIds = mapping
//                 .filter(mapping => mapping.branchId === selectedBranchId)
//                 .map(mapping => mapping.userId);
//             setSelectedUserIds(filteredUserIds);
//         }
//     }, [selectedBranchId, mapping]);

//     const handleSnackbarClose = () => {
//         setSnackbarOpen(false);
//     };

//     const fetchAdminusers = async () => {
//         try {
//             const adminusers: AdminUser[] = await view.getadminuser();
//             setAdminusers(adminusers);
//         } catch (error) {
//             console.error("Error fetching admin users:", error);
//         }
//     };

//     const fetchBranch = async () => {
//         try {
//             const branch = await view.getBranch();
//             setBranches(branch);
//         } catch (error) {
//             console.error("Error fetching branches:", error);
//         }
//     };

//     const fetchBranchesmapping = async () => {
//         try {
//             const mapping: Branchmapping[] = await view.getBranchmapping();
//             setBranchesmapping(mapping);
//         } catch (error) {
//             console.error("Error fetching branches mapping:", error);
//         }
//     };

//     const handleCheckboxChange = (userId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//         const isChecked = event.target.checked;
//         setSelectedUserIds(prevSelectedUserIds =>
//             isChecked
//                 ? [...prevSelectedUserIds, userId]
//                 : prevSelectedUserIds.filter(id => id !== userId)
//         );
//     };

//     const handleSave = async () => {
//         if (selectedUserIds.length === 0 || selectedBranchId === undefined) {
//             setSnackbarMessage('Please select a branch and at least one user.');
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//             return;
//         }

//         try {
//             const payload = selectedUserIds.map(userId => ({
//                 id: 0,
//                 uid: loginDetails.id,
//                 branchId: selectedBranchId,
//                 userId: userId,
//                 entryDate: new Date().toISOString()
//             }));
//             await view.saveBranchmappingRights(payload);
//             setSnackbarMessage('Permissions saved successfully.');
//             setSnackbarSeverity('success');
//             setSnackbarOpen(true);
//         } catch (error) {
//             console.error("Error saving branch mapping rights:", error);
//             setSnackbarMessage('Error saving permissions.');
//             setSnackbarSeverity('error');
//             setSnackbarOpen(true);
//         }
//     };

//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                     <Container style={{ marginTop: '5%' }}>
//                         <Box m={4}>
//                             <h3>Branch User Mapping</h3>
//                             <Card className="shadow p-3 mb-5 bg-white rounded">
//                                 <Box>
//                                     <div className="form-group">
//                                         <Row>
//                                             <Col xs={4}>
//                                                 <FormControl fullWidth variant="outlined" margin="dense">
//                                                     <InputLabel htmlFor="record-type">Branch Code</InputLabel>
//                                                     <Select
//                                                         label="Branch Code"
//                                                         value={selectedBranchId || ''}
//                                                         onChange={(e) => setSelectedBranchId(Number(e.target.value))}
//                                                         variant="outlined"
//                                                         type="text"
//                                                         size="small"
//                                                     >
//                                                         {branches.map(branch => (
//                                                             <MenuItem key={branch.id} value={branch.id}>
//                                                                 {branch.name}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                             </Col>
//                                         </Row>
//                                     </div>
//                                 </Box>
//                                 <TableContainer>
//                                     <Table>
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell style={{ borderBottom: '1px solid #ddd' }}>S.No</TableCell>
//                                                 <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}>User Name</TableCell>
//                                                 <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}>Permission</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {adminusers.map((user, index) => (
//                                                 <TableRow key={user.id}>
//                                                     <TableCell>{index + 1}</TableCell>
//                                                     <TableCell>{user.userName}</TableCell>
//                                                     <TableCell>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={selectedUserIds.includes(user.id)}
//                                                             onChange={handleCheckboxChange(user.id)}
//                                                             style={{ width: '20px', height: '20px' }}
//                                                         />
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                                 <div className="d-grid gap-1 d-md-flex justify-content-md-end" style={{ marginRight: '13%' }}>
//                                     <button type="button" className="btn btn-primary" style={{ margin: '3%' }} onClick={handleSave}>
//                                         Save
//                                     </button>
//                                 </div>
//                             </Card>
//                         </Box>
//                     </Container>
//                 </Box>
//                 <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//                     <MuiAlert
//                         elevation={6}
//                         variant="filled"
//                         severity={snackbarSeverity}
//                         onClose={handleSnackbarClose}
//                     >
                       

//                         {snackbarMessage}
//                     </MuiAlert>
//                 </Snackbar>
//             </Box>
//         </>
//     );
// };

// export default AdminUserrights;


import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import { Branch } from '../../../data/services/aml/viewpage/view_payload';
import Header from '../../../layouts/header/header';

interface AdminUser {
    id: string;
    userName: string;
};

interface Branchmapping {
    id: number;
    uid: number;
    branchId: number;
    userId: string;
    entryDate: string;
};

const AdminUserrights = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [mapping, setBranchesmapping] = useState<Branchmapping[]>([]);
    const view = new ViewService();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [checkedUserIds, setCheckedUserIds] = useState<string[]>([]);

    useEffect(() => {
        fetchAdminusers();
        fetchBranch();
        fetchBranchesmapping();
    }, [selectedBranchId]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fetchAdminusers = async () => {
        try {
            const adminusers: AdminUser[] = await view.getadminuser();
            setAdminusers(adminusers);
        } catch (error) {
            console.error("Error fetching admin users:", error);
        }
    };

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranches(branch);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    const fetchBranchesmapping = async (selectedBranchId?: number): Promise<void> => {
        try {
            const mapping = await view.getBranchmapping();
            setBranchesmapping(mapping);
            if (selectedBranchId !== undefined) {
                const filteredMapping = mapping.filter((item: { branchId: number; }) => item.branchId === selectedBranchId);
                const uniqueUserIds: string[] = Array.from(new Set(filteredMapping.map((item: { userId: any; }) => item.userId)));
                setSelectedUserIds(uniqueUserIds);
                const updatedAdminUsers = adminusers.map(user => ({
                    ...user,
                    checked: uniqueUserIds.includes(user.id.toString())
                }));
                setAdminusers(updatedAdminUsers);
                const checkedUserIds = updatedAdminUsers.filter(user => user.checked).map(user => user.id);
                setCheckedUserIds(checkedUserIds);
            }
        } catch (error) {
            console.error("Error fetching branches mapping:", error);
        }
    };

    const handleCheckboxChange = (userId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedUserIds(prevSelectedUserIds =>
            isChecked
                ? [...prevSelectedUserIds, userId]
                : prevSelectedUserIds.filter(id => id !== userId)
        );
        setCheckedUserIds(prevCheckedUserIds =>
            isChecked
                ? [...prevCheckedUserIds, userId]
                : prevCheckedUserIds.filter(id => id !== userId)
        );
    };

    const handleSave = async () => {
        if (selectedUserIds.length === 0 || selectedBranchId === undefined) {
            setSnackbarMessage('Please select a branch and at least one user.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        try {
            const payload = selectedUserIds.map(userId => ({
                id: 0,
                uid: loginDetails.id,
                branchId: selectedBranchId,
                userId: userId,
                entryDate: new Date().toISOString()
            }));
            await view.saveBranchmappingRights(payload);
            setSnackbarMessage('Permissions saved successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            window.location.reload();
        } catch (error) {
            console.error("Error saving branch mapping rights:", error);
            setSnackbarMessage('Error saving permissions.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container style={{ marginTop: '5%' }}>
                        <Box m={4}>
                            <h3>Branch User Mapping</h3>
                            <Card className="shadow p-3 mb-5 bg-white rounded">
                                <Box>
                                    <div className="form-group">
                                        <Row>
                                            <Col xs={4}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel htmlFor="record-type">Branch Code</InputLabel>
                                                    <Select
                                                        label="Branch Code"
                                                        value={selectedBranchId || ''}
                                                        onChange={async (e) => {
                                                            const selectedValue = Number(e.target.value);
                                                            console.log('Selected Branch ID:', selectedValue);
                                                            setSelectedBranchId(selectedValue);
                                                            try {
                                                                await fetchBranchesmapping(selectedValue);
                                                                const updatedAdminUsers = adminusers.map(user => ({
                                                                    ...user,
                                                                    checked: selectedUserIds.includes(user.id)
                                                                }));
                                                                setAdminusers(updatedAdminUsers);
                                                            } catch (error) {
                                                                console.error("Error fetching branches mapping:", error);
                                                            }
                                                        }}
                                                        variant="outlined"
                                                        type="text"
                                                        size="small"
                                                    >
                                                        {branches.map(branch => (
                                                            <MenuItem key={branch.id} value={branch.id}>
                                                                {branch.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                        </Row>
                                    </div>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ borderBottom: '1px solid #ddd' }}>S.No</TableCell>
                                                <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}>User Name</TableCell>
                                                <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}>Permission</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {adminusers.map((user, index) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{user.userName}</TableCell>
                                                    {/* <TableCell>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUserIds.includes(user.id)}
                                                            onChange={handleCheckboxChange(user.id)}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    </TableCell> */}
                                                    <TableCell>
                                                        <input
                                                            type="checkbox"
                                                            checked={checkedUserIds.includes(user.id)}
                                                            onChange={handleCheckboxChange(user.id)}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <div className="d-grid gap-1 d-md-flex justify-content-md-end" style={{ marginRight: '13%' }}>
                                    <button type="button" className="btn btn-primary" style={{ margin: '3%' }} onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            </Card>
                        </Box>
                    </Container>
                </Box>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        severity={snackbarSeverity}
                        onClose={handleSnackbarClose}
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </>
    );
};

export default AdminUserrights;
