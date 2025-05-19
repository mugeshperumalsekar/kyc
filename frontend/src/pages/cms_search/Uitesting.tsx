import React, { useState, ChangeEvent } from 'react';
import { Box, TextField, Button, Grid, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Header from '../../layouts/header/header';
import ViewService from '../../data/services/san_search/viewpage/view_api_service';
import { UiSearchDTO, UiRecordDTO } from '../../data/services/san_search/viewpage/view_payload';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function Uitesting() {
    const [searchResults, setSearchResults] = useState<UiRecordDTO[]>([]);
    const [searchParams, setSearchParams] = useState<UiSearchDTO>({
        name: '',
        matching_score: 0
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

    const handleSearch = async () => {
        try {
            setLoading(true); 
            const results = await viewservice.getUItect(searchParams);
            console.log('Search results:', results); 
            setSearchResults(results);
            setSearchError(false);
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
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className="card-body">
                                
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Name"
                                            id="Name"
                                            size='small'
                                            variant="outlined"
                                            type="text"
                                            name="name"
                                            value={searchParams.name}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            id="MatchingScore"
                                            size='small'
                                            type="number"
                                            name="matching_score"
                                            label="Matching Score"
                                            variant="outlined"
                                            value={searchParams.matching_score}
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
                                    <h4>UI TESTING RESULTS {searchResults.length > 0 && `(${searchResults.length})`}</h4>

                                    <Button
                                        variant="contained"
                                        onClick={exportToExcel}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        <FileDownloadIcon />
                                    </Button>
                                </div>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid item xs={12}>
                                        <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Name</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Jarow</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Fuzzy Wuzzy Token Sort Ratio</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Set</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Sort</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Cosine Similarity</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Double Metaphone</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Soundex Value</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>Double Metaphone JW</TableCell>
                                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>N-Gram</TableCell>
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
                                                            <TableCell>{result.name}</TableCell>
                                                            <TableCell>{parseFloat(result.jarow).toFixed(2)}</TableCell>
                                                            <TableCell>{parseInt(result.fuzzy_Wuzzytoken_sort_ratio)}</TableCell>
                                                            <TableCell>{parseInt(result.set)}</TableCell>
                                                            <TableCell>{parseInt(result.sort)}</TableCell>
                                                            {/* <TableCell>{parseFloat(result.cosine_Similarity).toFixed(1)}</TableCell>  */}
                                                            <TableCell>{parseInt(result.cosine_Similarity)}</TableCell>

                                                            <TableCell>{parseInt(result.double_Metaphone)}</TableCell>
                                                            <TableCell>{parseInt(result.soundex_val)}</TableCell>
                                                            <TableCell>{parseInt(result.double_Metaphone_jw)}</TableCell>
                                                            <TableCell>{parseInt(result.n_Gram)}</TableCell>

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

export default Uitesting;

