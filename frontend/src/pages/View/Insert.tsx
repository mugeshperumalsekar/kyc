import { ChangeEvent, useState } from 'react'
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select } from '@mui/material';
import { Card } from 'react-bootstrap';

function Insert() {
  
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="standard"
                  fullWidth
                  type="text"
                  size="small"
                  autoComplete="off"
                  style={headingStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data Scenario"
                  variant="standard"
                  fullWidth
                  type="text"
                  size="small"
                  autoComplete="off"
                  style={headingStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Customer Id"
                  variant="standard"
                  fullWidth
                  type="text"
                  size="small"
                  autoComplete="off"
                  style={headingStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Transaction"
                  variant="standard"
                  fullWidth
                  type="text"
                  size="small"
                  autoComplete="off"
                  style={headingStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Account Number"
                  variant="standard"
                  fullWidth
                  type="text"
                  size="small"
                  autoComplete="off"
                  style={headingStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cumulative Value"
                  variant="standard"
                  fullWidth
                  type="text"
                  size="small"
                  autoComplete="off"
                  style={headingStyle}
                />
              </Grid>
            </Grid>
            <div>
              <hr />
            </div>
            <Grid item xs={12} sm={12} style={{ overflowY: 'auto', maxHeight: '200px' }}>
              <h5 style={{ marginTop: '10px' }}>Transactions</h5>
            </Grid>
            <div>
              <hr />
            </div>
            <h5 style={{ marginTop: '10px' }}>Audit log</h5>
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

export default Insert;