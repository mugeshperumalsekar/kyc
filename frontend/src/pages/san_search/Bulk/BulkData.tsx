import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, IconButton } from '@mui/material';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import SearchApiService from '../../../data/services/san_search/search-api-service';
import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { Country, List, Program, All, Customer, Address, IdentificationData, AliasesData, DetailsData, RecordDTO, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../../data/services/san_search/viewpage/view_payload';
import ViewService from '../../../data/services/san_search/viewpage/view_api_service';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import { SelectChangeEvent } from '@mui/material/Select';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import { useReactToPrint } from 'react-to-print';
import LevelStatusMappingApiService from '../../../data/services/san_search/levelstatusmapping/levelstatusmapping-api-service';
import levelApiService from '../../../data/services/san_search/level/level-api-service';

interface Notification {
  id: number;
  name: string;
  created_at: string;
  matching_score: number;
  listId: number;
  typeId: number;
  stateId: number;
  countryId: number;
  identity: number;
  levelId: number;
  uid: number;
  kycId: number;
  entryType: number;
}

interface Levelpending {
  name: string;
  matching_score: number;
  hitName: string;
  hitScore: number;
  hitId: string;
  recId: number;
  searchId: string;
  lifcycleSearchId: string;
  fileType: number;
  search_id: string;
  criminalId: string;
}

interface Status {
  id: string;
  name: string;
}

interface DisabledIcons {
  [key: string]: boolean;
}

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

const BulkDataTable: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const { id } = useParams();
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

  const [RecordType, setRecordType] = useState<All[]>([]);
  const viewservice = new ViewService();
  const [selectedRecordType, setSelectedRecordType] = useState(0);
  const [Program, setProgram] = useState<Program[]>([]);
  const [List, setList] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState(0);
  const [country, setCountry] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(0);
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
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>([])
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const levelService = new LevelStatusMappingApiService();
  const levelServices = new levelApiService();

  useEffect(() => {
    fetchLevelStatus();
    fetchLevels()
    fetchNotifications();
    fetchCountry();
    fetchList();
    fetchProgram();
    fetchAll();
    fetchStatus();
  }, [id]);

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
      const notifications = await authApiService.getSearch();
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchLevelpending = async (id: any) => {
    try {
      const levelpending = await authApiService.getsanLevelpending(id);
      setLevelpending(levelpending);
    } catch (error) {
      console.error("Error fetching the details:", error);
      setError("Error fetching the details");
    }
  };

  const handleNotificationClick = async (id: number) => {
    if (selectedNotification === id) {
      setSelectedNotification(null);
    } else {
      setSelectedNotification(id);
      await fetchLevelpending(id);
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

  const myRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleTableRowClick = async (criminalId: number, fileType: number, index: number, searchId: string, recId: string) => {
    const id = String(criminalId);
    if (fileType === 1) {
      setShowModal(true);
      const currentIndex = `${searchId}-${recId}-${index}`;
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
      const currentIndex = `${searchId}-${recId}-${index}`;
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
      const currentIndex = `${searchId}-${recId}-${index}`;
      const existingAction = selectedActions[currentIndex] || '';
      const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
      setSelectedStatus(existingAction);
      setRemarks(existingRemarks);
      setSelectedRow(currentIndex);
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
      const currentIndex = `${searchId}-${recId}-${index}`;
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
    setSelectedAction('');
    setRemarks('');
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedAction(event.target.value);
  };
  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

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
    if (selectedRow) {
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
        setLoading(true);
        await hitdatalifecycleApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
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

  const authApiService = new SearchApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h6 className='allheading' style={{ textAlign: 'center' }}>BULK DATA</h6>
          </Box>
          {notifications && notifications.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table size="small" aria-label="dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 1000 }}><strong>S.No</strong></TableCell>
                      <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 1000 }}><strong>Name</strong></TableCell>
                      <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 1000 }}><strong>Matching Scor</strong>e</TableCell>
                      <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 1000 }}><strong>Created At</strong></TableCell>
                      <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 1000 }}><strong>Entry Type</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <TableRow sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#d3d3d34f' }}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                cursor: 'pointer', color: '#3F51B5',
                                textDecoration: 'underline',
                              }}
                              onClick={() => handleNotificationClick(notification.id)}
                            >
                              <span>{notification.name}</span>
                            </Typography>
                          </TableCell>
                          <TableCell><span>{notification.matching_score ?? 'Not Available'}</span></TableCell>
                          <TableCell>
                            <span>
                              {new Date(notification.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }).replace(/ /g, '/')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span>{notification.entryType === 0 ? 'Automated' : notification.entryType === 1 ? 'Manual' : 'Not Available'}</span>
                          </TableCell>
                        </TableRow>
                        {selectedNotification === notification.id && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '20%', position: 'relative' }}>
                                {error ? (
                                  <Typography variant="body2" color="error"><span>{error}</span></Typography>
                                ) : (
                                  levelpending.length > 0 ? (
                                    <Card sx={{ padding: '1%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.28)', width: '100%' }}>
                                      <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
                                        <Table size="small" aria-label="sticky table">
                                          <TableHead>
                                            <TableRow>
                                              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 999 }}><strong>Hit Name</strong></TableCell>
                                              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 999 }}><strong>Hit Score</strong></TableCell>
                                              <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', fontWeight: 'bold', zIndex: 999 }}><strong>Action</strong></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {levelpending.map((record, index) => {
                                              const currentIndex = `${record.searchId}-${record.recId}-${index}`;
                                              const selectedAction = selectedActions[currentIndex];
                                              return (
                                                <TableRow key={record.recId} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#d3d3d34f' }}>
                                                  <TableCell>
                                                    <Typography
                                                      sx={{
                                                        cursor: 'pointer', color: '#3F51B5',
                                                        textDecoration: 'underline',
                                                      }}
                                                      onClick={() => handleTableRowClick(record.recId, record.fileType, index, record.searchId.toString(), record.recId.toString())}
                                                    >
                                                      <span>{record.hitName}</span>
                                                    </Typography>
                                                  </TableCell>
                                                  <TableCell><span>{Math.round(record.hitScore)}</span></TableCell>
                                                  <TableCell>
                                                    <IconButton
                                                      sx={{ padding: '1px', zIndex: 998 }}
                                                      disabled={disabledIcons[currentIndex]}
                                                    >
                                                      {selectedAction ? (
                                                        <VisibilityOffIcon sx={{ color: 'red' }} />
                                                      ) : (
                                                        <VisibilityIcon sx={{ color: 'green' }} />
                                                      )}
                                                    </IconButton>
                                                    {selectedAction && <span>{getStatusName(selectedAction)}</span>}
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    </Card>
                                  ) : (
                                    <Typography variant="body2"><strong>No Pending data available</strong></Typography>
                                  )
                                )}
                              </Box>
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
            <Typography variant="body1"><strong>No notifications available</strong></Typography>
          )}
        </Box>
      </Box >
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
        <DialogTitle>Enter Remarks</DialogTitle>
        <DialogContentText style={{ textAlign: 'center' }}>
          Select a status and enter remarks for this employee.
        </DialogContentText>
        <DialogContent>
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
            <Button onClick={handleRemarksSubmit} color="primary">
              Submit
            </Button>
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
    </>
  );
};

export default BulkDataTable;