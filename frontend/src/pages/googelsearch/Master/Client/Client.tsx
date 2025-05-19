import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Button, Typography, Alert, Container, Card } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// import GroupApiService from '../../../data/services/master/Group/group-api-service';
// import CategoryApiService from '../../../data/services/master/Category/category-api-service';
// import AdminApiService from '../../../data/services/master/Admin/admin-api-service';
// import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
// import ClientApiService from '../../../data/services/master/Client/Client-api-service';
// import AppLayout from '../../../components/Layout';
import { Form } from 'react-bootstrap';
import AppLayout from '../../../../components/Layout';
import GroupApiService from '../../../../data/services/google-search/master/Group/group-api-service';
import CategoryApiService from '../../../../data/services/google-search/master/Category/category-api-service';
import AuthAdminApiService from '../../../../data/services/google-search/authadminuser/authu-admin-api-service';
import AdminApiService from '../../../../data/services/google-search/master/Admin/admin-api-service';
import ClientApiService from '../../../../data/services/google-search/master/Client/Client-api-service';

interface GroupPayload {
    id: number;
    name: string;
}

interface AuthAdminPayload {
    id: number;
    userName: string;
}

interface CategoryPayload {
    id: number;
    groupId: number;
    name: string;
}

interface AdminPayload {
    id: number;
    groupId: number;
    categoryId: number;
    clientId: number;
}

interface ClientPayload {
    id: number;
    groupId: number;
    categoryId: number;
    clientId: number;
    userId: number;
}
interface AdminInputRefType extends HTMLSelectElement { }

interface ValidationMessageRefType extends HTMLParagraphElement { }

