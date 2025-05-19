import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { Slider } from '@mui/material';
import { useParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewService from '../../data/services/san_search/viewpage/view_api_service';
import { Country, List, Program, All, Customer, Address, IdentificationData, AliasesData, DetailsData, SearchDTO, RecordDTO, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../data/services/san_search/viewpage/view_payload';
import './Details.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchApiService from '../../data/services/san_search/search-api-service';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../data/services/san_search/hitcase/hitcase-api-service';
import { useReactToPrint } from 'react-to-print';

interface Status {
    id: string;
    name: string;
};

interface DisabledIcons {
    [key: string]: boolean;
};

interface BulkTask {
    uid: number;
    searchName: string;
    userName: String;
};

function Details() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const { id, ids } = useParams();
    const cardRef = useRef<HTMLDivElement | null>(null);

    const [formData, setFormData] = useState<RecordDTO>({
        ids: 0,
        name: '',
        address: '',
        program: '',
        entityType: '',
        list: '',
        score: 0,
        fileType: 0,
        fileList: '',
        criminalId: '',
        searchId: '',
        hitId: '',
        nationality: '',
        citizenship: '',
        passport: '',
        Country: '',
        accountNumber: '',
    });

    const [countryData, setcountryData] = useState<Customer>({
        id: 0,
        city: '',
        State: '',
    });

    const [RecordType, setRecordType] = useState<All[]>([]);
    const viewservice = new ViewService();
    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [Program, setProgram] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [List, setList] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState(0);
    const [country, setCountry] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [filteredData, setFilteredData] = useState<RecordDTO[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(80);
    const [data, setData] = useState<RecordDTO[]>([]);
    const [address, setaddress] = useState<Address[]>([]);
    const [identification, setIdentification] = useState<IdentificationData[]>([]);
    const [aliases, setAliases] = useState<AliasesData[]>([]);
    const [details, setdetails] = useState<DetailsData[]>([]);
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showModal, setShowModal] = useState(false);
    const [showModallogical, setShowModallogical] = useState(false);
    const [showModalgroup, setShowModalgroup] = useState(false);
    const [showModalun, setShowModalun] = useState(false);
    const [selectedSearchDetails, setSelectedSearchDetails] = useState<string>('');
    const [logicaldetails, setLogicaldetails] = useState<LogicalDetails[]>([]);
    const [logicalcitiy, setLogicalcitiy] = useState<Logicalcitiy[]>([]);
    const [logicalBirthDetails, setLogicalBirthDetails] = useState<LogicalBirthDetails[]>([]);
    const [logicalidentification, setLogicalIdentification] = useState<logicalIdentification[]>([]);
    const [logicalAddress, setLogicalAddress] = useState<logicaAddress[]>([]);
    const [logicalAka, setLogicalAka] = useState<LogicalAKADetails[]>([]);
    const [Groupaliases, setGroupaliases] = useState<GroupAliases[]>([]);
    const [CityDetails, setCityDetails] = useState<CityDetails[]>([]);
    const [groupidentification, setGroupIdentification] = useState<GroupIdentification[]>([]);
    const [UnDetails, setUnDetails] = useState<UnDetails[]>([]);
    const [Unaliases, setUnaliases] = useState<UnAliases[]>([]);
    const [UnDesignationDetails, setUnDesignationDetails] = useState<UnDesignationDetails[]>([]);
    const [statusData, setStatusData] = useState<Status[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
    const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [selectedCourierTracker, setSelectedCourierTracker] = useState<any | null>(null);
    const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [BulkTaskAssignView, setBulkTaskAssignView] = useState<BulkTask[]>([]);
    const [showBulkTaskAssignView, setShowBulkTaskAssignView] = useState(true);

    useEffect(() => {
        fetchCountry();
        fetchList();
        fetchProgram();
        fetchAll();
        fetchAddresses();
        fetchIdentification();
        fetchAliases();
        fetchDetails();
        fetchiden();
        fetchaddress();
        fetchadetails();
        fetchacitiy();
        fetchBirthDetails();
        fetchAka();
        fetchaliase();
        fetchanationalid();
        fetchCityDetails();
        fetchUnDetails();
        fetchunaliase();
        fetchundesingation();
        fetchStatus();
        fetchBulkTaskAssignView();
    }, [ids]);

    const remarksRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (selectedStatus && remarksRef.current) {
            remarksRef.current.focus();
        }
    }, [selectedStatus]);

    useEffect(() => {
        const handleKeyDown = (event: { key: any; }) => {
            if (!cardRef.current) return;
            const { key } = event;
            const element = cardRef.current;
            if (key === 'ArrowUp') {
                element.scrollTop -= 50;
            } else if (key === 'ArrowDown') {
                element.scrollTop += 50;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const fetchBulkTaskAssignView = async () => {
        try {
            const uid = loginDetails.id;
            const BulkTaskAssign = await viewservice.getBulkTaskAssignView(uid);
            setBulkTaskAssignView(BulkTaskAssign);
            setShowBulkTaskAssignView(true);
        } catch (error) {
            console.error("Error fetching the fetchBulkTaskAssignView:", error)
        }
    };

    const fetchCountry = async () => {
        try {
            const countryData = await viewservice.getCountryList();
            setCountry(countryData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchList = async () => {
        try {
            const ListData = await viewservice.getList();
            setList(ListData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchProgram = async () => {
        try {
            const ProgramData = await viewservice.getProgram();
            setProgram(ProgramData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAll = async () => {
        try {
            const AllData = await viewservice.getAll();
            setRecordType(AllData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const Address = await viewservice.getAddresses(id);
            setaddress(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAliases = async () => {
        try {
            const aliases = await viewservice.getAliases(id);
            setAliases(aliases);
        } catch (error) {
            console.error("Error fetching aliases list:", error);
        }
    };

    const fetchIdentification = async () => {
        try {
            const identification = await viewservice.getIdentification(id);
            setIdentification(identification);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchDetails = async () => {
        try {
            const details = await viewservice.getDetails(id);
            setdetails(details);
        } catch (error) {
            console.error("Error fetching the details:", error);
        }
    };

    const fetchiden = async () => {
        try {
            const Address = await viewservice.getLogicalIdentification(id);
            setLogicalIdentification(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchaddress = async () => {
        try {
            const Address = await viewservice.getLogicalAddress(id);
            setLogicalAddress(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchadetails = async () => {
        try {
            const Address = await viewservice.getLogicaldetails(id);
            setLogicaldetails(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchacitiy = async () => {
        try {
            const Address = await viewservice.getLogicalcity(id);
            setLogicalcitiy(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchBirthDetails = async () => {
        try {
            const Address = await viewservice.getLogicalBirthDetails(id);
            setLogicalBirthDetails(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAka = async () => {
        try {
            const Address = await viewservice.getLogicalAka(id);
            setLogicalAka(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchaliase = async () => {
        try {
            const Groupaliases = await viewservice.getGroupAliases(id);
            setGroupaliases(Groupaliases);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchCityDetails = async () => {
        try {
            const CityDetails = await viewservice.getGroupCityDetails(id);
            setCityDetails(CityDetails);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchanationalid = async () => {
        try {
            const groupidentification = await viewservice.getGroupIdentification(id);
            setGroupIdentification(groupidentification);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchUnDetails = async () => {
        try {
            const UnDetails = await viewservice.getUnDetails(id);
            setUnDetails([UnDetails]);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchunaliase = async () => {
        try {
            const Unaliases = await viewservice.getUnAliases(id);
            setUnaliases(Unaliases);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchundesingation = async () => {
        try {
            const UnDesignationDetails = await viewservice.getUnDesignationDetailss(id);
            setUnDesignationDetails(UnDesignationDetails);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const handleRecordTypeChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedRecordType(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleListChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedList(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleCountryChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedCountry(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleKeyPress = (e: { key: string }) => {
        if (e.key === 'Enter') {
            handleSearch();
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

    const [loading, setLoading] = useState<boolean>(false);

    const handleSliderChange = (e: any, newValue: number | number[]) => {
        setSliderValue(typeof newValue === 'number' ? newValue : 50);
    };

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            value = 0;
        }
        setSliderValue(value);
    };

    const handleBlur = () => {
        if (sliderValue < 50) {
            setSliderValue(50);
        } else if (sliderValue > 100) {
            setSliderValue(100);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setFilteredData([]);
            setShowBulkTaskAssignView(false);
            if (!formData.name && !formData.address && sliderValue === 100) {
                setSearchError(true);
                setLoading(false);
                return;
            }
            const searchDTO: SearchDTO = {
                name: formData.name,
                matching_score: sliderValue,
                listID: selectedList,
                partySubTypeID: selectedRecordType,
                countryId: selectedCountry,
                uid: loginDetails.id,
                isBulkSearch: 0
            };
            const filtered = await viewservice.getRecordsCount(searchDTO);
            if (Array.isArray(filtered) && filtered.length > 0) {
                setFilteredData(filtered);
                setSearchError(false);
            } else {
                setSearchError(true);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error fetching lookup data:", error);
            setSearchError(true);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            ids: 0, name: '', address: '', entityType: '', program: '', list: '', score: 0, fileType: 0, fileList: '', searchId: '', hitId: '', criminalId: '', nationality: '',
            citizenship: '',
            passport: '',
            Country: '',
            accountNumber: '',
        }); setFilteredData([]);
        setSliderValue(80);
        setSearchError(false);
        setSelectedRecordType(0);
        setSelectedCountry(0);
        setSelectedList(0);
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

    const handlePrinted = useReactToPrint({
        content: () => myRef.current,
        pageStyle: `
          @page {
            margin-left: 20mm; /* Adjust this value as per your requirement */
          }
          body {
            margin: 0;
          }
        `,
    });

    const exportToExcel = () => {
        try {
            const dataForExport = filteredData.length > 0 ? filteredData.map((row) => ({
                FileList: row.fileList,
                Name: row.name,
                Address: row.address,
                Type: row.entityType,
                Program: row.program,
                List: row.list,
                Score: row.score
            })) : [{ Message: "Your search has not returned any results." }];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataForExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lookup Results");
            XLSX.writeFile(workbook, "lookup_results.xlsx");
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    const handleTableRowClick = async (ids: number, fileType: number, index: number, searchId: string) => {
        const id = String(ids);
        if (fileType === 1) {
            setShowModal(true);
            const currentIndex = `${searchId}-${ids}-${index}`;
            const existingAction = selectedActions[currentIndex] || '';
            const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
            setSelectedStatus(existingAction);
            setRemarks(existingRemarks);
            setSelectedRow(currentIndex);
            try {
                setLoading(true);
                const detailsData = await viewservice.getDetails(id);
                setdetails(detailsData);
                const identificationData = await viewservice.getIdentification(id);
                setIdentification(identificationData);
                const aliasesData = await viewservice.getAliases(id);
                setAliases(aliasesData);
                const addressData = await viewservice.getAddresses(id);
                setaddress(addressData);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
            setLoading(false);
        } else if (fileType === 2) {
            setShowModallogical(true);
            const currentIndex = `${searchId}-${ids}-${index}`;
            const existingAction = selectedActions[currentIndex] || '';
            const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
            setSelectedStatus(existingAction);
            setRemarks(existingRemarks);
            setSelectedRow(currentIndex);
            try {
                setLoading(true);
                const logicalidentification = await viewservice.getLogicalIdentification(id);
                setLogicalIdentification(logicalidentification);
                const logicalAddress = await viewservice.getLogicalAddress(id);
                setLogicalAddress(logicalAddress);
                const logicaldetails = await viewservice.getLogicaldetails(id);
                setLogicaldetails(logicaldetails);
                const logicalcitiy = await viewservice.getLogicalcity(id);
                setLogicalcitiy(logicalcitiy);
                const logicalBirthDetails = await viewservice.getLogicalBirthDetails(id);
                setLogicalBirthDetails(logicalBirthDetails);
                const logicalAka = await viewservice.getLogicalAka(id);
                setLogicalAka(logicalAka);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
            setLoading(false);
        } else if (fileType === 3) {
            setShowModalgroup(true);
            const currentIndex = `${searchId}-${ids}-${index}`;
            const existingAction = selectedActions[currentIndex] || '';
            const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
            setSelectedStatus(existingAction);
            setRemarks(existingRemarks);
            setSelectedRow(currentIndex)
            try {
                setLoading(true);
                const Groupaliases = await viewservice.getGroupAliases(id);
                setGroupaliases(Groupaliases);
                const CityDetails = await viewservice.getGroupCityDetails(id);
                setCityDetails(CityDetails);
                const groupidentification = await viewservice.getGroupIdentification(id);
                setGroupIdentification(groupidentification);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
            setLoading(false);
        }
        else if (fileType === 4) {
            setShowModalun(true);
            const currentIndex = `${searchId}-${ids}-${index}`;
            const existingAction = selectedActions[currentIndex] || '';
            const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
            setSelectedStatus(existingAction);
            setRemarks(existingRemarks);
            setSelectedRow(currentIndex);
            try {
                setLoading(true);
                const UnDetails = await viewservice.getUnDetails(id);
                setUnDetails([UnDetails]);
                const Unaliases = await viewservice.getUnAliases(id);
                setUnaliases(Unaliases);
                const UnDesignationDetails = await viewservice.getUnDesignationDetailss(id);
                setUnDesignationDetails(UnDesignationDetails);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseModallogical = () => {
        setShowModallogical(false);
    };

    const handleCloseModalgroup = () => {
        setShowModalgroup(false);
    };

    const handleCloseModalun = () => {
        setShowModalun(false);
    };

    const authApiService = new SearchApiService();
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const hitcaseApiService = new HitcaseApiService();

    const fetchStatus = async () => {
        try {
            const statuses: Status[] = await authApiService.getStatus();
            const filteredStatuses = statuses.filter((status: Status) => {
                return status.name === "close" || status.name === "Escalation";
            });
            setStatusData(filteredStatuses);
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };

    const handleCloseRemarksDialog = () => {
        setIsRemarksDialogOpen(false);
        setSelectedAction(null);
        setRemarks('');
        setErrorMessage(null);
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
        setErrorMessage(null);
    };

    const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
        setRemarks(filteredValue);
        setErrorMessage(null);
    };

    const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

    const handleIconClick = (index: number, searchId: string, ids: string) => {
        const currentIndex = `${searchId}-${ids}-${index}`;
        const existingAction = selectedActions[currentIndex] || '';
        const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
        setSelectedStatus(existingAction);
        setRemarks(existingRemarks);
        setSelectedRow(currentIndex);
        setIsRemarksDialogOpen(true);
    };

    const getStatusName = (action: string) => {
        const status = statusData.find((status) => status.id === action);
        if (status) {
            const statusClassMap: { [key: string]: string } = {
                '1': 'green-text',
                '2': 'red-text',
                '3': 'yellow-text',
            };
            const statusClass = statusClassMap[status.id];
            if (statusClass) {
                return (
                    <span className={statusClass}>
                        {status.name}
                    </span>
                );
            } else {
                return status.name;
            }
        } else {
            return '';
        }
    };

    const handleRemarksSubmit = async () => {
        try {
            if (selectedStatus === '') {
                setErrorMessage('Please select a status.');
                return;
            }
            if (!remarks.trim()) {
                setErrorMessage('Remarks cannot be empty.');
                return;
            }
            setErrorMessage(null);
            if (selectedRow !== null && filteredData.some(row => `${row.searchId}-${row.ids}-${filteredData.indexOf(row)}` === selectedRow)) {
                const updatedRemarksAndActions = { ...remarksAndActions };
                updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
                setRemarksAndActions(updatedRemarksAndActions);
                const selectedSearchResult = filteredData.find(row => `${row.searchId}-${row.ids}-${filteredData.indexOf(row)}` === selectedRow);
                if (!selectedSearchResult) {
                    console.error("Selected search result is undefined");
                    return;
                }
                const hitdatalifecyclePayload = {
                    searchId: selectedSearchResult.searchId,
                    criminalId: selectedSearchResult.ids.toString(),
                    statusId: selectedStatus,
                    remark: remarks,
                    hitId: selectedSearchResult.hitId,
                    levelId: '1',
                    caseId: '0',
                    uid: loginDetails.id,
                };
                const hitcasePayload = {
                    display: '-',
                    searchId: selectedSearchResult.searchId,
                    hitId: selectedSearchResult.hitId,
                    criminalId: selectedSearchResult.ids.toString(),
                    levelId: '1',
                    statusNowId: selectedStatus,
                    cycleId: '1',
                    remark: remarks,
                    uid: loginDetails.id,
                };
                if (parseInt(selectedStatus) === 1) {
                    await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
                } else if (parseInt(selectedStatus) === 2) {
                    await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
                }
                setSelectedActions({
                    ...selectedActions,
                    [selectedRow]: selectedStatus,
                });
                setDisabledIcons({
                    ...disabledIcons,
                    [selectedRow]: true,
                });
                setIsRemarksDialogOpen(false);
            } else {
                console.error("Selected row is null or invalid");
            }
        } catch (error) {
            console.error("Error submitting remarks:", error);
            setErrorMessage('An error occurred while submitting remarks.');
        }
        handleCloseModal();
        handleCloseModallogical();
        handleCloseModalgroup();
        handleCloseModalun();
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card className='card' style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className="card-body" >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '95%' }}>
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
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                    >
                                        <FileDownloadIcon />
                                    </IconButton>
                                </div>
                                <Card className='card' style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <div style={{ display: 'flex', gap: '2%' }}>
                                        <FormControl style={{ width: '50%' }}>
                                            <InputLabel htmlFor="record-type" className='commonStyle'>Type</InputLabel>
                                            <Select
                                                label="Type"
                                                size='small'
                                                variant="outlined"
                                                className='commonStyle'
                                                value={selectedRecordType}
                                                onChange={handleRecordTypeChange}
                                            >
                                                <MenuItem value={0} className='commonStyle'>All</MenuItem>
                                                {RecordType.map((item) => (
                                                    <MenuItem key={item.partyTypeID} value={parseInt(item.partyTypeID)}>
                                                        <span>{item.type_text}</span>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            style={{ width: '50%' }}
                                            label="Account Number"
                                            id="Account Number"
                                            size='small'
                                            variant="outlined"
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            value={formData.accountNumber}

                                            InputLabelProps={{ className: 'inputFeild' }}
                                            InputProps={{ className: 'inputFeild' }}

                                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        />
                                        <TextField
                                            style={{ width: '50%' }}
                                            label="Name"
                                            id="Name"
                                            size='small'
                                            variant="outlined"
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            value={formData.name}
                                            InputLabelProps={{ className: 'inputFeild' }}
                                            InputProps={{ className: 'inputFeild' }}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        {List.length > 0 && (
                                            <FormControl style={{ width: '50%' }}>
                                                <InputLabel htmlFor="record-type" className='commonStyle' >List</InputLabel>
                                                <Select
                                                    label="List"
                                                    size='small'
                                                    variant="outlined"
                                                    className='commonStyle'
                                                    value={selectedList}
                                                    onChange={handleListChange}
                                                >
                                                    <MenuItem value={0} className='commonStyle'>All</MenuItem>
                                                    {List.map((item) => (
                                                        <MenuItem key={item.primaryKey} value={item.primaryKey}>
                                                            <span>{item.text}</span>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                        {country.length > 0 && (
                                            <FormControl style={{ width: '50%' }}>
                                                <InputLabel htmlFor="record-type" className='commonStyle'>Country</InputLabel>
                                                <Select
                                                    label="Country"
                                                    size='small'
                                                    variant="outlined"
                                                    value={selectedCountry}
                                                    className='commonStyle'
                                                    onChange={handleCountryChange}
                                                >
                                                    <MenuItem value={0} className='commonStyle'>All</MenuItem>
                                                    {country.map((item) => (
                                                        <MenuItem key={item.primaryKey} value={item.primaryKey}>
                                                            <span>{item.text}</span>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                        <Slider
                                            style={{ width: '40%' }}
                                            value={sliderValue}
                                            onChange={handleSliderChange}
                                            aria-labelledby="input-slider"
                                            min={50}
                                            max={100}
                                        />
                                        <TextField
                                            style={{ width: '30%' }}
                                            value={sliderValue}
                                            size="small"
                                            id="max-score"
                                            label="score"
                                            variant="outlined"
                                            name="maxScore"
                                            autoComplete="off"
                                            type="text"
                                            InputLabelProps={{ className: 'inputFeild' }}
                                            InputProps={{ className: 'inputFeild' }}
                                            onChange={handleTextFieldChange}
                                            onBlur={handleBlur}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '3%' }} >
                                            <div >
                                                <Button variant="contained" onClick={handleSearch} className='commonButton' onKeyPress={handleKeyPress} >Search</Button>
                                            </div>
                                            <div >
                                                <Button variant="contained" className='commonButton' onClick={handleReset}>Reset</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                <br />
                                <div >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography><strong>LOOKUP RESULTS ({filteredData.length})</strong></Typography>
                                    </div>
                                    <Card className='card' style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                        <Grid item xs={12}>
                                            <div ref={Ref}>
                                                <TableContainer className="table-container" style={{ maxHeight: '400px', overflow: 'auto' }}>
                                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                        <TableHead className="sticky-headers">
                                                            <TableRow>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', width: '100px' }} onClick={() => handleSort('fileList')}>
                                                                    <strong>File List</strong> {sortedColumn === 'fileList' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ textAlign: 'left', position: 'sticky', top: 0, backgroundColor: '#D3D3D3', width: '250px' }} onClick={() => handleSort('name')}>
                                                                    <strong>Name</strong> {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ textAlign: 'left', position: 'sticky', top: 0, backgroundColor: '#D3D3D3', width: '100px' }} onClick={() => handleSort('typeId')}>
                                                                    <strong>Type</strong>  {sortedColumn === 'typeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3' }} onClick={() => handleSort('nationality')}>
                                                                    <strong>Nationality</strong> {sortedColumn === 'typeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3' }} onClick={() => handleSort('citizenship')}>
                                                                    <strong>Citizenship</strong>  {sortedColumn === 'typeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3' }} onClick={() => handleSort('passport')}>
                                                                    <strong>Passport</strong>  {sortedColumn === 'typeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3' }} onClick={() => handleSort('typeId')}>
                                                                    <strong>Address</strong> {sortedColumn === 'typeId' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3' }} onClick={() => handleSort('score')}>
                                                                    <strong>Score</strong>  {sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                                </TableCell>
                                                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', minWidth: '120px', zIndex: 1 }}><strong>Action</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {loading ? (
                                                                <TableRow>
                                                                    <TableCell colSpan={9} align="center">
                                                                        <Typography variant="body1"><span>Loading...</span></Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : filteredData.length > 0 ? (
                                                                filteredData.map((row, index) => {
                                                                    const currentIndex = `${row.searchId}-${row.ids}-${index}`;
                                                                    const selectedAction = selectedActions[currentIndex] || '';
                                                                    return (
                                                                        <TableRow key={row.ids}>
                                                                            <TableCell><span>{row.fileList}</span></TableCell>
                                                                            <TableCell
                                                                                style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                                                                                <button
                                                                                    style={{
                                                                                        color: '#3F51B5',
                                                                                        textDecoration: 'underline',
                                                                                        border: '0px solid blue',
                                                                                        backgroundColor: 'white'
                                                                                    }}
                                                                                    onClick={() => handleTableRowClick(row.ids, row.fileType, index, row.searchId.toString())}
                                                                                    disabled={disabledIcons[`${row.searchId}-${row.ids}-${index}`]}
                                                                                >
                                                                                    <span>{row.name}</span>
                                                                                </button>
                                                                            </TableCell>
                                                                            <TableCell style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word', }}><span>{row.entityType}</span></TableCell>
                                                                            <TableCell style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word', }}><span>{row.nationality}</span></TableCell>
                                                                            <TableCell style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}><span>{row.citizenship}</span></TableCell>
                                                                            <TableCell style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}><span>{row.passport}</span></TableCell>
                                                                            <TableCell style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}><span>{row.address}</span></TableCell>
                                                                            <TableCell style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}><span>{Math.round(row.score)}</span></TableCell>
                                                                            <TableCell style={{ minWidth: '120px', zIndex: 1 }}>
                                                                                <IconButton onClick={() => handleIconClick(index, row.searchId, row.ids.toString())} style={{ padding: '1px 1px' }}
                                                                                    disabled={disabledIcons[`${row.searchId}-${row.ids}-${index}`]}
                                                                                >
                                                                                    {selectedAction ? (
                                                                                        <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                                                                    ) : (
                                                                                        <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                                                                    )}
                                                                                </IconButton>
                                                                                {selectedAction && <span>{getStatusName(selectedAction)}</span>}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })
                                                            ) : (
                                                                searchError && (
                                                                    <TableRow>
                                                                        <TableCell colSpan={9} align="center">
                                                                            <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                                                {filteredData.length === 0 ? "Your search has not returned any results." : "At least one search parameter is required."}
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <br></br>
                                            </div>
                                        </Grid>
                                    </Card>
                                </div>
                            </div>
                        </Card>
                    </Box>
                </Box>
            </Box>
            <Dialog
                open={isRemarksDialogOpen}
                onClose={handleCloseRemarksDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogActions>
                    <Button onClick={handleCloseRemarksDialog} color="primary">
                        <ClearIcon />
                    </Button>
                </DialogActions>
                {selectedCourierTracker && (
                    <Timeline position="left" style={{ marginRight: '50%' }}>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.name}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Name</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.matchingScore}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Matching Score</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.hitId}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">hitId</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.searchId}</TimelineContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ background: 'blue' }} />
                                <TimelineConnector style={{ background: 'blue' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">searchId</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineContent>{selectedCourierTracker.remark}</TimelineContent>
                            <TimelineSeparator >
                                <TimelineDot style={{ backgroundColor: 'green' }} />
                            </TimelineSeparator>
                            <TimelineContent color="text.secondary">Remark</TimelineContent>
                        </TimelineItem>
                    </Timeline>
                )}

                <DialogTitle style={{ textAlign: 'center' }}>Enter Remarks</DialogTitle>
                <DialogContentText style={{ textAlign: 'center' }}>
                    Select a status and enter remarks for this employee.
                </DialogContentText>
                <DialogContent sx={{
                    padding: '0px',
                    overflowY: 'unset',
                }}>
                    {errorMessage && (
                        <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value="">Select Status</MenuItem>
                                    {statusData.map((status) => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {selectedStatus && (
                        <div>
                            <DialogContentText style={{ textAlign: 'center' }}>
                                Enter your remarks for this action.
                            </DialogContentText>
                            <Grid container alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="outlined-multiline-static"
                                        label="Remarks"
                                        type="text"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={remarks}
                                        inputRef={remarksRef}
                                        defaultValue="Default Value"
                                        onChange={handleRemarksChange}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    {selectedStatus && (
                        <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                            Submit
                        </button>
                    )}
                </DialogActions>
            </Dialog>
            <Dialog open={showModal} onClose={handleCloseModal} fullWidth
                maxWidth="lg">
                <DialogContent sx={{
                    padding: '0px',
                    overflowY: 'unset',
                }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={handlePrinted}
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </div>
                                <div className="card-body" >
                                    <div ref={myRef}>
                                        <Typography className='allHeading'>DETAILS</Typography>
                                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                            <Grid container spacing={2} justifyContent="space-between">
                                                <Grid item xs={3}>
                                                    {details.slice(0, Math.ceil(details.length / 3)).map((details, index) => (
                                                        <p key={index}><b><strong>{details.heading} {details.heading.includes(':') ? '' : ':'}</strong></b> <span>{details.val}</span></p>
                                                    ))}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {details.slice(Math.ceil(details.length / 3), Math.ceil(2 * details.length / 3)).map((details, index) => (
                                                        <p key={index}><b><strong>{details.heading} {details.heading.includes(':') ? '' : ':'}</strong></b> <span>{details.val}</span></p>
                                                    ))}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {details.slice(Math.ceil(2 * details.length / 3)).map((details, index) => (
                                                        <p key={index}><b><strong>{details.heading} {details.heading.includes(':') ? '' : ':'}</strong></b> <span>{details.val}</span></p>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Card>
                                        <br />
                                        {identification.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>IDENTIFICATIONS</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Type</strong></TableCell>
                                                                        <TableCell><strong>ID</strong></TableCell>
                                                                        <TableCell><strong>Country</strong></TableCell>
                                                                        <TableCell><strong>Issue Date</strong></TableCell>
                                                                        <TableCell><strong>Expire Date</strong></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {identification.map((identification, index) => (
                                                                        <TableRow key={identification.type + identification.country + identification.issue_Date} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{identification.type}</span></TableCell>
                                                                            <TableCell><span>{identification.ids}</span></TableCell>
                                                                            <TableCell><span>{identification.country}</span></TableCell>
                                                                            <TableCell><span>{identification.dateClarification === "Issue Date" ? identification.issue_Date : ''}</span>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <span>{identification.dateClarification === "Expiration Date" ? identification.issue_Date : ''}</span>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                        {aliases.filter(alias => alias.aliasesType !== "Name").length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>ALIASES</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Type</strong></TableCell>
                                                                        <TableCell><strong>Category</strong></TableCell>
                                                                        <TableCell><strong>Name</strong></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {aliases.filter(alias => alias.aliasesType !== "Name").map((alias, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{alias.aliasesType}</span></TableCell>
                                                                            <TableCell><span>{alias.category}</span></TableCell>
                                                                            <TableCell><span>{alias.aliasesName}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                        {address.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>ADDRESS</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Region</strong></TableCell>
                                                                        <TableCell><strong>Address1</strong></TableCell>
                                                                        <TableCell><strong>Address2</strong></TableCell>
                                                                        <TableCell><strong>Address3</strong></TableCell>
                                                                        <TableCell><strong>City</strong></TableCell>
                                                                        <TableCell><strong>Province</strong></TableCell>
                                                                        <TableCell><strong>Postal Code</strong></TableCell>
                                                                        <TableCell><strong>Country</strong> </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {address.map((addres, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{addres.region}</span></TableCell>
                                                                            <TableCell><span>{addres.address1}</span></TableCell>
                                                                            <TableCell><span>{addres.address2}</span></TableCell>
                                                                            <TableCell><span>{addres.address3}</span></TableCell>
                                                                            <TableCell><span>{addres.city}</span></TableCell>
                                                                            <TableCell><span>{addres.province}</span></TableCell>
                                                                            <TableCell><span>{addres.postal}</span></TableCell>
                                                                            <TableCell><span>{addres.countryName}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                            </>
                                        )}
                                        <br></br>
                                        <div className='commonStyle'>Enter Remarks</div>
                                        <div className='commonStyle' style={{ textAlign: 'center' }}>
                                            Select a status and enter remarks for this employee.
                                        </div>
                                        <div>
                                            {errorMessage && (
                                                <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                    <span>{errorMessage}</span>
                                                </Typography>
                                            )}
                                            <Grid container alignItems="center" justifyContent="center">
                                                <Grid item xs={12} sm={3}>
                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                        <InputLabel className='commonStyle'>Status</InputLabel>
                                                        <Select
                                                            label="Status"
                                                            value={selectedStatus}
                                                            className='commonStyle'
                                                            onChange={handleStatusChange}
                                                        >
                                                            <MenuItem value="" className='commonStyle'>Select Status</MenuItem>
                                                            {statusData.map((status) => (
                                                                <MenuItem key={status.id} value={status.id}>
                                                                    <span>{status.name}</span>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            {selectedStatus && (
                                                <div>
                                                    <div style={{ textAlign: 'center' }} className='commonStyle'>
                                                        Enter your remarks for this action.
                                                    </div>
                                                    <Grid container alignItems="center" justifyContent="center">
                                                        <Grid item xs={12} sm={8}>
                                                            <TextField
                                                                autoFocus
                                                                margin="dense"
                                                                id="outlined-multiline-static"
                                                                label="Remarks"
                                                                type="text"
                                                                fullWidth
                                                                multiline
                                                                rows={4}
                                                                value={remarks}
                                                                inputRef={remarksRef}
                                                                defaultValue="Default Value"
                                                                onChange={handleRemarksChange}
                                                                InputLabelProps={{ className: 'commonStyle' }}
                                                                InputProps={{ className: 'commonStyle' }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <DialogActions>
                                            <Button className='commonButton' variant="contained" onClick={handleCloseModal}>Close</Button>
                                            {selectedStatus && (
                                                <Button type="button" className='commonButton' variant="contained" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                                                    SUBMIT
                                                </Button>
                                            )}
                                        </DialogActions>
                                    </div>
                                </div>
                            </Card>

                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={showModallogical} onClose={handleCloseModallogical} fullWidth
                maxWidth="lg">
                <DialogContent sx={{
                    padding: '0px',
                    overflowY: 'unset',
                }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>

                            <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={handlePrinted}
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                        className="non-printable"
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </div>
                                <div className="card-body">
                                    <br />
                                    <div ref={myRef}>
                                        <Typography className='allHeading'>DETAILS</Typography>
                                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                            <Grid container spacing={2} justifyContent="space-between">
                                                {logicaldetails.length > 0 ? (
                                                    logicaldetails.map((detail, index) => (
                                                        <React.Fragment key={index}>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>First Name</strong>: <span>{detail.naal_firstname}</span></Typography>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>Middle Name</strong>:<span>{detail.naal_middlename}</span> </Typography>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>Last Name</strong>: <span>{detail.naal_lastname}</span></Typography>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <Typography><span>No details available</span></Typography>
                                                    </Grid>
                                                )}
                                                {logicalBirthDetails.length > 0 ? (
                                                    logicalBirthDetails.map((detail, index) => (
                                                        <React.Fragment key={index}>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>Birth Country</strong>: <span>{detail.birt_country}</span></Typography>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>Birth Place</strong>: <span>{detail.birt_plcae}</span></Typography>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>Birth Date</strong>: <span>{detail.birt_date}</span></Typography>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <Typography><span>No details available</span></Typography>
                                                    </Grid>
                                                )}
                                                {logicalcitiy.length > 0 ? (
                                                    logicalcitiy.map((detail, index) => (
                                                        <React.Fragment key={index}>
                                                            <Grid item xs={4}>
                                                                <Typography><strong>City Country</strong>: <span>{detail.citi_country}</span></Typography>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <Typography><span>No details available</span></Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Card>
                                        <br />
                                        {logicalidentification.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography>IDENTIFICATIONS</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Identification Leba publication date</strong></TableCell>
                                                                        <TableCell><strong>Entity logical id Identification</strong></TableCell>
                                                                        <TableCell><strong>Identification leba numtitle</strong></TableCell>
                                                                        <TableCell><strong>Identification</strong></TableCell>
                                                                        <TableCell><strong>Identification</strong></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {logicalidentification.map((id, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{id.entity_logical_id_Iden !== 0 ? id.entity_logical_id_Iden : null}</span></TableCell>
                                                                            <TableCell><span>{id.iden_Leba_publication_date}</span></TableCell>
                                                                            <TableCell><span>{id.iden_country}</span></TableCell>
                                                                            <TableCell><span>{id.iden_leba_numtitle}</span></TableCell>
                                                                            <TableCell><span>{id.iden_number}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                        <br />
                                        {logicalAddress.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>ADDRESS</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Address Number</strong> </TableCell>
                                                                        <TableCell><strong>Address Street</strong> </TableCell>
                                                                        <TableCell><strong>Address Zipcode</strong> </TableCell>
                                                                        <TableCell><strong>Address City</strong> </TableCell>
                                                                        <TableCell><strong>Address Country</strong></TableCell>
                                                                        <TableCell><strong>Address Other</strong> </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {logicalAddress.map((addr, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{addr.addr_number}</span></TableCell>
                                                                            <TableCell><span>{addr.addr_street}</span></TableCell>
                                                                            <TableCell><span>{addr.addr_zipcod}</span></TableCell>
                                                                            <TableCell><span>{addr.addr_city}</span></TableCell>
                                                                            <TableCell><span>{addr.addr_country}</span></TableCell>
                                                                            <TableCell><span>{addr.addr_other}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                        <br />
                                        {logicalAka.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>ALIASES</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Name</strong> </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {logicalAka.map((addr, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{addr.name}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                        <br />
                                    </div>
                                    <br></br>
                                    <div className='commonStyle'>Enter Remarks</div>
                                    <div className='commonStyle' style={{ textAlign: 'center' }}>
                                        Select a status and enter remarks for this employee.
                                    </div>
                                    <div>
                                        {errorMessage && (
                                            <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                <span>{errorMessage}</span>
                                            </Typography>
                                        )}
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12} sm={3}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel className='commonStyle'>Status</InputLabel>
                                                    <Select
                                                        label="Status"
                                                        value={selectedStatus}
                                                        className='commonStyle'
                                                        onChange={handleStatusChange}
                                                    >
                                                        <MenuItem value="" className='commonStyle'>Select Status</MenuItem>
                                                        {statusData.map((status) => (
                                                            <MenuItem key={status.id} value={status.id}>
                                                                <span>{status.name}</span>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        {selectedStatus && (
                                            <div>
                                                <div style={{ textAlign: 'center' }} className='commonStyle'>
                                                    Enter your remarks for this action.
                                                </div>
                                                <Grid container alignItems="center" justifyContent="center">
                                                    <Grid item xs={12} sm={8}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="outlined-multiline-static"
                                                            label="Remarks"
                                                            type="text"
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            value={remarks}
                                                            inputRef={remarksRef}
                                                            defaultValue="Default Value"
                                                            onChange={handleRemarksChange}
                                                            InputLabelProps={{ className: 'commonStyle' }}
                                                            InputProps={{ className: 'commonStyle' }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <DialogActions>
                                        <Button className='commonButton' variant="contained" onClick={handleCloseModallogical}>CLOSE</Button>
                                        {selectedStatus && (
                                            <Button type="button" className='commonButton' variant="contained" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                                                SUBMIT
                                            </Button>
                                        )}
                                    </DialogActions>
                                </div>
                            </Card>

                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={showModalgroup} onClose={handleCloseModalgroup} fullWidth
                maxWidth="lg">
                <DialogContent sx={{
                    padding: '0px',
                    overflowY: 'unset',
                }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>


                            <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={handlePrinted}
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </div>
                                <div className="card-body">
                                    <br />
                                    <div ref={myRef}>
                                        <Typography className='allHeading'>DETAILS</Typography>
                                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                            {CityDetails.length > 0 && (
                                                <>
                                                    {CityDetails.map((detail, index) => (
                                                        <Grid container spacing={2} justifyContent="space-between">
                                                            <React.Fragment key={index}>
                                                                <Grid item xs={4}>
                                                                    <Typography><strong>Name</strong> : <span>{detail.name}</span></Typography>
                                                                </Grid>
                                                                <Grid item xs={4}>
                                                                    <Typography><strong>Place of Birth</strong>:<span>{detail.place_of_Birth}</span> </Typography>
                                                                </Grid>
                                                                <Grid item xs={4}>
                                                                    <Typography><strong>Date of Birth</strong>:<span>{detail.dob}</span> </Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><strong>Group Type</strong>:<span>{detail.group_Type}</span> </Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><strong>Citizenship</strong>: <span>{detail.citizenship}</span></Typography>
                                                                </Grid>
                                                            </React.Fragment>
                                                        </Grid>
                                                    ))}
                                                </>
                                            )}
                                        </Card>
                                        <br />
                                        {groupidentification.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>IDENTIFICATIONS</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer >
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Identity</strong></TableCell>
                                                                        <TableCell><strong>Number</strong></TableCell>
                                                                        <TableCell><strong>Det</strong></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {groupidentification.map((id, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{id.identity}</span></TableCell>
                                                                            <TableCell><span>{id.number}</span></TableCell>
                                                                            <TableCell><span>{id.det}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                        <br />
                                        <br />
                                        {Groupaliases.length > 0 && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography className='allHeading'>ALIASES</Typography>
                                                </div>
                                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                    <Grid item xs={12}>
                                                        <TableContainer >
                                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><strong>Type</strong></TableCell>
                                                                        <TableCell><strong>Quality</strong></TableCell>
                                                                        <TableCell><strong>Name</strong></TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {Groupaliases.map((id, index) => (
                                                                        <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                            <TableCell><span>{id.alias_Type}</span></TableCell>
                                                                            <TableCell><span>{id.alias_Quality}</span></TableCell>
                                                                            <TableCell><span>{id.name}</span></TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Card>
                                                <br />
                                            </>
                                        )}
                                    </div>
                                    <br></br>
                                    <div className='commonStyle'>Enter Remarks</div>
                                    <div className='commonStyle' style={{ textAlign: 'center' }}>
                                        Select a status and enter remarks for this employee.
                                    </div>
                                    <div>
                                        {errorMessage && (
                                            <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                <span>{errorMessage}</span>
                                            </Typography>
                                        )}
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12} sm={3}>
                                                <FormControl fullWidth variant="outlined" margin="dense">
                                                    <InputLabel className='commonStyle'>Status</InputLabel>
                                                    <Select
                                                        label="Status"
                                                        value={selectedStatus}
                                                        onChange={handleStatusChange}
                                                        className='commonStyle'

                                                    >
                                                        <MenuItem value="" className='commonStyle'>Select Status</MenuItem>
                                                        {statusData.map((status) => (
                                                            <MenuItem key={status.id} value={status.id}>
                                                                <span>{status.name}</span>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        {selectedStatus && (
                                            <div>
                                                <div style={{ textAlign: 'center' }} className='commonStyle'>
                                                    Enter your remarks for this action.
                                                </div>
                                                <Grid container alignItems="center" justifyContent="center">
                                                    <Grid item xs={12} sm={8}>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="outlined-multiline-static"
                                                            label="Remarks"
                                                            type="text"
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            value={remarks}
                                                            inputRef={remarksRef}
                                                            defaultValue="Default Value"
                                                            onChange={handleRemarksChange}
                                                            InputLabelProps={{ className: 'commonStyle' }}
                                                            InputProps={{ className: 'commonStyle' }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <DialogActions>
                                        <Button variant="contained" onClick={handleCloseModalgroup}>Close</Button>
                                        {selectedStatus && (
                                            <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                                                Submit
                                            </button>
                                        )}
                                    </DialogActions>
                                </div>
                            </Card>

                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog open={showModalun} onClose={handleCloseModalun} fullWidth
                maxWidth="lg">
                <DialogContent sx={{
                    padding: '0px',
                    overflowY: 'unset',
                }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <Box m={2} >
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={handlePrinted}
                                        style={{ minWidth: 'unset', padding: '2px' }}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </div>
                                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                                    <div className="card-body">
                                        <br />
                                        <div ref={myRef}>
                                            <Typography variant="h5">DETAILS</Typography>
                                            <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                {UnDetails.length > 0 ? (
                                                    UnDetails.map((detail, index) => (
                                                        <React.Fragment key={index}>
                                                            <Grid container spacing={2} justifyContent="space-between">
                                                                <Grid item xs={3}>
                                                                    <Typography><b>First Name</b>: {detail.firstName}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Sec Name</b>: {detail.secName}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Third Name</b>: {detail.thirdName}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>List</b>: {detail._list}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Birth Place</b>: {detail.birthPlace}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Birth Type</b>: {detail.birthType}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Citizenship</b>: {detail.citizenship}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Date of Birth</b>: {detail.dob}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Gender</b>: {detail.gender}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Data ID</b>: {detail.dataid}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Nationality</b>: {detail.nationality}</Typography>
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <Typography><b>Remarks</b>: {detail.remarks}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <Typography>No details available</Typography>
                                                )}
                                            </Card>
                                            <br />
                                            {Unaliases.length > 0 && (
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4>ALIASES</h4>
                                                    </div>
                                                    <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                        <Grid item xs={12}>
                                                            <TableContainer component={Paper}>
                                                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Type</TableCell>
                                                                            <TableCell>Quality</TableCell>
                                                                            <TableCell>Name</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {Unaliases.map((id, index) => (
                                                                            <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                                <TableCell>{id._Type}</TableCell>
                                                                                <TableCell>{id.quality}</TableCell>
                                                                                <TableCell>{id.name}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    </Card>
                                                    <br />
                                                </>
                                            )}
                                            <br />
                                            {UnDesignationDetails.length > 0 && (
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4>ALIASES</h4>
                                                    </div>
                                                    <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                                        <Grid item xs={12}>
                                                            <TableContainer component={Paper}>
                                                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Identity</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {UnDesignationDetails.map((id, index) => (
                                                                            <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                                <TableCell>{id.identity}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Grid>
                                                    </Card>
                                                    <br />
                                                </>
                                            )}
                                        </div>
                                        <br></br>
                                        <div>Enter Remarks</div>
                                        <div style={{ textAlign: 'center' }}>
                                            Select a status and enter remarks for this employee.
                                        </div>
                                        <div>
                                            {errorMessage && (
                                                <Typography color="error" style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                    {errorMessage}
                                                </Typography>
                                            )}
                                            <Grid container alignItems="center" justifyContent="center">
                                                <Grid item xs={12} sm={3}>
                                                    <FormControl fullWidth variant="outlined" margin="dense">
                                                        <InputLabel>Status</InputLabel>
                                                        <Select
                                                            label="Status"
                                                            value={selectedStatus}
                                                            onChange={handleStatusChange}
                                                        >
                                                            <MenuItem value="">Select Status</MenuItem>
                                                            {statusData.map((status) => (
                                                                <MenuItem key={status.id} value={status.id}>
                                                                    {status.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            {selectedStatus && (
                                                <div>
                                                    <div style={{ textAlign: 'center' }}>
                                                        Enter your remarks for this action.
                                                    </div>
                                                    <Grid container alignItems="center" justifyContent="center">
                                                        <Grid item xs={12} sm={8}>
                                                            <TextField
                                                                autoFocus
                                                                margin="dense"
                                                                id="outlined-multiline-static"
                                                                label="Remarks"
                                                                type="text"
                                                                fullWidth
                                                                multiline
                                                                rows={4}
                                                                value={remarks}
                                                                inputRef={remarksRef}
                                                                defaultValue="Default Value"
                                                                onChange={handleRemarksChange}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <DialogActions>
                                            <Button variant="contained" onClick={handleCloseModalun}>Close</Button>
                                            {selectedStatus && (
                                                <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                                                    Submit
                                                </button>
                                            )}
                                        </DialogActions>
                                    </div>
                                </Card>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Details;