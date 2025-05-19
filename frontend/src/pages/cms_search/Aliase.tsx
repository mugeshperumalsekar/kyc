import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography,Dialog } from '@mui/material';
import { Card } from 'react-bootstrap';
import { SelectChangeEvent } from '@mui/material/Select';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import PrintIcon from '@mui/icons-material/Print';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ViewService from '../../data/services/san_search/viewpage/view_api_service';
import { Address, AliasesData, All, Birthdate, Country, Customer, Program, List, CustomerRequest, DetailsData, IdentificationData, NationalityData, PlaceOfBirthData, SearchDTO } from '../../data/services/san_search/viewpage/view_payload';

function Aliase() {

    const location = useLocation();
    const { ids, id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CustomerRequest>({
        ids: 0,
        name: '',
        address: '',
        program: '',
        entityType: '',
        list: '',
        score: 0,
    });

    const [countryData, setcountryData] = useState<Customer>({
        id: 0,
        city: '',
        State: '',
    });

    const [RecordType, setRecordType] = useState<All[]>([
    ]);

    const viewservice = new ViewService();
    const [selectedRecordType, setSelectedRecordType] = useState<string>('');
    const [Program, setProgram] = useState<Program[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [List, setList] = useState<List[]>([]);
    const [selectedList, setSelectedList] = useState<string>('');
    const [country, setCountry] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [filteredData, setFilteredData] = useState<CustomerRequest[]>([]);
    const [searchError, setSearchError] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(100);
    const [data, setData] = useState<CustomerRequest[]>([
    ]);
    const [address, setaddress] = useState<Address[]>([
    ]);
    const [identification, setIdentification] = useState<IdentificationData[]>([
    ]);
    const [aliases, setAliases] = useState<AliasesData[]>([
    ]);
    const [placeofBirth, setPlaceofBirth] = useState<PlaceOfBirthData[]>([
    ]);
    const [nationality, setNationality] = useState<NationalityData[]>([
    ]);
    const [birthdate, setbirthdate] = useState<Birthdate[]>([
    ]);
    const [details, setdetails] = useState<DetailsData[]>([
    ]);
    const [sortedData, setSortedData] = useState<CustomerRequest[]>([]);
    const [sortedColumn, setSortedColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        fetchCountry();
        fetchList();
        fetchProgram();
        fetchAll();
        fetchAddresses();
        fetchIdentification();
        fetchAliases();
       
        fetchDetails();
    }, [ids]);

    const fetchCountry = async () => {
        try {
            const countryData = await viewservice.getCountryList();
            setCountry(countryData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchList = async () => {
        try {
            const ListData = await viewservice.getList();
            setList(ListData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchProgram = async () => {
        try {
            const ProgramData = await viewservice.getProgram();
            setProgram(ProgramData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAll = async () => {
        try {
            const AllData = await viewservice.getAll();
            setRecordType(AllData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const Address = await viewservice.getAddresses(id);
            setaddress(Address);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const fetchAliases = async () => {
        try {
            const aliases = await viewservice.getAliases(id);
            setAliases(aliases);
        } catch (error) {
            console.error("Error fetching aliases list:", error);
        }
    };

    const fetchIdentification = async () => {
        try {
            const identification = await viewservice.getIdentification(id);
            setIdentification(identification);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const [selectedRow, setSelectedRow] = useState<any>(null);

    const fetchDetails = async () => {
        try {
            const details = await viewservice.getDetails(id);
            setdetails(details);
        } catch (error) {
            console.error("Error fetching the details:", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    return (
        <>
         <Dialog open={showModal} onClose={handleCloseModal} fullScreen
               maxWidth="md">
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={2} style={{ marginTop: '5%' }}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <div className="card-body" >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>DETAILS:</h4>
                                    <Button variant="contained" color="primary" onClick={handlePrint}>
                                        <PrintIcon />
                                    </Button>
                                </div>
                                <br></br>
                                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                    <Grid container spacing={2} justifyContent="space-between">
                                       
                                        <Grid item xs={3}>
                                            {details.slice(0, Math.ceil(details.length / 3)).map((details, index) => (
                                                <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                                            ))}
                                        </Grid>
                                        {/* Middle */}
                                        <Grid item xs={3}>
                                            {details.slice(Math.ceil(details.length / 3), Math.ceil(2 * details.length / 3)).map((details, index) => (
                                                <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                                            ))}
                                        </Grid>
                                        {/* Right side */}
                                        <Grid item xs={3}>
                                            {details.slice(Math.ceil(2 * details.length / 3)).map((details, index) => (
                                                <p key={index}><b>{details.heading} {details.heading.includes(':') ? '' : ':'}</b> {details.val}</p>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Card>
                                <br />
                                {identification.length > 0 && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4>IDENTIFICATIONS:</h4>
                                        </div>
                                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                            <Grid item xs={12}>
                                                <TableContainer>
                                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Type</TableCell>
                                                                <TableCell>ID</TableCell>
                                                                {/* <TableCell>ID</TableCell> */}
                                                                <TableCell>Country</TableCell>
                                                                <TableCell>Issue Date </TableCell>
                                                                {/* <TableCell>Expire Date</TableCell> */}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {identification.map((identification, index) => (
                                                                <TableRow key={identification.type + identification.country + identification.issue_Date} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                    <TableCell>{identification.type}</TableCell>
                                                                    <TableCell>{identification.ids}</TableCell>
                                                                    <TableCell>{identification.country}</TableCell>
                                                                    <TableCell>
                                                                        {identification.issue_Date !== '0000-00-00' ? identification.issue_Date : ''}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </Card>
                                        <br />
                                    </>
                                )}
                                {aliases.filter(alias => alias.aliasesType !== "Name").length > 0 && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4>ALIASES:</h4>
                                        </div>
                                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                            <Grid item xs={12}>
                                                <TableContainer>
                                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Type</TableCell>
                                                                <TableCell>Category</TableCell>
                                                                <TableCell>Name</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {aliases.filter(alias => alias.aliasesType !== "Name").map((alias, index) => (
                                                                <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                    <TableCell>{alias.aliasesType}</TableCell>
                                                                    <TableCell>{alias.category}</TableCell>
                                                                    <TableCell>{alias.aliasesName}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>

                                            </Grid>
                                        </Card>
                                        <br />
                                    </>
                                )}
                                {address.length > 0 && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4>Addresses:</h4>
                                        </div>
                                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                                            <Grid item xs={12}>
                                                <TableContainer>
                                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Region</TableCell>
                                                                <TableCell>Address1</TableCell>
                                                                <TableCell>Address2</TableCell>
                                                                <TableCell>Address3</TableCell>
                                                                <TableCell>City</TableCell>
                                                                <TableCell>Province</TableCell>
                                                                <TableCell>Postal Code</TableCell>
                                                                <TableCell>Country </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {address.map((addres, index) => (
                                                                <TableRow key={index} style={{ background: index % 2 === 0 ? 'white' : 'whitesmoke' }}>
                                                                    <TableCell>{addres.region}</TableCell>
                                                                    <TableCell>{addres.address1}</TableCell>
                                                                    <TableCell>{addres.address2}</TableCell>
                                                                    <TableCell>{addres.address3}</TableCell>
                                                                    <TableCell>{addres.city}</TableCell>
                                                                    <TableCell>{addres.province}</TableCell>
                                                                    <TableCell>{addres.postal}</TableCell>
                                                                    <TableCell>{addres.countryName}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </Card>
                                    </>
                                )}
                                <br></br>
                                
                            </div>

                        </Card>
                    </Box>
                </Box>
            </Box>
            </Dialog>
        </>
    )
}

export default Aliase;