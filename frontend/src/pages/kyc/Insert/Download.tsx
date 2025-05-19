import React, { useEffect, useRef, useState } from 'react';
import { TextField, Select, MenuItem, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';
import ApplicationfromeService from '../../../data/services/kyc/applicationfrom/applicationfrome-api-service';
import { Type, AccountType, QuestionType, AppFormData, kycForm, AnswerTypeData } from '../../../data/services/kyc/applicationfrom/applicationfrome-payload';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import contactImage from '../../../assets/contact.png';
import { useApplicationContext } from './ApplicationContext';
import DocumentApiService from '../../../data/services/kyc/document/Document_api_service';
import './Form.css';

function ApplicationForm() {

    const [formData, setFormData] = useState<AppFormData>({
        applicantFormDto: {
            id: 0,
            name: '',
            numberOfPrint: 0,
            isCompleted: 0,
            isScreening: 0,
            uid: 0,
            applicantFormDetailsData: [],
        },
    });

    const documentApiService = new DocumentApiService();
    const [typeOptions, setTypeOptions] = useState<Type[]>([]);
    const [accountTypeOptions, setAccountTypeOptions] = useState<AccountType[]>([]);
    const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const applicationfrome = new ApplicationfromeService();
    const { setResponseId } = useApplicationContext();
    const [downloadCount, setDownloadCount] = useState(0);
    const [isFormDataUpdated, setIsFormDataUpdated] = useState(false);
    const [formFullyRendered, setFormFullyRendered] = useState(false);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formDatas, setFormDatas] = useState<kycForm[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [showInputBox, setShowInputBox] = useState<{ [key: number]: boolean }>({});
    const [additionalAnswers, setAdditionalAnswers] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchQuestions()
    }, []);

    const fetchQuestions = async () => {
        const applicationTypeId = 1;
        const accountTypeId = 2;
        try {
            const questions = await applicationfrome.getQuestionTypes(applicationTypeId, accountTypeId);
            setFetchedQuestions(questions);
            setDataFetched(true);
            questions.forEach((question: { questionDto: { id: any; subQuestionTypeData: any; }; }) => {
                console.log('SubQuestionTypeData for Question ID', question.questionDto.id);
                console.log(question.questionDto.subQuestionTypeData);
            });
            setFormData(prevState => {
                const updatedFormData = {
                    ...prevState,
                    applicantFormDto: {
                        ...prevState.applicantFormDto,
                        applicantFormDetailsData: questions.map((question: { questionDto: { id: any; ansTypeId: any; }; }) => ({
                            id: 0,
                            kycId: 0,
                            accountTypeId,
                            applicationTypeId,
                            questionId: question.questionDto.id,
                            ansTypeId: question.questionDto.ansTypeId,
                            answer: '',
                            score: 0,
                            uid: 0,
                            subQuestionId: 0,
                            isSubAnswer: 0,
                            ansId: 0
                        }))
                    }
                };
                setIsFormDataUpdated(true);
                return updatedFormData;
            });
            console.log('formData:', questions);
            setErrors(Array(questions.length).fill(''));
            setFormFullyRendered(true);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleAnswerChange = (index: number, value: string, isSubQuestion: boolean, subQuestionId: number | null = null) => {
        const question = fetchedQuestions[index];
        let answerTypeData: AnswerTypeData | undefined;
        if (isSubQuestion && subQuestionId) {
            console.log('Sub-Question ID:', question.questionDto.id, subQuestionId);
            const subQuestion = question.questionDto.subQuestionTypeData.find(subQ => subQ.id === subQuestionId);
            answerTypeData = subQuestion?.answerTypeData.find(answer => answer.name === value);
        }
        else {
            answerTypeData = question.questionDto.answerTypeData.find(answer => answer.name === value);
        }
        const updatedFormDetails = formData.applicantFormDto.applicantFormDetailsData.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    answer: value,
                    ansId: value === 'Under Process' ? answerTypeData?.id ?? 0 : item.ansId,
                    score: answerTypeData ? answerTypeData.score : item.score,
                    questionId: answerTypeData ? answerTypeData.questionId : item.questionId,
                    subQuestionId: isSubQuestion && subQuestionId ? subQuestionId : item.subQuestionId,
                };
            }
            return item;
        });
        setFormData({
            ...formData,
            applicantFormDto: {
                ...formData.applicantFormDto,
                applicantFormDetailsData: updatedFormDetails
            }
        });
        setShowInputBox(prev => ({ ...prev, [index]: value === "Under Process" }));
        console.log('item:', updatedFormDetails);
        console.log('applicantFormDetailsData:', formData);
    };

    const handleAdditionalAnswerChange = (index: number, value: string) => {
        const isSubAnswerNumber = value.trim() === '' || isNaN(parseInt(value, 10)) ? 1 : parseInt(value, 10);
        setAdditionalAnswers(prev => ({ ...prev, [index]: value }));
        setFormData(prevFormData => {
            const updatedFormDetails = prevFormData.applicantFormDto.applicantFormDetailsData.map((item, idx) =>
                idx === index ? { ...item, isSubAnswer: isSubAnswerNumber } : item
            );
            return {
                ...prevFormData,
                applicantFormDto: {
                    ...prevFormData.applicantFormDto,
                    applicantFormDetailsData: updatedFormDetails
                }
            };
        });
    };

    const itemsPerPage = 22;

    const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
        const pages = [];
        for (let i = 0; i < data.length; i += itemsPerPage) {
            pages.push(data.slice(i, i + itemsPerPage));
        }
        return pages;
    };

    const pages = splitDataIntoPages(fetchedQuestions, itemsPerPage);

    const itemsPerPages = 12;

    const splitDataIntoPage = (data: any[], itemsPerPages: number) => {
        const pageView = [];
        for (let i = 0; i < data.length; i += itemsPerPages) {
            pageView.push(data.slice(i, i + itemsPerPages));
        }
        return pageView;
    };

    const pageView = splitDataIntoPage(formDatas, itemsPerPages);
    const downloadPDFRef = React.useRef<() => void | null>(null);

    const handleDownloadClick = () => {
        if (downloadPDFRef.current) {
            downloadPDFRef.current();
        }
    };

    const [imageURL, setImageURL] = useState('');

    const handleSubmit = async () => {
        const hasErrors = errors.some(error => error !== '');
        if (hasErrors) {
            return;
        }
        try {
            let responseId = sessionStorage.getItem('responseId');
            let responseIdNumber;
            if (responseId) {
                responseIdNumber = Number(responseId);
                if (isNaN(responseIdNumber)) {
                    console.error('Invalid responseId found in session storage');
                    return;
                }
            } else {
                const initialResponse = await applicationfrome.Apllicationinsert(formData);
                if (initialResponse && initialResponse.id) {
                    responseIdNumber = initialResponse.id;
                    sessionStorage.setItem('responseId', responseIdNumber.toString());
                    setResponseId(responseIdNumber);
                } else {
                    console.error('Failed to generate a new responseId');
                    return;
                }
            }
            const updatedNumberOfPrint = formData.applicantFormDto.numberOfPrint + 1;
            const updatedFormData = {
                ...formData,
                applicantFormDto: {
                    ...formData.applicantFormDto,
                    id: responseIdNumber,
                    numberOfPrint: updatedNumberOfPrint,
                },
            };
            localStorage.setItem('formData', JSON.stringify(updatedFormData));
            const response = await applicationfrome.Apllicationinsert(updatedFormData);
            console.log('Updated formData:', updatedFormData);
            if (response && response.id) {
                setDataFetched(true);
                setShowDownloadButton(true);
                setFormData(updatedFormData);
                setResponseId(response.id);
            } else {
                console.error('Failed to generate a new responseId');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <>
            <Card style={{ boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', width: '100%' }}>
                <Container style={{ width: '274mm', minHeight: '297mm', marginTop: '2%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {pages.map((pageContent, pageIndex) => (
                            <Paper key={pageIndex} style={{ marginBottom: '20px' }}>
                                <div style={{ position: 'relative', width: '100%', minHeight: '100%', padding: '20px' }}>
                                    <div>
                                        {imageURL && (
                                            <img
                                                src={imageURL}
                                                alt="Ponsun"
                                                style={{ display: 'block', margin: '0 auto', maxWidth: '35%', height: 'auto', maxHeight: '200px', marginBottom: '20px' }}
                                            />
                                        )}
                                    </div>
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
                                                {pageContent.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <TableRow>
                                                            <TableCell sx={{ width: '10%', padding: '20px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                {index + 1 + pageIndex * itemsPerPage}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '40%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                                                                {item.questionDto.name}
                                                                {item.questionDto.multiQuestion === 1 && (
                                                                    item.questionDto.subQuestionTypeData && item.questionDto.subQuestionTypeData.map((subQuestion: any) => (
                                                                        <Typography key={subQuestion.id}>{subQuestion.name}:</Typography>
                                                                    ))
                                                                )}
                                                                {item.questionDto.ansTypeId === 2 && (
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {item.questionDto.description}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell sx={{ width: '50%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                                                                {item.questionDto.multiQuestion === 1 && item.questionDto.subQuestionTypeData && (
                                                                    item.questionDto.subQuestionTypeData.map((subQuestion: any, subIndex: number) => (
                                                                        <React.Fragment key={subQuestion.id}>
                                                                            {subQuestion.ansTypeId === 2 ? (
                                                                                <>
                                                                                    <Select
                                                                                        style={{ fontSize: 'small' }}
                                                                                        fullWidth
                                                                                        size='small'
                                                                                        value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.subQuestionId === subQuestion.id)?.answer || ''}
                                                                                        onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, true, subQuestion.id)}
                                                                                    >
                                                                                        {subQuestion.answerTypeData.map((answer: { name: string }, answerIndex: React.Key) => (
                                                                                            <MenuItem
                                                                                                style={{ height: '2rem', fontSize: '0.75rem' }}
                                                                                                key={answerIndex}
                                                                                                value={answer.name}
                                                                                            >
                                                                                                {answer.name}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Select>
                                                                                    {showInputBox[index + pageIndex * itemsPerPage] && (
                                                                                        <TextField
                                                                                            sx={{ fontSize: 'x-small', marginTop: '10px' }}
                                                                                            fullWidth
                                                                                            size='small'
                                                                                            autoComplete='off'
                                                                                            multiline
                                                                                            placeholder="Please provide additional details"
                                                                                            value={additionalAnswers[index + pageIndex * itemsPerPage]}
                                                                                            onChange={(e) => handleAdditionalAnswerChange(index + pageIndex * itemsPerPage, e.target.value)}
                                                                                        />
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <TextField
                                                                                    sx={{ fontSize: 'x-small' }}
                                                                                    fullWidth
                                                                                    size='small'
                                                                                    autoComplete='off'
                                                                                    multiline
                                                                                    value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.subQuestionId === subQuestion.id)?.answer || ''}
                                                                                    onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, true, subQuestion.id)}
                                                                                />
                                                                            )}
                                                                            {errors[index + pageIndex * itemsPerPage] && (
                                                                                <Typography variant="caption" color="error">
                                                                                    {errors[index + pageIndex * itemsPerPage]}
                                                                                </Typography>
                                                                            )}
                                                                        </React.Fragment>
                                                                    ))
                                                                )}
                                                                {!item.questionDto.multiQuestion && item.questionDto.ansTypeId === 2 && (
                                                                    <>
                                                                        <Select
                                                                            style={{ fontSize: 'small' }}
                                                                            fullWidth
                                                                            size='small'
                                                                            value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.questionId === item.questionDto.id)?.answer || ''}
                                                                            onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, false)}
                                                                        >
                                                                            {item.questionDto.answerTypeData.map((answer: { name: string }, answerIndex: React.Key) => (
                                                                                <MenuItem
                                                                                    style={{ height: '2rem', fontSize: '0.75rem' }}
                                                                                    key={answerIndex}
                                                                                    value={answer.name}
                                                                                >
                                                                                    {answer.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        {showInputBox[index + pageIndex * itemsPerPage] && (
                                                                            <TextField
                                                                                sx={{ fontSize: 'x-small', marginTop: '10px' }}
                                                                                fullWidth
                                                                                size='small'
                                                                                autoComplete='off'
                                                                                multiline
                                                                                placeholder="Please provide additional details"
                                                                                value={additionalAnswers[index + pageIndex * itemsPerPage]}
                                                                                onChange={(e) => handleAdditionalAnswerChange(index + pageIndex * itemsPerPage, e.target.value)}
                                                                            />
                                                                        )}
                                                                    </>
                                                                )}
                                                                {!item.questionDto.multiQuestion && item.questionDto.ansTypeId !== 2 && (
                                                                    <TextField
                                                                        sx={{ fontSize: 'x-small' }}
                                                                        fullWidth
                                                                        size='small'
                                                                        autoComplete='off'
                                                                        multiline
                                                                        value={formData.applicantFormDto.applicantFormDetailsData.find(detail => detail.questionId === item.questionDto.id)?.answer || ''}
                                                                        onChange={(e) => handleAnswerChange(index + pageIndex * itemsPerPage, e.target.value, false)}
                                                                    />
                                                                )}
                                                                {errors[index + pageIndex * itemsPerPage] && (
                                                                    <Typography variant="caption" color="error">
                                                                        {errors[index + pageIndex * itemsPerPage]}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <img src={contactImage} alt="Contact" style={{ display: 'block', margin: '20px auto 0', maxWidth: '55%' }} />
                                    <div style={{ textAlign: 'right', marginTop: '10px', position: 'absolute', bottom: '20px', right: '20px', fontSize: 'small' }}>Page : {pageIndex + 1}</div>
                                </div>
                                <h3>Update: {formData.applicantFormDto.numberOfPrint}</h3>
                            </Paper>
                        ))}

                        {dataFetched && isFormDataUpdated && formFullyRendered && (
                            <div>
                                {formData.applicantFormDto.applicantFormDetailsData[0]?.applicationTypeId === 1 &&
                                    formData.applicantFormDto.applicantFormDetailsData[0]?.accountTypeId === 2 && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="arroww" style={{ marginRight: '10px' }}>
                                                <span style={{ textAlign: 'center' }}>Step 1:</span>
                                            </div>
                                            <button style={{ width: '12%' }} className='btn btn-primary btn-sm' onClick={() => { handleSubmit() }}>Save</button>
                                            <br />
                                        </div>
                                    )}
                            </div>
                        )}
                        <br></br>
                    </LocalizationProvider>
                </Container>
            </Card>
            <Card>
            </Card>
        </>
    );
}

export default ApplicationForm;