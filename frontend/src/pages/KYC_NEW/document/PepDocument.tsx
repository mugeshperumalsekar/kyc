// import { Card } from 'react-bootstrap';
// import { Box, Button, IconButton, Typography } from '@mui/material';
// import { useSelector } from 'react-redux';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, FormControl, InputLabel, TextField } from '@mui/material'
// import { KycCriminalSearchDetails, KycSanSearchDetails, KycSearchDetails, SancHitSearchData } from '../../../data/services/master/document/document_payload';
// import DocumentApiService from '../../../data/services/master/document/Document_api_service';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Replace with your preferred icon
// import SearchApiService from '../../../data/services/pep_search/search-api-service';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import { CmsHitSearchData, PepHitSearchData } from '../../../data/services/pep_search/search-payload';
// import HitdatalifecycleApiService from '../../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
// import HitdatalifecycleApiServices from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
// import HitcaseApiService from '../../../data/services/pep_search/hitcase/hitcase-api-service';
// import HitcaseApiServices from '../../../data/services/san_search/hitcase/hitcase-api-service';
// import statusApiService from '../../../data/services/master/status/status-api-service';
// import PendingAlertApiService from '../../../data/services/pep_search/PendingAlert/pendingalert-api-service';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { SelectChangeEvent } from '@mui/material';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import TablePagination from '@mui/material/TablePagination';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import MuiAlert from '@mui/material/Alert';
// import Checkbox from '@mui/material/Checkbox';


// interface Status {
//     id: string;
//     name: string;
// };

// interface DisabledIcons {
//     [key: string]: boolean;
// };

// interface PepGetSearchDetails {
//     id: number;
//     question: string;
//     answer: string;
//     name: string;
//     searchingScore: number;
//     uid: number;
//     kycId: number;
//     screeningType: number;
// };

// interface SancSearchData {
//     id: number;
//     question: string;
//     answer: string;
//     name: string;
//     searchingScore: number;
//     uid: number;
//     kycId: number;
// };

// interface CriminalSearchData {
//     id: number;
//     question: string;
//     answer: string;
//     name: string;
//     searchingScore: number;
//     uid: number;
//     kycId: number;
// };

// function Document() {

//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const documentApiService = new DocumentApiService();
//     const { kycId }: { kycId?: string | number } = useParams();
//     const [sanctionData, setSanctionData] = useState<SancSearchData[]>([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(3);
//     const [blockedRows, setBlockedRows] = useState<string[]>([]);
//     const startIndex = page * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     const [pepData, setPepData] = useState<PepGetSearchDetails[]>([]);
//     const [statusData, setStatusData] = useState<Status[]>([]);
//     const [criminalData, setCriminalData] = useState<CriminalSearchData[]>([]);
//     const [screenedRows, setScreenedRows] = useState<number[]>([]);
//     const loginDetails = userDetails.loginDetails;
//     const userId = loginDetails.uid;

//     useEffect(() => {
//         console.log('Screened Rows:', screenedRows);
//     }, [screenedRows]);

//     useEffect(() => {
//         fetchStatus();
//         const savedScreenedRows = localStorage.getItem('screenedRows');
//         console.log('Saved Screened Rows from Local Storage:', savedScreenedRows);
//         if (savedScreenedRows) {
//             const parsedScreenedRows = JSON.parse(savedScreenedRows);
//             console.log('Parsed Screened Rows:', parsedScreenedRows);
//             if (Array.isArray(parsedScreenedRows)) {
//                 setScreenedRows(parsedScreenedRows.filter(id => id !== null));
//             } else {
//                 console.error('Invalid data in local storage:', parsedScreenedRows);
//             }
//         }
//         if (kycId) {
//             const numericKycId = Number(kycId);
//             if (!isNaN(numericKycId)) {
//                 fetchSanctionData(numericKycId);
//                 fetchPepData(numericKycId);
//                 fetchCriminalData(numericKycId);
//             } else {
//                 console.error('Invalid kycId, cannot fetch sanction or PEP data');
//             }
//         } else {
//             console.error('kycId is undefined, cannot fetch sanction or PEP data');
//         }
//         const storedBlockedRows = localStorage.getItem('blockedRows');
//         if (storedBlockedRows) {
//             setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
//         }
//     }, [kycId]);

//     const fetchSanctionData = async (kycId: number) => {
//         try {
//             const data = await documentApiService.getName(kycId);
//             const updatedData = data.map((item: any) => ({
//                 ...item,
//                 kycId: kycId
//             }));
//             setSanctionData(updatedData);
//         } catch (error) {
//             console.error('Error fetching sanction data:', error);
//         }
//     };

//     const fetchPepData = async (kycId: number) => {
//         try {
//             const data = await documentApiService.getName(kycId);
//             const updatedData = data.map((item: any) => ({
//                 ...item,
//                 kycId: kycId
//             }));
//             setPepData(updatedData);
//         } catch (error) {
//             console.error('Error fetching PEP data:', error);
//         }
//     };

//     const searchApiService = new SearchApiService();

//     const fetchHitRecordData = async (kycId: number) => {
//         try {
//             const data = await searchApiService.getPepHitSearch(kycId);
//             setRowHitRecordData(data);
//         } catch (error) {
//             console.error('Error fetching hit record data:', error);
//         }
//     };
//     const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
//     const [expandedcriminalRowId, setExpandedCriminalRowId] = useState<number | null>(null);
//     const [expandedSanctionRowId, setExpandedSanctionRowId] = useState<number | null>(null);
//     const [rowHitRecordData, setRowHitRecordData] = useState<Record<number, PepHitSearchData[]> | null>(null);
//     const [rowHitCriminalRecordData, setRowHitCriminalRecordData] = useState<Record<number, CmsHitSearchData[]> | null>(null);
//     const [rowHitSanctionRecordData, setRowHitSanctionRecordData] = useState<Record<number, SancHitSearchData[]> | null>(null);
    
