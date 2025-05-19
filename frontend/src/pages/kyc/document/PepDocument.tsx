import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, TextField } from '@mui/material';
import DocumentApiService from '../../../data/services/master/document/Document_api_service';
import SearchApiService from '../../../data/services/pep_search/search-api-service';
import HitdatalifecycleApiService from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Loader from '../../loader/loader';
import LevelStatusMappingApiService from '../../../data/services/san_search/levelstatusmapping/levelstatusmapping-api-service';
import Pepscreen from './Pepscreen';
import Cmsscreen from './Cmsscreen';

interface Status {
    id: string;
    name: string;
};

interface SanctionSearchData {
    id: number;
    question: string;
    answer: string;
    name: string;
    searchingScore: number;
    uid: number;
    kycId: number;
    screeningType: number;
    searchId: string;
    hitId: string;
    criminalId: string;
    applicantFormId: number;
};

interface SanctionGetScreenedSearchDetails {
    id: number;
    question: string;
    answer: string;
    kycId: number;
    screeningType: number;
    applicantFormId: number;
    isScreening: number;
    searchId: string;
    hitId: string;
    criminalId: string;
};

interface RowType {
    kycId: number;
    screeningType: number;
};

interface LevelStatus {
    id: number;
    levelId: number;
    statusId: number;
    uid: number;
    status: string;
    passingLevelId: number;
    isAlive: number;
};

export interface SancHitSearchData {
    id: number;
    criminalId: number;
    searchId: number;
    cycleId: number;
    name: string;
    matchingScore: number;
    display: string;
};

interface PepctionSearchData {
    id: number;
    question: string;
    answer: string;
    name: string;
    searchingScore: number;
    uid: number;
    kycId: number;
    screeningType: number;
    searchId: string;
    hitId: string;
    criminalId: string;
};

interface PepctionGetScreenedSearchDetails {
    id: number;
    question: string;
    answer: string;
    kycId: number;
    screeningType: number;
    applicantFormId: number;
    isScreening: number;
    searchId: string;
    hitId: string;
    criminalId: string;
};

export interface PepcHitSearchData {
    id: number;
    criminalId: number;
    searchId: number;
    cycleId: number;
    name: string;
    matchingScore: number;
    display: string;
};

interface CmsctionSearchData {
    id: number;
    question: string;
    answer: string;
    name: string;
    searchingScore: number;
    uid: number;
    kycId: number;
    screeningType: number;
    searchId: string;
    hitId: string;
    criminalId: string;
};

interface CmsctionGetScreenedSearchDetails {
    id: number;
    question: string;
    answer: string;
    kycId: number;
    screeningType: number;
    applicantFormId: number;
    isScreening: number;
    searchId: string;
    hitId: string;
    criminalId: string;
};

export interface CmscHitSearchData {
    id: number;
    criminalId: number;
    searchId: number;
    cycleId: number;
    name: string;
    matchingScore: number;
    display: string;
};

interface SearchResults {
    status: boolean;
    id: number;
    name: string;
    searchingScore: number;
    listId: number;
    typeId: number;
    stateId: number;
    countryId: number;
    identity: number;
    levelId: number;
    uid: number;
    valid: number;
    kycId: number;
    applicantFormId: number;
    screeningType: number;
    isScreening: number;
};

