// // import React, { useState, useEffect, useRef } from 'react';
// // import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Paper, Typography, TextareaAutosize, Container } from '@mui/material';
// // import { Card } from 'react-bootstrap';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faTimes, faPlusCircle, faTrash, faPlus, faUserCircle, faUser, faIdCard, faPhone, faMailBulk, faBirthdayCake, faMapMarker, faVenus, faMars } from '@fortawesome/free-solid-svg-icons';
// // import ViewService from '../../../data/services/aml/viewpage/view_api_service';
// // import { useLocation, useNavigate, useParams } from 'react-router-dom';
// // import profile from '../../../assets/Avatar.png';
// // import jsPDF from 'jspdf';
// // import 'jspdf-autotable';
// // import { renderToString } from 'react-dom/server';
// // import html2canvas from 'html2canvas';
// // import { useSelector } from 'react-redux';
// // import { TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
// // import { AlertScenariosData, AmlComplaintDto, CompleteTeamDto, Branch } from '../../../data/services/aml/viewpage/view_payload';
// // import Header from '../../../layouts/header/header';

// // const View: React.FC = () => {
// //     const userDetails = useSelector((state: any) => state.loginReducer);
// //     const loginDetails = userDetails.loginDetails;
// //     const location = useLocation();

// //     const [page, setPage] = useState(0);
// //     const backendColumns = ['Photo', 'CustomerName', 'AccountNumber', 'ClientId', 'BranchName', 'AlertScenarios', 'Reply', 'ReplyQry', 'Remark'];
// //     const [showMoreDetails, setShowMoreDetails] = useState(false);
// //     const [showMoreLLPsDetails, setShowMoreLLPsDetails] = useState(false);
// //     const [showMoreBussinessDetails, setShowMoreBussinessDetails] = useState(false);
// //     const [showAllRows, setShowAllRows] = useState(false);
// //     const componentRef = useRef<HTMLDivElement | null>(null);
// //     const [showTable, setShowTable] = useState(false);
// //     const [isHovered, setIsHovered] = useState(false);
// //     const tableRef = useRef(null);
// //     const [loading, setLoading] = useState(false);
// //     const textAreaRef = useRef<HTMLDivElement>(null);
// //     const [isError, setIsError] = useState(false);
// //     const tableStyle = {
// //         fontFamily: 'Times New Roman',
// //         fontWeight: 'bold',
// //     };
// //     const handleMouseOver = () => {
// //         setIsHovered(true);
// //     };

// //     const handleMouseOut = () => {
// //         setIsHovered(false);
// //     };

// //     const buttonStyle = {
// //         backgroundColor: isHovered ? '#135688' : '#1976D2',
// //         color: '#fff',
// //     };

// //     const { complaintId, uid } = useParams();

// //     const [AmlComplaint, setAmlComplaint] = useState<AmlComplaintDto>({
// //         createAmlComplaintTeamRequest: {
// //             id: 0,
// //             ticketId: 0,
// //             branchId: 0,
// //             clientId: '',
// //             accountNumber: '',
// //             targetCustomerName: '',
// //             uid: loginDetails.id,
// //         },
// //         amlComplaintAlertScenariosData: [
// //             {
// //                 id: 0,
// //                 complaintId: 0,
// //                 replyQry: '',
// //                 scenarioId: 0,
// //                 uid: loginDetails.id,
// //             },
// //         ],

// //         amlComplaintRemarkData: [
// //             {
// //                 id: 0,
// //                 remark: '',
// //                 complaintId: 0,
// //                 branchId: 0,
// //                 uid: loginDetails.id,
// //             },
// //         ],
// //     });
// //     const [Branch, setBranch] = useState<Branch[]>([]);
// //     const [AlertScenarios, setAlertScenarios] = useState<AlertScenariosData[]>([]);