//     const handleRowClick = async (stype: number) => {
     
//         if (expandedRowId === stype) {
//             setExpandedRowId(null);
//         } else {
//             if (rowHitRecordData === null || !rowHitRecordData[stype]) {
//                 try {
//                     const data = await searchApiService.getPepHitRecordSearch(stype);
//                     setRowHitRecordData(prev => ({
//                         ...(prev || {}),
//                         [stype]: data
//                     }));
//                     setSearchResults(data);
//                 } catch (error) {
//                     console.error('Error fetching hit record data:', error);
//                 }
//             }
//             console.log("Row clicked with stype ID:", stype);
//             setExpandedRowId(stype);

//         }
//     };
//     const handleCriminalRowClick = async (rowId: number, kycId: number) => {
//         if (expandedcriminalRowId === rowId) {
//             // Collapse if it's already expanded
//             setExpandedCriminalRowId(null);
//         } else {
//             // Fetch data only if it's not already fetched for this row
//             if (rowHitCriminalRecordData === null || !rowHitCriminalRecordData[rowId]) {
//                 try {
//                     const data = await searchApiService.getPepHitRecordSearch(kycId);
//                     setRowHitCriminalRecordData(prev => ({
//                         ...(prev || {}),
//                         [rowId]: data
//                     }));
//                 } catch (error) {
//                     console.error('Error fetching hit record data:', error);
//                 }
//             }
//             setExpandedCriminalRowId(rowId); // Expand the clicked row
//         }
//     };
//     const handleSanctionRowClick = async (rowId: number, kycId: number) => {
//         if (expandedSanctionRowId === rowId) {
//             // Collapse if it's already expanded
//             setExpandedSanctionRowId(null);
//         } else {
//             // Fetch data only if it's not already fetched for this row
//             if (rowHitSanctionRecordData === null || !rowHitSanctionRecordData[rowId]) {
//                 try {
//                     const data = await searchApiService.getSanctionHitRecordSearch(kycId);
//                     setRowHitSanctionRecordData(prev => ({
//                         ...(prev || {}),
//                         [rowId]: data,
//                     }));
//                     setSearchResult(data);
//                 } catch (error) {
//                     console.error('Error fetching hit record data:', error);
//                 }
//             }
//             setExpandedSanctionRowId(rowId); // Expand the clicked row
//         }
//     };




//     const [isPepScreeningDisabled, setIsPepScreeningDisabled] = useState(false);

//     const handlePepScreeningClick = async () => {
//         if (!kycId) {
//             console.error('kycId is missing');
//             return;
//         }
//         const data: KycSearchDetails[] = pepData.map(row => ({
//             name: row.answer,
//             searchingScore: 80,
//             uid: row.id,
//             kycId: Number(kycId),
//             screeningType:row.screeningType,
//             applicantFormId:row.id,
//             isScreening:1
//         }));
//         try {
//             const response = await documentApiService.createKycDetails(data);
//             setIsPepScreeningDisabled(true);
//         } catch (error) {
//             console.error('API error:', error);
//         }
//     };
//     const handlePepScreeningIconClick = async (row: any) => {
//         if (!kycId) {
//             console.error('kycId is missing');
//             return;
//         }
//         const data: KycSearchDetails = {
//             name: row.answer,
//             searchingScore: 80,
//             uid: row.id,
//             kycId: Number(kycId),
//             screeningType:row.screeningType,
//             applicantFormId:row.applicantFormId,
//             isScreening:1,
//         };
//         try {
//             const response = await documentApiService.createKycDetails([data]);
//             console.log('Data inserted successfully:', response);
//             if (row.id) {
//                 const updatedScreenedRows = [...screenedRows, row.id];
//                 setScreenedRows(updatedScreenedRows);
//                 localStorage.setItem('screenedRows', JSON.stringify(updatedScreenedRows));
//                 console.log('Updated Screened Rows:', updatedScreenedRows);
//             } else {
//                 console.error('Invalid row.id:', row.id);
//             }
//         } catch (error) {
//             console.error('API error:', error);
//         }
//     };

//     const [isSanScreeningDisabled, setIsSanScreeningDisabled] = useState(false);

//     const handleSanScreeningClick = async () => {
//         if (!kycId) {
//             console.error('kycId is missing');
//             return;
//         }
//         const data: KycSanSearchDetails[] = sanctionData.map(row => ({
//             name: row.answer,
//             searchingScore: 80,
//             uid: row.id,
//             kycId: Number(kycId),
//         }));
//         try {
//             const response = await documentApiService.createKycDetailsSan(data);
//             setIsSanScreeningDisabled(true);
//         } catch (error) {
//             console.error('API error:', error);
//         }
//     };
//     const handleSanctionScreeningIconClick = async (row: any) => {
//         if (!kycId) {
//             console.error('kycId is missing');
//             return;
//         }
//         const data: KycSanSearchDetails = {
//             name: row.answer,
//             searchingScore: 80,
//             uid: row.id,
//             kycId: Number(kycId),
//         };
//         try {
//             const response = await documentApiService.createKycDetailsSan([data]);
//             console.log('Data inserted successfully:', response);
//             if (row.id) {
//                 const updatedScreenedRows = [...screenedRows, row.id];
//                 setScreenedRows(updatedScreenedRows);
//                 localStorage.setItem('screenedRows', JSON.stringify(updatedScreenedRows));
//                 console.log('Updated Screened Rows:', updatedScreenedRows);
//             } else {
//                 console.error('san Invalid row.id:', row.id);
//             }
//         } catch (error) {
//             console.error('API error:', error);
//         }
//     };
//     const fetchCriminalData = async (kycId: number) => {
//         try {
//             const data = await documentApiService.getName(kycId);
//             const updatedData = data.map((item: any) => ({
//                 ...item,
//                 kycId: kycId
//             }));
//             setCriminalData(updatedData);
//         } catch (error) {
//             console.error('Error fetching PEP data:', error);
//         }
//     };

