import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert, SelectChangeEvent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import LevelMappingApiService from '../../../data/services/cms_search/levelMapping/levelmapping-api-service';
import LevelApiService from '../../../data/services/cms_search/level/level-api-service';
import statusApiService from '../../../data/services/master/status/status-api-service';
import Header from '../../../layouts/header/header';


interface Level {
    id: number;
    name: string;
}

interface Status {
    name: any;
    id: number;
    status: string;
}

interface LevelMappingPayload {
    id: number;
    levelId: number;
    statusId: number;
    passingLevelId: number;
    isAlive: number;
    uid: number;
}

const WorkFlowMapping = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const [name, setName] = useState('');
    const [levelId, setLevelId] = useState('');
    // const [statusId, setStatusId] = useState('');
    const [isAlive, setIsAlive] = useState<boolean>(false);
    const [level, setLevel] = useState<Level[]>([]);
    const [status, setStatus] = useState<Status[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
    const [statusId, setStatusId] = useState<string>('');
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [newEntryId, setNewEntryId] = useState<number | null>(null);
    const [passingLevelId, setPassingLevelId] = useState('');
    const [levelMappings, setLevelMappings] = useState<LevelMappingPayload[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editLevelMappingsId, setEditLevelMappingsId] = useState('');
    const [activeTab, setActiveTab] = useState('insert');
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [levelDataId, setLevelDataId] = useState<any>(null);

    const levelMappingService = new LevelMappingApiService();
    const levelApiService = new LevelApiService();
    const statusService = new statusApiService();

    useEffect(() => {
        fetchLevelMappings();
        fetchLevel();
        if (levelId) {
            fetchLevelOneData(parseInt(levelId));
        }
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

    const fetchLevelMappings = async () => {
        try {
            const levelMappings = await levelMappingService.getLevelMapping();
            setLevelMappings(levelMappings);
        } catch (error) {
            console.error("Error fetching levelMapping:", error);
        }
    };

    const fetchLevelOneData = async (levelId: number) => {
        if (levelId) {
            try {
                const data = await levelMappingService.getLevelOneData(levelId);
                console.log("leveldata", data)
                setStatus(data);

            } catch (error) {
                console.error("Error fetching level data:", error);
                setErrorMessage("Failed to fetch level data. Please try again.");
            }
        }
    };

    const handleLevelChange = (event: SelectChangeEvent<string>) => {
        const selectedLevelId = event.target.value as string;
        setLevelId(selectedLevelId);

        if (selectedLevelId) {
            setErrorMessage(null);
            fetchLevelOneData(parseInt(selectedLevelId));
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setStatusId(event.target.value);
    };


    const handleSelectEntry = (id: number) => {
        setNewEntryId(id);  // Set the newEntryId to the selected entry's ID
        setOpenConfirmationDialog(true);  // Open the dialog
    };

    const handleSubmit = async () => {
        if (!levelId || !statusId) {
            setErrorMessage("Level and Status are required.");
            return;
        }

        try {
            const existingMappings = await levelMappingService.getLevelStatus(levelId, statusId);
            console.log('Existing Mappings:', existingMappings);

            if (existingMappings && existingMappings.length > 0) {
                setOpenConfirmationDialog(true);
                const existingMapping = existingMappings[0];
                const payload: LevelMappingPayload = {
                    id: existingMapping.id,
                    levelId: parseInt(levelId),
                    statusId: parseInt(statusId),
                    passingLevelId: parseInt(passingLevelId),
                    isAlive: isAlive ? 1 : 0,
                    uid: loginDetails.id,
                };

                await levelMappingService.updateLevelMapping(levelId, statusId, payload);
            } else {
                const payload: LevelMappingPayload = {
                    id: newEntryId ? newEntryId : 0,
                    levelId: parseInt(levelId),
                    statusId: parseInt(statusId),
                    passingLevelId: parseInt(passingLevelId),
                    isAlive: isAlive ? 1 : 0,
                    uid: loginDetails.id,
                };

                const response = await levelMappingService.CreateLevelMapping(payload);
                setNewEntryId(response.id);
            }

            setLevelId('');
            setStatusId('');
            setPassingLevelId('');
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
            const updatePayload: LevelMappingPayload = {
                id: id,
                levelId: Number(levelId),
                statusId: Number(statusId),
                passingLevelId: Number(passingLevelId),
                isAlive: isAlive ? 1 : 0,
                uid: loginDetails.id,
            };

            await levelMappingService.updateLevelMapping(levelId, statusId, updatePayload);
            fetchLevelMappings();
        } catch (error) {
            console.error("Error updating levelMapping:", error);
            setErrorMessage("Error while updating the entry.");
        }
    };



    const handleEditClick = (levelMapping: LevelMappingPayload) => {
        if (!levelMapping || levelMapping.id <= 0) {
            console.error("Invalid levelMapping:", levelMapping);
            return;
        }
        setEditLevelMappingsId(levelMapping.id.toString());
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
            const payload: LevelMappingPayload = {
                id: Number(editLevelMappingsId),
                levelId: Number(levelId),
                statusId: Number(statusId),
                passingLevelId: Number(passingLevelId),
                isAlive: isAlive ? 1 : 0,
                uid: loginDetails.id,
            };

            await levelMappingService.updateLevelMapping(levelId, statusId, payload);
            setOpenEditDialog(false);
            setLevelId('');
            setStatusId('');
            fetchLevelMappings();
        } catch (error) {
            console.error("Error editing levelMapping:", error);
        }
    };

    const handleBlockClick = async (id: number, status: string): Promise<void> => {
        try {
            if (status === 'A') {
                await levelMappingService.blockLevelMapping(id);
                alert('Level mapping blocked successfully.');
            } else if (status === 'D') {
                await levelMappingService.unblockLevelMapping(id);
                alert('Level mapping unblocked successfully.');
            } else {
                alert('Unknown status. Unable to process.');
            }
        } catch (error) {
            alert('Failed to update level mapping status. Please try again.');
        }
    };

    const getSerialNumber = (index: number) => {
        return page * 10 + index + 1;
    };

    const levelMap = new Map(level.map(l => [l.id, l.name]));
    const statusMap = new Map(status.map(s => [s.id, s.status]));

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

                    <h6 className='allheading' >
                        Work Flow Mapping
                    </h6>
                    <Box my={2}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button className='allButton'
                                    variant={activeTab === 'insert' ? 'contained' : 'outlined'}
                                    onClick={() => setActiveTab('insert')}
                                >
                                    Insert
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button className='allButton'
                                    variant={activeTab === 'edit' ? 'contained' : 'outlined'}
                                    onClick={() => setActiveTab('edit')}
                                >
                                    Edit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                {activeTab === 'insert' && (
                    <Box mt={4}>
                        <Grid container spacing={2}>
                            {errorMessage && (
                                <Grid item xs={3}>
                                    <Alert severity="error">{errorMessage}</Alert>
                                </Grid>
                            )}

                            <Grid item xs={12} sm={3}>
                                <FormControl className="custom-textfield .MuiInputBase-root" fullWidth variant="outlined">
                                    <InputLabel className="custom-textfield .MuiInputBase-root" id="level-select-label">Select Level</InputLabel>
                                    <Select className="custom-textfield .MuiInputBase-root"
                                        labelId="level-select-label"
                                        value={levelId}
                                        size='small'
                                        onChange={handleLevelChange}
                                        label="Select Level"
                                    >
                                        {level.map((lvl) => (
                                            <MenuItem className="custom-menu-item" key={lvl.id} value={lvl.id}>
                                                {lvl.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl className="custom-textfield .MuiInputBase-root" fullWidth variant="outlined">
                                    <InputLabel className="custom-textfield .MuiInputBase-root" id="status-select-label">Select Status</InputLabel>
                                    <Select className="custom-textfield .MuiInputBase-root"
                                        labelId="status-select-label"
                                        value={statusId}
                                        size='small'
                                        onChange={handleStatusChange}
                                        label="Select Status"
                                    >
                                        {status.map((sts) => (
                                            <MenuItem className="custom-menu-item" key={sts.id} value={sts.id}>
                                                {sts.status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl className="custom-textfield .MuiInputBase-root" fullWidth variant="outlined">
                                    <InputLabel className="custom-textfield .MuiInputBase-root" id="passing-level-select-label">Passing Level</InputLabel>
                                    <Select className="custom-textfield .MuiInputBase-root"
                                        labelId="passing-level-select-label"
                                        value={passingLevelId}
                                        size='small'
                                        onChange={(e) => setPassingLevelId(e.target.value)}
                                        label="Passing Level"
                                    >
                                        {level.map((lvl) => (
                                            <MenuItem className="custom-menu-item" key={lvl.id} value={lvl.id}>
                                                {lvl.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isAlive}
                                            onChange={(e) => setIsAlive(e.target.checked)}
                                        />
                                    }
                                    label="Is Alive"
                                />
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
                            <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                                <TableHead sx={{ backgroundColor: '#cccdd1' }}>

                                    <TableRow className="tableHeading">

                                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3', }}>S.No</TableCell>
                                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3', }}>Level</TableCell>
                                        <TableCell style={{  padding: '4px', backgroundColor: '#D3D3D3', }}>Status</TableCell>
                                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3',  }}>Passing Level</TableCell>
                                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3',  }}>Is Alive</TableCell>
                                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3',  }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {levelMappings.map((mapping, index) => (
                                        <TableRow key={mapping.id}>
                                            <TableCell style={{ padding: '4px',  }}>
                                                {getSerialNumber(index)}
                                            </TableCell>
                                            <TableCell style={{ padding: '4px', }}>
                                                {levelMap.get(mapping.levelId)}
                                            </TableCell>
                                            <TableCell style={{ padding: '4px',  }}>
                                                {statusMap.get(mapping.statusId)}
                                            </TableCell>
                                            <TableCell style={{ padding: '4px',  }}>
                                                {levelMap.get(mapping.passingLevelId)}
                                            </TableCell>
                                            <TableCell style={{ padding: '4px', }}>
                                                {mapping.isAlive === 1 ? 'Yes' : 'No'}
                                            </TableCell>
                                            <TableCell style={{ padding: '4px',  }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditClick(mapping)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleBlockClick(mapping.id, mapping.isAlive === 1 ? 'A' : 'D')
                                                    }
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
                                                {sts.status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="edit-passing-level-select-label">Passing Level</InputLabel>
                                    <Select
                                        labelId="edit-passing-level-select-label"
                                        value={passingLevelId}
                                        onChange={(e) => setPassingLevelId(e.target.value)}
                                        label="Passing Level"
                                    >
                                        {level.map((lvl) => (
                                            <MenuItem key={lvl.id} value={lvl.id}>
                                                {lvl.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isAlive}
                                            onChange={(e) => setIsAlive(e.target.checked)}
                                        />
                                    }
                                    label="Is Alive"
                                />
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

export default WorkFlowMapping;

