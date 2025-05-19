import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import contactImage from '../../../assets/contact.png';
import Header from '../../../layouts/header/header';
import { LocalizationProvider } from '@mui/x-date-pickers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import BankApiService from '../../../data/services/kyc/Bank/bank_api_service';
import { BankData } from '../../../data/services/kyc/Bank/bank_payload';
import { IconButton } from '@mui/material';
import { GetData, kycForm } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';

interface Bank {
    name: string;
    kycId: number;
}

interface TableData {
    description: string;
    application: number;
}

interface ButtonFormValues {
    buttonText: string;
}

interface TermsFormValues {
    termsContent: string;
}

interface FormValues {
    application: ApplicationFormValues;
    button: ButtonFormValues;
    terms: TermsFormValues;
}

const initialFormValues: FormValues = {
    application: {
        memberName: '',
        officeAddress: '',
        pepCount: '',
        date: '',
        place: '',
        authorizedSignatory: '',
        designation: '',
        stamp: ''
    },
    button: {
        buttonText: ''
    },
    terms: {
        termsContent: ''
    }
};

interface ApplicationFormValues {
    memberName: string;
    officeAddress: string;
    pepCount: string;
    date: string;
    place: string;
    authorizedSignatory: string;
    designation: string;
    stamp: string;
}

interface CustomerData {
    kycFormDto: kycForm;
}

interface BankDatas {
    fromDate: string;
    toDate: string;
    kycId: number;
    name: string;
    date: string;
};

