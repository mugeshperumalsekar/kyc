import React, { useState, useEffect } from 'react';
import './addemp.css';
import { TextField, FormControl, Box, Checkbox, FormControlLabel } from '@mui/material'
import Header from '../../../layouts/header/header';
import { Card } from 'react-bootstrap';
import AuthAdminApiService from '../../../data/services/authadminuser/authu-admin-api-service';
import { AuthAdminPayload } from '../../../data/services/authadminuser/authu-admin-payload';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Gender {
    id: string;
    gender: string;
    title: string;
}

interface Admingroup {
    id: string;
    moduleUrl: string;
    name: string;
}

interface Marialstatus {
    id: string;
    name: string;
    prefix: string;
}

const AddEmp = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [email, setemail] = useState('');
    const [emailError, setemailError] = useState('');
    const [fullName, setFullName] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [userName, setuserName] = useState('');
    const [userNameError, setuserNameError] = useState('');
    const [emailOrLogin, setEmailOrLogin] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [validFrom, setValidFrom] = useState('');
    const [validTo, setValidTo] = useState('');
    const [married, setMarried] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isSuperUser, setIsSuperUser] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [genders, setGenders] = useState<Gender[]>([]);
    const [selectedAdmingroup, setSelectedAdmingroup] = useState('');
    const [admingroups, setAdminGroups] = useState<Admingroup[]>([]);
    const [selectedMarialstatus, setSelectedMarialstatus] = useState('');
    const [marialstatus, setMarialstatus] = useState<Marialstatus[]>([]);
    const [selectedDOB, setSelectedDOB] = useState('');
    const authService = new AuthAdminApiService();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmitAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: { [key: string]: string } = {};
        if (fullName.trim() === '') {
            errors.fullName = 'Full Name is required';
        }
        if (email.trim() === '') {
            errors.email = 'Email is required';
        }
        if (userName.trim() === '') {
            errors.userName = 'User Name is required';
        }
        if (password.trim() === '') {
            errors.password = 'Password is required';
        }
        if (confirmPassword.trim() === '') {
            errors.confirmPassword = 'Confirm Password is required';
        }
        if (!isPasswordValid) {
            errors.confirmPassword = "Passwords don't match";
        }
        setFullNameError(errors.fullName || '');
        setemailError(errors.email || '');
        setuserNameError(errors.userName || '');
        setPasswordError(errors.password || '');
        setConfirmPasswordError(errors.confirmPassword || '');
        try {
            const payload: AuthAdminPayload = {
                userName: userName,
                fullName: fullName,
                email: email,
                dob: selectedDOB,
                phoneNo: phoneNumber,
                validFrm: validFrom,
                validTo: validTo,
                superUser: isSuperUser ? 'true' : 'false',
                password: password,
                adminGroup: userName,
                genderId: 0,
                maritalStatusId: 0,
                uid: loginDetails.id
            };
            const response = await authService.doAdminuser(payload);
            setFullName('');
            setemail('');
            setuserName('');
            setPassword('');
            setConfirmPassword('');
            setSelectedDOB('');
            setPhoneNumber('');
            setValidFrom('');
            setValidTo('');
            setIsSuperUser(false);
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const isPasswordValid =
        password === confirmPassword;

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let fullNameValue = e.target.value;
        fullNameValue = fullNameValue.charAt(0).toUpperCase() + fullNameValue.slice(1).toLowerCase();
        const fullNameRegex = /^[a-zA-Z\s]*$/;
        if (!fullNameRegex.test(fullNameValue)) {
            setFullNameError('Only alphabets and spaces are allowed');
        } else {
            setFullNameError('');
            setFullName(fullNameValue);
        }
    };

    const handleClose = () => {
        navigate('/AdminUser');
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let userNameValue = e.target.value;
        userNameValue = userNameValue.charAt(0).toUpperCase() + userNameValue.slice(1).toLowerCase();
        const userNameRegex = /^[a-zA-Z\s]*$/;
        if (!userNameRegex.test(userNameValue)) {
            setuserNameError('Only alphabets and spaces are allowed');
            setuserName('');
        } else {
            setuserNameError('');
            setuserName(userNameValue);
        }
    };

    const handleDobChange = (e: any) => {
        setSelectedDOB(e.target.value);
    };

    const handleEmailOrLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setemail(emailValue);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            setemailError('Invalid email format');
        } else {
            setemailError('');
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phoneNumberValue = e.target.value;
        const phoneNumberRegex = /^[0-9]*$/;
        if (!phoneNumberRegex.test(phoneNumberValue) || phoneNumberValue.length > 10) {
            setPhoneNumberError('Phone number must contain up to 10 digits');
        } else {
            setPhoneNumberError('');
            setPhoneNumber(phoneNumberValue);
        }
    };

    const handleValidFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidFrom(e.target.value);
    };

    const handleValidToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidTo(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const lowerCaseRegex = /[a-z]/;
        const upperCaseRegex = /[A-Z]/;
        const numberRegex = /[0-9]/;
        const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        const isStrongPassword =
            newPassword.length >= 8 &&
            lowerCaseRegex.test(newPassword) &&
            upperCaseRegex.test(newPassword) &&
            numberRegex.test(newPassword) &&
            specialCharacterRegex.test(newPassword);
        if (!isStrongPassword) {
            setPasswordError('Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        if (password !== confirmPasswordValue) {
            setConfirmPasswordError("Passwords don't match");
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleIsSuperUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSuperUser(e.target.checked);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box mt={8} display="flex" justifyContent="center">
                        <Card style={{ width: '95%' }}>
                            <Box mt={6}>
                                <h4 style={{ marginLeft: '2%', marginTop: '-3%' }}>EMPLOYEE REGISTRATION</h4>
                                <form>
                                    <div className='p-2' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <TextField
                                            fullWidth
                                            variant='outlined'
                                            id='fullName'
                                            name='fullName'
                                            type='text'
                                            value={fullName}
                                            onChange={handleFullNameChange}
                                            label={
                                                <span>
                                                    Full Name <span style={{ color: 'red' }}>*</span>
                                                </span>
                                            }
                                            size="small"
                                            error={!!fullNameError}
                                            helperText={fullNameError}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            fullWidth
                                            variant='outlined'
                                            type='email'
                                            id='emailOrLogin'
                                            name='emailOrLogin'
                                            value={email}
                                            onChange={handleEmailOrLoginChange}
                                            label={
                                                <span>
                                                    Email Id <span style={{ color: 'red' }}>*</span>
                                                </span>
                                            }
                                            size="small"
                                            error={!!emailError}
                                            helperText={emailError}
                                            autoComplete="off"
                                        />
                                        <FormControl fullWidth variant='outlined'>
                                            <TextField
                                                id='dob'
                                                name='dob'
                                                type='date'
                                                value={selectedDOB}
                                                onChange={handleDobChange}
                                                label='Date of Birth'
                                                variant='outlined'
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <TextField
                                            fullWidth
                                            variant='outlined'
                                            id='userName'
                                            name='userName'
                                            type='text'
                                            value={userName}
                                            onChange={handleUserNameChange}
                                            label={
                                                <span>
                                                    User Name <span style={{ color: 'red' }}>*</span>
                                                </span>
                                            }
                                            size="small"
                                            error={!!userNameError}
                                            helperText={userNameError}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            fullWidth
                                            variant='outlined'
                                            type='text'
                                            id='phoneNumber'
                                            name='phoneNumber'
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            label='Phone Number'
                                            size="small"
                                            error={!!phoneNumberError}
                                            helperText={phoneNumberError}
                                            autoComplete="off"
                                        />
                                        <FormControl fullWidth variant='outlined'>
                                            <TextField
                                                id='validFrom'
                                                name='validFrom'
                                                type='date'
                                                value={validFrom}
                                                onChange={handleValidFromChange}
                                                label='Valid From'
                                                variant='outlined'
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormControl fullWidth variant='outlined'>
                                            <TextField
                                                id='validTo'
                                                name='validTo'
                                                type='date'
                                                value={validTo}
                                                onChange={handleValidToChange}
                                                label='Valid To'
                                                variant='outlined'
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <TextField
                                            fullWidth
                                            variant='outlined'
                                            type={showPassword ? 'text' : 'password'}
                                            id='password'
                                            name='password'
                                            value={password}
                                            onChange={handlePasswordChange}
                                            label={
                                                <span>
                                                    Password <span style={{ color: 'red' }}>*</span>
                                                </span>
                                            }
                                            size="small"
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
                                            error={!!passwordError}
                                            helperText={passwordError}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            fullWidth
                                            variant='outlined'
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id='confirmPassword'
                                            name='confirmPassword'
                                            value={confirmPassword}
                                            size="small"
                                            onChange={handleConfirmPasswordChange}
                                            autoComplete="off"
                                            label={
                                                <span>
                                                    Confirm Password <span style={{ color: 'red' }}>*</span>
                                                </span>
                                            }
                                            error={
                                                !isPasswordValid &&
                                                confirmPassword !== '' &&
                                                password !== confirmPassword
                                                && !!confirmPasswordError
                                            }
                                            helperText={
                                                !isPasswordValid &&
                                                    confirmPassword !== '' &&
                                                    password !== confirmPassword
                                                    ? "Passwords don't match"
                                                    : ''
                                                    && confirmPasswordError
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isSuperUser}
                                                    onChange={handleIsSuperUserChange}
                                                    name="isSuperUser"
                                                />
                                            }
                                            label="Super User"
                                        />

                                    </div>
                                </form>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '3%' }}>
                                    <button className='btn btn-primary' type='submit' onClick={onSubmitAddEmployee} disabled={!isPasswordValid}>
                                        Submit
                                    </button>  &nbsp;
                                    <button className='btn btn-primary' type='button' onClick={handleClose}>
                                        Close
                                    </button>
                                </div>
                                <br></br>
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default AddEmp;