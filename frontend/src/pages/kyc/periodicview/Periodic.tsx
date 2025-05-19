import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, Grid, Typography, Button, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, SelectChangeEvent, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { EntityScore, NegativeScore, PepScore, RiskRange, Score, ScoreDocument, kycForm } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams } from 'react-router-dom';
import Loader from '../../loader/loader';

interface DocumentUploadProps {
    label: string;
    pepScore?: PepScore[];
    negativeScore?: NegativeScore[];
    entityScore?: EntityScore[];
    selectedValue: string;
    handleScoreChange: (event: SelectChangeEvent) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFileUploaded: boolean;
};

interface CustomerData {
    kycFormDto: kycForm;
};

interface PepScores {
    id: number;
    name: string;
    score: number;
};

const defaultScoreDocument: ScoreDocument = {
    id: 0,
    kycId: 0,
    pepScoreId: 0,
    negativeMediaId: 0,
    entityId: 0,
    pepScore: 0,
    negativeMediaScore: 0,
    entityScore: 0,
    questionnairsScore: 0,
    uid: 0,
    euid: 0
};

const Periodic = () => {

    const [pepFiles, setPepFiles] = useState<File[]>([]);
    const [negativeFiles, setNegativeFiles] = useState<File[]>([]);
    const [entityFiles, setEntityFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<kycForm[]>([]);
    const [loading, setLoading] = useState(true);
    const applicationfrome = new ApplicationfromeService();
    const { kycId } = useParams<{ kycId: string }>();
    const kycIds = kycId ? parseInt(kycId, 10) : 0;
    const [kycIdState, setKycId] = useState<number | null>(null);
    console.log('sessionStorage kycId:', kycIds);
    const [pepScore, setPepScore] = useState<PepScores[]>([]);
    const [negativeScore, setNegativeScore] = useState<NegativeScore[]>([]);
    const [entityScore, setEntityScore] = useState<EntityScore[]>([]);
    const [score, setScore] = useState<Score[]>([]);
    const [riskRange, setRiskRange] = useState<RiskRange[]>([]);
    const [riskClassification, setRiskClassification] = useState<string>('');
    const [selectedPepScore, setSelectedPepScore] = useState<string>("");
    const [selectedNegativeScore, setSelectedNegativeScore] = useState<string>("");
    const [selectedEntityScore, setSelectedEntityScore] = useState<string>("");
    const [averagePepScore, setAveragePepScore] = useState<number>(0);
    const [averageNegativeScore, setAverageNegativeScore] = useState<number>(0);
    const [averageEntityScore, setAverageEntityScore] = useState<number>(0);
    const [files, setFiles] = useState<File[]>([]);
    const [pathId, setPathId] = useState<number[]>([]);
    const [pathId1, setPathId1] = useState<number[]>([]);
    const [pathId2, setPathId2] = useState<number[]>([]);
    const [scoreDocument, setScoreDocument] = useState<ScoreDocument>(defaultScoreDocument);
    const [isChecked, setIsChecked] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPepFileUploaded, setIsPepFileUploaded] = useState<boolean>(false);
    const [isNegativeFileUploaded, setIsNegativeFileUploaded] = useState<boolean>(false);
    const [isEntityFileUploaded, setIsEntityFileUploaded] = useState<boolean>(false);
    const MAX_TOTAL_SIZE_MB = 200;

    const DocumentUpload: React.FC<DocumentUploadProps> = ({ label, pepScore,
        negativeScore,
        entityScore,
        selectedValue,
        handleScoreChange, handleFileChange, isFileUploaded }) => (

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <label htmlFor={`${label.toLowerCase()}-file-input`}>
                <IconButton component="span" sx={{
                    backgroundColor: isFileUploaded ? 'green' : '#1976d2',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: isFileUploaded ? 'darkgreen' : '#115293',
                    },
                }}>
                    <CloudUploadIcon />
                </IconButton>
            </label>
            <input id={`${label.toLowerCase()}-file-input`} type="file" hidden multiple onChange={handleFileChange} />
            {pepScore && (
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id={`${label}-pep-label`}>Pep</InputLabel>
                    <Select labelId={`${label}-pep-label`} label="Pep" value={selectedValue} onChange={handleScoreChange}>
                        <MenuItem value=""><em>None</em></MenuItem>
                        {pepScore.map(score => (
                            <MenuItem key={score.id} value={score.id}>
                                {score.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {negativeScore && (
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id={`${label}-negative-label`}>Negative Score</InputLabel>
                    <Select
                        labelId={`${label}-negative-label`}
                        label="Negative Score"
                        value={selectedValue}
                        onChange={handleScoreChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {negativeScore.map(score => (
                            <MenuItem key={score.id} value={score.id}>
                                {score.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {entityScore && (
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id={`${label}-entity-label`}>Entity Score</InputLabel>
                    <Select
                        labelId={`${label}-entity-label`}
                        label="Entity Score"
                        value={selectedValue}
                        onChange={handleScoreChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {entityScore.map(score => (
                            <MenuItem key={score.id} value={score.id}>
                                {score.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, category: 'pep' | 'negative' | 'entity') => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            const newFilesSize = filesArray.reduce((acc, file) => acc + file.size, 0);
            const currentTotalSize =
                pepFiles.reduce((acc, file) => acc + file.size, 0) +
                negativeFiles.reduce((acc, file) => acc + file.size, 0) +
                entityFiles.reduce((acc, file) => acc + file.size, 0);
            if (currentTotalSize + newFilesSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
                setErrorMessage(`Total file size should not exceed ${MAX_TOTAL_SIZE_MB}MB.`);
                return;
            }
            switch (category) {
                case 'pep':
                    setPepFiles(prevFiles => [...prevFiles, ...filesArray]);
                    setIsPepFileUploaded(true);
                    break;
                case 'negative':
                    setNegativeFiles(prevFiles => [...prevFiles, ...filesArray]);
                    setIsNegativeFileUploaded(true);
                    break;
                case 'entity':
                    setEntityFiles(prevFiles => [...prevFiles, ...filesArray]);
                    setIsEntityFileUploaded(true);
                    break;
                default:
                    break;
            }
            setErrorMessage('');
        }
    };

    const handlePepScoreChange = (event: SelectChangeEvent<string>) => {
        const selectedScoreId = parseInt(event.target.value, 10);
        const selectedScore = pepScore.find(score => score.id === selectedScoreId);
        if (selectedScore) {
            console.log('Selected Pep Score:', selectedScore);
        }
        setSelectedPepScore(event.target.value);
        if (event.target.value) setErrorMessage('');
    };

    const handleNegativeScoreChange = (event: SelectChangeEvent<string>) => {
        const selectedScoreId = parseInt(event.target.value, 10);
        const selectedScore = negativeScore.find(score => score.id === selectedScoreId);
        if (selectedScore) {
            console.log('Selected Negative Score:', selectedScore);
        }
        setSelectedNegativeScore(event.target.value);
        if (event.target.value) setErrorMessage('');
    };

    const handleEntityScoreChange = (event: SelectChangeEvent<string>) => {
        const selectedScoreId = parseInt(event.target.value, 10);
        const selectedScore = entityScore.find(score => score.id === selectedScoreId);
        if (selectedScore) {
            console.log('Selected Entity Score:', selectedScore.id);
        }
        setSelectedEntityScore(event.target.value);
        if (event.target.value) setErrorMessage('');
    };

    useEffect(() => {
        if (kycId) {
            fetchScore(kycId.toString());
            console.log('kycId:', kycId);
        }
    }, [kycId]);

    useEffect(() => {
        fetchPepScore();
        fetchNegativeSearch();
        fetchEntityScore();
        fetchRiskRange();
    }, []);

    const fetchPepScore = async () => {
        try {
            const pepScore = await applicationfrome.getPepScore();
            setPepScore(pepScore);
            setPathId([1]);
        } catch (error) {
            console.error("Error fetching application types:", error);
        }
    };

    const fetchNegativeSearch = async () => {
        try {
            const negativeScore = await applicationfrome.getNegativeSearch();
            setNegativeScore(negativeScore);
            setPathId1([2]);
        } catch (error) {
            console.error("Error fetching application types:", error);
        }
    };

    const fetchEntityScore = async () => {
        try {
            const entityScore = await applicationfrome.getEntityScore();
            setEntityScore(entityScore);
            setPathId2([3]);
        } catch (error) {
            console.error("Error fetching application types:", error);
        }
    };

    const fetchScore = async (kycId: string) => {
        try {
            const score = await applicationfrome.getScore(kycId);
            setScore(score);
            console.log("score", score);
        } catch (error) {
            console.error("Error fetching application types:", error);
        }
    };

    const fetchRiskRange = async () => {
        try {
            const response = await applicationfrome.getRiskRange();
            setRiskRange(response);
        } catch (error) {
            console.error("Error fetching risk range:", error);
        }
    };

    const calculateAverageScore = (score: number) => {
        return (score / 100) * 20;
    };

    const calculateAverageScores = () => {
        const selectedPep = pepScore.find(score => score.id === parseInt(selectedPepScore));
        const selectedNegative = negativeScore.find(score => score.id === parseInt(selectedNegativeScore));
        const selectedEntity = entityScore.find(score => score.id === parseInt(selectedEntityScore));
        if (selectedPep && selectedNegative && selectedEntity) {
            const averagePep = (selectedPep.score / 100) * 20;
            const averageNegative = (selectedNegative.score / 100) * 20;
            const averageEntity = (selectedEntity.score / 100) * 20;
            setAveragePepScore(averagePep);
            setAverageNegativeScore(averageNegative);
            setAverageEntityScore(averageEntity);
            return { averagePep, averageNegative, averageEntity };
        } else {
            console.error("Unable to calculate average scores: Invalid selected scores");
            return null;
        }
    };

    const classifyRisk = (averageTotal: number) => {
        let classification = 'Unknown';
        riskRange.forEach(range => {
            if (averageTotal >= range.rangeFrm && averageTotal <= range.rangeTo) {
                classification = range.risk_classification;
            }
        });
        return classification;
    };

    const createScoreCalculationRequest = (averagePep: number, averageNegative: number, averageEntity: number): ScoreDocument | null => {
        return {
            id: scoreDocument.id,
            kycId: kycIds,
            pepScoreId: selectedPepScore ? parseInt(selectedPepScore, 10) : 0,
            negativeMediaId: selectedNegativeScore ? parseInt(selectedNegativeScore, 10) : 0,
            entityId: selectedEntityScore ? parseInt(selectedEntityScore, 10) : 0,
            pepScore: averagePep,
            negativeMediaScore: averageNegative,
            entityScore: averageEntity,
            questionnairsScore: scoreDocument.questionnairsScore,
            uid: scoreDocument.uid,
            euid: scoreDocument.euid
        };
    };

    const handleSaveButtonClick = async () => {
        // if (!selectedPepScore && !selectedNegativeScore && !selectedEntityScore) {
        //     setErrorMessage('Please select atleast one dropdown value.');
        //     return;
        // }
        // if (
        //     (selectedPepScore && !isPepFileUploaded) ||
        //     (selectedNegativeScore && !isNegativeFileUploaded) ||
        //     (selectedEntityScore && !isEntityFileUploaded)
        // ) {
        //     setErrorMessage('Please upload the required document for the selected dropdown.');
        //     return;
        // }
        if (!selectedPepScore || !selectedNegativeScore || !selectedEntityScore) {
            setErrorMessage('Please select all three dropdown values.');
            return;
        }
        if (!isPepFileUploaded || !isNegativeFileUploaded || !isEntityFileUploaded) {
            setErrorMessage('Please upload the required documents for all selected dropdowns.');
            return;
        }
        setLoading(true);
        const scores = calculateAverageScores();
        if (scores && riskRange && riskRange.length > 0) {
            const { averagePep, averageNegative, averageEntity } = scores;
            const averageTotal = (averagePep + averageNegative + averageEntity) / 3;
            const classification = classifyRisk(averageTotal);
            const scoreCalculationRequest = createScoreCalculationRequest(averagePep, averageNegative, averageEntity);
            if (!scoreCalculationRequest) {
                console.error('Error creating score calculation request');
                setErrorMessage('Error creating score calculation request.');
                setLoading(false);
                return;
            }
            const allFiles = [...pepFiles, ...negativeFiles, ...entityFiles];
            const allPathIds = [...pathId, ...pathId1, ...pathId2];
            try {
                const response = await applicationfrome.uploadScoreDocument(allFiles, [kycIds], allPathIds, scoreCalculationRequest);
                console.log('Upload Score Document Response:', response);
                setSuccessMessage('Score document uploaded successfully.');
                setErrorMessage('');
                setRiskClassification(classification);
            } catch (error) {
                console.error(`Error uploading score document: ${error}`);
                setErrorMessage('Failed to upload score document. Please try again.');
                setSuccessMessage('');
            }
            setRiskClassification(classification);
        } else {
            console.error("Unable to calculate risk classification: Risk range data is not available");
            setErrorMessage('Failed to upload score document. Please try again.');
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async (kycId: string) => {
            try {
                setLoading(true);
                const customerData: CustomerData[] = await applicationfrome.getkycData(kycId);
                if (customerData && customerData.length > 0) {
                    const seenIds = new Set();
                    const uniqueData = customerData.filter((data: CustomerData) => {
                        const id = data.kycFormDto.id;
                        if (seenIds.has(id)) {
                            return false;
                        } else {
                            seenIds.add(id);
                            return true;
                        }
                    });
                    console.log("Filtered Data:", uniqueData);
                    setFormData(uniqueData.map((data: CustomerData) => data.kycFormDto));
                } else {
                    setErrors(["No data found"]);
                }
            } catch (error) {
                setErrors(["Error fetching data"]);
            } finally {
                setLoading(false);
            }
        };
        if (kycId) {
            fetchData(kycId);
        }
    }, [kycId]);

    const itemsPerPage = 22;

    const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
        const pages = [];
        for (let i = 0; i < data.length; i += itemsPerPage) {
            pages.push(data.slice(i, i + itemsPerPage));
        }
        return pages;
    };

    const pages = splitDataIntoPages(formData, itemsPerPage);

    return (
        <>
            <Box component="main" sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Card sx={{ p: 2, boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                    <Grid container spacing={1} alignItems="center" wrap="nowrap">
                        <Grid item>
                            <DocumentUpload
                                label="Pep"
                                pepScore={pepScore}
                                selectedValue={selectedPepScore}
                                handleScoreChange={handlePepScoreChange}
                                handleFileChange={(e) => handleFileChange(e, "pep")}
                                isFileUploaded={isPepFileUploaded}
                            />
                        </Grid>
                        <Grid item ml={1}>
                            <DocumentUpload
                                label="Negative"
                                negativeScore={negativeScore}
                                selectedValue={selectedNegativeScore}
                                handleScoreChange={handleNegativeScoreChange}
                                handleFileChange={(e) => handleFileChange(e, "negative")}
                                isFileUploaded={isNegativeFileUploaded}
                            />
                        </Grid>
                        <Grid item ml={1}>
                            <DocumentUpload
                                label="Entity"
                                entityScore={entityScore}
                                selectedValue={selectedEntityScore}
                                handleScoreChange={handleEntityScoreChange}
                                handleFileChange={(e) => handleFileChange(e, "entity")}
                                isFileUploaded={isEntityFileUploaded}
                            />
                        </Grid>
                        {loading && <Loader />}
                        <Grid item ml={1}>
                            <Button variant="outlined" onClick={handleSaveButtonClick} size="small">Save</Button>
                        </Grid>
                        {/* <Grid item ml={0.2}>
                            <Button variant="outlined" size="small">Edit</Button>
                        </Grid> */}
                        <Grid item ml={0.2}>
                            <Button variant="outlined" onClick={handleSaveButtonClick} size="small">Submit</Button>
                        </Grid>
                        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                        {errorMessage && (
                            <Grid item>
                                <Typography variant="body2" color="error" sx={{ ml: 2 }}>
                                    {errorMessage}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Card>

                {/* Pdf part */}
                <Card style={{ marginTop: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%', height: '400px', overflow: 'auto' }}>
                    <Container style={{ width: '255mm', minHeight: '297mm' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div id="pdfContent">
                                {pages.map((pageContent, pageIndex) => (
                                    <Paper key={pageIndex} style={{ marginBottom: '20px', boxShadow: '0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)' }}>
                                        <div ref={contentRef} style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow sx={{ fontSize: 'small' }}>
                                                            <TableCell sx={{ width: '5%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                                                            <TableCell sx={{ width: '60%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                                                            <TableCell sx={{ width: '35%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {pageContent && pageContent.map((item, index) => (
                                                            <TableRow key={index} sx={{ height: '24px' }}>
                                                                <TableCell sx={{ width: '5%', padding: '12px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                    {index + 1 + pageIndex * itemsPerPage}
                                                                </TableCell>
                                                                <TableCell sx={{ width: '60%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                    {item && item.name}
                                                                    {item && item.description && (
                                                                        <Typography variant="body2" color="textSecondary">
                                                                            {item.description}
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell sx={{ width: '30%', padding: '4px', fontSize: '0.75rem' }}>
                                                                    {/* Handle case when id is 17 */}
                                                                    {/* {item && item.id === 17 && Array.isArray(item.kycSubQueFormData) ? (
                                                                    item.kycSubQueFormData.map((subItem: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; kycAnswerData: string | any[]; }, subIndex: React.Key | null | undefined) => (
                                                                        <div key={subIndex}>
                                                                            <strong>{subItem.name}:</strong> {subItem.kycAnswerData && subItem.kycAnswerData.length > 0 ? subItem.kycAnswerData[0].answer : 'No answer available'}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    item && item.kycAnswerData && item.kycAnswerData.length > 0
                                                                        ? item.kycAnswerData[0]?.answer
                                                                        : 'No answer available'
                                                                )} */}
                                                                    {item && item.id === 17 && Array.isArray(item.kycSubQueFormData) ? (
                                                                        (() => {
                                                                            const displayOrder = ['Name', 'Designation', 'Contact no', 'Email ID'];
                                                                            const subItemMap = item.kycSubQueFormData.reduce((acc: { [x: string]: any; }, subItem: { name: string | number; kycAnswerData: { answer: string; }[]; }) => {
                                                                                acc[subItem.name] = subItem.kycAnswerData[0]?.answer || 'No answer available';
                                                                                return acc;
                                                                            }, {} as Record<string, string>);
                                                                            return displayOrder.map((field) => (
                                                                                <div key={field}>
                                                                                    <strong>{field}:</strong> {subItemMap[field] || 'No answer available'}
                                                                                </div>
                                                                            ));
                                                                        })()
                                                                    ) : (
                                                                        item && item.kycAnswerData && item.kycAnswerData.length > 0 ? (
                                                                            <>
                                                                                {item.kycAnswerData[0]?.answer}
                                                                                {item.kycAnswerData[0]?.answer === "Under Process" && item.kycAnswerData[0]?.additionalDetails && (
                                                                                    <div><strong>Additional Details : </strong>{item.kycAnswerData[0].additionalDetails}</div>
                                                                                )}
                                                                            </>
                                                                        ) : 'No answer available'
                                                                    )}
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
                                            <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '0px', right: '20px', fontSize: 'small' }}>
                                                Page: {pageIndex + 1}
                                            </div>
                                        </div>
                                    </Paper>
                                ))}
                            </div>
                        </LocalizationProvider>
                    </Container>
                </Card>

                {/* Risk Calculation part */}
                <Card sx={{ mt: 1, mb: 10, p: 3, boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        <strong>Risk Calculation</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">Questionnaire</Typography>
                            <Typography variant="subtitle1">{score !== null ? `${score[0] !== null ? `${score[0]}%` : '0'}` : 'Loading...'}</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">Pep</Typography>
                            <Typography variant="subtitle1">{`${averagePepScore}%`}</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">Negative Search</Typography>
                            <Typography variant="subtitle1">{`${averageNegativeScore}%`}</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">Entity</Typography>
                            <Typography variant="subtitle1">{`${averageEntityScore}%`}</Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">RiskScore</Typography>
                            <Typography variant="subtitle1">{riskClassification}</Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </>
    );
};

export default Periodic;