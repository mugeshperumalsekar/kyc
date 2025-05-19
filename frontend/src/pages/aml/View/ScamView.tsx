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
import { AlertScenariosData, Branch, GetScamDTO } from '../../../data/services/aml/viewpage/view_payload';
import Header from '../../../layouts/header/header';

const ScamView: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const location = useLocation();
    const [page, setPage] = useState(0);
    const backendColumns = ['Photo', 'Branch Code', 'BranchId', 'ClientId', 'Account Number', 'Target Customer Name', 'Scam Status', 'Remark', 'Observation'];
    const [showAllRows, setShowAllRows] = useState(false);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [showTable, setShowTable] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const textAreaRef = useRef<HTMLDivElement>(null);
    const [isError, setIsError] = useState(false);
    const { scamId, uid } = useParams();
    const [branchName, setBranchName] = useState('Not Available');
    const [Branch, setBranch] = useState<Branch[]>([]);
    const [AlertScenarios, setAlertScenarios] = useState<AlertScenariosData[]>([]);

    const [Amlscam, setAmlscam] = useState<GetScamDTO>({
        createScamTeamRequest: {
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
        scamStatusData: [
            {
                id: 0,
                scamId: 0,
                scamStatus: 'string',
                uid: loginDetails.id,
                branchId: 0,
                ticketId: 0,
                branchCode: 0
            },
        ],
        scamRemarkData: [
            {
                id: 0,
                remark: '',
                scamId: 0,
                branchId: 0,
                uid: loginDetails.id,
                ticketId: 0
            },
        ],
        scamObservationData: [
            {
                id: 0,
                observation: '',
                scamId: 0,
                branchId: 0,
                ticketId: 0,
                uid: loginDetails.id,
            },
        ],
    });

    const [amlScam, setAmlScam] = useState<GetScamDTO>({
        createScamTeamRequest: {
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
        scamStatusData: [{
            id: 0,
            scamId: 0,
            scamStatus: '',
            uid: loginDetails.id,
            branchId: 0,
            ticketId: 0,
            branchCode: 0
        },],
        scamRemarkData: [],
        scamObservationData: []
    });

    const view = new ViewService();

    useEffect(() => {
        const fetchData = async (scamId: string, uid: string) => {
            try {
                const customerData = await view.getAmlScamTeam(scamId);
                setAmlScam(customerData);
                if (customerData && customerData.scamStatusDtos) {
                    setAmlScam({
                        createScamTeamRequest: {
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
                        scamStatusData: customerData.scamStatusDtos.map((scenario: { id: any; scamId: any; branchId: any; uid: any; scamStatus: any; ticketId: any; branchCode: any; }) => ({
                            id: scenario.id,
                            scamId: scenario.scamId,
                            branchId: scenario.branchId,
                            uid: scenario.uid,
                            scamStatus: scenario.scamStatus,
                            ticketId: scenario.ticketId,
                            branchCode: scenario.branchCode,
                        })),
                        scamRemarkData: customerData.remarkDtos.map((reply: { id: any; replyQry: any; reply: any; complaintId: any; }) => ({
                            id: reply.id,
                            replyQry: reply.replyQry,
                            reply: reply.reply,
                            complaintId: reply.complaintId,
                            uid: loginDetails.id,
                        })),
                        scamObservationData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            complaintId: remark.complaintId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("Error: scamStatusDtos is undefined in the API response");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (scamId && uid) {
            fetchData(scamId, uid);
        }
    }, [scamId, uid]);

    useEffect(() => {
        fetchBranch();
        fetchScenarios();
    }, []);

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            console.log('branch:', branch);
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

    const handleEditClick = (scamId: string, uid: string) => {
        navigate(`/ScamEdit/${scamId}/${uid}`);
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
            case 'Scam Status':
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
            pdf.text('SCAM DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
            pdf.save('scam_details.pdf');
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
                return amlScam.createScamTeamRequest.branchCode || 'Not Available';
            case 'BranchId':
                return displayBranchName(amlScam.createScamTeamRequest.branchId) || 'Not Available';
            case 'ClientId':
                return amlScam.createScamTeamRequest.clientId || 'Not Available';
            case 'Account Number':
                return amlScam.createScamTeamRequest.accountNumber || 'Not Available';
            case 'Target Customer Name':
                return amlScam.createScamTeamRequest.targetCustomerName || 'Not Available';
            case 'Scam Status':
                return amlScam.scamStatusData && amlScam.scamStatusData.length > 0 ? amlScam.scamStatusData[0].scamStatus : 'Not Available';
            case 'Remark':
                return amlScam.scamRemarkData && amlScam.scamRemarkData.length > 0 ? amlScam.scamRemarkData[0].remark : 'Not Available';
            case 'Observation':
                if (amlScam.scamObservationData && amlScam.scamObservationData.length > 0) {
                    return (
                        <div>
                            {amlScam.scamObservationData.map((observation, index) => (
                                <Typography key={index} variant="body2" style={{ marginBottom: '10px' }}>
                                    {observation.observation}
                                </Typography>
                            ))}
                        </div>
                    );
                } else {
                    return 'Not Available';
                }
            // case 'Observation':
            //     return amlScam.scamObservationData && amlScam.scamObservationData.length > 0 ? amlScam.scamObservationData[0].observation : 'Not Available';
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
                                            <h4 style={{ marginBottom: '1%' }}>SCAM VIEW</h4>
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
                                    if (scamId !== undefined && uid !== undefined) {
                                        handleEditClick(scamId, uid);
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

export default ScamView;