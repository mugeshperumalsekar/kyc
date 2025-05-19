import React, { useState, useEffect } from 'react';
import './addemp.css';
import { TextField, FormControl, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material'
import Header from '../../../layouts/header/header';
import AdmingroupApiService from '../../../data/services/master/AdminGroup/admingroup_api_service';
import AdminUserApiService from '../../../data/services/master/AdminUser/adminuser_api_serivice';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { AdminUserPayload } from '../../../data/services/master/AdminUser/adminuser_payload';
import { useNavigate } from 'react-router-dom';

interface Gender {
    id: string;
    gender: string;
    title: string;
};

interface Admingroup {
    id: string;
    moduleUrl: string;
    name: string;
};

interface Maritalstatus {
    id: string;
    name: string;
    prefix: string;
};

interface AdminUser {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    dob: string;
    genderId: string;
    phoneNo: string;
    validFrm: string;
    validTo: string;
    maritalStatusId: string;
    adminGroup: string;
    password: string;
    superUser: boolean;
};

const UpdateEmp: React.FC<{ rowData: AdminUser | null, isOpen: boolean, handleClose: () => void }> = ({ rowData, isOpen, handleClose }) => {

    const navigate = useNavigate();
    const [editfullName, setEditFullName] = useState('');
    const [edituserName, setEdituserName] = useState('');
    const [editemail, setEditemail] = useState('');
    const [editselectedDOB, setEditSelectedDOB] = useState('');
    const [editselectedGender, setEditSelectedGender] = useState('');
    const [editphoneNumber, setEditPhoneNumber] = useState('');
    const [editvalidFrom, setEditValidFrom] = useState('');
    const [editvalidTo, setEditValidTo] = useState('');
    const [editselectedMarialstatus, setEditSelectedMarialstatus] = useState('');
    const [editselectedAdmingroup, setEditSelectedAdmingroup] = useState('');
    const [editpassword, setEditPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [editconfirmPassword, setEditConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuperUser, setIsSuperUser] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [genders, setGenders] = useState<Gender[]>([]);
    const [selectedAdmingroup, setSelectedAdmingroup] = useState('');
    const [admingroups, setAdminGroups] = useState<Admingroup[]>([]);
    const [selectedMaritalstatus, setSelectedMaritalstatus] = useState('');
    const [maritalstatus, setMaritalstatus] = useState<Maritalstatus[]>([]);
    const [selectedDOB, setSelectedDOB] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const authService = new AdminUserApiService();
    const admingroupService = new AdmingroupApiService();

    useEffect(() => {
        if (isOpen && rowData) {
            setEditFullName(rowData.fullName);
            setEdituserName(rowData.userName);
            setEditemail(rowData.email);
            setEditSelectedDOB(rowData.dob);
            setEditSelectedGender(rowData.genderId);
            setEditPhoneNumber(rowData.phoneNo);
            setEditValidFrom(rowData.validFrm);
            setEditValidTo(rowData.validTo);
            setEditSelectedMarialstatus(rowData.maritalStatusId);
            setEditSelectedAdmingroup(rowData.adminGroup);
            setEditPassword(rowData.password);
            setIsSuperUser(rowData.superUser === true);
        }
    }, [isOpen, rowData]);

    useEffect(() => {
        fetchAdmingroup();
    }, []);

    const handleGenderChange = async (data: any) => {
        setSelectedGender(data);
    };

    const fetchAdmingroup = async () => {
        try {
            let admingroups = await admingroupService.getAdmingroup();
            setAdminGroups(admingroups);
        } catch (error) {
            console.error("Error fetching admin groups:", error);
        }
    };

    const handleAdmingroupChange = async (data: any) => {
        setSelectedAdmingroup(data);
    };

    const handleMaritalstatusChange = async (data: any) => {
        setSelectedMaritalstatus(data);
    };

    const handleUpdateAdminUser = async (id: string) => {
        try {
            if (rowData) {
                const { id, ...otherData } = rowData;
                const payload: AdminUserPayload = {
                    fullName: editfullName,
                    userName: edituserName,
                    email: editemail,
                    dob: editselectedDOB,
                    genderId: editselectedGender,
                    phoneNo: editphoneNumber,
                    validFrm: editvalidFrom,
                    validTo: editvalidTo,
                    maritalStatusId: editselectedMarialstatus,
                    adminGroup: editselectedAdmingroup,
                    superUser: isSuperUser ? 'true' : 'false',
                    password: editpassword,
                };
                await authService.updateAdminUser(rowData.id, payload);
                navigate('/adminuser');
                window.location.reload();
            };

        } catch (error) {
            console.error("Error editing Country:", error);
        }
    };

    const isPasswordValid = editpassword === editconfirmPassword;

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditFullName(e.target.value);
    };

    const handleuserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEdituserName(e.target.value);
    };

    const handleDobChange = (e: any) => {
        setEditSelectedDOB(e.target.value);
    };

    const handleEmailOrLoginChange = (e: any) => {
        setEditemail(e.target.value);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditPhoneNumber(e.target.value);
    };

    const handleValidFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValidFrom(e.target.value);
    };

    const handleValidToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValidTo(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditConfirmPassword(e.target.value);
    };

    const handleIsSuperUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSuperUser(e.target.checked);
    };

    const handleEditDialogClose = () => {
        handleClose();
    };

    return (
        <>
            <Header />
            <div style={{ width: '100%', textAlign: 'center' }}>
                <Dialog open={isOpen} onClose={handleEditDialogClose} fullWidth maxWidth="md">
                    <DialogTitle>EDIT USER</DialogTitle>
                    <DialogContent>
                        <div className='p-2'>
                            <div className='row'>
                                <div className='col-md-4 mb-3'>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        id='fullName'
                                        name='fullName'
                                        type='text'
                                        value={editfullName}
                                        onChange={(e) => setEditFullName(e.target.value)}
                                        label={
                                            <span>
                                                Full Name <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                    />
                                </div>
                                <div className='col-md-4 mb-3'>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        type='email'
                                        id='emailOrLogin'
                                        name='emailOrLogin'
                                        value={editemail}
                                        onChange={(e) => setEditemail(e.target.value)}
                                        label={
                                            <span>
                                                EmailId <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                    />
                                </div>
                                <div className='col-md-4 mb-3'>
                                    <FormControl fullWidth variant='outlined'>
                                        <TextField
                                            id='dob'
                                            name='dob'
                                            type='date'
                                            value={editselectedDOB}
                                            onChange={handleDobChange}
                                            label={
                                                <span>
                                                    Date of Birth
                                                </span>
                                            }
                                            variant='outlined'
                                            required
                                            size='small'
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4 mb-3'>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        type='text'
                                        id='userName'
                                        name='userName'
                                        value={edituserName}
                                        onChange={(e) => setEdituserName(e.target.value)}
                                        label={
                                            <span>
                                                User Name <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                    />
                                </div>
                                <div className='col-md-4 mb-3'>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        type='number'
                                        id='phoneNumber'
                                        name='phoneNumber'
                                        value={editphoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        label={
                                            <span>
                                                Phone Number <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                    />
                                </div>
                                <div className='col-md-2 mb-3'>
                                    <FormControl fullWidth variant='outlined'>
                                        <TextField
                                            type='date'
                                            className='form-control'
                                            id='validFrom'
                                            name='validFrom'
                                            value={editvalidFrom}
                                            required
                                            onChange={handleValidFromChange}
                                            label={
                                                <span>
                                                    Valid From
                                                </span>
                                            }
                                            variant='outlined'
                                            size='small'
                                        />
                                    </FormControl>
                                </div>
                                <div className='col-md-2 mb-3'>
                                    <FormControl fullWidth variant='outlined'>
                                        <TextField
                                            type='date'
                                            className='form-control'
                                            id='validTo'
                                            name='validTo'
                                            value={editvalidTo}
                                            required
                                            onChange={handleValidToChange}
                                            label={
                                                <span>
                                                    Valid To
                                                </span>
                                            }
                                            variant='outlined'
                                            size='small'
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4 mb-3'>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        type={showPassword ? 'text' : 'password'}
                                        id='password'
                                        name='password'
                                        value={editpassword}
                                        onChange={handlePasswordChange}
                                        label={
                                            <span>
                                                Password <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                                <div className='col-md-4 mb-3'>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        value={editpassword}
                                        onChange={handleConfirmPasswordChange}
                                        label={
                                            <span>
                                                Confirm Password <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4 mb-3'>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isSuperUser}
                                                onChange={handleIsSuperUserChange}
                                                name="isSuperUser"
                                                size="small"
                                            />
                                        }
                                        label="Super User"
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => rowData ? handleUpdateAdminUser(rowData.id) : null}
                            color="primary"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default UpdateEmp;