//     const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const getStatusName = (action: string) => {
//         const status = statusData.find((status) => status.id === action);
//         if (status) {
//             const statusClassMap: { [key: string]: string } = {
//                 '1': 'green-text',
//                 '2': 'red-text',
//                 '3': 'yellow-text',
//             };
//             const statusClass = statusClassMap[status.id];
//             if (statusClass) {
//                 return (
//                     <span className={statusClass}>
//                         {status.name}
//                     </span>
//                 );
//             } else {
//                 return status.name;
//             }
//         } else {
//             return '';
//         }
//     };
//     const [isCriminalScreeningDisabled, setIsCriminalScreeningDisabled] = useState(false);

//     const handleCriminalScreeningClick = async () => {
//         if (!kycId) {
//             console.error('kycId is missing');
//             return;
//         }
//         const data: KycCriminalSearchDetails[] = criminalData.map(row => ({
//             id: row.id,
//             name: row.answer,
//             matchingScore: 80,
//             searchingScore: 80,
//             uid: row.id,
//             kycId: Number(kycId),
//         }));
//         try {
//             const response = await documentApiService.createKycDetailsCriminal(data);
//             setIsCriminalScreeningDisabled(true);
//         } catch (error) {
//             console.error('API error:', error);
//         }
//     };
//     const handleCriminalScreeningIconClick = async (row: any) => {
//         if (!kycId) {
//             console.error('kycId is missing');
//             return;
//         }

//         const data: KycCriminalSearchDetails = {
//             id: row.id,
//             name: row.answer,
//             matchingScore: 80,
//             searchingScore: 80,
//             uid: row.id,
//             kycId: Number(kycId),
//               screeningType: row.screeningType,
//             applicantFormId: row.applicantFormId,
//             isScreening: 1

//         };

//         try {
//             const response = await documentApiService.createKycDetailsCriminal([data]);
//             console.log('Data inserted successfully:', response);

//             if (row.id) {
//                 const updatedScreenedRows = [...screenedRows, row.id];
//                 setScreenedRows(updatedScreenedRows);
//                 localStorage.setItem('screenedRows', JSON.stringify(updatedScreenedRows));
//                 console.log('Updated Screened Rows:', updatedScreenedRows);
//             } else {
//                 console.error('Invalid row.id:', row.id);
//             }
//         } catch (error) {
//             console.error('API error:', error);
//         }
//     };

//     const [selectedActions, setSelectedActions] = useState<{ [key: number]: string }>({});
//     const [remarksAndActions, setRemarksAndActions] = useState<{ action: string; remarks: string }[]>([]);
//     const [selectedStatus, setSelectedStatus] = useState<string>('');
//     const [remarks, setRemarks] = useState('');
//     const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);

//     const fetchStatus = async () => {
//         try {
//             const statuses: Status[] = await status.getPepStatus();
//             setStatusData(statuses);
//         } catch (error) {
//             console.error("Error fetching statuses:", error);
//         }
//     };

//     const [searchResults, setSearchResults] = useState<any[]>([]);
//     const [searchResult, setSearchResult] = useState<any[]>([]);
//     const status = new statusApiService();
//     const [selectedRow, setSelectedRow] = useState<number | null>(null);

//     const hitdatalifecycleApiServices = new HitdatalifecycleApiServices();
//     const hitdatalifecycleApiService = new HitdatalifecycleApiService();
//     const hitcaseApiService = new HitcaseApiService();
//     const hitcaseApiServices = new HitcaseApiServices();
//     const [iconVisible, setIconVisible] = useState<Record<number, boolean>>({});
//     const [selectedAction, setSelectedAction] = useState<string | null>(null);


//     const handleCloseRemarksDialog = () => {
//         setIsRemarksDialogOpen(false);
//         setSelectedStatus('');
//         setRemarks('');
//     };

//     const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRemarks(event.target.value);
//     };
//     const handleIconClicks = (row: number) => {
//         const currentIndex = page * rowsPerPage + row;
//         const existingAction = selectedActions[currentIndex] || '';
//         const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
//         setRemarks(existingRemarks);
//         setSelectedRow(currentIndex);
//         setIsRemarksDialogOpen(true);
//     };

//     //pep
//     const handleIconClick = (rowId: number, recordIndex: number) => {
//         const data = rowHitRecordData?.[rowId];

//         if (!data) {
//             console.error("No data found for rowId:", rowId);
//             return;
//         }

//         const currentIndex = page * rowsPerPage + recordIndex;
//         console.log("currentIndex:", currentIndex);
//         console.log("Data length for rowId:", data.length);

//         if (currentIndex >= data.length) {
//             console.error("Current index is out of bounds.");
//             return;
//         }

