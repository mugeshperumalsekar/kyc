import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, Paper, Typography, Container } from '@mui/material';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faIdCard, faCodeBranch, faPortrait, faBinoculars, faKey, faCreditCard, faPen, faListAlt } from '@fortawesome/free-solid-svg-icons';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import profile from '../../../assets/Avatar.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
import { AlertScenariosData, Branch, GetFraudDTO } from '../../../data/services/aml/viewpage/view_payload';
import Header from '../../../layouts/header/header';

const FraudView: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const location = useLocation();
    const [page, setPage] = useState(0);
    const backendColumns = ['Photo', 'Branch Code', 'BranchId', 'ClientId', 'Account Number', 'Target Customer Name', 'Fraud Status', 'Remark', 'Observation'];
    const [showAllRows, setShowAllRows] = useState(false);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showTable, setShowTable] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const textAreaRef = useRef<HTMLDivElement>(null);
    const [isError, setIsError] = useState(false);
    const { fraudId, uid } = useParams();

    const [Amlfraud, setAmlfraud] = useState<GetFraudDTO>({
        createFraudTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            uid: loginDetails.id,
            branchCode: '',
            ticketStatus: ''
        },
        fraudStatusData: [
            {
                id: 0,
                fraudId: 0,
                fraudStatus: 'string',
                uid: loginDetails.id,
                branchId: 0,
                ticketId: 0,
                branchCode: 0
            },
        ],
        fraudRemarkData: [
            {
                id: 0,
                remark: '',
                fraudId: 0,
                branchId: 0,
                uid: loginDetails.id,
                ticketId: 0
            },
        ],
        fraudObservationData: [
            {
                id: 0,
                observation: '',
                fraudId: 0,
                branchId: 0,
                ticketId: 0,
                uid: loginDetails.id,
            },
        ],
    });

    const [Branch, setBranch] = useState<Branch[]>([]);
    const [AlertScenarios, setAlertScenarios] = useState<AlertScenariosData[]>([]);

    const [amlFraud, setAmlFraud] = useState<GetFraudDTO>({
        createFraudTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            branchCode: '',
            ticketStatus: '',
            uid: 0
        },
        fraudStatusData: [{
            id: 0,
            fraudId: 0,
            fraudStatus: '',
            uid: loginDetails.id,
            branchId: 0,
            ticketId: 0,
            branchCode: 0
        },],
        fraudRemarkData: [],
        fraudObservationData: []
    });

    const view = new ViewService();

    useEffect(() => {
        const fetchData = async (fraudId: string, uid: string) => {
            try {
                const customerData = await view.getAmlFraudTeam(fraudId);
                setAmlFraud(customerData);
                if (customerData && customerData.fraudStatusDtos) {
                    setAmlFraud({
                        createFraudTeamRequest: {
                            id: 0,
                            ticketId: 0,
                            branchId: 0,
                            clientId: "",
                            accountNumber: "",
                            targetCustomerName: "",
                            branchCode: "",
                            ticketStatus: "",
                            uid: 0,
                        },
                        fraudStatusData: customerData.fraudStatusDtos.map((scenario: { id: any; fraudId: any; branchId: any; uid: any; fraudStatus: any; ticketId: any; branchCode: any; }) => ({
                            id: scenario.id,
                            fraudId: scenario.fraudId,
                            branchId: scenario.branchId,
                            uid: scenario.uid,
                            fraudStatus: scenario.fraudStatus,
                            ticketId: scenario.ticketId,
                            branchCode: scenario.branchCode,
                        })),
                        fraudRemarkData: customerData.remarkDtos.map((reply: { id: any; replyQry: any; reply: any; complaintId: any; }) => ({
                            id: reply.id,
                            replyQry: reply.replyQry,
                            reply: reply.reply,
                            complaintId: reply.complaintId,
                            uid: loginDetails.id,
                        })),
                        fraudObservationData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            complaintId: remark.complaintId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("Error: fraudStatusDtos is undefined in the API response");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (fraudId && uid) {
            fetchData(fraudId, uid);
        }
    }, [fraudId, uid]);

    useEffect(() => {
        fetchBranch();
        fetchScenarios();
    }, []);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const fetchScenarios = async () => {
        try {
            const AlertScenarios = await view.getScenarios();
            setAlertScenarios(AlertScenarios);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const navigate = useNavigate();

    const handleEditClick = (fraudId: string, uid: string) => {
        navigate(`/FraudEdit/${fraudId}/${uid}`);
    };

    const [profileImageData, setProfileImageData] = useState<string | null>(null);

    const getColumnIcon = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                return <FontAwesomeIcon icon={faUserCircle} />;
            case 'Branch Code':
                return <FontAwesomeIcon icon={faCodeBranch} />;
            case 'BranchId':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'ClientId':
                return <FontAwesomeIcon icon={faKey} />;
            case 'Account Number':
                return <FontAwesomeIcon icon={faCreditCard} />;
            case 'Target Customer Name':
                return <FontAwesomeIcon icon={faPortrait} />;
            case 'Fraud Status':
                return <FontAwesomeIcon icon={faListAlt} />;
            case 'Remark':
                return <FontAwesomeIcon icon={faPen} />;
            case 'Observation':
                return <FontAwesomeIcon icon={faBinoculars} />;
            default:
                return null;
        }
    };

    const renderTableRows = () => {
        return backendColumns.map((columnName, index) => (
            <TableRow key={columnName} style={{ height: '30px' }}>
                <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
                        <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
                        <Typography variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
                            {columnName}
                        </Typography>
                    </div>
                </TableCell>
                <TableCell>
                    <div style={{ marginLeft: '20px' }}>
                        {renderColumnValue(columnName)}
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            const tableElement = tableRef.current;
            if (!tableElement) {
                console.error("Table element is null");
                return;
            }
            const canvas = await html2canvas(tableElement, { scale: 3 });
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                precision: 16,
                putOnlyUsedFonts: true,
                floatPrecision: 16,
            });
            pdf.setLineWidth(0.5);
            pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10);
            pdf.setFontSize(14);
            pdf.text('FRAUD DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
            pdf.save('fraud_details.pdf');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayBranchName = (branchId: number): string => {
        const branch = Branch.find(b => b.id === branchId);
        return branch ? branch.name : 'Not Available';
    };

    const renderColumnValue = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                if (profileImageData) {
                    return (
                        <img
                            src={profileImageData}
                            alt="Profile"
                            style={{
                                width: '100px',
                                height: '100px',
                            }}
                        />
                    );
                } else {
                    return (
                        <img
                            src={profile}
                            alt="Default Avatar"
                            style={{
                                width: '100px',
                                height: '100px',
                            }}
                        />
                    );
                }
            case 'Branch Code':
                return amlFraud.createFraudTeamRequest.branchCode || 'Not Available';
            case 'BranchId':
                return displayBranchName(amlFraud.createFraudTeamRequest.branchId) || 'Not Available';
            case 'ClientId':
                return amlFraud.createFraudTeamRequest.clientId || 'Not Available';
            case 'Account Number':
                return amlFraud.createFraudTeamRequest.accountNumber || 'Not Available';
            case 'Target Customer Name':
                return amlFraud.createFraudTeamRequest.targetCustomerName || 'Not Available';
            case 'Fraud Status':
                return amlFraud.fraudStatusData && amlFraud.fraudStatusData.length > 0 ? amlFraud.fraudStatusData[0].fraudStatus : 'Not Available';
            case 'Remark':
                return amlFraud.fraudRemarkData && amlFraud.fraudRemarkData.length > 0 ? amlFraud.fraudRemarkData[0].remark : 'Not Available';
            case 'Observation':
                return amlFraud.fraudObservationData && amlFraud.fraudObservationData.length > 0 ? amlFraud.fraudObservationData[0].observation : 'Not Available';
            default:
                return 'Not Available';
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={6}>
                        <Card
                            style={{
                                padding: '1%',
                                boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                                width: '100%',
                            }}
                        >
                            <Container
                                style={{
                                    maxWidth: 'none',
                                    backgroundColor: 'white',
                                    margin: '10px',
                                }}
                            >
                                <Box m={4}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item>
                                            <h4 style={{ marginBottom: '1%' }}>FRAUD VIEW</h4>
                                        </Grid>
                                    </Grid>
                                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                        <Table ref={tableRef}>
                                            <TableHead>
                                            </TableHead>
                                            <TableBody>{renderTableRows()}</TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button style={{ marginRight: '1%' }} onClick={handleDownloadPDF}>
                                            Download PDF
                                        </Button>
                                    </div>
                                </Box>
                            </Container>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button style={{ marginRight: '1%' }} onClick={() => {
                                    if (fraudId !== undefined && uid !== undefined) {
                                        handleEditClick(fraudId, uid);
                                    }
                                }}>
                                    Edit
                                </Button>
                            </div>
                        </Card>
                    </Box>
                    <div ref={componentRef}></div>
                </Box>
            </Box>
        </>
    );
};

export default FraudView;