import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Grid, Typography, Card, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Header from '../../../layouts/header/header';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { Type, ApplicationQuestion, AccountType, Answertype } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';

function ApplicationForm() {

    const [inputValue, setInputValue] = useState<ApplicationQuestion>({
        id: 0,
        name: '',
        accountTypeId: 0,
        applicationTypeId: 0,
        ansTypeId: 1,
        nameField: 0,
        orderNo: 0,
        multiQuestion: 0,
        description: ''
    });

    const [typeOptions, setTypeOptions] = useState<Type[]>([]);
    const [accountTypeOptions, setAccountTypeOptions] = useState<AccountType[]>([]);
    const [answerOptions, setAnswerOptions] = useState<Answertype[]>([]);

    useEffect(() => {
        fetchType();
        fetchAnswer();
    }, []);

    useEffect(() => {
        if (inputValue.applicationTypeId !== 0) {
            fetchAccountType(inputValue.applicationTypeId);
        }
    }, [inputValue.applicationTypeId]);

    const fetchType = async () => {
        try {
            const recordtypes = await applicationfrome.getType();
            setTypeOptions(recordtypes);
        } catch (error) {
            console.error("Error fetching application types:", error);
        }
    };

    const fetchAccountType = async (applicationTypeId: number) => {
        try {
            const recordtypes = await applicationfrome.getappliction(applicationTypeId);
            setAccountTypeOptions(recordtypes);
        } catch (error) {
            console.error("Error fetching account types:", error);
        }
    };

    const fetchAnswer = async () => {
        try {
            const recordtypes = await applicationfrome.getAnswer();
            setAnswerOptions(recordtypes);
        } catch (error) {
            console.error("Error fetching answer types:", error);
        }
    };

    const applicationfrome = new ApplicationfromeService();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputValue(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleApplicationTypeChange = (event: SelectChangeEvent<number>) => {
        const applicationTypeId = event.target.value as number;
        setInputValue(prevState => ({
            ...prevState,
            applicationTypeId,
            accountTypeId: 0
        }));
    };

    const handleAccountTypeChange = (event: SelectChangeEvent<number>) => {
        const accountTypeId = event.target.value as number;
        setInputValue(prevState => ({
            ...prevState,
            accountTypeId
        }));
    };

    const handleAnswerChange = (event: SelectChangeEvent<number>) => {
        const ansTypeId = event.target.value as number;
        setInputValue(prevState => ({
            ...prevState,
            ansTypeId
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await applicationfrome.Appliactionquest(inputValue);
            console.log('Form submitted successfully:', response);
            console.log('Question:', inputValue);
            // if (response && response.id) {
            //     sessionStorage.setItem('responseId', response.id);
            // }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Typography variant="h6">Question</Typography>
                            <br />
                            <Grid container spacing={3}>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel id="application-type-label">Application Type</InputLabel>
                                        <Select
                                            labelId="application-type-label"
                                            label='Application Type'
                                            size='small'
                                            value={inputValue.applicationTypeId}
                                            onChange={handleApplicationTypeChange}
                                        >
                                            {typeOptions.map(type => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel id="account-type-label">Account Type</InputLabel>
                                        <Select
                                            labelId="account-type-label"
                                            label='Account Type'
                                            size='small'
                                            value={inputValue.accountTypeId || ''}
                                            onChange={handleAccountTypeChange}
                                            disabled={accountTypeOptions.length === 0}
                                        >
                                            {accountTypeOptions.map(accountType => (
                                                <MenuItem key={accountType.id} value={accountType.id}>
                                                    {accountType.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel id="answer-type-label">Answer Type</InputLabel>
                                        <Select
                                            labelId="answer-type-label"
                                            label='Answer Type'
                                            size='small'
                                            value={inputValue.ansTypeId}
                                            onChange={handleAnswerChange}
                                        >
                                            {answerOptions.map(answer => (
                                                <MenuItem key={answer.id} value={answer.id}>
                                                    {answer.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField style={{ marginTop: '-0.5%' }}
                                        label="Enter Name"
                                        variant="outlined"
                                        name="name"
                                        size='small'
                                        value={inputValue.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ApplicationForm;