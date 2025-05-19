import React, { useState, useEffect } from 'react';
import { DatePicker, Tag } from 'antd';
import { Dayjs } from 'dayjs';
import { uiReciveCountryRecord } from '../../data/services/viewpage/view_payload';
import { uiCountryDtoVerify } from '../../data/services/san_search/uitestingcountry/uicountry_payload';
import Header from '../../layouts/header/header';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UiTestingCountryService from '../../data/services/san_search/uitestingcountry/uitestingcountry-api-service';
import * as XLSX from 'xlsx';
import {Box,TextField,Button,Grid,Card,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,MenuItem,FormControl,InputLabel,Select,Checkbox,} from '@mui/material';

interface Search {
    id1: string;
    id2: string;
    country1: string[];
    country2: string[];
    dob1: string;
    dob2: string;
    name1: string;
    name2: string;
    entityType:number;
};

interface Country {
    id: number;
    name: string;
};

interface MatchResult {
    nameMatch: string;
    countryMatch: string;
    dateMatch: string;
    idMatch: string;
};

const MultipleDatePicker: React.FC = () => {

    const countryList = [{ id: 1, name: "Albania" },{ id: 2, name: "Algeria" },{ id: 3, name: "Angola" },{ id: 4, name: "Antigua and Barbuda" },{ id: 5, name: "Argentina" },{ id: 6, name: "Armenia" },{ id: 7, name: "Australia" },{ id: 8, name: "Austria" },{ id: 9, name: "Azerbaijan" },{ id: 10, name: "Bahamas, The" },{ id: 11, name: "Bahrain" },{ id: 12, name: "Bangladesh" },{ id: 13, name: "Barbados" },{ id: 14, name: "Belarus" },{ id: 15, name: "Belgium" },{ id: 16, name: "Belize" },{ id: 17, name: "Benin" },{ id: 18, name: "Bolivia" },{ id: 19, name: "Bosnia and Herzegovina" },{ id: 20, name: "Brazil" },{ id: 21, name: "Brunei" },{ id: 22, name: "Bulgaria" },{ id: 23, name: "Burkina Faso" },{ id: 24, name: "Burma" },{ id: 25, name: "Cambodia" },{ id: 26, name: "Canada" },{ id: 27, name: "Cabo Verde" },{ id: 28, name: "Central African Republic" },{ id: 29, name: "Chile" },{ id: 30, name: "China" },{ id: 31, name: "Colombia" },{ id: 32, name: "Comoros" },{ id: 33, name: "Congo, Republic of the" },{ id: 34, name: "Congo, Democratic Republic of the" },{ id: 35, name: "Costa Rica" },{ id: 36, name: "Cote d Ivoire" },{ id: 37, name: "Croatia" },{ id: 38, name: "Cuba" },{ id: 39, name: "Cyprus" },{ id: 40, name: "Czech Republic" },{ id: 41, name: "Denmark" },{ id: 42, name: "Djibouti" },{ id: 43, name: "Dominica" },{ id: 44, name: "Dominican Republic" },{ id: 45, name: "Ecuador" },{ id: 46, name: "Egypt" },{ id: 47, name: "El Salvador" },{ id: 48, name: "Equatorial Guinea" },{ id: 49, name: "Eritrea" },{ id: 50, name: "Estonia" },
      { id: 51, name: "Ethiopia" },{ id: 52, name: "Finland" },{ id: 53, name: "France" },{ id: 54, name: "The Gambia" },{ id: 55, name: "Georgia" },{ id: 56, name: "Germany" },{ id: 57, name: "Ghana" },{ id: 58, name: "Greece" },{ id: 59, name: "Guatemala" },{ id: 60, name: "Guinea" },{ id: 61, name: "Guinea-Bissau" },{ id: 62, name: "Guyana" },{ id: 63, name: "Haiti" },{ id: 64, name: "Honduras" },{ id: 65, name: "Hungary" },{ id: 66, name: "India" },{ id: 67, name: "Indonesia" },{ id: 68, name: "Iran" },{ id: 69, name: "Iraq" },{ id: 70, name: "Ireland" },{ id: 71, name: "Israel" },{ id: 72, name: "Italy" },{ id: 73, name: "Jamaica" },{ id: 74, name: "Japan" },{ id: 75, name: "Jordan" },{ id: 76, name: "Kazakhstan" },{ id: 77, name: "Kenya" },{ id: 78, name: "Korea, North" },{ id: 79, name: "Korea, South" },{ id: 80, name: "Kuwait" },{ id: 81, name: "Kyrgyzstan" },{ id: 82, name: "Laos" },{ id: 83, name: "Latvia" },{ id: 84, name: "Lebanon" },{ id: 85, name: "Liberia" },{ id: 86, name: "Libya" },{ id: 87, name: "Liechtenstein" },{ id: 88, name: "Luxembourg" },{ id: 89, name: "North Macedonia, The Republic of" },{ id: 90, name: "Malaysia" },{ id: 91, name: "Maldives" },{ id: 92, name: "Mali" },{ id: 93, name: "Malta" },{ id: 94, name: "Marshall Islands" },{ id: 95, name: "Mauritania" },{ id: 96, name: "Mexico" },{ id: 97, name: "Moldova" },{ id: 98, name: "Monaco" },{ id: 99, name: "Mongolia" },{ id: 100, name: "Morocco" },{ id: 101, name: "Mozambique" },{ id: 102, name: "Namibia" },{ id: 103, name: "Netherlands" },
      { id: 104, name: "New Zealand" },{ id: 105, name: "Nicaragua" },{ id: 106, name: "Niger" },{ id: 107, name: "Nigeria" },{ id: 108, name: "Norway" },{ id: 109, name: "Oman" },{ id: 110, name: "Pakistan" },{ id: 111, name: "Palau" },{ id: 112, name: "Panama" },{ id: 113, name: "Paraguay" },{ id: 114, name: "Peru" },{ id: 115, name: "Philippines" },{ id: 116, name: "Poland" },{ id: 117, name: "Portugal" },{ id: 118, name: "Qatar" },{ id: 119, name: "Romania" },{ id: 120, name: "Russia" },{ id: 121, name: "Rwanda" },{ id: 122, name: "Saint Kitts and Nevis" },{ id: 123, name: "Saint Vincent and the Grenadines" },{ id: 124, name: "Samoa" },{ id: 125, name: "San Marino" },{ id: 126, name: "Saudi Arabia" },{ id: 127, name: "Senegal" },{ id: 128, name: "Serbia" },{ id: 129, name: "Seychelles" },{ id: 130, name: "Sierra Leone" },{ id: 131, name: "Singapore" },{ id: 132, name: "Slovakia" },{ id: 133, name: "Slovenia" },{ id: 134, name: "Somalia" },{ id: 135, name: "South Africa" },{ id: 136, name: "Spain" },{ id: 137, name: "Sri Lanka" },{ id: 138, name: "Sudan" },{ id: 139, name: "Sweden" },{ id: 140, name: "Switzerland" },{ id: 141, name: "Syria" },{ id: 142, name: "Tajikistan" },{ id: 143, name: "Tanzania" },{ id: 144, name: "Thailand" },{ id: 145, name: "Trinidad and Tobago" },{ id: 146, name: "Tunisia" },{ id: 147, name: "Turkey" },{ id: 148, name: "Turkmenistan" },{ id: 149, name: "Uganda" },{ id: 150, name: "Ukraine" },{ id: 151, name: "United Arab Emirates" },{ id: 152, name: "United Kingdom" },{ id: 153, name: "United States" },
      { id: 154, name: "Uruguay" },{ id: 155, name: "Uzbekistan" },{ id: 156, name: "Vanuatu" },{ id: 157, name: "Venezuela" },{ id: 158, name: "Vietnam" },{ id: 159, name: "Yemen" },{ id: 160, name: "Zambia" },{ id: 161, name: "Zimbabwe" },{ id: 162, name: "Aruba" },{ id: 163, name: "Bermuda" },{ id: 164, name: "Cayman Islands" },{ id: 165, name: "Gibraltar" },{ id: 166, name: "Hong Kong" },{ id: 167, name: "Jersey" },{ id: 168, name: "Macau" },{ id: 169, name: "Man, Isle of" },{ id: 170, name: "Netherlands Antilles" },{ id: 171, name: "Virgin Islands, British" },{ id: 172, name: "undetermined" },{ id: 173, name: "West Bank" },{ id: 174, name: "Taiwan" },{ id: 175, name: "Palestinian" },{ id: 176, name: "Kosovo" },{ id: 177, name: "Montenegro" }, { id: 178, name: "Region: Northern Mali" }, { id: 179, name: "South Sudan" }, { id: 180, name: "Region: Gaza" }
    ];
    // const [uicountry, setCountry] = useState<Country[]>([]);
    const [uicountry, setCountry] = useState(countryList);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [searchResults, setSearchResults] = useState<uiReciveCountryRecord[]>([]);
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
    const [selected2Dates, setSelected2Dates] = useState<Dayjs[]>([]);
    const [pickerValues, setPickerValues] = useState<Dayjs | null>(null);
    const [pickerValue, setPickerValue] = useState<Dayjs | null>(null);
    const [selectedYears, setSelectedYears] = useState<Dayjs[]>([]);
    const [startYear, setStartYear] = useState<Dayjs | null>(null);
    const [endYear, setEndYear] = useState<Dayjs | null>(null);
    const [yearRanges, setYearRanges] = useState<string[]>([]);

    const country = new UiTestingCountryService();

    useEffect(() => {
        fetchCountry();
    }, []);

    const [searchParams, setSearchParams] = useState<Search>({
        id1: '',
        id2: '',
        country1: [],
        country2: [],
        dob1: '',
        dob2: '',
        name1: '',
        name2: '',
        entityType:0
    });

    const [matchResult, setMatchResult] = useState<MatchResult>({
        nameMatch: '0',
        countryMatch: '0',
        dateMatch: '0',
        idMatch: '0',
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        const isSelectEvent = Array.isArray(value);
        setSearchParams((prev) => ({
            ...prev,
            [name]: isSelectEvent ? value : value, 
        }));
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(searchResults);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'search_results.xlsx');
    };
    
    const fetchCountry = async () => {
        try {
            const countryData = await country.getUICountry();
            const formattedCountryData = countryData.map((name: any, index: number) => ({
                id: index + 1,
                name,
            }));
            console.log("Formatted country data:", formattedCountryData);
            setCountry(formattedCountryData);
        } catch (error) {
            console.error("Error fetching country list:", error);
        }
    };

    const handleStartYearChange = (date: Dayjs | null) => {
        setStartYear(date);
        if (!date) {
            setEndYear(null);
        }
    };

    const handleEndYearChange = (date: Dayjs | null) => {
        setEndYear(date);
        if (startYear && date) {
            const newRange = `${startYear.year()}-${date.year()}`;
            setYearRanges([...yearRanges, newRange]);
            setStartYear(null);
            setEndYear(null); 
        }
    };

    const handleRemoveYearRange = (range: string) => {
        setYearRanges(yearRanges.filter((yearRange) => yearRange !== range));
    };

    const handleYearChange = (date: Dayjs | null) => {
        if (date) {
            const newSelectedYears = [...selectedYears];
            const index = newSelectedYears.findIndex(year => year.year() === date.year());
            if (index === -1) {
                newSelectedYears.push(date);
            } else {
                newSelectedYears.splice(index, 1);
            }
            setSelectedYears(newSelectedYears);
        }
    };

    const handleRemoveYear = (yearToRemove: Dayjs) => {
        const newSelectedYears = selectedYears.filter(year => year.year() !== yearToRemove.year());
        setSelectedYears(newSelectedYears);
    };

    const handleDateChange2 = (date: Dayjs | null) => {
        setPickerValues(date);
        if (date && !selected2Dates.some(d => d.isSame(date, 'day'))) {
            setSelected2Dates([...selected2Dates, date]);
            setPickerValues(null);
        }
    };

    const handleRemoveDate2 = (e: React.MouseEvent, date: Dayjs) => {
        e.preventDefault(); 
        const updatedDates = selected2Dates.filter(d => !d.isSame(date, 'day'));
        setSelected2Dates(updatedDates);
        setPickerValues(null); 
    };

    const handleDateChange = (date: Dayjs | null) => {
        setPickerValue(date); 
        if (date && !selectedDates.some(d => d.isSame(date, 'day'))) {
            setSelectedDates([...selectedDates, date]);
            setPickerValue(null); 
        }
    };

    const handleRemoveDate = (e: React.MouseEvent, date: Dayjs) => {
        e.preventDefault(); 
        const updatedDates = selectedDates.filter(d => !d.isSame(date, 'day'));
        setSelectedDates(updatedDates);
        setPickerValue(null); 
    };

    const handleSearch = async () => {

        const formattedDob1 = selectedDates.length > 0
            ? selectedDates.map((date) => date.format("YYYY-MM-DD")).join(',')
            : '';

        const formattedDob2Dates = selected2Dates.length > 0
            ? selected2Dates.map((date) => date.format("YYYY-MM-DD"))
            : [];

        const formattedDob2Years = selectedYears.length > 0
            ? selectedYears.map((year) => year.format("YYYY"))
            : [];

        const formattedDateRanges = yearRanges.length > 0
            ? yearRanges.map((range) => {
                const [start, end] = range.split('-');
                return `${start}-${end}`;
            })
            : [];

        const formattedDob2 = [
            ...formattedDob2Dates,
            ...formattedDob2Years,
            ...formattedDateRanges
        ].join(',');

        const country1Names = searchParams.country1.map(id => {
            const country = uicountry.find(country => country.id === Number(id));
            return country ? country.name : '';
        }).filter(Boolean);

        const country2Names = searchParams.country2.map(id => {
            const country = uicountry.find(country => country.id === Number(id));
            return country ? country.name : '';
        }).filter(Boolean);

        const searchDTO: uiCountryDtoVerify = {
            id1: searchParams.id1,
            id2: searchParams.id2,
            country1: country1Names,
            country2: country2Names,
            dob1: formattedDob1,
            dob2: formattedDob2,
            name1: searchParams.name1,
            name2: searchParams.name2,
            entityType :searchParams.entityType,
        };
        try {
            const response = await country.getUISearchMultiParaRecords(searchDTO);
            console.log('handleSearch response:',response);
            setSearchResults([{
                onesidematching: String(response),
                twosidematching: '',
                tokenWeight: '',
                onsideSinglePara: '',
                onsideMultiPara: [],
                jaro: ''
            }]); 
            // setSearchResults(response);
        } catch (error) {
            console.error("Error while searching:", error);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4}>
                            <h6 className='allheading'>
                                SEARCH
                            </h6>
                        </Grid>
                        <Grid item xs={4}>
                            <h6 className='allheading'>
                                DATABASE
                            </h6>
                        </Grid>
                        <Grid item xs={4}>
                            <h6 className='allheading'>
                                RESULT
                            </h6>
                        </Grid>
                    </Grid>
                    <Card
                        style={{
                            padding: '1%',
                            boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                            width: '100%',
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Name1"
                                        name="name1"
                                        type="text"
                                        value={searchParams.name1}
                                        onChange={handleInputChange}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Name2 "
                                        name="name2"
                                        type="text"
                                        value={searchParams.name2}
                                        onChange={handleInputChange}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    Name Match:{searchResults[0]?.onsideMultiPara?.[0] ?? "N/A"}
                                </Grid>
                            </Grid>
                            {/* Country Dropdowns */}
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Country1</InputLabel>
                                        <Select
                                            label="Country"
                                            name="country1"
                                            multiple
                                            value={searchParams.country1 || []} 
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setSearchParams((prev) => ({
                                                    ...prev,
                                                    country1: typeof value === 'string' ? value.split(',') : value, 
                                                }));
                                            }}
                                            renderValue={(selected) =>
                                                Array.isArray(selected)
                                                    ? selected
                                                        .map((id) => {
                                                            const country = uicountry.find((country) => country.id === Number(id));
                                                            return country ? country.name : '';
                                                        })
                                                        .join(', ')
                                                    : ''
                                            }
                                        >
                                            {uicountry.map((country) => (
                                                <MenuItem key={country.id} value={String(country.id)}>
                                                    <Checkbox
                                                        checked={searchParams.country1?.includes(String(country.id)) || false} 
                                                    />
                                                    <span className="check">{country.name}</span>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Country2</InputLabel>
                                        <Select
                                            label="Country2"
                                            name="country2"
                                            multiple
                                            value={searchParams.country2 || []} 
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setSearchParams((prev) => ({
                                                    ...prev,
                                                    country2: typeof value === 'string' ? value.split(',') : value, 
                                                }));
                                            }}
                                            renderValue={(selected) =>
                                                Array.isArray(selected)
                                                    ? selected
                                                        .map((id) => {
                                                            const country = uicountry.find((country) => country.id === Number(id));
                                                            return country ? country.name : '';
                                                        })
                                                        .join(', ')
                                                    : ''
                                            }
                                        >
                                            {uicountry.map((country) => (
                                                <MenuItem key={country.id} value={String(country.id)}>
                                                    <Checkbox
                                                        checked={searchParams.country2?.includes(String(country.id)) || false} 
                                                    />
                                                    <span className="check">{country.name}</span>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    Country Match:{searchResults[0]?.onsideMultiPara?.[1] ?? "N/A"}
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={4}>
                                    <Box>
                                        <DatePicker
                                            value={pickerValue} 
                                            onChange={handleDateChange}
                                            format="MM/DD/YYYY"
                                            placeholder="Select Date"
                                            style={{ marginRight: 10, width: '100%' }}
                                            disabledDate={(current) => selectedDates.some(d => d.isSame(current, 'day'))}
                                        />
                                        <div style={{ marginTop: 10 ,marginBottom: 10}}>
                                            {selectedDates.map((date, index) => (
                                                <Tag
                                                    key={index}
                                                    closable
                                                    onClose={(e) => handleRemoveDate(e, date)} 
                                                >
                                                    {date.format('MM/DD/YYYY')}
                                                </Tag>
                                            ))}
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box>
                                        <DatePicker
                                            value={pickerValues} 
                                            onChange={handleDateChange2}
                                            format="MM/DD/YYYY"
                                            placeholder="Select Date"
                                            style={{ marginRight: 10, width: '100%' }}
                                            disabledDate={(current) => selected2Dates.some(d => d.isSame(current, 'day'))}
                                        />
                                        <div style={{ marginTop: 10 , marginBottom: 10 }}>
                                            {selected2Dates.map((date, index) => (
                                                <Tag
                                                    key={index}
                                                    closable
                                                    onClose={(e) => handleRemoveDate2(e, date)} 
                                                >
                                                    {date.format('MM/DD/YYYY')}
                                                </Tag>
                                            ))}
                                        </div>
                                    </Box>                            
                                </Grid>
                                <Grid item xs={4}>
                                        Date Match:{searchResults[0]?.onsideMultiPara?.[2] ?? "N/A"}
                                </Grid>
                            </Grid>
                        </Grid>                       
                        <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                            <Box>
                                <div>
                                    <DatePicker
                                        picker="year"
                                        style={{ marginRight: 10, width: '100%' }}
                                        onChange={handleYearChange}
                                        value={null} 
                                    />
                                     <div style={{ marginTop: 10,width: '100%' }}>
                                         {selectedYears.map((year, index) => (
                                             <Tag
                                                 key={index}
                                                 closable
                                                 onClose={() => handleRemoveYear(year)} 
                                             >
                                                 {year.year()}
                                             </Tag>
                                         ))}
                                     </div>
                                </div>
                            </Box>
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4} justifyContent="flex-end">
                                <Box>
                                    <Box display="flex" justifyContent="space-between">              
                                        <div style={{ marginBottom: 10 }}>
                                            <DatePicker
                                                picker="year"
                                                value={startYear}
                                                style={{ marginRight: 10, width: '100%' }}
                                                onChange={handleStartYearChange}
                                                placeholder="Select start year"
                                            />
                                        </div>
                                        <div style={{ marginBottom: 10 ,}}>
                                            <DatePicker
                                                picker="year"
                                                value={endYear}
                                                style={{ marginRight: 10, width: '100%' }}
                                                onChange={handleEndYearChange}
                                                disabled={!startYear} 
                                                placeholder="Select end year"
                                            />
                                        </div>                            
                                    </Box>
                                        <div style={{ marginTop: 10 , marginBottom: 10 }}>
                                            {yearRanges.map((range, index) => (
                                                <Tag key={index} closable onClose={() => handleRemoveYearRange(range)}>
                                                    {range}
                                                </Tag>
                                            ))}
                                        </div>                                  
                                </Box>
                            </Grid>
                        </Grid>
                        <br></br>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={3}>
                                <TextField
                                    label="ID"
                                    name="id1"
                                    type="text"
                                    value={searchParams.id1}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="ID "
                                    name="id2"
                                    type="text"
                                    value={searchParams.id2}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={1}>
                                ID Match:{searchResults[0]?.onsideMultiPara?.[3] ?? "N/A"}
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Entity Type</InputLabel>
                                    <Select
                                        label="Entity Type"
                                        name="entityType"
                                        value={searchParams.entityType || ""}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="1">Individual</MenuItem>
                                        <MenuItem value="2">Corporate</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                            <Button variant="contained" color="primary" onClick={handleSearch}>
                                    Search
                                </Button>
                            </Grid>
                            </Grid>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1%' }}>
                            <Typography className='allHeading'>UI TESTING SEARCH RESULTS {searchResults.length > 0 && `(${searchResults.length})`}</Typography>
                            <Button
                                variant="contained"
                                onClick={exportToExcel}
                                style={{ padding: '8px 16px' }}
                            >
                                <FileDownloadIcon />
                            </Button>
                        </div>
                <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                    <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                        <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 1</strong></TableCell>
                                    {/* <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 2</strong></TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 3</strong></TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 4</strong></TableCell> */}
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
                                        {/* <TableCell>{parseFloat(result.onesidematching).toFixed(2)}</TableCell> */}
                                        {/* <TableCell>{parseFloat(result.twosidematching).toFixed(2)}</TableCell>
                                        <TableCell>{result.jaro}</TableCell>
                                        <TableCell>{result.onsideSinglePara}</TableCell> */}
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
                </Card>
                {/* <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                    <Grid item xs={12}>
                        <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
                            <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 1</strong></TableCell>
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
                                            <TableCell>{result.onsideMultiPara[4]}</TableCell>
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
                </Card> */}
                    </Card>
                </Box>
            </Box>
        </>

    );
};

export default MultipleDatePicker;

// import React, { useState, ChangeEvent, useEffect } from 'react';
// import {
//     Box,
//     TextField,
//     Button,
//     Grid,
//     Card,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Select,
//     SelectChangeEvent,
//     Chip,
//     Checkbox,
// } from '@mui/material';
// import Header from '../../layouts/header/header';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import * as XLSX from 'xlsx';
// import UiTestingCountryService from '../../data/services/san_search/uitestingcountry/uitestingcountry-api-service';
// import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
// import dayjs, { Dayjs } from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { uiReciveCountryRecord, uiReciveRecord } from '../../data/services/viewpage/view_payload';
// import { uiCountryDtoVerify } from '../../data/services/san_search/uitestingcountry/uicountry_payload';



// interface Search {
//     id1: string;
//     id2: string;
//     country1: string[];
//     country2: string[];
//     dob1: string;
//     dob2: string;
//     name1: string;
//     name2: string;

// }
// interface Country {
//     id: number;
//     name: string;
// }
// interface MatchResult {
//     nameMatch: string;
//     countryMatch: string;
//     dateMatch: string;
//     idMatch: string;
// }
// function UiTestingCountry() {
//     const [searchParams, setSearchParams] = useState<Search>({

//         id1: '',
//         id2: '',
//         country1: [],
//         country2: [],
//         dob1: '',
//         dob2: '',
//         name1: '',
//         name2: '',

//     });
//     const [matchResult, setMatchResult] = useState<MatchResult>({

//         nameMatch: '0',
//         countryMatch: '0',
//         dateMatch: '0',
//         idMatch: '0',


//     });
//     const [uicountry, setCountry] = useState<Country[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [searchError, setSearchError] = useState(false);
//     const handleInputChange = (event: any) => {
//         const { name, value } = event.target;
//         const isSelectEvent = Array.isArray(value);
//         setSearchParams((prev) => ({
//             ...prev,
//             [name]: isSelectEvent ? value : value, // Update based on type
//         }));
//     };

//     useEffect(() => {
//         fetchCountry();
//     }, []);

//     const exportToExcel = () => {
//         const ws = XLSX.utils.json_to_sheet(searchResults);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//         XLSX.writeFile(wb, 'search_results.xlsx');
//     };
//     const country = new UiTestingCountryService();

//     const [searchResults, setSearchResults] = useState<uiReciveCountryRecord[]>([]);
//     const handleSearch = async () => {
//         const formattedDob1 = selectedDates.length > 0 ? selectedDates.map((date) => dayjs(date).format("YYYY-MM-DD")).join(',') : '';
//         const formattedDob2Dates = selected2Dates.length > 0
//             ? selected2Dates.map((date) => dayjs(date).format("YYYY-MM-DD"))
//             : [];

//         const formattedDob2Years = selectedYears.length > 0
//             ? selectedYears.map((year) => dayjs(year).format("YYYY"))
//             : [];

//         // Format selectedDateRanges
//         const formattedDateRanges = selectedDateRanges.length > 0
//             ? selectedDateRanges.map(([start, end]) => {
//                 const startYear = start ? dayjs(start).format("YYYY") : null;
//                 const endYear = end ? dayjs(end).format("YYYY") : null;
//                 return startYear && endYear ? `${startYear}-${endYear}` : null;
//             }).filter(Boolean) // Remove any null entries
//             : [];

//         // Combine all dob2 formats
//         const formattedDob2 = [
//             ...formattedDob2Dates,
//             ...formattedDob2Years,
//             ...formattedDateRanges
//         ].join(',');
//         const country1Names = searchParams.country1.map(id => {
//             const country = uicountry.find(country => country.id === Number(id));
//             return country ? country.name : '';
//         }).filter(Boolean);

//         const country2Names = searchParams.country2.map(id => {
//             const country = uicountry.find(country => country.id === Number(id));
//             return country ? country.name : '';
//         }).filter(Boolean);


//         const searchDTO: uiCountryDtoVerify = {
//             id1: searchParams.id1,
//             id2: searchParams.id2,
//             country1: country1Names,
//             country2: country2Names,
//             dob1: formattedDob1,
//             dob2: formattedDob2,
//             name1: searchParams.name1,
//             name2: searchParams.name2,
//         };

//         try {

//             const response = await country.getUISearchMultiParaRecords(searchDTO);
//             setSearchResults(response);

//         } catch (error) {
//             console.error("Error while searching:", error);
//         }
//     };
//     const fetchCountry = async () => {
//         try {
//             const countryData = await country.getUICountry();
//             const formattedCountryData = countryData.map((name: any, index: number) => ({
//                 id: index + 1,
//                 name,
//             }));
//             console.log("Formatted country data:", formattedCountryData);
//             setCountry(formattedCountryData);
//         } catch (error) {
//             console.error("Error fetching country list:", error);
//         }
//     };
//     const [selectedDates, setSelectedDates] = useState<Date[]>([]);
//     const [selected2Dates, setSelected2Dates] = useState<Date[]>([]);
//     const [selectedYears, setSelectedYears] = useState<dayjs.Dayjs[]>([]);
//     const [selectedDateRanges, setSelectedDateRanges] = useState<[Dayjs | null, Dayjs | null][]>([]);
//     const [currentDateRange, setCurrentDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
   
//     const handleDateChange = (newDate: any) => {
//         const MIN_YEAR = 1900;
//         if (newDate === null) {
//             console.log('Date field cleared. Resetting selected date in field.');
    
//             // Only remove the date from selectedDates that was cleared in the field
//             setSelectedDates((prev) => prev.filter((date) => !dayjs(date).isSame(selectedDates[0], "day")));
//         } else if (newDate && dayjs(newDate).isValid()) {
//             const year = dayjs(newDate).year();
//             if (year < MIN_YEAR) {
//                 console.log(`Invalid year: ${year}. Must be ${MIN_YEAR} or later.`);
//                 return;
//             }
    
//             console.log('Selected Date:', dayjs(newDate).format("YYYY-MM-DD"));
    
//             // If the new date is already selected, remove it; otherwise, add it
//             const isAlreadySelected = selectedDates.some((date) => dayjs(date).isSame(newDate, "day"));
//             if (isAlreadySelected) {
//                 setSelectedDates((prev) =>
//                     prev.filter((date) => !dayjs(date).isSame(newDate, "day"))
//                 );
//             } else {
//                 setSelectedDates((prev) => [...prev, newDate]);
//             }
//         } else {
//             console.log('Invalid date input');
//         }
//     };
    

//     const handleDate2Change = (newDate: any) => {
//         const MIN_YEAR = 1900;
//         if (newDate === null) {
//             console.log('Date field cleared. Resetting selected date in field.');
            
//             // Only remove the date from selected2Dates that was cleared in the field
//             setSelected2Dates((prev) => prev.filter((date) => !dayjs(date).isSame(selected2Dates[0], "day")));
//         } else if (newDate && dayjs(newDate).isValid()) {
//             const year = dayjs(newDate).year();
//             if (year < MIN_YEAR) {
//                 console.log(`Invalid year: ${year}. Must be ${MIN_YEAR} or later.`);
//                 return;
//             }
    
//             console.log('Selected Date:', dayjs(newDate).format("YYYY-MM-DD"));
    
//             // If the new date is already selected, remove it; otherwise, add it
//             const isAlreadySelected = selected2Dates.some((date) => dayjs(date).isSame(newDate, "day"));
//             if (isAlreadySelected) {
//                 setSelected2Dates((prev) =>
//                     prev.filter((date) => !dayjs(date).isSame(newDate, "day"))
//                 );
//             } else {
//                 setSelected2Dates((prev) => [...prev, newDate]);
//             }
//         } else {
//             console.log('Invalid date input');
//         }
//     };
    

//     const handleYearChange = (newYear: dayjs.Dayjs | null) => {
//         const MIN_YEAR = 1900;
//         if (newYear === null) {
//             console.log('Year field cleared. Resetting selected years.');
//             setSelectedYears([]);
//         } else if (newYear && newYear.isValid()) {
//             const year = newYear.year();
//             if (year < MIN_YEAR) {
//                 console.log(`Invalid year: ${year}. Must be ${MIN_YEAR} or later.`);
//                 return;
//             }

//             const isAlreadySelected = selectedYears.some((year) => year.isSame(newYear, 'year'));
//             if (isAlreadySelected) {
//                 setSelectedYears((prev) =>
//                     prev.filter((year) => !year.isSame(newYear, 'year'))
//                 );
//             } else {
//                 setSelectedYears((prev) => [...prev, newYear]);
//             }
//         } else {
//             console.log('Invalid year input');
//         }
//     };
//     const handleDateRangeChange = (newValue: [Dayjs | null, Dayjs | null]) => {
//         const MIN_YEAR = 1900;

//         // Check for Start and End Year presence
//         if (newValue[0] && newValue[1]) {
//             const startYear = newValue[0].year();
//             const endYear = newValue[1].year();

//             // Validate year values
//             if (startYear < MIN_YEAR || endYear < MIN_YEAR) {
//                 console.log(`Invalid year: ${startYear} or ${endYear}. Must be ${MIN_YEAR} or later.`);
//                 return;
//             }

//             // Add the valid date range
//             setSelectedDateRanges((prev) => [...prev, newValue]);
//             setCurrentDateRange([null, null]); // Reset Start and End Year
//         } else if (newValue[0] && !newValue[0].isValid()) {
//             console.log("Invalid Start Year");
//         } else if (newValue[1] && !newValue[1].isValid()) {
//             console.log("Invalid End Year");
//         } else {
//             setCurrentDateRange(newValue); // Update the current range
//         }
//     };

//     const handleChipDelete = (index: number) => {
//         setSelectedDateRanges((prev) => prev.filter((_, i) => i !== index));
//         setCurrentDateRange([null, null]); // Reset Start and End Year
//     };



//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3, m: 4 }}>
//                     <Grid container item xs={12} spacing={2}>
//                         <Grid item xs={4}>
//                             <h6 className='allheading' >
//                                 SEARCH
//                             </h6>
//                         </Grid>
//                         <Grid item xs={4}>
//                             <h6 className='allheading'>
//                                 DATABASE
//                             </h6>
//                         </Grid>
//                         <Grid item xs={4}>
//                             <h6 className='allheading'>
//                                 RESULT
//                             </h6>
//                         </Grid>
//                     </Grid>
//                     <Card
//                         style={{
//                             padding: '1%',
//                             boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                             width: '100%',
//                         }}
//                     >
//                         <Grid container spacing={2}>
//                             <Grid container item xs={12} spacing={2}>

//                                 <Grid item xs={4}>
//                                     <TextField
//                                         label="Name1"
//                                         name="name1"
//                                         type="text"
//                                         value={searchParams.name1}
//                                         onChange={handleInputChange}
//                                         fullWidth
//                                         size="small"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={4}>
//                                     <TextField
//                                         label="Name2 "
//                                         name="name2"
//                                         type="text"
//                                         value={searchParams.name2}
//                                         onChange={handleInputChange}
//                                         fullWidth
//                                         size="small"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={4}>
//                                     Name Match:{searchResults[0]?.onsideMultiPara?.[0] ?? "N/A"}
//                                 </Grid>
//                             </Grid>
//                             {/* Country Dropdowns */}
//                             <Grid container item xs={12} spacing={2}>
//                                 <Grid item xs={4}>
//                                     <FormControl fullWidth size="small">
//                                         <InputLabel>Country</InputLabel>
//                                         <Select
//                                             label="Country"
//                                             name="country1"
//                                             multiple
//                                             value={searchParams.country1 || []} // Ensure value is an array
//                                             onChange={(event) => {
//                                                 const value = event.target.value;
//                                                 setSearchParams((prev) => ({
//                                                     ...prev,
//                                                     country1: typeof value === 'string' ? value.split(',') : value, // Update selected values
//                                                 }));
//                                             }}
//                                             renderValue={(selected) =>
//                                                 Array.isArray(selected)
//                                                     ? selected
//                                                         .map((id) => {
//                                                             const country = uicountry.find((country) => country.id === Number(id));
//                                                             return country ? country.name : '';
//                                                         })
//                                                         .join(', ')
//                                                     : ''
//                                             }
//                                         >
//                                             {uicountry.map((country) => (
//                                                 <MenuItem key={country.id} value={String(country.id)}>
//                                                     <Checkbox
//                                                         checked={searchParams.country1?.includes(String(country.id)) || false} // Convert to string for comparison
//                                                     />
//                                                     <span className="check">{country.name}</span>
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>

//                                     </FormControl>
//                                 </Grid>

//                                 <Grid item xs={4}>
//                                     <FormControl fullWidth size="small">
//                                         <InputLabel>Country2</InputLabel>
//                                         <Select
//                                             label="Country2"
//                                             name="country2"
//                                             multiple
//                                             value={searchParams.country2 || []} // Ensure value is an array
//                                             onChange={(event) => {
//                                                 const value = event.target.value;
//                                                 setSearchParams((prev) => ({
//                                                     ...prev,
//                                                     country2: typeof value === 'string' ? value.split(',') : value, // Update selected values
//                                                 }));
//                                             }}
//                                             renderValue={(selected) =>
//                                                 Array.isArray(selected)
//                                                     ? selected
//                                                         .map((id) => {
//                                                             const country = uicountry.find((country) => country.id === Number(id));
//                                                             return country ? country.name : '';
//                                                         })
//                                                         .join(', ')
//                                                     : ''
//                                             }
//                                         >
//                                             {uicountry.map((country) => (
//                                                 <MenuItem key={country.id} value={String(country.id)}>
//                                                     <Checkbox
//                                                         checked={searchParams.country2?.includes(String(country.id)) || false} // Match type as string
//                                                     />
//                                                     <span className="check">{country.name}</span>
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>

//                                 </Grid>
//                                 <Grid item xs={4}>
//                                     Country Match:{searchResults[0]?.onsideMultiPara?.[1] ?? "N/A"}

//                                 </Grid>
//                             </Grid>

//                             {/* DOB Dropdowns */}
//                             <Grid container item xs={12} spacing={2}>
//                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                     <Grid item xs={4}>
//                                         <Box>
//                                             <DatePicker
//                                                 label="Select Dates"
//                                                 value={selectedDates.length > 0 ? selectedDates[0] : null}
//                                                 onChange={handleDateChange}
//                                                 slots={{
//                                                     textField: TextField,
//                                                 }}
//                                                 slotProps={{
//                                                     textField: { size: "small", fullWidth: true },
//                                                 }}
//                                             />
//                                             <Box mt={2}>
//                                                 {selectedDates.map((date, index) => (
//                                                     <Chip
//                                                         key={index}
//                                                         label={dayjs(date).format("MM/DD/YYYY")}
//                                                         onDelete={() =>
//                                                             setSelectedDates((prev) =>
//                                                                 prev.filter((d) => !dayjs(d).isSame(date, "day"))
//                                                             )
//                                                         }
//                                                         style={{ margin: "4px" }}
//                                                     />
//                                                 ))}
//                                             </Box>
//                                         </Box>
//                                     </Grid>
//                                     <Grid item xs={4}>
//                                         <Box>
//                                             <DatePicker
//                                                 label="Select Dates"
//                                                 value={selected2Dates.length > 0 ? selected2Dates[0] : null}
//                                                 onChange={handleDate2Change}
//                                                 slots={{
//                                                     textField: TextField,
//                                                 }}
//                                                 slotProps={{
//                                                     textField: { size: "small", fullWidth: true },
//                                                 }}
//                                             />
//                                             <Box mt={2}>
//                                                 {selected2Dates.map((date, index) => (
//                                                     <Chip
//                                                         key={index}
//                                                         label={dayjs(date).format("MM/DD/YYYY")}
//                                                         onDelete={() =>
//                                                             setSelected2Dates((prev) =>
//                                                                 prev.filter((d) => !dayjs(d).isSame(date, "day"))
//                                                             )
//                                                         }
//                                                         style={{ margin: "4px" }}
//                                                     />
//                                                 ))}
//                                             </Box>
//                                         </Box>
//                                     </Grid>

//                                     <Grid item xs={4}>
//                                         Date Match:{searchResults[0]?.onsideMultiPara?.[2] ?? "N/A"}
//                                     </Grid>
//                                 </LocalizationProvider>
//                             </Grid>
//                             {/* {Year} */}
//                             <Grid container item xs={12} spacing={2}>
//                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                     <Grid item xs={4}>
//                                     </Grid>

//                                     <Grid item xs={4} justifyContent="flex-end">
//                                         <Box>
//                                             <DatePicker
//                                                 views={['year']}
//                                                 label="Select Year"
//                                                 value={selectedYears.length > 0 ? selectedYears[0] : null}
//                                                 onChange={handleYearChange}
//                                                 slots={{
//                                                     textField: TextField,
//                                                 }}
//                                                 slotProps={{
//                                                     textField: { size: 'small', fullWidth: true },
//                                                 }}
//                                             />
//                                             <Box mt={2}>
//                                                 {selectedYears.map((year, index) => (
//                                                     <Chip
//                                                         key={index}
//                                                         label={dayjs(year).format('YYYY')}
//                                                         onDelete={() =>
//                                                             setSelectedYears((prev) =>
//                                                                 prev.filter((d) => !dayjs(d).isSame(year, "day"))
//                                                             )
//                                                         }
//                                                         style={{ margin: '4px' }}
//                                                     />
//                                                 ))}
//                                             </Box>
//                                         </Box>
//                                     </Grid>


//                                 </LocalizationProvider>
//                             </Grid>
//                             {/* inbetween years */}
//                             <Grid container item xs={12} spacing={2}>
//                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                     <Grid item xs={4}>
//                                     </Grid>

//                                     <Grid item xs={4} justifyContent="flex-end">
//                                         <Box>
//                                             <Box display="flex" justifyContent="space-between">
//                                                 {/* Start Year DatePicker */}
//                                                 <DatePicker
//                                                     label="Start Year"
//                                                     value={currentDateRange[0]}
//                                                     onChange={(newDate) => {
//                                                         if (newDate && newDate.isValid()) {
//                                                             handleDateRangeChange([newDate, currentDateRange[1]]);
//                                                         } else {
//                                                             setCurrentDateRange([null, currentDateRange[1]]);
//                                                         }
//                                                     }}
//                                                     views={['year']}

//                                                 />
//                                                 {/* End Year DatePicker */}
//                                                 <DatePicker
//                                                     label="End Year"
//                                                     value={currentDateRange[1]}
//                                                     onChange={(newDate) => {
//                                                         if (newDate && newDate.isValid()) {
//                                                             handleDateRangeChange([currentDateRange[0], newDate]);
//                                                         } else {
//                                                             setCurrentDateRange([currentDateRange[0], null]);
//                                                         }
//                                                     }}
//                                                     views={['year']}
//                                                     disabled={!currentDateRange[0]} // Disable until Start Year is selected
//                                                 />
//                                             </Box>

//                                             <Box mt={2}>
//                                                 {/* Display selected date ranges */}
//                                                 {selectedDateRanges.map((range, index) => (
//                                                     <Chip
//                                                         key={index}
//                                                         label={`${range[0]?.format('YYYY')} - ${range[1]?.format('YYYY')}`}
//                                                         onDelete={() => handleChipDelete(index)}
//                                                         style={{ margin: '4px' }}
//                                                     />
//                                                 ))}
//                                             </Box>
//                                         </Box>
//                                     </Grid>


//                                 </LocalizationProvider>
//                             </Grid>

//                             {/* ID Fields */}
//                             <Grid container item xs={12} spacing={2}>
//                                 <Grid item xs={4}>
//                                     <TextField
//                                         label="ID"
//                                         name="id1"
//                                         type="text"
//                                         value={searchParams.id1}
//                                         onChange={handleInputChange}
//                                         fullWidth
//                                         size="small"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={4}>
//                                     <TextField
//                                         label="ID "
//                                         name="id2"
//                                         type="text"
//                                         value={searchParams.id2}
//                                         onChange={handleInputChange}
//                                         fullWidth
//                                         size="small"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={4}>
//                                     ID Match:{searchResults[0]?.onsideMultiPara?.[3] ?? "N/A"}
//                                 </Grid>
//                             </Grid>

//                             {/* Search Button */}
//                             <Grid container item xs={12} justifyContent="flex-end">
//                                 <Button variant="contained" color="primary" onClick={handleSearch}>
//                                     Search
//                                 </Button>
//                             </Grid>
//                         </Grid>

//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1%' }}>
//                             <Typography className='allHeading'>UI TESTING SEARCH RESULTS {searchResults.length > 0 && `(${searchResults.length})`}</Typography>

//                             <Button
//                                 variant="contained"
//                                 onClick={exportToExcel}
//                                 style={{ padding: '8px 16px' }}
//                             >
//                                 <FileDownloadIcon />
//                             </Button>
//                         </div>
//                         <br></br>
//                         <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>

//                             <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
//                                 <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 1</strong></TableCell>
//                                             <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 2</strong></TableCell>
//                                             <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 3</strong></TableCell>
//                                             <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 4</strong></TableCell>


//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {loading && (
//                                             <TableRow>
//                                                 <TableCell colSpan={6} align="center">
//                                                     <Typography variant="body1">Loading...</Typography>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                         {!loading && searchResults.length > 0 && searchResults.map((result, index) => (
//                                             <TableRow key={index}>
//                                                 <TableCell>{parseFloat(result.onesidematching).toFixed(2)}</TableCell>
//                                                 <TableCell>{parseFloat(result.twosidematching).toFixed(2)}</TableCell>
//                                                 <TableCell>{result.jaro}</TableCell>
//                                                 <TableCell>{result.onsideSinglePara}</TableCell>

//                                             </TableRow>
//                                         ))}
//                                         {searchError && (
//                                             <TableRow>
//                                                 <TableCell colSpan={10} align="center">
//                                                     <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
//                                                         {searchResults.length === 0 ? "Your search has not returned any results." : null}
//                                                     </Typography>
//                                                 </TableCell>
//                                             </TableRow>
//                                         )}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </Card>

//                         <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <Grid item xs={12}>
//                                 <TableContainer style={{ maxHeight: '400px', overflow: 'auto' }}>
//                                     <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
//                                         <TableHead>
//                                             <TableRow>
//                                                 <TableCell style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}><strong>Algorithm 1</strong></TableCell>



//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {loading && (
//                                                 <TableRow>
//                                                     <TableCell colSpan={6} align="center">
//                                                         <Typography variant="body1">Loading...</Typography>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )}
//                                             {!loading && searchResults.length > 0 && searchResults.map((result, index) => (
//                                                 <TableRow key={index}>

//                                                     <TableCell>{result.onsideMultiPara[4]}</TableCell>



//                                                 </TableRow>
//                                             ))}
//                                             {searchError && (
//                                                 <TableRow>
//                                                     <TableCell colSpan={10} align="center">
//                                                         <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '10px' }}>
//                                                             {searchResults.length === 0 ? "Your search has not returned any results." : null}
//                                                         </Typography>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>

//                             </Grid>
//                         </Card>

//                     </Card>
//                 </Box>
//             </Box>
//         </>
//     );
// }

// export default UiTestingCountry;
