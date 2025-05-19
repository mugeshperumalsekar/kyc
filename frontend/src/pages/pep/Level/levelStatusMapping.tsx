import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Alert, SelectChangeEvent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import LevelApiService from '../../../data/services/pep_search/level/level-api-service';
import statusApiService from '../../../data/services/master/status/status-api-service';
import Header from '../../../layouts/header/header';
import LevelStatusMappingApiService from '../../../data/services/pep_search/levelstatusmapping/levelstatusmapping-api-service';

interface Level {
    id: number;
    name: string;
}

interface Status {
    id: number;
    name: string;
}

interface LevelStatusMappingPayload {
    id: number;
    levelId: number;
    statusId: number;
    isAlive: number;
    uid: number;
}

const LevelStatusMapping = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [levelId, setLevelId] = useState('');
    const [isAlive, setIsAlive] = useState<boolean>(false);
    const [level, setLevel] = useState<Level[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const [statusId, setStatusId] = useState<string>('');
    const [levelStatusMappings, setLevelMappings] = useState<LevelStatusMappingPayload[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editLevelMappingsId, setEditLevelMappingsId] = useState(0);
    const [activeTab, setActiveTab] = useState('insert');
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [newEntryId, setNewEntryId] = useState<number | null>(null);
    const levelStatusMappingService = new LevelStatusMappingApiService();
    const levelApiService = new LevelApiService();
    const statusapi = new statusApiService();

    useEffect(() => {
        fetchLevelMappings();
        fetchLevel();
        fetchStatus();
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
        }
    }, [levelId]);

    const fetchLevel = async () => {
        try {
            const levels = await levelApiService.getLevel();
            setLevel(levels);
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const fetchStatus = async () => {
        try {
            const status = await statusapi.getPepStatus();
            setStatus(status);
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const fetchLevelMappings = async () => {
        try {
            const levelStatusMappings = await levelStatusMappingService.getLevelStatusMapping();
            setLevelMappings(levelStatusMappings);
        } catch (error) {
            console.error("Error fetching levelMapping:", error);
        }
    };

    const handleLevelChange = (event: SelectChangeEvent<string>) => {
        const selectedLevelId = event.target.value as string;
        setLevelId(selectedLevelId);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setStatusId(event.target.value);
    };

    const handleSubmit = async () => {
        if (!levelId || !statusId) {
            setErrorMessage("Level and Status are required.");
            return;
        }
        try {
            const existingMappings = await levelStatusMappingService.getLevelStatus(levelId, statusId);
            console.log('Existing Mappings:', existingMappings);
            if (existingMappings && existingMappings.length > 0) {
                setOpenConfirmationDialog(true);
                const existingMapping = existingMappings[0];
                const payload: LevelStatusMappingPayload = {
                    id: existingMapping.id,
                    levelId: parseInt(levelId),
                    statusId: parseInt(statusId),
                    isAlive: isAlive ? 1 : 0,
                    uid: loginDetails.id,
                };
                await levelStatusMappingService.updateLevelStatusMapping(levelId, statusId, payload);
            } else {
                const payload: LevelStatusMappingPayload = {
                    id: newEntryId ? newEntryId : 0,
                    levelId: parseInt(levelId),
                    statusId: parseInt(statusId),
                    isAlive: isAlive ? 1 : 0,
                    uid: loginDetails.id,
                };
                const response = await levelStatusMappingService.createLevelStatusMapping(payload);
                setNewEntryId(response.id);
            }
            setLevelId('');
            setStatusId('');
            setIsAlive(false);
            fetchLevelMappings();
            setErrorMessage(null);
        } catch (error) {
            console.error("Error handling submit:", error);
            setErrorMessage("This data alredy exsist");
        }
    };

    const handleUpdate = async (id: number | null) => {
        if (!id || Number(id) <= 0) {
            setErrorMessage("Invalid ID for update.");
            return;
        }
        try {
            const updatePayload: LevelStatusMappingPayload = {
                id: id,
                levelId: Number(levelId),
                statusId: Number(statusId),
                isAlive: isAlive ? 1 : 0,
                uid: loginDetails.id,
            };
            await levelStatusMappingService.updateLevelStatusMapping(levelId, statusId, updatePayload);
            fetchLevelMappings();
        } catch (error) {
            console.error("Error updating levelMapping:", error);
            setErrorMessage("Error while updating the entry.");
        }
    };

    const handleRowClick = (id: number) => {
        if (id > 0) {
            setEditLevelMappingsId(id);
            console.log("Setting editLevelMappingsId to:", id.toString());
            setOpenConfirmationDialog(true);
        } else {
            console.error("Invalid row clicked with ID:", id);
        }
    };

    const handleEditClick = (levelMapping: LevelStatusMappingPayload) => {
        if (!levelMapping || levelMapping.id <= 0) {
            console.error("Invalid levelMapping:", levelMapping);
            return;
        }
        setEditLevelMappingsId(levelMapping.id);
        setLevelId(levelMapping.levelId.toString() || '');
        setStatusId(levelMapping.statusId.toString() || '');
        setOpenEditDialog(true);
    };

    const handleConfirmationYes = async () => {
        setOpenConfirmationDialog(false);
        const idToUpdate = Number(editLevelMappingsId);
        if (idToUpdate > 0) {
            await handleUpdate(idToUpdate);
        }
    };

    const handleEditDialogSave = async () => {
        try {
            const payload: LevelStatusMappingPayload = {
                id: Number(editLevelMappingsId),
                levelId: Number(levelId),
                statusId: Number(statusId),
                isAlive: isAlive ? 1 : 0,
                uid: loginDetails.id,
            };
            await levelStatusMappingService.updateLevelStatusMapping(levelId, statusId, payload);
            setOpenEditDialog(false);
            setLevelId('');
            setStatusId('');
            fetchLevelMappings();
        } catch (error) {
            console.error("Error editing levelMapping:", error);
        }
    };

    const getSerialNumber = (index: number) => {
        return page * 10 + index + 1;
    };

    const levelMap = new Map(level.map(l => [l.id, l.name]));
    const statusMap = new Map(status.map(s => [s.id, s.name]));

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Card elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Level Status Mapping
                    </Typography>
                    <Box my={3}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button
                                    variant={activeTab === 'insert' ? 'contained' : 'outlined'}
                                    onClick={() => setActiveTab('insert')}
                                >
                                    Insert
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={activeTab === 'edit' ? 'contained' : 'outlined'}
                                    onClick={() => setActiveTab('edit')}
                                >
                                    Edit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    {activeTab === 'insert' && (
                        <Box mt={4}>
                            <Grid container spacing={3}>
                                {errorMessage && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{errorMessage}</Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="level-select-label">Select Level</InputLabel>
                                        <Select
                                            labelId="level-select-label"
                                            value={levelId}
                                            onChange={handleLevelChange}
                                            label="Select Level"
                                        >
                                            {level.map((lvl) => (
                                                <MenuItem key={lvl.id} value={lvl.id}>
                                                    {lvl.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="status-select-label">Select Status</InputLabel>
                                        <Select
                                            labelId="status-select-label"
                                            value={statusId}
                                            onChange={handleStatusChange}
                                            label="Select Status"
                                        >
                                            {status.map((sts) => (
                                                <MenuItem key={sts.id} value={sts.id}>
                                                    {sts.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    {activeTab === 'edit' && (
                        <Box mt={4}>
                            <TableContainer
                                component={Paper}
                                style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}
                            >
                                <Table size="small" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>S.No</TableCell>
                                            <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>Level</TableCell>
                                            <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>Status</TableCell>
                                            <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {levelStatusMappings.map((mapping, index) => (
                                            <TableRow
                                                key={mapping.id}
                                                onClick={() => handleRowClick(mapping.id)}
                                            >
                                                <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>{getSerialNumber(index)}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>{levelMap.get(mapping.levelId)}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>{statusMap.get(mapping.statusId)}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '0.8rem' }}>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(mapping);
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>

                                                    <IconButton
                                                        color="primary"
                                                    >
                                                        <BlockIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Card>

                <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
                    <DialogTitle>Confirm Update</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to insert this existing entry?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmationDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleConfirmationYes}
                            color="primary"
                            variant="contained"
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edit Level Mapping</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="edit-level-select-label">Select Level</InputLabel>
                                    <Select
                                        labelId="edit-level-select-label"
                                        value={levelId}
                                        onChange={(e) => setLevelId(e.target.value)}
                                        label="Select Level"
                                    >
                                        {level.map((lvl) => (
                                            <MenuItem key={lvl.id} value={lvl.id}>
                                                {lvl.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="edit-status-select-label">Select Status</InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        value={statusId}
                                        onChange={handleStatusChange}
                                        label="Select Status"
                                    >
                                        {status.map((sts) => (
                                            <MenuItem key={sts.id} value={sts.id}>
                                                {sts.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleEditDialogSave} variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default LevelStatusMapping;