import React, { useEffect, useRef, useState } from 'react';
import PendingAlertApiService from '../../../data/services/san_search/PendingAlert/pendingalert-api-service';
import LevelStatusMappingApiService from '../../../data/services/san_search/levelstatusmapping/levelstatusmapping-api-service';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent, Box, FormControl, InputLabel, TextField, Grid, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Header from '../../../layouts/header/header';
import { Steps } from 'antd';
import { Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { Snackbar, Alert } from '@mui/material';
import LevelFlowSearch from './LevelFlowSearch';
import HitdatalifecycleApiService from '../../../data/services/san_search/hitdatalifecycle/hitdatalifecycle-api-service';
import levelApiService from '../../../data/services/san_search/level/level-api-service';
import { Country, List, Program, All, Address, IdentificationData, AliasesData, DetailsData, logicalIdentification, logicaAddress, LogicalDetails, Logicalcitiy, LogicalBirthDetails, LogicalAKADetails, GroupAliases, GroupIdentification, CityDetails, UnDetails, UnAliases, UnDesignationDetails } from '../../../data/services/san_search/viewpage/view_payload';
import ViewService from '../../../data/services/san_search/viewpage/view_api_service';
import { useParams } from 'react-router-dom';

interface PendingAlert {
  id: string;
  searchId: string;
  hitId: string;
  criminalId: string;
  criminalName: string;
  matchingScore: string;
  remark: string;
  statusId: string;
  case_id: string;
  dt: string;
  level_id: string;
  search_id: string;
  searchName: string;
  caseId: string;
  fileType: string;
};

interface LevelStatus {
  id: number;
  levelId: number;
  statusId: number;
  uid: number;
  status: string
  passingLevelId: number;
  isAlive: number;
};

interface Remark {
  remark: string
  createdAt: string,
  level: string,
  status: string,
};

interface Level {
  id: string;
  name: string;
};

interface BulkTask {
  uid: number;
  searchName: string;
  userName: String;
};

function LevelFlow() {

  const { Step } = Steps;
  const { id, ids } = useParams();
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<PendingAlert | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [activeButton, setActiveButton] = useState<null | 'pendingCase' | 'pendingRIF'>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [List, setList] = useState<List[]>([]);
  const [country, setCountry] = useState<Country[]>([]);
  const [RecordType, setRecordType] = useState<All[]>([]);
  const [address, setaddress] = useState<Address[]>([]);
  const [identification, setIdentification] = useState<IdentificationData[]>([]);
  const [aliases, setAliases] = useState<AliasesData[]>([]);
  const [details, setdetails] = useState<DetailsData[]>([]);
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
  const [BulkTaskAssignView, setBulkTaskAssignView] = useState<BulkTask[]>([]);
  const [showBulkTaskAssignView, setShowBulkTaskAssignView] = useState(true);
  const [Program, setProgram] = useState<Program[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const remarksRef = useRef<HTMLInputElement>(null);

  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const levelServices = new levelApiService();
  const viewservice = new ViewService();
  const authService = new PendingAlertApiService();
  const levelService = new LevelStatusMappingApiService();

  const handlePendingAlertClick = async (value?: any) => {
    try {
      setLoading(true);
      let statusId = 0;
      if (value == 'pendingRIF') {
        statusId = 3;
      }
      if (value == 'pendingCase') {
        statusId = 0;
      }
      const results = await authService.getPendingAlertDetails(loginDetails, statusId);
      setPendingAlert(results);
      setActiveButton(value);
      // setActiveButton('pendingRIF');
    } catch (error) {
      console.error("Error fetching pending alerts:", error);
    }
    finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    handlePendingAlertClick();
    fetchLevelStatus();
    fetchLevels();
    fetchCountry();
    fetchList();
    fetchProgram();
    fetchAll();
    fetchBulkTaskAssignView()
  }, [ids]);

  useEffect(() => {
    if (selectedAction && remarksRef.current) {
      remarksRef.current.focus();
    }
  }, [selectedAction]);

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

  const handleIconClick = (index: PendingAlert, hitdataId: string) => {
    setSelectedAlert(index);
    setOpenDialog(true);
    handleoneRemark(hitdataId);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAction('');
    setRemarks('');
  };

  const handleoneRemark = async (hitdataId: any) => {
    try {
      const response = await authService.getsanRemarkending(hitdataId);
      setLevelOneRemark(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemarkRfi:", error);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedAction(event.target.value);
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const handleRemarksSubmit = async () => {
    if (selectedAlert) {
      const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));
      if (!selectedStatus) {
        console.error("Selected status not found.");
        return;
      }
      const hitrecordlifecyclePayload = {
        search_id: Number(selectedAlert.searchId),
        hitdata_id: Number(selectedAlert.hitId),
        criminal_id: Number(selectedAlert.criminalId),
        statusId: selectedStatus.statusId,
        statusNowId: selectedStatus.statusId,
        remark: remarks,
        level_id: loginDetails.accessLevel,
        case_id: Number(selectedAlert.caseId),
        valid: 0,
        isAlive: selectedStatus.isAlive,
        passingLevelId: selectedStatus.passingLevelId,
        uid: loginDetails.id
      };
      try {
        setLoading(true);
        await hitdatalifecycleApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
        await handlePendingAlertClick();
        setSnackbarMessage('Saved successfully!');
        setOpenSnackbar(true);
        setSelectedAction('');
        setRemarks('');
      } catch (error) {
        console.error("Error saving data:", error);
        setSnackbarMessage('Failed to save.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
        handleCloseModal();
        handleCloseModallogical();
        handleCloseModalgroup();
        handleCloseModalun();
      }
      console.log("Selected action:", selectedAction);
      console.log("Remarks:", remarks);
      console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
    }
    setOpenDialog(false);
  };

  const fetchDataByFileType = async (id: string, fileType: number) => {
    setLoading(true);
    try {
      if (fileType === 1) {
        const [detailsData, identificationData, aliasesData, addressData] = await Promise.all([
          viewservice.getDetails(id),
          viewservice.getIdentification(id),
          viewservice.getAliases(id),
          viewservice.getAddresses(id)
        ]);
        setdetails(detailsData);
        setIdentification(identificationData);
        setAliases(aliasesData);
        setaddress(addressData);
      } else if (fileType === 2) {
        const [logicalidentification, logicalAddress, logicaldetails, logicalcitiy, logicalBirthDetails, logicalAka] = await Promise.all([
          viewservice.getLogicalIdentification(id),
          viewservice.getLogicalAddress(id),
          viewservice.getLogicaldetails(id),
          viewservice.getLogicalcity(id),
          viewservice.getLogicalBirthDetails(id),
          viewservice.getLogicalAka(id)
        ]);
        setLogicalIdentification(logicalidentification);
        setLogicalAddress(logicalAddress);
        setLogicaldetails(logicaldetails);
        setLogicalcitiy(logicalcitiy);
        setLogicalBirthDetails(logicalBirthDetails);
        setLogicalAka(logicalAka);
      } else if (fileType === 3) {
        const [Groupaliases, CityDetails, groupidentification] = await Promise.all([
          viewservice.getGroupAliases(id),
          viewservice.getGroupCityDetails(id),
          viewservice.getGroupIdentification(id)
        ]);
        setGroupaliases(Groupaliases);
        setCityDetails(CityDetails);
        setGroupIdentification(groupidentification);
      } else if (fileType === 4) {
        const [UnDetails, Unaliases, UnDesignationDetails] = await Promise.all([
          viewservice.getUnDetails(id),
          viewservice.getUnAliases(id),
          viewservice.getUnDesignationDetailss(id)
        ]);
        setUnDetails([UnDetails]);
        setUnaliases(Unaliases);
        setUnDesignationDetails(UnDesignationDetails);
      }
    } catch (error) {
      console.error(`Error fetching data for fileType ${fileType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableRowClick = async (criminalId: number, fileType: any, index: number, alert: PendingAlert) => {
    const id = String(criminalId);
    console.log(`Criminal ID: ${criminalId}, File Type: ${fileType}`);
    setSelectedAlert(alert)
    setSelectedAction('');
    setRemarks('');
    if (fileType === 1) {
      setShowModal(true);
    } else if (fileType === 2) {
      setShowModallogical(true);
    } else if (fileType === 3) {
      setShowModalgroup(true);
    } else if (fileType === 4) {
      setShowModalun(true);
    }
    await fetchDataByFileType(id, fileType);
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

  const getStatusNameById = (levelId: number) => {
    const level = levels.find((c) => Number(c.id) === levelId);
    return level ? level.name : 'Not Available';
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {(levelStatus[0]?.levelId === 2 || levelStatus[0]?.levelId === 3 || levelStatus[0]?.levelId === 4) && (
              <h6 className='allheading'>{getStatusNameById(levelStatus[0]?.levelId)}</h6>
            )}
            <div>
              {levelStatus[0]?.levelId === 3 && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: activeButton === 'pendingCase' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                      color: 'white',
                      marginRight: '8px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontFamily: 'Open Sans',
                    }}
                    onClick={() => handlePendingAlertClick('pendingCase')}
                  >
                    PENDING CASE
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: activeButton === 'pendingRIF' ? 'rgb(63, 81, 181)' : 'rgb(0, 123, 255)',
                      color: 'white',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontFamily: 'Open Sans',
                    }}
                    onClick={() => handlePendingAlertClick('pendingRIF')}
                  >
                    PENDING RIF
                  </Button>
                </>
              )}
            </div>
          </Box>
          {levelStatus[0]?.levelId === 1 && <LevelFlowSearch />}
          {levelStatus[0]?.levelId !== 1 && (
            <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                  <TableRow className="tableHeading">
                    <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }}>
                      S.No
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }}>
                      Search Name
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '100px' }}>
                      Hit Name
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '70px' }}>
                      Score
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '200px' }}>
                      Remark
                    </TableCell>
                    <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', width: '50px' }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1">Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : pendingAlert.length > 0 ? (
                    pendingAlert.map((alert, index) => (
                      <React.Fragment key={alert.id}>
                        <TableRow key={index} style={{ height: '32px' }}>
                          <TableCell style={{ padding: '4px', fontSize: '0.75rem' }}>{index + 1}</TableCell>
                          <TableCell style={{ padding: '4px' }}>
                            {alert.searchName.trim().length > 20
                              ? `${alert.searchName.trim().substring(0, 20)}...`
                              : alert.searchName.trim()}
                          </TableCell>
                          <TableCell style={{ padding: '4px' }}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleTableRowClick(Number(alert.criminalId), alert.fileType, index, alert);
                              }}
                              style={{
                                cursor: 'pointer',
                                color: '#1677FF',
                                textDecoration: 'underline',
                                fontSize: '12px',
                              }}
                            >
                              {alert.criminalName.charAt(0).toUpperCase() + alert.criminalName.slice(1)}
                            </a>
                          </TableCell>
                          <TableCell style={{ padding: '4px' }}>{alert.matchingScore}</TableCell>
                          <TableCell style={{ padding: '4px' }}>
                            {alert.remark || 'Not Available'}
                          </TableCell>
                          <TableCell style={{ padding: '4px' }}>
                            <IconButton onClick={() => handleIconClick(alert, alert.hitId)} style={{ padding: '1px' }}>
                              <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>
                        <Typography variant="h6" color="textSecondary">
                          Not Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Dialog className='MuiDialog-root'
            open={openDialog}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="md"
          >
            <DialogActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {selectedAlert && (
                <div>
                  <h6 className='allheading' style={{ color: '#333' }}>
                    {selectedAlert.criminalName || 'Name Not Available'}
                  </h6>
                  <span style={{ color: '#555' }}>
                    {`Matching Score: ${selectedAlert.matchingScore || 'Matching Score Not Available'}`}
                  </span>
                  <br />
                  <span style={{ color: '#555' }}>
                    {`Search Name: ${selectedAlert.searchName || 'Search Name  Not Available'}`}
                  </span>
                </div>
              )}
            </DialogActions>
            <hr />
            <DialogContent style={{ padding: '4px 20px' }}>
              <Box>
                <Steps direction="vertical" size="small" current={levelOneRemark.length - 1} style={{ width: '100%' }}>
                  {levelOneRemark.map((remark, index) => (
                    <Step
                      key={index}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <h6 className='allheading' style={{ margin: 0 }}>{` ${remark.level}  `}</h6>
                          <span>{remark.status}</span>
                        </div>
                      }
                      description={
                        <div style={{ lineHeight: '20px' }}>
                          <span> {remark.createdAt}</span>
                          <br />
                          <span>{remark.remark}</span>
                        </div>
                      }
                    />
                  ))}
                </Steps>
              </Box>
            </DialogContent>

            {/* <DialogActions > */}
            <div style={{ padding: '4px 20px' }}>
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
              {/* </DialogActions> */}
            </div>
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
        </Box>
      </Box >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LevelFlow;