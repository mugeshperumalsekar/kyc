import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Button, Box, Dialog, DialogTitle, DialogContent, Container, DialogActions, Snackbar, Card } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../../layouts/header/header';
import { CountryEditPayload, CountryPayload } from '../../../data/services/master/Country/country_payload';
import CountryApiService from '../../../data/services/master/Country/country_api_service';

interface Country {
    id: string;
    name: string;
    text: string;
}

const Country = () => {

    const [name, setName] = useState('');
    const [selectedcountries, setSelectedcountries] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editcountriesName, setEditcountriesName] = useState('');
    const [editcountriesId, setEditcountriesId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletecountriesId, setDeletecountriesId] = useState('');
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
    const [refreshKey, setRefreshKey] = useState(0);
    const authService = new CountryApiService();

    useEffect(() => {
        fetchCountries();
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
        }
    }, []);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
        setTimeout(() => {
            setIsSuccessOpen(false);
            setSuccessMessage('');
        }, 1000);
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const validateAlphabeticInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = event.charCode || event.keyCode;
        if (
            event.key === 'Backspace' ||
            event.key === 'Delete' ||
            event.key === 'Enter' ||
            event.key === ' ' ||
            charCode === 0
        ) {
            return true;
        }
        if (!/^[a-zA-Z]$/.test(String.fromCharCode(charCode))) {
            event.preventDefault();
            showErrorMessage('Only alphabetic characters are allowed.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!name) {
            showErrorMessage('Please fill out all fields.');
            return;
        }
        try {
            const payload: CountryPayload = {
                name: name
            };
            const response = await authService.doMasterCountry(payload);
            setName('');
            fetchCountries();
            showSuccessMessage('Country added successfully.');
            setRefreshKey((prevKey) => prevKey + 1);
        } catch (error) {
            console.error("Error adding Country:", error);
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
            const Countries = await authService.getCountryOptions();
            setCountries(Countries);
            setSerialNumber(page * rowsPerPage + 1);
        } catch (error) {
            console.error("Error fetching Country:", error);
        }
    };

    const handleEditClick = (id: string, name: string) => {
        setEditcountriesId(id);
        setEditcountriesName(name);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditcountriesId('');
        setEditcountriesName('');
    };

    const handleEditDialogSave = async () => {
        try {
            const payload: CountryEditPayload = {
                text: editcountriesName,
                primaryKey: 'some_primaryKey_value',
                iso2: 'some_iso2_value',
                fk_CountryValues: 'some_fk_CountryValues_value'
            };
            await authService.updateCountry(Number(editcountriesId), payload);
            setOpenEditDialog(false);
            setEditcountriesId('');
            setEditcountriesName('');
            fetchCountries();
            showSuccessMessage('Country updated successfully.');
        } catch (error) {
            console.error("Error editing Country:", error);
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
            await authService.blockCountry(Number(id));
            setBlockedRows([...blockedRows, id]);
            localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
            showSuccessMessage('Country blocked successfully.');
        } catch (error) {
            console.error("Error blocking Country:", error);
        }
    };

    const unblockRow = async (id: string) => {
        try {
            await authService.unblockCountry(Number(id));
            setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
            localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
            showSuccessMessage('Country unblocked successfully.');
        } catch (error) {
            console.error("Error unblocking Country:", error);
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

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={6}>
                        <Container style={{ maxWidth: 'none', backgroundColor: 'white' }}>
                            <Box m={4}>
                                <h3>COUNTRY</h3>
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
                                                            <h6>Add Country</h6>
                                                            <Box>
                                                                <TextField
                                                                    id="filled-basic"
                                                                    label="Country"
                                                                    className="text-field"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                    variant="outlined"
                                                                    margin="dense"
                                                                    size="small"
                                                                    fullWidth
                                                                    onKeyPress={handleKeyPress}
                                                                />
                                                            </Box>
                                                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                                                                <Grid item xs={12} sm={4}>
                                                                    <Box mt={2}>
                                                                        <button type="button" className="btn btn-outline-primary" onClick={handleSubmitClick} style={{ textAlign: 'center' }}>
                                                                            Submit
                                                                        </button>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
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
                                                                        <TableCell>Action</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {countries.filter((countries) => !blockedRows.includes(countries.id))
                                                                        .slice(startIndex, endIndex).map((countries, index) => (
                                                                            <TableRow key={countries.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                                <TableCell>{serialNumber + index}</TableCell>
                                                                                <TableCell>{countries.text}</TableCell>
                                                                                <TableCell>
                                                                                    <Button
                                                                                        onClick={() => handleEditClick(countries.id, countries.text)}
                                                                                        style={{ padding: '1px 1px', marginRight: '4px' }}
                                                                                        startIcon={<EditIcon />}
                                                                                        variant="outlined"
                                                                                        disabled={blockedRows.includes(countries.id)}
                                                                                    >
                                                                                        Edit
                                                                                    </Button>
                                                                                    <Button variant="outlined" onClick={() => handleBlock(countries.id)} style={{ padding: '1px 1px', marginRight: '4px' }}>
                                                                                        Block
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <div >
                                                            <TablePagination
                                                                rowsPerPageOptions={[5, 10]}
                                                                component="div"
                                                                count={countries.length}
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
                                                    <TableContainer component={Card} sx={{ maxHeight: 440 }}>
                                                        <Table size="small" aria-label="a dense table" >
                                                            <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                                                <TableRow className="tableHeading" >
                                                                    <TableCell >S.No</TableCell>
                                                                    <TableCell >Name</TableCell>
                                                                    <TableCell>Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {countries
                                                                    .filter((countries) => blockedRows.includes(countries.id))
                                                                    .slice(startIndex, endIndex)
                                                                    .map((countries, index) => (
                                                                        <TableRow key={countries.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                            <TableCell>{serialNumber + index}</TableCell>
                                                                            <TableCell>{countries.name}</TableCell>
                                                                            <TableCell>
                                                                                <Button
                                                                                    onClick={() => handleEditClick(countries.id, countries.name)}
                                                                                    style={{ padding: '1px', marginRight: '4px' }}
                                                                                    startIcon={<EditIcon />}
                                                                                    variant="outlined"
                                                                                    disabled={blockedRows.includes(countries.id)}
                                                                                >
                                                                                    Edit
                                                                                </Button>
                                                                                <Button variant="outlined" onClick={() => handleUnblock(countries.id)} style={{ padding: '1px 1px', marginRight: '4px' }}>
                                                                                    Unblock
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10]}
                                                            component="div"
                                                            count={blockedRows.length}
                                                            rowsPerPage={rowsPerPage}
                                                            page={page}
                                                            onPageChange={(event, newPage) => setPage(newPage)}
                                                            onRowsPerPageChange={(event) => {
                                                                setRowsPerPage(parseInt(event.target.value, 10));
                                                                setPage(0);
                                                            }}
                                                        />
                                                    </TableContainer>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Container>
                    </Box>
                    <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                        <DialogTitle>EDIT COUNTRY</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Country Name"
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                value={editcountriesName}
                                onChange={(e) => setEditcountriesName(e.target.value)}
                                onKeyPress={handleKeyPressEdit}
                            />
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
                            {dialogAction === 'BLOCK' ? 'UNBLOCK STATE' : 'BLOCK STATE'}
                        </DialogTitle>
                        <DialogContent>
                            <p>
                                Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this Country?
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

export default Country;