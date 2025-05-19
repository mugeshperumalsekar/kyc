import React from 'react';
import Container from 'react-bootstrap/Container';

import { Box, Grid, Avatar, Typography } from '@mui/material';
import sanctionImage from '../../../src/assets/sanction.png';
import fraud1 from '../../../src/assets/fraud1.png';
import pepImage from '../../../src/assets/pep.jpg';
import counter from '../../../src/assets/counter.png';
import aml from '../../../src/assets/aml.webp';
import scam1 from '../../../src/assets/scam1.png';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Header from '../../../layouts/header/header';

function Aml() {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container style={{ maxWidth: 'none', backgroundColor: 'white' }}>
                        <Box m={2}>
                            {/* <h4>DASHBOARD</h4> */}
                            <div className="d-flex justify-content-center">
                                <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%', margin: '1%' }}>
                                    <div className="card-body">

                                        <Grid container spacing={2} style={{ margin: '20px' }}>
                                            <Grid item sm={12} >
                                                <p>Pending Task :</p>
                                            </Grid>
                                            <Grid item sm={12} >
                                                <p>Bank Replay Task :</p>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default Aml