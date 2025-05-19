import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../../layouts/header/header';
import { CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BankData } from '../../../data/services/kyc/Bank/bank_payload';
import BankApiService from '../../../data/services/kyc/Bank/bank_api_service';


interface BankDatas {
    fromDate: string;
    toDate: string;
    kycId: number;
    name: string;
    date: string;
};

function BankReport() {

    const calculateWeekRange = (date: Date): [Date, Date] => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        return [startDate, endDate];
    };

    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
    const bankApiService = new BankApiService();
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [data, setData] = useState<BankDatas[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');

    const navigate = useNavigate();

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
        setSearchInput(event.target.value);
    };

    const handleNameInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        const formattedStartDate = convert(startDate);
        const formattedEndDate = convert(endDate);
        const startDateAsDate = new Date(formattedStartDate);
        const endDateAsDate = new Date(formattedEndDate);
        bankApiService
            .getClientView(startDateAsDate, endDateAsDate)
            .then((fetchedData: BankDatas[]) => {
                setSearchPerformed(true);
                const transformedData: BankData[] = fetchedData.map((entry) => {
                    return {
                        fromDate: entry.fromDate,
                        toDate: entry.toDate,
                        kycId: entry.kycId,
                        name: entry.name,
                        date: entry.date,
                    };
                });
                setData(transformedData);
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
        navigate(`/BankHeader/${kycId}`);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Card border='10px' style={{ marginTop: '6%' }}>
                        <Container className="alertreport-container">
                            <CardContent>
                                <Form>
                                    <Row>
                                        <Col xs={4}>
                                            <Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Label>Start Date</Form.Label>
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={handleStartChange}
                                                            dateFormat="MMMM d, yyyy"
                                                            className="form-control"
                                                            disabledKeyboardNavigation
                                                            minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                            maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                            highlightDates={highlightedWeek}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Form.Label>End Date</Form.Label>
                                                        <DatePicker
                                                            selected={endDate}
                                                            onChange={handleEndChange}
                                                            dateFormat="MMMM d, yyyy"
                                                            className="form-control"
                                                            disabledKeyboardNavigation
                                                            minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                            maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                            highlightDates={highlightedWeek}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={4}>
                                            <Button variant="primary" style={{ marginTop: '8%' }} onClick={handleSearch}>
                                                Apply Dates
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                                <div className="current-date"></div>
                                {data.length === 0 && searchPerformed && (
                                    <p>No data available</p>
                                )}
                                {data.length > 0 && (
                                    <table className="table report-table">
                                        <thead>
                                            <tr>
                                                <th>Sl no</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item: BankDatas, index: number) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleRowClick(item.kycId)}
                                                >
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{formatDate(item.date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </CardContent>
                        </Container>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default BankReport;