import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, TextField, Box, Button, IconButton, Paper, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Loader from '../../loader/loader';
import LevelStatusMappingApiService from '../../../data/services/pep_search/levelstatusmapping/levelstatusmapping-api-service';
import DocumentApiService from '../../../data/services/master/document/Document_api_service';
import SearchApiService from '../../../data/services/pep_search/search-api-service';
import HitdatalifecycleApiService from '../../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';

interface Status {
    id: string;
    name: string;
}

interface PepctionSearchData {
    applicantFormId: number;
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
}

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
}

interface RowType {
    kycId: number;
    screeningType: number;
}

interface LevelStatus {
    id: number;
    levelId: number;
    statusId: number;
    uid: number;
    status: string;
    passingLevelId: number;
    isAlive: number;
}

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

export interface PepcHitSearchData {
    id: number;
    criminalId: number;
    searchId: number;
    cycleId: number;
    name: string;
    matchingScore: number;
    display: string;
}

function Document() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const userId = loginDetails.uid;
    const { kycId }: { kycId?: string | number } = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const [screenedRows, setScreenedRows] = useState<number[]>([]);
    const [combinedPepctionData, setCombinedPepctionData] = useState<(PepctionSearchData & { isScreening: number })[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowspep, setSelectedRowspep] = useState<{ [key: string]: boolean }>({});
    const [sanctionDetails, setPepctionDetails] = useState<any>(null);
    const [expandedPepctionRowId, setExpandedPepctionRowId] = useState<number | null>(null);
    const [rowHitPepctionRecordData, setRowHitPepctionRecordData] = useState<Record<number, PepcHitSearchData[]> | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('0');
    const [remarks, setRemarks] = useState('');
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const { id, ids, uid } = useParams();
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const isAllScreened = combinedPepctionData.every(row => row.isScreening === 1);

    const levelService = new LevelStatusMappingApiService();
    const searchApiService = new SearchApiService();
    const documentApiService = new DocumentApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();

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
                fetchPepctiomCombinedData(numericKycId);
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
            const results = await levelService.getpepScreeningLevelOneData(loginDetails);
            console.log("dd:", results);
            setLevelStatus(results);
        } catch (error) {
            console.error("Error fetching level statuses:", error);
        }
    };

    const fetchSearchResults = async () => {
        try {
            const results = await documentApiService.getpepSearchResult();
            console.log('fetchSearchResults:', results);
            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching the fetchSearchResults:", error);
        }
    };

    // Table contain data part
    const fetchPepctiomCombinedData = async (kycId: number) => {
        try {
            const sanResponse: PepctionSearchData[] = await documentApiService.getName(kycId);
            const screenedPepctionResponse: PepctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataPep(kycId);
            const searchResultsData = await documentApiService.getpepSearchResult();

            // Map screening status
            const combinedPepction = sanResponse.map((item: PepctionSearchData) => {
                const screeningStatus = screenedPepctionResponse.find(
                    (screenedItem: PepctionGetScreenedSearchDetails) =>
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

            if (combinedPepction.length === 0) {
                throw new Error("No valid sanction data available for the given kycId.");
            }

            setCombinedPepctionData(combinedPepction);
        } catch (error) {
            console.error("Error fetching or processing sanction data:", error);
        }
    };

    // const fetchPepctiomCombinedData = async (kycId: number) => {
    //     try {
    //         const sanResponse: PepctionSearchData[] = await documentApiService.getName(kycId); //kyc Screening Status name get
    //         const screenedPepctionResponse: PepctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataPep(kycId);
    //         const combinedPepction = sanResponse.map((item: PepctionSearchData) => {
    //             const screeningStatus = screenedPepctionResponse.find((screenedItem: PepctionGetScreenedSearchDetails) =>
    //                 screenedItem.kycId === item.kycId && screenedItem.screeningType === item.screeningType
    //             );
    //             return {
    //                 ...item,
    //                 isScreening: screeningStatus ? screeningStatus.isScreening : 0
    //             };
    //         }).filter(item => item.answer);
    //         if (combinedPepction.length === 0) {
    //             throw new Error("No valid sanction data available for the given kycId.");
    //         }
    //         setCombinedPepctionData(combinedPepction);
    //     } catch (error) {
    //         console.error("Error fetching or processing sanction data:", error);
    //     }
    // };

    const handleCheckboxChangepep = (kycId: number, screeningType: number, applicantFormId: number) => {
        setSelectedRowspep(prev => {
            const updatedValue = {
                ...prev,
                [`${kycId}-${screeningType}-${applicantFormId}`]: !prev[`${kycId}-${screeningType}-${applicantFormId}`]
            };
            console.log("Previous State:", prev);
            console.log("Updated State:", updatedValue);
            return updatedValue;
        });
    };

    const handleScreeningpep = async (kycId: number, screeningType: number, applicantFormId: number, row: any) => {
        try {
            setLoading(true);
            setSelectedRowspep(prev => ({
                ...prev,
                [`${kycId}-${screeningType}-${applicantFormId}`]: false
            }));
            const data = {
                screenDTO: {
                    name: row.answer,
                    searchingScore: 80,
                    uid: row.id,
                    kycId: kycId,
                    screeningType: row.screeningType,
                    applicantFormId: row.applicantFormId,
                    isScreening: 1,
                }
            };
            await documentApiService.createKycDetails([data]);
            const updatedScreenedDataPepction: PepctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataPep(kycId);
            setScreenedRows(updatedScreenedDataPepction.filter(item => item.isScreening === 1).map(item => item.kycId));
            setCombinedPepctionData(prevData =>
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

    const handleRowClickpep = async (kycId: number, stype: number) => {
        if (expandedPepctionRowId === stype) {
            setExpandedPepctionRowId(null);
        } else {
            if (rowHitPepctionRecordData === null || !rowHitPepctionRecordData[stype] || rowHitPepctionRecordData[stype].length === 0) {
                try {
                    setLoading(true);
                    const data = await searchApiService.getPepHitRecordSearch(kycId);
                    if (data && data.length > 0) {
                        setRowHitPepctionRecordData(prev => ({
                            ...(prev || {}),
                            [stype]: data,
                        }));
                        setPepctionDetails(data);
                    }
                    setExpandedPepctionRowId(stype);
                } catch (error) {
                    console.error('Error fetching hit record data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setExpandedPepctionRowId(stype);
            }
        }
    };

    // const handleRowClickpep = async (kycId: number, stype: number, applicantFormId?: number) => {
    //     if (expandedPepctionRowId === stype) {
    //         setExpandedPepctionRowId(null);
    //     } else {
    //         if (rowHitPepctionRecordData === null || !rowHitPepctionRecordData[stype] || rowHitPepctionRecordData[stype].length === 0) {
    //             try {
    //                 const data = await searchApiService.getPepHitRecordSearch(kycId);
    //                 if (data && data.length > 0) {
    //                     setRowHitPepctionRecordData(prev => ({
    //                         ...(prev || {}),
    //                         [stype]: data,
    //                     }));
    //                     setPepctionDetails(data);
    //                     setExpandedPepctionRowId(stype);
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching hit record data:', error);
    //             }
    //         } else {
    //             setExpandedPepctionRowId(stype);
    //         }
    //     }
    // };

    const handlePepctionIconClick = (recordIndex: number) => {
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

    const handleRemarksSubmitpep = async () => {
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
            <h4 style={{ marginTop: '1%' }}>PEP</h4>
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
                        {combinedPepctionData.map((row, index) => (
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
                                        onClick={() => row.isScreening === 1 && handleRowClickpep(row.kycId, row.screeningType)}
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
                                            checked={selectedRowspep[`${row.kycId}-${row.screeningType}-${row.applicantFormId}`] || false}
                                            onChange={() => handleCheckboxChangepep(row.kycId, row.screeningType, row.applicantFormId)}
                                            disabled={row.isScreening === 1}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleScreeningpep(row.kycId, row.screeningType, row.applicantFormId, row)}
                                            disabled={
                                                !selectedRowspep[`${row.kycId}-${row.screeningType}-${row.applicantFormId}`] || row.isScreening === 1
                                            }
                                        >
                                            Screen
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {/* Row Click user data part */}
                                {loading && <Loader />}
                                {expandedPepctionRowId === row.applicantFormId && (
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
                                                            {rowHitPepctionRecordData && rowHitPepctionRecordData[row.screeningType]?.length > 0 ? (
                                                                rowHitPepctionRecordData[row.screeningType].map((record, recordIndex) => (
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
                {/* OverAll Screening part */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            setLoading(true);
                            try {
                                for (const row of combinedPepctionData) {
                                    if (row.isScreening !== 1) {
                                        await handleScreeningpep(row.kycId, row.screeningType, row.applicantFormId, row);
                                    }
                                }
                            } catch (error) {
                                console.error('Error while bulk screening:', error);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading || isAllScreened}
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
                        <Button onClick={handleRemarksSubmitpep} variant="contained" color="primary">
                            Save
                        </Button>
                    )}
                </DialogActions>
                <br></br>
            </Dialog>
        </div>
    );
}

export default Document;