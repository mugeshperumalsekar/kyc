import { useState, ChangeEvent } from 'react';
import { Box, TextField, Button, Grid, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Header from '../../layouts/header/header';
import { uiSearchDtoVerify } from '../../data/services/san_search/viewpage/view_payload';
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { uiReciveTwoPartRecord } from '../../data/services/san_search/uitestingtwopartrecords/uitestingtwopart_payload';
import UiTestingTwoPartRecordsService from '../../data/services/san_search/uitestingtwopartrecords/uitestingtwopartrecords-api-service';

function TwoPartRecords() {

    const [searchResults, setSearchResults] = useState<uiReciveTwoPartRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<boolean>(false);

    const viewservice = new UiTestingTwoPartRecordsService();

    const [searchParams, setSearchParams] = useState<uiSearchDtoVerify>({
        firstName: '',
        secondName: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const results = await viewservice.getUITwoPartRecords(searchParams);
            console.log('Search results:', results);
            setSearchResults(results);
            setSearchError(false);
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
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                    <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <div>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={4}>
                                    <TextField
                                        label="First Name"
                                        id="First Name"
                                        size='small'
                                        variant="outlined"
                                        type="text"
                                        name="firstName"
                                        InputLabelProps={{ className: 'inputFeild' }}
                                        InputProps={{ className: 'inputFeild' }}
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
                                        InputLabelProps={{ className: 'inputFeild' }}
                                        InputProps={{ className: 'inputFeild' }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSearch}
                                        style={{ marginBottom: '1rem' }}
                                        className='commonButton'
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography className='allHeading'>UI TESTING SEARCH RESULTS {searchResults.length > 0 && `(${searchResults.length})`}</Typography>
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
                                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>One side</strong></TableCell>
                                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Two side </strong></TableCell>
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Jaro-Winkler</strong></TableCell> */}
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Fuzzy Wuzzy WR</strong></TableCell> */}
                                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>SoundX_JW</strong></TableCell>
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Daitch-Mokotoff&JW</strong></TableCell> */}
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Beider-Morse&JW</strong></TableCell> */}
                                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>JW_n</strong></TableCell>
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>JWToken</strong></TableCell> */}
                                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>FWWR</strong></TableCell>
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>FWWRToken</strong></TableCell> */}
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>soundex_WOT_fuzzy</strong></TableCell> */}
                                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>soundex_WOTJW</strong></TableCell> */}
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
                                                        <TableCell>{result.initials}</TableCell>
                                                        <TableCell>{result.twoside}</TableCell>
                                                        {/* <TableCell>{result.jarowinkler}</TableCell>
                                                            <TableCell>{result.fuzzyWuzzyWR}</TableCell> */}
                                                        <TableCell>{result.soundX_JW}</TableCell>
                                                        {/* <TableCell>{result.daitchMokotoffJW}</TableCell>
                                                            <TableCell>{result.beiderMorseJW}</TableCell> */}
                                                        <TableCell>{result.jw_n}</TableCell>
                                                        {/* <TableCell>{result.jwtoken}</TableCell> */}
                                                        <TableCell>{result.fwwr}</TableCell>
                                                        {/* <TableCell>{result.fwwrtoken}</TableCell> */}
                                                        {/* <TableCell>{result.soundex_withouttoken_fuzzy}</TableCell>
                                                        <TableCell>{result.soundex_withouttoken_JW}</TableCell> */}
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
        </>
    );
}

export default TwoPartRecords;