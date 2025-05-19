import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from '../../layouts/header/header';
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Form } from 'react-bootstrap';
import AuthAdminApiService from '../../data/services/authadminuser/authu-admin-api-service';
import AdminUserRightsApiService from '../../data/services/adminuserrights/athu-adminuserrights-api-service';
import { AdminUserRightsPayload } from '../../data/services/adminuserrights/athu-adminuserrights-payload';
import AuthConfigModuleModuleDetApiService from '../../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service';

interface AdminUser {
  id: string;
  userName: string;
}

interface ConfigModuleModuleDet {
  id: string;
  modid: number;
  moddetid: number;
  modname: string;
  moddetname: string;
}

interface UserAccess {
  id: number;
  uid: number;
  modId: number;
  modDetId: number;
  entUid: number;
  status: string;
}

interface AdminInputRefType extends HTMLSelectElement { }
interface ValidationMessageRefType extends HTMLParagraphElement { }

const AdminUserrights = () => {

  const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
  const [selectedadminuser, setSelectedadminuser] = useState('');
  const [selectedModIds, setSelectedModIds] = useState<string[]>([]);
  const [selectedModDetIds, setSelectedModDetIds] = useState<string[]>([]);
  const [configModuleModuleDet, setConfigModuleModuleDet] = useState<ConfigModuleModuleDet[]>([]);
  const authService = new AuthAdminApiService();
  const AdminUserRightsService = new AdminUserRightsApiService();
  const authConfigModuleModuleDetService = new AuthConfigModuleModuleDetApiService();
  const [adminUserValidationError, setAdminUserValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const adminInputRef = useRef<AdminInputRefType>(null);
  const validationMessageRef = useRef<ValidationMessageRefType>(null);
  const [filteredUserAccess, setFilteredUserAccess] = useState<UserAccess[]>([]);
  const [checkboxStatus, setCheckboxStatus] = useState<{ [key: string]: boolean }>({});
  const [filteredCheckboxStatus, setFilteredCheckboxStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchAdminusers();
    fetchConfigModuleModuleDet();
    fetchUserAccess();
  }, []);

  useEffect(() => {
  }, [selectedModIds, selectedModDetIds]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (selectedadminuser) {
      const selectedUser = adminusers.find(user => user.userName === selectedadminuser);
      if (selectedUser) {
        fetchUserAccess();
      } else {
        console.error("Selected admin user not found.");
      }
    }
  }, [selectedadminuser, adminusers]);

  const fetchAdminusers = async () => {
    try {
      let adminusers: AdminUser[] = await authService.getadminuser();
      adminusers = adminusers.map((adminuser: AdminUser) => ({
        ...adminuser,
      }));
      setAdminusers(adminusers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  const fetchUserAccess = async () => {
    try {
      const UserAccess = await AdminUserRightsService.getUserAccess();
      const selectedUser = adminusers.find(user => user.userName === selectedadminuser);
      if (selectedUser) {
        const filteredAccess = UserAccess.filter((access: { uid: string, status: string }) => access.uid === selectedUser.id.toString() && access.status === "ACTIVE");
        setFilteredUserAccess(filteredAccess);
        setUserAccess(UserAccess);
      } else {
        console.error("Selected admin user not found.");
      }
    } catch (error) {
      console.error("Error fetching User Access:", error);
    }
  };

  const fetchConfigModuleModuleDet = async () => {
    try {
      const response = await authConfigModuleModuleDetService.getConfigModuleModuleDet();
      setConfigModuleModuleDet(response);
      return response;
    } catch (error) {
      console.error("Error fetching config modules:", error);
    }
  };

  const modIdSet = new Set<number>();
  let snCount = 0;

  const handleCheckboxChange = async (id: string | null, modId: string, modDetId: string, checked: boolean): Promise<void> => {
    setCheckboxStatus(prevCheckboxStatus => {
      const updatedCheckboxStatus = { ...prevCheckboxStatus, [`${modId}-${modDetId}`]: checked };
      if (!checked && id) {
        setFilteredUserAccess(prevAccess => prevAccess.filter(access =>
          !(access.modId === Number(modId) && access.modDetId === Number(modDetId))
        ));
        AdminUserRightsService.blockUser(id)
          .then(() => {
            console.log(`User has been blocked.`);
          })
          .catch((error: any) => {
            console.error(`Error blocking user access for modId ${modId}:`, error);
          });
      }
      return updatedCheckboxStatus;
    });
    setAdminUserValidationError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedadminuser) {
        setAdminUserValidationError("Please Select User and Give Permission.");
        if (adminInputRef.current) {
          adminInputRef.current.focus();
        }
        return;
      }
      const selectedUser = adminusers.find((user) => user.userName === selectedadminuser);
      if (!selectedUser) {
        return;
      }
      const payload: AdminUserRightsPayload[] = selectedModIds.map((modId, index) => ({
        id: selectedUser.id,
        modId: modId + '',
        uid: selectedUser.id,
        entUid: '1',
        modDetId: selectedModDetIds[index] + '',
        valid: 'True',
        userName: selectedUser.userName || '',
      }));
      const selectedPermissions = Object.keys(checkboxStatus)
        .filter(key => checkboxStatus[key])
        .map(key => key.split('-'))
        .map(([modId, modDetId]) => ({
          id: selectedUser.id,
          modId,
          uid: selectedUser.id,
          entUid: '1',
          modDetId,
          valid: 'True',
          userName: selectedUser.userName || '',
        }));
      payload.push(...selectedPermissions);
      const response = await AdminUserRightsService.saveAdminUserRights(payload);
      setAdminUserValidationError(null);
      setSaveSuccess(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Save successful!');
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      console.error("Error saving AdminUserRights:", error);
      setSaveSuccess(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Save failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const isCheckboxChecked = (modId: number, modDetId: number): { checked: boolean, id: string | null } => {
    const foundAccess = filteredUserAccess.find(access =>
      access.modId === modId && access.modDetId === modDetId
    );
    return {
      checked: !!foundAccess,
      id: foundAccess ? foundAccess.id.toString() : null
    };
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box>
            <Container style={{ marginTop: '5%' }}>
              <Box m={4}>
                <h3>ADMIN USER RIGHTS</h3>
                <Card
                  className="shadow p-3 mb-5 bg-white rounded"
                >
                  <Box>
                    <div className="form-group">
                      <Col xs={2} style={{ marginLeft: '9%' }}>
                        <FormControl fullWidth variant="outlined" margin="dense">
                          <InputLabel htmlFor="adminuser">Admin User</InputLabel>
                          <Select
                            label="adminuser"
                            value={selectedadminuser}
                            onChange={(e) => {
                              const selectedUserName = e.target.value as string;
                              setSelectedadminuser(selectedUserName);
                              setAdminUserValidationError(null);
                              const selectedUser = adminusers.find(user => user.userName === selectedUserName);
                              if (selectedUser) {
                                console.log("Selected Admin User:", selectedUser);
                                fetchUserAccess();
                              } else {
                                console.error("Selected admin user not found.");
                              }
                            }}
                            name="adminuser"
                            variant="outlined"
                            size="small"
                            inputRef={adminInputRef}
                            required
                          >
                            <MenuItem value="">Select Admin User</MenuItem>
                            {adminusers.map((adminuser) => (
                              <MenuItem key={adminuser.id} value={adminuser.userName}>
                                {adminuser.userName}
                              </MenuItem>
                            ))}
                          </Select>
                          {adminUserValidationError && (
                            <Form.Text ref={validationMessageRef} className="text-danger">{adminUserValidationError}</Form.Text>
                          )}
                        </FormControl>
                      </Col>
                    </div>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ borderBottom: '1px solid #ddd' }}>S.No</TableCell>
                          <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}> Group</TableCell>
                          <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}> SubGroup </TableCell>
                          <TableCell style={{ borderBottom: '1px solid #ddd' }}>Permission</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {configModuleModuleDet.length > 0 ? (
                          configModuleModuleDet.map((moduleDet, index) => {
                            const isFirstInGroup =
                              index === 0 || moduleDet.modname !== configModuleModuleDet[index - 1].modname;
                            const groupSize = configModuleModuleDet.filter((m) => m.modname === moduleDet.modname).length;
                            const isNewModId = !modIdSet.has(moduleDet.modid);
                            if (isNewModId) {
                              snCount += 1;
                              modIdSet.add(moduleDet.modid);
                            }
                            return (
                              <TableRow key={moduleDet.modid ? moduleDet.moddetid.toString() : ''}>
                                {isFirstInGroup ? (<TableCell rowSpan={groupSize} style={{ borderRight: '1px solid #ddd' }}> {snCount}</TableCell>) : null}
                                {isFirstInGroup ? (<TableCell rowSpan={groupSize} style={{ borderRight: '1px solid #ddd' }}>{moduleDet.modname}</TableCell>) : null}
                                <TableCell>{moduleDet.moddetname}</TableCell>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    checked={isCheckboxChecked(moduleDet.modid, moduleDet.moddetid).checked || checkboxStatus[`${moduleDet.modid}-${moduleDet.moddetid}`]}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        isCheckboxChecked(moduleDet.modid, moduleDet.moddetid).id,
                                        moduleDet.modid.toString(),
                                        moduleDet.moddetid.toString(),
                                        e.target.checked
                                      )
                                    }
                                    style={{ width: '20px', height: '20px' }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>Loading...</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="d-grid gap-1 d-md-flex justify-content-md-end" style={{ marginRight: '13%' }}>
                    <button type="button" className="btn btn-primary" onClick={handleSave} style={{ margin: '3%' }}>
                      Save
                    </button>
                  </div>
                </Card>
              </Box>
            </Container>
          </Box>
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={snackbarSeverity}
            onClose={handleSnackbarClose}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    </>
  )
};

export default AdminUserrights;