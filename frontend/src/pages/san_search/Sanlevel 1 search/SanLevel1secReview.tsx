import React, { useState, useEffect, useRef } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, Paper, Typography, TableHead, TableRow, Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, } from '@mui/material'
import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SelectChangeEvent } from '@mui/material';
import Header from '../../../layouts/header/header';
import SearchList from '../SanSearchList';
import statusApiService from '../../../data/services/master/status/status-api-service';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/san_search/hitcase/hitcase-api-service';
import PendingAlertApiService from '../../../data/services/san_search/PendingAlert/pendingalert-api-service';
import ViewService from '../../../data/services/san_search/viewpage/view_api_service';
import { Country, List, Program, All, Customer, Address, IdentificationData, AliasesData, DetailsData, RecordDTO, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../../data/services/san_search/viewpage/view_payload';
import { useParams } from 'react-router-dom';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import '../../tracker/Tracker.css';
import '../../CommonStyle/Style.css'
export interface Employee {
  id: number;
  name: string;
  dob: string;
  title: string;
  lastName: string;
  state: string;
  dist: string;
  address: string;
  designation: string;
  ministry: string;
  placeOfBirth: string;
  coName: string;
  department: string;
};

interface Status {
  id: string;
  name: string;
};

interface PendingAlert {
  id: number;
  searchId: string;
  hitId: number;
  criminalId: number;
  criminalName: string;
  searchName: string;
  matchingScore: string;
  remark: string;
  statusId: string;
  case_id: string;
  dt: string;
  level_id: string;
  search_id: string;
  fileType: number;
};

interface DisabledIcons {
  [key: string]: boolean;
};


interface RemarkDetails {
  level: string;
  remark: string;
  createdAt: string;
  status: string;
};

const Levelcasedetails = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serialNumber, setSerialNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const status = new statusApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();
  const [statusData, setStatusData] = useState<any[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [remarksData, setRemarksData] = useState<{ [key: number]: string }>({});
  const [isSearchTableVisible, setIsSearchTableVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchTable, setShowSearchTable] = useState(false);
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const authService = new PendingAlertApiService();
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<PendingAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModallogical, setShowModallogical] = useState(false);
  const [showModalgroup, setShowModalgroup] = useState(false);
  const [showModalun, setShowModalun] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const viewservice = new ViewService();
  const [Groupaliases, setGroupaliases] = useState<GroupAliases[]>([]);
  const [CityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const [groupidentification, setGroupIdentification] = useState<GroupIdentification[]>([]);
  const [UnDetails, setUnDetails] = useState<UnDetails[]>([]);
  const [Unaliases, setUnaliases] = useState<UnAliases[]>([]);
  const [UnDesignationDetails, setUnDesignationDetails] = useState<UnDesignationDetails[]>([]);
  const [details, setdetails] = useState<DetailsData[]>([]);
  const [address, setaddress] = useState<Address[]>([]);
  const [identification, setIdentification] = useState<IdentificationData[]>([]);
  const [aliases, setAliases] = useState<AliasesData[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { id, ids } = useParams();
  const [List, setList] = useState<List[]>([]);
  const [country, setCountry] = useState<Country[]>([]);
  const [Program, setProgram] = useState<Program[]>([]);
  const [RecordType, setRecordType] = useState<All[]>([]);
  const [logicalidentification, setLogicalIdentification] = useState<logicalIdentification[]>([]);
  const [logicalAddress, setLogicalAddress] = useState<logicaAddress[]>([]);
  const [logicaldetails, setLogicaldetails] = useState<LogicalDetails[]>([]);
  const [logicalcitiy, setLogicalcitiy] = useState<Logicalcitiy[]>([]);
  const [logicalBirthDetails, setLogicalBirthDetails] = useState<LogicalBirthDetails[]>([]);
  const [logicalAka, setLogicalAka] = useState<LogicalAKADetails[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number | null>(null);
  const [remarkDetails, setRemarkDetails] = useState<RemarkDetails[]>([]);

  const [countryData, setcountryData] = useState<Customer>({
    id: 0,
    city: '',
    State: '',
  });

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

  useEffect(() => {
    fetchStatus();
    handlePendingAlertClick();
  }, [page, rowsPerPage]);

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

  const handlePendingAlertClick = async () => {
    try {
      let results = await authService.getpendingalertdetails();
      setPendingAlert(results);
      setSearchResults(results);
      setShowPendingAlertTable(true);
    } catch (error) {
      console.log("Error fetching the handlePendingAlertClick:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const statuses: Status[] = await status.getStatus();
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
    setSelectedStatus('');
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

  // const handleIconClick = (INDEX: number) => {
  //   const currentIndex = page * rowsPerPage + INDEX;
  //   const existingAction = selectedActions[currentIndex] || '';
  //   const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
  //   const hitdataId = Number(selectedSearchResult.hitId);
  //   const selectedSearchResult = pendingAlert[currentIndex];
  //   setSelectedCourierTracker(selectedSearchResult);
  //   setSelectedStatus(existingAction);
  //   setRemarks(existingRemarks);
  //   setSelectedRows(currentIndex);
  //   setIsRemarksDialogOpen(true);
  // };

  const handleIconClick = (INDEX: number) => {
    const currentIndex = page * rowsPerPage + INDEX;
    const selectedSearchResult = pendingAlert[currentIndex];
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    const hitdataId = Number(selectedSearchResult.hitId);
    setSelectedCourierTracker(selectedSearchResult);
    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRows(currentIndex);
    setIsRemarksDialogOpen(true);
    handleRemarkDetails(hitdataId);
  };

  const handleRemarkDetails = async (hitdataId: number) => {
    try {
      const response = await authService.getRemarkDetails(hitdataId);
      setRemarkDetails(response);
    } catch (error) {
      console.log("Error fetching the handleRemarkDetails:", error);
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
      if (selectedRows !== null) {
        const updatedRemarksAndActions = { ...remarksAndActions };
        const rowKey = `${formData.searchId}-${formData.ids}`;
        updatedRemarksAndActions[rowKey] = { action: selectedStatus, remarks };
        setRemarksAndActions(updatedRemarksAndActions);
        const selectedSearchResult = searchResults[selectedRows];
        const hitdatalifecyclePayload = {
          searchId: selectedSearchResult.searchId,
          criminalId: selectedSearchResult.criminalId,
          statusId: selectedStatus,
          remark: remarks,
          hitId: selectedSearchResult.hitId,
          levelId: '2',
          caseId: selectedSearchResult.caseId,
          uid: loginDetails.id,
        };
        const hitcasePayload = {
          display: '',
          searchId: selectedSearchResult.searchId,
          hitId: selectedSearchResult.hitId,
          criminalId: selectedSearchResult.criminalId,
          levelId: '2',
          statusNowId: selectedStatus,
          cycleId: '1',
          remark: remarks,
          uid: loginDetails.id,
        };
        if (parseInt(selectedStatus) === 1) {
          await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
          handlePendingAlertClick();
        }
        if (parseInt(selectedStatus) === 2) {
          await hitcaseApiService.CreateHitCaseInsert(hitcasePayload);
          handlePendingAlertClick();
        }
        setSelectedActions({
          ...selectedActions,
          [rowKey]: selectedStatus,
        });
        setDisabledIcons({
          ...disabledIcons,
          [rowKey]: true,
        });
      }
      setIsRemarksDialogOpen(false);
    } catch (error) {
      console.error("Error submitting remarks:", error);
      setErrorMessage('An error occurred while submitting remarks.');
    }
  };

  const handleTableRowClick = async (criminalId: number, fileType: number, index: number, searchId: string) => {
    const id = String(criminalId);
    if (fileType === 1) {
      setShowModal(true);
      const currentIndex = `${searchId}-${criminalId}-${index}`;
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
      const currentIndex = `${searchId}-${criminalId}-${index}`;
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
      const currentIndex = `${searchId}-${criminalId}-${index}`;
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
      const currentIndex = `${searchId}-${criminalId}-${index}`;
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

  const myRef = useRef(null);

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

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 2 }}>

          <Box
            sx={{
              // marginLeft: '30px',
              marginBottom: '20px',
              marginTop: '60px'
            }}
          >
            <Typography className='allHeading'>LEVEL 1 SECOND REVIEW</Typography>
          </Box>
          <Box mb={4}>
            <Grid container spacing={2} justifyContent="center">
              {showPendingAlertTable && (
                <TableContainer
                  component={Card}
                  style={{
                    overflow: 'auto',
                    maxHeight: '400px',
                    width: '98%',
                  }}
                >
                  <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }} stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{
                            padding: '4px',
                            minWidth: '80px',
                            backgroundColor: '#D3D3D3'
                          }}
                        >
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <strong>S.No</strong>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                            <strong>Search Name</strong>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }} >
                          <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                            <strong>Hit Name</strong>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <strong>Score</strong>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <strong>Remark</strong>
                          </Typography>
                        </TableCell>
                        <TableCell style={{ padding: '4px', backgroundColor: '#D3D3D3' }}>
                          <Typography variant="caption" style={{ fontWeight: 'bold', }}>
                            <strong>Action</strong>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingAlert.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>
                            <Typography variant="caption" color="textSecondary">
                              <strong> Not Available</strong>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingAlert.map((alert, index) => (
                          <TableRow key={alert.criminalId} hover style={{ height: '32px' }}>
                            <TableCell style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
                            <TableCell style={{ padding: '4px', }}>
                              <span> {alert.searchName.charAt(0).toUpperCase() + alert.searchName.slice(1)}</span>
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                handleTableRowClick(
                                  alert.criminalId,
                                  alert.fileType,
                                  index,
                                  alert.searchId.toString()
                                )
                              }
                              style={{
                                cursor: 'pointer',
                                color: '#3F51B5',
                                textDecoration: 'underline',
                                padding: '4px',

                              }}
                            >
                              <span>
                                {alert.criminalName.charAt(0).toUpperCase() + alert.criminalName.slice(1)}
                              </span>

                            </TableCell>
                            <TableCell style={{ padding: '4px', }}><span>{alert.matchingScore}</span></TableCell>
                            {/* <TableCell style={{ padding: '4px', }}><span>{alert.remark ? alert.remark : 'Not Available'}</span></TableCell> */}
                            <TableCell style={{ padding: '4px' }}>
                              <span>
                                {alert.remark.length > 20
                                  ? alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1, 20) + '...'
                                  : alert.remark.charAt(0).toUpperCase() + alert.remark.slice(1)}
                              </span>
                            </TableCell>

                            <TableCell style={{ padding: '4px' }}>
                              <IconButton onClick={() => handleIconClick(index)} style={{ padding: '2px' }}>
                                {selectedAction ? (
                                  <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                ) : (
                                  <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                )}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Box>

        </Box>
      </Box>
      <Dialog
        open={isRemarksDialogOpen}
        onClose={handleCloseRemarksDialog}
        fullWidth
        maxWidth="md"
        scroll="body"
      >
        <DialogActions>
          <Button onClick={handleCloseRemarksDialog} color="primary">
            <ClearIcon />
          </Button>
        </DialogActions>
        {/* Vertical Tracker */}
        {selectedCourierTracker && (
          <>
            <Card
              style={{
                margin: '-3px 0',
                boxShadow: 'rgb(0 0 0/28%) 0px 4px 8px',
                width: '90%',
                marginLeft: '4%',
                borderRadius: '8px',
                fontFamily: 'Bookman Old Style',
                marginTop: '-1%',
                maxHeight: '250px',
                overflowY: 'auto'
              }}>
              <span style={{ marginLeft: '3%', marginTop: '1%', fontSize: 'Large', fontWeight: 'bold' }}>
                {selectedCourierTracker.criminalName.charAt(0).toUpperCase() + selectedCourierTracker.criminalName.slice(1) || 'Not Available'}
              </span>
              <span style={{ marginLeft: '3%' }}>
                Search Name : {selectedCourierTracker.searchName.charAt(0).toUpperCase() + selectedCourierTracker.searchName.slice(1) || 'Not Available'}
              </span>
              <span style={{ marginLeft: '3%' }}>
                Matching Score : {selectedCourierTracker.matchingScore || 'Not Available'}
              </span>
              <ul className="timeline">
                {remarkDetails && remarkDetails.length > 0 ? (
                  (() => {
                    let displayedLevels = new Set();
                    return remarkDetails.map((detail, index) => {
                      const isLevelDisplayed = displayedLevels.has(detail.level);
                      displayedLevels.add(detail.level);
                      return (
                        <li className="list active" key={index}>
                          <div className="list-content">
                            <div className="details">
                              {!isLevelDisplayed && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span className="status-title" style={{ fontSize: 'small', fontWeight: 'bold', marginRight: '8px' }}>
                                    {detail.level || 'Not Available'}
                                  </span>
                                  <span className="status-title" style={{ color: '#8f98a1', fontSize: 'small' }}>
                                    {detail.status || 'Not Available'}
                                  </span>
                                </div>
                              )}
                              <div></div>
                              <span className="status-title" style={{ color: '#8f98a1', fontSize: 'smaller' }}>
                                {detail.createdAt || 'Not Available'}
                              </span>
                              <div></div>
                              <span className="Status-title" style={{ color: '#080807', fontSize: 'small' }}>
                                {detail.remark.charAt(0).toUpperCase() + detail.remark.slice(1) || 'Not Available'}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    });
                  })()
                ) : (
                  <span style={{ color: '#8f98a1' }}>No Remarks Available</span>
                )}
              </ul>
            </Card>
          </>
        )}
        <DialogContentText style={{ textAlign: 'center', marginTop: '2%' }}>
          Select a status and enter remarks for this employee.
        </DialogContentText>
        <DialogContent>
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
          <br></br>
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
          <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
            Save
          </button>
        </DialogActions>
      </Dialog >
      <Dialog open={isDialogOpen} fullWidth maxWidth="xl">
        <DialogActions>
          <Button
            onClick={() => setIsDialogOpen(false)}
            color="primary"
          >
            <ClearIcon />
          </Button>
        </DialogActions>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && <SearchList employee={selectedEmployee} />}
        </DialogContent>
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
                  <div className="card-body" >
                    <div ref={myRef}>
                      <h5>DETAILS</h5>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <Grid container spacing={2} justifyContent="space-between">
                          <Grid item xs={3}>
                            {details.slice(0, Math.ceil(details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                          <Grid item xs={3}>
                            {details.slice(Math.ceil(details.length / 3), Math.ceil(2 * details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                          <Grid item xs={3}>
                            {details.slice(Math.ceil(2 * details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                        </Grid>
                      </Card>
                      <br />
                      {identification.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>IDENTIFICATIONS</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Type</TableCell>
                                      <TableCell>ID</TableCell>
                                      <TableCell>Country</TableCell>
                                      <TableCell>Issue Date </TableCell>
                                      <TableCell>Expire Date</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {identification.map((identification, index) => (
                                      <TableRow key={identification.type + identification.country + identification.issue_Date} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{identification.type}</TableCell>
                                        <TableCell>{identification.ids}</TableCell>
                                        <TableCell>{identification.country}</TableCell>
                                        <TableCell>{identification.dateClarification === "Issue Date" ? identification.issue_Date : ''}
                                        </TableCell>
                                        <TableCell>
                                          {identification.dateClarification === "Expiration Date" ? identification.issue_Date : ''}
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
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Type</TableCell>
                                      <TableCell>Category</TableCell>
                                      <TableCell>Name</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {aliases.filter(alias => alias.aliasesType !== "Name").map((alias, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{alias.aliasesType}</TableCell>
                                        <TableCell>{alias.category}</TableCell>
                                        <TableCell>{alias.aliasesName}</TableCell>
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
                            <h4>Addresses</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Region</TableCell>
                                      <TableCell>Address1</TableCell>
                                      <TableCell>Address2</TableCell>
                                      <TableCell>Address3</TableCell>
                                      <TableCell>City</TableCell>
                                      <TableCell>Province</TableCell>
                                      <TableCell>Postal Code</TableCell>
                                      <TableCell>Country </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {address.map((addres, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{addres.region}</TableCell>
                                        <TableCell>{addres.address1}</TableCell>
                                        <TableCell>{addres.address2}</TableCell>
                                        <TableCell>{addres.address3}</TableCell>
                                        <TableCell>{addres.city}</TableCell>
                                        <TableCell>{addres.province}</TableCell>
                                        <TableCell>{addres.postal}</TableCell>
                                        <TableCell>{addres.countryName}</TableCell>
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
                        <Button variant="contained" onClick={handleCloseModal}>Close</Button>
                        {selectedStatus && (
                          <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                            Submit
                          </button>
                        )}
                      </DialogActions>
                    </div>
                  </div>
                </Card>
              </Box>
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
              <Box m={2} style={{ marginTop: '5%' }}>
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
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body">
                    <br />
                    <div ref={myRef}>
                      <h4>DETAILS</h4>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <Grid container spacing={2} justifyContent="space-between">
                          {logicaldetails.length > 0 ? (
                            logicaldetails.map((detail, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4}>
                                  <Typography><b>First Name</b>: {detail.naal_firstname}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Middle Name</b>: {detail.naal_middlename}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Last Name</b>: {detail.naal_lastname}</Typography>
                                </Grid>
                              </React.Fragment>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography>No details available</Typography>
                            </Grid>
                          )}
                          {logicalBirthDetails.length > 0 ? (
                            logicalBirthDetails.map((detail, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4}>
                                  <Typography><b>Birth Country</b>: {detail.birt_country}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Birth Place</b>: {detail.birt_plcae}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography><b>Birth Date</b>: {detail.birt_date}</Typography>
                                </Grid>
                              </React.Fragment>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography>No details available</Typography>
                            </Grid>
                          )}
                          {logicalcitiy.length > 0 ? (
                            logicalcitiy.map((detail, index) => (
                              <React.Fragment key={index}>
                                <Grid item xs={4}>
                                  <Typography><b>City Country</b>: {detail.citi_country}</Typography>
                                </Grid>
                              </React.Fragment>
                            ))
                          ) : (
                            <Grid item xs={12}>
                              <Typography>No details available</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Card>
                      <br />
                      {logicalidentification.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>IDENTIFICATIONS</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Identification Leba publication date</TableCell>
                                      <TableCell>Entity logical id Identification</TableCell>
                                      <TableCell>Identification leba numtitle</TableCell>
                                      <TableCell>Identification</TableCell>
                                      <TableCell>Identification</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalidentification.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.entity_logical_id_Iden !== 0 ? id.entity_logical_id_Iden : null}</TableCell>
                                        <TableCell>{id.iden_Leba_publication_date}</TableCell>
                                        <TableCell>{id.iden_country}</TableCell>
                                        <TableCell>{id.iden_leba_numtitle}</TableCell>
                                        <TableCell>{id.iden_number}</TableCell>
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
                            <h4>Addresses</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Address Number </TableCell>
                                      <TableCell>Address Street </TableCell>
                                      <TableCell>Address Zipcode </TableCell>
                                      <TableCell>Address City </TableCell>
                                      <TableCell>Address Country</TableCell>
                                      <TableCell>Address Other </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalAddress.map((addr, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{addr.addr_number}</TableCell>
                                        <TableCell>{addr.addr_street}</TableCell>
                                        <TableCell>{addr.addr_zipcod}</TableCell>
                                        <TableCell>{addr.addr_city}</TableCell>
                                        <TableCell>{addr.addr_country}</TableCell>
                                        <TableCell>{addr.addr_other}</TableCell>
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
                            <h4>ALIASES</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Name </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalAka.map((addr, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{addr.name}</TableCell>
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
                      <Button variant="contained" onClick={handleCloseModallogical}>Close</Button>
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
                        {CityDetails.length > 0 && (
                          <>
                            {CityDetails.map((detail, index) => (
                              <Grid container spacing={2} justifyContent="space-between">
                                <React.Fragment key={index}>
                                  <Grid item xs={4}>
                                    <Typography><b>Name</b> : {detail.name}</Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography><b>Place of Birth</b>: {detail.place_of_Birth}</Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography><b>Date of Birth</b>: {detail.dob}</Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography><b>Group Type</b>: {detail.group_Type}</Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography><b>Citizenship</b>: {detail.citizenship}</Typography>
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
                            <Typography variant="h5">IDENTIFICATIONS</Typography>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Identity</TableCell>
                                      <TableCell>Number</TableCell>
                                      <TableCell>det</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {groupidentification.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.identity}</TableCell>
                                        <TableCell>{id.number}</TableCell>
                                        <TableCell>{id.det}</TableCell>
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
                                    {Groupaliases.map((id, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{id.alias_Type}</TableCell>
                                        <TableCell>{id.alias_Quality}</TableCell>
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
                      <Button variant="contained" onClick={handleCloseModalgroup}>Close</Button>
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
  );
}

export default Levelcasedetails;