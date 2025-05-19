
import React, { useEffect, useState } from 'react';
import PendingAlertApiService from '../../../data/services/pep_search/PendingAlert/pendingalert-api-service';
import LevelStatusMappingApiService from '../../../data/services/pep_search/levelstatusmapping/levelstatusmapping-api-service';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent, Box, FormControl, InputLabel, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Header from '../../../layouts/header/header';
import statusApiService from '../../../data/services/master/status/status-api-service';
import HitdatalifecycleApiService from '../../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/pep_search/hitcase/hitcase-api-service';
import PendingcasesApiService from '../../../data/services/pep_search/pendingcases/pending-api-service';
import { Typography as antTypography, Steps, Tooltip as antTooltip } from 'antd';
import { Stepper, Step, StepLabel, Typography } from '@mui/material';

import LevelsFlow from '../LevelsFlow';
import { Snackbar, Alert } from '@mui/material';
import levelApiService from '../../../data/services/pep_search/level/level-api-service';

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

function LevelFlow() {
  const { Step } = Steps;
  const [pendingAlert, setPendingAlert] = useState<PendingAlert[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [levelOneRemark, setLevelOneRemark] = useState<Remark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<boolean>(false);

  const [levels, setLevels] = useState<Level[]>([]);

  const [selectedAlert, setSelectedAlert] = useState<PendingAlert | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [activeButton, setActiveButton] = useState<null | 'pendingCase' | 'pendingRIF'>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;

  const authService = new PendingAlertApiService();
  const levelService = new LevelStatusMappingApiService();
  const statusService = new statusApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();
  const authServicecase = new PendingcasesApiService();
  const levelServices = new levelApiService();


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
      setLoading(false); // Ensure loading is set to false after the fetch
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

  }, []);

  const handleIconClick = (index: PendingAlert, hitdataId: string) => {
    // alert(`PendingAlert: ${JSON.stringify(alert)}, hitId: ${hitdataId}`);
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
      const response = await authService.getpepRemarkending(hitdataId);
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

  // const handleRemarksSubmit = async () => {
  //   if (selectedAlert) {

  //     const selectedStatus = levelStatus.find(status => status.id === parseInt(selectedAction));

  //     if (!selectedStatus) {
  //       console.error("Selected status not found.");
  //       return;
  //     }
  //     const hitrecordlifecyclePayload = {
  //       search_id: Number(selectedAlert.searchId),
  //       hitdata_id: Number(selectedAlert.hitId),
  //       criminal_id: Number(selectedAlert.criminalId),
  //       statusId: selectedStatus.statusId,
  //       statusNowId: selectedStatus.statusId,
  //       remark: remarks,
  //       // hitId: Number(selectedAlert.hitId),
  //       level_id: loginDetails.accessLevel,
  //       case_id: Number(selectedAlert.caseId),
  //       valid: 0,
  //       isAlive: selectedStatus.isAlive,
  //       passingLevelId: selectedStatus.passingLevelId,
  //       uid: loginDetails.id

  //     };


  //     await hitdatalifecycleApiService.CreatLevelFlowcycle(hitrecordlifecyclePayload);
  //     handlePendingAlertClick();


  //     console.log("Selected action:", selectedAction);
  //     console.log("Remarks:", remarks);
  //     console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);

  //   }
  //   setOpenDialog(false);
  // };

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

        // Reload the table after saving
        await handlePendingAlertClick();

        setSnackbarMessage('Saved successfully!');
        setOpenSnackbar(true);
        setSelectedAction(''); // Reset selected action
        setRemarks('');
      } catch (error) {
        console.error("Error saving data:", error);
        setSnackbarMessage('Failed to save.');
        setOpenSnackbar(true);
      } finally {
   
        setLoading(false);
      }

      console.log("Selected action:", selectedAction);
      console.log("Remarks:", remarks);
      console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
    }
    setOpenDialog(false);
  };

  const handleTableRowClick = (ids: number) => {
    const uid = loginDetails.id;
    const id = String(ids);
    const content = (
      <iframe
        src={`/ViewDesign/${id}/${uid}`}
        title="View Design"
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    );
    setModalContent(content);
    setIsModalOpen(true);
  };

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
          {levelStatus[0]?.levelId === 1 && <LevelsFlow />}



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
                                handleTableRowClick(Number(alert.criminalId));
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
                <div >

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
              <Box   >

                <Steps direction="vertical" size="small" current={levelOneRemark.length - 1} style={{ width: '100%' }}>
                  {levelOneRemark.map((remark, index) => (
                    <Step
                      key={index}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <h6 style={{ margin: 0 }}>{`Level: ${remark.level} , ${remark.status}`}</h6>
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
            <div style={{padding:'4px 20px'}}>

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

        </Box>
      </Box >

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

export default LevelFlow;