// //     const [amlComplainted, setAmlComplainted] = useState<CompleteTeamDto>({
// //         complaintDto: [],
// //         alertScenarioDtos: [],
// //         remarkDtos: [],
// //         replyDtos: []
// //     });
// //     const view = new ViewService();
// //     useEffect(() => {
// //         const fetchData = async (complaintId: string, uid: string) => {
// //             try {
// //                 const customerData = await view.getAmlCompleteTeam(complaintId);
// //                 setAmlComplainted(customerData);

// //                 console.log("API Response:", customerData);

// //                 // Check if alertScenarioDtos is available before accessing it
// //                 if (customerData && customerData.alertScenarioDtos) {
// //                     setAmlComplaint({
// //                         createAmlComplaintTeamRequest: {
// //                             ...(customerData.complaintDto[0] || {}),
// //                             uid: loginDetails.id,
// //                             id: 0,
// //                             ticketId: 0,
// //                             branchId: 0
// //                         },
// //                         amlComplaintAlertScenariosData: customerData.alertScenarioDtos.map((scenario: { id: any; complaintId: any; scenarioId: any; replyQry: any; }) => ({
// //                             id: scenario.id,
// //                             complaintId: scenario.complaintId,
// //                             replyQry: scenario.replyQry,
// //                             scenarioId: scenario.scenarioId,
// //                             uid: loginDetails.id,
// //                         })),

// //                         amlComplaintRemarkData: customerData.remarkDtos.map((remark: { id: any; remark: any; complaintId: any; branchId: any; }) => ({
// //                             id: remark.id,
// //                             remark: remark.remark,
// //                             complaintId: remark.complaintId,
// //                             branchId: remark.branchId,
// //                             uid: loginDetails.id,
// //                         })),
// //                     });
// //                 } else {
// //                     console.error("Error: alertScenarioDtos is undefined in the API response");
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching AML data:", error);
// //             }
// //         };


// //         if (complaintId && uid) {
// //             fetchData(complaintId, uid);
// //         }
// //     }, [complaintId, uid]);


// //     useEffect(() => {
// //         fetchBranch();
// //         fetchScenarios();
// //         // window.scrollTo(0, 0);
// //     }, []);
// //     const fetchBranch = async () => {
// //         try {
// //             const branch = await view.getBranch();
// //             setBranch(branch);
// //         }
// //         catch (error) {
// //             console.error("Error fetching associated list:", error);
// //         }
// //     };
// //     const fetchScenarios = async () => {
// //         try {
// //             const AlertScenarios = await view.getScenarios();
// //             setAlertScenarios(AlertScenarios);
// //             console.log('AlertScenarios:', AlertScenarios);
// //         }
// //         catch (error) {
// //             console.error("Error fetching associated list:", error);
// //         }
// //     };

// //     const navigate = useNavigate();
// //     const handleEditClick = (complaintId: string, uid: string) => {
// //         console.log('Edit button clicked');
// //         navigate(`/Amlbranchedit/${complaintId}/${uid}`);
// //     };

// //     const getgenderregulatorListId = (branchId: string) => {
// //         const foundbranchId = Branch.find((c) => String(c.id) === branchId);
// //         return foundbranchId ? foundbranchId.name : 'Not Available';
// //     };


// //     const [profileImageData, setProfileImageData] = useState<string | null>(null);
// //     const getColumnIcon = (columnName: string) => {
// //         switch (columnName) {
// //             case 'Photo':
// //                 return <FontAwesomeIcon icon={faUserCircle} />;
// //             case 'CustomerName':
// //                 return <FontAwesomeIcon icon={faUser} />;
// //             case 'PAN':
// //                 return <FontAwesomeIcon icon={faIdCard} />;
// //             case 'Directors Identification Number (DIN)':
// //                 return <FontAwesomeIcon icon={faIdCard} />;
// //             case 'AKA Name':
// //                 return <FontAwesomeIcon icon={faUser} />;
// //             default:
// //                 return null;
// //         }
// //     };

// //     const toggleDetails = () => {
// //         setShowMoreDetails(!showMoreDetails);
// //     };

