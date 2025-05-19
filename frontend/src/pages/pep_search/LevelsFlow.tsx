import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent, Box, FormControl, InputLabel, TextField, Grid, Slider, Typography } from '@mui/material';
import ViewService from '../../data/services/pep_search/viewpage/view_api_service';
import { RecordDTO } from '../../data/services/pep_search/viewpage/view_payload';
import Header from '../../layouts/header/header';
import LevelStatusMappingApiService from '../../data/services/pep_search/levelstatusmapping/levelstatusmapping-api-service';
import { useSelector } from 'react-redux';
import levelApiService from '../../data/services/pep_search/level/level-api-service';
import HitdatalifecycleApiService from '../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useReactToPrint } from 'react-to-print';
import { Snackbar, Alert } from '@mui/material';


interface LevelStatus {
    id: number;
    levelId: number;
    statusId: number;
    uid: number;
    status: string
    passingLevelId: number;
    isAlive: number;

}

interface Remark {
    remark: string
    createdAt: string,
    level: string,
    status: string,


}
interface Level {
    id: string;
    name: string;
}
const SearchComponent = () => {
    const { id, ids, uid } = useParams();

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [formData, setFormData] = useState<RecordDTO>({
        id: 0,
        name: '',
        dob:'',
        placeOfBirth:'',
        pan: '',
        directorsIdentificationNumber:'',
        score: 0,
        criminalId: 0, 
        searchId: 0,
        hitId: 0, 
        
    });
    const [sliderValue, setSliderValue] = useState(80); // Initialize slider with a default value
    const [records, setRecords] = useState<RecordDTO[]>([]); // State to hold fetched records
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string>('0');
    const [remarks, setRemarks] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [selectedRow, setSelectedRow] = useState<any>([])
    const [searchError, setSearchError] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    const hitdatalifecycleApiService = new HitdatalifecycleApiService();

    const customer = new ViewService();
    const levelService = new LevelStatusMappingApiService();
    const levelServices = new levelApiService();
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchLevelStatus();
        fetchLevels()

    }, [id]);
    const fetchLevelStatus = async () => {
        try {
            const results = await levelService.getLevelOneData(loginDetails);
            console.log("dd:", results)
            setLevelStatus(results);
        } catch (error) {
            console.error("Error fetching level statuses:", error);
        }
    };
    const fetchLevels = async () => {
        try {
            const levels = await levelServices.getLevel();
            setLevels(levels);
        } catch (error) {
            console.error('Error fetching level:', error);
        }
    };

    const handleSearch = async () => {
        const searchDTO = {
            name: formData.name, // Name from form data
            searchingScore: sliderValue, // Score from slider
            kycId: 0, // KYC ID, populate if necessary
            applicantFormId: '', // Applicant Form ID, populate if necessary
            screeningType: 0, // Set screening type as needed
            uid: loginDetails.id,
        };

        try {
            setLoading(true);
            if (!formData.name && sliderValue === 100) {
                setSearchError(true);
                setLoading(false);
                return;
            }


            const result = await customer.getsearchDTOpep([searchDTO]);

            if (Array.isArray(result) && result.length > 0) {
                setRecords(result);
                setSearchError(false);
            } else {
                setSearchError(true);
                setRecords(result);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            ...formData,
            name: '',
            

        });// Reset the name input
        setSliderValue(80); // Reset the slider value to default
        setRecords([]); // Clear fetched records
    };

    const getStatusNameById = (levelId: number) => {
        const level = levels.find((c) => Number(c.id) === levelId);

        return level ? level.name : 'Not Available';

    };
    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedAction('');
        setRemarks('');
    };
    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedAction(event.target.value);
    };
    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemarks(event.target.value);
    };
    const handleIconClick = (index: RecordDTO,) => {
        // alert(`PendingAlert: ${JSON.stringify(alert)}, hitId: ${hitdataId}`);
        setSelectedRow(index);
        setOpenDialog(true);
        // handleoneRemark(hitdataId);

    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleRemarksSubmit = async () => {
        if (selectedRow) {

            const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));

            if (!selectedStatus) {
                console.error("Selected status not found.");
                return;
            }

            const hitrecordlifecyclePayload = {
                search_id: Number(selectedRow.searchId),
                hitdata_id: Number(selectedRow.hitId),
                criminal_id: Number(selectedRow.criminalId),
                statusId: selectedStatus.statusId,
                statusNowId: selectedStatus.statusId,
                remark: remarks,
                level_id: loginDetails.accessLevel,
                case_id: 0,
                valid: 0,
                isAlive: selectedStatus.isAlive,
                passingLevelId: selectedStatus.passingLevelId,
                uid: loginDetails.id
            };

            try {
                // Show loading before saving
                setLoading(true);

                await hitdatalifecycleApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
                setRecords(prevRecords => prevRecords.filter(row => row.id !== selectedRow.id));

                // If success, close dialog and show success snackbar
                setOpenDialog(false);
                setSnackbarMessage('Saved successfully!');
                setOpenSnackbar(true);
                setRemarks('');
                setSelectedAction('');
            } catch (error) {
                console.error("Error while submitting remarks:", error);
                setSnackbarMessage('Failed to save data. Please try again.');
                setOpenSnackbar(true);
            } finally {
                // Hide loading after the operation
                setLoading(false);

                console.log("Selected action:", selectedAction);
                console.log("Remarks:", remarks);
                console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
            }
        }
    };

    const handleTableRowClick = (ids: number) => {
        const uid = loginDetails.id;
        const id = String(ids);
        const content = (
            <iframe
                src={`scpk/ViewDesign/${id}/${uid}`}
                title="View Design"
                style={{ width: '100%', height: '80vh', border: 'none' }}
            />
        );
        setModalContent(content);
        setIsModalOpen(true);
    };
    const myRef = useRef(null);
    const Ref = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => Ref.current,
        pageStyle: `
          @page {
            margin-left: 20mm; /* Adjust this value as per your requirement */
          }
          body {
            margin: 0;
          }
          .table-container {
            overflow: visible !important; /* Ensure table content is fully visible when printing */
            max-height: none !important;
          }
          table {
            margin: 0 auto; /* Center the table */
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd; /* Add borders to table cells for clarity */
          }
        `,
    });

    const exportToExcel = () => {
        try {
            const dataForExport = records.map((row) => ({
                Name: row.name,
                DateofBirth: row.dob,
                PlaceofBirth: row.placeOfBirth,
                Pan: row.pan,
                DirectorsIdentificationNumber: row.directorsIdentificationNumber,
                Score: row.score
            }));
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataForExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lookup Results");
            XLSX.writeFile(workbook, "lookup_results.xlsx");
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };
    const handleSort = (columnName: string) => {
        if (columnName === sortedColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(columnName);
            setSortDirection('asc');
        }
    };
    const sortedData = (records ?? []).length > 0 ? records.sort((a, b) => {
        const valueA = a[sortedColumn as keyof RecordDTO];
        const valueB = b[sortedColumn as keyof RecordDTO];

        if (sortedColumn === 'score') {
            // Convert to numbers for numerical comparison
            const numA = Number(valueA);
            const numB = Number(valueB);
            return sortDirection === 'asc' ? numA - numB : numB - numA;
        } else {
            // Handle other columns as strings
            const strA = String(valueA);
            const strB = String(valueB);
            return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        }
    }) : [];
    return (
        <>
            {levelStatus[0]?.levelId === 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h6 className='allheading'>{getStatusNameById(levelStatus[0]?.levelId)}</h6>
                    <div >
                        <IconButton
                            color="primary"
                            onClick={handlePrint}
                            style={{ minWidth: 'unset', padding: '2px' }}
                        >
                            <PrintIcon />
                        </IconButton>
                        <IconButton
                            color="primary"
                            onClick={exportToExcel}
                            style={{ minWidth: 'unset', padding: '1px' }}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </div>
                </Box>
            )}

            <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>

                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <TextField className="custom-textfield .MuiInputBase-root"
                            style={{ width: '100%' }}
                            label="Name"
                            id="Name"
                            size='small'
                            variant="outlined"
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Slider className="custom-textfield .MuiInputBase-root"
                            style={{ width: '90%' }}
                            value={sliderValue}
                            onChange={(e, newValue) => {
                                setSliderValue(newValue as number);
                            }}
                            aria-labelledby="discrete-slider"
                            step={1}
                            marks
                            min={50}
                            max={100}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField className="custom-textfield .MuiInputBase-root"
                            style={{ width: '55px' }}
                            id="max-score"
                            size='small'
                            label="Score"
                            variant="outlined"
                            type="text"
                            name="maxScore"
                            autoComplete="off"
                            value={sliderValue.toString()}
                            onChange={(e) => setSliderValue(parseInt(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button className='allbutton'
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                        <Button className='allbutton'
                            variant="contained"
                            color="primary"
                            onClick={handleReset}
                            style={{ marginLeft: '10px' }}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </Card>
            <br />

            <h6 className='allheading'> LOOKUP RESULTS ({records.length})</h6>
            <div ref={Ref}>
                <TableContainer className="table-container" component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
                    <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                            <TableRow className="tableHeading">
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '20px' }}>S.No</TableCell>

                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('name')}>Name {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('dob')}>Date of Birth{sortedColumn === 'dob' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('placeOfBirth')}>Place of Birth {sortedColumn === 'placeOfBirth' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }} onClick={() => handleSort('pan')}>PAN {sortedColumn === 'pan' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '30px' }} onClick={() => handleSort('directorsIdentificationNumber')}>Directors Identification Number {sortedColumn === 'directorsIdentificationNumber' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }} onClick={() => handleSort('score')}>Score{sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1">Loading...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : records.length > 0 ? (
                                records.map((record, index) => (

                                    <TableRow key={record.id} style={{ height: '32px' }}>
                                        <TableCell style={{ padding: '4px' }}>{index + 1}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleTableRowClick(Number(record.id));
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: '#1677FF',
                                                    textDecoration: 'underline',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {record.name.charAt(0).toUpperCase() + record.name.slice(1)}
                                            </a>
                                        </TableCell>
                                        {/* <TableCell style={{ padding: '4px' }}>{record.name}</TableCell> */}
                                        <TableCell style={{ padding: '4px' }}>{record.dob}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{record.placeOfBirth}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{record.pan}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{record.directorsIdentificationNumber}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{record.score}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <IconButton onClick={() => handleIconClick(record,)} style={{ padding: '1px' }}>
                                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                searchError && (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                {records.length === 0 ? "Your search has not returned any results." : "At least one search parameter is required."}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Dialog className='MuiDialog-root'
                open={openDialog}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="md"
            // PaperProps={{
            //   style: {
            //     minHeight: '500px',  
            //     maxHeight: '90vh',  
            //   }
            // }}
            >
                <DialogContent >
                    <Box   >


                        {/* </div> */}
                        <DialogTitle className="custom-dialog-title">Remarks and Actions</DialogTitle>
                        <FormControl className="custom-textfield .MuiInputBase-root" fullWidth margin="normal">
                            <InputLabel className="custom-textfield .MuiInputBase-root">Status</InputLabel>
                            <Select className="custom-textfield .MuiInputBase-root"
                                size='small'
                                value={selectedAction}
                                onChange={handleStatusChange}
                                label="Status"
                            >
                                {levelStatus.map((status: any) => (
                                    <MenuItem className="custom-menu-item" key={status.id} value={status.id}>
                                        {status.status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedAction && (
                            <TextField className="custom-textfield .MuiInputBase-root"
                                size='small'
                                autoFocus
                                margin="dense"
                                id="outlined-multiline-static"
                                label="Remarks"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                value={remarks}
                                defaultValue="Default Value"
                                onChange={handleRemarksChange}
                                style={{ maxHeight: '150px' }}
                            />
                        )}

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    {selectedAction && (
                        <Button onClick={handleRemarksSubmit} variant="contained" color="primary">
                            Save
                        </Button>
                    )}
                </DialogActions>
                <br></br>

            </Dialog>
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullWidth
                maxWidth="lg"
            >
                <DialogContent>
                    {modalContent}
                </DialogContent>
                <DialogActions>
                    <button type="button" className="btn btn-outline-primary" onClick={() => setIsModalOpen(false)}>Close</button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position the Snackbar in the top-right
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>


        </>
    );
};

export default SearchComponent;