//         const selectedAlert = data[currentIndex];
//         console.log("selectedAlert:", selectedAlert);

//         if (selectedAlert) {
//             setSelectedRow(currentIndex);
//             setSelectedStatus('');
//             setRemarks('');
//             setIsRemarksDialogOpen(true);
//         } else {
//             console.error("Selected alert is undefined at index:", currentIndex);
//         }
//     };
//     const handleRemarksSubmit = async () => {
//         try {
//             console.log("handleRemarksSubmit called");
//             console.log("searchResults length:", searchResults.length);
//             console.log("selectedRow:", selectedRow);

//             if (searchResults.length === 0) {
//                 console.error("No search results available");
//                 return;
//             }

//             if (selectedRow === null || selectedRow < 0 || selectedRow >= searchResults.length) {
//                 console.error("Selected row is invalid or out of bounds");
//                 return;
//             }

//             console.log("Selected row is valid:", selectedRow);

//             const updatedRemarksAndActions = [...remarksAndActions];
//             updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
//             setRemarksAndActions(updatedRemarksAndActions);

//             const selectedSearchResult = searchResults[selectedRow];

//             if (!selectedSearchResult || !selectedSearchResult.id) {
//                 console.error("Selected search result is undefined or missing 'id'");
//                 return;
//             }

//             const hitdatalifecyclePayload = {
//                 searchId: selectedSearchResult.searchId,
//                 criminalId: selectedSearchResult.id.toString(),
//                 statusId: selectedStatus,
//                 remark: remarks,
//                 hitId: selectedSearchResult.hitId,
//                 levelId: '1',
//                 caseId: '0',
//                 uid: userId,
//                 dt: new Date().toISOString(),
//                 valid: true
//             };

//             const hitcasePayload = {
//                 display: selectedSearchResult.display,
//                 searchId: selectedSearchResult.searchId,
//                 hitId: selectedSearchResult.hitId,
//                 criminalId: selectedSearchResult.id.toString(),
//                 levelId: '1',
//                 statusNowId: selectedStatus,
//                 cycleId: '1',
//                 remark: remarks,
//                 uid: userId
//             };

//             console.log("Hit data lifecycle payload:", hitdatalifecyclePayload);
//             console.log("Hit case payload:", hitcasePayload);

//             if (parseInt(selectedStatus) === 1) {
//                 console.log("Status is 1, calling CreateHitdatalifecycle API");
//                 await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
//             } else if (parseInt(selectedStatus) === 2) {
//                 console.log("Status is 2, calling CreateHitCaseInsert API");
//                 await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
//             }
//             setSelectedActions({
//                 ...selectedActions,
//                 [selectedRow]: selectedStatus,
//             });
//             if (selectedRow !== null) {
//                 setIconVisible(prev => ({
//                     ...prev,
//                     [selectedRow]: true
//                 }));
//             }
//             console.log("Updated selected actions:", selectedActions);
//             setIsRemarksDialogOpen(false);
//             console.log("Dialog closed");
//         } catch (error) {
//             console.error("Error submitting remarks:", error);
//         }
//     };

//     //SANCTION
//     const [iconVisibles, setIconVisibles] = useState<{ [rowId: number]: boolean[] }>({});
//     const [selectedSanctionRow, setSelectedSanctionRow] = useState<number | null>(null);
//     const [selectedSanctionStatus, setSelectedSanctionStatus] = useState<string>('');
//     const [sanctionRemarks, setSanctionRemarks] = useState<string>('');
//     const [isSanctionRemarksDialogOpen, setIsSanctionRemarksDialogOpen] = useState(false);
//     const [dialogRowId, setDialogRowId] = useState<number | null>(null);

//     const handleSanctionIconClick = (rowId: number, recordIndex: number) => {
//         const data = rowHitSanctionRecordData?.[rowId];

//         if (!data) {
//             console.error("No data found for rowId:", rowId);
//             return;
//         }

//         const currentIndex = page * rowsPerPage + recordIndex;
//         if (currentIndex >= data.length) {
//             console.error("Current index is out of bounds.");
//             return;
//         }

//         const selectedAlert = data[currentIndex];
//         if (selectedAlert) {
//             setSelectedSanctionRow(currentIndex);
//             // setSelectedSanctionStatus('');
//             setSanctionRemarks('');
//             setIsSanctionRemarksDialogOpen(true);
//             setDialogRowId(rowId);
//             setSearchResults(data);
//         } else {
//             console.error("Selected alert is undefined at index:", currentIndex);
//         }
//     };
//     const handleSanctionRemarksSubmit = async () => {
//         try {
//             console.log("handleSanctionRemarksSubmit called");
//             console.log("searchResult length:", searchResult.length);
//             console.log("selectedSanctionRow:", selectedSanctionRow);

//             if (searchResult.length === 0) {
//                 console.error("No search results available");
//                 return;
//             }

//             if (selectedSanctionRow === null || selectedSanctionRow < 0 || selectedSanctionRow >= searchResult.length) {
//                 console.error("Selected row is invalid or out of bounds");
//                 return;
//             }

//             console.log("Selected row is valid:", selectedSanctionRow);

//             const selectedSearchResult = searchResult[selectedSanctionRow];

//             if (!selectedSearchResult || !selectedSearchResult.id) {
//                 console.error("Selected search result is undefined or missing 'id'");
//                 return;
//             }

//             // Update remarks and actions
//             const updatedRemarksAndActions = [...remarksAndActions];
//             updatedRemarksAndActions[selectedSanctionRow] = { action: selectedSanctionStatus, remarks: sanctionRemarks };
//             setRemarksAndActions(updatedRemarksAndActions);

