
import React, { useState, ChangeEvent } from 'react';
import { Box, TextField, Button, Grid, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Header from '../../layouts/header/header';
import ViewService from '../../data/services/cms_search/viewpage/view_api_service';
import { uiSearchDtoVerify, uiReciveRecord } from '../../data/services/cms_search/viewpage/view_payload';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function Search() {
    const [searchResults, setSearchResults] = useState<uiReciveRecord[]>([]);
    const [searchParams, setSearchParams] = useState<uiSearchDtoVerify>({
        firstName: '',
        secondName: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<boolean>(false);

    const viewservice = new ViewService();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    // const handleSearch = async () => {
    //     try {
    //         setLoading(true);
    //         const results = await viewservice.getUItectsearch(searchParams);
    //         console.log('Search results:', results);
    //         setSearchResults(results);
    //         setSearchError(false);
    //     } catch (error) {
    //         console.error('Error fetching search results:', error);
    //         setSearchResults([]);
    //         setSearchError(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSearch = async () => {
        try {
            setLoading(true);
            const results = await viewservice.getUItectsearch(searchParams);
            console.log('Search results:', results);
            setSearchResults(results);
            setSearchError(false);
            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
            setSearchError(true);
        } finally {
            setLoading(false);
        }
    };
    
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(searchResults);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "search_results.xlsx");
    };

    return (
        <>
<Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'auto' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box m={2} style={{ marginTop: '5%', marginBottom: '5%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className="card-body">

                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item xs={4}>
                                        <TextField
                                            label="First Name"
                                            id="First Name"
                                            size='small'
                                            variant="outlined"
                                            type="text"
                                            name="firstName"
                                            value={searchParams.firstName}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Second Name"
                                            id="Second Name"
                                            size='small'
                                            variant="outlined"
                                            type="text"
                                            name="secondName"
                                            value={searchParams.secondName}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSearch}
                                            style={{ marginBottom: '1rem' }}
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>


                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>UI TESTING SEARCH RESULTS {searchResults.length > 0 && `(${searchResults.length})`}</h4>

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
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Onesidematching</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Twosidematching</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Joro</TableCell>

                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>FuzzySoundx</TableCell>
                                                        {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>FuzzyWeightRatio </TableCell> */}
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>FuzzyDMCosine</TableCell>

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
                                                    {!loading && searchResults.length > 0 && searchResults.map((result, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{parseFloat(result.onesidematching).toFixed(2)}</TableCell>
                                                            <TableCell>{parseFloat(result.twosidematching).toFixed(2)}</TableCell>
                                                            <TableCell>{result.jaro}</TableCell>
                                                            <TableCell>{result.fuzzySoundx}</TableCell>
                                                            
                                                            <TableCell>{result.fuzzydouble_Metaphone_cosine}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {searchError && (
                                                        <TableRow>
                                                            <TableCell colSpan={10} align="center">
                                                                <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
                                                                    {searchResults.length === 0 ? "Your search has not returned any results." : null}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
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
    );
}

export default Search;

