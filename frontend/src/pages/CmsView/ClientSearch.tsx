import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Spinner } from 'react-bootstrap';
import Header from '../../layouts/header/header';
import { CardContent, Grid, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
import { Identifieds } from '../../data/services/Identify/Identify_payload';
import { useSelector } from 'react-redux';
import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';
import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, TableRow, TableCell, TableBody, TableHead ,Box} from '@mui/material';
import { RecordTypeData } from '../../data/services/Search/search-payload';
import SearchService from '../../data/services/Search/search-api-service';

interface CategoryName {
    name: string;
    id: string;
}

interface Entity {
    [x: string]: string | number;
    cmsId: number;
    userName: string;
    cmsName: string;
    sourceLink: string;
    genderId: number;
}

interface Individual {
    [x: string]: string | number;
    cmsId: number;
    userName: string;
    cmsName: string;
    sourceLink: string;
    genderId: number;
}

interface Ship {
    cmsId: number;
    userName: string;
    cmsName: string;
    sourceLink: string;
    genderId: number;
}

interface Aircraft {
    cmsId: number;
    userName: string;
    appointmentDate: string;
    cmsName: string;
    sourceLink: string;
    genderId: number;
}

function Identify() {
    const navigate = useNavigate();
    const [data, setData] = useState<searchIdentify[]>([]);
    const { cmsId } = useParams<{ cmsId: string }>();
    const [identifies, setIdentifies] = useState<Identifieds[]>([]);
    const [name, setName] = useState<string>('');
    const [uid, setUid] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const identifyApiService = new IdentifyApiService();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
    const [Entity, setEntity] = useState<Entity[]>([]);
    const [Individual, setIndividual] = useState<Individual[]>([]);
    const [Ship, setShip] = useState<Ship[]>([]);
    const [Aircraft, setAircraft] = useState<Aircraft[]>([]);
    const [selectedcategoryName, setSelectedcategoryName] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<{ entity: string, name: string }>({ entity: '', name: '' });
    const [RecordType, setRecordType] = useState<RecordTypeData[]>([]);
    const [selectedRecordType, setSelectedRecordType] = useState<string>('');

    useEffect(() => {
        fetchRecordType();
    }, []);

    const handleAddClick = () => {
        navigate(`/details`);
    };

    useEffect(() => {
        setValidationErrors((prevErrors) => ({
            entity: selectedcategoryName ? '' : prevErrors.entity,
            name: name ? '' : prevErrors.name
        }));
    }, [selectedcategoryName, name]);

    const handlecategoryNameChange = (event: SelectChangeEvent<string>) => {
        setSelectedcategoryName(event.target.value);
    };

    const handleEditClick = (cmsId: string, recordTypeId: string) => {
        const uid = loginDetails.id;
        let route: string;
        switch (parseInt(recordTypeId)) {
            case 1:
                route = 'Client';
                break;
            case 2:
                route = 'ClientIndividualview';
                break;
            case 3:
                route = 'Clientship';
                break;
            case 4:
                route = 'ClientAircraftview';
                break;
            default:
                route = '';
        }
        navigate(`${route}/${cmsId}/${uid}/${recordTypeId}`);
    };

    const handleSearchClick = async () => {
        try {
            setLoading(true);
            setSearchPerformed(true);
            if (!selectedRecordType) {
                setValidationErrors((prevErrors) => ({ ...prevErrors, entity: 'Record Type is required' }));
                setLoading(false);
                return;
            }
            if (!name) {
                setValidationErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
                setLoading(false);
                return;
            }
            setValidationErrors({ entity: '', name: '' });
            switch (selectedRecordType) {
                case '1':
                    setEntity([]);
                    await fetchEntity();
                    break;
                case '2':
                    setIndividual([]);
                    await fetchIndividual();
                    break;
                case '3':
                    setShip([]);
                    await fetchShip();
                    break;
                case '4':
                    setAircraft([]);
                    await fetchAircraft();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEntity = async () => {
        try {
            const entityResults = await identifyApiService.getEntity(name);
            setEntity(Array.isArray(entityResults) ? entityResults : []);
        } catch (error) {
            console.error('Error fetching Entity:', error);
        }
    };

    function getgenderName(genderId: number) {
        switch (genderId) {
            case 1:
                return 'Male';
            case 2:
                return 'Female';
            case 3:
                return 'Others';
        }
    };

    const fetchIndividual = async () => {
        try {
            const individualResults = await identifyApiService.getIndividuals(name);
            setIndividual(Array.isArray(individualResults) ? individualResults : []);
        } catch (error) {
            console.error('Error fetching Individual:', error);
        }
    };

    const fetchShip = async () => {
        try {
            const shipResults = await identifyApiService.getShip(name);
            setShip(Array.isArray(shipResults) ? shipResults : []);
        } catch (error) {
            console.error('Error fetching Ship:', error);
        }
    };

    const fetchAircraft = async () => {
        try {
            const aircraftResults = await identifyApiService.getAircraft(name);
            setAircraft(Array.isArray(aircraftResults) ? aircraftResults : []);
        } catch (error) {
            console.error('Error fetching Aircraft:', error);
        }
    };

    const handleRecordTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedRecordType(value);
    };

    const recordtype = new SearchService();

    const fetchRecordType = async () => {
        try {
            const recordtypes = await recordtype.getRecoredType();
            setRecordType(recordtypes);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    return (
        <>
         <Box sx={{display:'flex'}}>
            <h4 style={{ marginTop: '6%', marginLeft: '2%' }}></h4>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Box m={8}>
            <Card border='10px' style={{ margin: '2%' }}>
                <CardContent>
                    <Container fluid>
                        <Form>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Form.Group>
                                        <Row>
                                            <Col>
                                                <FormControl style={{ width: '100%' }}>
                                                    <InputLabel htmlFor="record-type">Record Type</InputLabel>
                                                    <Select
                                                        label="Record Type"
                                                        variant="outlined"
                                                        value={selectedRecordType}
                                                        onChange={handleRecordTypeChange}
                                                    >
                                                        {RecordType.map((item) => (
                                                            <MenuItem key={item.id} value={item.id.toString()}>
                                                                {item.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                            <Col>
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Name"
                                                    variant="outlined"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                        setNameError('');
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSearchClick();
                                                        }
                                                    }}
                                                />
                                                {validationErrors.name && (
                                                    <p style={{ color: 'red' }}>
                                                        {validationErrors.name}
                                                    </p>
                                                )}
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Button type="button" variant="primary" style={{ marginTop: '2%' }} onClick={handleSearchClick}>
                                        Search
                                    </Button>
                                    <Button variant="primary" style={{ marginTop: '2%', marginLeft: '3%' }} onClick={handleAddClick}>
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        {/* {searchPerformed && !loading && (Entity.length > 0 || Individual.length > 0 || Ship.length > 0 || Aircraft.length > 0) ? (
                            <Card border='10px' style={{ margin: '2%' }}>
                                <CardContent>
                                    {loading && (
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    )}
                                    {Entity.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>cmsName</TableCell>
                                                    <TableCell>Source Link</TableCell>
                                                    <TableCell>gender</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Entity.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                        <TableCell>{result.userName}</TableCell>
                                                        <TableCell>{result.cmsName}</TableCell>
                                                        <td>
                                                            <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {result.sourceLink}
                                                            </a>
                                                        </td>
                                                        <TableCell>{result.genderId}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {Individual.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>cmsName</TableCell>
                                                    <TableCell>Source Link</TableCell>
                                                    <TableCell>gender</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Individual.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                        <TableCell>{result.userName}</TableCell>
                                                        <TableCell>{result.cmsName}</TableCell>
                                                        <td>
                                                            <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {result.sourceLink}
                                                            </a>
                                                        </td>
                                                        <TableCell>{result.genderId}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {Ship.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>cmsName</TableCell>
                                                    <TableCell>Source Link</TableCell>
                                                    <TableCell>gender</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Ship.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                        <TableCell>{result.userName}</TableCell>
                                                        <TableCell>{result.cmsName}</TableCell>
                                                        <td>
                                                            <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {result.sourceLink}
                                                            </a>
                                                        </td>
                                                        <TableCell>{result.genderId}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {Aircraft.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>cmsName</TableCell>
                                                    <TableCell>Source Link</TableCell>
                                                    <TableCell>gender</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Aircraft.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                        <TableCell>{result.userName}</TableCell>
                                                        <TableCell>{result.cmsName}</TableCell>
                                                        <td>
                                                            <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {result.sourceLink}
                                                            </a>
                                                        </td>
                                                        <TableCell>{result.genderId}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {Entity.length === 0 && Individual.length === 0 && (
                                        <p style={{ textAlign: 'center' }}>No data available.</p>
                                    )}
                                </CardContent>

                            </Card>
                        ) : (
                            searchPerformed && !loading && (
                                (selectedcategoryName && name) ? (
                                    (validationErrors.entity || validationErrors.name) ? (
                                        <p style={{ textAlign: 'center', color: 'red' }}>
                                            {validationErrors.entity || validationErrors.name}
                                        </p>
                                    ) : (
                                        <p style={{ textAlign: 'center' }}>No data available.</p>
                                    )
                                ) : null
                            )
                        )} */}
                        {searchPerformed && !loading && (
                            <>
                                {selectedRecordType === '1' && Entity.length > 0 && (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>UserName</TableCell>
                                                <TableCell>cmsName</TableCell>
                                                <TableCell>Source Link</TableCell>
                                                <TableCell>gender</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Entity.map((result, index) => (
                                                <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                    <TableCell>{result.userName}</TableCell>
                                                    <TableCell>{result.cmsName}</TableCell>
                                                    <td>
                                                        <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                            {result.sourceLink}
                                                        </a>
                                                    </td>
                                                    <TableCell>
                                                        {result.genderId ? getgenderName(result.genderId) : '-'}
                                                    </TableCell>                                                  </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                {selectedRecordType === '2' && Individual.length > 0 && (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>UserName</TableCell>
                                                <TableCell>cmsName</TableCell>
                                                <TableCell>Source Link</TableCell>
                                                <TableCell>gender</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Individual.map((result, index) => (
                                                <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                    <TableCell>{result.userName}</TableCell>
                                                    <TableCell>{result.cmsName}</TableCell>
                                                    <td>
                                                        <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                            {result.sourceLink}
                                                        </a>
                                                    </td>
                                                    <TableCell>
                                                        {result.genderId ? getgenderName(result.genderId) : '-'}
                                                    </TableCell>                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                {selectedRecordType === '3' && Ship.length > 0 && (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>UserName</TableCell>
                                                <TableCell>cmsName</TableCell>
                                                <TableCell>Source Link</TableCell>
                                                <TableCell>gender</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Ship.map((result, index) => (
                                                <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                    <TableCell>{result.userName}</TableCell>
                                                    <TableCell>{result.cmsName}</TableCell>
                                                    <td>
                                                        <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                            {result.sourceLink}
                                                        </a>
                                                    </td>
                                                    <TableCell>
                                                        {result.genderId ? getgenderName(result.genderId) : '-'}
                                                    </TableCell>                                                  </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                {selectedRecordType === '4' && Aircraft.length > 0 && (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>UserName</TableCell>
                                                <TableCell>cmsName</TableCell>
                                                <TableCell>Source Link</TableCell>
                                                <TableCell>gender</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Aircraft.map((result, index) => (
                                                <TableRow key={index} onClick={() => handleEditClick(result.cmsId.toString(), selectedRecordType)}>
                                                    <TableCell>{result.userName}</TableCell>
                                                    <TableCell>{result.cmsName}</TableCell>
                                                    <td>
                                                        <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                            {result.sourceLink}
                                                        </a>
                                                    </td>
                                                    <TableCell>
                                                        {result.genderId ? getgenderName(result.genderId) : '-'}
                                                    </TableCell>                                                  </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                {/* Check if no data available */}
                                {Entity.length === 0 && Individual.length === 0 && Ship.length === 0 && Aircraft.length === 0 && (
                                    <p style={{ textAlign: 'center' }}>No data available.</p>
                                )}
                            </>
                        )}
                    </Container>
                </CardContent>
            </Card>
            </Box>
            </Box>
            </Box>
        </>
    );
}

export default Identify;