//             const hitdatalifecyclePayload = {
//                 searchId: selectedSearchResult.searchId,
//                 criminalId: selectedSearchResult.id.toString(),
//                 statusId: selectedSanctionStatus,
//                 remark: sanctionRemarks,
//                 hitId: selectedSearchResult.hitId,
//                 levelId: '1',
//                 caseId: '0',
//                 uid: userId,
//                 dt: new Date().toISOString(),
//                 valid: true
//             };

//             const hitcasePayload = {
//                 display: selectedSearchResult.display,
//                 searchId: selectedSearchResult.searchId,
//                 hitId: selectedSearchResult.hitId,
//                 criminalId: selectedSearchResult.id.toString(),
//                 levelId: '1',
//                 statusNowId: selectedSanctionStatus,
//                 cycleId: '1',
//                 remark: sanctionRemarks,
//                 uid: userId
//             };

//             console.log("Hit data lifecycle payload:", hitdatalifecyclePayload);
//             console.log("Hit case payload:", hitcasePayload);

//             if (parseInt(selectedSanctionStatus) === 1) {
//                 console.log("Status is 1, calling CreateHitdatalifecycle API");
//                 await hitdatalifecycleApiServices.CreateHitdatalifecycle(hitdatalifecyclePayload);
//             } else if (parseInt(selectedSanctionStatus) === 2) {
//                 console.log("Status is 2, calling CreateHitCaseInsert API");
//                 await hitcaseApiServices.CreateHitCaseInsert(hitcasePayload);
//             }

//             setIconVisibles((prev) => {
//                 const rowVisibles = prev[dialogRowId!] || [];
//                 const newVisibles = [...rowVisibles];
//                 newVisibles[selectedSanctionRow % rowsPerPage] = !newVisibles[selectedSanctionRow % rowsPerPage];
//                 return {
//                     ...prev,
//                     [dialogRowId!]: newVisibles,
//                 };
//             });

//             setIsSanctionRemarksDialogOpen(false);
//         } catch (error) {
//             console.error("Error submitting remarks:", error);
//         }
//     };

//     return (
//         <>
//             <Box m={6}>
//                 <h4>PEP</h4>
//                 {/* <Card style={{ padding: '16px', marginTop: '16px' }}>
//                     <TableContainer>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>S.No</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Name</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px', textAlign: 'center' }}>Screening</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {pepData && pepData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                                     <React.Fragment key={row.id}>
//                                         <TableRow
//                                             sx={{
//                                                 cursor: 'pointer',
//                                                 backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
//                                                 '&:hover': { backgroundColor: '#e3f2fd' },
//                                                 transition: 'background-color 0.3s ease',
//                                                 height: 48
//                                             }}
//                                             onClick={() => handleRowClick(row.id, row.kycId)}
//                                         >
//                                             <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{row.answer}</TableCell>
//                                             <TableCell sx={{ textAlign: 'center' }}>
//                                                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                                                     <IconButton
//                                                         color="primary"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handlePepScreeningIconClick(row);
//                                                         }}
//                                                         disabled={screenedRows.includes(row.id)}
//                                                         sx={{ padding: 1 }}
//                                                     >
//                                                         <CheckCircleIcon />
//                                                     </IconButton>
//                                                 </Box>
//                                             </TableCell>
                                          
//                                         </TableRow>

//                                         {expandedRowId === row.id && rowHitRecordData && rowHitRecordData[row.id] && (
//                                             <TableRow>
//                                                 <TableCell colSpan={4} sx={{ padding: 0 }}>
//                                                     <Box
//                                                         sx={{
//                                                             padding: 2,
//                                                             backgroundColor: '#f5f5f5',
//                                                             borderTop: '1px solid #e0e0e0',
//                                                             display: 'flex',
//                                                             flexDirection: 'column',
//                                                             gap: 2,
//                                                             width: '100%',
//                                                             boxSizing: 'border-box'
//                                                         }}
//                                                     >
//                                                         <Typography variant="h6">Screening Record</Typography>
//                                                         <Table size="small">
//                                                             <TableHead>
//                                                                 <TableRow>
//                                                                     <TableCell>Name</TableCell>
//                                                                     <TableCell>Matching Score</TableCell>
//                                                                     <TableCell>Display</TableCell>
//                                                                     <TableCell>Status</TableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {rowHitRecordData[row.id]?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record, recordIndex) => (
//                                                                     <TableRow key={recordIndex}>
//                                                                         <TableCell>{record.name}</TableCell>
//                                                                         <TableCell>{record.matchingScore}</TableCell>
//                                                                         <TableCell>{record.display}</TableCell>
//                                                                         <TableCell>
//                                                                             <IconButton
//                                                                                 onClick={() => handleIconClick(row.id, recordIndex)}
//                                                                                 sx={{ padding: 1 }}
//                                                                             >
//                                                                                 {iconVisible[page * rowsPerPage + recordIndex] ? (
//                                                                                     <VisibilityOffIcon sx={{ color: 'red' }} />
//                                                                                 ) : (
//                                                                                     <VisibilityIcon sx={{ color: 'green' }} />
//                                                                                 )}
//                                                                             </IconButton>
//                                                                             {selectedAction && <span>{getStatusName(selectedAction)}</span>}
//                                                                         </TableCell>
//                                                                     </TableRow>
//                                                                 ))}
//                                                             </TableBody>
//                                                         </Table>
//                                                         <TablePagination
//                                                             rowsPerPageOptions={[5, 10, 20]}
//                                                             component="div"
//                                                             count={pepData.length}
//                                                             page={page}
//                                                             onPageChange={handleChangePage}
//                                                             rowsPerPage={rowsPerPage}
//                                                             onRowsPerPageChange={handleChangeRowsPerPage}
//                                                         />
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </TableBody>
//                         </Table>

