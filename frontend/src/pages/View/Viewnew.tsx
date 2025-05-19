import { ChangeEvent, useState } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select } from '@mui/material';
import { Card, Table } from 'react-bootstrap';

function Viewnew() {
  
  const headingStyle = {
    fontFamily: 'Times New Roman',
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    console.log('Selected File:', selectedFile);
  };

  const handleSubmission = () => {
    console.log('Form Submitted');
  };

  return (
    <Box m={1}>
      <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 2px 4px' }}>
        <Card.Text style={{ marginTop: '2%' }}>
          <div className='row' style={{ margin: '10px' }}>
            <Grid container xs={12}>
              <Grid item xs={12} sm={6}>
                <p style={headingStyle}><strong>Name : </strong>Ram Kumar<br /></p>
                <p style={headingStyle}><strong>Customer Id : </strong>180023<br /></p>
                <p style={headingStyle}><strong>Account Number : </strong>2389379373973937<br /></p>
              </Grid>
              <Grid item xs={12} sm={6}>
                <p style={headingStyle}><strong>Data Scenario : </strong>19-MAR-2024<br /></p>
                <p style={headingStyle}><strong>Number of Transaction : </strong>26<br /></p>
                <p style={headingStyle}><strong>Cumulative Value : </strong>89.00<br /></p>
              </Grid>
            </Grid>
            <hr style={{ borderTop: '2px solid bold' }} />
            <Grid item xs={12} sm={12} style={{ overflowY: 'auto', maxHeight: '200px' }}>
              <h5 style={{ marginTop: '10px', fontFamily: 'Times New Roman' }}><strong>Transactions</strong></h5>
            </Grid>
            <Table>
              <thead style={headingStyle}>
                <tr>
                  <th >Date</th>
                  <th>Details</th>
                  <th>Debits</th>
                  <th>Credit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>16-FEB-2023</td>
                  <td>Payment for Services</td>
                  <td>-$50.00</td>
                  <td></td>
                  <td>$950.00</td>
                </tr>
                <tr>
                  <td>1-MAR-2024</td>
                  <td>Insurance Premium</td>
                  <td>-$1000.00</td>
                  <td>200</td>
                  <td>$800.00</td>
                </tr>
                <tr>
                  <td>31-DEC-2024</td>
                  <td>Recharge</td>
                  <td>-$217.00</td>
                  <td>800</td>
                  <td>$1100.00</td>
                </tr>
                <tr>
                  <td>01-JAN-2025</td>
                  <td>Bank Charges</td>
                  <td>-$20</td>
                  <td></td>
                  <td>$1080</td>
                </tr>
                <tr>
                  <td>20-JUN-2025</td>
                  <td>Dividents Collected By Bank</td>
                  <td>-$800.00</td>
                  <td></td>
                  <td>$12000.00</td>
                </tr>
              </tbody>
            </Table>
            <hr></hr>
            <h5 style={{ marginTop: '10px', fontFamily: 'Times New Roman' }}><strong>Audit Log</strong></h5>
            <Grid container spacing={4} xs={12}>
              <Grid item sm={4}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel htmlFor="gender">Level 1</InputLabel>
                  <Select
                    label="Gender"
                    variant="standard"
                  >
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4}>
                <TextField
                  style={{ width: '100%' }}
                  label="Typing"
                  variant="standard"
                  type="text"
                  size="small"
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </div>
        </Card.Text>
      </Card>
      <br></br>
      <Grid container xs={8} spacing={2}>
        <Grid item sm={2}>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            id="upload-document"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-document">
            <Button variant="outlined"
              component="span"
            >
              Document  Upload
            </Button>
          </label>
        </Grid>
        <Grid item sm={3}>
          <TextField label="Attachement" type="text" size="small" variant="outlined" value={selectedFile ? selectedFile.name : ''} disabled />
        </Grid>
        <Grid item xs={12} sm={3}>
        </Grid>
      </Grid>
      <br></br>
      <Button variant="contained" onClick={handleSubmission}>
        Submit
      </Button>
    </Box>
  )
}

export default Viewnew