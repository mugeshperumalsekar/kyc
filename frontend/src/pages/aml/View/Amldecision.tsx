import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, Paper, Typography, Container, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
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
import { Branch, CompleteTeamDto } from '../../../data/services/aml/viewpage/view_payload';
import Header from '../../../layouts/header/header';

const View: React.FC = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const location = useLocation();
    const backendColumns = ['Photo', 'CustomerName', 'AccountNumber', 'ClientId', 'BranchName', 'BranchCode', 'AlertScenarios', 'Reply', 'Remark'];
    const componentRef = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef(null);
    const { complaintId, uid } = useParams();
    const [AmlTeam, setAmlTeam] = useState<CompleteTeamDto>({
        complaintDto: [{
            complaintId: 0,
            branchName: '',
            branchCode: '',
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
        }],
        alertScenarioDtos: [{
            complaintAlertId: 0,
            replyQry: '',
            alertScenarios: '',
        }],
        remarkDtos: [{
            remark: '',
        }],
    });
    const [Branch, setBranch] = useState<Branch[]>([]);
    const [amlComplainted, setAmlCounterfeited] = useState<CompleteTeamDto>({
        complaintDto: [{
            complaintId: 0,
            branchName: '',
            branchCode: '',
            clientId: '',
            accountNumber: '',
            targetCustomerName: '',
        }],
        alertScenarioDtos: [{
            complaintAlertId: 0,
            replyQry: '',
            alertScenarios: '',
        }],
        remarkDtos: [{
            remark: '',
        }],
    });

    useEffect(() => {
        const fetchData = async (complaintId: string, uid: string) => {
            try {
                const customerData = await view.getAmlCompleteTeam(complaintId);
                setAmlCounterfeited(customerData);

                console.log("API Response:", customerData);
                if (customerData && customerData.counterfeitTeamsDto) {
                    setAmlTeam({
                        complaintDto: customerData.counterfeitTeamsDto.map((complaint: any) => ({
                            complaintId: complaint.complaintId,
                            branchName: complaint.branchName,
                            branchCode: complaint.branchCode,
                            clientId: complaint.clientId,
                            accountNumber: complaint.accountNumber,
                            targetCustomerName: complaint.targetCustomerName,
                        })),
                        alertScenarioDtos: customerData.numberDtos.map((reply: any) => ({
                            complaintAlertId: reply.complaintAlertId,
                            replyQry: reply.replyQry,
                            alertScenarios: reply.alertScenarios,
                        })),
                        remarkDtos: customerData.remarkDtos.map((remark: any) => ({
                            id: remark.id,
                            remark: remark.remark,
                        })),
                    });
                } else {
                    console.error("Invalid data format");
                }
            } catch (error) {
                console.error("Error fetching AML data:", error);
            }
        };
        if (complaintId && uid) {
            fetchData(complaintId, uid);
        }
    }, [complaintId, uid]);

    useEffect(() => {
        fetchBranch();
    }, []);

    const view = new ViewService();
    const fetchBranch = async () => {
        try {
            const branch = await view.getBranch();
            setBranch(branch);
        } catch (error) {
            console.error("Error fetching branch list:", error);
        }
    };

    const navigate = useNavigate();
    const handleEditClick = (counterfeitId: string, uid: string) => {
        navigate(`/Amledit/${counterfeitId}/${uid}`);
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
            case 'BranchCode':
                return <FontAwesomeIcon icon={faCodeBranch} />;
            case 'AlertScenarios':
                return <FontAwesomeIcon icon={faShieldHalved} />;
            case 'Reply':
                return <FontAwesomeIcon icon={faClone} />;
            case 'Remark':
                return <FontAwesomeIcon icon={faComment} />;
            default:
                return null;
        }
    };

    const renderTableRows = () => {
        return backendColumns.map((columnName) => (
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
            });
            pdf.setFontSize(14);
            pdf.text('USER DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
            pdf.save('user_details.pdf');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        }
    };

    const renderColumnValue = (columnName: string) => {
        switch (columnName) {
            case 'Photo':
                return profileImageData ? (
                    <img src={profileImageData} alt="Profile" style={{ width: '100px', height: '100px' }} />
                ) : (
                    <img src={profile} alt="Default Avatar" style={{ width: '100px', height: '100px' }} />
                );
            case 'CustomerName':
                return amlComplainted?.complaintDto[0]?.targetCustomerName || 'Not Available';
            case 'AccountNumber':
                return amlComplainted?.complaintDto[0]?.accountNumber || 'Not Available';
            case 'ClientId':
                return amlComplainted?.complaintDto[0]?.clientId || 'Not Available';
            case 'BranchName':
                return amlComplainted?.complaintDto[0]?.branchName || ''|| 'Not Available';
            case 'BranchCode':
                return amlComplainted?.complaintDto[0]?.branchCode || 'Not Available';
            case 'AlertScenarios':
                return amlComplainted?.alertScenarioDtos?.map((data) => data.alertScenarios).join(', ') || 'Not Available';
            case 'Reply':
                return amlComplainted?.alertScenarioDtos?.map((data) => data.replyQry).join(', ') || 'Not Available';
            case 'Remark':
                return amlComplainted?.remarkDtos?.[0]?.remark || 'Not Available';
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
                                            {/* <h4 style={{ marginBottom: '1%' }}>QC VIEW</h4> */}
                                        </Grid>
                                    </Grid>
                                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                        <Table ref={tableRef}>
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
                                    if (complaintId && uid) {
                                        handleEditClick(complaintId, uid);
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

export default View;