//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handlePepScreeningClick}
//                                 disabled={isPepScreeningDisabled}
//                             >
//                                 Screening
//                             </Button>
//                         </Box>
//                     </TableContainer>
//                     <Dialog
//                         open={isRemarksDialogOpen}
//                         onClose={handleCloseRemarksDialog}
//                         fullWidth
//                         maxWidth="md"
//                     >
//                         <DialogTitle>Enter Remarks</DialogTitle>
//                         <DialogContent>
//                             <Typography variant="body1" sx={{ textAlign: 'center' }}>
//                                 Select a status and enter remarks for this employee.
//                             </Typography>
//                             <Grid container alignItems="center" justifyContent="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <FormControl fullWidth variant="outlined">
//                                         <InputLabel>Status</InputLabel>
//                                         <Select
//                                             label="Status"
//                                             value={selectedStatus}
//                                             onChange={(e) => setSelectedStatus(e.target.value)}
//                                         >
//                                             <MenuItem value="">Select Status</MenuItem>
//                                             {statusData.map((status) => (
//                                                 <MenuItem key={status.id} value={status.id}>
//                                                     {status.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 {selectedStatus && (
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             autoFocus
//                                             margin="dense"
//                                             id="remarks"
//                                             label="Remarks"
//                                             type="text"
//                                             fullWidth
//                                             multiline
//                                             rows={4}
//                                             value={remarks}
//                                             onChange={handleRemarksChange}
//                                         />
//                                     </Grid>
//                                 )}
//                             </Grid>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleRemarksSubmit} color="primary">
//                                 Submit
//                             </Button>
//                         </DialogActions>
//                     </Dialog>

//                 </Card> */}

//                 <Card style={{ padding: '16px', marginTop: '16px' }}>
//                     <TableContainer>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>S.No</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Name</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px', textAlign: 'center' }}>Screening</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {pepData && pepData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                                     <React.Fragment key={row.id}>
//                                         <TableRow
//                                             sx={{
//                                                 cursor: 'pointer',
//                                                 backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
//                                                 '&:hover': { backgroundColor: '#e3f2fd' },
//                                                 transition: 'background-color 0.3s ease',
//                                                 height: 48
//                                             }}
//                                             onClick={() => handleRowClick(row.screeningType)}
//                                         >
//                                             <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{row.answer}</TableCell>
//                                             <TableCell sx={{ textAlign: 'center' }}>
//                                                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                                                     <Checkbox
//                                                         icon={<CheckCircleIcon />}
//                                                         checkedIcon={<CheckCircleIcon />}
//                                                         checked={screenedRows.includes(row.id)}
//                                                         onChange={(e) => {
//                                                             e.stopPropagation();
//                                                             handlePepScreeningIconClick(row);
//                                                         }}
//                                                         sx={{
//                                                             color: 'primary.main',
//                                                             '&.Mui-checked': {
//                                                                 color: 'primary.main',
//                                                             },
//                                                             '& .MuiSvgIcon-root': {
//                                                                 borderRadius: '50%',
//                                                             },
//                                                             padding: 1,
//                                                         }}
//                                                     />
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>

//                                         {expandedRowId === row.screeningType && rowHitRecordData && rowHitRecordData[row.screeningType] && (
//                                             <TableRow>
//                                                 <TableCell colSpan={4} sx={{ padding: 0 }}>
//                                                     <Box
//                                                         sx={{
//                                                             padding: 2,
//                                                             backgroundColor: '#f5f5f5',
//                                                             borderTop: '1px solid #e0e0e0',
//                                                             display: 'flex',
//                                                             flexDirection: 'column',
//                                                             gap: 2,
//                                                             width: '100%',
//                                                             boxSizing: 'border-box'
//                                                         }}
//                                                     >
//                                                         <Typography variant="h6">Screening Record</Typography>
//                                                         <Table size="small">
//                                                             <TableHead>
//                                                                 <TableRow>
//                                                                     <TableCell>Name</TableCell>
//                                                                     <TableCell>Matching Score</TableCell>
//                                                                     <TableCell>Display</TableCell>
//                                                                     <TableCell>Status</TableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {rowHitRecordData[row.screeningType]?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record, recordIndex) => (
//                                                                     <TableRow key={recordIndex}>
//                                                                         <TableCell>{record.name}</TableCell>
//                                                                         <TableCell>{record.matchingScore}</TableCell>
//                                                                         <TableCell>{record.display}</TableCell>
//                                                                         <TableCell>
//                                                                             <IconButton
//                                                                                 onClick={() => handleIconClick(row.id, recordIndex)}
//                                                                                 sx={{ padding: 1 }}
//                                                                             >
//                                                                                 {iconVisible[page * rowsPerPage + recordIndex] ? (
//                                                                                     <VisibilityOffIcon sx={{ color: 'red' }} />
//                                                                                 ) : (
//                                                                                     <VisibilityIcon sx={{ color: 'green' }} />
//                                                                                 )}
//                                                                             </IconButton>
//                                                                             {selectedAction && <span>{getStatusName(selectedAction)}</span>}
//                                                                         </TableCell>
//                                                                     </TableRow>
//                                                                 ))}
//                                                             </TableBody>
//                                                         </Table>
//                                                         <TablePagination
//                                                             rowsPerPageOptions={[5, 10, 20]}
//                                                             component="div"
//                                                             count={pepData.length}
//                                                             page={page}
//                                                             onPageChange={handleChangePage}
//                                                             rowsPerPage={rowsPerPage}
//                                                             onRowsPerPageChange={handleChangeRowsPerPage}
//                                                         />
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </TableBody>
//                         </Table>

