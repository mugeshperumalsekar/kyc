import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Grid, Button, Box, Dialog, DialogTitle, DialogContent, Container, DialogActions, Snackbar, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import Header from '../../../layouts/header/header';
import { StatePayload } from '../../../data/services/master/State/state_payload';
import CountryApiService from '../../../data/services/master/Country/country_api_service';
import StateApiService from '../../../data/services/master/State/state_api_service';

interface State {
    id: string;
    countryId: string;
    stateName: string;
}

interface Country {
    id: string;
    name: string;
    text: string;
}

const State = () => {

    const [name, setName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editStateName, setEditStateName] = useState('');
    const [editStateId, setEditStateId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteStateId, setDeleteStateId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState('insert');
    const [serialNumber, setSerialNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const authService = new StateApiService();
    const countryService = new CountryApiService();

    useEffect(() => {
        fetchCountries();
        fetchStates();
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
        }
    }, []);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedCountry || !name) {
            showErrorMessage('Please fill out all fields.');
            return;
        }
        try {
            const payload: StatePayload = {
                stateName: name,
                countryId: selectedCountry
            };
            setName('');
            setSelectedCountry('');
            fetchStates();
            showSuccessMessage('State added successfully.');
        } catch (error) {
            console.error("Error adding state:", error);
        }
    };

    const handleSubmitClick = () => {
        handleSubmit();
    };

    const handleEditDialogSaveClick = () => {
        handleEditDialogSave();
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleKeyPressEdit = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            handleEditDialogSave();
        }
    };

    const fetchCountries = async () => {
        try {
            const Countries = await countryService.getCountryOptions();
            setCountries(Countries);
            setSerialNumber(page * rowsPerPage + 1);
        } catch (error) {
            console.error("Error fetching Country:", error);
        }
    };

    const fetchStates = async () => {
        try {
            const fetchedStates = await authService.getStateDataByCountryId();
            setStates(fetchedStates);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const handleEditClick = (id: string, name: string, countryId: string) => {
        setEditStateId(id);
        setEditStateName(name);
        setSelectedCountry(countryId);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditStateId('');
        setEditStateName('');
    };

    const handleEditDialogSave = async () => {
        try {
            const payload: StatePayload = {
                stateName: editStateName,
                countryId: selectedCountry,
            };
            await authService.updateState(Number(editStateId), payload);
            setOpenEditDialog(false);
            setEditStateId('');
            setEditStateName('');
            fetchStates();
            showSuccessMessage('State updated successfully.');
        } catch (error) {
            console.error("Error editing State:", error);
        }
    };

    const handleUnblock = (id: string) => {
        setSelectedRowId(id);
        setDialogAction('unblock');
        setDialogOpen(true);
    };

    const handleBlock = (id: string) => {
        setSelectedRowId(id);
        setDialogAction('block');
        setDialogOpen(true);
    };

    const handleConfirmDialog = async (confirmed: boolean) => {
        if (confirmed && selectedRowId !== null) {
            if (dialogAction === 'block') {
                await blockRow(selectedRowId);
            } else if (dialogAction === 'unblock') {
                await unblockRow(selectedRowId);
            }
        }
        setSelectedRowId(null);
        setDialogOpen(false);
        setDialogAction(null);
    };

    const blockRow = async (id: string) => {
        try {
            await authService.blockState(Number(id));
            setBlockedRows([...blockedRows, id]);
            localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
            showSuccessMessage('State blocked successfully.');
        } catch (error) {
            console.error("Error blocking State:", error);
        }
    };

    const unblockRow = async (id: string) => {
        try {
            await authService.unblockState(Number(id));
            setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
            localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
            showSuccessMessage('State unblocked successfully.');
        } catch (error) {
            console.error("Error unblocking State:", error);
        }
    };

    const handleDialogCancel = () => {
        setSelectedRowId(null);
        setDialogOpen(false);
        setDialogAction(null);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        setSerialNumber(newPage * rowsPerPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    function getCountryNameById(countryId: string) {
        const country = countries.find((c) => c.id === countryId);
        return country ? country.name : '';
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={6}>
                        <Container style={{ maxWidth: 'none', backgroundColor: 'white' }}>
                            <Box m={4}>
                                <h3>STATE</h3>
                                <div className="d-flex justify-content-center">
                                    <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                                        <div className="card-body">
                                            <ul className="nav gap-2 p-1 small shadow-sm">
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        className='btn btn-outline-primary'
                                                        onClick={() => setActiveTab('insert')}
                                                        type="button"
                                                    >
                                                        INSERT
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        className='btn btn-outline-primary'
                                                        onClick={() => setActiveTab('edit')}
                                                        type="button"
                                                    >
                                                        EDIT
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button
                                                        className='btn btn-outline-primary'
                                                        onClick={() => setActiveTab('unblock')}
                                                        type="button"
                                                    >
                                                        UNBLOCK
                                                    </button>
                                                </li>
                                            </ul>
                                            {activeTab === 'insert' && (
                                                <div className="nav gap-2 p-3 small shadow-sm">
                                                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <FormControl fullWidth variant="outlined" margin="dense" className="text-field">
                                                                <InputLabel htmlFor="country">Country</InputLabel>
                                                                <Select
                                                                    label="Country"
                                                                    value={selectedCountry}
                                                                    onChange={(e) => setSelectedCountry(e.target.value as string)}
                                                                    name="country"
                                                                    variant="outlined"
                                                                    className="text-field"
                                                                    size="small"
                                                                    required
                                                                >
                                                                    {countries.map((country) => (
                                                                        <MenuItem key={country.id} value={country.id}>
                                                                            {country.text}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                id="filled-basic stateName"
                                                                label="State Name"
                                                                className="text-field"
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                                variant="outlined"
                                                                margin="dense"
                                                                size="small"
                                                                fullWidth
                                                                onKeyPress={handleKeyPress}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <Box mt={2}>
                                                                <button type="button" className="btn btn-outline-primary" onClick={handleSubmitClick} style={{ textAlign: 'center', marginLeft: "120px" }}>
                                                                    Submit
                                                                </button>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )}
                                            {activeTab === 'edit' && (
                                                <div className="card-body">
                                                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                                                        <TableContainer component={Card} sx={{ maxHeight: 440 }} style={{ width: "85%", margin: "20px" }}>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                                                    <TableRow className="tableHeading">
                                                                        <TableCell>S.No</TableCell>
                                                                        <TableCell>Name</TableCell>
                                                                        <TableCell>Country</TableCell>
                                                                        <TableCell>Action</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {states
                                                                        .filter((state) => !blockedRows.includes(state.id))
                                                                        .slice(startIndex, endIndex)
                                                                        .map((state, index) => (
                                                                            <TableRow key={state.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                                <TableCell>{serialNumber + index}</TableCell>
                                                                                <TableCell>{state.stateName}</TableCell>
                                                                                <TableCell>{getCountryNameById(state.countryId)}</TableCell>
                                                                                <TableCell>
                                                                                    <Button
                                                                                        onClick={() => handleEditClick(state.id, state.stateName, state.countryId)}
                                                                                        style={{ padding: '1px', marginRight: '4px' }}
                                                                                        startIcon={<EditIcon />}
                                                                                        variant="outlined"
                                                                                        disabled={blockedRows.includes(state.id)}
                                                                                    >
                                                                                        Edit
                                                                                    </Button>
                                                                                    <Button variant="outlined" onClick={() => handleBlock(state.id)}>
                                                                                        Block
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <div>
                                                            <TablePagination
                                                                rowsPerPageOptions={[5, 10]}
                                                                component="div"
                                                                count={states.length}
                                                                page={page}
                                                                onPageChange={handlePageChange}
                                                                rowsPerPage={rowsPerPage}
                                                                onRowsPerPageChange={handleRowsPerPageChange}
                                                                style={{ marginLeft: "500px" }}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </div>
                                            )}
                                            {activeTab === 'unblock' && (
                                                <div className="card-body">
                                                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                                                        <TableContainer component={Card} sx={{ maxHeight: 440 }} style={{ width: "85%", margin: "20px" }}>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                                                    <TableRow className="tableHeading">
                                                                        <TableCell>S.No</TableCell>
                                                                        <TableCell>Name</TableCell>
                                                                        <TableCell>Country</TableCell>
                                                                        <TableCell>Action</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {states
                                                                        .filter((state) => blockedRows.includes(state.id))
                                                                        .slice(startIndex, endIndex)
                                                                        .map((state, index) => (
                                                                            <TableRow key={state.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                                <TableCell>{serialNumber + index}</TableCell>
                                                                                <TableCell>{state.stateName}</TableCell>
                                                                                <TableCell>{getCountryNameById(state.countryId)}</TableCell>
                                                                                <TableCell>
                                                                                    <Button
                                                                                        onClick={() => handleEditClick(state.id, state.stateName, state.countryId)}
                                                                                        style={{ padding: '1px', marginRight: '4px' }}
                                                                                        startIcon={<EditIcon />}
                                                                                        variant="outlined"
                                                                                        disabled={blockedRows.includes(state.id)}
                                                                                    >
                                                                                        Edit
                                                                                    </Button>
                                                                                    <Button variant="outlined" onClick={() => handleUnblock(state.id)}>
                                                                                        Unblock
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <div>
                                                            <TablePagination
                                                                rowsPerPageOptions={[5, 10]}
                                                                component="div"
                                                                count={states.filter((state) => blockedRows.includes(state.id)).length}
                                                                page={page}
                                                                onPageChange={handlePageChange}
                                                                rowsPerPage={rowsPerPage}
                                                                onRowsPerPageChange={handleRowsPerPageChange}
                                                                style={{ marginLeft: "500px" }}
                                                            />
                                                        </div>
                                                    </Grid>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Container>
                    </Box>
                    <Dialog open={openEditDialog} onClose={handleEditDialogClose} fullWidth maxWidth="sm">
                        <DialogTitle>Edit State</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="State Name"
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        value={editStateName}
                                        size="small"
                                        onChange={(e) => setEditStateName(e.target.value)}
                                        onKeyPress={handleKeyPressEdit}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth variant="outlined" margin="dense">
                                        <InputLabel htmlFor="country">Country</InputLabel>
                                        <Select
                                            label="Country"
                                            value={selectedCountry}
                                            onChange={(e) => setSelectedCountry(e.target.value as string)}
                                            name="country"
                                            variant="outlined"
                                            size="small"
                                            required
                                        >
                                            {countries.map((country) => (
                                                <MenuItem key={country.id} value={country.id}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleEditDialogSaveClick} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={dialogOpen} onClose={handleDialogCancel}>
                        <DialogTitle>
                            {dialogAction === 'BLOCK' ? 'BLOCK STATE' : 'UNBLOCK STATE'}
                        </DialogTitle>
                        <DialogContent>
                            <p>
                                Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this State?
                            </p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleConfirmDialog(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => handleConfirmDialog(true)} color="primary" autoFocus>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={isSuccessOpen}
                        autoHideDuration={5000}
                        onClose={() => setIsSuccessOpen(false)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MuiAlert
                            elevation={6}
                            variant="filled"
                            severity="success"
                            onClose={() => setIsSuccessOpen(false)}
                        >
                            {successMessage}
                        </MuiAlert>
                    </Snackbar>
                    <Snackbar
                        open={isErrorOpen}
                        autoHideDuration={5000}
                        onClose={() => setIsErrorOpen(false)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MuiAlert
                            elevation={6}
                            variant="filled"
                            severity="error"
                            onClose={() => setIsErrorOpen(false)}
                        >
                            {errorMessage}
                        </MuiAlert>
                    </Snackbar>
                </Box>
            </Box>
        </>
    );
};

export default State;