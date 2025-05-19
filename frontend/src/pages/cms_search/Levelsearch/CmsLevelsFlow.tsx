import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent, Box, FormControl, InputLabel, TextField, Grid, Slider, Typography } from '@mui/material';
import ViewService from '../../../data/services/cms_search/viewpage/view_api_service';
import Header from '../../../layouts/header/header';
import LevelStatusMappingApiService from '../../../data/services/pep_search/levelstatusmapping/levelstatusmapping-api-service';
import { useSelector } from 'react-redux';
import levelApiService from '../../../data/services/cms_search/level/level-api-service';
import HitdatalifecycleApiService from '../../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useReactToPrint } from 'react-to-print';
import { Snackbar, Alert } from '@mui/material';
import ViewPageDetailsService from '../../../data/services/viewservice/viewpagedetails-api-service';
import { RecordTypeData } from '../../../data/services/Search/search-payload';
import SearchService from '../../../data/services/Search/search-api-service';
import { RecordDTO } from '../../../data/services/viewservice/viewpagedetails-payload';
import Entityview from '../../CmsView/Entityview';
import Individualview from '../../CmsView/Individualview';
import Shipview from '../../CmsView/Shipview';
import Aircraftview from '../../CmsView/Aircraftview';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



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
        cmsId: 0,
        cmsName: '',
        cmsRecordType: '',
        score: 0,
        recordTypeId: 0,
        criminalId: 0,
        searchId: 0,
        hitId: 0,
        uid: loginDetails.id,
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
    // const [selectedRow, setSelectedRow] = useState<any>([])
    const [selectedRow, setSelectedRow] = useState<RecordDTO | null>(null);

    const [searchError, setSearchError] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [RecordType, setRecordType] = useState<RecordTypeData[]>([
    ]);
    const viewservice = new ViewPageDetailsService();
    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);
    const [disabledRows, setDisabledRows] = useState<number[]>([]);
    const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});



    const hitdatalifecycleApiService = new HitdatalifecycleApiService();

    const recordtype = new SearchService();
    const customer = new ViewService();
    const levelService = new LevelStatusMappingApiService();
    const levelServices = new levelApiService();
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchLevelStatus();
        fetchLevels()
        fetchAll();

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
    const fetchAll = async () => {
        try {
            const AllData = await recordtype.getRecoredType();
            setRecordType(AllData);
            console.log("reco:", AllData)
        } catch (error) {
            console.error("Error fetching country list:", error);
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
            name: formData.cmsName, // Name from form data
            searchingScore: sliderValue, // Score from slider
            recordTypeId: selectedRecordType, // Selected record type
            kycId: 1, // KYC ID, populate if necessary
            applicantFormId: '', // Applicant Form ID, populate if necessary
            screeningType: 1, // Set screening type as needed
            uid: loginDetails.id, // User ID from login details
        };

        try {
            setLoading(true); // Set loading state to true

            // Validate input before making the API call
            if (!formData.cmsName && sliderValue === 100) {
                setSearchError(true); // Set search error state if validation fails
                setLoading(false); // Reset loading state
                return; // Exit the function early
            }

            // Call the service to get the record count
            const result = await viewservice.getRecordsCountCms(searchDTO);
            console.log("Form data result:", result);

            // Check if the result is an array and has records
            if (Array.isArray(result) && result.length > 0) {
                setRecords(result); // Update records state
                setSearchError(false); // Clear search error state
            } else {
                setSearchError(true); // Set search error if no records found
                setRecords([]); // Reset records state to empty array
            }
        } catch (error) {
            console.error('Error fetching records:', error); // Log the error
            setSearchError(true); // Set search error state
        } finally {
            setLoading(false); // Always reset loading state
        }
    };

    const handleReset = () => {
        setFormData({
            ...formData,
            cmsName: '',
            recordTypeId: 0,

        });
        setSliderValue(80);

        setRecords([]);
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
    const handleRecordTypeChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedRecordType(typeof value === 'string' ? parseInt(value) : value);
    };
    const getCountryNameById = (recordTypeId: number) => {
        const recordType = RecordType.find((c) => c.id === recordTypeId);
        // console.log("cc:",recordType)
        return recordType ? recordType.name : 'Not Available';

    };
    const handleIconClick = (index: RecordDTO,) => {
        // alert(` recordTypeId: ${index.recordTypeId}`);
        setSelectedRow(index);
        setOpenDialog(true);
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
                setLoading(true);

                await hitdatalifecycleApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
                setRecords(prevRecords => prevRecords.filter(row => row.cmsId !== selectedRow.cmsId));


                // If success, close dialog, show success snackbar, and disable the row
                setOpenDialog(false);
                setSnackbarMessage('Saved successfully!');
                setOpenSnackbar(true);
                setSelectedAction(''); // Reset selected action
                setRemarks('');

                // Disable the row
                setDisabledRows((prev) => [...prev, selectedRow.cmsId]);

                // Update the selected action for the row
                setSelectedActions((prev) => ({
                    ...prev,
                    [selectedRow.cmsId]: selectedAction // Store the selected action by cmsId
                }));

            } catch (error) {
                console.error("Error while submitting remarks:", error);
                setSnackbarMessage('Failed to save data. Please try again.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        }
    };


    const handleTableRowClick = (
        cmsId: any,

        recordTypeId: any,
    ) => {
        const id = String(cmsId);
        const uid = loginDetails.id;

        setIsModalOpen(true);

        // alert('uid: ' + uid + ', recordTypeId: ' + recordTypeId + ', cmsId: ' + cmsId);

        // Pass the props when setting the dialog component
        switch (recordTypeId) {
            case 1:
                setModalContent(<Entityview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            case 2:
                setModalContent(<Individualview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            case 3:
                setModalContent(<Shipview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            case 4:
                setModalContent(<Aircraftview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
                break;
            default:
                setModalContent(null);
        }
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
                Name: row.cmsName,
                RecordType: getCountryNameById(row.recordTypeId),
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

                <div style={{
                    display: 'flex', gap: '2%',

                }}>
                    <FormControl className="custom-textfield .MuiInputBase-root" style={{
                        width: '50%',

                    }}>
                        <InputLabel className="custom-textfield .MuiInputBase-root" htmlFor="record-type">Type</InputLabel>
                        <Select className="custom-textfield .MuiInputBase-root" style={{
                        }}
                            label="Type"
                            size='small'
                            variant="outlined"
                            value={selectedRecordType}
                            onChange={handleRecordTypeChange}
                        >

                            {RecordType.map((item) => (
                                <MenuItem className="custom-menu-item" key={item.id} value={item.id.toString()}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField className="custom-textfield .MuiInputBase-root"
                        style={{ width: '50%' }}
                        label="Name"
                        id="Name"
                        size='small'
                        variant="outlined"
                        type="text"
                        name="name"
                        autoComplete="off"
                        value={formData.cmsName}
                        onChange={(e) => setFormData({ ...formData, cmsName: e.target.value })}
                    />



                    <Slider className="custom-textfield .MuiInputBase-root"
                        style={{ width: '50%' }}
                        value={Math.round(sliderValue)}
                        onChange={(e, newValue) => {
                            setSliderValue(newValue as number);
                        }}
                        aria-labelledby="discrete-slider"
                        step={1}
                        marks
                        min={50}
                        max={100}
                    />

                    <TextField className="custom-textfield .MuiInputBase-root"
                        style={{ width: '20%' }}
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
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3%', }} >

                        < Button className='allbutton'
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
                    </div>
                </div>
            </Card >
            <br />

            <h6 className='allheading'> LOOKUP RESULTS ({records.length})</h6>
            <div ref={Ref}>
                <TableContainer className="table-container" component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
                    <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                            <TableRow className="tableHeading">
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '20px' }}>S.No</TableCell>

                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} >Name </TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} >RecordType</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }}>Score</TableCell>
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

                                    <TableRow key={record.cmsId} style={{ height: '32px' }}>
                                        <TableCell style={{ padding: '4px' }}>{index + 1}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!disabledRows.includes(record.cmsId)) {
                                                        handleTableRowClick(Number(record.cmsId), record.recordTypeId);
                                                    }
                                                }}
                                                style={{
                                                    cursor: disabledRows.includes(record.cmsId) ? 'not-allowed' : 'pointer',
                                                    color: disabledRows.includes(record.cmsId) ? 'gray' : '#1677FF',
                                                    textDecoration: 'underline',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {record.cmsName.charAt(0).toUpperCase() + record.cmsName.slice(1)}
                                            </a>

                                        </TableCell>
                                        {/* <TableCell style={{ padding: '4px' }}>{record.name}</TableCell> */}
                                        <TableCell style={{ padding: '4px' }}>{getCountryNameById(record.recordTypeId)}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{record.score}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <IconButton
                                                onClick={() => handleIconClick(record)}
                                                style={{ padding: '1px' }}
                                                disabled={disabledRows.includes(record.cmsId)}
                                            >
                                                {disabledRows.includes(record.cmsId) ? (
                                                    <VisibilityOffIcon style={{ color: 'red' }} />
                                                ) : (
                                                    <VisibilityIcon
                                                        style={{
                                                            color: 'green',
                                                            fontSize: '16px',
                                                        }}
                                                    />
                                                )}

                                            </IconButton>
                                            {selectedActions[record.cmsId] && (
                                                <span style={{
                                                    color: levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status === "Close" ? "green" :
                                                        levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status === "Escalation" ? "red" :
                                                            levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status === "Request For Information" ? "yellow" :
                                                                "black" // Default color if no match
                                                }}>
                                                    {levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status || "No Status Selected"}
                                                </span>
                                            )}


                                            {/* {selectedActions[record.cmsId] && (
                                                <span>
                                                    {(() => {
                                                        const actionId = parseInt(selectedActions[record.cmsId]);
                                                        const statusObj = levelStatus.find(status => status.id === actionId);
                                                        if (statusObj) {
                                                            switch (statusObj.status) {
                                                                case 'Close':
                                                                    return <span style={{ color: 'green' }}>Close</span>;
                                                                case 'Escalation':
                                                                    return <span style={{ color: 'red' }}>Escalation</span>;
                                                                case 'Request For Information':
                                                                    return <span style={{ color: 'yellow' }}>Request For Information</span>;
                                                                default:
                                                                    return <span>No Status Selected</span>;
                                                            }
                                                        } else {
                                                            return <span>No Status Selected</span>;
                                                        }
                                                    })()}
                                                </span>
                                            )} */}

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
