

import React, { useState, useEffect } from 'react';
import {
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle,
  DialogContent, Container, DialogActions, DialogContentText, TablePagination, IconButton,
  Typography,
  StepContent,
  CardContent,
} from '@mui/material'

import { Card } from 'react-bootstrap';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; import { SelectChangeEvent } from '@mui/material';

import CountryApiService from '../../../data/services/master/Country/country_api_service';
import Header from '../../../layouts/header/header';
import statusApiService from '../../../data/services/master/status/status-api-service';
import StateApiService from '../../../data/services/master/State/state_api_service';
import { useSelector } from 'react-redux';
import SearchApiService from '../../../data/services/cms_search/search-api-service';
import PendingcasesApiService from '../../../data/services/cms_search/pendingcases/pending-api-service';
import HitcaseApiService from '../../../data/services/cms_search/hitcase/hitcase-api-service';
import RIFApiService from '../../../data/services/cms_search/rif/rif-api-service';
import Entityview from '../../CmsView/Entityview';
import Individualview from '../../CmsView/Individualview';
import Shipview from '../../CmsView/Shipview';
import Aircraftview from '../../CmsView/Aircraftview';
import { Stepper, Step, StepLabel } from '@mui/material'
interface Pendingcase {
  id: string;
  searchId: string;
  criminalId: string;
  hitId: string;
  searchName: string;
  criminalName: string;
  matchingScore: string;
  remark: string;
  levelId: string;
  statusId: string;
  caseId: string;
  cmsId: string;
  recordTypeId: string;
}

