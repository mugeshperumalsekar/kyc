import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../../layouts/header/header';
import BankApiService from '../../../data/services/kyc/Bank/bank_api_service';
import '../pep/PepReport.css';

interface BankDatas {
    fromDate: string;
    toDate: string;
    kycId: number;
    name: string;
    date: string;
};

function PepReport() {

    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [data, setData] = useState<BankDatas[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
    const indexOfLastRow = indexOfFirstRow + rowsPerPage;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
    const [isInputInvalid, setIsInputInvalid] = useState(false);
    const navigate = useNavigate();

    const bankApiService = new BankApiService();

    useEffect(() => {
        fetchAllName();
    }, []);

    const calculateWeekRange = (date: Date): [Date, Date] => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        return [startDate, endDate];
    };

    const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));

    const fetchAllName = async () => {
        try {
            const response = await bankApiService.getName();
            setData(response);
        } catch (error) {
            console.log("Error fetching the fetchAllName:", error);
        }
    };

    const fetchName = async (searchInput: string) => {
        try {
            const response = await bankApiService.getName();
            const filteredData = response.filter((item: BankDatas) =>
                item.name && item.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            return filteredData;
        } catch (error) {
            console.error("Error fetching the name:", error);
            return [];
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(data.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        setCurrentDate(new Date());
        setStartDate(new Date());
        setEndDate(new Date());
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    function convert(str: string | number | Date) {
        const date = new Date(str);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        setSearchInput(filteredValue);
        if (filteredValue.trim() !== '') {
            setIsInputInvalid(false);
        }
    };

    const handleNameInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        const regex = /^[a-zA-Z\s]*$/;
        if (!regex.test(key)) {
            event.preventDefault();
        }
        if (event.key === 'Enter') {
            handleSearchName();
            if (searchInput.trim() === '') {
                setIsInputInvalid(true);
                event.preventDefault();
            } else {
                handleSearchName();
            }
        }
    };

    const handleSearchName = async () => {
        if (searchInput.trim() === '') {
            setIsInputInvalid(true);
            return;
        }
        const filteredData = await fetchName(searchInput);
        setSearchPerformed(true);
        setData(filteredData);
    };

    const handleSearch = () => {
        setSearchInput('');
        setIsInputInvalid(false);
        const formattedStartDate = convert(startDate);
        const formattedEndDate = convert(endDate);
        const startDateAsDate = new Date(formattedStartDate);
        const endDateAsDate = new Date(formattedEndDate);
        bankApiService.getClientView(startDateAsDate, endDateAsDate)
            .then((fetchedData: BankDatas[]) => {
                setSearchPerformed(true);
                const sortedData = fetchedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setData(sortedData);
            })
            .catch((error) => {
                console.error('API request error:', error);
            });
    };

    const handleStartChange = (date: Date) => {
        let newStartDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newStartDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setCurrentDate(newStartDate);
        setStartDate(newStartDate);
    };

    const handleEndChange = (date: Date) => {
        let newEndDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newEndDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setEndDate(newEndDate);
    };

    const getDisabledDates = (): [Date | null, Date | null] => {
        const today = new Date();
        let minDate: Date | null = new Date(today);
        let maxDate: Date | null = new Date(today);
        return [minDate, maxDate];
    };

    const disabledDates = getDisabledDates();

    const handleRowClick = (kycId: number) => {
        navigate(`/Pep/${kycId}`);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Card border='10px' style={{ boxShadow: '1px 1px 1px grey', width: '96%', marginLeft: '2%', marginTop: '6%' }}>
                        <h5 style={{ textAlign: 'center', marginTop: '2%' }}>SCREENING REPORT</h5>
                        <Container className="alertreport-container">
                            <CardContent>
                                <Form>
                                    <Row>
                                        <Col xs={10}>
                                            <Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Label className="PepReportform-label-custom">Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Name"
                                                            value={searchInput}
                                                            onChange={handleSearchInputChange}
                                                            onKeyPress={handleNameInputKeyPress}
                                                            className="Reportform-input-custom"
                                                            isInvalid={isInputInvalid}
                                                        />
                                                        {isInputInvalid && (
                                                            <div className="text-danger">Name is required</div>
                                                        )}
                                                    </Col>
                                                    <Col>
                                                        <Form.Label className="PepReportform-label-custom">Start Date</Form.Label>
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={handleStartChange}
                                                            dateFormat="MMMM d, yyyy"
                                                            className="form-control Reportform-input-custom"
                                                            disabledKeyboardNavigation
                                                            minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                            maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                            highlightDates={highlightedWeek}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Form.Label className="PepReportform-label-custom">End Date</Form.Label>
                                                        <DatePicker
                                                            selected={endDate}
                                                            onChange={handleEndChange}
                                                            dateFormat="MMMM d, yyyy"
                                                            className="form-control Reportform-input-custom"
                                                            disabledKeyboardNavigation
                                                            minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                            maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                            highlightDates={highlightedWeek}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Button variant="primary" className="btn-pepReport" style={{ marginTop: '15%' }} onClick={handleSearch}>
                                                            Apply Dates
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Button variant="primary" className="btn-pepReport" style={{ marginTop: '15%' }} onClick={fetchAllName}>All</Button></Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                                <div className="current-date"></div>
                                {data.length === 0 && searchPerformed && (
                                    <p>No data available</p>
                                )}
                                {currentData.length > 0 && (
                                    <table className="table report-table">
                                        <thead>
                                            <tr>
                                                <th>Sl no</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item, index) => (
                                                <tr key={item.kycId} onClick={() => handleRowClick(item.kycId)}>
                                                    <td>{index + 1 + indexOfFirstRow}</td>
                                                    <td>{item.name}</td>
                                                    <td>{formatDate(item.date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {data.length > 0 && currentData.length > 0 && data.length > rowsPerPage && (
                                    <div className="pagination-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className="pagination-btn"
                                        >
                                            Previous
                                        </Button> &nbsp;
                                        <Button
                                            onClick={handleNextPage}
                                            disabled={currentPage >= Math.ceil(data.length / rowsPerPage)}
                                            className="pagination-btn"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Container>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default PepReport;