import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow } from '@mui/material';

interface Employee {
  title: string;
  name: string;
  lastName: string;
  state: string;
  dist: string;
  address: string;
  dob: string;
  designation: string;
  ministry: string;
  placeOfBirth: string;
  coName: string;
  department: string;
}

interface Props {
  employee: Employee;
}

const SearchList: React.FC<Props> = ({ employee }) => {
  const [state, setState] = useState<Employee>({
    title: employee.title,
    name: employee.name,
    lastName: employee.lastName,
    state: employee.state,
    dist: employee.dist,
    address: employee.address,
    dob: employee.dob,
    designation: employee.designation,
    ministry: employee.ministry,
    placeOfBirth: employee.placeOfBirth,
    coName: employee.coName,
    department: employee.department
  });

  const strongStyle = { marginRight: '10px' };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  useEffect(() => {
    console.log(employee.dob);
  }, [employee.dob]);

  return (
    <Box m={2}>
      <Container>
        <form>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Title:</strong> {employee.title}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>state:</strong> {employee.state}</p>
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>First Name:</strong> {employee.name}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Dist:</strong> {employee.dist}</p> {/* Changed from Dist to dist */}
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>LastName:</strong> {employee.lastName}</p> {/* Changed from LastName to lastName */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Address:</strong> {employee.address}</p>
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Date of Birth:</strong> {employee.dob}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Designation:</strong> {employee.designation}</p> {/* Changed from Designation to designation */}
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Ministry:</strong> {employee.ministry}</p> {/* Changed from Ministry to ministry */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>PlaceofBirth:</strong> {employee.placeOfBirth}</p> {/* Changed from PlaceofBirth to placeOfBirth */}
            </Grid>
          </Grid>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}> C/O Name:</strong> {employee.coName}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p><strong style={strongStyle}>Department:</strong> {employee.department}</p> {/* Changed from Department to department */}
            </Grid>
          </Grid>
        </form>
      </Container>
      <Container>
   
   <Box sx={{ mt: 2 }}>
   <h3 >ALIASES</h3>
     <TableContainer component={Paper}>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>Type</TableCell>
             <TableCell>Name</TableCell>
             <TableCell>DOB</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           <TableRow>
             <TableCell>Example Type 1</TableCell>
             <TableCell>{employee.name}</TableCell>
             <TableCell>{employee.dob}</TableCell>
           </TableRow>
           
           {/* You can add more rows here */}
         </TableBody>
       </Table>
     </TableContainer>
   </Box>
 </Container>
 <Container>
   <br></br>
   <h3>IDENTIFICATIONS</h3>
   <Box sx={{ mt: 2 }}>
     <TableContainer component={Paper}>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>Type</TableCell>
             <TableCell>ID</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           <TableRow>
             <TableCell>Example Type 1</TableCell>
             <TableCell>123</TableCell>
           </TableRow>
           <TableRow>
             <TableCell>Example Type 2</TableCell>
             <TableCell>456</TableCell>
           </TableRow>
           {/* You can add more rows here */}
         </TableBody>
       </Table>
     </TableContainer>
   </Box>
 </Container>
 <Container>
   <br></br>
   <h3>PERSONAL DETAILS</h3>
   <Box sx={{ mt: 2 }}>
     <TableContainer component={Paper}>
     <Table>
         <TableHead>
           <TableRow>
             <TableCell>Relationship</TableCell>                
             <TableCell>Name</TableCell>
             <TableCell>AliasName</TableCell>
             <TableCell>DOB</TableCell>
             <TableCell>Companny</TableCell>
             <TableCell>Account No</TableCell>
             <TableCell>Designation</TableCell>
             <TableCell>Alias Account No</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           <TableRow>
             <TableCell>Example Type 1</TableCell>
             <TableCell>{employee.name}</TableCell>
             <TableCell>{employee.dob}</TableCell>
           </TableRow>
           <TableRow>
             <TableCell>Example Type 2</TableCell>
             <TableCell>456</TableCell>
           </TableRow>
           {/* You can add more rows here */}
         </TableBody>
       </Table>
     </TableContainer>
   </Box>
 </Container>
    </Box>
  );
}

export default SearchList;
