import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, Paper, Typography, Container } from '@mui/material';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUser, faIdCard, faCodeBranch, faShieldHalved, faClone, faComment, faBank } from '@fortawesome/free-solid-svg-icons';
import ViewService from '../../../data/services/aml/viewpage/view_api_service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import profile from '../../../assets/Avatar.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';
import { TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
import { Branch } from '../../../data/services/aml/viewpage/view_payload';
import Header from '../../../layouts/header/header';
import CounterfeitApiService from '../../../data/services/aml/Reports/Counterfeit/counterfeit-api-service';
import { CounterfeitGetDto } from '../../../data/services/aml/Reports/Counterfeit/counterfeit-payload';

const CounterfeitView: React.FC = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const backendColumns = ['Photo', 'CustomerName', 'AccountNumber', 'ClientId', 'BranchName', 'Counterfeit Number', 'Denomination', 'Remark'];
    const [showAllRows, setShowAllRows] = useState(false);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const textAreaRef = useRef<HTMLDivElement>(null);
    const { counterfeitId, uid } = useParams();

    const [AmlCounterfeit, setAmlCounterfeit] = useState<CounterfeitGetDto>({
        createCounterfeitTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            branchCode: '',
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            uid: loginDetails.id,
        },
        counterfeitStatusData: [
            {
                id: 0,
                counterfeitStatus: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,
            },
        ],
        counterfeitRemarkData: [
            {
                id: 0,
                remark: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,
            },
        ],
        counterfeitNumberData: [
            {
                id: 0,
                counterfeitNo: '',
                denomination: '',
                counterfeitId: 0,
                uid: loginDetails.id,
                branchId: 0,

            },
        ],
    });

    const [Branch, setBranch] = useState<Branch[]>([]);

    const [amlComplainted, setAmlCounterfeited] = useState<CounterfeitGetDto>({
        createCounterfeitTeamRequest: {
            id: 0,
            ticketId: 0,
            branchId: 0,
            branchCode: '',
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
            uid: loginDetails.id,
        },
        counterfeitRemarkData: [
            {
                id: 0,
                remark: '',
                counterfeitId: 0,
                branchId: 0,
                uid: loginDetails.id,
            }
        ],
        counterfeitNumberData: [
            {
                id: 0,
                counterfeitNo: '',
                denomination: '',
                counterfeitId: 0,
                uid: loginDetails.id,
                branchId: 0,
            },
        ],
        counterfeitStatusData: [
            {
                id: 0,
                counterfeitStatus: '',
                counterfeitId: 0,
                uid: loginDetails.id,
                branchId: 0,
            }
        ]
    });

    const counterfeitview = new CounterfeitApiService();

    useEffect(() => {
        const fetchData = async (counterfeitId: string, uid: string) => {
            try {
                const customerData = await counterfeitview.getAmlCounterfeit(counterfeitId);
                setAmlCounterfeited(customerData);
                console.log("API Response:", customerData);
                if (customerData && customerData.counterfeitTeamsDto) {
                    setAmlCounterfeit({
                        createCounterfeitTeamRequest: {
                            ...(customerData.counterfeitTeamsDto[0] || {}),
                            uid: loginDetails.id,
                            id: 0,
                            ticketId: 0,
                            branchId: 0
                        },
                        counterfeitNumberData: customerData.numberDtos.map((reply: { id: any; denomination: any; counterfeitNo: any; counterfeitId: any; }) => ({
                            id: reply.id,
                            counterfeitNo: reply.counterfeitNo,
                            denomination: reply.denomination,
                            CounterfeitId: reply.counterfeitId,
                            uid: loginDetails.id,
                        })),
                        counterfeitRemarkData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
                            id: remark.id,
                            remark: remark.remark,
                            complaintId: remark.complaintId,
                            branchId: remark.branchId,
                            uid: loginDetails.id,
                        })),
                        counterfeitStatusData: customerData.statusDtos.map((status: { id: any; counterfeitStatus: any; counterfeitId: any; branchId: any; }) => ({
                            id: status.id,
                            counterfeitStatus: status.counterfeitStatus,
                            counterfeitId: status.counterfeitId,
                            branchId: status.branchId,
                            uid: loginDetails.id,
                        })),
                    });
                } else {
                    console.error("");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (counterfeitId && uid) {
            fetchData(counterfeitId, uid);
        }
    }, [counterfeitId, uid]);

    useEffect(() => {
        fetchBranch();
    }, []);

    const view = new ViewService();

    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const navigate = useNavigate();

    const handleEditClick = (counterfeitId: string, uid: string) => {
        navigate(`/CounterfeitEdit/${counterfeitId}/${uid}`);
    };

    const getbranchId = (branchId: string) => {
        const foundbranchId = Branch.find((c) => String(c.id) === branchId);
        return foundbranchId ? foundbranchId.name : 'Not Available';
    };

    const [profileImageData, setProfileImageData] = useState<string | null>(null);

    const getColumnIcon = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                return <FontAwesomeIcon icon={faUserCircle} />;
            case 'CustomerName':
                return <FontAwesomeIcon icon={faUser} />;
            case 'AccountNumber':
                return <FontAwesomeIcon icon={faBank} />;
            case 'ClientId':
                return <FontAwesomeIcon icon={faIdCard} />;
            case 'BranchName':
                return <FontAwesomeIcon icon={faCodeBranch} />;
            case 'Counterfeit Number':
                return <FontAwesomeIcon icon={faShieldHalved} />;
            case 'Denomination':
                return <FontAwesomeIcon icon={faClone} />;
            case 'Remark':
                return <FontAwesomeIcon icon={faComment} />;
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
            pdf.text('USER DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
            pdf.save('user_details.pdf');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderColumnValue = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                if (profileImageData) {
                    return (
                        <img
                            src={profileImageData}
                            alt="Profile"
                            style={{ width: '100px', height: '100px' }}
                        />
                    );
                } else {
                    return (
                        <img
                            src={profile}
                            alt="Default Avatar"
                            style={{ width: '100px', height: '100px' }}
                        />
                    );
                }
            case 'CustomerName':
                return amlComplainted.createCounterfeitTeamRequest.targetCustomerName || 'Not Available';
            case 'AccountNumber':
                return amlComplainted.createCounterfeitTeamRequest.accountNumber || 'Not Available';
            case 'ClientId':
                return amlComplainted.createCounterfeitTeamRequest.clientId || 'Not Available';
            case 'BranchName':
                return getbranchId(amlComplainted.createCounterfeitTeamRequest.branchId.toString()) || 'Not Available';
            case 'Counterfeit Number':
                if (amlComplainted.counterfeitNumberData.length > 0) {
                    return amlComplainted.counterfeitNumberData.map(data => data.counterfeitNo).join(', ');
                } else {
                    return 'Not Available';
                }
            case 'Denomination':
                if (amlComplainted.counterfeitNumberData.length > 0) {
                    return amlComplainted.counterfeitNumberData.map(data => data.denomination).join(', ');
                } else {
                    return 'Not Available';
                }
            case 'Remark':
                return amlComplainted.counterfeitRemarkData.length > 0 ? amlComplainted.counterfeitRemarkData[0].remark : 'Not Available';
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
                                margin: '6%',
                                padding: '1%',
                                boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                                marginLeft: '10%',
                                width: '80%',
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
                                            <h4 style={{ marginBottom: '1%' }}>QC VIEW</h4>
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
                                    if (counterfeitId !== undefined && uid !== undefined) {
                                        handleEditClick(counterfeitId, uid);
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

export default CounterfeitView;