// //     const toggleLLPsDetails = () => {
// //         setShowMoreLLPsDetails(!showMoreLLPsDetails);
// //     };
// //     const toggleBussinessDetails = () => {
// //         setShowMoreBussinessDetails(!showMoreBussinessDetails);
// //     };

// //     const renderTableRows = () => {
// //         return backendColumns.map((columnName, index) => (
// //             <TableRow key={columnName} style={{ height: '30px' }}>
// //                 <TableCell>
// //                     <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
// //                         <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
// //                         <Typography variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
// //                             {columnName}
// //                         </Typography>
// //                     </div>
// //                 </TableCell>
// //                 <TableCell>
// //                     <div style={{ marginLeft: '20px' }}>
// //                         {renderColumnValue(columnName)}
// //                     </div>
// //                 </TableCell>
// //             </TableRow>
// //         ));
// //     };

// //     const handleDownloadPDF = async () => {
// //         try {
// //             setLoading(true);
// //             const tableElement = tableRef.current;
// //             if (!tableElement) {
// //                 console.error("Table element is null");
// //                 return;
// //             }
// //             const canvas = await html2canvas(tableElement, { scale: 3 });
// //             const pdf = new jsPDF({
// //                 unit: 'mm',
// //                 format: 'a4',
// //                 orientation: 'portrait',
// //                 precision: 16,
// //                 putOnlyUsedFonts: true,
// //                 floatPrecision: 16,
// //             });
// //             pdf.setLineWidth(0.5);
// //             pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10);
// //             pdf.setFontSize(14);
// //             pdf.text('USER DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
// //             pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
// //             pdf.save('user_details.pdf');
// //         } catch (error) {
// //             console.error('Error exporting to PDF:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const renderColumnValue = (columnName: string,) => {
// //         switch (columnName) {
// //             case 'Photo':
// //                 if (profileImageData) {
// //                     return (
// //                         <img
// //                             src={profileImageData}
// //                             alt="Profile"
// //                             style={{
// //                                 width: '100px',
// //                                 height: '100px',
// //                             }}
// //                         />
// //                     );
// //                 } else {
// //                     return (
// //                         <img
// //                             src={profile}
// //                             alt="Default Avatar"
// //                             style={{
// //                                 width: '100px',
// //                                 height: '100px',
// //                             }}
// //                         />
// //                     );
// //                 }
// //             case 'CustomerName':
// //                 return AmlComplaint.createAmlComplaintTeamRequest.targetCustomerName || 'Not Available';
// //             case 'AccountNumber':
// //                 return AmlComplaint.createAmlComplaintTeamRequest.accountNumber || 'Not Available';
// //             case 'ClientId':
// //                 return AmlComplaint.createAmlComplaintTeamRequest.clientId || 'Not Available';

// //             case 'Regulator List':
// //                 return getgenderregulatorListId(AmlComplaint.createAmlComplaintTeamRequest.branchId.toString()) || 'Not Available';



// //             case 'AlertScenarios':
// //                 return AmlComplaint.amlComplaintAlertScenariosData.length > 0 ? AmlComplaint.amlComplaintAlertScenariosData[0].scenarioId : 'Not Available';
// //                 return AmlComplaint.amlComplaintAlertScenariosData.length > 0 ? AmlComplaint.amlComplaintAlertScenariosData[0].replyQry : 'Not Available';


// //             case 'Remark':
// //                 return AmlComplaint.amlComplaintRemarkData.length > 0 ? AmlComplaint.amlComplaintRemarkData[0].remark : 'Not Available';
// //             default:
// //                 return 'Not Available';
// //         }
// //     };

