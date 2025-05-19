import React, { useEffect, useState } from 'react';
import { Button, Card, TextField, Table, TableBody, TableCell, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import levelApiService from '../../../data/services/cms_search/level/level-api-service';


interface Level {
  id: string;
  name: string;
}

function LevelComponent() {
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;

  const [name, setName] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editLevelsName, setEditLevelsName] = useState('');
  const [editLevelsId, setEditLevelsId] = useState('');
  const [activeTab, setActiveTab] = useState('insert');
  const [blockedRows, setBlockedRows] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const levelService = new levelApiService();

  useEffect(() => {
    fetchLevels();
    const storedBlockedRows = localStorage.getItem('blockedRows');
    if (storedBlockedRows) {
      setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
    }
  }, []);

  const showMessage = (messageText: string, type: 'success' | 'error') => {
    console.log(type, messageText);
  };

  const validateAlphabeticInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode || e.keyCode;
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Enter' ||
      e.key === ' ' ||
      charCode === 0
    ) {
      return true;
    }
    if (!/^[a-zA-Z]$/.test(String.fromCharCode(charCode))) {
      e.preventDefault();
      showMessage('Only alphabetic characters are allowed.', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!name) {
      showMessage('Please fill out all fields.', 'error');
      return;
    }
    try {
      const payload = {
        name: name,
        uid: loginDetails.id,
      };

      await levelService.CreateLevel(payload);
      setName('');
      fetchLevels();
      showMessage('Level added successfully.', 'success');
    } catch (error) {
      console.error('Error adding level:', error);
    }
  };

  const handleEditDialogSave = async () => {
    try {
      const payload = {
        name: editLevelsName,
        uid: loginDetails.id,
      };
      await levelService.updateLevel(Number(editLevelsId), payload);
      setOpenEditDialog(false);
      setEditLevelsId('');
      setEditLevelsName('');
      fetchLevels();
      showMessage('Level updated successfully.', 'success');
    } catch (error) {
      console.error('Error editing level:', error);
    }
  };

  const fetchLevels = async () => {
    try {
      const levels = await levelService.getLevel();
      setLevels(levels);
    } catch (error) {
      console.error('Error fetching level:', error);
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditLevelsId(id);
    setEditLevelsName(name);
    setOpenEditDialog(true);
  };

  const getSerialNumber = (index: number) => {
    return page * 10 + index + 1;
  };

  return (
    <div>
        <Typography variant="h6" fontWeight="bold">
          Level
        </Typography>
        <div>
          <Card style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
            <div style={{ padding: '16px' }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant={activeTab === 'insert' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('insert')}
                  >
                    Insert
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={activeTab === 'edit' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('edit')}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={activeTab === 'unblock' ? 'contained' : 'outlined'}
                    onClick={() => setActiveTab('unblock')}
                  >
                    Unblock
                  </Button>
                </Grid>
              </Grid>
              <br /><br />
              {activeTab === 'insert' && (
                <div>
                  <Typography variant="h6" fontWeight="bold">Add Level</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Level"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={validateAlphabeticInput}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              )}
              {activeTab === 'edit' && (
                <div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {levels.filter((level) => !blockedRows.includes(level.id)).map((level, index) => (
                        <TableRow key={level.id}>
                          <TableCell>{getSerialNumber(index)}</TableCell>
                          <TableCell>{level.name}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleEditClick(level.id, level.name)}
                              startIcon={<EditIcon />}
                              disabled={blockedRows.includes(level.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </div>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Level</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editLevelsName}
            onChange={(e) => setEditLevelsName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="primary">
                Cancel
          </Button>
          <Button onClick={handleEditDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LevelComponent;
