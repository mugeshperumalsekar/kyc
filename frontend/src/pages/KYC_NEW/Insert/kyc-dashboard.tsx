import { Avatar, Box, Grid, Typography } from "@mui/material";
import { Button, Card, Container } from "react-bootstrap";
import Header from "../../../layouts/header/header";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import client from '../../../assets/client.webp';
import bank from '../../../assets/bank.jpg';
import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
import { useEffect, useState } from "react";

const KycDashboard = () => {
    
    const applicationFormService = new ApplicationfromeService();
    const navigate = useNavigate();
    const { state } = useLocation();
    const accountId = state.id;
    const [applicationTypes, setApplicationTypes] = useState<any[]>([]);

    const handleClientClick = (applicationTypeId:any) => {
        navigate('/From', { state: { accountTypeId: accountId, applicationTypeId:applicationTypeId } });
    };

    const fetchApplicationType = async () => {
        try {
            const res = await applicationFormService.getType();
            setApplicationTypes(res);
        } catch (error) {
            console.error("Error fetching application types:", error);
        }
    };

    
    useEffect(() => {
        fetchApplicationType();
        sessionStorage.setItem('declarationId', '');
        sessionStorage.setItem('responseId', '');
    }, []);

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
                                        {applicationTypes && applicationTypes.map((item, idx) =>  (
                                                <>
                                                    <Grid item sm={6} >
                                                        <Card onClick={() => { handleClientClick(item.id)}} style={{ padding: '9%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', alignItems: 'center', width: '275px' }}>
                                                            <Avatar alt="Client form" src={client} style={{ width: '100px', height: '100px', cursor: 'pointer' }} />
                                                            <Typography  style={{ cursor: 'pointer' }}> {item.name}</Typography>
                                                        </Card>
                                                    </Grid>
                                                </>
                                            ) )}
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

export default KycDashboard;