const BankViewGet = () => {

    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const bankApiService = new BankApiService();
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [banks, setBanks] = useState<BankDatas[]>([]);
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDialogOpens, setIsDialogOpens] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
    const applicationfrome = new ApplicationfromeService();
    const [loading, setLoading] = useState(true);
    const responseId = sessionStorage.getItem('responseId');
    const [formData, setFormData] = useState<kycForm[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const itemsPerPage = 22;
    const { kycId } = useParams<{ kycId: string }>();
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [downloadCount, setDownloadCount] = useState(0);
    const [showDownloadButton, setShowDownloadButton] = useState(true);

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
                setBanks(transformedData);
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

    const handleBankClick = (kycId: number) => {
        setSelectedBank(kycId === selectedBank ? null : kycId);
    };

    const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
        const pages = [];
        for (let i = 0; i < data.length; i += itemsPerPage) {
            pages.push(data.slice(i, i + itemsPerPage));
        }
        return pages;
    };

    const pages = splitDataIntoPages(formData, itemsPerPage);

    useEffect(() => {
        if (responseId) {
            fetchData(responseId.toString());
        }
    }, [responseId]);

    const fetchData = async (responseId: string) => {
        try {
            setLoading(true);
            const response = await applicationfrome.getkycData(responseId);
            console.log('kycData:', response);
            const customerData: CustomerData[] = response;
            console.log('customerData:', customerData);
            setFormData(customerData.map((data: CustomerData) => data.kycFormDto));
        } catch (error) {
            setErrors(["Error fetching data"]);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        setDownloadingPDF(true);
        try {
            setShowDownloadButton(false);
            console.log("Starting PDF download...");
            console.log("Content found for PDF generation.");
            await new Promise(resolve => setTimeout(resolve, 0));
            const pdf = new jsPDF('p', 'mm', 'a4');
            const content = document.getElementById('pdfContent');
            if (!content) {
                console.error("No content found for PDF generation.");
                setDownloadingPDF(false);
                setShowDownloadButton(true);
                return;
            }
            pdf.setFontSize(10);
            pdf.setFont('helvetica');
            const padding = 10;
            const scale = 3;
            const pageWidth = 210;
            const pageHeight = 297;
            const contentWidth = pageWidth - 2 * padding;
            const contentHeight = pageHeight - 2 * padding;
            const totalPages = content.childNodes.length;
            console.log(`Total pages to process: ${totalPages}`);
            content.style.display = 'block';
            for (let i = 0; i < totalPages; i++) {
                const page = content.childNodes[i];
                const canvas = await html2canvas(page as HTMLElement, {
                    scale: scale,
                    useCORS: true,
                    logging: true,
                });
                const imgData = canvas.toDataURL('image/png');
                console.log(`Image data for page ${i + 1} generated.`);
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight);
                pdf.setLineWidth(0.2);
                pdf.setDrawColor(0, 0, 0);
                pdf.rect(padding, padding, contentWidth, contentHeight);
                // pdf.text(`Update: ${downloadCount}`, 160, 10, { fontSize: 'small' } as any);
                content.style.display = 'block';
                console.log(`Page ${i + 1} added to PDF.`);
            }
            pdf.save('application_form.pdf');
            console.log("PDF saved successfully.");
            setIsDialogOpens(false);
            setDownloadingPDF(false);
            setShowDownloadButton(true);
            setDownloadCount(prevCount => prevCount + 1);
            console.log("Download process completed.");
        } catch (error) {
            setErrors(["Error generating PDF"]);
        } finally {
            const content = document.getElementById('pdfContent');
            if (content) content.style.display = 'none';
            setDownloadingPDF(false);
            setDownloadCount(prevCount => prevCount + 1);
        }
    };

    const downloadPDFClick = (kycId: number) => {
        console.log(`Download button clicked for kycId: ${kycId}`);
        setSelectedBank(kycId);
        fetchData(kycId.toString()).then(() => {
            setFormValues({
                application: {
                    memberName: '',
                    officeAddress: '',
                    pepCount: '',
                    date: '',
                    place: '',
                    authorizedSignatory: '',
                    designation: '',
                    stamp: ''
                },
                button: {
                    buttonText: ''
                },
                terms: {
                    termsContent: ''
                }
            });
            setIsDialogOpens(true);
            setTimeout(() => {
                const content = document.getElementById('pdfContent');
                if (content) {
                    downloadPDF();
                    console.log("downloadPDF function called.");
                } else {
                    console.error("pdfContent not found after dialog opened.");
                }
            }, 1000);
        });
    };

    const handleViewClick = (kycId: number) => {
        setSelectedBank(kycId);
        fetchData(kycId.toString());
        setFormValues({
            application: {
                memberName: '',
                officeAddress: '',
                pepCount: '',
                date: '',
                place: '',
                authorizedSignatory: '',
                designation: '',
                stamp: ''
            },
            button: {
                buttonText: ''
            },
            terms: {
                termsContent: ''
            }
        });
        setIsDialogOpen(true);
        navigate(`/BankViewGet/${kycId}`);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleDialogCloses = () => {
        setIsDialogOpens(false);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={6}>
                        <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
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
                                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', alignItems: 'center' }}>
                                        <div>S.No</div>
                                        <div>Name</div>
                                        <div>Date</div>
                                    </div>
                                    {banks.map((bank, index) => (
                                        <div key={bank.kycId} style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', alignItems: 'center', marginBottom: '10px' }}>
                                            <div>{index + 1}</div>
                                            <div
                                                onClick={() => handleBankClick(bank.kycId)} style={{
                                                    cursor: 'pointer', alignItems: 'center',
                                                    color: selectedBank === bank.kycId ? 'black' : 'blue'
                                                }}
                                            >
                                                {bank.name}
                                            </div>
                                            <div>{formatDate(bank.date)}</div>
                                            {selectedBank === bank.kycId && (
                                                <TableContainer component={Paper} style={{ width: '500px', marginTop: '10px', gridColumn: '1 / -1' }}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Description</TableCell>
                                                                <TableCell>Application</TableCell>
                                                                <TableCell>Download</TableCell>
                                                                <TableCell>View</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow key={index + 1}>
                                                                <TableCell>{bank.name}</TableCell>
                                                                <TableCell>{bank.kycId}</TableCell>
                                                                <TableCell>
                                                                    <IconButton onClick={() => downloadPDFClick(bank.kycId)}><FontAwesomeIcon icon={faDownload} style={{ fontSize: '14px', color: '#0066FF' }} /></IconButton>
                                                                    {downloadingPDF && <p style={{ color: 'red' }}>Please wait for the download...</p>}
                                                                </TableCell>
                                                                <TableCell><IconButton onClick={() => handleViewClick(bank.kycId)}><FontAwesomeIcon icon={faEye} style={{ fontSize: '14px', color: '#0066FF' }} /></IconButton></TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Container>
                        </Card>
                    </Box>
                </Box>
            </Box>
            <Dialog open={isDialogOpen} maxWidth='xl' onClose={handleDialogClose} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 2px 4px 100px', width: '100%' }}>
                <DialogTitle>Details</DialogTitle>
                <Box mt={2}>
                    <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <div style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Container style={{ width: '100%', minHeight: '297mm', marginTop: '2%' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {pages.map((pageContent, pageIndex) => (
                                        <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
                                            <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{ fontSize: 'small' }}>
                                                                <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                                                                <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                                                                <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {pageContent && pageContent.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell sx={{ width: '10%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                        {index + 1 + pageIndex * itemsPerPage}
                                                                    </TableCell>
                                                                    <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                        {item && item.name}
                                                                        {item && item.description && (
                                                                            <Typography variant="body2" color="textSecondary">
                                                                                {item.description}
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {item && item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : 'No answer available'}
                                                                        {errors[index + pageIndex * itemsPerPage] && (
                                                                            <Typography variant="caption" color="error">
                                                                                {errors[index + pageIndex * itemsPerPage]}
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                                                <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
                                            </div>
                                        </Paper>
                                    ))}
                                </LocalizationProvider>
                            </Container>
                        </div>
                    </Card>
                </Box>
            </Dialog>

            <Dialog open={isDialogOpens} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 2px 4px 100px', width: '100%' }}>
                <Box mt={2}>
                    <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                        <div style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                            <Container style={{ width: '100%', minHeight: '297mm', marginTop: '2%' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div id="pdfContent" style={{ display: 'none' }}>
                                        {pages.map((pageContent, pageIndex) => (
                                            <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
                                                <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                                    <TableContainer>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow sx={{ fontSize: 'small' }}>
                                                                    <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                                                                    <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                                                                    <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {pageContent && pageContent.map((item, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell sx={{ width: '10%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                            {index + 1 + pageIndex * itemsPerPage}
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                            {item && item.name}
                                                                            {item && item.description && (
                                                                                <Typography variant="body2" color="textSecondary">
                                                                                    {item.description}
                                                                                </Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item && item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : 'No answer available'}
                                                                            {errors[index + pageIndex * itemsPerPage] && (
                                                                                <Typography variant="caption" color="error">
                                                                                    {errors[index + pageIndex * itemsPerPage]}
                                                                                </Typography>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                                                    <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
                                                </div>
                                            </Paper>
                                        ))}
                                    </div>
                                </LocalizationProvider>
                            </Container>
                        </div>
                    </Card>
                </Box>
            </Dialog>

        </>
    );
};

export default BankViewGet;

// import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, Typography, SelectChangeEvent, Grid } from '@mui/material';
// import { Box } from '@mui/material';
// import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
// import ponsunImage from '../../../assets/ponsun.png';
// import contactImage from '../../../assets/contact.png';
// import Header from '../../../layouts/header/header';
// import { GetData, kycForm } from '../../../data/services/applicationfrom/applicationfrome-payload';
// import ApplicationfromeService from '../../../data/services/applicationfrom/applicationfrome-api-service';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDownload } from '@fortawesome/free-solid-svg-icons';
// import BankApiService from '../../../data/services/Bank/bank_api_service';
// import { BankData } from '../../../data/services/Bank/bank_payload';


// interface Bank {
//     name: string;
//     kycId: number;
// }

// interface TableData {
//     description: string;
//     application: number;
// }

// interface ButtonFormValues {
//     buttonText: string;
// };

// interface TermsFormValues {
//     termsContent: string;
// };


// interface FormValues {
//     application: ApplicationFormValues;
//     button: ButtonFormValues;
//     terms: TermsFormValues;
// };



// const bankTableData: { [key: number]: TableData[] } = {
//     75: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 1 },
//         { description: 'List', application: 2 }
//     ],
//     76: [
//         { description: 'Questionnaire', application: 3 },
//         { description: 'Declaration', application: 4 },
//         { description: 'List', application: 5 }
//     ],
//     77: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 9 },
//         { description: 'List', application: 12 }
//     ],
//     4: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 11 },
//         { description: 'List', application: 20 }
//     ],
//     5: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 10 },
//         { description: 'List', application: 14 }
//     ],
//     6: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 15 },
//         { description: 'List', application: 17 }
//     ],
//     7: [
//         { description: 'Questionnaire', application: 3 },
//         { description: 'Declaration', application: 7 },
//         { description: 'List', application: 4 }
//     ],
//     8: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 8 },
//         { description: 'List', application: 9 }
//     ],
//     9: [
//         { description: 'Questionnaire', application: 7 },
//         { description: 'Declaration', application: 4 },
//         { description: 'List', application: 23 }
//     ],
//     10: [
//         { description: 'Questionnaire', application: 1 },
//         { description: 'Declaration', application: 11 },
//         { description: 'List', application: 22 }
//     ]
// };

// const initialFormValues: FormValues = {
//     application: {
//         memberName: '',
//         officeAddress: '',
//         pepCount: '',
//         date: '',
//         place: '',
//         authorizedSignatory: '',
//         designation: '',
//         stamp: ''
//     },
//     button: {
//         buttonText: ''
//     },
//     terms: {
//         termsContent: ''
//     }
// };

// interface ApplicationFormValues {
//     memberName: string;
//     officeAddress: string;
//     pepCount: string;
//     date: string;
//     place: string;
//     authorizedSignatory: string;
//     designation: string;
//     stamp: string;
// }

// interface CustomerData {
//     kycFormDto: kycForm;
// }

// interface BankDatas {
//     fromDate: string;
//     toDate: string;
//     kycId: number;
//     name: string;
//     date: string;
// };


// const BankViewGet = () => {

//     const calculateWeekRange = (date: Date): [Date, Date] => {
//         const currentDate = new Date(date);
//         const dayOfWeek = currentDate.getDay();
//         const startDate = new Date(currentDate);
//         startDate.setDate(currentDate.getDate() - dayOfWeek);
//         const endDate = new Date(currentDate);
//         endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
//         return [startDate, endDate];
//     };

//     const [selectedOption, setSelectedOption] = useState<string>('daily');
//     const [currentDate, setCurrentDate] = useState<Date>(new Date());
//     const [startDate, setStartDate] = useState<Date>(new Date());
//     const [endDate, setEndDate] = useState<Date>(new Date());
//     const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
//     const bankApiService = new BankApiService();
//     const [searchPerformed, setSearchPerformed] = useState(false);
//     const [banks, setBanks] = useState<BankDatas[]>([]);
//     const navigate = useNavigate();
//     const [selectedBank, setSelectedBank] = useState<number | null>(null);
//     const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//     const [isDialogOpens, setIsDialogOpens] = useState<boolean>(false);
//     const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
//     const applicationfrome = new ApplicationfromeService();
//     const [loading, setLoading] = useState(true);
//     const responseId = sessionStorage.getItem('responseId');
//     const [formData, setFormData] = useState<kycForm[]>([]);
//     const [errors, setErrors] = useState<string[]>([]);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const itemsPerPage = 10;
//     const { kycId } = useParams<{ kycId: string }>();
//     const [downloadingPDF, setDownloadingPDF] = useState(false);
//     const [downloadCount, setDownloadCount] = useState(0);
//     const [showDownloadButton, setShowDownloadButton] = useState(true);


//     const formatDate = (dateString: string): string => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = date.toLocaleString('en-US', { month: 'short' });
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     function convert(str: string | number | Date) {
//         const date = new Date(str);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     const handleSearch = () => {
//         const formattedStartDate = convert(startDate);
//         const formattedEndDate = convert(endDate);
//         const startDateAsDate = new Date(formattedStartDate);
//         const endDateAsDate = new Date(formattedEndDate);
//         bankApiService
//             .getClientView(startDateAsDate, endDateAsDate)
//             .then((fetchedData: BankDatas[]) => {
//                 setSearchPerformed(true);
//                 const transformedData: BankData[] = fetchedData.map((entry) => {
//                     return {
//                         fromDate: entry.fromDate,
//                         toDate: entry.toDate,
//                         kycId: entry.kycId,
//                         name: entry.name,
//                         date: entry.date,
//                     };
//                 });
//                 setBanks(transformedData);
//             })
//             .catch((error) => {
//                 console.error('API request error:', error);
//             });
//     };

//     const handleStartChange = (date: Date) => {
//         let newStartDate = new Date(date);
//         if (selectedOption === 'weekly') {
//             const [weekStart, weekEnd] = calculateWeekRange(newStartDate);
//             setHighlightedWeek([weekStart, weekEnd]);
//         } else if (selectedOption === 'monthly') {
//             const firstDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
//             const lastDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
//             setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
//         }
//         setCurrentDate(newStartDate);
//         setStartDate(newStartDate);
//     };

//     const handleEndChange = (date: Date) => {
//         let newEndDate = new Date(date);
//         if (selectedOption === 'weekly') {
//             const [weekStart, weekEnd] = calculateWeekRange(newEndDate);
//             setHighlightedWeek([weekStart, weekEnd]);
//         } else if (selectedOption === 'monthly') {
//             const firstDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);
//             const lastDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
//             setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
//         }
//         setEndDate(newEndDate);
//     };

//     const getDisabledDates = (): [Date | null, Date | null] => {
//         const today = new Date();
//         let minDate: Date | null = new Date(today);
//         let maxDate: Date | null = new Date(today);
//         return [minDate, maxDate];
//     };

//     const disabledDates = getDisabledDates();



//     const handleBankClick = (kycId: number) => {
//         setSelectedBank(kycId === selectedBank ? null : kycId);
//     };

//     const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
//         const pages = [];
//         for (let i = 0; i < data.length; i += itemsPerPage) {
//             pages.push(data.slice(i, i + itemsPerPage));
//         }
//         return pages;
//     };
//     const pages = splitDataIntoPages(formData, itemsPerPage);

//     useEffect(() => {
//         if (responseId) {
//             fetchData(responseId.toString());
//         }
//     }, [responseId]);

//     const fetchData = async (responseId: string) => {
//         try {
//             setLoading(true);
//             const response = await applicationfrome.getkycData(responseId);
//             console.log('kycData:', response);
//             const customerData: CustomerData[] = response;
//             console.log('customerData:', customerData);
//             setFormData(customerData.map((data: CustomerData) => data.kycFormDto));
//         } catch (error) {
//             setErrors(["Error fetching data"]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadPDF = async () => {

//         setDownloadingPDF(true);
//         try {
//             setShowDownloadButton(false);
//             console.log("Starting PDF download...");


//             console.log("Content found for PDF generation.");
//             await new Promise(resolve => setTimeout(resolve, 0));
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const content = document.getElementById('pdfContent');
//             if (!content) {
//                 console.error("No content found for PDF generation.");
//                 setDownloadingPDF(false);
//                 setShowDownloadButton(true);
//                 return;
//             }
//             pdf.setFontSize(10);
//             pdf.setFont('helvetica');

//             const padding = 10;
//             const scale = 3;
//             const pageWidth = 210;
//             const pageHeight = 297;
//             const contentWidth = pageWidth - 2 * padding;
//             const contentHeight = pageHeight - 2 * padding;
//             const totalPages = content.childNodes.length;

//             console.log(`Total pages to process: ${totalPages}`);
//             content.style.display = 'block';

//             for (let i = 0; i < totalPages; i++) {
//                 const page = content.childNodes[i];
//                 const canvas = await html2canvas(page as HTMLElement, {
//                     scale: scale,
//                     useCORS: true,
//                     logging: true,
//                 });
//                 const imgData = canvas.toDataURL('image/png');
//                 console.log(`Image data for page ${i + 1} generated.`);

//                 if (i > 0) pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', padding, padding, contentWidth, contentHeight);
//                 pdf.setLineWidth(0.2);
//                 pdf.setDrawColor(0, 0, 0);
//                 pdf.rect(padding, padding, contentWidth, contentHeight);
//                 // pdf.text(`Update: ${downloadCount}`, 160, 10, { fontSize: 'small' } as any);
//                 content.style.display = 'block';

//                 console.log(`Page ${i + 1} added to PDF.`);
//             }

//             pdf.save('application_form.pdf');
//             console.log("PDF saved successfully.");
//             setIsDialogOpens(false);

//             setDownloadingPDF(false);
//             setShowDownloadButton(true);
//             setDownloadCount(prevCount => prevCount + 1);
//             console.log("Download process completed.");
//         } catch (error) {
//             setErrors(["Error generating PDF"]);
//         } finally {
//             const content = document.getElementById('pdfContent');
//             if (content) content.style.display = 'none';
//             setDownloadingPDF(false);
//             setDownloadCount(prevCount => prevCount + 1);
//         }
//     };

//     const downloadPDFClick = (kycId: number) => {
//         console.log(`Download button clicked for kycId: ${kycId}`);

//         setSelectedBank(kycId);
//         fetchData(kycId.toString()).then(() => {
//             setFormValues({
//                 application: {
//                     memberName: '',
//                     officeAddress: '',
//                     pepCount: '',
//                     date: '',
//                     place: '',
//                     authorizedSignatory: '',
//                     designation: '',
//                     stamp: ''
//                 },
//                 button: {
//                     buttonText: ''
//                 },
//                 terms: {
//                     termsContent: ''
//                 }
//             });

//             setIsDialogOpens(true);

//             setTimeout(() => {
//                 const content = document.getElementById('pdfContent');
//                 if (content) {
//                     downloadPDF();
//                     console.log("downloadPDF function called.");
//                 } else {
//                     console.error("pdfContent not found after dialog opened.");
//                 }
//             }, 1000);
//         });
//     };




//     const handleViewClick = (kycId: number) => {
//         setSelectedBank(kycId);
//         fetchData(kycId.toString());
//         setFormValues({
//             application: {
//                 memberName: '',
//                 officeAddress: '',
//                 pepCount: '',
//                 date: '',
//                 place: '',
//                 authorizedSignatory: '',
//                 designation: '',
//                 stamp: ''
//             },
//             button: {
//                 buttonText: ''
//             },
//             terms: {
//                 termsContent: ''
//             }
//         });
//         setIsDialogOpen(true);
//         navigate(`/BankViewGet/${kycId}`);
//     };

//     const handleDialogClose = () => {
//         setIsDialogOpen(false);
//     };

//     const handleDialogCloses = () => {
//         setIsDialogOpens(false);
//     };



//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                     <Box m={6}>
//                         <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
//                                 <Form>
//                                     <Row>
//                                         <Col xs={4}>
//                                             <Form.Group>
//                                                 <Row>
//                                                     <Col>
//                                                         <Form.Label>Start Date</Form.Label>
//                                                         <DatePicker
//                                                             selected={startDate}
//                                                             onChange={handleStartChange}
//                                                             dateFormat="MMMM d, yyyy"
//                                                             className="form-control"
//                                                             disabledKeyboardNavigation
//                                                             minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
//                                                             maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
//                                                             highlightDates={highlightedWeek}
//                                                         />
//                                                     </Col>
//                                                     <Col>
//                                                         <Form.Label>End Date</Form.Label>
//                                                         <DatePicker
//                                                             selected={endDate}
//                                                             onChange={handleEndChange}
//                                                             dateFormat="MMMM d, yyyy"
//                                                             className="form-control"
//                                                             disabledKeyboardNavigation
//                                                             minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
//                                                             maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
//                                                             highlightDates={highlightedWeek}
//                                                         />
//                                                     </Col>
//                                                 </Row>
//                                             </Form.Group>
//                                         </Col>
//                                         <Col xs={4}>
//                                             <Button variant="primary" style={{ marginTop: '8%' }} onClick={handleSearch}>
//                                                 Apply Dates
//                                             </Button>
//                                         </Col>
//                                     </Row>
//                                 </Form>
//                                 <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>

//                                     <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', alignItems: 'center' }}>
//                                         <div>S.No</div>
//                                         <div>Name</div>
//                                         <div>Date</div>
//                                     </div>
//                                     {banks.map((bank, index) => (
//                                         <div key={bank.kycId} style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', alignItems: 'center', marginBottom: '10px' }}>
//                                             <div>{index + 1}</div>
//                                             <div
//                                                 onClick={() => handleBankClick(bank.kycId)} style={{
//                                                     cursor: 'pointer', alignItems: 'center',
//                                                     color: selectedBank === bank.kycId ? 'black' : 'blue'
//                                                 }}
//                                             >
//                                                 {bank.name}
//                                             </div>
//                                             <div>{formatDate(bank.date)}</div>
//                                             {selectedBank === bank.kycId && (
//                                                 <TableContainer component={Paper} style={{ width: '500px', marginTop: '10px', gridColumn: '1 / -1' }}>
//                                                     <Table size="small">
//                                                         <TableHead>
//                                                             <TableRow>
//                                                                 <TableCell>Description</TableCell>
//                                                                 <TableCell>Application</TableCell>
//                                                                 <TableCell>Download</TableCell>
//                                                                 <TableCell>View</TableCell>
//                                                             </TableRow>
//                                                         </TableHead>
//                                                         <TableBody>
//                                                             {bankTableData[bank.kycId].map((row, idx) => (
//                                                                 <TableRow key={idx}>
//                                                                     <TableCell>{row.description}</TableCell>
//                                                                     <TableCell>{row.application}</TableCell>
//                                                                     <TableCell>
//                                                                         <Button onClick={() => downloadPDFClick(bank.kycId)}>Download<FontAwesomeIcon icon={faDownload} /></Button>
//                                                                         {downloadingPDF && <p style={{ color: 'red' }}>Please wait for the download...</p>}
//                                                                     </TableCell>
//                                                                     <TableCell><Button onClick={() => handleViewClick(bank.kycId)}>View</Button></TableCell>
//                                                                 </TableRow>
//                                                             ))}
//                                                         </TableBody>
//                                                     </Table>
//                                                 </TableContainer>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </Container>
//                         </Card>
//                     </Box>
//                 </Box>
//             </Box>

//             <Dialog open={isDialogOpen} maxWidth='xl' onClose={handleDialogClose} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 2px 4px 100px', width: '100%' }}>
//                 <DialogTitle>Details</DialogTitle>
//                 <Box mt={2}>

//                     <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                         <div style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <Container style={{ width: '100%', minHeight: '297mm', marginTop: '2%' }}>
//                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                     {/* <div id="pdfContent"> */}
//                                     {pages.map((pageContent, pageIndex) => (
//                                         <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
//                                             <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
//                                                 <img src={ponsunImage} alt="Ponsun" style={{ display: 'block', margin: '0 auto', maxWidth: '45%', marginBottom: '20px' }} />
//                                                 <TableContainer>
//                                                     <Table>
//                                                         <TableHead>
//                                                             <TableRow sx={{ fontSize: 'small' }}>
//                                                                 <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
//                                                                 <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
//                                                                 <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
//                                                             </TableRow>
//                                                         </TableHead>
//                                                         <TableBody>
//                                                             {pageContent && pageContent.map((item, index) => (
//                                                                 <TableRow key={index}>
//                                                                     <TableCell sx={{ width: '10%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                                                                         {index + 1 + pageIndex * itemsPerPage}
//                                                                     </TableCell>
//                                                                     <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                                                                         {item && item.name}
//                                                                         {item && item.description && (
//                                                                             <Typography variant="body2" color="textSecondary">
//                                                                                 {item.description}
//                                                                             </Typography>
//                                                                         )}
//                                                                     </TableCell>
//                                                                     <TableCell>
//                                                                         {item && item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : 'No answer available'}
//                                                                         {errors[index + pageIndex * itemsPerPage] && (
//                                                                             <Typography variant="caption" color="error">
//                                                                                 {errors[index + pageIndex * itemsPerPage]}
//                                                                             </Typography>
//                                                                         )}
//                                                                     </TableCell>
//                                                                 </TableRow>
//                                                             ))}
//                                                         </TableBody>
//                                                     </Table>
//                                                 </TableContainer>
//                                                 <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
//                                                 <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
//                                             </div>
//                                         </Paper>
//                                     ))}
//                                     {/* </div> */}
//                                 </LocalizationProvider>
//                             </Container>
//                         </div>
//                     </Card>
//                 </Box>
//             </Dialog>

//             <Dialog open={isDialogOpens} style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 2px 4px 100px', width: '100%' }}>{/*onClose={handleDialogCloses} */}
//                 {/* <DialogTitle>Details</DialogTitle> */}
//                 <Box mt={2}>
//                     <Card style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                         <div style={{ padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
//                             <Container style={{ width: '100%', minHeight: '297mm', marginTop: '2%' }}>
//                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                     <div id="pdfContent" style={{ display: 'none' }}>
//                                         {pages.map((pageContent, pageIndex) => (
//                                             <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
//                                                 <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
//                                                     <img src={ponsunImage} alt="Ponsun" style={{ display: 'block', margin: '0 auto', maxWidth: '45%', marginBottom: '20px' }} />
//                                                     <TableContainer>
//                                                         <Table>
//                                                             <TableHead>
//                                                                 <TableRow sx={{ fontSize: 'small' }}>
//                                                                     <TableCell sx={{ width: '10%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
//                                                                     <TableCell sx={{ width: '40%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
//                                                                     <TableCell sx={{ width: '50%', padding: '5px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
//                                                                 </TableRow>
//                                                             </TableHead>
//                                                             <TableBody>
//                                                                 {pageContent && pageContent.map((item, index) => (
//                                                                     <TableRow key={index}>
//                                                                         <TableCell sx={{ width: '10%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                                                                             {index + 1 + pageIndex * itemsPerPage}
//                                                                         </TableCell>
//                                                                         <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                                                                             {item && item.name}
//                                                                             {item && item.description && (
//                                                                                 <Typography variant="body2" color="textSecondary">
//                                                                                     {item.description}
//                                                                                 </Typography>
//                                                                             )}
//                                                                         </TableCell>
//                                                                         <TableCell>
//                                                                             {item && item.kycAnswerData && item.kycAnswerData.length > 0 ? item.kycAnswerData[0]?.answer : 'No answer available'}
//                                                                             {errors[index + pageIndex * itemsPerPage] && (
//                                                                                 <Typography variant="caption" color="error">
//                                                                                     {errors[index + pageIndex * itemsPerPage]}
//                                                                                 </Typography>
//                                                                             )}
//                                                                         </TableCell>
//                                                                     </TableRow>
//                                                                 ))}
//                                                             </TableBody>
//                                                         </Table>
//                                                     </TableContainer>
//                                                     <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
//                                                     <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
//                                                 </div>
//                                             </Paper>
//                                         ))}
//                                     </div>
//                                 </LocalizationProvider>
//                             </Container>
//                         </div>
//                     </Card>
//                 </Box>
//             </Dialog>

//         </>
//     );
// };

// export default BankViewGet;

