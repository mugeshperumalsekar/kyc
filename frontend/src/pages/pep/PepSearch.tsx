import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { Slider } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewService from '../../data/services/viewpage/view_api_service';
import { Country, List, Program, All, Customer, CustomerRequest, Address, IdentificationData, AliasesData, PlaceOfBirthData, NationalityData, Birthdate, DetailsData, SearchDTO } from '../../data/services/viewpage/view_payload';
import { RecordDTO } from '../../data/services/pep/viewpage/viewpagedetails-payload';
import ViewPageDetailsService from '../../data/services/pep/viewpage/viewpagedetails-api-service';
import { useSelector } from 'react-redux';

function PepSearch() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const location = useLocation();
    const { id, ids, uid } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RecordDTO>({
        id: 0,
        name: '',
        dob: '',
        placeOfBirth: '',
        pan: '',
        directorsIdentificationNumber: '',
        score: 0,
    });

    const [selectedRecordType, setSelectedRecordType] = useState(0);
    const [Program, setProgram] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [List, setList] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState(0);
    const [country, setCountry] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [filteredData, setFilteredData] = useState<RecordDTO[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(100);
    const [data, setData] = useState<RecordDTO[]>([]);
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const customer = new ViewPageDetailsService();

    useEffect(() => {
    }, [id]);

    const handleRecordTypeChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedRecordType(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleListChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedList(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleCountryChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedCountry(typeof value === 'string' ? parseInt(value) : value);
    };

    const handleKeyPress = (e: { key: string }) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSort = (columnName: string) => {
        if (columnName === sortedColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(columnName);
            setSortDirection('asc');
        }
    };

    const sortedData = (filteredData ?? []).length > 0 ? filteredData.sort((a, b) => {
        const valueA = String(a[sortedColumn as keyof RecordDTO]);
        const valueB = String(b[sortedColumn as keyof RecordDTO]);
        if (valueA && valueB) {
            return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return 0;
        }
    }) : [];

    const [loading, setLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        try {
            setLoading(true);
            if (!formData.name && !formData.dob && sliderValue === 100) {
                setSearchError(true);
                setFilteredData([]);
                setLoading(false);
                return;
            }
            const searchDTO: SearchDTO = {
                name: formData.name,
                matching_score: sliderValue,
                listID: selectedList,
                partySubTypeID: selectedRecordType,
                countryId: selectedCountry,
            };
            const filtered = await customer.getsearchDTOpep(searchDTO);
            console.log('Filtered Data:', filtered);
            if (Array.isArray(filtered) && filtered.length > 0) {
                setFilteredData(filtered);
                setSearchError(false);
            } else {
                setSearchError(true);
                setFilteredData([]);
            }
        } catch (error) {
            console.error("Error fetching lookup data:", error);
            setSearchError(true);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({ id: 0, name: '', dob: '', placeOfBirth: '', pan: '', directorsIdentificationNumber: '', score: 0 });
        setFilteredData([]);
        setSliderValue(100);
        setSearchError(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleTableRowClick = (ids: number,) => {
        const uid = loginDetails.id;
        const id = String(ids);
        navigate(`/ViewDesign/${id}/${uid}`);
    };

    const exportToExcel = () => {
        try {
            const dataForExport = filteredData.map((row) => ({
                Name: row.name,
                Address: row.dob,
                Type: row.placeOfBirth,
                Program: row.pan,
                List: row.directorsIdentificationNumber,
                Score: row.score
            }));
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(dataForExport);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lookup Results");
            XLSX.writeFile(workbook, "lookup_results.xlsx");
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className="card-body" style={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>SEARCH</h4>
                                    <Button variant="contained" color="primary" onClick={handlePrint}>
                                        <PrintIcon />
                                    </Button>
                                </div>
                                <br></br>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <br></br>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={2}>
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Name"
                                                id="Name"
                                                size='small'
                                                variant="outlined"
                                                type="text"
                                                name="name"
                                                autoComplete="off"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </Grid>
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
                                        <Grid item xs={4}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={5}>
                                                    <Button variant="contained" onClick={handleSearch} onKeyPress={handleKeyPress} >Search</Button>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Button variant="contained" onClick={handleReset}>Reset</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br></br>
                                </Card>
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>SEARCH RESULTS {filteredData.length > 0 && `(${filteredData.length})`}</h4>
                                    <Button
                                        variant="contained"
                                        onClick={exportToExcel}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        <FileDownloadIcon />
                                    </Button>
                                </div>
                                <br></br>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid item xs={12}>
                                        <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('name')}>
                                                            Name {sortedColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('address')}>
                                                            Date of Birth {sortedColumn === 'dob' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('typeId')}>
                                                            Place Of Birth {sortedColumn === 'placeOfBirth' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('programId')}>
                                                            Pan {sortedColumn === 'pan' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('listId')}>
                                                            Directors Identification Number {sortedColumn === 'directorsIdentificationNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} onClick={() => handleSort('score')}>
                                                            Score {sortedColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {loading && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center">
                                                                <Typography variant="body1">Loading...</Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}

                                                    {!loading && filteredData.length > 0 && filteredData.map((row) => (
                                                        <TableRow key={row.id} onClick={() => handleTableRowClick(row.id)}>
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.dob}</TableCell>
                                                            <TableCell>{row.placeOfBirth}</TableCell>
                                                            <TableCell>{row.pan}</TableCell>
                                                            <TableCell>{row.directorsIdentificationNumber}</TableCell>
                                                            <TableCell>{row.score}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {searchError && (
                                                        <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                            {filteredData.length === 0 ? "Your search has not returned any results." : "At least one search parameter is required."}
                                                        </Typography>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Card>
                            </div>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default PepSearch;