//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handlePepScreeningClick}
//                                 disabled={isPepScreeningDisabled}
//                             >
//                                 Screening
//                             </Button>
//                         </Box>
//                     </TableContainer>

//                     <Dialog
//                         open={isRemarksDialogOpen}
//                         onClose={handleCloseRemarksDialog}
//                         fullWidth
//                         maxWidth="md"
//                     >
//                         <DialogTitle>Enter Remarks</DialogTitle>
//                         <DialogContent>
//                             <Typography variant="body1" sx={{ textAlign: 'center' }}>
//                                 Select a status and enter remarks for this employee.
//                             </Typography>
//                             <Grid container alignItems="center" justifyContent="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <FormControl fullWidth variant="outlined">
//                                         <InputLabel>Status</InputLabel>
//                                         <Select
//                                             label="Status"
//                                             value={selectedStatus}
//                                             onChange={(e) => setSelectedStatus(e.target.value)}
//                                         >
//                                             <MenuItem value="">Select Status</MenuItem>
//                                             {statusData.map((status) => (
//                                                 <MenuItem key={status.id} value={status.id}>
//                                                     {status.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 {selectedStatus && (
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             autoFocus
//                                             margin="dense"
//                                             id="remarks"
//                                             label="Remarks"
//                                             type="text"
//                                             fullWidth
//                                             multiline
//                                             rows={4}
//                                             value={remarks}
//                                             onChange={handleRemarksChange}
//                                         />
//                                     </Grid>
//                                 )}
//                             </Grid>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleRemarksSubmit} color="primary">
//                                 Submit
//                             </Button>
//                         </DialogActions>
//                     </Dialog>
//                 </Card>

//                 <h4 style={{ marginTop: '1%' }}>CRIMINAL</h4>
//                 <Card style={{ padding: '16px', marginTop: '16px' }}>
//                     <TableContainer>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>S.No</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Name</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px', textAlign: 'center' }}>Screening</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {criminalData && criminalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                                     <React.Fragment key={row.id}> {/* Use unique row ID */}
//                                         <TableRow
//                                             sx={{
//                                                 cursor: 'pointer',
//                                                 backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
//                                                 '&:hover': { backgroundColor: '#e3f2fd' },
//                                                 transition: 'background-color 0.3s ease',
//                                                 height: '48px'
//                                             }}
//                                             onClick={() => handleCriminalRowClick(row.id, row.kycId)}
//                                         >
//                                             <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{row.answer}</TableCell>
//                                             <TableCell sx={{ textAlign: 'center' }}>
//                                                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                                                     <IconButton
//                                                         color="primary"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleCriminalScreeningIconClick(row);
//                                                         }}
//                                                         disabled={screenedRows.includes(row.id)}
//                                                         sx={{ padding: '4px' }}
//                                                     >
//                                                         <CheckCircleIcon />
//                                                     </IconButton>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>

//                                         {expandedcriminalRowId === row.id && rowHitCriminalRecordData && rowHitCriminalRecordData[row.id] && (
//                                             <TableRow>
//                                                 <TableCell colSpan={3} sx={{ padding: 0 }}>
//                                                     <Box
//                                                         sx={{
//                                                             padding: '8px',
//                                                             backgroundColor: '#f5f5f5',
//                                                             borderTop: '1px solid #e0e0e0',
//                                                             display: 'flex',
//                                                             flexDirection: 'column',
//                                                             gap: '8px',
//                                                             width: '100%',
//                                                             boxSizing: 'border-box'
//                                                         }}
//                                                     >
//                                                         {/* Expanded Row Content */}
//                                                         <Typography variant="h6">Screening Record</Typography>
//                                                         <Table size="small">
//                                                             <TableHead>
//                                                                 <TableRow>
//                                                                     <TableCell>Name</TableCell>
//                                                                     <TableCell>Matching Score</TableCell>
//                                                                     <TableCell>Display</TableCell>
//                                                                     <TableCell>Status</TableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {rowHitCriminalRecordData[row.id].map((record, recordIndex) => (
//                                                                     <TableRow key={recordIndex}>
//                                                                         <TableCell>{record.name}</TableCell>
//                                                                         <TableCell>{record.matchingScore}</TableCell>
//                                                                         <TableCell>{record.display}</TableCell>
//                                                                         <TableCell>
//                                                                             <IconButton onClick={() => handleIconClicks(recordIndex)} style={{ padding: '1px' }}>
//                                                                                 <VisibilityIcon style={{ color: 'green' }} />
//                                                                             </IconButton>
//                                                                         </TableCell>
//                                                                     </TableRow>
//                                                                 ))}
//                                                             </TableBody>
//                                                         </Table>
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </TableBody>
//                         </Table>

//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleCriminalScreeningClick}
//                                 disabled={isCriminalScreeningDisabled}
//                             >
//                                 Screening
//                             </Button>
//                         </Box>
//                     </TableContainer>
//                 </Card>

