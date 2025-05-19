import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/header/header';
import { Box, Grid, Avatar, Typography } from '@mui/material';
import Container from 'react-bootstrap/Container';
import { Card } from 'react-bootstrap';
import sanctionImage from '../../../src/assets/sanction.png';
import cmsImage from '../../../src/assets/cms.png';
import pepImage from '../../../src/assets/pep.jpg';

const ScreeningDetails = () => {

    const navigate = useNavigate();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const handlePepClick = () => {
        navigate('/pepSearchDetails');
    };

    const handleCmsClick = () => {
        navigate('/cmsSearchDetails');
    };

    const handleSanClick = () => {
        navigate('/SancSearchDetails');
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container style={{ maxWidth: 'none', backgroundColor: 'white' }}>
                        <Box m={2}>
                            {/* <h4>DASHBOARD</h4> */}
                            <div className="d-flex justify-content-center">
                                <div>
                                    <div className="card-body">
                                        <Grid container spacing={3} style={{ margin: '20px' }}>
                                            {/* {loginDetails.id === 2 && (
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
                                            )} */}
                                            {loginDetails.id === 1 && (
                                                <>
                                                    <Grid item sm={4}>
                                                        <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                            <Avatar alt="pepForm" src={pepImage} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handlePepClick} />
                                                            <Typography onClick={handlePepClick} style={{ cursor: 'pointer' }}>Pep Search Details</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item sm={4}>
                                                        <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                            <Avatar alt="CmsForm" src={cmsImage} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handleCmsClick} />
                                                            <Typography onClick={handleCmsClick} style={{ cursor: 'pointer' }}>Cms Search Details</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item sm={4}>
                                                        <Card style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                            <Avatar alt="SanctionForm" src={sanctionImage} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onClick={handleSanClick} />
                                                            <Typography onClick={handleSanClick} style={{ cursor: 'pointer' }}>sanction Search Details</Typography>
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

export default ScreeningDetails