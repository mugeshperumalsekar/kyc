import React, { useEffect, useRef, useState } from 'react';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Button, Card, DialogTitle, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, DialogContent, SelectChangeEvent, Dialog, DialogActions, } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import SearchApiService from '../../../data/services/pep_search/search-api-service';
import ViewService from '../../../data/services/pep_search/viewpage/view_api_service';
import LevelStatusMappingApiService from '../../../data/services/pep_search/levelstatusmapping/levelstatusmapping-api-service';
import levelApiService from '../../../data/services/pep_search/level/level-api-service';
import { useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HitdatalifecycleApiService from '../../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

interface Notification {
  id: number;
  name: string;
  created_at: string;
  searchingScore: number;
  uid: number;
  userName: string;
}

interface Levelpending {
  id: number;
  name: string;
  searchingScore: number;
  hitName: string;
  hitScore: number;
  hitId: string;
  recId: number;
  searchId: string;
  lifcycleSearchId: string;
  recordTypeId: string;
  criminalId: string;
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

const NotificationComponent: React.FC = () => {

  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const { id } = useParams();
  const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [selectedRow, setSelectedRow] = useState<any>([])
  const [selectedAction, setSelectedAction] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [levelpending, setLevelpending] = useState<Levelpending[]>([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null); 
  const [searchError, setSearchError] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const authApiService = new SearchApiService();
  const customer = new ViewService();
  const levelService = new LevelStatusMappingApiService();
  const levelServices = new levelApiService();

  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  useEffect(() => {
    fetchNotifications();
    fetchLevelStatus();
    fetchLevels()
  }, [id]);
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
      const notificationsData = await authApiService.getfirstlevelsearch();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchLevelpending = async (notificationId: number) => {
    // Toggle logic: If clicked again, close the details
    if (selectedNotificationId === notificationId) {
      setSelectedNotificationId(null); // Close the details
    } else {
      try {
        const levelpendingData = await authApiService.getpepLevelpending(notificationId);
        setLevelpending(levelpendingData);
        setSelectedNotificationId(notificationId); // Open the details for the selected notification
      } catch (error) {
        console.error('Error fetching level pending details:', error);
      }
    }
  };
  const handleIconClick = (index: Levelpending) => {
    // alert(`PendingAlert: ${JSON.stringify(alert)}, hitId: ${hitdataId}`);
    setSelectedRow(index);
    setOpenDialog(true);
    // handleoneRemark(hitdataId);

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
        criminal_id: Number(selectedRow.recId),
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
        setLevelpending(prevRecords => prevRecords.filter(row => row.recId !== selectedRow.recId));

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

        console.log("Selected action:", selectedAction);
        console.log("Remarks:", remarks);
        console.log("hitrecordlifecyclePayload:", hitrecordlifecyclePayload);
      }
    }
  };
  const handleTableRowClick = (ids: number) => {
    const uid = loginDetails.id;
    const id = String(ids);
    const content = (
      <iframe
        src={`/scpk/ViewDesign/${id}/${uid}`}
        title="View Design"
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    );
    setModalContent(content);
    setIsModalOpen(true);
  };
  const exportToExcel = () => {
    try {
      const dataForExport = notifications.length > 0 ? notifications.map((row) => ({
        // Id: row.,
        Name: row.name,
        searchingScore: row.searchingScore,
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


  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

            <h6 className='allheading'>FIRST LEVEL PENDING</h6>

            <IconButton
              color="primary"
              onClick={exportToExcel}
              style={{ minWidth: 'unset', padding: '2px' }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Box>
          <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
            <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
              <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                <TableRow className="tableHeading">
                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>S.No</TableCell>
                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Name</TableCell>
                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Score</TableCell>
                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Created At</TableCell>
                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <TableRow style={{ height: '32px' }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell style={{ padding: '4px' }} >
                        <a
                          href="#"
                          onClick={() => fetchLevelpending(notification.id)}
                          style={{
                            cursor: 'pointer',
                            color: '#1677FF',
                            textDecoration: 'underline',
                            fontSize: '12px',
                          }}
                        >
                          {notification.name.charAt(0).toUpperCase() + notification.name.slice(1)}
                        </a>
                        {/* <Button
                          variant="text"
                          onClick={() => fetchLevelpending(notification.id)}
                        >
                          {notification.name}
                        </Button> */}
                      </TableCell>
                      <TableCell style={{ padding: '4px' }}>{notification.searchingScore}</TableCell>
                      <TableCell style={{ padding: '4px' }}>{new Date(notification.created_at).toLocaleString()}</TableCell>
                      <TableCell style={{ padding: '4px' }}>{notification.userName}</TableCell>
                    </TableRow>
                    {/* Show levelpending details if the notification is clicked */}
                    {selectedNotificationId === notification.id && (
                      <TableRow>
                        <TableCell colSpan={5}>

                          <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                            <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                              <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                <TableRow className="tableHeading">
                                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>S.No</TableCell>

                                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Hit Name</TableCell>
                                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Hit Score</TableCell>
                                  <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {levelpending.map((level, index) => (
                                  <TableRow key={level.id} style={{ height: '32px' }}>
                                    <TableCell style={{ padding: '4px' }}>{index + 1}</TableCell>

                                    <TableCell style={{ padding: '4px' }}>

                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleTableRowClick(Number(level.recId));
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                          color: '#1677FF',
                                          textDecoration: 'underline',
                                          fontSize: '12px',
                                        }}
                                      >
                                        {level.hitName.charAt(0).toUpperCase() + level.hitName.slice(1)}
                                      </a>
                                    </TableCell>
                                    <TableCell style={{ padding: '4px' }}>{level.hitScore}</TableCell>
                                    <TableCell style={{ padding: '4px' }}>
                                      <IconButton onClick={() => handleIconClick(level)} style={{ padding: '1px' }}>
                                        <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                      </IconButton>

                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Dialog className='MuiDialog-root'
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      // PaperProps={{
      //   style: {
      //     minHeight: '500px',  
      //     maxHeight: '90vh',  
      //   }
      // }}
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
    </>
  );
};

export default NotificationComponent;