//                 <h4 style={{ marginTop: '1%' }}>SANCTION</h4>
//                 <Card style={{ padding: '16px', marginTop: '16px' }}>
//                     <TableContainer>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>S.No</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px' }}>Name</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '8px', textAlign: 'center' }}>Screening</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {sanctionData && sanctionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
//                                     <React.Fragment key={row.id}>
//                                         <TableRow
//                                             sx={{
//                                                 cursor: 'pointer',
//                                                 backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
//                                                 '&:hover': { backgroundColor: '#e3f2fd' },
//                                                 transition: 'background-color 0.3s ease',
//                                                 height: '48px'
//                                             }}
//                                             onClick={() => handleSanctionRowClick(row.id, row.kycId)} // Use unique row ID
//                                         >
//                                             <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{row.answer}</TableCell>
//                                             <TableCell sx={{ textAlign: 'center' }}>
//                                                 <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                                                     <IconButton
//                                                         color="primary"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleSanctionScreeningIconClick(row);
//                                                         }}
//                                                         disabled={screenedRows.includes(row.id)}
//                                                         sx={{ padding: '4px' }}
//                                                     >
//                                                         <CheckCircleIcon />
//                                                     </IconButton>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>

//                                         {expandedSanctionRowId === row.id && rowHitSanctionRecordData && rowHitSanctionRecordData[row.id] && (
//                                             <TableRow>
//                                                 <TableCell colSpan={3} sx={{ padding: 0 }}>
//                                                     <Box
//                                                         sx={{
//                                                             padding: '8px',
//                                                             backgroundColor: '#f5f5f5',
//                                                             borderTop: '1px solid #e0e0e0',
//                                                             display: 'flex',
//                                                             flexDirection: 'column',
//                                                             gap: '8px',
//                                                             width: '100%',
//                                                             boxSizing: 'border-box'
//                                                         }}
//                                                     >
//                                                         <Typography variant="h6">Sanction Record</Typography>
//                                                         <Table size="small">
//                                                             <TableHead>
//                                                                 <TableRow>
//                                                                     <TableCell>Name</TableCell>
//                                                                     <TableCell>Matching Score</TableCell>
//                                                                     <TableCell>Display</TableCell>
//                                                                     <TableCell>Status</TableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {rowHitSanctionRecordData[row.id]?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record, recordIndex) => (
//                                                                     <TableRow key={recordIndex}>
//                                                                         <TableCell>{record.name}</TableCell>
//                                                                         <TableCell>{record.matchingScore}</TableCell>
//                                                                         <TableCell>{record.display}</TableCell>

//                                                                         <TableCell>
//                                                                             <IconButton
//                                                                                 onClick={() => handleSanctionIconClick(row.id, recordIndex)}
//                                                                                 sx={{ padding: 1 }}
//                                                                             >
//                                                                                 {iconVisibles[row.id]?.[recordIndex] ? (
//                                                                                     <VisibilityOffIcon sx={{ color: 'red' }} />
//                                                                                 ) : (
//                                                                                     <VisibilityIcon sx={{ color: 'green' }} />
//                                                                                 )}
//                                                                             </IconButton>
//                                                                         </TableCell>
//                                                                     </TableRow>
//                                                                 ))}
//                                                             </TableBody>
//                                                             <TablePagination
//                                                                 rowsPerPageOptions={[5, 10, 20]}
//                                                                 component="div"
//                                                                 count={pepData.length}
//                                                                 page={page}
//                                                                 onPageChange={handleChangePage}
//                                                                 rowsPerPage={rowsPerPage}
//                                                                 onRowsPerPageChange={handleChangeRowsPerPage}
//                                                             />
//                                                         </Table>
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleSanScreeningClick}
//                                 disabled={isSanScreeningDisabled}
//                             >
//                                 Screening
//                             </Button>
//                         </Box>
//                     </TableContainer>
//                     <Dialog
//                         open={isSanctionRemarksDialogOpen}
//                         onClose={() => setIsSanctionRemarksDialogOpen(false)}
//                         fullWidth
//                         maxWidth="md"
//                     >
//                         <DialogTitle>Enter Remarks</DialogTitle>
//                         <DialogContent>
//                             <Typography variant="body1" sx={{ textAlign: 'center' }}>
//                                 Select a status and enter remarks for this sanction record.
//                             </Typography>
//                             <Grid container alignItems="center" justifyContent="center" spacing={2}>
//                                 <Grid item xs={12} sm={4}>
//                                     <FormControl fullWidth variant="outlined">
//                                         <InputLabel>Status</InputLabel>
//                                         <Select
//                                             label="Status"
//                                             value={selectedSanctionStatus}
//                                             onChange={(e) => setSelectedSanctionStatus(e.target.value)}
//                                         >
//                                             <MenuItem value="">Select Status</MenuItem>
//                                             {statusData.map((status) => (
//                                                 <MenuItem key={status.id} value={status.id}>
//                                                     {status.name}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 {selectedSanctionStatus && (
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             autoFocus
//                                             margin="dense"
//                                             label="Remarks"
//                                             type="text"
//                                             fullWidth
//                                             multiline
//                                             rows={4}
//                                             value={sanctionRemarks}
//                                             onChange={(e) => setSanctionRemarks(e.target.value)}
//                                         />
//                                     </Grid>
//                                 )}
//                             </Grid>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleSanctionRemarksSubmit} color="primary">
//                                 Submit
//                             </Button>
//                         </DialogActions>
//                     </Dialog>
//                 </Card>

//             </Box>
//         </>
//     );
// }

// export default Document;

import React from 'react'

const PepDocument = () => {
  return (
    <div>PepDocument</div>
  )
}

export default PepDocument