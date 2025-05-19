import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import Header from '../../layouts/header/header';
import { CardContent, Grid, TextField, Box, Slider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { searchIdentify } from '../../data/services/pep/searchIdentify/searchIdentify_payload';
import { Identifieds } from '../../data/services/pep/Identify/Identify_payload';
import IdentifyApiService from '../../data/services/pep/Identify/Identify_api_service';
import searchIdentifyApiService from '../../data/services/pep/searchIdentify/searchIdentify_api_service';

function ManagerSearch() {

    const navigate = useNavigate();
    const [data, setData] = useState<searchIdentify[]>([]);
    const { pepId } = useParams<{ pepId: string }>();
    const [identifies, setIdentifies] = useState<Identifieds[]>([]);
    const [name, setName] = useState<string>('');
    const [uid, setUid] = useState<string>('');
    const identifyApiService = new IdentifyApiService();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [sliderValue, setSliderValue] = useState<number>(100);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        try {
            setLoading(true);
            const apiService = new IdentifyApiService();
            const response = await apiService.getIdentify(name);
            setIdentifies(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        search();
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    const fetchData = async () => {
        try {
            const apiService = new searchIdentifyApiService();
            const response = await apiService.getSearchIdentify(loginDetails.id);
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    const handleEditClick = (pepId: string) => {
        const uid = loginDetails.id;
        console.log('Clicked row with uid:', uid, 'and pepId:', pepId);
        navigate(`/ViewDesign/${pepId}/${uid}`);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 10 }}>
                    <Card border='10px' >
                        <CardContent>
                            <Form>
                                <Row>
                                    <Col xs={4}>
                                        <Form.Group>
                                            <Row>
                                                <Col>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Name"
                                                        variant="outlined"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        onKeyPress={handleKeyPress}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Grid item xs={2}>
                                                        <Slider
                                                            style={{ width: '90%' }}
                                                            value={sliderValue}
                                                            onChange={(e, newValue) => setSliderValue(newValue as number)}
                                                            aria-labelledby="discrete-slider"
                                                            step={1}
                                                            marks
                                                            min={50}
                                                            max={100}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField
                                                            style={{ width: '55px' }}
                                                            id="max-score"
                                                            size='small'
                                                            variant="outlined"
                                                            type="text"
                                                            name="maxScore"
                                                            autoComplete="off"
                                                            value={sliderValue.toString()}
                                                            onChange={(e) => setSliderValue(parseInt(e.target.value))}
                                                        />
                                                    </Grid>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={4}>
                                        <Grid item xs={12}>
                                            <Grid xs={3}>
                                                <Button variant="primary" style={{ marginTop: '2%' }} onClick={handleSearchClick}>
                                                    Search
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Col>
                                </Row>
                            </Form>
                            <table className="table report-table">
                                <thead>
                                    <tr>
                                        <th>Sl no</th>
                                        <th>Name</th>
                                        <th>SourceLink</th>
                                        <th>DOB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {identifies.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: 'center' }}>
                                                No data available
                                            </td>
                                        </tr>
                                    ) : (
                                        identifies.map((item, index) => (
                                            <tr key={index} onClick={() => handleEditClick(String(item.pepId))}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>
                                                    <a href={item.sourceLink} target="_blank" rel="noopener noreferrer">
                                                        {item.sourceLink}
                                                    </a>
                                                </td>
                                                <td>{item.dob}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default ManagerSearch;