interface RIF {
  id: string;
  caseId: string;
  criminalId: string;
  hitId: string;
  levelId: string;
  searchId: string;
  statusId: string;
  matchScore: string;
  country: string;
  state: string;
  dob: string;
  remark: string;
  uid: string;
  criminalName: string;
  searchName: string;
  cmsId: string;
  recordTypeId: string;
}
interface PendingAlert {
  id: string;
  searchId: string;
  hitId: string;
  criminalId: string;
  criminalName: string;
  searchName: string;
  matchingScore: string;
  remark: string;
  statusId: string;
  case_id: string;
  dt: string;
  level_id: string;
  search_id: string;
  cmsId: string;
  recordTypeId: string;
  // Add other properties as needed
}
interface Remark {
  id: number;
  criminalId: string;
  hitId: string;
  levelId: string;
  remark: string;
  searchId: string;
  statusId: string;
  name: string;
  matchingScore: string;

};
interface LevelTwo {
  remark: string;
};
interface DisabledIcons {
  [key: string]: boolean;
}
const Level2casedetails = () => {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serialNumber, setSerialNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State 
  const countryService = new CountryApiService(); // Create an instance of CountryApiService
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [isRemarksDialogOpenRif, setIsRemarksDialogOpenRif] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [remarks, setRemarks] = useState('');
  const authApiService = new SearchApiService();
  const status = new statusApiService();
  const stateApiService = new StateApiService();
  const [statusData, setStatusData] = useState<any[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [pendingcase, setPendingcase] = useState<Pendingcase[]>([]);
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [pendingRif, setPendingRif] = useState<RIF[]>([]);

  const authService = new PendingcasesApiService();
  const [selectedRow, setSelectedRow] = useState<string | null>(null); // Initialize with null
  const [rowStatuses, setRowStatuses] = useState<{ [key: number]: { status: string; remarks: string } }>({});
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});

  const [selectedActionTag, setSelectedActionTag] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showPendingAlertTable, setShowPendingAlertTable] = useState(false);
  const [showRIFTable, setShowRIFTable] = useState(false);
  const hitcaseApiService = new HitcaseApiService();
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const rifService = new RIFApiService();

  const [showPendingCaseTable, setShowPendingCaseTable] = useState(false);
  const [showPendingRIFTable, setShowPendingRIFTable] = useState(false);

  const [selectedCourierTracker, setSelectedCourierTracker] = useState<Pendingcase | null>(null); // State to store the selected courier tracker
  const [loading, setLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null); // Changed type to 'string | null'
  const [selectedCourierTrackers, setSelectedCourierTrackers] = useState<RIF | null>(null); // State to store the selected courier tracker
  const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
  const [levelOneRemarkRfi, setLevelOneRemarkRfi] = useState<Remark[]>([]);
  const [levelTwoRemarkRfi, setLevelTwoRemarkRfi] = useState<Remark[]>([]);
  const [levelTwo, setLevelTwo] = useState<LevelTwo[]>([]);
  const [levelThree, setLevelThree] = useState<LevelTwo[]>([]);
  const [levelfourRemarkRfi, setLevelfourRemarkRfi] = useState<LevelTwo[]>([]);

  useEffect(() => {
    fetchStatus();
    handlePendingAlertClick();

  }, [page, rowsPerPage]);



  const handlePendingAlertClick = async () => {
    try {
      setLoading(true);
      setActiveButton('case');
      // Call the API to get pending cases
      let results = await authService.getPendingcases();
      console.log('results:', results);
      setShowPendingCaseTable(true);
      setShowPendingRIFTable(false);
      setPendingcase(results);
      setSearchResults(results);
      setLoading(false);
    } catch (error) {
      // Handle the error as needed
    }
  };
  // const handlePendingRIFClick = async () => {
  //   try {
  //     setLoading(true);
  //     setActiveButton('rif');
  //     let results = await rifService.getRIF();
  //     console.log('rif:', results);
  //     setPendingRif(results);
  //     setSearchResults(results);
  //     setLoading(false);
  //     setShowPendingRIFTable(true);
  //     setShowPendingCaseTable(false);


  //   } catch (error) {

  //   }
  // };
  const handlePendingRIFClick = async () => {
    try {
      setLoading(true);
      setActiveButton('rif');
      let results = await rifService.getRIF();
      setPendingRif(results);
      setSearchResults(results);
      setLoading(false);
      setShowPendingRIFTable(true);
      setShowPendingCaseTable(false);


    } catch (error) {

    }
  };
  const fetchStatus = async () => {
    try {
      const filteredStatuses = await authApiService.getStatus(); // Call getType from TypeApiService
      setStatusData(filteredStatuses)

    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };
  const startIndex = page * rowsPerPage;


  const handleCloseRemarksDialog = () => {
    setIsRemarksDialogOpen(false);
    setSelectedStatus('');
    setRemarks('');
  };
  const handleCloseRemarksDialogRif = () => {
    setIsRemarksDialogOpen(false);
    setSelectedStatus('');
    setRemarks('');
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };
  const handleStatusChangeRif = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };
  
  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
    setRemarks(filteredValue);
  };
  const handleRemarksChangeRif = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };
  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

  const handleIconClick = (index: number, searchId: string, cmsId: string, criminalId: string, hitId: string) => {
    console.log("Clicked icon at row:", index);
    console.log("Search ID:", searchId);
    console.log("ids:", criminalId);

    const currentIndex = `${searchId}-${cmsId}-${criminalId}-${hitId}-${index}`;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    const selectedSearchResult = pendingcase[index];
    const selectedSearchResults = pendingRif[index]
    setSelectedCourierTracker(selectedSearchResult);
    setSelectedCourierTrackers(selectedSearchResults);
    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRow(currentIndex);
    setIsRemarksDialogOpen(true);
    handleLevelOneRemark(criminalId, hitId);
    handleLevelTwoRemarkRfi(criminalId, hitId);
    handleLevelThreeRemarkRfi(criminalId, hitId);
    handleLevelthreeStatusTwo(criminalId, hitId);
    handleLevelOneStatusTwo(criminalId, hitId);
    handleLevelfourRemarkRfi(criminalId, hitId);
  };
  const getStatusName = (action: string) => {
    const status = statusData.find((status) => status.id === action);

    if (status) {
      // Define a mapping from status ID to CSS class
      const statusClassMap: { [key: string]: string } = {
        '1': 'green-text', 
        '2': 'red-text',   //  'Escalation'
        '3': 'yellow-text', //  'Request For Information'
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
    try {
      if (selectedRow !== null && searchResults.some(alert => `${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${searchResults.indexOf(alert)}` === selectedRow)) {
        const updatedRemarksAndActions = { ...remarksAndActions };
        updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };

        setRemarksAndActions(updatedRemarksAndActions);




        const selectedSearchResult = searchResults.find(alert => `${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${searchResults.indexOf(alert)}` === selectedRow);

        if (selectedSearchResult) {
          // alert(selectedSearchResult.searchId + '' + selectedSearchResult.criminalId + '' + selectedSearchResult.hitId);
          const PindingcasesPayload = {
            searchId: selectedSearchResult.searchId,
            criminalId: selectedSearchResult.criminalId,
            statusId: selectedStatus,
            remark: remarks,
            hitId: selectedSearchResult.hitId,
            levelId: '3',
            caseId: selectedSearchResult.caseId,
            uid: loginDetails.id,
            criminalName: '',
            matchingScore: '0' // You can set an appropriate value for matchingScore
          };
          // Assuming CreateCaseLifeCycleImplInsert is accessible from this scope

          await authService.CreateCaseLifeCycleImplInsert(PindingcasesPayload);
          // Handle the response if needed
        }
        setSelectedActions({
          ...selectedActions,
          [selectedRow]: selectedStatus,
        });

        setDisabledIcons({
          ...disabledIcons,
          [selectedRow]: true,
        });

      }

      setIsRemarksDialogOpen(false);
    } catch (error) {
      console.error("Error submitting remarks:", error);
    }
  };

  const handleLevelOneRemark = async (criminalId: any, hitId: any) => {
    try {
      const response = await authService.getPendingOneRemarkDetails(criminalId, hitId, 1, 1);
      console.log("Request:", response);
      setLevelOneRemark(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemark:", error);
    }
  };

  const handleLevelTwoRemarkRfi = async (criminalId: any, hitId: any) => {
    try {
      const response = await authService.getPendingTwoRemarkDetails(criminalId, hitId, 2, 2);
      setLevelTwoRemarkRfi(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemarkRfi:", error);
    }
  };

  const handleLevelOneStatusTwo = async (criminalId: any, hitId: any) => {
    try {
      const response = await authService.getPendingOneStatusTwoRemarkDetails(criminalId, hitId, 1, 2);
      setLevelTwo(response);
    } catch (error) {
      console.log("Error feching the handleLevelOneStatusTwo:", error);
    }
  };

  const handleLevelthreeStatusTwo = async (criminalId: any, hitId: any) => {
    try {
      const response = await authService.getPendingthreeStatusTwoRemarkDetails(criminalId, hitId, 3, 2);
      setLevelThree(response);
    } catch (error) {
      console.log("Error fetching the handleLevelthreeStatusTwo:", error);
    }
  };

  const handleLevelThreeRemarkRfi = async (criminalId: any, hitId: any) => {
    try {
      const response = await authService.getPendingOneRemarkDetails(criminalId, hitId, 3, 3);
      setLevelOneRemarkRfi(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemarkRfi:", error);
    }
  };
  const handleLevelfourRemarkRfi = async (criminalId: any, hitId: any) => {
    try {
      const response = await authService.getPendingOneRemarkDetails(criminalId, hitId, 4, 3);
      setLevelfourRemarkRfi(response);
    } catch (error) {
      console.log("Error fetching the handleLevelOneRemarkRfi:", error);
    }
  };



  const [showModal, setShowModal] = useState(false);
  const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);


  const handleTableRowClick = (
    cmsId: any,

    recordTypeId: any,
    index: number,
    searchId: string
  ) => {
    const id = String(cmsId);
    const uid = loginDetails.id;
    setShowModal(true);
    const currentIndex = `${searchId}-${cmsId}-${index}`;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';

    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRow(currentIndex);
    // alert('uid: ' + uid + ', recordTypeId: ' + recordTypeId + ', cmsId: ' + cmsId);


    switch (recordTypeId) {
      case 1:
        setDialogComponent(<Entityview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
        break;
      case 2:
        setDialogComponent(<Individualview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
        break;
      case 3:
        setDialogComponent(<Shipview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
        break;
      case 4:
        setDialogComponent(<Aircraftview cmsId={cmsId} uid={uid} recordTypeId={recordTypeId} />);
        break;
      default:
        setDialogComponent(null);
    }
  };



  const handleCloseModal = () => {
    setShowModal(false);
  };

  const stepsCase = [
    {
      label: 'L1 First Review',
      content: levelOneRemark && levelOneRemark.length > 0 ? (
        <>
          <Typography>
            {levelOneRemark[0]?.remark || "Remark Not Available"}
          </Typography>
        </>
      ) : (
        "No L1 Remark Data Available"
      ),
    },
    {
      label: 'L1 Second Review',
      content:
        levelTwoRemarkRfi.length > 0 && levelTwoRemarkRfi[0]?.remark
          ? levelTwoRemarkRfi[0].remark
          : levelTwo.length > 0 && levelTwo[0]?.remark
            ? levelTwo[0].remark
            : "Not Available",
    },
  ];

  const stepsRIF = [
    {
      label: 'L1 First Review',
      content: levelOneRemark && levelOneRemark.length > 0 ? (
        <Typography>
          {levelOneRemark[0]?.remark || "Remark Not Available"}
        </Typography>
      ) : (
        "No L1 Remark Data Available"
      ),
    },
    {
      label: 'L1 Second Review',
      content:
        levelTwoRemarkRfi.length > 0 && levelTwoRemarkRfi[0]?.remark
          ? levelTwoRemarkRfi[0].remark
          : levelTwo.length > 0 && levelTwo[0]?.remark
            ? levelTwo[0].remark
            : "Not Available",
    },
    {
      label: 'L2 Search Review',
      content:
        levelOneRemarkRfi && levelOneRemarkRfi.length > 0
          ? levelOneRemarkRfi[0]?.remark || "Not Available"
          : "Not Available",
    },
  ];


  return (
    
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }} >
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px', fontFamily: "Bookman Old Style", fontSize: "14px"
                // marginTop: { xs: '64px', sm: '80px', md: '70px' },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Bookman Old Style", fontSize: "14px",
                  color: '#343a40',

                  lineHeight: '2.5',
                }}
              >
                LEVEL 2 SEARCH
              </Typography>

              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: activeButton === 'case' ? '#3f51b5' : '#007BFF',
                    color: 'white',
                    marginRight: '8px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  }}
                  onClick={handlePendingAlertClick}
                >
                  Pending Case
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: activeButton === 'rif' ? '#3f51b5' : '#007BFF',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  }}
                  onClick={handlePendingRIFClick}
                >
                  Pending RFI
                </Button>
              </Box>
            </Box>
            <Box m={2}>
              <div  >
                <div className="table-responsive">
                  {showPendingCaseTable && (
                    <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                      <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                        <TableHead sx={{ backgroundColor: '#cccdd1', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                          <TableRow className="tableHeading">
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>S.No</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Search Name</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Hit Name</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Score</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Remark</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', fontFamily: "Bookman Old Style", fontSize: "14px" }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Action</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                <Typography style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }} variant="body1">Loading...</Typography>
                              </TableCell>
                            </TableRow>
                          ) : pendingcase.length > 0 ? (
                            pendingcase.map((alert, index) => {
                              const currentIndex = `${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`;
                              const selectedAction = selectedActions[currentIndex] || '';

                              return (
                                <React.Fragment key={alert.id}>
                                  <TableRow key={alert.cmsId} style={{ height: '32px' }}>
                                    <TableCell style={{ padding: '4px', fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                      {alert.searchName.trim().length > 20
                                        ? `${alert.searchName.trim().substring(0, 20)}...`
                                        : alert.searchName.trim()}
                                    </TableCell>
                                   
                                    <TableCell
                                      onClick={
                                       disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`]
                                          ? () => { } // Prevent click when disabled
                                          : () => handleTableRowClick(alert.cmsId, alert.recordTypeId, index, alert.searchId)
                                      }
                                      style={{
                                        cursor: disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`] ? 'not-allowed' : 'pointer',
                                        color: disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`] ? 'gray' : '#3F51B5',
                                        textDecoration: 'underline',
                                        padding: '4px',
                                        fontFamily: 'Bookman Old Style',
                                        fontSize: '12px',
                                      }}
                                    >
                                      {alert.criminalName.trim().length > 30
                                        ? `${alert.criminalName.trim().substring(0, 30)}...`
                                        : alert.criminalName.trim()}
                                    </TableCell>

                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>{alert.matchingScore}</TableCell>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                      {alert.remark || 'Not Available'}
                                    </TableCell>

                                    <TableCell style={{ padding: '4px' }}>
                                      <IconButton
                                        onClick={() =>
                                          handleIconClick(index, alert.searchId, alert.id, alert.criminalId, alert.hitId)
                                        }
                                        // disabled={disabledIcons[currentIndex]}
                                        disabled={disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`]}

                                        style={{ padding: '1px' }}
                                      >
                                        {selectedAction ? (
                                          <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                        ) : (
                                          <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                        )}
                                      </IconButton>
                                      {selectedAction && (
                                        <span>{getStatusName(selectedAction)}</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>
                                <Typography variant="h6" color="textSecondary" style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                  Not Available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>

                      </Table>
                    </TableContainer>
                  )}

                  {showPendingRIFTable && (
                    <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                      <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                          <TableRow className="tableHeading">
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>S.No</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px' }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Search Name</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px' }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Hit Name</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px' }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Score</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px' }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Remark</strong>
                            </TableCell>
                            <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px' }}>
                              <strong style={{ fontFamily: "Bookman Old Style", fontSize: "12px" }}>Action</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={5} align="center">
                                <Typography variant="body1">Loading...</Typography>
                              </TableCell>
                            </TableRow>
                          ) : pendingRif.length > 0 ? (
                            pendingRif.map((alert, index) => {
                              const currentIndex = `${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`;
                              const selectedAction = selectedActions[currentIndex] || '';


                              return (
                                <React.Fragment key={alert.id}>
                                  <TableRow key={alert.cmsId} style={{ height: '32px' }}>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>{index + 1}</TableCell>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                      {alert.searchName.trim().length > 20
                                        ? `${alert.searchName.trim().substring(0, 20)}...`
                                        : alert.searchName.trim()}
                                    </TableCell>
                                    {/* <TableCell
                                    onClick={() =>
                                      handleTableRowClick(alert.cmsId, alert.recordTypeId, index, alert.searchId)
                                    }
                                    style={{
                                      cursor: disabledIcons[currentIndex] ? 'not-allowed' : 'pointer',
                                      color: disabledIcons[currentIndex] ? 'gray' : '#3F51B5',
                                      textDecoration: 'underline',
                                      padding: '4px',
                                     fontFamily: "Bookman Old Style", fontSize: "12px"
                                    }}
                                  >
                                    {alert.criminalName.trim().length > 30
                                      ? `${alert.criminalName.trim().substring(0, 30)}...`
                                      : alert.criminalName.trim()}
                                  </TableCell> */}
                                   <TableCell
                                      onClick={
                                       disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`]
                                          ? () => { } // Prevent click when disabled
                                          : () => handleTableRowClick(alert.cmsId, alert.recordTypeId, index, alert.searchId)
                                      }
                                      style={{
                                        cursor: disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`] ? 'not-allowed' : 'pointer',
                                        color: disabledIcons[`${alert.searchId}-${alert.id}-${alert.criminalId}-${alert.hitId}-${index}`] ? 'gray' : '#3F51B5',
                                        textDecoration: 'underline',
                                        padding: '4px',
                                        fontFamily: 'Bookman Old Style',
                                        fontSize: '12px',
                                      }}
                                    >
                                      {alert.criminalName.trim().length > 30
                                        ? `${alert.criminalName.trim().substring(0, 30)}...`
                                        : alert.criminalName.trim()}
                                    </TableCell>

                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>{alert.matchScore}</TableCell>
                                    <TableCell style={{ padding: '4px', fontFamily: "Bookman Old Style", fontSize: "12px" }}>
                                      {alert.remark || 'Not Available'}
                                    </TableCell>

                                    <TableCell style={{ padding: '4px' }}>
                                      <IconButton
                                        onClick={() =>
                                          handleIconClick(index, alert.searchId, alert.id, alert.criminalId, alert.hitId)
                                        }
                                        disabled={disabledIcons[currentIndex]}
                                        style={{ padding: '1px' }}
                                      >
                                        {selectedAction ? (
                                          <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                        ) : (
                                          <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                        )}
                                      </IconButton>
                                      {selectedAction && (
                                        <span>{getStatusName(selectedAction)}</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>
                                <Typography variant="h6" color="textSecondary" style={{ fontSize: '0.75rem' }}>
                                  Not Available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>

                      </Table>
                    </TableContainer>
                  )}
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog style={{ padding: '0px 16px' }}
        open={isRemarksDialogOpen}
        onClose={handleCloseRemarksDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogActions style={{ padding: '1px', }}>
          <IconButton
            onClick={handleCloseRemarksDialog}
            color="primary"
            sx={{ fontSize: 20 }}
          >
            <ClearIcon sx={{ fontSize: 'inherit' }} />
          </IconButton>
        </DialogActions>
        {showPendingCaseTable && levelOneRemark && levelOneRemark.length > 0 && (
          <div style={{
            textAlign: 'center', fontFamily: "Bookman Old Style",
            fontSize: "16px",
          }}>
            <Typography variant="h6" style={{
              textAlign: 'center', fontFamily: "Bookman Old Style",
              fontSize: "16px",
            }}>
              {levelOneRemark[0]?.name || "Name Not Available"}
            </Typography>
            <Typography variant="body1" style={{
              textAlign: 'center', fontFamily: "Bookman Old Style",
              fontSize: "14px",
            }}>
              {`Matching Score: ${levelOneRemark[0]?.matchingScore || "Matching Score Not Available"}`}
            </Typography>
          </div>
        )}

        {showPendingCaseTable && selectedCourierTracker && (
          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '80%', margin: '0 auto', }}>


            {/* Vertical Stepper */}
            <Stepper activeStep={1} orientation="vertical"  style={{
              fontFamily: "Bookman Old Style",
              fontSize: "12px",
            }}>
              {stepsCase.map((step, index) => (
                <Step style={{
                  fontFamily: "Bookman Old Style",
                  fontSize: "12px",
                }} key={index} active>
                  <StepLabel style={{
                    fontFamily: "Bookman Old Style",
                    fontSize: "12px",
                  }}>{step.label}</StepLabel>
                  <StepContent>
                    <Typography style={{
                      fontFamily: "Bookman Old Style",
                      fontSize: "12px",
                    }}>{step.content}</Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

          </Card>
        )}

        {showPendingRIFTable && levelOneRemark && levelOneRemark.length > 0 && (
          <div style={{
            textAlign: 'center', fontFamily: "Bookman Old Style",
            fontSize: "16px",
          }}>
            <Typography variant="h6" style={{
              textAlign: 'center', fontFamily: "Bookman Old Style",
              fontSize: "16px",
            }}>
              {levelOneRemark[0]?.name || "Name Not Available"}
            </Typography>
            <Typography variant="body1" style={{
              textAlign: 'center', fontFamily: "Bookman Old Style",
              fontSize: "14px",
            }}>
              {`Matching Score: ${levelOneRemark[0]?.matchingScore || "Matching Score Not Available"}`}
            </Typography>
          </div>
        )}

        {/* Vertical Stepper for RIF steps */}
        {showPendingRIFTable && selectedCourierTrackers && (
          <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '80%', margin: '0 auto', }}>


            <Stepper  activeStep={2} orientation="vertical" style={{
              fontFamily: "Bookman Old Style",
              fontSize: "14px", minHeight: '3px'
            }}>
              {stepsRIF.map((step, index) => (
                <Step style={{
                  fontFamily: "Bookman Old Style", fontSize: "12px", minHeight: '3px'
                }}
                  key={index} active>
                  <StepLabel style={{
                    fontFamily: "Bookman Old Style",
                    fontSize: "12px", minHeight: '3px'
                  }}>
                    {step.label}</StepLabel>

                  <StepContent style={{ minHeight: '3px' }}>
                    <Typography style={{
                      fontFamily: "Bookman Old Style",
                      fontSize: "12px", lineHeight: '1.2',
                    }}>{step.content}</Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Card>
        )}
        {/* {showPendingCaseTable && selectedCourierTracker && (
          <>
            <Timeline position="left">

              {levelOneRemark && levelOneRemark.length > 0 ? (
                <>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{levelOneRemark[0]?.name || "Name Not Available"}</div>
                    <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
                      {`Matching Score: ${levelOneRemark[0]?.matchingScore || "Matching Score Not Available"}`}
                    </div>
                  </div>


                  <TimelineItem>
                    <TimelineContent>{levelOneRemark[0]?.remark || "Remark Not Available"}</TimelineContent>
                    <TimelineSeparator>
                      <TimelineDot style={{ backgroundColor: 'green' }} />
                      <TimelineConnector style={{ background: 'blue' }} />
                    </TimelineSeparator>
                    <TimelineContent style={{ fontWeight: 'bold' }}>L1 First Review</TimelineContent>
                  </TimelineItem>
                </>
              ) : (
                <TimelineItem>
                  <TimelineContent>No L1 Remark Data Available</TimelineContent>
                </TimelineItem>
              )}

              <TimelineItem>
                <TimelineContent>
                  {levelTwoRemarkRfi.length > 0 && levelTwoRemarkRfi[0]?.remark
                    ? levelTwoRemarkRfi[0].remark
                    : levelTwo.length > 0 && levelTwo[0]?.remark
                      ? levelTwo[0].remark
                      : "Not Available"}
                </TimelineContent>
                <TimelineSeparator>
                  <TimelineDot style={{ backgroundColor: 'green' }} />


                </TimelineSeparator>
                <TimelineContent style={{ fontWeight: 'bold' }}>L1 Second Review</TimelineContent>
              </TimelineItem>


            </Timeline>
          </>
        )}
        {showPendingRIFTable && selectedCourierTrackers && (
          <>
            <Timeline position="left">
            s
              {levelOneRemark && levelOneRemark.length > 0 ? (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{levelOneRemark[0]?.name || "Name Not Available"}</div>
                    <div style={{ fontSize: '18px', color: '#555', marginBottom: '20px' }}>
                      {`Matching Score: ${levelOneRemark[0]?.matchingScore || "Matching Score Not Available"}`}
                    </div>
                  </div>
                  <TimelineItem>
                    <TimelineContent>{levelOneRemark[0]?.remark || "Remark Not Available"}</TimelineContent>
                    <TimelineSeparator>
                      <TimelineDot style={{ backgroundColor: 'green' }} />
                      <TimelineConnector style={{ background: 'blue' }} />
                    </TimelineSeparator>
                    <TimelineContent style={{ fontWeight: 'bold' }}>L1 First Review</TimelineContent>
                  </TimelineItem>
                </>
              ) : (
                <TimelineItem>
                  <TimelineContent>No L1 Remark Data Available</TimelineContent>
                </TimelineItem>
              )}

              <TimelineItem>
                <TimelineContent>
                  {levelTwoRemarkRfi.length > 0 && levelTwoRemarkRfi[0]?.remark
                    ? levelTwoRemarkRfi[0].remark
                    : levelTwo.length > 0 && levelTwo[0]?.remark
                      ? levelTwo[0].remark
                      : "Not Available"}
                </TimelineContent>
                <TimelineSeparator>
                  <TimelineDot style={{ backgroundColor: 'green' }} />
                  <TimelineConnector style={{ background: 'blue' }} />
                  <TimelineConnector style={{ background: '#1976d2' }} />
                </TimelineSeparator>
                <TimelineContent style={{ fontWeight: 'bold' }}>L1 Second Review</TimelineContent>
              </TimelineItem>


              <TimelineItem>
                <TimelineContent>{levelOneRemarkRfi && levelOneRemarkRfi.length > 0 ? levelOneRemarkRfi[0]?.remark || "Not Available" : "Not Available"}</TimelineContent>
                <TimelineSeparator>
                  <TimelineDot style={{ backgroundColor: 'green' }} />
                </TimelineSeparator>
                <TimelineContent style={{ fontWeight: 'bold' }}>L2 Search Review</TimelineContent>
              </TimelineItem>


            </Timeline>
          </>
        )} */}
        <br></br>
        <DialogTitle style={{
          padding: '0px 24px', textAlign: 'center', fontFamily: "Bookman Old Style",
          fontSize: "16px",
        }}>Enter Remarks</DialogTitle>
        <DialogContentText style={{
          textAlign: 'center', fontFamily: "Bookman Old Style",
          fontSize: "14px",
        }}>
          Select a status and enter remarks for this employee.
        </DialogContentText>
        {/* <DialogContent> */}
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={3}>
            <FormControl style={{
              fontFamily: "Bookman Old Style",
              fontSize: "12px",
            }} size='small' fullWidth variant="outlined" margin="dense">
              <InputLabel style={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
              }}>Status</InputLabel>
              <Select style={{
                fontFamily: "Bookman Old Style",
                fontSize: "12px",
              }}
                size='small'
                label="Status"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <MenuItem style={{
                  fontFamily: "Bookman Old Style",
                  fontSize: "12px",
                }} value="">Select Status</MenuItem>
                {statusData.map((status) => (
                  <MenuItem style={{
                    fontFamily: "Bookman Old Style",
                    fontSize: "12px",
                  }} key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


          </Grid>
        </Grid>
        {selectedStatus && (
          <div>
            <DialogContentText style={{
              textAlign: 'center', fontFamily: "Bookman Old Style",
              fontSize: "12px"
            }}>
              Enter your remarks for this action.
            </DialogContentText>

            <Grid container alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  sx={{
                    fontFamily: "Bookman Old Style",
                    fontSize: "12px",
                    '& .MuiInputBase-input': {  // Apply styles to the input element
                      fontFamily: "Bookman Old Style",
                      fontSize: "12px"
                    }
                  }}
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

              </Grid>
            </Grid>

          </div>
        )}
        {/* </DialogContent> */}
        <DialogActions>

          {selectedStatus && (
            <Button style={{
              fontFamily: "Bookman Old Style",
              fontSize: "12px",
            }} onClick={handleRemarksSubmit} color="primary">
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
        <DialogContent>
          {dialogComponent}

        </DialogContent>
      </Dialog>
    </>
  );
}

export default Level2casedetails;