const Client = () => {
    const [groups, setGroups] = useState<GroupPayload[]>([]);
    const [clients, setClients] = useState<AuthAdminPayload[]>([]);
    const [userNames, setUserNames] = useState<AuthAdminPayload[]>([]);
    const [categories, setCategories] = useState<CategoryPayload[]>([]);
    const [adminData, setAdminData] = useState<{ [groupId: number]: { groupName: string, categories: CategoryPayload[] } }>({});
    const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
    const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
    const [selectedClient, setSelectedClient] = useState<number | ''>('');

    const groupService = new GroupApiService();
    const categoryService = new CategoryApiService();
    const authService = new AuthAdminApiService();
    const adminService = new AdminApiService();
    const clientService = new ClientApiService();
    const [adminUserValidationError, setAdminUserValidationError] = useState<string | null>(null);
    const validationMessageRef = useRef<ValidationMessageRefType>(null);
    const adminInputRef = useRef<AdminInputRefType>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsData, categoriesData, clientsData, userNamesData] = await Promise.all([
                    groupService.getGroupOptions(),
                    categoryService.getCategories(),
                    authService.getadminuser(),
                    authService.getUserName()
                ]);

                setGroups(groupsData || []);
                setCategories(categoriesData || []);
                setClients(clientsData || []);
                setUserNames(userNamesData || []);
                if (clientsData.length > 0) {
                    setSelectedClient(clientsData[0].id);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedClient !== '') {
            fetchAdminData(Number(selectedClient));
        }
    }, [selectedClient]);

    useEffect(() => {
        const savedCheckboxStatus = localStorage.getItem('checkboxStatus');
        if (savedCheckboxStatus) {
            setCheckboxStatus(JSON.parse(savedCheckboxStatus));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('checkboxStatus', JSON.stringify(checkboxStatus));
    }, [checkboxStatus]);

    const fetchAdminData = async (clientId: number) => {
        try {
            const response = await adminService.getClientsAdmin();
            const groupedData = response.reduce((acc: { [groupId: number]: { groupName: string, categories: CategoryPayload[] } }, admin: AdminPayload) => {
                const group = groups.find(g => g.id === admin.groupId);
                if (group) {
                    if (!acc[admin.groupId]) {
                        acc[admin.groupId] = { groupName: group.name, categories: [] };
                    }
                    const category = categories.find(c => c.id === admin.categoryId);
                    if (category) {
                        acc[admin.groupId].categories.push(category);
                        const key = `${admin.groupId}-${admin.categoryId}-${clientId}`;
                        setCheckboxStatus(prev => ({
                            ...prev,
                            [key]: prev[key] !== undefined ? prev[key] : false,
                        }));
                    }
                }
                return acc;
            }, {});
            setAdminData(groupedData);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    const handleClientChange = (event: SelectChangeEvent<number | ''>) => {
        const value = event.target.value;
        setSelectedClient(value === '' ? '' : Number(value));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, groupId: number, categoryId: number, clientId: number) => {
        const key = `${groupId}-${categoryId}-${clientId}`;
        const newStatus = e.target.checked;

        setCheckboxStatus(prev => ({
            ...prev,
            [key]: newStatus,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!selectedClient) {
        //     setAdminUserValidationError("Please Select User and Give Permission.");
        //     if (adminInputRef.current) {
        //       adminInputRef.current.focus();
        //     }
        //     return;
        //   }



        try {
            if (selectedClient === '') {
                setAdminUserValidationError("Please Select User and Give Permission.");
                if (adminInputRef.current) {
                    adminInputRef.current.focus();
                }
                setErrorMessage("Please choose a client.");
                setIsErrorOpen(true);
                return;
            }

            const updatedAdminData: ClientPayload[] = Object.entries(checkboxStatus)
                .filter(([key, isChecked]) => isChecked)
                .map(([key]) => {
                    const [groupId, categoryId] = key.split('-').map(Number);
                    return { id: 0, groupId, categoryId, clientId: Number(selectedClient), userId: 1 };
                });

            if (updatedAdminData.length === 0) {
                setErrorMessage("No permissions selected. Please check at least one box.");
                setIsErrorOpen(true);
                return;
            }
            await Promise.all(updatedAdminData.map(payload => clientService.createClient(payload)));
            setAdminUserValidationError(null);
            setIsSuccessOpen(true);
        } catch (error) {
            console.error("Error saving admin:", error);
            setErrorMessage('Save failed. Please try again.');
            setIsErrorOpen(true);
        }
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };


    return (
        <>
            <AppLayout>

                <Card style={{ padding: '20px', borderRadius: '8px', fontFamily: 'Bookman Old Style', fontSize: '12px', zIndex: 0, height: '85vh' }}>
                    {/* <Card style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}> */}
                    <Typography variant="h6" gutterBottom>
                        Client Access
                    </Typography>
                    <Box mb={4}>
                        <FormControl style={{ width: '300px' }} variant="outlined" margin="dense">
                            <InputLabel htmlFor="client">Client</InputLabel>
                            <Select
                                label="Client"
                                value={selectedClient}
                                onChange={handleClientChange}
                                variant="outlined"
                                size="small"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                            width: 300,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="">Select Client</MenuItem>
                                {userNames.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.userName}
                                    </MenuItem>
                                ))}
                                {adminUserValidationError && (
                                    <Form.Text ref={validationMessageRef} className="text-danger">{adminUserValidationError}</Form.Text>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                    <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>S.No</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>Group</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>Category</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white', width: '10%' }}>Permissions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(adminData).length > 0 ? (
                                    Object.entries(adminData).map(([groupId, groupData], index) => (
                                        <React.Fragment key={groupId}>
                                            {groupData.categories.map((category, subIndex) => (
                                                <TableRow key={`${groupId}-${category.id}`}>
                                                    {subIndex === 0 && (
                                                        <TableCell rowSpan={groupData.categories.length} style={{ borderRight: '1px solid #ddd' }}>
                                                            {index + 1}
                                                        </TableCell>
                                                    )}
                                                    {subIndex === 0 && (
                                                        <TableCell rowSpan={groupData.categories.length} style={{ borderRight: '1px solid #ddd' }}>
                                                            {groupData.groupName}
                                                        </TableCell>
                                                    )}
                                                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{category.name}</TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="checkbox"
                                                            checked={checkboxStatus[`${groupId}-${category.id}-${selectedClient}`] || false}
                                                            onChange={(e) => handleCheckboxChange(e, Number(groupId), category.id, Number(selectedClient))}
                                                            style={{ width: '20px', height: '20px' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No Data Available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box mt={4} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                    {/* </Card> */}
                </Card>

                <Snackbar open={isSuccessOpen} autoHideDuration={6000} onClose={() => setIsSuccessOpen(false)}>
                    <Alert onClose={() => setIsSuccessOpen(false)} severity="success">
                        Data saved successfully!
                    </Alert>
                </Snackbar>

                <Snackbar open={isErrorOpen} autoHideDuration={6000} onClose={() => setIsErrorOpen(false)}>
                    <Alert onClose={() => setIsErrorOpen(false)} severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </AppLayout>
        </>
    );
};

export default Client;
