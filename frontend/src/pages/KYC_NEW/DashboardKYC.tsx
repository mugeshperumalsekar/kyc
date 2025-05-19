import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from '../../layouts/header/header';
import { Box, Grid, Avatar, Typography } from '@mui/material';
import sanctionImage from '../../../src/assets/sanction.png';
import cmsImage from '../../../src/assets/cms.png';
import client from '../../assets/client.webp';
import aaml from '../../../src/assets/aaml.png';
import bank from '../../../src/assets/bank.jpg';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const DashboardKYC = () => {
    const navigate = useNavigate();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const handleClientClick = () => {
        navigate('/From');
    };

    const handleBankClick = () => {
        navigate('/BankReport');
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container style={{ maxWidth: 'none', backgroundColor: 'white' }}>
                        <Box m={2}>

                            <div className="d-flex justify-content-center">
                                <div>
                                    <div className="card-body">
                                        <Grid container spacing={3} style={{ margin: '20px' }}>

                                            {loginDetails.id === 2 && (
                                                <Grid item sm={6}>
                                                    <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                        <Avatar alt="Client form" src={client} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handleClientClick} />
                                                        <Typography onClick={handleClientClick} style={{ cursor: 'pointer' }}>Client form</Typography>
                                                    </Card>
                                                </Grid>
                                            )}

                                            {loginDetails.id === 3 && (
                                                <Grid item sm={6}>
                                                    <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                        <Avatar alt="NPCI Review" src={bank} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handleBankClick} />
                                                        <Typography onClick={handleBankClick} style={{ cursor: 'pointer' }}>NPCI Review</Typography>
                                                    </Card>
                                                </Grid>
                                            )}
                                            {loginDetails.id === 1 && (
                                                <>
                                                    <Grid item sm={6}>
                                                        <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                            <Avatar alt="Client form" src={client} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handleClientClick} />
                                                            <Typography onClick={handleClientClick} style={{ cursor: 'pointer' }}>Client form</Typography>
                                                        </Card>
                                                    </Grid>

                                                    <Grid item sm={6}>
                                                        <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                            <Avatar alt="NPCI Review" src={bank} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handleBankClick} />
                                                            <Typography onClick={handleBankClick} style={{ cursor: 'pointer' }}>NPCI Review</Typography>
                                                        </Card>
                                                    </Grid>
                                                </>
                                            )}

                                            {(loginDetails.id !== 2 && loginDetails.id !== 3 && loginDetails.id !== 1) && (
                                                <Grid item sm={6}>
                                                    <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                        <Typography>No content available</Typography>
                                                    </Card>
                                                </Grid>
                                            )}

                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
}

export default DashboardKYC;
