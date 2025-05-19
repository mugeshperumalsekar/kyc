import React, { useEffect, useRef, useState } from 'react';
import {

  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  IconButton
} from '@mui/material';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';

import { Card } from 'react-bootstrap';
import SearchApiService from '../../../data/services/san_search/search-api-service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { Country, List, Program, All, Customer, CustomerRequest, Address, IdentificationData, AliasesData, PlaceOfBirthData, NationalityData, Birthdate, DetailsData, SearchDTO, RecordDTO, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../../data/services/san_search/viewpage/view_payload';
import ViewService from '../../../data/services/san_search/viewpage/view_api_service';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/san_search/hitcase/hitcase-api-service';
import { SelectChangeEvent } from '@mui/material/Select';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import { useReactToPrint } from 'react-to-print'; // Example import, adjust based on your actual library
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LevelStatusMappingApiService from '../../../data/services/san_search/levelstatusmapping/levelstatusmapping-api-service';
import levelApiService from '../../../data/services/san_search/level/level-api-service';
import { Snackbar, Alert } from '@mui/material';


interface Notification {
  id: number;
  name: string;
  created_at: string;
  matching_score: number;
  createdBy: number;
}

interface Levelpending {
  id:number;
  name: string;
  matching_score: number;
  hitName: string;
  hitScore: number;
  hitId: string;
  recId: number;
  searchId: string;
  lifcycleSearchId: string;
  fileType: number;
}
interface Status {
  id: string;
  name: string;
  // Add other properties if necessary
}

interface DisabledIcons {
  [key: string]: boolean;
}

interface BulkTask {
  uid: number;
  searchName: string;
  userName: String;
  matchingScore: number;
  created_at: string;
};

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