// //     return (
// //         <>
// //             <Box sx={{ display: 'flex' }}>
// //                 <Header />
// //                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
// //                     <Box m={6}>
// //                         <Card
// //                             style={{
// //                                 margin: '6%',
// //                                 padding: '1%',
// //                                 boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
// //                                 marginLeft: '10%',
// //                                 width: '80%',
// //                             }}
// //                         >
// //                             <Container
// //                                 style={{
// //                                     maxWidth: 'none',
// //                                     backgroundColor: 'white',
// //                                     margin: '10px',
// //                                 }}
// //                             >
// //                                 <Box m={4}>
// //                                     <Grid container justifyContent="space-between" alignItems="center">
// //                                         <Grid item>
// //                                             <h4 style={{ marginBottom: '1%' }}>QC VIEW</h4>
// //                                         </Grid>
// //                                     </Grid>
// //                                     <TableContainer component={Paper} style={{ marginTop: '20px' }}>
// //                                         <Table ref={tableRef}>
// //                                             <TableHead>
// //                                                 {/* <TableRow>
// //                                                     <TableCell>Column</TableCell>
// //                                                     <TableCell>Value</TableCell>
// //                                                 </TableRow> */}
// //                                             </TableHead>
// //                                             <TableBody>{renderTableRows()}</TableBody>
// //                                         </Table>
// //                                     </TableContainer>
// //                                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
// //                                         <Button style={{ marginRight: '1%' }} onClick={handleDownloadPDF}>
// //                                             Download PDF
// //                                         </Button>
// //                                         {/* <Button variant="primary" style={{ marginRight: '1%' }} onClick={() => {
// //                                     if (complaintId !== undefined && uid !== undefined) {
// //                                         handleEditClick(complaintId, uid);
// //                                     }
// //                                 }}>
// //                                     Edit
// //                                 </Button> */}
// //                                     </div>
// //                                 </Box>
// //                             </Container>
// //                             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

// //                             <Button style={{ marginRight: '1%' }} onClick={() => {
// //                                     if (complaintId !== undefined && uid !== undefined) {
// //                                         handleEditClick(complaintId, uid);
// //                                     }
// //                                 }}>
// //                                     Edit
// //                                 </Button>

// //                             </div>
// //                         </Card>
// //                     </Box>
// //                     <div ref={componentRef}></div>
// //                 </Box>
// //             </Box>
// //         </>
// //     );
// // };

// // export default View;

// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Button, Grid, Paper, Typography, Container, TableContainer, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
// import { Card } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserCircle, faUser, faIdCard, faCodeBranch, faShieldHalved, faClone, faComment, faBank } from '@fortawesome/free-solid-svg-icons';
// import ViewService from '../../../data/services/aml/viewpage/view_api_service';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import profile from '../../../assets/Avatar.png';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import html2canvas from 'html2canvas';
// import { useSelector } from 'react-redux';
// import { Branch, CompleteTeamDto } from '../../../data/services/aml/viewpage/view_payload';
// import Header from '../../../layouts/header/header';

// const View: React.FC = () => {
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const location = useLocation();
//     const backendColumns = ['Photo', 'CustomerName', 'AccountNumber', 'ClientId', 'BranchName', 'BranchCode', 'AlertScenarios', 'Reply', 'Remark'];
//     const componentRef = useRef<HTMLDivElement | null>(null);
//     const tableRef = useRef(null);
//     const { complaintId, uid } = useParams();
//     const [AmlTeam, setAmlTeam] = useState<CompleteTeamDto>({
//         complaintDto: [{
//             complaintId: 0,
//             branchName: '',
//             branchCode: '',
//             clientId: '',
//             accountNumber: '',
//             targetCustomerName: '',
//         }],
//         alertScenarioDtos: [{
//             complaintAlertId: 0,
//             replyQry: '',
//             alertScenarios: '',
//         }],
//         remarkDtos: [{
//             remark: '',
//         }],
//     });
//     const [Branch, setBranch] = useState<Branch[]>([]);
//     const [amlComplainted, setAmlCounterfeited] = useState<CompleteTeamDto>({
//         complaintDto: [{
//             complaintId: 0,
//             branchName: '',
//             branchCode: '',
//             clientId: '',
//             accountNumber: '',
//             targetCustomerName: '',
//         }],
//         alertScenarioDtos: [{
//             complaintAlertId: 0,
//             replyQry: '',
//             alertScenarios: '',
//         }],
//         remarkDtos: [{
//             remark: '',
//         }],
//     });

