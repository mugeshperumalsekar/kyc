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
import LevelStatusMappingApiService from '../../../data/services/cms_search/levelstatusmapping/levelstatusmapping-api-service';
import DocumentApiService from '../../../data/services/master/document/Document_api_service';
import SearchApiService from '../../../data/services/pep_search/search-api-service';
import HitdatalifecycleApiService from '../../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';

interface Status {
    id: string;
    name: string;
}

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
}

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

export interface CmscHitSearchData {
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
    const [combinedCmsctionData, setCombinedCmsctionData] = useState<(CmsctionSearchData & { isScreening: number })[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowscms, setSelectedRowscms] = useState<{ [key: string]: boolean }>({});
    const [sanctionDetails, setPepctionDetails] = useState<any>(null);
    const [expandedCmsctionRowId, setExpandedCmsctionRowId] = useState<number | null>(null);
    const [rowHitCmsctionRecordData, setRowHitCmsctionRecordData] = useState<Record<number, CmscHitSearchData[]> | null>(null);
    const [cmsctionDetails, setcmsctionDetails] = useState<any>(null);
    const [selectedAction, setSelectedAction] = useState<string>('0');
    const [remarks, setRemarks] = useState('');
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const { id, ids, uid } = useParams();
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const isAllScreenedcms = combinedCmsctionData.every(row => row.isScreening === 1);

    const levelService = new LevelStatusMappingApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
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
                fetchcmsctiomCombinedData(numericKycId);
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
    }, [kycId]);

    const fetchLevelStatus = async () => {
        try {
            const results = await levelService.getLevelOneData(loginDetails);
            console.log("dd:", results)
            setLevelStatus(results);
        } catch (error) {
            console.error("Error fetching level statuses:", error);
        }
    };

    const fetchcmsctiomCombinedData = async (kycId: number) => {
        try {
            const sanResponse: CmsctionSearchData[] = await documentApiService.getName(kycId);
            const screenedPepctionResponse: CmsctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataCriminal(kycId);
            const combinedPepction = sanResponse.map((item: CmsctionSearchData) => {
                const screeningStatus = screenedPepctionResponse.find((screenedItem: CmsctionGetScreenedSearchDetails) =>
                    screenedItem.kycId === item.kycId && screenedItem.screeningType === item.screeningType
                );
                return {
                    ...item,
                    isScreening: screeningStatus ? screeningStatus.isScreening : 0
                };
            }).filter(item => item.answer);
            if (combinedPepction.length === 0) {
                throw new Error("No valid sanction data available for the given kycId.");
            }
            setCombinedCmsctionData(combinedPepction);
        } catch (error) {
            console.error("Error fetching or processing sanction data:", error);
        }
    };

    const handleCheckboxChangecms = (kycId: number, screeningType: number) => {
        setSelectedRowscms(prev => {
            const updatedValue = {
                ...prev,
                [`${kycId}-${screeningType}`]: !prev[`${kycId}-${screeningType}`]
            };
            console.log("Previous State:", prev);
            console.log("Updated State:", updatedValue);
            return updatedValue;
        });
    };

    const handleScreeningcms = async (kycId: number, screeningType: number, row: any) => {
        try {
            setLoading(true);
            setSelectedRowscms(prev => ({
                ...prev,
                [`${kycId}-${screeningType}`]: false
            }));
            const data = [
                {
                    searchDTO: {
                        name: row.answer,
                        searchingScore: 80,
                        uid: row.id,
                        kycId: kycId,
                        screeningType: row.screeningType,
                        applicantFormId: row.applicantFormId,
                        isScreening: 1,
                        recordTypeId: row.recordTypeId,
                    }
                }
            ];
            await documentApiService.createKycDetailsCriminal(data);
            const updatedScreenedDataPepction: CmsctionGetScreenedSearchDetails[] = await documentApiService.getScreenedDataCriminal(kycId);
            setScreenedRows(updatedScreenedDataPepction.filter(item => item.isScreening === 1).map(item => item.kycId));
            setCombinedCmsctionData(prevData =>
                prevData.map(row =>
                    row.kycId === kycId && row.screeningType === screeningType
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

    const handleRowClickcms = async (kycId: number, stype: number) => {
        if (expandedCmsctionRowId === stype) {
            setExpandedCmsctionRowId(null);
        } else {
            if (rowHitCmsctionRecordData === null || !rowHitCmsctionRecordData[stype] || rowHitCmsctionRecordData[stype].length === 0) {
                try {
                    setLoading(true);
                    const data = await searchApiService.getCriminalHitRecordSearch(kycId);
                    if (data && data.length > 0) {
                        setRowHitCmsctionRecordData(prev => ({
                            ...(prev || {}),
                            [stype]: data,
                        }));
                        setcmsctionDetails(data);
                    }
                    setExpandedCmsctionRowId(stype);
                } catch (error) {
                    console.error('Error fetching hit record data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setExpandedCmsctionRowId(stype);
            }
        }
    };

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

    const handleRemarksSubmitcms = async () => {
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
            <h4 style={{ marginTop: '1%' }}>CRIMINAL</h4>
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
                        {combinedCmsctionData.map((row, index) => (
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
                                        onClick={() => row.isScreening === 1 && handleRowClickcms(row.kycId, row.screeningType)}
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
                                            checked={selectedRowscms[`${row.kycId}-${row.screeningType}`] || false}
                                            onChange={() => handleCheckboxChangecms(row.kycId, row.screeningType)}
                                            disabled={row.isScreening === 1}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleScreeningcms(row.kycId, row.screeningType, row)}
                                            disabled={
                                                !selectedRowscms[`${row.kycId}-${row.screeningType}`] || row.isScreening === 1
                                            }
                                        >
                                            Screen
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {/* Row Click user data part */}
                                {loading && <Loader />}
                                {expandedCmsctionRowId === row.screeningType && (
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
                                                            {rowHitCmsctionRecordData && rowHitCmsctionRecordData[row.screeningType]?.length > 0 ? (
                                                                rowHitCmsctionRecordData[row.screeningType].map((record, recordIndex) => (
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
                                                                <Typography align="center">
                                                                    No screening records available
                                                                </Typography>
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
                                for (const row of combinedCmsctionData) {
                                    if (row.isScreening !== 1) {
                                        await handleScreeningcms(row.kycId, row.screeningType, row);
                                    }
                                }
                            } catch (error) {
                                console.error('Error while bulk screening:', error);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading || isAllScreenedcms}
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
                <DialogContent >
                    <Box >
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
                        <Button onClick={handleRemarksSubmitcms} variant="contained" color="primary">
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