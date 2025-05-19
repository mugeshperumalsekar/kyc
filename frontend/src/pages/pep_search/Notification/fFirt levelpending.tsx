import React, { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, IconButton } from '@mui/material';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import { useSelector } from 'react-redux';
import HitdatalifecycleApiService from '../../../data/services/pep_search/hitdatalifecycle/hitdatalifecycle-api-service';
import HitcaseApiService from '../../../data/services/pep_search/hitcase/hitcase-api-service';
import SearchApiService from '../../../data/services/pep_search/search-api-service';
import { SelectChangeEvent } from '@mui/material/Select';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import '../../CommonStyle/Style.css';

interface Notification {
  id: number;
  name: string;
  created_at: string;
  matching_score: number;
  uid: number
  userName: string;
};

interface Levelpending {
  id: string;
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
};

interface Status {
  id: string;
  name: string;
};

interface DisabledIcons {
  [key: string]: boolean;
};

const NotificationComponent: React.FC = () => {

  
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  const { id } = useParams();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const [levelpending, setLevelpending] = useState<Levelpending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModallogical, setShowModallogical] = useState(false);
  const [showModalgroup, setShowModalgroup] = useState(false);
  const [showModalun, setShowModalun] = useState(false);
  const [statusData, setStatusData] = useState<Status[]>([]);
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: string }>({});
  const [remarksAndActions, setRemarksAndActions] = useState<{ [key: string]: { action: string; remarks: string } }>({});
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
    fetchStatus();
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
      const levelpending = await authApiService.getpepLevelpending(id);
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

  const exportToExcel = () => {
    try {
      const dataForExport = notifications.length > 0 ? notifications.map((row) => ({
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
        return status.name === "Close" || status.name === "Escalation";
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
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value);
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = event.target.value.replace(/[^\w\s]/gi, '');
    setRemarks(filteredValue);
  };

  const [disabledIcons, setDisabledIcons] = useState<DisabledIcons>({});

  const handleIconClick = (index: number, searchId: string, recId: string) => {
    const currentIndex = `${searchId}-${recId}-${index}`;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRow(currentIndex);
    setIsRemarksDialogOpen(true);
  };

  const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTableRowClick = (ids: any, index: number,) => {
    const id = String(ids);
    const uid = loginDetails.id;
    setShowModal(true);
    const currentIndex = `${id}-${index}`;
    const existingAction = selectedActions[currentIndex] || '';
    const existingRemarks = remarksAndActions[currentIndex]?.remarks || '';
    setSelectedStatus(existingAction);
    setRemarks(existingRemarks);
    setSelectedRow(currentIndex);
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

  const handleCloseModal = () => {
    setShowModal(false);
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
      if (selectedRow !== null && levelpending.some(record => `${record.searchId}-${record.recId}-${levelpending.indexOf(record)}` === selectedRow)) {
        const updatedRemarksAndActions = { ...remarksAndActions };
        updatedRemarksAndActions[selectedRow] = { action: selectedStatus, remarks };
        setRemarksAndActions(updatedRemarksAndActions);
        const selectedSearchResult = levelpending.find(record => `${record.searchId}-${record.recId}-${levelpending.indexOf(record)}` === selectedRow);
        if (!selectedSearchResult) {
          console.error("Selected search result is undefined");
          return;
        }
        const hitdatalifecyclePayload = {
          searchId: selectedSearchResult.searchId,
          criminalId: selectedSearchResult.recId.toString(),
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
          criminalId: selectedSearchResult.recId.toString(),
          levelId: '1',
          statusNowId: selectedStatus,
          cycleId: '1',
          remark: remarks,
          uid: loginDetails.id,
        };
        if (parseInt(selectedStatus) == 1) {
          await hitdatalifecycleApiService.CreateHitdatalifecycle(hitdatalifecyclePayload);
        } else if (parseInt(selectedStatus) == 2) {
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
        console.error("Selected row is null, invalid, or out of bounds");
      }
    } catch (error) {
      console.error("Error submitting remarks:", error);
    }
    handleCloseModal();
    handleCloseModallogical();
    handleCloseModalgroup();
    handleCloseModalun();
  };

  const authApiService = new SearchApiService();
  const hitdatalifecycleApiService = new HitdatalifecycleApiService();
  const hitcaseApiService = new HitcaseApiService();

  return (
    <>
      <Box sx={{ display: 'flex', }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3, m: 2, }}>
          <Box sx={{ marginTop: '58px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
              <Typography className='allHeading'>FIRST LEVEL PENDING</Typography>
              <IconButton color="primary" onClick={exportToExcel} style={{ minWidth: 'unset', padding: '2px' }}>
                <FileDownloadIcon />
              </IconButton>
            </div>
            {notifications && notifications.length > 0 ? (
              <>
                <TableContainer component={Card} style={{ maxHeight: '400px', overflow: 'auto', width: '100%', marginTop: '5px' }}>
                  <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', width: '10%', }}><strong>S.No</strong></TableCell>
                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', }}><strong>Name</strong></TableCell>
                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', width: '20%', }}><strong>Score</strong></TableCell>
                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', }}><strong>Created At</strong></TableCell>
                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'lightgray', }}><strong>Created By</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                          <TableRow>
                            <TableCell style={{ width: '10%' }}><span>{index + 1}</span></TableCell>
                            <TableCell>
                              <span style={{ cursor: 'pointer',   color: '#3F51B5', textDecoration: 'underline', }} onClick={() => handleNotificationClick(notification.id)}>
                                <span>{notification.name.charAt(0).toUpperCase() + notification.name.slice(1)}</span>
                              </span>
                            </TableCell>
                            <TableCell style={{ width: '20%', }}><span>{notification.matching_score}</span></TableCell>
                            <TableCell><span>{new Date(notification.created_at).toLocaleDateString()}</span></TableCell>
                            <TableCell><span>{notification.userName}</span></TableCell>
                          </TableRow>
                          {selectedNotification === notification.id && (
                            <TableRow>
                              <TableCell colSpan={4}>
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', }}>
                                  {error ? (
                                    <Typography variant="body2" color="error"><span> {error}</span></Typography>
                                  ) : levelpending.length > 0 ? (
                                    <TableContainer component={Card} style={{ maxHeight: '400px', overflow: 'auto', }}>
                                      <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', }}><strong>Hit Name</strong></TableCell>
                                            <TableCell style={{ position: 'sticky', top: 0, backgroundColor: '#D3D3D3', fontWeight: 'bold', }}><strong>Hit Score</strong></TableCell>
                                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#D3D3D3', fontWeight: 'bold', }}><strong>Action</strong></TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {levelpending.map((record, index) => {
                                            const currentIndex = `${record.searchId}-${record.recId}-${index}`;
                                            const selectedAction = selectedActions[currentIndex];
                                            return (
                                              <React.Fragment key={record.recId}>
                                                <TableRow>
                                                  <TableCell>
                                                    <button style={{ cursor: 'pointer', color: '#3F51B5', textDecoration: 'underline', border: '0px solid blue', backgroundColor: 'white', }}
                                                      onClick={() => handleTableRowClick(record.recId, index,)}
                                                      disabled={disabledIcons[`-${record.recId}-${index}`]}>
                                                      <span>{record.hitName} </span>
                                                    </button>
                                                  </TableCell>
                                                  <TableCell><span>{record.hitScore}</span></TableCell>
                                                  <TableCell>
                                                    <IconButton
                                                      onClick={() => handleIconClick(index, record.searchId, record.recId.toString())}
                                                      style={{ padding: '1px 1px' }}
                                                      disabled={disabledIcons[`${record.searchId}-${record.recId}-${index}`]}>
                                                      {selectedAction ? (
                                                        <VisibilityOffIcon style={{ color: 'red', fontSize: '16px' }} />
                                                      ) : (
                                                        <VisibilityIcon style={{ color: 'green', fontSize: '16px' }} />
                                                      )}
                                                    </IconButton>
                                                    {selectedAction && (<span>{getStatusName(selectedAction)}</span>)}
                                                  </TableCell>
                                                </TableRow>
                                              </React.Fragment>
                                            );
                                          })}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  ) : (
                                    <Typography variant="body2"><span>No Pending data available</span></Typography>
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
        </Box>
        <Dialog open={isRemarksDialogOpen} onClose={handleCloseRemarksDialog} fullWidth maxWidth="md">
          <DialogActions>
            <Button onClick={handleCloseRemarksDialog} color="primary">
              <ClearIcon />
            </Button>
          </DialogActions>
          <DialogTitle style={{ padding: '0px 24px', fontSize: "16px", }}>Enter Remarks</DialogTitle>
          <DialogContentText style={{ textAlign: 'center', fontSize: "14px", }}>Select a status and enter remarks for this employee.</DialogContentText>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={3}>
              <FormControl style={{ fontSize: "12px", }} size='small' fullWidth variant="outlined" margin="dense">
                <InputLabel style={{ fontSize: "12px", }}>Status</InputLabel>
                <Select style={{ fontSize: "12px", }}
                  size='small'
                  label="Status"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <MenuItem style={{ fontSize: "12px", }} value="">Select Status</MenuItem>
                  {statusData.map((status) => (
                    <MenuItem style={{ fontSize: "12px", }} key={status.id} value={status.id}>
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
                textAlign: 'center', fontSize: "12px"
              }}>
                Enter your remarks for this action.
              </DialogContentText>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={8}>
                  <TextField
                    sx={{
                      fontSize: "12px",
                      '& .MuiInputBase-input': {
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
          <DialogActions>
            {selectedStatus && (
              <Button style={{
                fontSize: "12px",
              }} onClick={handleRemarksSubmit} color="primary">
                Submit
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent sx={{
            padding: '0px',
            overflowY: 'unset',
          }}>
            {modalContent}
          </DialogContent>
          <DialogActions>
            <button type="button" className="btn btn-outline-primary" onClick={() => setIsModalOpen(false)}>Close</button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );

};

export default NotificationComponent;