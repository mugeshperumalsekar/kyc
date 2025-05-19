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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../../data/services/cms_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/cms_search/hitcase/hitcase-api-service';
import SearchApiService from '../../../data/services/cms_search/search-api-service';
import ViewService from '../../../data/services/viewpage/view_api_service';
import { RecordDTO, SearchDTO } from '../../../data/services/viewservice/viewpagedetails-payload';
import ViewPageDetailsService from '../../../data/services/viewservice/viewpagedetails-api-service';
import { SelectChangeEvent } from '@mui/material/Select';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import { useReactToPrint } from 'react-to-print'; // Example import, adjust based on your actual library
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Entityview from '../../CmsView/Entityview';
import Individualview from '../../CmsView/Individualview';
import Shipview from '../../CmsView/Shipview';
import Aircraftview from '../../CmsView/Aircraftview';
import { CastRounded } from '@mui/icons-material';
import LevelStatusMappingApiService from '../../../data/services/cms_search/levelstatusmapping/levelstatusmapping-api-service';
import levelApiService from '../../../data/services/cms_search/level/level-api-service';


interface Notification {
  id: number;
  name: string;
  created_at: string;
  matchingScore: number;
  uid: number
  userName: string;
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
  recordTypeId: string;
  criminalId: string;
  cmsId: string;
}
interface Status {
  id: string;
  name: string;
  // Add other properties if necessary
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

const NotificationComponent: React.FC = () => {
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
    cmsId: 0,
    cmsName: '',
    cmsRecordType: '',
    score: 0,
    recordTypeId: 0,
    criminalId: 0, 
    searchId: 0,
    hitId: 0, 
    uid: loginDetails.id, 
});

  const viewservice = new ViewService();


  const [sortedColumn, setSortedColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [showModallogical, setShowModallogical] = useState(false);
  const [showModalgroup, setShowModalgroup] = useState(false);
  const [showModalun, setShowModalun] = useState(false);

  const [selectedSearchDetails, setSelectedSearchDetails] = useState<string>(''); // Initialize with an appropriate default value

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
  const [disabledRows, setDisabledRows] = useState<number[]>([]);

  const levelService = new LevelStatusMappingApiService();
  const levelServices = new levelApiService();


  useEffect(() => {
    fetchNotifications();

    fetchStatus();
    fetchLevelStatus();
    fetchLevels();
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
      const notifications = await authApiService.getfirstlevelsearch();
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchLevelpending = async (id: number) => {
    try {
      const levelpending = await authApiService.getcmsLevelpending(id);
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



  const tableRef = useRef<HTMLDivElement>(null); // Assuming tableRef is used to reference a <div> in your JSX


  const myRef = useRef(null);


  //   const handlePrint = useReactToPrint({
  //     content: () => myRef.current
  //   });
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
        matching_score: row.matchingScore,
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

  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

  const handleIconClick = (index: Levelpending) => {
    // alert(`PendingAlert: ${JSON.stringify(alert)}, hitId: ${hitdataId}`);
    setSelectedRow(index);
    setOpenDialog(true);
    // handleoneRemark(hitdataId);

  };
  const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);


  const handleTableRowClick = (
    cmsId: any,
    cmsRecordType: any,
    recordTypeId: any,
    index: number,
    searchId: string,
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

    // Pass the props when setting the dialog component
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

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAction('');
    setRemarks('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const getStatusName = (action: any) => {
    const status = levelStatus.find((status) => status.id === action);

    if (status) {
      const statusClassMap: { [key: string]: string } = {
        '1': 'green-text', // Assuming '1' corresponds to 'Closed'
        '2': 'red-text',   // Assuming '2' corresponds to 'Escalation'
        '3': 'yellow-text', // Assuming '3' corresponds to 'Request For Information'
      };

      const statusClass = statusClassMap[status.id];

      if (statusClass) {
        return (
          <span className={statusClass}>
            {status.status}
          </span>
        );
      } else {
        return status.status;
      }
    } else {
      return '';
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
        setDisabledRows((prev) => [...prev, selectedRow.recId]);

        // Update the selected action for the row
        setSelectedActions((prev) => ({
          ...prev,
          [selectedRow.recId]: selectedAction // Store the selected action by cmsId
        }));



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
  const authApiService = new SearchApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();


  return (

    <>
      <Box sx={{ display: 'flex', }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4, }}>
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

          {notifications && notifications.length > 0 ? (
            <>
              <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                  <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                    <TableRow className="tableHeading">
                      <TableCell sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                      >
                        S.No
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                      >
                        Score
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                      >
                        Created At
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                      >
                        Created By
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <TableRow>
                          <TableCell style={{ width: '10%' }}>{index + 1}</TableCell>
                          <TableCell style={{ padding: '4px' }}>
                            <a
                              href="#"
                              onClick={() => handleNotificationClick(notification.id)}
                              style={{
                                cursor: 'pointer',
                                color: '#1677FF',
                                textDecoration: 'underline',
                                fontSize: '12px',
                              }}
                            >
                              {notification.name.charAt(0).toUpperCase() + notification.name.slice(1)}
                            </a>
                            {/*             
                              onClick={() => handleNotificationClick(notification.id)}
                            >
                              <span>{notification.name}</span>
                            </span> */}
                          </TableCell>
                          <TableCell style={{ padding: '4px' }}>
                            {notification.matchingScore}
                          </TableCell>
                          <TableCell>
                            {new Date(notification.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {notification.userName} </TableCell>

                        </TableRow>

                        {selectedNotification === notification.id && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  margin: '20px 0',


                                }}
                              >
                                {error ? (
                                  <Typography variant="body2" color="error">
                                    {error}
                                  </Typography>
                                ) : levelpending.length > 0 ? (

                                  <TableContainer component={Card} style={{ width: '100%', overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                                    <Table size="small" stickyHeader aria-label="sticky table" style={{ margin: '0 auto' }}>
                                      <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                        <TableRow className="tableHeading">

                                          <TableCell
                                            sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                                          >
                                            Hit Name
                                          </TableCell>
                                          <TableCell
                                            sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                                          >
                                            Hit Score
                                          </TableCell>
                                          <TableCell
                                            sx={{ backgroundColor: '#D3D3D3', padding: '4px', }}
                                          >
                                            Action
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {levelpending.map((record, index) => {
                                          return (
                                            <React.Fragment key={record.recId}>
                                              <TableRow>
                                                <TableCell style={{ padding: '4px' }}>

                                                  <a
                                                    href="#"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      if (!disabledRows.includes(record.recId)) {

                                                        handleTableRowClick(
                                                          record.cmsId,
                                                          record.recId,
                                                          record.recordTypeId,
                                                          index,
                                                          record.searchId
                                                        )
                                                      }
                                                    }}
                                                    style={{
                                                      cursor: disabledRows.includes(record.recId) ? 'not-allowed' : 'pointer',
                                                      color: disabledRows.includes(record.recId) ? 'gray' : '#1677FF',

                                                      textDecoration: 'underline',
                                                      fontSize: '12px',
                                                    }}
                                                  >
                                                    {record.hitName.charAt(0).toUpperCase() + record.hitName.slice(1)}
                                                  </a>
                                                </TableCell>

                                                <TableCell><span>{record.hitScore}</span></TableCell>
                                                <TableCell style={{ padding: '4px' }}>
                                                  <IconButton onClick={() => handleIconClick(record)} style={{ padding: '1px' }}
                                                    disabled={disabledRows.includes(record.recId)}
                                                  >
                                                    {disabledRows.includes(record.recId) ? (
                                                      <VisibilityOffIcon style={{ color: 'red' }} />
                                                    ) : (
                                                      <VisibilityIcon
                                                        style={{
                                                          color: 'green',
                                                          fontSize: '16px',
                                                        }}
                                                      />
                                                    )}
                                                  </IconButton>
                                                  {selectedActions[record.recId] && (
                                                    <span style={{
                                                      color: levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status === "Close" ? "green" :
                                                        levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status === "Escalation" ? "red" :
                                                          levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status === "Request For Information" ? "yellow" :
                                                            "black" // Default color if no match
                                                    }}>
                                                      {levelStatus.find(status => status.id === parseInt(selectedActions[record.cmsId]))?.status || "No Status Selected"}
                                                    </span>
                                                  )}

                                                </TableCell>
                                              </TableRow>
                                            </React.Fragment>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>

                                ) : (
                                  <Typography variant="body2">
                                    <span>
                                      No Pending data available
                                    </span>

                                  </Typography>
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
            <Typography variant="body1"><span>No FirstLevelPending available</span></Typography>
          )}





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
        <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
          <DialogContent>
            {dialogComponent}

          </DialogContent>
        </Dialog>
      </Box>
    </>

  );
};

export default NotificationComponent;
