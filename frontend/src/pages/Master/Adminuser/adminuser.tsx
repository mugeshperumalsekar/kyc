import { useState, useEffect } from 'react';
import Header from '../../../layouts/header/header';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
import UpdateEmp from './UpdateEmp';
import ViewEmp from './Viewemp';

interface AdminUser {
  id: string;
  fullName: string;
  userName: string;
  loginId: string;
  dob: string;
  genderId: string;
  phoneNo: string;
  validFrm: string;
  validTo: string;
  maritalStatusId: string;
  adminGroup: string;
  password: string;
  superUser: boolean;
  email: string;
  status: string;
}

const AdminUser = () => {

  const navigate = useNavigate();
  const authService = new AuthAdminApiService();
  const [isAddEmpFormVisible, setIsAddEmpFormVisible] = useState(false);
  const [adminuser, setAdminuser] = useState<AdminUser[]>([]);
  const [isUpdateEmpDialogOpen, setUpdateEmpDialogOpen] = useState(false);
  const [isViewEmpDialogOpen, setViewEmpDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<AdminUser | null>(null);

  const handleEditClick = (id: string) => {
    const selectedRow = adminuser.find(row => row.id === id);
    if (selectedRow) {
      setSelectedRowData({ ...selectedRow });
      setUpdateEmpDialogOpen(true);
      setViewEmpDialogOpen(false);
    }
  };

  const handleAddClick = () => {
    setIsAddEmpFormVisible(true);
    navigate('/addemp');
  };

  useEffect(() => {
    fetchAdminuser();
  }, []);

  const fetchAdminuser = async () => {
    try {
      let adminuser = await authService.getadminuser();
      setAdminuser(adminuser);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      const response = await authService.getUserView(id);
      const userData = response;
      setSelectedRowData(userData);
      setViewEmpDialogOpen(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCloseDialog = () => {
    setUpdateEmpDialogOpen(false);
    setSelectedRowData(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box m={6}>
            <Container>
              <h4 className="head">EMPLOYEE DETAILS</h4>
              <Button variant="contained" onClick={handleAddClick}>
                Add Employee
              </Button>
              <TableContainer component={Paper} style={{ display: 'flex', textAlign: 'center' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminuser.map((row) => {
                      const dobDate = new Date(row.dob);
                      const day = dobDate.getDate();
                      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dobDate);
                      const year = dobDate.getFullYear();
                      return (
                        <TableRow key={row.id}>
                          <TableCell>{row.userName}</TableCell>
                          <TableCell>{day} - {month} - {year}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleViewClick(row.id)}
                              style={{ marginRight: 10 }}
                            >
                              View
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleEditClick(row.id)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Box>
          {isViewEmpDialogOpen && selectedRowData && (
            <ViewEmp employee={selectedRowData} handleClose={handleCloseDialog} />
          )}
          {isUpdateEmpDialogOpen && selectedRowData && (
            <UpdateEmp rowData={selectedRowData} isOpen={isUpdateEmpDialogOpen} handleClose={handleCloseDialog} />
          )}
        </Box>
      </Box>
    </>
  );
}

export default AdminUser;