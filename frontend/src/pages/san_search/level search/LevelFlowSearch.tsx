import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent, Box, FormControl, InputLabel, TextField, Grid, Slider, Typography, Paper } from '@mui/material';
import ViewService from '../../../data/services/san_search/viewpage/view_api_service';
import Header from '../../../layouts/header/header';
import LevelStatusMappingApiService from '../../../data/services/san_search/levelstatusmapping/levelstatusmapping-api-service';
import { useSelector } from 'react-redux';
import levelApiService from '../../../data/services/san_search/level/level-api-service';
import HitdatalifecycleApiService from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useReactToPrint } from 'react-to-print';
import { Snackbar, Alert } from '@mui/material';
import { Country, List, Program, All, Customer, Address, IdentificationData, AliasesData, DetailsData, SearchDTO, RecordDTO, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../../data/services/san_search/viewpage/view_payload';


interface LevelStatus {
    id: number;
    levelId: number;
    statusId: number;
    uid: number;
    status: string
    passingLevelId: number;
    isAlive: number;

}

interface Level {
    id: string;
    name: string;
}
interface BulkTask {
    uid: number;
    searchName: string;
    userName: String;
};

const SearchComponent = () => {
    const { id, ids, uid } = useParams();

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
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
    }); const [sliderValue, setSliderValue] = useState(80);
    const [records, setRecords] = useState<RecordDTO[]>([]);
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string>('0');
    const [remarks, setRemarks] = useState('');
    const [selectedRow, setSelectedRow] = useState<RecordDTO | null>(null);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [List, setList] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState(0);
    const [country, setCountry] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [RecordType, setRecordType] = useState<All[]>([]);
    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [address, setaddress] = useState<Address[]>([]);
    const [identification, setIdentification] = useState<IdentificationData[]>([]);
    const [aliases, setAliases] = useState<AliasesData[]>([]);
    const [details, setdetails] = useState<DetailsData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showModallogical, setShowModallogical] = useState(false);
    const [showModalgroup, setShowModalgroup] = useState(false);
    const [showModalun, setShowModalun] = useState(false);
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
    const [BulkTaskAssignView, setBulkTaskAssignView] = useState<BulkTask[]>([]);
    const [showBulkTaskAssignView, setShowBulkTaskAssignView] = useState(true);
    const [Program, setProgram] = useState<Program[]>([]);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const [nameError, setNameError] = useState('');
    const hitdatalifecycleApiService = new HitdatalifecycleApiService();
    const viewservice = new ViewService();
    const customer = new ViewService();
    const levelService = new LevelStatusMappingApiService();
    const levelServices = new levelApiService();
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        fetchLevelStatus();
        fetchLevels()

        fetchCountry();
        fetchList();
        fetchProgram();
        fetchAll();
        // fetchAddresses();
        // fetchIdentification();
        // fetchAliases();
        // fetchDetails();
        // fetchiden();
        // fetchaddress();
        // fetchadetails();
        // fetchacitiy();
        // fetchBirthDetails();
        // fetchAka();
        // fetchaliase();
        // fetchanationalid();
        // fetchCityDetails();
        // fetchUnDetails();
        // fetchunaliase();
        // fetchundesingation();

        fetchBulkTaskAssignView();
    }, [ids]);
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
    const handleSearch = async () => {
        const searchDTO = {
            name: formData.name,
            matching_score: sliderValue,
            listID: selectedList,
            partySubTypeID: selectedRecordType,
            countryId: selectedCountry,
            uid: loginDetails.id,
            isBulkSearch: 0
        };

        try {
            setLoading(true);
            if (!formData.name || formData.name.trim() === '' && sliderValue === 100) {
                setSearchError(true);
                setLoading(false);
                setNameError('Name is required')
                return;
            }

            setNameError('');
            const result = await customer.getRecordsCount(searchDTO);

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
            ids: 0, name: '', address: '', program: '', entityType: '', list: '', score: 0,
            fileType: 0, fileList: '', criminalId: '', searchId: '', hitId: '', nationality: '', citizenship: '', passport: '',
            Country: '',
            accountNumber: '',
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
                setRecords(prevRecords => prevRecords.filter(row => row.ids !== selectedRow.ids));
                // await handleSearch();
                // If success, close dialog and show success snackbar
                setOpenDialog(false);
                setSnackbarMessage('Saved successfully!');
                setOpenSnackbar(true);
                setSelectedAction(''); // Reset selected action
                setRemarks('');

            } catch (error) {
                console.error("Error while submitting remarks:", error);
                setSnackbarMessage('Failed to save data. Please try again.');
                setOpenSnackbar(true);
            } finally {
                // Hide loading after the operation
                setLoading(false);
                handleCloseModal();
                handleCloseModallogical();
                handleCloseModalgroup();
                handleCloseModalun();

                console.log("Selected action:", selectedAction);
                console.log("Remarks:", remarks);
                console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
            }
        }
    };

    // const handleTableRowClick = async (ids: number) => {
    //     const uid = loginDetails.id;
    //     const id = String(ids);
    //     try {
    //         setLoading(true);


    //         const [detailsData, identificationData, aliasesData, addressData]
    //             = await Promise.all([viewservice.getDetails(id), viewservice.getIdentification(id), viewservice.getAliases(id), viewservice.getAddresses(id)]);

    //     } catch (error) {
    //         console.error("Error fetching details:", error);
    //     }
    //     // setModalContent(content);
    //     setIsModalOpen(true);
    // };

    // const handleTableRowClick = async (ids: number, fileType: number) => {
    //     const id = String(ids);
    //     if (fileType === 1) {
    //         setShowModal(true);
    //      alert(` ids: ${ids},fileType:${fileType}`);

    //         try {
    //             setLoading(true);
    //             const detailsData = await viewservice.getDetails(id);
    //             setdetails(detailsData);
    //             const identificationData = await viewservice.getIdentification(id);
    //             setIdentification(identificationData);
    //             const aliasesData = await viewservice.getAliases(id);
    //             setAliases(aliasesData);
    //             const addressData = await viewservice.getAddresses(id);
    //             setaddress(addressData);
    //         } catch (error) {
    //             console.error("Error fetching details:", error);
    //         }
    //         setLoading(false);
    //     } else if (fileType === 2) {
    //         setShowModallogical(true);

    //         try {
    //             setLoading(true);
    //             const logicalidentification = await viewservice.getLogicalIdentification(id);
    //             setLogicalIdentification(logicalidentification);
    //             const logicalAddress = await viewservice.getLogicalAddress(id);
    //             setLogicalAddress(logicalAddress);
    //             const logicaldetails = await viewservice.getLogicaldetails(id);
    //             setLogicaldetails(logicaldetails);
    //             const logicalcitiy = await viewservice.getLogicalcity(id);
    //             setLogicalcitiy(logicalcitiy);
    //             const logicalBirthDetails = await viewservice.getLogicalBirthDetails(id);
    //             setLogicalBirthDetails(logicalBirthDetails);
    //             const logicalAka = await viewservice.getLogicalAka(id);
    //             setLogicalAka(logicalAka);
    //         } catch (error) {
    //             console.error("Error fetching details:", error);
    //         }
    //         setLoading(false);
    //     } else if (fileType === 3) {

    //         try {
    //             setLoading(true);
    //             const Groupaliases = await viewservice.getGroupAliases(id);
    //             setGroupaliases(Groupaliases);
    //             const CityDetails = await viewservice.getGroupCityDetails(id);
    //             setCityDetails(CityDetails);
    //             const groupidentification = await viewservice.getGroupIdentification(id);
    //             setGroupIdentification(groupidentification);
    //         } catch (error) {
    //             console.error("Error fetching details:", error);
    //         }
    //         setLoading(false);
    //     }
    //     else if (fileType === 4) {
    //         setShowModalun(true);
    //         setSelectedAction(''); // Reset selected action
    //         setRemarks('');

    //         try {
    //             setLoading(true);
    //             const UnDetails = await viewservice.getUnDetails(id);
    //             setUnDetails([UnDetails]);
    //             const Unaliases = await viewservice.getUnAliases(id);
    //             setUnaliases(Unaliases);
    //             const UnDesignationDetails = await viewservice.getUnDesignationDetailss(id);
    //             setUnDesignationDetails(UnDesignationDetails);
    //         } catch (error) {
    //             console.error("Error fetching details:", error);
    //         }
    //     }
    //     setLoading(false);
    // };
    const handleTableRowClick = async (ids: number, fileType: number, index: number, searchId: string) => {
        const id = String(ids);
        if (fileType === 1) {
            setShowModal(true);
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
            const dataForExport = records.map((row) => ({
                FileList: row.fileList,
                Name: row.name,
                Address: row.address,
                Type: row.entityType,
                Program: row.program,
                List: row.list,
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

                <div style={{ display: 'flex', gap: '2%' }}>
                    <FormControl style={{ width: '100%' }}>
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
                    <TextField className="custom-textfield .MuiInputBase-root"
                        style={{ width: '100%' }}
                        label="Account Number"
                        id="Account Number"
                        size='small'
                        variant="outlined"
                        type="text"
                        name="name"
                        autoComplete="off"
                        value={formData.accountNumber}

                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    />
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
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (nameError) {
                                setNameError('');
                            }
                        }} />
                    {nameError && <span style={{ color: 'red' }}>{nameError}</span>}



                    {List.length > 0 && (
                        <FormControl style={{ width: '100%' }}>
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
                        <FormControl style={{ width: '100%' }}>
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

                    <TextField className="custom-textfield .MuiInputBase-root"
                        style={{ width: '50%' }}
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
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3%' }} >
                        <div >
                            <Button className='allbutton'
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>
                        <div>
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
                </div>
            </Card>
            <br />

            <h6 className='allheading'> LOOKUP RESULTS ({records.length})</h6>
            <div ref={Ref}>
                <TableContainer className="table-container" component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '350px', overflowY: 'auto' }}>
                    <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                            <TableRow className="tableHeading">
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '20px' }}>S.No</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('fileList')}>File List {sortedColumn === 'fileList' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>

                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('name')}>Name {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('entityType')}>Type{sortedColumn === 'entityType' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }} onClick={() => handleSort('nationality')}>Nationality {sortedColumn === 'nationality' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }} onClick={() => handleSort('citizenship')}>Citizenship {sortedColumn === 'citizenship' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '30px' }} onClick={() => handleSort('passport')}>Passport {sortedColumn === 'passport' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>
                                <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '30px' }} onClick={() => handleSort('address')}>Address {sortedColumn === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}</TableCell>

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
                                records.map((row, index) => (

                                    <TableRow key={row.ids} style={{ height: '32px' }}>
                                        <TableCell style={{ padding: '4px' }}>{index + 1}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.fileList}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleTableRowClick(
                                                        row.ids, row.fileType, index, row.searchId.toString()

                                                    );
                                                    setSelectedRow(row);
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: '#1677FF',
                                                    textDecoration: 'underline',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {row.name.charAt(0).toUpperCase() + row.name.slice(1)}
                                            </a>
                                        </TableCell>



                                        <TableCell style={{ padding: '4px' }}>{row.entityType}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.nationality}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.citizenship}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.passport}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.address}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>{row.score}</TableCell>
                                        <TableCell style={{ padding: '4px' }}>
                                            <IconButton onClick={() => handleIconClick(row,)} style={{ padding: '1px' }}>
                                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                            </IconButton>
                                            <span> </span>
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

                                        <div style={{ padding: '4px 20px' }}>

                                            <DialogTitle className="custom-dialog-title">Remarks and Actions</DialogTitle>

                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                <InputLabel className='commonStyle'>Status</InputLabel>
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

                                        </div>
                                        <DialogActions>
                                            <Button className='commonButton' variant="contained" onClick={handleCloseModal}>Close</Button>
                                            {selectedAction && (
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
                                    <div style={{ padding: '4px 20px' }}>

                                        <DialogTitle className="custom-dialog-title">Remarks and Actions</DialogTitle>

                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel className='commonStyle'>Status</InputLabel>
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

                                    </div>
                                    <DialogActions>
                                        <Button className='commonButton' variant="contained" onClick={handleCloseModallogical}>CLOSE</Button>
                                        {selectedAction && (
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
                                    <div style={{ padding: '4px 20px' }}>

                                        <DialogTitle className="custom-dialog-title">Remarks and Actions</DialogTitle>

                                        <FormControl fullWidth variant="outlined" margin="dense">
                                            <InputLabel className='commonStyle'>Status</InputLabel>
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

                                    </div>
                                    <DialogActions>
                                        <Button variant="contained" onClick={handleCloseModalgroup}>Close</Button>
                                        {selectedAction && (
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
                                        <div style={{ padding: '4px 20px' }}>

                                            <DialogTitle className="custom-dialog-title">Remarks and Actions</DialogTitle>

                                            <FormControl fullWidth variant="outlined" margin="dense">
                                                <InputLabel className='commonStyle'>Status</InputLabel>
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

                                        </div>
                                        <DialogActions>
                                            <Button variant="contained" onClick={handleCloseModalun}>Close</Button>
                                            {selectedAction && (
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