//     useEffect(() => {
//         const fetchData = async (complaintId: string, uid: string) => {
//             try {
//                 const customerData = await view.getAmlCompleteTeam(complaintId);
//                 setAmlCounterfeited(customerData);

//                 console.log("API Response:", customerData);
//                 if (customerData && customerData.counterfeitTeamsDto) {
//                     setAmlTeam({
//                         complaintDto: customerData.counterfeitTeamsDto.map((complaint: any) => ({
//                             complaintId: complaint.complaintId,
//                             branchName: complaint.branchName,
//                             branchCode: complaint.branchCode,
//                             clientId: complaint.clientId,
//                             accountNumber: complaint.accountNumber,
//                             targetCustomerName: complaint.targetCustomerName,
//                         })),
//                         alertScenarioDtos: customerData.numberDtos.map((reply: any) => ({
//                             complaintAlertId: reply.complaintAlertId,
//                             replyQry: reply.replyQry,
//                             alertScenarios: reply.alertScenarios,
//                         })),
//                         remarkDtos: customerData.remarkDtos.map((remark: any) => ({
//                             id: remark.id,
//                             remark: remark.remark,
//                         })),
//                     });
//                 } else {
//                     console.error("Invalid data format");
//                 }
//             } catch (error) {
//                 console.error("Error fetching AML data:", error);
//             }
//         };
//         if (complaintId && uid) {
//             fetchData(complaintId, uid);
//         }
//     }, [complaintId, uid]);

//     useEffect(() => {
//         fetchBranch();
//     }, []);

//     const view = new ViewService();
//     const fetchBranch = async () => {
//         try {
//             const branch = await view.getBranch();
//             setBranch(branch);
//         } catch (error) {
//             console.error("Error fetching branch list:", error);
//         }
//     };

//     const navigate = useNavigate();
//     const handleEditClick = (counterfeitId: string, uid: string) => {
//         navigate(`/CounterfeitEdit/${counterfeitId}/${uid}`);
//     };

//     const getBranchName = (branchId: string) => {
//         const foundBranch = Branch.find((c) => String(c.id) === branchId);
//         return foundBranch ? foundBranch.name : 'Not Available';
//     };

//     const [profileImageData, setProfileImageData] = useState<string | null>(null);
//     const getColumnIcon = (columnName: string) => {
//         switch (columnName) {
//             case 'Photo':
//                 return <FontAwesomeIcon icon={faUserCircle} />;
//             case 'CustomerName':
//                 return <FontAwesomeIcon icon={faUser} />;
//             case 'AccountNumber':
//                 return <FontAwesomeIcon icon={faBank} />;
//             case 'ClientId':
//                 return <FontAwesomeIcon icon={faIdCard} />;
//             case 'BranchName':
//                 return <FontAwesomeIcon icon={faCodeBranch} />;
//             case 'BranchCode':
//                 return <FontAwesomeIcon icon={faCodeBranch} />;
//             case 'AlertScenarios':
//                 return <FontAwesomeIcon icon={faShieldHalved} />;
//             case 'Reply':
//                 return <FontAwesomeIcon icon={faClone} />;
//             case 'Remark':
//                 return <FontAwesomeIcon icon={faComment} />;
//             default:
//                 return null;
//         }
//     };

//     const renderTableRows = () => {
//         return backendColumns.map((columnName) => (
//             <TableRow key={columnName} style={{ height: '30px' }}>
//                 <TableCell>
//                     <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
//                         <span style={{ marginRight: '10px' }}>{getColumnIcon(columnName)}</span>
//                         <Typography variant="body1" fontWeight="bold" style={{ marginLeft: '3px', lineHeight: '1' }}>
//                             {columnName}
//                         </Typography>
//                     </div>
//                 </TableCell>
//                 <TableCell>
//                     <div style={{ marginLeft: '20px' }}>
//                         {renderColumnValue(columnName)}
//                     </div>
//                 </TableCell>
//             </TableRow>
//         ));
//     };