const NotificationComponent = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const userFirstName = userDetails.userData?.firstName;
  const loginDetails = userDetails.loginDetails;

  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  const [levelpending, setLevelpending] = useState<Levelpending[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const [RecordType, setRecordType] = useState<All[]>([
  ]);

  const viewservice = new ViewService();
  const [selectedRecordType, setSelectedRecordType] = useState(0);
  const [Program, setProgram] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [List, setList] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState(0);
  const [country, setCountry] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [filteredData, setFilteredData] = useState<RecordDTO[]>([]);
  const [filteredDatas, setFilteredDatas] = useState<Levelpending[]>([]);

  const [searchError, setSearchError] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(100);
  const [data, setData] = useState<RecordDTO[]>([
  ]);
  const [address, setaddress] = useState<Address[]>([
  ]);
  const [identification, setIdentification] = useState<IdentificationData[]>([
  ]);
  const [aliases, setAliases] = useState<AliasesData[]>([
  ]);
  const [details, setdetails] = useState<DetailsData[]>([
  ]);
  const [sortedColumn, setSortedColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [showModallogical, setShowModallogical] = useState(false);
  const [showModalgroup, setShowModalgroup] = useState(false);
  const [showModalun, setShowModalun] = useState(false);

  const [selectedSearchDetails, setSelectedSearchDetails] = useState<string>(''); // Initialize with an appropriate default value
  const [logicaldetails, setLogicaldetails] = useState<LogicalDetails[]>([
  ]);
  const [logicalcitiy, setLogicalcitiy] = useState<Logicalcitiy[]>([
  ]);
  const [logicalBirthDetails, setLogicalBirthDetails] = useState<LogicalBirthDetails[]>([
  ]);
  const [logicalidentification, setLogicalIdentification] = useState<logicalIdentification[]>([
  ]);
  const [logicalAddress, setLogicalAddress] = useState<logicaAddress[]>([
  ]);
  const [logicalAka, setLogicalAka] = useState<LogicalAKADetails[]>([
  ]);
  const [Groupaliases, setGroupaliases] = useState<GroupAliases[]>([
  ]);
  const [CityDetails, setCityDetails] = useState<CityDetails[]>([]);
  const [groupidentification, setGroupIdentification] = useState<GroupIdentification[]>([
  ]);
  const [UnDetails, setUnDetails] = useState<UnDetails[]>([]);
  const [Unaliases, setUnaliases] = useState<UnAliases[]>([
  ]);
  const [UnDesignationDetails, setUnDesignationDetails] = useState<UnDesignationDetails[]>([
  ]);
  const [statusData, setStatusData] = useState<Status[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});

  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [selectedCourierTracker, setSelectedCourierTracker] = useState<any | null>(null); // State to store the selected courier tracker
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>([])
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const levelService = new LevelStatusMappingApiService();
  const levelServices = new levelApiService();

  useEffect(() => {
    // fetchStatus();
    handlePendingAlertClick();
  }, [page, rowsPerPage]);

  const remarksRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectedStatus && remarksRef.current) {
      remarksRef.current.focus();
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchLevelStatus();
    fetchLevels();
    fetchNotifications();
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
    fetchStatus();
    fetchBulkTaskAssignView();
  
  }, [id]);
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


  const fetchNotifications = async () => {
    try {
      const notifications = await authApiService.getNotification();
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchLevelpending = async (id: any) => {
    try {
      const levelpending = await authApiService.getLevelpending(id);
      setLevelpending(levelpending);
    } catch (error) {
      console.error("Error fetching the details:", error);
      setError("Error fetching the details");
    }
  };

  const handleNotificationClick = async (id: number) => {
    if (selectedNotification === id) {
      setSelectedNotification(null); // Close the table if the same notification is clicked
    } else {
      setSelectedNotification(id); // Open the table for the clicked notification
      await fetchLevelpending(id); // Fetch the levelpending data
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
      console.log('UnDetails:', UnDetails); // Log data to check structure
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
  const tableRef = useRef<HTMLDivElement>(null);
  const myRef = useRef(null);


  const handlePrint = useReactToPrint({
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
      const dataForExport = notifications.length > 0 ? notifications.map((row) => ({
        // Id: row.,
        Name: row.name,
        matching_score: row.matching_score,
        CreatedAt: row.created_at,


      })) : [{ Message: "Your search has not returned any results." }];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataForExport);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Lookup Results");
      XLSX.writeFile(workbook, "lookup_results.xlsx");
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
    }
  };



  const [loading, setLoading] = useState(false);


  const handleTableRowClick = async (id: number, fileType: number, index: number, searchId: string, recId: string) => {

    console.log('Clicked row id:', id); // Check if id is correctly logged
    // const key = `${searchId}-${recId}-${index}`;
    // if (disabledIcons[key]) {
    //   return; // Exit the function if the span is disabled
    // }
    // alert(`ids: ${id}, fileType: ${fileType}`);
    if (fileType === 1) {
      setShowModal(true);
      console.log("Clicked icon at row:", index);
      console.log("Search ID:", searchId);
      console.log("Record ID:", recId);

      const currentIndex = `${searchId}-${recId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);
      // setIsRemarksDialogOpen(true);

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
      console.log("Clicked icon at row:", index);
      console.log("Search ID:", searchId);
      console.log("Record ID:", recId);

      const currentIndex = `${searchId}-${recId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);



      try {
        setLoading(true);

        // Fetch detailed information based on selected ID
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
      console.log("Clicked icon at row:", index);
      console.log("Search ID:", searchId);
      console.log("Record ID:", recId);

      const currentIndex = `${searchId}-${recId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);

      try {
        setLoading(true);
        // Fetch detailed information based on selected ID
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
      console.log("Clicked icon at row:", index);
      console.log("Search ID:", searchId);
      console.log("Record ID:", recId);

      const currentIndex = `${searchId}-${recId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);


      try {
        setLoading(true);
        // Fetch detailed information based on selected ID
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
    // setDisabledIcons((prev) => ({
    //   ...prev,
    //   [key]: true,
    // }));
  }



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
  const fetchStatus = async () => {
    try {
      const statuses: Status[] = await authApiService.getStatus(); // Specify the type as Status[]

      // Filter the statuses to keep only "close" and "Escalation" (matching the actual case)
      const filteredStatuses = statuses.filter((status: Status) => {
        return status.name === "close" || status.name === "Escalation";
      });

      console.log(filteredStatuses); // Add this line to check the filtered statuses
      setStatusData(filteredStatuses); // Update the statusData state with the filtered results
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };
  const handleCloseRemarksDialog = () => {
    console.log('Closing remarks dialog.');

    setIsRemarksDialogOpen(false);
    setSelectedAction('');
    setRemarks('');
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedAction(event.target.value);
  };
  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };
  // const handleStatusChange = (event: SelectChangeEvent<string>) => {
  //   setSelectedStatus(event.target.value);
  // };
  // const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
  //   setRemarks(filteredValue);
  // };
  // const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRemarks(event.target.value);
  // };

  // const handleIconClick = (index: number, searchId: string, recId: string) => {
  //   console.log("Clicked icon at row:", index);
  //   console.log("Search ID:", searchId);
  //   console.log("Record ID:", recId);

  //   const currentIndex = page + index;
  //   const existingAction = selectedActions[currentIndex] || '';
  //   const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

  //   setSelectedStatus(existingAction);
  //   setRemarks(existingRemarks);
  //   setSelectedRow(currentIndex);
  //   setIsRemarksDialogOpen(true);
  // };
  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

  const handleIconClick = (index: Levelpending) => {
    // alert(`PendingAlert: ${JSON.stringify(alert)}, hitId: ${hitdataId}`);
    setSelectedRow(index);
    setOpenDialog(true);
    // handleoneRemark(hitdataId);

  };



  const getStatusName = (action: string) => {
    const status = statusData.find((status) => status.id === action);

    if (status) {
      // Define a mapping from status ID to CSS class
      const statusClassMap: { [key: string]: string } = {
        '1': 'green-text', // Assuming '1' corresponds to 'Closed'
        '2': 'red-text',   // Assuming '2' corresponds to 'Escalation'
        '3': 'yellow-text', // Assuming '3' corresponds to 'Request For Information'
      };

      const statusClass = statusClassMap[status.id];

      if (statusClass) {
        return (
          <span className={statusClass}>
            {status.name}
          </span>
        );
      } else {
        // If the status ID doesn't match any of the defined classes, return the status name as is
        return status.name;
      }
    } else {
      return ''; // Handle cases where the status is not found
    }
  };
  const handleRemarksSubmit = async () => {
    if (levelpending) {
      const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));
  
      if (!selectedStatus) {
        console.error("Selected status not found.");
        return;
      }
  
      const hitrecordlifecyclePayload = {
        search_id: Number(levelpending[0].searchId),
        hitdata_id: Number(levelpending[0].hitId),
        criminal_id: Number(levelpending[0].recId),
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
        const rowIndex = levelpending.findIndex(record => record.recId === levelpending[0].recId);

        if (rowIndex !== -1) {
          // Remove the row from the array
          const updatedLevelPending = [...levelpending];
          updatedLevelPending.splice(rowIndex, 1);
  
          // Update the state with the modified array
          setLevelpending(updatedLevelPending);
        }

        // If success, close dialog and show success snackbar
        setOpenDialog(false);
        setSnackbarMessage('Saved successfully!');
        setOpenSnackbar(true);
        setSelectedAction(''); // Reset selected action
        setRemarks('');
        setDisabledIcons({
          // Add your disabled icons state logic here
        });
      } catch (error) {
        // Improved error logging with better context
        console.error("Error submitting remarks:", error);
      } finally {
        // Close all modals after the operation (success or failure)
        handleCloseModal();
        handleCloseModallogical();
        handleCloseModalgroup();
        handleCloseModalun();
        
        // Reset loading state
        setLoading(false);
      }
    } else {
      console.error("Selected row is null, invalid, or out of bounds");
    }
  };
  
  
  const authApiService = new SearchApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();
  const [BulkTaskAssignView, setBulkTaskAssignView] = useState<BulkTask[]>([]);
  const [showBulkTaskAssignView, setShowBulkTaskAssignView] = useState(true);
  const fetchBulkTaskAssignView = async () => {
    try {
      const uid = loginDetails.id;
      const BulkTaskAssign = await viewservice.getBulkTaskAssignView(uid);
      console.log("BulkTaskAssign", BulkTaskAssign)
      setBulkTaskAssignView(BulkTaskAssign);
      setShowBulkTaskAssignView(true);
    } catch (error) {
      console.error("Error fetching the fetchBulkTaskAssignView:", error)
    }
  };


  const handlePendingAlertClick = async () => {
    try {
      const notifications = await authApiService.getNotification();
      setNotifications(notifications);
      setShowPendingCaseTable(true);
      setShowPendingRIFTable(false);
      // setPendingcase(results);
      // setSearchResults(results);
      setActiveButton('pendingCase');
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handlePendingRIFClick = async () => {
    try {
      const uid = loginDetails.id;
      const BulkTaskAssign = await viewservice.getBulkTaskAssignView(uid);
      console.log("BulkTaskAssign", BulkTaskAssign)
      setBulkTaskAssignView(BulkTaskAssign);
      setShowBulkTaskAssignView(true);

      setShowPendingRIFTable(true);
      setShowPendingCaseTable(false);
      // setPendingRif(results);
      // setSearchResultsRfi(results);
      setActiveButton('pendingRIF');
    } catch (error) {
      console.error("Error fetching the fetchBulkTaskAssignView:", error)
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAction('');
    setRemarks('');
  };
  const [activeButton, setActiveButton] = useState<null | 'pendingCase' | 'pendingRIF'>(null);
  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);
  return (
    <>


      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 ,m:4}} >

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

            <h6 className='allheading' >PENDING DATA </h6>


            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: activeButton === 'pendingCase' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                  color: 'white',
                  marginRight: '8px',
                  padding: '4px 8px',

                }}
                className='commonButton'
                onClick={handlePendingAlertClick}
              >
                FIRSTLEVEL DATA
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: activeButton === 'pendingRIF' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                  color: 'white',
                  padding: '4px 8px',

                }}
                className='commonButton'
                onClick={handlePendingRIFClick}
              >
                ASSIGNED DATA
              </Button>
            </Box>
          </Box>
          <Box m={2}>
            <div>
              <div className="table-responsive">
                {showPendingCaseTable && (
                  <>
                    {notifications && notifications.length > 0 ? (
                      <>
                        <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px' }}>
                          <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                            <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                              <TableRow className="tableHeading">
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px' }}><strong>S.No</strong></TableCell>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', }}><strong>Name</strong></TableCell>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px' }}><strong>Score</strong></TableCell>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px' }}><strong>Created At</strong></TableCell>
                                <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px' }}><strong>Created By</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                  <TableRow key={index} style={{ height: '32px' }}>
                                    <TableCell style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
                                    <TableCell>
                                      <span
                                        style={{
                                          cursor: 'pointer',
                                          color: '#3F51B5',
                                          textDecoration: 'underline',
                                          display: 'inline-block',
                                          maxWidth: '200px',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          padding: '4px'
                                        }}
                                        onClick={() => handleNotificationClick(notification.id)}
                                      >
                                        <span>{notification.name.charAt(0).toUpperCase() + notification.name.slice(1)}</span>
                                      </span>
                                    </TableCell>
                                    <TableCell style={{ padding: '4px', }}><span>{notification.matching_score}</span></TableCell>
                                    <TableCell style={{ padding: '4px', }}><span>{new Date(notification.created_at).toLocaleDateString()}</span></TableCell>
                                    <TableCell style={{ padding: '4px', }}><span>{notification.createdBy}</span></TableCell>
                                  </TableRow>
                                  {selectedNotification === notification.id && (
                                    <TableRow>
                                      <TableCell colSpan={5}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                          {error ? (
                                            <Typography variant="body2" color="error">{error}</Typography>
                                          ) : (
                                            levelpending.length > 0 ? (
                                              <Card style={{ padding: '1%', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px', width: '100%' }}>
                                                <TableContainer style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                  <Table size="small" aria-label="a dense table" style={{ minWidth: '600px' }}>
                                                    <TableHead>
                                                      <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold' }}>Hit Name</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold' }}>Score</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold',zIndex:'1' }}>Action</TableCell>
                                                      </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                      {levelpending.map((record, index) => {
                                                        const currentIndex = `${record.searchId}-${record.recId}-${index}`;
                                                        const selectedAction = selectedActions[currentIndex];
                                                        return (
                                                          <TableRow key={record.recId}>
                                                            <TableCell>
                                                              <button
                                                                style={{
                                                                  color: '#3F51B5',
                                                                  textDecoration: 'underline',
                                                                  border: 'none',
                                                                  backgroundColor: 'transparent',
                                                                  cursor: 'pointer',
                                                                  padding: '4px'
                                                                }}
                                                                onClick={() =>
                                                                  handleTableRowClick(
                                                                    record.recId,
                                                                    record.fileType,
                                                                    index,
                                                                    record.searchId.toString(),
                                                                    record.recId.toString()
                                                                  )
                                                                }
                                                                disabled={disabledIcons[`${record.searchId}-${record.recId}-${index}`]}
                                                              >
                                                                {record.hitName.charAt(0).toUpperCase() + record.hitName.slice(1)}
                                                              </button>
                                                            </TableCell>
                                                            <TableCell style={{ padding: '4px' }}>{Math.round(record.hitScore)}</TableCell>
                                                            <TableCell style={{ padding: '4px' }}>
                                                            <IconButton onClick={() => handleIconClick(record)} style={{ padding: '1px' }}>
                                                                <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                                              </IconButton>
                                                            </TableCell>
                                                          </TableRow>
                                                        );
                                                      })}
                                                    </TableBody>
                                                  </Table>
                                                </TableContainer>
                                              </Card>
                                            ) : (
                                              <Typography variant="body2">No Pending data available</Typography>
                                            )
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    ) : (
                      <Typography variant="body1">No FirstLevelPending available</Typography>
                    )}
                  </>


                )}

                {showPendingRIFTable && (
                  <>
                    {showBulkTaskAssignView && (
                      <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px' }}>
                        <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }} >
                          <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                            <TableRow className="tableHeading">
                              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px', }}><strong>S.No</strong></TableCell>
                              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px', }}><strong>Name</strong></TableCell>
                              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px', }}><strong>Score</strong></TableCell>
                              <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', padding: '4px', }}><strong>Created At</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {BulkTaskAssignView.map((task, index) => (
                              <TableRow key={task.uid}>
                                <TableCell style={{ padding: '4px', }}><span>{index + 1}</span></TableCell>
                                <TableCell style={{ padding: '4px', }}><span>{task.searchName}</span></TableCell>
                                <TableCell style={{ padding: '4px', }}><span>{task.matchingScore || 'N/A'}</span></TableCell>
                                <TableCell style={{ padding: '4px', }}><span>{new Date(task.created_at).toLocaleDateString()}</span></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </>


                )}
              </div>
            </div>
          </Box>


        </Box>
      </Box>

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

        <DialogContent >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {/* <h4>DETAILS:</h4> */}

                  <IconButton
                    color="primary"
                    onClick={handlePrint}
                    className="print-hide"
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>

                  <div className="card-body" >

                    <div ref={myRef}>
                      <h5>DETAILS:</h5>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>


                        <Grid container spacing={2} justifyContent="space-between">

                          <Grid item xs={3}>
                            {details.slice(0, Math.ceil(details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                          {/* Middle */}
                          <Grid item xs={3}>
                            {details.slice(Math.ceil(details.length / 3), Math.ceil(2 * details.length / 3)).map((details, index) => (
                              <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                            ))}
                          </Grid>
                          {/* Right side */}
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                            <h4>IDENTIFICATIONS:</h4>
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
                                      {/* <TableCell>Expire Date</TableCell> */}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {identification.map((identification, index) => (
                                      <TableRow key={identification.type + identification.country + identification.issue_Date} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                        <TableCell>{identification.type}</TableCell>
                                        <TableCell>{identification.ids}</TableCell>
                                        <TableCell>{identification.country}</TableCell>
                                        <TableCell>
                                          {identification.issue_Date !== '0000-00-00' ? identification.issue_Date : ''}
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
                            <h4>ALIASES:</h4>
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
                            <h4>Addresses:</h4>
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
                    </div>
                    <br></br>
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
                      <Button variant="contained" onClick={handleCloseModal}>Close</Button>
                      {selectedAction && (
                        <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                          Submit
                        </button>
                      )}
                    </DialogActions>
                  </div>

                </Card>
              </Box>
              {/* </Box>

              </Box> */}

            </>
          )}

        </DialogContent>

      </Dialog>

      <Dialog open={showModallogical} onClose={handleCloseModallogical} fullWidth
        maxWidth="lg">
        {/* <DialogTitle>Search Details</DialogTitle> */}
        <DialogContent >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}
              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <IconButton

                    color="primary"

                    onClick={handlePrint}
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body">

                    <div ref={myRef}>
                      <h5>DETAILS:</h5>
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
                            <h4>IDENTIFICATIONS:</h4>
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
                                        {/* <TableCell>{id.entity_logical_id_Iden}</TableCell> */}
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


                        </>
                      )}
                      {/* <br /> */}
                      {logicalAddress.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>Addresses:</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>

                                      {/* <TableCell>entity_logical_id_Address </TableCell> */}
                                      <TableCell>Address_number </TableCell>
                                      <TableCell>Address_street </TableCell>
                                      <TableCell>Address_zipcode </TableCell>
                                      <TableCell>Address_city </TableCell>
                                      <TableCell>Address_country</TableCell>
                                      <TableCell>Address_other </TableCell>

                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalAddress.map((addr, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>

                                        {/* <TableCell>{addr.entity_logical_id_Addr}</TableCell> */}
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

                        </>
                      )}
                      {/* <br /> */}
                      {logicalAka.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES:</h4>
                          </div>
                          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                  <TableHead>
                                    <TableRow>

                                      {/* <TableCell>entity_logical_id_Address </TableCell> */}
                                      <TableCell>Name </TableCell>


                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {logicalAka.map((addr, index) => (
                                      <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>

                                        {/* <TableCell>{addr.entity_logical_id_Addr}</TableCell> */}
                                        <TableCell>{addr.name}</TableCell>

                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Card>

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
                      <Button variant="contained" onClick={handleCloseModallogical}>Close</Button>
                      {selectedAction && (
                        <button type="button" className="btn btn-outline-primary" style={{ marginRight: '2%' }} onClick={handleRemarksSubmit}>
                          Submit
                        </button>
                      )}
                    </DialogActions>
                  </div>
                </Card>
              </Box>
              {/* </Box>

              </Box> */}
            </>
          )}

        </DialogContent>

      </Dialog>
      <Dialog open={showModalgroup} onClose={handleCloseModalgroup} fullWidth
        maxWidth="lg">
        {/* <DialogTitle>Search Details</DialogTitle> */}
        <DialogContent >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>

              {/* <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}

              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <IconButton

                    color="primary"

                    onClick={handlePrint}
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>
                  <div className="card-body">

                    <div ref={myRef}>
                      <Typography variant="h5">DETAILS:</Typography>
                      <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        {CityDetails.length > 0 && (
                          <>

                            <br />


                            {CityDetails.map((detail, index) => (
                              <Grid container spacing={2} justifyContent="space-between">
                                <React.Fragment key={index}>
                                  <Grid item xs={4}>
                                    <Typography><b>Name</b> : {detail.name}</Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography><b>Place Of Birth</b>: {detail.place_of_Birth}</Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography><b>DOB</b>: {detail.dob}</Typography>
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
                            <Typography variant="h5">IDENTIFICATIONS:</Typography>
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

                      {Groupaliases.length > 0 && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>ALIASES:</h4>
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
              </Box>
              {/* </Box>
              </Box> */}
            </>)}

        </DialogContent>

      </Dialog>
      <Dialog open={showModalun} onClose={handleCloseModalun} fullWidth
        maxWidth="lg">
        {/* <DialogTitle>Search Details</DialogTitle> */}
        <DialogContent >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>

              {/* <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}

              <Box m={2} >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                  <IconButton

                    color="primary"

                    onClick={handlePrint}
                    style={{ minWidth: 'unset', padding: '2px' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </div>
                <Card ref={cardRef} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', overflowY: 'auto', maxHeight: '500px' }}>

                  <div className="card-body">

                    <div ref={myRef}>

                      <Typography variant="h5">DETAILS:</Typography>
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
                                  <Typography><b>DOB</b>: {detail.dob}</Typography>
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
                            <h4>ALIASES:</h4>
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
                            <h4>ALIASES:</h4>
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
}

export default NotificationComponent;