function Document() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const userId = loginDetails.uid;
    const { kycId }: { kycId?: string | number } = useParams();
    console.log('Sanctions kycId:', kycId);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const [screenedRows, setScreenedRows] = useState<number[]>([]);
    const [combinedSanctionData, setCombinedSanctionData] = useState<(SanctionSearchData & { isScreening: number })[]>([]);
    const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>({});
    const [sanctionDetails, setSanctionDetails] = useState<any>(null);
    const [expandedSanctionRowId, setExpandedSanctionRowId] = useState<number | null>(null);
    const [rowHitSanctionRecordData, setRowHitSanctionRecordData] = useState<Record<number, SancHitSearchData[]> | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('0');
    const [remarks, setRemarks] = useState('');
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const isAllScreenedsan = combinedSanctionData.every(row => row.isScreening === 1);
    const { id, ids, uid } = useParams();
    const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

    const levelService = new LevelStatusMappingApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitdatalifecycleApiServicepep = new HitdatalifecycleApiService();
    const documentApiService = new DocumentApiService();
    const searchApiService = new SearchApiService();

    useEffect(() => {
        const savedScreenedRows = localStorage.getItem('screenedRows');
        if (savedScreenedRows) {
            const parsedScreenedRows = JSON.parse(savedScreenedRows);
            if (Array.isArray(parsedScreenedRows)) {
                setScreenedRows(parsedScreenedRows.filter(id => id !== null));
            } else {
                console.error('Invalid data in local storage:', parsedScreenedRows);
            }
        }
        if (kycId) {
            const numericKycId = Number(kycId);
            if (!isNaN(numericKycId)) {
                fetchSanctiomCombinedData(numericKycId);
            } else {
                console.error('Invalid kycId, cannot fetch sanction or PEP data');
            }
        } else {
            console.error('kycId is undefined, cannot fetch sanction or PEP data');
        }
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
        }
    }, [kycId]);

    useEffect(() => {
        fetchLevelStatus();
        fetchSearchResults();
    }, [kycId]);

    const fetchLevelStatus = async () => {
        try {
            const results = await levelService.getLevelOneData(loginDetails);
            console.log("fetchLevelStatus:", results);
            setLevelStatus(results);
        } catch (error) {
            console.error("Error fetching level statuses:", error);
        }
    };

    const fetchSearchResults = async () => {
        try {
            const results = await documentApiService.getsanSearchResult();
            console.log('fetchSearchResults:', results);
            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching the fetchSearchResults:", error);
        }
    };

    // Table contain data part
    const fetchSanctiomCombinedData = async (kycId: number) => {
        try {
            const sanResponse: SanctionSearchData[] = await documentApiService.getName(kycId);
            const screenedSanctionResponse: SanctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataSanction(kycId);
            const searchResultsData = await documentApiService.getsanSearchResult();

            // Map screening status
            const combinedSanction = sanResponse.map((item: SanctionSearchData) => {
                const screeningStatus = screenedSanctionResponse.find((screenedItem: SanctionGetScreenedSearchDetails) =>
                    screenedItem.kycId === item.kycId && screenedItem.screeningType === item.screeningType
                );

                // Check if the item matches with searchResults
                const isMatched = searchResultsData.some((searchItem: SearchResults) =>
                    searchItem.screeningType === item.screeningType &&
                    searchItem.kycId === item.kycId &&
                    searchItem.name === item.answer &&
                    searchItem.applicantFormId === item.applicantFormId
                );
                return {
                    ...item,
                    isScreening: isMatched ? 1 : (screeningStatus ? screeningStatus.isScreening : 0),
                };
            }).filter(item => item.answer);

            if (combinedSanction.length === 0) {
                throw new Error("No valid sanction data available for the given kycId.");
            }

            setCombinedSanctionData(combinedSanction);
        } catch (error) {
            console.error("Error fetching or processing sanction data:", error);
        }
    };

    const handleCheckboxChange = (kycId: number, screeningType: number, applicantFormId: number) => {
        setSelectedRows(prev => {
            const updatedValue = {
                ...prev,
                [`${kycId}-${screeningType}-${applicantFormId}`]: !prev[`${kycId}-${screeningType}-${applicantFormId}`]
            };
            console.log("Previous State:", prev);
            console.log("Updated State:", updatedValue);
            return updatedValue;
        });
    };
    // const handleCheckboxChange = (kycId: number, screeningType: number, applicantFormId: number) => {
    //     setSelectedRows(prev => ({
    //         ...prev,
    //         [`${kycId}-${screeningType}-${applicantFormId}`]: !prev[`${kycId}-${screeningType}-${applicantFormId}`]
    //     }));
    // };

    const handleScreening = async (kycId: number, screeningType: number, applicantFormId: number, row: any) => {
        try {
            setLoading(true);
            setSelectedRows(prev => ({
                ...prev,
                [`${kycId}-${screeningType}-${applicantFormId}`]: false
            }));
            const data = {
                name: row.answer,
                searchingScore: 80,
                uid: row.id,
                kycId: kycId,
                screeningType: row.screeningType,
                applicantFormId: row.applicantFormId,
                isScreening: 1,
            };
            await documentApiService.createKycDetailsSanction([data]);
            const updatedScreenedDataSanction: SanctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataSanction(kycId);
            setScreenedRows(updatedScreenedDataSanction.filter(item => item.isScreening === 1).map(item => item.kycId));
            setCombinedSanctionData(prevData =>
                prevData.map(row =>
                    row.kycId === kycId && row.screeningType === screeningType && row.applicantFormId === applicantFormId
                        ? { ...row, isScreening: 1 }
                        : row
                )
            );
        } catch (error) {
            console.error('API error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = async (kycId: number, stype: number) => {
        if (expandedSanctionRowId === stype) {
            setExpandedSanctionRowId(null);
        } else {
            // if (!rowHitSanctionRecordData || !rowHitSanctionRecordData[applicantFormId] || rowHitSanctionRecordData[applicantFormId].length === 0) {
            if (rowHitSanctionRecordData === null || !rowHitSanctionRecordData[stype] || rowHitSanctionRecordData[stype].length === 0) {
                try {
                    setLoading(true);
                    const data = await searchApiService.getSanctionHitRecordSearch(kycId);
                    console.log('HandleRowClicks for san:', data);
                    if (data && data.length > 0) {
                        setRowHitSanctionRecordData(prev => ({
                            ...(prev || {}),
                            [stype]: data,
                            // [applicantFormId]: data,
                        }));
                        setSanctionDetails(data);
                    }
                    // setExpandedSanctionRowId(applicantFormId);
                    setExpandedSanctionRowId(stype);
                } catch (error) {
                    console.error('Error fetching hit record data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // setExpandedSanctionRowId(applicantFormId);
                setExpandedSanctionRowId(stype);
            }
        }
    };

    const handleSanctionIconClick = (recordIndex: number) => {
        setSelectedRow(recordIndex);
        setOpenDialog(true);
    };

    const handleIconClick = (record: any & { isScreening: number }, index: number) => {
        setSelectedRow(record);
        console.log("Selected action:", record);
        setOpenDialog(true);
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

    const handleRemarksSubmit = async () => {
        if (selectedRow) {
            const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));
            if (!selectedStatus) {
                console.error("Selected status not found.");
                return;
            }
            const hitrecordlifecyclePayload = {
                search_id: Number(selectedRow.searchId),
                hitdata_id: Number(selectedRow.id),
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
                console.log("Selected action:", selectedAction);
                console.log("Remarks:", remarks);
                console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
                setOpenDialog(false);
                setSnackbarMessage('Saved successfully!');
                setOpenSnackbar(true);
                setSelectedAction('');
                setRemarks('');
            } catch (error) {
                console.error("Error while submitting remarks:", error);
                setSnackbarMessage('Failed to save data. Please try again.');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <Box m={4}>
                <h4 style={{ marginTop: '1%' }}>SANCTION</h4>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>S.No</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Name List</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Screening Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {combinedSanctionData.map((row, index) => (
                                <React.Fragment key={`${row.kycId}-${row.screeningType}`}>
                                    <TableRow
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                                            '&:hover': { backgroundColor: '#e3f2fd' },
                                            transition: 'background-color 0.3s ease',
                                            height: 48,
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.question}</TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: row.isScreening === 1 ? 'pointer' : 'default',
                                                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                                                '&:hover': row.isScreening === 1 ? { backgroundColor: '#e3f2fd' } : {},
                                                transition: 'background-color 0.3s ease',
                                                height: 48,
                                            }}
                                            onClick={() => row.isScreening === 1 && handleRowClick(row.kycId, row.screeningType)}
                                        >
                                            {row.answer}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                style={{
                                                    color: row.isScreening === 1 ? 'green' : 'red',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {row.isScreening === 1 ? 'SCREENED' : 'NOT SCREENED'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedRows[`${row.kycId}-${row.screeningType}-${row.applicantFormId}`] || false}
                                                onChange={() => handleCheckboxChange(row.kycId, row.screeningType, row.applicantFormId)}
                                                disabled={row.isScreening === 1}
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleScreening(row.kycId, row.screeningType, row.applicantFormId, row)}
                                                disabled={
                                                    !selectedRows[`${row.kycId}-${row.screeningType}-${row.applicantFormId}`] || row.isScreening === 1
                                                }
                                            >
                                                Screen
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {/* Row Click user data part */}
                                    {loading && <Loader />}
                                    {expandedSanctionRowId === row.applicantFormId && (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ padding: 0 }}>
                                                <Box
                                                    sx={{
                                                        padding: 2,
                                                        backgroundColor: '#f5f5f5',
                                                        borderTop: '1px solid #e0e0e0',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Typography variant="h6">Screening Record</Typography>
                                                    <Box
                                                        sx={{
                                                            maxHeight: 300,
                                                            overflowY: 'auto',
                                                            border: '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Name</TableCell>
                                                                    <TableCell>Matching Score</TableCell>
                                                                    <TableCell>Display</TableCell>
                                                                    <TableCell>Status</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {rowHitSanctionRecordData && rowHitSanctionRecordData[row.screeningType]?.length > 0 ? (
                                                                    rowHitSanctionRecordData[row.screeningType].map((record, recordIndex) => (
                                                                        <TableRow key={recordIndex}>
                                                                            <TableCell>{record.name}</TableCell>
                                                                            <TableCell>{record.matchingScore}</TableCell>
                                                                            <TableCell>{record.display}</TableCell>
                                                                            <TableCell> <IconButton onClick={() => handleIconClick(record, index)} style={{ padding: '1px' }}>
                                                                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                                                            </IconButton></TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} align="center">
                                                                            No screening records available
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    for (const row of combinedSanctionData) {
                                        if (row.isScreening !== 1) {
                                            await handleScreening(row.kycId, row.screeningType, row.applicantFormId, row);
                                        }
                                    }
                                } catch (error) {
                                    console.error('Error while bulk screening:', error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading || isAllScreenedsan}
                        >
                            Screening
                        </Button>
                        {loading && <Loader />}
                    </Box>
                </TableContainer>
                <Dialog className='MuiDialog-root'
                    open={openDialog}
                    onClose={handleDialogClose}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogContent>
                        <Box>
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
                <Cmsscreen />
                <Pepscreen />
            </Box>
        </div>
    );
}

export default Document;