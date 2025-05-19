import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from '@mui/material';
import { faStar, faCheckCircle, faPhone, faEnvelope, faUsers, faUser, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Badge } from '@mui/material';
import { ReactElement, JSXElementConstructor, ReactNode } from 'react';

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

interface ViewEmpProps {
  employee: AdminUser;
  handleClose: () => void;
}

function ViewEmp({ employee, handleClose }: ViewEmpProps) {

  const formattedDob = format(new Date(employee.dob), 'MM/dd/yyyy');
  const backendColumns = ['User Name', 'Full Name', 'Dob', 'Phone Number', 'Email Id', 'Admin Group', 'Status', 'Super User'];

  const getColumnIcon = (columnName: string) => {
    switch (columnName) {
      case 'User Name':
        return <FontAwesomeIcon icon={faUser} />;
      case 'Full Name':
        return <FontAwesomeIcon icon={faUser} />;
      case 'Dob':
        return <FontAwesomeIcon icon={faBirthdayCake} />;
      case 'Phone Number':
        return <FontAwesomeIcon icon={faPhone} />;
      case 'Email Id':
        return <FontAwesomeIcon icon={faEnvelope} />;
      case 'Admin Group':
        return <FontAwesomeIcon icon={faUsers} />;
      case 'Status':
        return <FontAwesomeIcon icon={faCheckCircle} />;
      case 'Super User':
        return <FontAwesomeIcon icon={faStar} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge
            color="success"
            badgeContent={status}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '999px', py: '2px', px: '8px', fontSize: '0.75rem' }}
          />
        );
      case 'DELETE':
        return (
          <Badge
            color="error"
            badgeContent={status}
            sx={{ bgcolor: 'error.main', color: 'error.contrastText', borderRadius: '999px', py: '2px', px: '8px', fontSize: '0.75rem' }}
          />
        );
      default:
        return (
          <Badge
            color="info"
            badgeContent={status}
            sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: '999px', py: '2px', px: '8px', fontSize: '0.75rem' }}
          />
        );
    }
  };

  const renderColumnValue = (columnName: string) => {
    switch (columnName) {
      case 'User Name':
        return employee.fullName || 'Not Available';
      case 'Full Name':
        return employee.fullName || 'Not Available';
      case 'Dob':
        return employee.dob ? format(new Date(employee.dob), 'dd-MMM-yyyy') : 'Not Available';
      case 'Phone Number':
        return employee.phoneNo || 'Not Available';
      case 'Email Id':
        return employee.email || 'Not Available';
      case 'Admin Group':
        return employee.adminGroup || 'Not Available';
      case 'Status':
        return employee.status ? getStatusBadge(employee.status) : 'Not Available';
      case 'Super User':
        return employee.superUser ? 'Yes' : 'No';
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return backendColumns.map((columnName, index) => (
      <TableRow key={columnName} style={{ height: '30px' }}>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
            <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
            <Typography variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
              {columnName}
            </Typography>
          </div>
        </TableCell>
        <TableCell>
          <div style={{ marginLeft: '20px' }}>
            {renderColumnValue(columnName)}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <Dialog open onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>USER DETAILS</DialogTitle>
        <DialogContent>
          <div >
            <TableContainer component={Paper}>
              <Table >
                <TableBody>{renderTableRows()}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ViewEmp;