//     const handleDownloadPDF = async () => {
//         try {
//             const tableElement = tableRef.current;
//             if (!tableElement) {
//                 console.error("Table element is null");
//                 return;
//             }
//             const canvas = await html2canvas(tableElement, { scale: 3 });
//             const pdf = new jsPDF({
//                 unit: 'mm',
//                 format: 'a4',
//                 orientation: 'portrait',
//             });
//             pdf.setFontSize(14);
//             pdf.text('USER DETAILS', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
//             pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 20, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 30);
//             pdf.save('user_details.pdf');
//         } catch (error) {
//             console.error('Error exporting to PDF:', error);
//         }
//     };

//     const renderColumnValue = (columnName: string) => {
//         switch (columnName) {
//             case 'Photo':
//                 return profileImageData ? (
//                     <img src={profileImageData} alt="Profile" style={{ width: '100px', height: '100px' }} />
//                 ) : (
//                     <img src={profile} alt="Default Avatar" style={{ width: '100px', height: '100px' }} />
//                 );
//             case 'CustomerName':
//                 return amlComplainted?.complaintDto[0]?.targetCustomerName || 'Not Available';
//             case 'AccountNumber':
//                 return amlComplainted?.complaintDto[0]?.accountNumber || 'Not Available';
//             case 'ClientId':
//                 return amlComplainted?.complaintDto[0]?.clientId || 'Not Available';
//             case 'BranchName':
//                 return getBranchName(amlComplainted?.complaintDto[0]?.branchName || '') || 'Not Available';
//             case 'BranchCode':
//                 return amlComplainted?.complaintDto[0]?.branchCode || 'Not Available';
//             case 'AlertScenarios':
//                 return amlComplainted?.alertScenarioDtos?.map((data) => data.alertScenarios).join(', ') || 'Not Available';
//             case 'Reply':
//                 return amlComplainted?.alertScenarioDtos?.map((data) => data.replyQry).join(', ') || 'Not Available';
//             case 'Remark':
//                 return amlComplainted?.remarkDtos?.[0]?.remark || 'Not Available';
//             default:
//                 return 'Not Available';
//         }
//     };

//     return (
//         <>
//             <Box sx={{ display: 'flex' }}>
//                 <Header />
//                 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                     <Box m={6}>
//                         <Card
//                             style={{
//                                 margin: '6%',
//                                 padding: '1%',
//                                 boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
//                                 marginLeft: '10%',
//                                 width: '80%',
//                             }}
//                         >
//                             <Container
//                                 style={{
//                                     maxWidth: 'none',
//                                     backgroundColor: 'white',
//                                     margin: '10px',
//                                 }}
//                             >
//                                 <Box m={4}>
//                                     <Grid container justifyContent="space-between" alignItems="center">
//                                         <Grid item>
//                                             <h4 style={{ marginBottom: '1%' }}>QC VIEW</h4>
//                                         </Grid>
//                                     </Grid>
//                                     <TableContainer component={Paper} style={{ marginTop: '20px' }}>
//                                         <Table ref={tableRef}>
//                                             <TableBody>{renderTableRows()}</TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                         <Button style={{ marginRight: '1%' }} onClick={handleDownloadPDF}>
//                                             Download PDF
//                                         </Button>
//                                     </div>
//                                 </Box>
//                             </Container>
//                             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                 <Button style={{ marginRight: '1%' }} onClick={() => {
//                                     if (complaintId && uid) {
//                                         handleEditClick(complaintId, uid);
//                                     }
//                                 }}>
//                                     Edit
//                                 </Button>
//                             </div>
//                         </Card>
//                     </Box>
//                     <div ref={componentRef}></div>
//                 </Box>
//             </Box>
//         </>
//     );
// };

// export default View;


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
    const handleEditClick = (complaintId: string, uid: string) => {
        navigate(`/Amlbranchedit/${complaintId}/${uid}`);
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
