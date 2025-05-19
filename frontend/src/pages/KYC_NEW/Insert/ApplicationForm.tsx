import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Grid, Select, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
import { QuestionType, AppFormData, kycForm, ApplicantFormDetailsData } from "../../../data/services/kyc/applicationfrom/applicationfrome-payload";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DocumentApiService from "../../../data/services/document/Document_api_service";
import "./Form.css";
import { IconButton } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from 'react-redux';
import { saveQuestionnaire } from "./state/save-application-action";
import { useApplicationContext } from "../../kyc/Insert/ApplicationContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import CloseIcon from '@mui/icons-material/Close';
import Loader from "../../loader/loader";
import '../../CommonStyle/Style.css';
import Autocomplete from "@mui/lab/Autocomplete";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Image {
  name: string;
  uploading: boolean;
  uploadSuccess: boolean;
}

const ApplicationForm = (props: any) => {

  const [formData, setFormData] = useState<AppFormData>({
    applicantFormDto: {
      id: 0,
      name: "",
      numberOfPrint: 0,
      isCompleted: 0,
      isScreening: 0,
      uid: 0,
      applicantFormDetailsData: [],
    },
  });

  const initialImageState: Image = {
    name: "",
    uploading: false,
    uploadSuccess: false,
  };

  const [images, setImages] = useState<Image[]>([initialImageState]);
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const { setResponseId } = useApplicationContext();
  const [downloadCount, setDownloadCount] = useState(0);
  const [formFullyRendered, setFormFullyRendered] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [saveClicked, setSaveClicked] = useState(false);
  const [downlodClicked, setDownlodClicked] = useState(false);
  const [signUploadBtnClicked, setSignUploadBtnClicked] = useState(false);
  const [viewBtnClicked, setViewBtnClicked] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
  const [showInputBox, setShowInputBox] = useState<{ [key: number]: boolean }>({});
  const [additionalAnswers, setAdditionalAnswers] = useState<{ [key: number]: string; }>({});
  const kycApplication = useSelector((state: any) => state.kycApplication?.saveApplicationReducer);
  console.log("kycApplication", kycApplication);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const applicationTypeId = 1;
  const accountTypeId = 2;
  const [customerdata, setcustomerData] = useState<kycForm[]>([]);
  const [pageView, setPageView] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [noOfPrint, setNoOfPrint] = useState<number>(formData.applicantFormDto.numberOfPrint || 1);
  const responseId = sessionStorage.getItem("responseId");
  console.log('ApplicationForm ResponseId:', responseId);
  const [loading, setLoading] = useState(false);
  const [printNumber, setPrintNumber] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfRendered, setPdfRendered] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const userDetails = useSelector((state: any) => state.loginReducer);
  const loginDetails = userDetails.loginDetails;
  console.log('loginDetails:', loginDetails);
  const itemsPerPagePdf = 22;
  const itemsPerPage = 10;

  const documentApiService = new DocumentApiService();
  const applicationfrome = new ApplicationfromeService();
  const customerApiService = new DocumentApiService();

  const [pdfData, setPdfData] = useState<{
    base64: string | null;
    filename: string | null;
  }>({ base64: null, filename: null });

  const a4SheetStyle = {
    width: "210mm",
    minHeight: "297mm",
    padding: "20px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  };

  const cellStyle = {
    padding: "8px",
    border: "1px solid #000",
  };

  const evenRowStyle = {
    backgroundColor: "#f2f2f2",
  };

  const a4SheetStyles = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const tableStyles: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  };

  const evenRowStyles = {
    backgroundColor: "#f2f2f2",
  };

  useEffect(() => {
    if (loading) {
      document.body.classList.add('blur');
    } else {
      document.body.classList.remove('blur');
    }
  }, [loading]);

  const fetchData = async (kycId: any, questions: any) => {
    try {
      console.log('kycId in the Application form fetchData:', kycId);
      setLoading(true);
      const customerData: any[] = await applicationfrome.getkycData(kycId);
      console.log('CustomerData in the Application form fetchData:', customerData);
      // const response = await applicationfrome.getPrintNumber(responseId);
      const response = await applicationfrome.getPrintNumber(kycId);
      console.log('ResponseId for fetchData:', responseId);
      console.log('KycId for fetchData:', kycId);
      setPrintNumber(response);
      console.log("Print Number:", response);
      setcustomerData(customerData);
      updateUiWithSavedData(questions, customerData);
      if (questions[0].questionDto) {
        dispatch(saveQuestionnaire(questions));
      }
    } catch (error) {
      setErrors(["Error fetching data"]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
    setTimeout(() => {
      setIsSuccessOpen(false);
      setSuccessMessage("");
    }, 1000);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsErrorOpen(true);
  };

  const downloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      setLoading(true);
      const response = await applicationfrome.getPrintNumber(responseId);
      const printNumber = response;
      const content = document.getElementById("pdfContentApp") as HTMLElement;
      if (!content) return;
      content.style.display = "block";
      const pdf = new jsPDF("p", "mm", "a4");
      const padding = 10;
      const scale = 1.5;
      const pageWidth = 210;
      const pageHeight = 297;
      const contentWidth = pageWidth - 2 * padding;
      const contentHeight = pageHeight - 2 * padding;
      const totalPages = content.childNodes.length;

      const defaultFontSize = 12;
      pdf.setFontSize(defaultFontSize);

      for (let i = 0; i < totalPages; i++) {
        const page = content.childNodes[i] as HTMLElement;
        const canvas = await html2canvas(page, { scale: scale, useCORS: true, logging: true });
        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();

        const headerText = " ";
        const headerFontSize = 16;
        pdf.setFontSize(headerFontSize);
        pdf.setFont("helvetica", "bold");
        pdf.text(headerText, padding, padding);

        const textWidth = pdf.getTextWidth(`Update: ${printNumber}`);
        const xCoordinate = pageWidth - textWidth - padding;
        const textYCoordinate = padding + 10;
        pdf.setFontSize(defaultFontSize);
        pdf.text(`Update: ${printNumber}`, xCoordinate, textYCoordinate);

        const contentYStart = padding + 20;
        pdf.addImage(imgData, "PNG", padding, contentYStart, contentWidth, contentHeight - contentYStart);
        pdf.setLineWidth(0.2);
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(padding, contentYStart, contentWidth, contentHeight - contentYStart);

        const pageNumberText = `${i + 1} / ${totalPages}`;
        pdf.setFontSize(10);
        pdf.text(pageNumberText, pageWidth - padding, pageHeight - padding + 5, { align: "right" });
      }
      pdf.save("application_form.pdf");
      setDownlodClicked(true);
      showSuccessMessage("Download successfully.");
    } catch (error) {
      setErrors(["Error generating PDF"]);
      setDownlodClicked(false);
    } finally {
      const content = document.getElementById("pdfContentApp") as HTMLElement;
      if (content) {
        content.style.display = "none";
      }
      setDownloadingPDF(false);
      setDownloadCount((prevCount) => prevCount + 1);
      setDownlodClicked(true);
      setLoading(false);
    }
    setIsLevelcasedetailsOpen(true);
    setIsUploadSectionOpen(false);
  };

  useEffect(() => {
    fetchQuestions(kycApplication);
    setDataFetched(true);
    splitDataIntoPage(kycApplication, itemsPerPagePdf);
    splitDataIntoPages(kycApplication, itemsPerPage);
  }, [kycApplication]);

  const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
    if (!data) {
      return;
    }
    const pages = [];
    for (let i = 0; i < data.length; i += itemsPerPage) {
      pages.push(data.slice(i, i + itemsPerPage));
    }
    setPages([...pages]);
  };

  const splitDataIntoPage = (data: any[], itemsPerPages: number) => {
    if (!data) {
      return;
    }
    const pageView = [];
    for (let i = 0; i < data.length; i += itemsPerPages) {
      pageView.push(data.slice(i, i + itemsPerPages));
    }
    setPageView([...pageView]);
    return pageView;
  };

  console.log("pageView", pageView);
  console.log("kyc form responseId:", responseId);

  useEffect(() => {
    if (responseId || props.kycId) {
      setShowSaveBtn(true);
      fetchData(parseInt(responseId || props.kycId, 10), kycApplication);
      console.log("Declaration responseId:", responseId);
      setImages((prevImages) =>
        prevImages.map((image) => ({
          ...image,
          kycId: parseInt(responseId || props.kycId, 10),
        }))
      );
    }
    if (props.kycId) {
      setShowSaveBtn(true);
    }
  }, [responseId]);

  const fetchQuestions = async (data?: any) => {
    try {
      setFetchedQuestions([...data]);
      setDataFetched(true);
      // setErrors(Array(kycApplication.length).fill(""));
      setFormFullyRendered(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerChange = (
    index: number,
    value: string,
    isSubQuestion: boolean,
    subQuestionId: number | null = null,
    additionalDetails: string = ''
  ) => {
    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      if (value.trim() !== "") {
        newErrors[index] = "";
      } else {
        newErrors[index] = "This field is required";
      }
      return newErrors;
    });

    const updatedList = fetchedQuestions.map((item: any, idx) => {
      if (index === idx) {
        if (
          !item.questionDto.multiQuestion &&
          item.questionDto.answerTypeData.length > 0
        ) {
          item.questionDto.selectedValue = value;
          item.questionDto.textValue = value;
          if (value === 'Under Process') {
            console.log('Value is Under Process:', value);
            console.log('Additional Details:', additionalDetails);
            item.questionDto.additionalDetails = additionalDetails;
            setShowInputBox((prev) => ({ ...prev, [index]: true }));
          } else {
            console.log('Value is not Under Process:', value);
            item.questionDto.additionalDetails = '';
            setShowInputBox((prev) => ({ ...prev, [index]: false }));
          }
          return { ...item };
        }
        if (isSubQuestion && item.questionDto.subQuestionTypeData.length > 0) {
          let subQuestion: any[] = item.questionDto.subQuestionTypeData;
          for (let i = 0; i < subQuestion.length; i++) {
            if (subQuestion[i].id == subQuestionId) {
              subQuestion[i].textValue = value;
            }
          }
          return { ...item };
        } else {
          item.questionDto.textValue = value;
          item.questionDto.selectedValue = value;
          return { ...item };
        }
      }
      return item;
    });
    setFetchedQuestions(updatedList);
    dispatch(saveQuestionnaire(updatedList));
  };

  const constructSaveApplicationFormdata = (loginUserId: number) => {
    let payload: AppFormData = {
      applicantFormDto: {
        id: props.kycId || responseId ? props.kycId || responseId : 0,
        name: "",
        numberOfPrint: noOfPrint,
        isCompleted: 0,
        isScreening: 0,
        uid: loginUserId,
        applicantFormDetailsData: [],
      },
    };
    console.log('Constructed payload:', payload);
    let applicantFormDetailsData: ApplicantFormDetailsData[] = [];
    console.log('Final applicantFormDetailsData:', applicantFormDetailsData);
    console.log('fetchedQuestions final ======>', fetchedQuestions);
    for (let i = 0; i < fetchedQuestions.length; i++) {
      let question: any = fetchedQuestions[i].questionDto;
      let applicantForm: any = {};
      applicantForm.id = question.id;
      applicantForm.kycId = props.kycId || responseId ? props.kycId || responseId : 0;
      applicantForm.accountTypeId = question.accountTypeId;
      applicantForm.applicationTypeId = question.applicationTypeId;
      applicantForm.questionId = question.id;
      applicantForm.subQuestionId = 0;
      applicantForm.ansTypeId = question.ansTypeId;
      applicantForm.isSubAnswer = 0;
      applicantForm.answer = question.textValue ? question.textValue : question.selectedValue;
      applicantForm.score = question.score ? question.score : null;
      applicantForm.uid = loginUserId;
      applicantForm.euid = 0;
      applicantForm.ansId = null;
      applicantForm.isScreening = 0;
      applicantForm.additionalDetails = "";
      console.log('Adding to payload, additionalDetails:', applicantForm.additionalDetails);
      console.log('applicantForm:', applicantForm);

      if (additionalAnswers[i] && additionalAnswers[i].trim() !== "") {
        applicantForm.additionalDetails = additionalAnswers[i];
      } else if (question.additionalDetails && question.additionalDetails.trim() !== "") {
        applicantForm.additionalDetails = question.additionalDetails;
      }
      console.log('Adding to payload, additionalDetails:', applicantForm.additionalDetails);
      console.log('applicantForm:', applicantForm);

      if (question.selectedValue && question.id === 1) {
        console.log("question.name:", question.selectedValue);
        payload.applicantFormDto.name = question.selectedValue ?? "";
      }
      applicantFormDetailsData.push(applicantForm);
      if (question.answerTypeData.length > 0) {
        for (let j = 0; j < question.answerTypeData.length; j++) {
          if (question.answerTypeData[j].name === question.selectedValue) {
            applicantForm.ansId = question.answerTypeData[j].id;
            applicantForm.score = question.answerTypeData[j].isActiveScore ? question.answerTypeData[j].score || 0 : null;
            applicantForm.uid = loginUserId;
            applicantForm.euid = question.answerTypeData[j].euid;
            break;
          }
        }
      }
      if (question.subQuestionTypeData.length > 0) {
        for (let k = 0; k < question.subQuestionTypeData.length; k++) {
          console.log(question.subQuestionTypeData[k]);
          let subApplicantForm = { ...applicantForm };
          subApplicantForm.kycId = props.kycId || responseId ? props.kycId || responseId : 0;
          subApplicantForm.score = question.score || null;
          subApplicantForm.uid = loginUserId;
          subApplicantForm.euid = 0;
          subApplicantForm.id = 0;
          subApplicantForm.isSubAnswer = 1;
          subApplicantForm.subQuestionId = question.subQuestionTypeData[k].id;
          subApplicantForm.answer = question.subQuestionTypeData[k].textValue;
          subApplicantForm.accountTypeId = question.subQuestionTypeData[k].accountTypeId;
          subApplicantForm.applicationTypeId = question.subQuestionTypeData[k].applicationTypeId;
          subApplicantForm.questionId = question.subQuestionTypeData[k].questionId;
          subApplicantForm.ansTypeId = question.subQuestionTypeData[k].ansTypeId;
          subApplicantForm.ansId = question.subQuestionTypeData[k].id;
          subApplicantForm.isScreening = 0;
          subApplicantForm.additionalDetails = additionalAnswers[i] || "";
          applicantFormDetailsData.push(subApplicantForm);
          console.log(applicantForm);
        }
      }
    }
    payload.applicantFormDto.applicantFormDetailsData = applicantFormDetailsData;
    console.log('Final payload:', payload);
    return payload;
  };

  const updateUiWithSavedData = async (
    questions: any[],
    customerData: kycForm[]
  ) => {
    if (customerData && customerData.length > 0 && questions) {
      console.log('customerData==========>>>', customerData);
      console.log('questions==========>>>', questions);
      for (let i = 0; i < questions.length; i++) {
        let question: any = questions[i].questionDto;
        let customerDataQuestion: any = customerData.find(
          (item) => item.kycFormDto.id === question.id
        );
        if (customerDataQuestion) {
          let value = customerDataQuestion.kycFormDto.kycAnswerData[0]?.answer;
          let additionalDetails =
            customerDataQuestion.kycFormDto.kycAnswerData[0]?.additionalDetails;
          console.log('additionalDetails:', additionalDetails);
          if (value === "Under Process" && additionalDetails) {
            question["additionalDetails"] = additionalDetails;
          }
          if (question.answerTypeData.length > 0) {
            for (let j = 0; j < question.answerTypeData.length; j++) {
              if (question.answerTypeData[j].name == value) {
                question["selectedValue"] = question.answerTypeData[j].name;
                break;
              }
            }
          }
          if (question.subQuestionTypeData.length > 0) {
            for (let k = 0; k < question.subQuestionTypeData.length; k++) {
              let customerDataSubQuestion: any = customerDataQuestion.kycFormDto.kycSubQueFormData.find(
                (item: any) => item.subQuestionId === question.subQuestionTypeData[k].id
              );
              console.log('question.subQuestionTypeData[k]======>>>', question.subQuestionTypeData[k]);
              if (question.subQuestionTypeData[k]?.name == customerDataSubQuestion?.name) {
                question.subQuestionTypeData[k]["selectedValue"] = customerDataSubQuestion.kycAnswerData[0].answer;
                question.subQuestionTypeData[k]["textValue"] = customerDataSubQuestion.kycAnswerData[0].answer;
              }
            }
          }
          else {
            question["textValue"] = value;
          }
        }
      }
    } else {
      setErrors([""]);
    }
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    let newErrors = [...errors];
    let firstErrorIndex: number | null = null;

    fetchedQuestions.forEach((question, index) => {
      const questionIndex = index;
      const answer = question.questionDto.textValue || question.questionDto.selectedValue;

      const hasValidSubAnswer = question.questionDto.subQuestionTypeData?.some(subQ =>
        subQ.textValue?.trim() || subQ.selectedValue?.trim()
      );

      if ((!answer || answer.trim() === "") && !hasValidSubAnswer) {
        newErrors[questionIndex] = "This field is required";
        if (firstErrorIndex === null) firstErrorIndex = questionIndex;
      } else {
        newErrors[questionIndex] = "";
      }
    });

    setErrors([...newErrors]);

    if (firstErrorIndex !== null) {
      setTimeout(() => {
        const errorElement = document.getElementById(`input-${firstErrorIndex}`) ||
          document.getElementById(`dropdown-${firstErrorIndex}`);
        errorElement?.focus();
      }, 100);
      return;
    }

    try {
      setLoading(true);
      let responseIdNumber;
      let kycData: any = constructSaveApplicationFormdata(loginDetails.id);
      console.log("kycData", kycData);
      const initialResponse = await applicationfrome.Apllicationinsert(kycData);
      console.log('Sent kycData:', initialResponse);
      fetchData(parseInt(initialResponse.id || props.kycId, 10), kycApplication);
      setShowSaveBtn(true);
      if (initialResponse && initialResponse.id) {
        responseIdNumber = initialResponse.id;
        sessionStorage.setItem("responseId", responseIdNumber.toString());
        setResponseId(responseIdNumber);
        showSuccessMessage("Aml Kyc Questionnaire added successfully.");
        setErrorMessage(null);
        setTimeout(() => {
          setSaveClicked(true);
        }, 2000);
        props.renderDeclarationContent();
      } else {
        console.error("Failed to generate a new responseId");
        showErrorMessage("Failed to generate a new responseId");
        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorMessage("Error submitting form, please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  const handlestep5Submit = async () => {
    showSuccessMessage("Aml Kyc Questionnaire added successfully.");
  };

  const [kycId, setKycId] = useState(null);

  useEffect(() => {
    const buttonDisabled = sessionStorage.getItem("buttonDisabled") === "true";
    setShowSaveBtn(!buttonDisabled);
  }, []);

  useEffect(() => {
    if (!kycId) {
      setShowSaveBtn(true);
    }
  }, [kycId]);

  const handleAdditionalAnswerChange = (index: number, value: string) => {
    const isSubAnswerNumber =
      value.trim() === "" || isNaN(parseInt(value, 10))
        ? 1
        : parseInt(value, 10);
    setAdditionalAnswers((prev) => ({ ...prev, [index]: value }));
    setFormData((prevFormData) => {
      const updatedFormDetails =
        prevFormData.applicantFormDto.applicantFormDetailsData.map(
          (item, idx) =>
            idx === index ? { ...item, isSubAnswer: isSubAnswerNumber } : item
        );
      return {
        ...prevFormData,
        applicantFormDto: {
          ...prevFormData.applicantFormDto,
          applicantFormDetailsData: updatedFormDetails,
        },
      };
    });
  };

  const Signonupload = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    setLoading(true);
    try {
      const responseId = sessionStorage.getItem("responseId");
      if (!responseId) {
        console.error("No responseId found in session storage");
        showErrorMessage("No responseId found in session storage");
        setLoading(false);
        return;
      }
      const documentTypeId = 1;
      const uid = loginDetails.id;
      console.log("Selected files:", selectedFiles);
      if (selectedFiles.length === 0) {
        console.error("No files selected for submission");
        showErrorMessage("No files selected for submission");
        setLoading(false);
        return;
      }
      console.log("Submitting files with responseId:", responseId, "and documentTypeId:", documentTypeId);
      await documentApiService.saveFormCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
      showSuccessMessage("Signonupload added successfully.");
      setSignUploadBtnClicked(true);
      console.log("Files submitted successfully");
    } catch (error) {
      setSignUploadBtnClicked(false);
      console.error("Error submitting files:", error);
      showErrorMessage("Error submitting files.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  const handleChooseImagesClick1 = (index1: number) => {
    document.getElementById(`image-upload-input1-${index1}`)?.click();
  };

  const handleFileChange4 = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files) as File[];
      const nameWithoutExtension = selectedFiles[0].name.replace(
        /\.[^/.]+$/,
        ""
      );
      setImages((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields[index] = {
          ...updatedFields[index],
          name: nameWithoutExtension,
          uploading: false,
          uploadSuccess: false,
        };
        return updatedFields;
      });
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  };

  const handleSubmits = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    try {
      const responseId = sessionStorage.getItem("responseId");
      console.log('responseId:', responseId);
      if (!responseId) {
        console.error("No responseId found in session storage");
        return;
      }
      const documentTypeId = 1;
      const uid = loginDetails.id;
      console.log("Selected files:", selectedFiles);
      if (selectedFiles.length === 0) {
        console.error("No files selected for submission");
        return;
      }
      console.log("Submitting files with responseId:", responseId, "and documentTypeId:", documentTypeId);
      await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
      console.log("Files submitted successfully");
      setViewBtnClicked(true);
    } catch (error) {
      setViewBtnClicked(false);
      console.error("Error submitting files:", error);
    }
  };

  const handleView = async () => {
    console.log("handleView called");
    setLoading(true);
    try {
      const responseId = sessionStorage.getItem("responseId");
      if (!responseId) {
        console.error("No responseId found in session storage");
        setErrorMessage("No responseId available");
        return;
      }
      const pdfData = await customerApiService.getkycPDF(responseId, 1);
      console.log("PDF data:", pdfData);
      if (pdfData && pdfData.data) {
        setPdfData({ base64: pdfData.data, filename: "application_form.pdf" });
        setPdfRendered(false);
        setShowPdfModal(true);
      } else {
        setErrorMessage("No PDF available");
      }
      setViewBtnClicked(true);
      console.log("PDF modal set to open");
    } catch (error) {
      console.error("Error fetching PDF:", error);
      setPdfData({ base64: null, filename: null });
      setErrorMessage("Error fetching PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("Document loaded with", numPages, "pages");
    setNumPages(numPages);
    setPdfRendered(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfRendered(false);
  };

  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const handleImageClick = async (branchId: number) => {
      if (branchId) {
        try {
          const branchId = 1;
          const imageData = await customerApiService.getLetterHead(branchId);
          const base64String = arrayBufferToBase64(imageData);
          setImageURL(base64String);
          console.log("base64String", base64String);
        } catch (error) {
          console.error("Error fetching image:", error);
          setImageURL("");
        }
      }
    };
    handleImageClick(1);
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const binary = new Uint8Array(buffer);
    const bytes = [];
    for (let i = 0; i < binary.length; i++) {
      bytes.push(String.fromCharCode(binary[i]));
    }
    return `data:image/png;base64,${btoa(bytes.join(""))}`;
  };

  return (
    <>
      <Container
        style={{ width: "274mm", minHeight: "297mm", marginTop: "5%" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {pages && pages.map((pageContent, pageIndex) => (
            <Paper key={pageIndex} elevation={10} style={{ marginBottom: "20px" }}>
              <div style={{ position: "relative", width: "100%", minHeight: "100%", padding: "20px", }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ fontSize: "small" }}>
                        <TableCell sx={{ width: "5%", padding: "5px", fontSize: "0.875rem", backgroundColor: "#d6d0d09e", }}> Sl.no</TableCell>
                        <TableCell sx={{ width: "50%", padding: "5px", fontSize: "0.875rem", backgroundColor: "#d6d0d09e", }}>Question</TableCell>
                        <TableCell sx={{ width: "45%", padding: "5px", fontSize: "0.875rem", backgroundColor: "#d6d0d09e", margin: 'auto', textAlign: 'center' }}>Answer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pageContent.map((item: any, index: any) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell sx={{ width: "5%", padding: "20px", fontSize: "0.75rem", whiteSpace: "pre-wrap", fontWeight: "900", }}>{index + 1 + pageIndex * itemsPerPage}</TableCell>

                            <TableCell sx={{ width: "50%", padding: "4px", fontSize: "0.75rem", whiteSpace: "pre-wrap", fontWeight: "900", }}>
                              <span>{item.questionDto.name}</span>
                              <span>{item.questionDto.multiQuestion === 1 &&
                                item.questionDto.subQuestionTypeData &&
                                item.questionDto.subQuestionTypeData.map(
                                  (subQuestion: any) => (
                                    <Typography key={subQuestion.id}><span>{subQuestion.name}:</span></Typography>
                                  )
                                )}</span>
                              <span>{item.questionDto.ansTypeId === 2 && (
                                <Typography variant="body2" color="textSecondary"><span>{item.questionDto.description}</span> </Typography>
                              )}</span>
                            </TableCell>
                            <TableCell sx={{ width: "45%", padding: "4px", fontSize: "0.75rem", whiteSpace: "pre-wrap", }}>
                              <span>{item.questionDto.multiQuestion === 1 &&
                                item.questionDto.subQuestionTypeData &&
                                item.questionDto.subQuestionTypeData.map(
                                  (subQuestion: any) => (
                                    <React.Fragment key={subQuestion.id}>
                                      <span>
                                        {subQuestion.ansTypeId === 2 ? (
                                          <>
                                            <Select
                                              id={`dropdown-${index}`}
                                              style={{ fontSize: "small" }}
                                              fullWidth
                                              size="small"
                                              value={
                                                subQuestion.textValue
                                                  ? subQuestion.textValue
                                                  : ''
                                              }
                                              onChange={(e) =>
                                                handleAnswerChange(
                                                  index +
                                                  pageIndex * itemsPerPage,
                                                  e.target.value,
                                                  true,
                                                  subQuestion.id
                                                )
                                              }
                                              name={`question-${index}`}
                                              sx={{
                                                border: errors[index + pageIndex * itemsPerPage] ? '0px solid red' : '',
                                                backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "",
                                              }}
                                              error={Boolean(errors[index + pageIndex * itemsPerPage])}
                                            >
                                            </Select>
                                            {showInputBox[
                                              index + pageIndex * itemsPerPage
                                            ] && (
                                                <TextField
                                                  sx={{
                                                    fontSize: "x-small",
                                                    marginTop: "10px",
                                                    border: errors[index + pageIndex * itemsPerPage] ? '0px solid red' : '',
                                                    backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "",
                                                  }}
                                                  error={Boolean(errors[index + pageIndex * itemsPerPage])}
                                                  fullWidth
                                                  size="small"
                                                  autoComplete="off"
                                                  multiline
                                                  placeholder="Please provide additional details"
                                                  value={
                                                    additionalAnswers[
                                                      index +
                                                      pageIndex * itemsPerPage
                                                    ]?.trimStart()
                                                  }
                                                  InputLabelProps={{ className: 'inputFeild' }}
                                                  InputProps={{ className: 'inputFeild' }}
                                                  onChange={(e) =>
                                                    handleAdditionalAnswerChange(
                                                      index +
                                                      pageIndex * itemsPerPage,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              )}
                                          </>
                                        ) : (
                                          <TextField
                                            sx={{
                                              fontSize: "x-small", marginTop: "10px",
                                              border: errors[index] ? '0px solid red' : '',
                                              backgroundColor: errors[index] ? "#ffe6e6" : "",
                                            }}
                                            error={Boolean(errors[index + pageIndex * itemsPerPage])}
                                            fullWidth
                                            size="small"
                                            autoComplete="off"
                                            multiline
                                            placeholder="Name Text"
                                            value={subQuestion.textValue}
                                            name={`question-${index}`}
                                            InputLabelProps={{ className: 'inputFeild' }}
                                            InputProps={{ className: 'inputFeild' }}
                                            onChange={(e) =>
                                              handleAnswerChange(
                                                index +
                                                pageIndex * itemsPerPage,
                                                e.target.value,
                                                true,
                                                subQuestion.id
                                              )
                                            }
                                          />
                                        )}
                                      </span>
                                      {/* 17 question error message is being display for 2 time issues part */}
                                      {/* {errors[
                                        index + pageIndex * itemsPerPage
                                      ] && (
                                          <Typography
                                            variant="caption"
                                            color="error"
                                          >
                                            {
                                              errors[
                                              index + pageIndex * itemsPerPage
                                              ]
                                            }
                                          </Typography>
                                        )} */}
                                    </React.Fragment>
                                  )
                                )}</span>
                              <span>
                                {!item.questionDto.multiQuestion && item.questionDto.ansTypeId === 2 && (
                                  <>
                                    <Autocomplete
                                      options={item.questionDto.answerTypeData.map((answer: { name: any; }) => answer.name)}
                                      getOptionLabel={(option) => option}
                                      style={{ width: '100%', fontSize: 'small' }}
                                      isOptionEqualToValue={(option, value) => option === value}
                                      onChange={(event, value) => {
                                        const newValue = value || '';
                                        if (item.questionDto.selectedValue !== newValue) {
                                          handleAnswerChange(
                                            index + pageIndex * itemsPerPage,
                                            newValue,
                                            false
                                          );
                                        }
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          variant="outlined"
                                          fullWidth
                                          onKeyDown={(event) => {
                                            const inputValue = params.inputProps.value as string | undefined;
                                            if (event.key === 'Tab' && inputValue) {
                                              const matchedOption = item.questionDto.answerTypeData.find(
                                                (answer: { name: string; }) =>
                                                  typeof answer.name === 'string' &&
                                                  answer.name.toLowerCase().startsWith(inputValue.toLowerCase())
                                              );
                                              if (matchedOption) {
                                                handleAnswerChange(
                                                  index + pageIndex * itemsPerPage,
                                                  matchedOption.name,
                                                  false
                                                );
                                              } else {
                                                handleAnswerChange(
                                                  index + pageIndex * itemsPerPage,
                                                  '',
                                                  false
                                                );
                                              }
                                            }
                                          }}
                                          sx={{
                                            fontSize: "x-small", marginTop: "10px",
                                            border: errors[index + pageIndex * itemsPerPage] ? '0px solid red' : '',
                                            backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "",
                                          }}
                                          error={Boolean(errors[index + pageIndex * itemsPerPage])}
                                        />
                                      )}
                                      value={item.questionDto.selectedValue || ''}
                                      onInputChange={(event, newInputValue) => {
                                        if (item.questionDto.selectedValue !== newInputValue) {
                                          item.questionDto.selectedValue = newInputValue;
                                          const matchedOption = item.questionDto.answerTypeData.find(
                                            (answer: { name: string; }) =>
                                              typeof answer.name === 'string' &&
                                              answer.name.toLowerCase().startsWith(newInputValue.toLowerCase())
                                          );
                                          if (matchedOption) {
                                            handleAnswerChange(
                                              index + pageIndex * itemsPerPage,
                                              matchedOption.name,
                                              false
                                            );
                                          }
                                        }
                                      }}
                                    />
                                    {showInputBox[index + pageIndex * itemsPerPage] && (
                                      <TextField
                                        sx={{ fontSize: 'x-small', marginTop: '10px' }}
                                        fullWidth
                                        size="small"
                                        autoComplete="off"
                                        multiline
                                        placeholder="Please provide additional details"
                                        value={additionalAnswers[index + pageIndex * itemsPerPage]?.trimStart() || ''}
                                        InputLabelProps={{ className: 'inputFeild' }}
                                        InputProps={{ className: 'inputFeild' }}
                                        onChange={(e) =>
                                          handleAdditionalAnswerChange(
                                            index + pageIndex * itemsPerPage,
                                            e.target.value.trimStart()
                                          )
                                        }
                                      />
                                    )}
                                  </>
                                )}
                              </span>
                              <span>
                                {!item.questionDto.multiQuestion &&
                                  item.questionDto.ansTypeId !== 2 && (
                                    <TextField
                                      id={`input-${index}`}
                                      sx={{
                                        fontSize: "x-small", marginTop: "10px",
                                        border: errors[index + pageIndex * itemsPerPage] ? "0px solid red" : "",
                                        backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "", //for all the textbox except 17
                                      }}
                                      fullWidth
                                      size="small"
                                      autoComplete="off"
                                      placeholder="Text Field"
                                      value={item.questionDto.textValue}
                                      name={`question-${index}`}
                                      InputLabelProps={{ className: 'inputFeild' }}
                                      InputProps={{ className: 'inputFeild' }}
                                      error={Boolean(errors[index + pageIndex * itemsPerPage])}
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          index + pageIndex * itemsPerPage,
                                          e.target.value,
                                          false
                                        )
                                      }
                                    />
                                  )}
                                {item.questionDto.additionalDetails && !showInputBox[index + pageIndex * itemsPerPage] && (
                                  <div>
                                    <TextField
                                      sx={{
                                        fontSize: "x-small",
                                        marginTop: "10px",
                                      }}
                                      fullWidth
                                      size="small"
                                      autoComplete="off"
                                      multiline
                                      placeholder="Please provide additional details"
                                      value={additionalAnswers[index + pageIndex * itemsPerPage]?.trimStart() || item.questionDto.additionalDetails || ''}
                                      InputLabelProps={{ className: 'inputFeild' }}
                                      InputProps={{ className: 'inputFeild' }}
                                      onChange={(e) =>
                                        handleAdditionalAnswerChange(
                                          index + pageIndex * itemsPerPage,
                                          e.target.value.trimStart()
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                {/* For diplaying error message below the textbox and dropdown */}
                                {errors[index + pageIndex * itemsPerPage] && (
                                  <Typography variant="caption" color="error">
                                    {errors[index + pageIndex * itemsPerPage]}
                                  </Typography>
                                )}
                                {/* For Displaying the red colour for error messages */}
                                {errorMessage && item.questionDto.name === "Name" && !item.questionDto.textValue && (
                                  <Typography variant="caption" color="error">
                                    {errorMessage}
                                  </Typography>
                                )}
                              </span>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div style={{ textAlign: "right", marginTop: "16px", position: "absolute", right: "20px", fontSize: "small", bottom: "0px", }}>Page : {pageIndex + 1}</div>
                <div style={{ textAlign: "right", position: "absolute", fontSize: "small", }}> Update: {printNumber}</div>
              </div>
            </Paper>
          ))}

          <Paper elevation={10} style={{ marginBottom: "20px" }}>
            <div style={{ position: "relative", width: "100%", minHeight: "100%", padding: "20px", }} >
              <div style={a4SheetStyles}>
                <table style={tableStyles}>
                  <tbody>
                    <tr style={evenRowStyles}>
                      <td style={{ ...cellStyle, width: "30%" }}><strong>Name</strong></td>
                      <td style={{ ...cellStyle, width: "70%" }}> </td>
                    </tr>
                    <tr>
                      <td style={{ ...cellStyle, width: "30%" }}><strong>Designation</strong></td>
                      <td style={{ ...cellStyle, width: "70%" }}> </td>
                    </tr>
                    <tr style={evenRowStyles}>
                      <td style={{ ...cellStyle, width: "30%" }}><strong>Signature</strong></td>
                      <td style={{ ...cellStyle, width: "70%" }}> </td>
                    </tr>
                    <tr>
                      <td style={{ ...cellStyle, width: "30%" }}><strong>Seal of the Member</strong></td>
                      <td style={{ ...cellStyle, width: "70%" }}> </td>
                    </tr>
                    <tr style={evenRowStyles}>
                      <td style={{ ...cellStyle, width: "30%" }}><strong>Date</strong></td>
                      <td style={{ ...cellStyle, width: "70%" }}> </td>
                    </tr>
                    <tr>
                      <td style={{ ...cellStyle, width: "30%" }}><strong>Place</strong></td>
                      <td style={{ ...cellStyle, width: "70%" }}> </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ textAlign: "right", marginTop: "16px", position: "absolute", right: "20px", fontSize: "small", bottom: "15px", }}>Page : {6}</div>
                <div style={{ textAlign: "right", position: "absolute", fontSize: "small", bottom: "15px", }}>Update: {printNumber} </div>
              </div>
            </div>
          </Paper>

          {dataFetched && (
            <div>
              {applicationTypeId === 1 && accountTypeId === 2 && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="arroww" style={{ marginRight: "10px" }}>
                    <span style={{ textAlign: "center" }}>Step 1:</span>
                  </div>
                  <button style={{ width: '12%' }}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={!showSaveBtn}
                  >
                    Save</button>
                  <br />
                </div>
              )}
              <br></br>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="arroww" style={{ marginRight: "10px" }}>
                  <span style={{ textAlign: "center" }}>Step 2:</span>
                </div>
                <button style={{ width: '12%' }} className={`btn btn-sm ${saveClicked ? 'btn-primary' : 'btn-secondary'}`} onClick={downloadPDF} disabled={!saveClicked}>Download</button>
                {loading && <Loader />}
              </div>
              <br></br>
              {downloadingPDF && (
                <p style={{ color: "red" }}>
                  Please wait for the download...
                </p>
              )}

              {isLevelcasedetailsOpen && (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      {images.map((image, index) => (
                        <Grid item xs={12} key={index}>
                          <form
                            onSubmit={handleSubmits}
                            encType="multipart/form-data"
                          >
                            <div className="person-container">
                              <div className="field-group">
                                <div className="field-group-column">
                                  <input
                                    type="file"
                                    id={`image-upload-input1-${index}`}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(event) => {
                                      handleFileChange(event);
                                      handleFileChange4(index, event);
                                    }}
                                    style={{ display: "none" }}
                                    multiple
                                  />
                                  <Button
                                    variant="outlined"
                                    onClick={() =>
                                      handleChooseImagesClick1(index)
                                    }
                                    style={{ marginRight: "10px" }}
                                  >
                                    Document
                                  </Button>
                                  <TextField
                                    style={{ width: "50%" }}
                                    label="Attachment"
                                    type="text"
                                    size="small"
                                    variant="outlined"
                                    value={image.name}
                                    disabled
                                    fullWidth
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              )}

              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="arroww" style={{ marginRight: "10px" }}>
                  <span style={{ textAlign: "center" }}>Step 3:</span>
                </div>
                <form onSubmit={Signonupload} style={{ width: "11%" }}>
                  <button
                    style={{ width: '109%', marginLeft: '-1%' }}
                    className={`btn btn-sm ${downlodClicked ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={selectedFiles.length === 0}
                  >
                    Sign on upload
                  </button>
                </form>
                {loading && <Loader />}
              </div>

              <br></br>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="arroww" style={{ marginRight: "10px" }}>
                  <span style={{ textAlign: "center" }}>Step 4:</span>
                </div>
                <button
                  style={{ width: "12%" }}
                  className={`btn btn-sm ${signUploadBtnClicked ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={!signUploadBtnClicked}
                  onClick={handleView}
                >
                  View
                </button>
                {loading && <Loader />}
                {/* {errorMessage && (
                  <Typography
                    variant="body1"
                    style={{ color: "red", textAlign: "center", marginLeft: '1%' }}
                  >
                    {errorMessage}
                  </Typography>
                )} */}
              </div>

              <br></br>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="arroww" style={{ marginRight: "10px" }}>
                  <span style={{ textAlign: "center" }}>Step 5:</span>
                </div>
                <div style={{ width: '6%' }}>
                  <button
                    style={{ width: "200%" }}
                    className={`btn btn-sm ${viewBtnClicked ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      handlestep5Submit();
                    }}
                    disabled={!viewBtnClicked}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          <br></br>
        </LocalizationProvider>
      </Container>
      {/* <Card> */}
      <div>

        <Dialog open={showImageModal} onClose={handleCloseImageModal} fullWidth maxWidth="xl">
          <DialogTitle>Image Preview</DialogTitle>
          <DialogContent>
            {base64Image && (
              <img
                src={`data:image/png;base64,${base64Image}`}
                alt="Image Preview"
              />
            )}
            {errorMessage && (
              <Typography variant="body1">{errorMessage}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageModal}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* pdf view */}

        <Dialog open={showPdfModal} onClose={handleClosePdfModal} maxWidth="md">
          {loading && <Loader />}
          <DialogTitle>PDF Preview
            <IconButton aria-label="close" onClick={handleClosePdfModal} style={{ position: "absolute", right: 8, top: 8, color: "#aaa" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers={true} style={{ overflow: "auto", padding: 0, margin: 0 }}>
            {loading && <Loader />}
            {pdfData.base64 ? (
              <div style={{ border: "1px solid #e0e0e0", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", height: '100%', overflow: 'hidden', }}>
                <Document file={`data:application/pdf;base64,${pdfData.base64}`} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(error) => console.error("PDF load error", error)} className="pdf-document" >
                  {Array.from(new Array(numPages), (el, index) => (
                    <div
                      key={`page_${index + 1}`}
                      style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center", overflow: "hidden", height: 'auto', }}>
                      <Page
                        pageNumber={index + 1}
                        width={Math.min(window.innerWidth * 0.85, 800)}
                        scale={1.1}
                      />
                    </div>
                  ))}
                </Document>
              </div>
            ) : (
              <Typography variant="body1" style={{ color: "red", textAlign: "center" }}>
                {errorMessage || "No PDF available"}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {pdfData.filename && (
              <Button
                onClick={handleDownload}
                href={`data:application/pdf;base64,${pdfData.base64}`}
                download={pdfData.filename}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
              >
                {downloading ? <Loader /> : 'Download PDF'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

      </div>

      {/* pdf download part */}
      <div id="pdfContentApp"
        style={{ display: "none" }}
      >
        {pageView && pageView.map((pageContent, pageIndex) => (
          <Paper key={pageIndex}
            style={{
              marginBottom: "20px",
              boxShadow: '0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)',
              width: '274mm', minHeight: '297mm'
            }}
          >
            <div ref={contentRef} style={{ width: '274mm', minHeight: '297mm', padding: '20px' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ fontSize: 'small' }}>
                      <TableCell style={{ width: '5%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
                      <TableCell style={{ width: '60%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
                      <TableCell style={{ width: '35%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageContent &&
                      pageContent.map((item: any, index: any) => (
                        <TableRow key={index} sx={{ height: '24px' }}>
                          <TableCell sx={{ width: '5%', padding: '12px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>{index + 1 + pageIndex * itemsPerPagePdf}</TableCell>

                          <TableCell sx={{ width: '60%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
                            {item && item.questionDto ? (
                              <>
                                <strong>{item.questionDto.name}</strong>
                                {console.log(item.questionDto)}
                                {item.questionDto.description && (
                                  <Typography variant="body2" color="textSecondary">{item.questionDto.description}</Typography>
                                )}
                              </>
                            ) : null}
                          </TableCell>

                          <TableCell sx={{ width: '30%', padding: '4px', fontSize: '0.75rem' }}>
                            {item && item.questionDto ? (
                              item.questionDto.id === 17 ? (
                                <>
                                  <Typography variant="body1" color="textSecondary">
                                    {item.questionDto.subQuestionTypeData.map((subQuestion: any) => (
                                      <div key={subQuestion.id}>
                                        <strong style={{ fontWeight: 'bold', fontSize: '1rem' }}>{subQuestion.name} : </strong>
                                        <span style={{ fontWeight: 'normal' }}>{subQuestion.selectedValue || "No answer available"}</span>
                                      </div>
                                    ))}
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  {
                                    (item.questionDto.selectedValue === "Under Process" || item.questionDto.textValue === "Under Process") ? (
                                      <>
                                        <Typography variant="body1" sx={{ fontWeight: 'normal', color: 'text.primary' }}>
                                          {item.questionDto.selectedValue || item.questionDto.textValue}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', fontSize: '1rem' }}>
                                          <div><span style={{ fontWeight: 'bold' }}>Additional Details : </span>{item.questionDto.additionalDetails || "No additional details provided"}</div>
                                        </Typography>
                                      </>
                                    ) : (
                                      <Typography variant="body1" sx={{ fontWeight: 'normal', color: 'text.primary' }}>
                                        {(item.questionDto.selectedValue || item.questionDto.textValue) || "No answer available"}
                                      </Typography>
                                    )
                                  }
                                </>
                              )
                            ) : null}
                          </TableCell>

                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Paper>
        ))}

        <div style={{ ...a4SheetStyle, contentVisibility: "hidden" }}>
          <table style={tableStyle}>
            <tbody>
              <tr style={evenRowStyle}>
                <td style={{ ...cellStyle, width: "30%" }}><strong>Name</strong></td>
                <td style={{ ...cellStyle, width: "70%" }}>  </td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, width: "30%" }}> <strong>Designation</strong></td>
                <td style={{ ...cellStyle, width: "70%" }}> </td>
              </tr>
              <tr style={evenRowStyle}>
                <td style={{ ...cellStyle, width: "30%" }}><strong>Signature</strong></td>
                <td style={{ ...cellStyle, width: "70%" }}> </td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, width: "30%" }}><strong>Seal of the Member</strong></td>
                <td style={{ ...cellStyle, width: "70%" }}> </td>
              </tr>
              <tr style={evenRowStyle}>
                <td style={{ ...cellStyle, width: "30%" }}><strong>Date</strong></td>
                <td style={{ ...cellStyle, width: "70%" }}> </td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, width: "30%" }}><strong>Place</strong></td>
                <td style={{ ...cellStyle, width: "70%" }}> </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      {/* </Card> */}

      <Snackbar open={isSuccessOpen} autoHideDuration={5000} onClose={() => setIsSuccessOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right", }}>
        <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => setIsSuccessOpen(false)}>{successMessage}</MuiAlert>
      </Snackbar>

      <Snackbar open={isErrorOpen} autoHideDuration={5000} onClose={() => setIsErrorOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right", }}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => setIsErrorOpen(false)}>{errorMessage}</MuiAlert>
      </Snackbar>

    </>
  );

};

export default ApplicationForm;

//Below code can do additional details validation,17 questions validation but in draft page it showing error message even there is
//  datas in the 17 question that one problem other wise all the parts are working correctly only.
//=====================================================================================================================================
// import React, { useEffect, useRef, useState } from "react";
// import { TextField, Button, Grid, Select, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, } from "@mui/material";
// import { Card } from "react-bootstrap";
// import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
// import { QuestionType, AppFormData, kycForm, ApplicantFormDetailsData, } from "../../../data/services/kyc/applicationfrom/applicationfrome-payload";
// import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import DocumentApiService from "../../../data/services/document/Document_api_service";
// import "./Form.css";
// import { IconButton } from "@mui/material";
// import { Document, Page, pdfjs } from "react-pdf";
// import { useLocation } from "react-router-dom";
// import MuiAlert from "@mui/material/Alert";
// import { useSelector, useDispatch } from 'react-redux';
// import { saveQuestionnaire, } from "./state/save-application-action";
// import { useApplicationContext } from "../../kyc/Insert/ApplicationContext";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
// import CloseIcon from '@mui/icons-material/Close';
// import Loader from "../../loader/loader";
// import '../../CommonStyle/Style.css'
// import Autocomplete from "@mui/lab/Autocomplete";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// interface Image {
//   name: string;
//   uploading: boolean;
//   uploadSuccess: boolean;
// }

// const ApplicationForm = (props: any) => {

//   const [formData, setFormData] = useState<AppFormData>({
//     applicantFormDto: {
//       id: 0,
//       name: "",
//       numberOfPrint: 0,
//       isCompleted: 0,
//       isScreening: 0,
//       uid: 0,
//       applicantFormDetailsData: [],
//     },
//   });

//   const initialImageState: Image = {
//     name: "",
//     uploading: false,
//     uploadSuccess: false,
//   };

//   const documentApiService = new DocumentApiService();
//   const [images, setImages] = useState<Image[]>([initialImageState]);
//   const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
//   const [dataFetched, setDataFetched] = useState(false);
//   const [downloadingPDF, setDownloadingPDF] = useState(false);
//   const applicationfrome = new ApplicationfromeService();
//   const { setResponseId } = useApplicationContext();
//   const [downloadCount, setDownloadCount] = useState(0);
//   const [formFullyRendered, setFormFullyRendered] = useState(false);
//   const [showSaveBtn, setShowSaveBtn] = useState(true);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [saveClicked, setSaveClicked] = useState(false);
//   const [downlodClicked, setDownlodClicked] = useState(false);
//   const [signUploadBtnClicked, setSignUploadBtnClicked] = useState(false);
//   const [viewBtnClicked, setViewBtnClicked] = useState(false);
//   const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//   const [isLevelcasedetailsOpen, setIsLevelcasedetailsOpen] = useState(false);
//   const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(false);
//   const [showInputBox, setShowInputBox] = useState<{ [key: number]: boolean }>({});
//   const [additionalAnswers, setAdditionalAnswers] = useState<{ [key: number]: string; }>({});
//   const kycApplication = useSelector((state: any) => state.kycApplication?.saveApplicationReducer);
//   console.log("kycApplication", kycApplication);
//   const dispatch = useDispatch();
//   const { state } = useLocation();
//   const applicationTypeId = 1;
//   const accountTypeId = 2;
//   const [customerdata, setcustomerData] = useState<kycForm[]>([]);
//   const [pageView, setPageView] = useState<any[]>([]);
//   const [pages, setPages] = useState<any[]>([]);
//   const [noOfPrint, setNoOfPrint] = useState<number>(formData.applicantFormDto.numberOfPrint || 1);
//   const responseId = sessionStorage.getItem("responseId");
//   const [loading, setLoading] = useState(false);
//   const [printNumber, setPrintNumber] = useState<string>('');
//   const [downloading, setDownloading] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showPdfModal, setShowPdfModal] = useState(false);
//   const [base64Image, setBase64Image] = useState<string | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const customerApiService = new DocumentApiService();
//   const [pdfRendered, setPdfRendered] = useState(false);
//   const [errors, setErrors] = useState<string[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isErrorOpen, setIsErrorOpen] = useState(false);
//   const userDetails = useSelector((state: any) => state.loginReducer);
//   const loginDetails = userDetails.loginDetails;
//   console.log('loginDetails:', loginDetails);
//   const itemsPerPagePdf = 22;
//   const itemsPerPage = 10;

//   const [pdfData, setPdfData] = useState<{
//     base64: string | null;
//     filename: string | null;
//   }>({ base64: null, filename: null });

//   const a4SheetStyle = {
//     width: "210mm",
//     minHeight: "297mm",
//     padding: "20px",
//   };

//   const tableStyle: React.CSSProperties = {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "12px",
//   };

//   const cellStyle = {
//     padding: "8px",
//     border: "1px solid #000",
//   };

//   const evenRowStyle = {
//     backgroundColor: "#f2f2f2",
//   };

//   const a4SheetStyles = {
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//   };

//   const tableStyles: React.CSSProperties = {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "12px",
//   };

//   const evenRowStyles = {
//     backgroundColor: "#f2f2f2",
//   };

//   useEffect(() => {
//     if (loading) {
//       document.body.classList.add('blur');
//     } else {
//       document.body.classList.remove('blur');
//     }
//   }, [loading]);

//   const fetchData = async (kycId: any, questions: any) => {
//     try {
//       setLoading(true);
//       const customerData: any[] = await applicationfrome.getkycData(kycId);
//       const response = await applicationfrome.getPrintNumber(responseId);
//       setPrintNumber(response);
//       console.log("Print Number:", response);
//       setcustomerData(customerData);
//       updateUiWithSavedData(questions, customerData);
//       if (questions[0].questionDto) {
//         dispatch(saveQuestionnaire(questions));
//       }
//     } catch (error) {
//       setErrors(["Error fetching data"]);
//       // setErrors([""]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showSuccessMessage = (message: string) => {
//     setSuccessMessage(message);
//     setIsSuccessOpen(true);
//     setTimeout(() => {
//       setIsSuccessOpen(false);
//       setSuccessMessage("");
//     }, 1000);
//   };

//   const showErrorMessage = (message: string) => {
//     setErrorMessage(message);
//     setIsErrorOpen(true);
//   };

//   const downloadPDF = async () => {
//     setDownloadingPDF(true);
//     try {
//       setLoading(true);
//       const response = await applicationfrome.getPrintNumber(responseId);
//       const printNumber = response;
//       const content = document.getElementById("pdfContentApp") as HTMLElement;
//       if (!content) return;
//       content.style.display = "block";
//       const pdf = new jsPDF("p", "mm", "a4");
//       const padding = 10;
//       const scale = 1.5;
//       const pageWidth = 210;
//       const pageHeight = 297;
//       const contentWidth = pageWidth - 2 * padding;
//       const contentHeight = pageHeight - 2 * padding;
//       const totalPages = content.childNodes.length;

//       const defaultFontSize = 12;
//       pdf.setFontSize(defaultFontSize);

//       for (let i = 0; i < totalPages; i++) {
//         const page = content.childNodes[i] as HTMLElement;
//         const canvas = await html2canvas(page, { scale: scale, useCORS: true, logging: true });
//         const imgData = canvas.toDataURL("image/png");
//         if (i > 0) pdf.addPage();

//         const headerText = " ";
//         const headerFontSize = 16;
//         pdf.setFontSize(headerFontSize);
//         pdf.setFont("helvetica", "bold");
//         pdf.text(headerText, padding, padding);

//         const textWidth = pdf.getTextWidth(`Update: ${printNumber}`);
//         const xCoordinate = pageWidth - textWidth - padding;
//         const textYCoordinate = padding + 10;
//         pdf.setFontSize(defaultFontSize);
//         pdf.text(`Update: ${printNumber}`, xCoordinate, textYCoordinate);

//         const contentYStart = padding + 20;
//         pdf.addImage(imgData, "PNG", padding, contentYStart, contentWidth, contentHeight - contentYStart);
//         pdf.setLineWidth(0.2);
//         pdf.setDrawColor(0, 0, 0);
//         pdf.rect(padding, contentYStart, contentWidth, contentHeight - contentYStart);

//         const pageNumberText = `${i + 1} / ${totalPages}`;
//         pdf.setFontSize(10);
//         pdf.text(pageNumberText, pageWidth - padding, pageHeight - padding + 5, { align: "right" });
//       }

//       pdf.save("application_form.pdf");
//       setDownlodClicked(true);
//       showSuccessMessage("Download successfully.");
//     } catch (error) {
//       setErrors(["Error generating PDF"]);
//       setDownlodClicked(false);
//     } finally {
//       const content = document.getElementById("pdfContentApp") as HTMLElement;
//       if (content) {
//         content.style.display = "none";
//       }
//       setDownloadingPDF(false);
//       setDownloadCount((prevCount) => prevCount + 1);
//       setDownlodClicked(true);
//       setLoading(false);
//     }
//     setIsLevelcasedetailsOpen(true);
//     setIsUploadSectionOpen(false);
//   };

//   useEffect(() => {
//     fetchQuestions(kycApplication);
//     setDataFetched(true);
//     splitDataIntoPage(kycApplication, itemsPerPagePdf);
//     splitDataIntoPages(kycApplication, itemsPerPage);
//   }, [kycApplication]);

//   const splitDataIntoPages = (data: any[], itemsPerPage: number) => {
//     if (!data) {
//       return;
//     }
//     const pages = [];
//     for (let i = 0; i < data.length; i += itemsPerPage) {
//       pages.push(data.slice(i, i + itemsPerPage));
//     }
//     setPages([...pages]);
//   };

//   const splitDataIntoPage = (data: any[], itemsPerPages: number) => {
//     if (!data) {
//       return;
//     }
//     const pageView = [];
//     for (let i = 0; i < data.length; i += itemsPerPages) {
//       pageView.push(data.slice(i, i + itemsPerPages));
//     }
//     setPageView([...pageView]);
//     return pageView;
//   };

//   console.log("pageView", pageView);
//   console.log("kyc form responseId:", responseId);

//   useEffect(() => {
//     if (responseId || props.kycId) {
//       setShowSaveBtn(true);
//       fetchData(parseInt(responseId || props.kycId, 10), kycApplication);
//       console.log("Declaration responseId:", responseId);
//       setImages((prevImages) =>
//         prevImages.map((image) => ({
//           ...image,
//           kycId: parseInt(responseId || props.kycId, 10),
//         }))
//       );
//     }
//     if (props.kycId) {
//       setShowSaveBtn(true);
//     }
//   }, [responseId]);

//   const fetchQuestions = async (data?: any) => {
//     try {
//       setFetchedQuestions([...data]);
//       setDataFetched(true);
//       // setErrors(Array(kycApplication.length).fill(""));
//       setFormFullyRendered(true);
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//     }
//   };

//   const handleAnswerChange = (
//     index: number,
//     value: string,
//     isSubQuestion: boolean,
//     subQuestionId: number | null = null,
//     additionalDetails: string = ''
//   ) => {
//     setErrors((prevErrors) => {
//       const newErrors = [...prevErrors];
//       if (value.trim() !== "") {
//         newErrors[index] = "";
//       } else {
//         newErrors[index] = "This field is required";
//       }
//       return newErrors;
//     });

//     const updatedList = fetchedQuestions.map((item: any, idx) => {
//       if (index === idx) {
//         if (
//           !item.questionDto.multiQuestion &&
//           item.questionDto.answerTypeData.length > 0
//         ) {
//           item.questionDto.selectedValue = value;
//           item.questionDto.textValue = value;
//           if (value === 'Under Process') {
//             console.log('Value is Under Process:', value);
//             console.log('Additional Details:', additionalDetails);
//             item.questionDto.additionalDetails = additionalDetails;
//             setShowInputBox((prev) => ({ ...prev, [index]: true }));
//           } else {
//             console.log('Value is not Under Process:', value);
//             item.questionDto.additionalDetails = '';
//             setShowInputBox((prev) => ({ ...prev, [index]: false }));
//           }
//           return { ...item };
//         }
//         if (isSubQuestion && item.questionDto.subQuestionTypeData.length > 0) {
//           let subQuestion: any[] = item.questionDto.subQuestionTypeData;
//           for (let i = 0; i < subQuestion.length; i++) {
//             if (subQuestion[i].id == subQuestionId) {
//               subQuestion[i].textValue = value;
//             }
//           }
//           return { ...item };
//         } else {
//           item.questionDto.textValue = value;
//           item.questionDto.selectedValue = value;
//           return { ...item };
//         }
//       }
//       return item;
//     });
//     setFetchedQuestions(updatedList);
//     dispatch(saveQuestionnaire(updatedList));
//   };

//   const constructSaveApplicationFormdata = (loginUserId: number) => {
//     let payload: AppFormData = {
//       applicantFormDto: {
//         id: props.kycId || responseId ? props.kycId || responseId : 0,
//         name: "",
//         numberOfPrint: noOfPrint,
//         isCompleted: 0,
//         isScreening: 0,
//         uid: loginUserId,
//         applicantFormDetailsData: [],
//       },
//     };
//     console.log('Constructed payload:', payload);
//     let applicantFormDetailsData: ApplicantFormDetailsData[] = [];
//     console.log('Final applicantFormDetailsData:', applicantFormDetailsData);
//     console.log('fetchedQuestions final ======>', fetchedQuestions);
//     for (let i = 0; i < fetchedQuestions.length; i++) {
//       let question: any = fetchedQuestions[i].questionDto;
//       let applicantForm: any = {};
//       applicantForm.id = question.id;
//       applicantForm.kycId = props.kycId || responseId ? props.kycId || responseId : 0;
//       applicantForm.accountTypeId = question.accountTypeId;
//       applicantForm.applicationTypeId = question.applicationTypeId;
//       applicantForm.questionId = question.id;
//       applicantForm.subQuestionId = 0;
//       applicantForm.ansTypeId = question.ansTypeId;
//       applicantForm.isSubAnswer = 0;
//       applicantForm.answer = question.textValue ? question.textValue : question.selectedValue;
//       applicantForm.score = question.score ? question.score : null;
//       applicantForm.uid = loginUserId;
//       applicantForm.euid = 0;
//       applicantForm.ansId = null;
//       applicantForm.isScreening = 0;
//       applicantForm.additionalDetails = "";
//       console.log('Adding to payload, additionalDetails:', applicantForm.additionalDetails);
//       console.log('applicantForm:', applicantForm);

//       if (additionalAnswers[i] && additionalAnswers[i].trim() !== "") {
//         applicantForm.additionalDetails = additionalAnswers[i];
//       } else if (question.additionalDetails && question.additionalDetails.trim() !== "") {
//         applicantForm.additionalDetails = question.additionalDetails;
//       }
//       console.log('Adding to payload, additionalDetails:', applicantForm.additionalDetails);
//       console.log('applicantForm:', applicantForm);

//       if (question.selectedValue && question.id === 1) {
//         console.log("question.name:", question.selectedValue);
//         payload.applicantFormDto.name = question.selectedValue ?? "";
//       }
//       applicantFormDetailsData.push(applicantForm);
//       if (question.answerTypeData.length > 0) {
//         for (let j = 0; j < question.answerTypeData.length; j++) {
//           if (question.answerTypeData[j].name === question.selectedValue) {
//             applicantForm.ansId = question.answerTypeData[j].id;
//             applicantForm.score = question.answerTypeData[j].isActiveScore ? question.answerTypeData[j].score || 0 : null;
//             applicantForm.uid = loginUserId;
//             applicantForm.euid = question.answerTypeData[j].euid;
//             break;
//           }
//         }
//       }
//       if (question.subQuestionTypeData.length > 0) {
//         for (let k = 0; k < question.subQuestionTypeData.length; k++) {
//           console.error(question.subQuestionTypeData[k]);
//           let subApplicantForm = { ...applicantForm };
//           subApplicantForm.kycId = props.kycId || responseId ? props.kycId || responseId : 0;
//           subApplicantForm.score = question.score || null;
//           subApplicantForm.uid = loginUserId;
//           subApplicantForm.euid = 0;
//           subApplicantForm.id = 0;
//           subApplicantForm.isSubAnswer = 1;
//           subApplicantForm.subQuestionId = question.subQuestionTypeData[k].id;
//           subApplicantForm.answer = question.subQuestionTypeData[k].textValue;
//           subApplicantForm.accountTypeId = question.subQuestionTypeData[k].accountTypeId;
//           subApplicantForm.applicationTypeId = question.subQuestionTypeData[k].applicationTypeId;
//           subApplicantForm.questionId = question.subQuestionTypeData[k].questionId;
//           subApplicantForm.ansTypeId = question.subQuestionTypeData[k].ansTypeId;
//           subApplicantForm.ansId = question.subQuestionTypeData[k].id;
//           subApplicantForm.isScreening = 0;
//           subApplicantForm.additionalDetails = additionalAnswers[i] || "";
//           applicantFormDetailsData.push(subApplicantForm);
//           console.error(applicantForm);
//         }
//       }
//     }
//     payload.applicantFormDto.applicantFormDetailsData = applicantFormDetailsData;
//     console.log('Final payload:', payload);
//     return payload;
//   };

//   const updateUiWithSavedData = async (
//     questions: any[],
//     customerData: kycForm[]
//   ) => {
//     if (customerData && customerData.length > 0 && questions) {
//       console.log('customerData==========>>>', customerData);
//       console.log('questions==========>>>', questions);
//       for (let i = 0; i < questions.length; i++) {
//         let question: any = questions[i].questionDto;
//         let customerDataQuestion: any = customerData.find(
//           (item) => item.kycFormDto.id === question.id
//         );
//         if (customerDataQuestion) {
//           let value = customerDataQuestion.kycFormDto.kycAnswerData[0]?.answer;
//           let additionalDetails =
//             customerDataQuestion.kycFormDto.kycAnswerData[0]?.additionalDetails;
//           console.log('additionalDetails:', additionalDetails);
//           if (value === "Under Process" && additionalDetails) {
//             question["additionalDetails"] = additionalDetails;
//           }
//           if (question.answerTypeData.length > 0) {
//             for (let j = 0; j < question.answerTypeData.length; j++) {
//               if (question.answerTypeData[j].name == value) {
//                 question["selectedValue"] = question.answerTypeData[j].name;
//                 break;
//               }
//             }
//           }
//           if (question.subQuestionTypeData.length > 0) {
//             for (let k = 0; k < question.subQuestionTypeData.length; k++) {
//               let customerDataSubQuestion: any = customerDataQuestion.kycFormDto.kycSubQueFormData.find(
//                 (item: any) => item.subQuestionId === question.subQuestionTypeData[k].id
//               );
//               console.error('question.subQuestionTypeData[k]======>>>', question.subQuestionTypeData[k]);
//               if (question.subQuestionTypeData[k]?.name == customerDataSubQuestion?.name) {
//                 question.subQuestionTypeData[k]["selectedValue"] = customerDataSubQuestion.kycAnswerData[0].answer;
//                 question.subQuestionTypeData[k]["textValue"] = customerDataSubQuestion.kycAnswerData[0].answer;
//               }
//             }
//           }
//           else {
//             question["textValue"] = value;
//           }
//         }
//       }
//     } else {
//       setErrors([""]);
//     }
//   };

//   //This code show required error message in the Draft part even there is data it showing required error messages.
//   // const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
//   //   if (event) {
//   //     event.preventDefault();
//   //   }

//   //   let newErrors = [...errors];
//   //   let firstErrorIndex: number | null = null;

//   //   fetchedQuestions.forEach((question, index) => {
//   //     const questionIndex = index;
//   //     const answer = question.questionDto.textValue || question.questionDto.selectedValue;

//   //     const hasValidSubAnswer = question.questionDto.subQuestionTypeData?.some(subQ =>
//   //       subQ.textValue?.trim() || subQ.selectedValue?.trim()
//   //     );

//   //     if ((!answer || answer.trim() === "") && !hasValidSubAnswer) {
//   //       newErrors[questionIndex] = "This field is required";
//   //       if (firstErrorIndex === null) firstErrorIndex = questionIndex;
//   //     } else {
//   //       newErrors[questionIndex] = "";
//   //     }

//   //     const isUnderProcessSelected = question.questionDto.selectedValue === "Under Process";
//   //     const additionalDetails = additionalAnswers[index]?.trim() || question.questionDto.additionalDetails?.trim();

//   //     if (isUnderProcessSelected && (!additionalDetails || additionalDetails === "")) {
//   //       newErrors[questionIndex] = "Additional details are required when 'Under Process' is selected";
//   //       if (firstErrorIndex === null) firstErrorIndex = questionIndex;
//   //     }

//   //     // Validation for question number 17
//   //     if (questionIndex === 16) {
//   //       const subQuestions = question.questionDto.subQuestionTypeData || [];
//   //       const areAllFieldsFilled = subQuestions.every(subQ => subQ.textValue?.trim());

//   //       if (!areAllFieldsFilled) {
//   //         newErrors[questionIndex] = "All fields are required for this section";
//   //         if (firstErrorIndex === null) firstErrorIndex = questionIndex;
//   //       }
//   //     }

//   //   });

//   //   setErrors([...newErrors]);
//   //   try {
//   //     setLoading(true);
//   //     let responseIdNumber;
//   //     let kycData: any = constructSaveApplicationFormdata(loginDetails.id);
//   //     console.error("kycData", kycData);
//   //     const initialResponse = await applicationfrome.Apllicationinsert(kycData);
//   //     console.log('Sent kycData:', initialResponse);
//   //     fetchData(parseInt(initialResponse.id || props.kycId, 10), kycApplication);
//   //     setShowSaveBtn(true);
//   //     if (initialResponse && initialResponse.id) {
//   //       responseIdNumber = initialResponse.id;
//   //       sessionStorage.setItem("responseId", responseIdNumber.toString());
//   //       setResponseId(responseIdNumber);
//   //       showSuccessMessage("Aml Kyc Questionnaire added successfully.");
//   //       setErrorMessage(null);
//   //       setTimeout(() => {
//   //         setSaveClicked(true);
//   //       }, 2000);
//   //       props.renderDeclarationContent();
//   //     } else {
//   //       console.error("Failed to generate a new responseId");
//   //       showErrorMessage("Failed to generate a new responseId");
//   //       return;
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     showErrorMessage("Error submitting form, please try again.");
//   //   }
//   //   finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
//     if (event) {
//       event.preventDefault();
//     }

//     let newErrors = [...errors];
//     let firstErrorIndex: number | null = null;

//     fetchedQuestions.forEach((question, index) => {
//       const answer = question.questionDto.textValue || question.questionDto.selectedValue;
//       if (!answer || answer.trim() === "") {
//         newErrors[index] = "This field is required";
//         if (firstErrorIndex === null) firstErrorIndex = index;
//       } else {
//         newErrors[index] = "";
//       }
//       if (question.questionDto.selectedValue === "Under Process" && (!additionalAnswers[index] || additionalAnswers[index].trim() === "")) {
//         newErrors[index] = "Additional details are required when 'Under Process' is selected";
//         if (firstErrorIndex === null) firstErrorIndex = index;
//       }
//     });
//     setErrors([...newErrors]);
//     if (firstErrorIndex !== null) {
//       setTimeout(() => {
//         const errorElement = document.getElementById(`input-${firstErrorIndex}`) ||
//           document.getElementById(`dropdown-${firstErrorIndex}`);
//         errorElement?.focus();
//       }, 100);
//       return;
//     }
//     try {
//       setLoading(true);
//       let responseIdNumber;
//       let kycData: any = constructSaveApplicationFormdata(loginDetails.id);
//       console.error("kycData", kycData);
//       const initialResponse = await applicationfrome.Apllicationinsert(kycData);
//       console.log('Sent kycData:', initialResponse);
//       fetchData(parseInt(initialResponse.id || props.kycId, 10), kycApplication);
//       setShowSaveBtn(true);
//       if (initialResponse && initialResponse.id) {
//         responseIdNumber = initialResponse.id;
//         sessionStorage.setItem("responseId", responseIdNumber.toString());
//         setResponseId(responseIdNumber);
//         showSuccessMessage("Aml Kyc Questionnaire added successfully.");
//         setErrorMessage(null);
//         setTimeout(() => {
//           setSaveClicked(true);
//         }, 2000);
//         props.renderDeclarationContent();
//       } else {
//         console.error("Failed to generate a new responseId");
//         showErrorMessage("Failed to generate a new responseId");
//         return;
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       showErrorMessage("Error submitting form, please try again.");
//     }
//     finally {
//       setLoading(false);
//     }
//   };

//   const handlestep5Submit = async () => {
//     showSuccessMessage("Aml Kyc Questionnaire added successfully.");
//   };

//   const [kycId, setKycId] = useState(null);

//   useEffect(() => {
//     const buttonDisabled = sessionStorage.getItem("buttonDisabled") === "true";
//     setShowSaveBtn(!buttonDisabled);
//   }, []);

//   useEffect(() => {
//     if (!kycId) {
//       setShowSaveBtn(true);
//     }
//   }, [kycId]);

//   const handleAdditionalAnswerChange = (index: number, value: string) => {
//     const isSubAnswerNumber =
//       value.trim() === "" || isNaN(parseInt(value, 10))
//         ? 1
//         : parseInt(value, 10);
//     setAdditionalAnswers((prev) => ({ ...prev, [index]: value }));
//     setFormData((prevFormData) => {
//       const updatedFormDetails =
//         prevFormData.applicantFormDto.applicantFormDetailsData.map(
//           (item, idx) =>
//             idx === index ? { ...item, additionalDetails: value, isSubAnswer: isSubAnswerNumber } : item
//         );
//       return {
//         ...prevFormData,
//         applicantFormDto: {
//           ...prevFormData.applicantFormDto,
//           applicantFormDetailsData: updatedFormDetails,
//         },
//       };
//     });
//     if (value.trim() !== "") {
//       setErrors((prevErrors) => {
//         const updatedErrors = [...prevErrors];
//         updatedErrors[index] = "";
//         return updatedErrors;
//       });
//     }
//   };

//   const Signonupload = async (event?: React.FormEvent<HTMLFormElement>) => {
//     if (event) {
//       event.preventDefault();
//     }
//     setLoading(true);
//     try {
//       const responseId = sessionStorage.getItem("responseId");
//       if (!responseId) {
//         console.error("No responseId found in session storage");
//         showErrorMessage("No responseId found in session storage");
//         setLoading(false);
//         return;
//       }
//       const documentTypeId = 1;
//       const uid = loginDetails.id;
//       console.log("Selected files:", selectedFiles);
//       if (selectedFiles.length === 0) {
//         console.error("No files selected for submission");
//         showErrorMessage("No files selected for submission");
//         setLoading(false);
//         return;
//       }
//       console.log("Submitting files with responseId:", responseId, "and documentTypeId:", documentTypeId);
//       await documentApiService.saveFormCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
//       showSuccessMessage("Signonupload added successfully.");
//       setSignUploadBtnClicked(true);
//       console.log("Files submitted successfully");
//     } catch (error) {
//       setSignUploadBtnClicked(false);
//       console.error("Error submitting files:", error);
//       showErrorMessage("Error submitting files.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const filesArray = Array.from(event.target.files);
//       setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
//     }
//   };

//   const handleChooseImagesClick1 = (index1: number) => {
//     document.getElementById(`image-upload-input1-${index1}`)?.click();
//   };

//   const handleFileChange4 = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const selectedFiles = Array.from(event.target.files) as File[];
//       const nameWithoutExtension = selectedFiles[0].name.replace(
//         /\.[^/.]+$/,
//         ""
//       );
//       setImages((prevFields) => {
//         const updatedFields = [...prevFields];
//         updatedFields[index] = {
//           ...updatedFields[index],
//           name: nameWithoutExtension,
//           uploading: false,
//           uploadSuccess: false,
//         };
//         return updatedFields;
//       });
//       setIsFileSelected(true);
//     } else {
//       setIsFileSelected(false);
//     }
//   };

//   const handleSubmits = async (event?: React.FormEvent<HTMLFormElement>) => {
//     if (event) {
//       event.preventDefault();
//     }
//     try {
//       const responseId = sessionStorage.getItem("responseId");
//       if (!responseId) {
//         console.error("No responseId found in session storage");
//         return;
//       }
//       const documentTypeId = 1;
//       const uid = loginDetails.id;
//       console.log("Selected files:", selectedFiles);
//       if (selectedFiles.length === 0) {
//         console.error("No files selected for submission");
//         return;
//       }
//       console.log("Submitting files with responseId:", responseId, "and documentTypeId:", documentTypeId);
//       await documentApiService.saveCustomerRequest(selectedFiles, parseInt(responseId, 10), documentTypeId, uid);
//       console.log("Files submitted successfully");
//       setViewBtnClicked(true);
//     } catch (error) {
//       setViewBtnClicked(false);
//       console.error("Error submitting files:", error);
//     }
//   };

//   const handleView = async () => {
//     console.log("handleView called");
//     setLoading(true);
//     try {
//       const responseId = sessionStorage.getItem("responseId");
//       if (!responseId) {
//         console.error("No responseId found in session storage");
//         setErrorMessage("No responseId available");
//         return;
//       }
//       const pdfData = await customerApiService.getkycPDF(responseId, 1);
//       console.log("PDF data:", pdfData);
//       if (pdfData && pdfData.data) {
//         setPdfData({ base64: pdfData.data, filename: "application_form.pdf" });
//         setPdfRendered(false);
//         setShowPdfModal(true);
//       } else {
//         setErrorMessage("No PDF available");
//       }
//       setViewBtnClicked(true);
//       console.log("PDF modal set to open");
//     } catch (error) {
//       console.error("Error fetching PDF:", error);
//       setPdfData({ base64: null, filename: null });
//       setErrorMessage("Error fetching PDF");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     setDownloading(true);
//     setTimeout(() => {
//       setDownloading(false);
//     }, 1000);
//   };

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     console.log("Document loaded with", numPages, "pages");
//     setNumPages(numPages);
//     setPdfRendered(true);
//   };

//   const handleCloseImageModal = () => {
//     setShowImageModal(false);
//   };

//   const handleClosePdfModal = () => {
//     setShowPdfModal(false);
//     setPdfRendered(false);
//   };

//   const [imageURL, setImageURL] = useState("");

//   useEffect(() => {
//     const handleImageClick = async (branchId: number) => {
//       if (branchId) {
//         try {
//           const branchId = 1;
//           const imageData = await customerApiService.getLetterHead(branchId);
//           const base64String = arrayBufferToBase64(imageData);
//           setImageURL(base64String);
//           console.log("base64String", base64String);
//         } catch (error) {
//           console.error("Error fetching image:", error);
//           setImageURL("");
//         }
//       }
//     };
//     handleImageClick(1);
//   }, []);

//   const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//     const binary = new Uint8Array(buffer);
//     const bytes = [];
//     for (let i = 0; i < binary.length; i++) {
//       bytes.push(String.fromCharCode(binary[i]));
//     }
//     return `data:image/png;base64,${btoa(bytes.join(""))}`;
//   };

//   return (
//     <>
//       <Container
//         style={{ width: "274mm", minHeight: "297mm", marginTop: "5%" }}>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           {pages && pages.map((pageContent, pageIndex) => (
//             <Paper key={pageIndex} elevation={10} style={{ marginBottom: "20px" }}>
//               <div style={{ position: "relative", width: "100%", minHeight: "100%", padding: "20px", }}>
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow sx={{ fontSize: "small" }}>
//                         <TableCell sx={{ width: "5%", padding: "5px", fontSize: "0.875rem", backgroundColor: "#d6d0d09e", }}> Sl.no</TableCell>
//                         <TableCell sx={{ width: "50%", padding: "5px", fontSize: "0.875rem", backgroundColor: "#d6d0d09e", }}>Question</TableCell>
//                         <TableCell sx={{ width: "45%", padding: "5px", fontSize: "0.875rem", backgroundColor: "#d6d0d09e", margin: 'auto', textAlign: 'center' }}>Answer</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {pageContent.map((item: any, index: any) => (
//                         <React.Fragment key={index}>
//                           <TableRow>
//                             <TableCell sx={{ width: "5%", padding: "20px", fontSize: "0.75rem", whiteSpace: "pre-wrap", fontWeight: "900", }}>{index + 1 + pageIndex * itemsPerPage}</TableCell>

//                             <TableCell sx={{ width: "50%", padding: "4px", fontSize: "0.75rem", whiteSpace: "pre-wrap", fontWeight: "900", }}>
//                               <span>{item.questionDto.name}</span>
//                               <span>{item.questionDto.multiQuestion === 1 &&
//                                 item.questionDto.subQuestionTypeData &&
//                                 item.questionDto.subQuestionTypeData.map(
//                                   (subQuestion: any) => (
//                                     <Typography key={subQuestion.id}><span>{subQuestion.name}:</span></Typography>
//                                   )
//                                 )}</span>
//                               <span>{item.questionDto.ansTypeId === 2 && (
//                                 <Typography variant="body2" color="textSecondary"><span>{item.questionDto.description}</span> </Typography>
//                               )}</span>
//                             </TableCell>
//                             <TableCell sx={{ width: "45%", padding: "4px", fontSize: "0.75rem", whiteSpace: "pre-wrap", }}>
//                               <span>{item.questionDto.multiQuestion === 1 &&
//                                 item.questionDto.subQuestionTypeData &&
//                                 item.questionDto.subQuestionTypeData.map(
//                                   (subQuestion: any) => (
//                                     <React.Fragment key={subQuestion.id}>
//                                       <span>
//                                         {subQuestion.ansTypeId === 2 ? (
//                                           <>
//                                             <Select
//                                               id={`dropdown-${index}`}
//                                               style={{ fontSize: "small" }}
//                                               fullWidth
//                                               size="small"
//                                               value={
//                                                 subQuestion.textValue
//                                                   ? subQuestion.textValue
//                                                   : ''
//                                               }
//                                               onChange={(e) =>
//                                                 handleAnswerChange(
//                                                   index +
//                                                   pageIndex * itemsPerPage,
//                                                   e.target.value,
//                                                   true,
//                                                   subQuestion.id
//                                                 )
//                                               }
//                                               name={`question-${index}`}
//                                               sx={{
//                                                 border: errors[index + pageIndex * itemsPerPage] ? '0px solid red' : '',
//                                                 backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "",
//                                               }}
//                                               error={Boolean(errors[index + pageIndex * itemsPerPage])}
//                                             >
//                                             </Select>
//                                             {showInputBox[
//                                               index + pageIndex * itemsPerPage
//                                             ] && (
//                                                 <TextField
//                                                   sx={{
//                                                     fontSize: "x-small",
//                                                     marginTop: "10px",
//                                                     border: errors[index + pageIndex * itemsPerPage] ? '0px solid red' : '',
//                                                     backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "",
//                                                   }}
//                                                   error={Boolean(errors[index + pageIndex * itemsPerPage])}
//                                                   fullWidth
//                                                   size="small"
//                                                   autoComplete="off"
//                                                   multiline
//                                                   placeholder="Please provide additional details"
//                                                   value={
//                                                     additionalAnswers[
//                                                       index +
//                                                       pageIndex * itemsPerPage
//                                                     ]?.trimStart()
//                                                   }
//                                                   InputLabelProps={{ className: 'inputFeild' }}
//                                                   InputProps={{ className: 'inputFeild' }}
//                                                   onChange={(e) =>
//                                                     handleAdditionalAnswerChange(
//                                                       index +
//                                                       pageIndex * itemsPerPage,
//                                                       e.target.value
//                                                     )
//                                                   }
//                                                 />
//                                               )}
//                                           </>
//                                         ) : (
//                                           <TextField
//                                             sx={{
//                                               fontSize: "x-small", marginTop: "10px",
//                                               border: errors[index] ? '0px solid red' : '',
//                                               backgroundColor: errors[index] ? "#ffe6e6" : "",
//                                             }}
//                                             error={Boolean(errors[index + pageIndex * itemsPerPage])}
//                                             fullWidth
//                                             size="small"
//                                             autoComplete="off"
//                                             multiline
//                                             placeholder="Name Text"
//                                             value={subQuestion.textValue}
//                                             name={`question-${index}`}
//                                             InputLabelProps={{ className: 'inputFeild' }}
//                                             InputProps={{ className: 'inputFeild' }}
//                                             onChange={(e) =>
//                                               handleAnswerChange(
//                                                 index +
//                                                 pageIndex * itemsPerPage,
//                                                 e.target.value,
//                                                 true,
//                                                 subQuestion.id
//                                               )
//                                             }
//                                           />
//                                         )}
//                                       </span>
//                                       {/* 17 question error message is being display for 2 time issues part */}
//                                       {/* {errors[
//                                         index + pageIndex * itemsPerPage
//                                       ] && (
//                                           <Typography
//                                             variant="caption"
//                                             color="error"
//                                           >
//                                             {
//                                               errors[
//                                               index + pageIndex * itemsPerPage
//                                               ]
//                                             }
//                                           </Typography>
//                                         )} */}
//                                     </React.Fragment>
//                                   )
//                                 )}</span>
//                               <span>
//                                 {!item.questionDto.multiQuestion && item.questionDto.ansTypeId === 2 && (
//                                   <>
//                                     <Autocomplete
//                                       options={item.questionDto.answerTypeData.map((answer: { name: any; }) => answer.name)}
//                                       getOptionLabel={(option) => option}
//                                       style={{ width: '100%', fontSize: 'small' }}
//                                       isOptionEqualToValue={(option, value) => option === value}
//                                       onChange={(event, value) => {
//                                         const newValue = value || '';
//                                         if (item.questionDto.selectedValue !== newValue) {
//                                           handleAnswerChange(
//                                             index + pageIndex * itemsPerPage,
//                                             newValue,
//                                             false
//                                           );
//                                         }
//                                       }}
//                                       renderInput={(params) => (
//                                         <TextField
//                                           {...params}
//                                           size="small"
//                                           variant="outlined"
//                                           fullWidth
//                                           onKeyDown={(event) => {
//                                             const inputValue = params.inputProps.value as string | undefined;
//                                             if (event.key === 'Tab' && inputValue) {
//                                               const matchedOption = item.questionDto.answerTypeData.find(
//                                                 (answer: { name: string; }) =>
//                                                   typeof answer.name === 'string' &&
//                                                   answer.name.toLowerCase().startsWith(inputValue.toLowerCase())
//                                               );
//                                               if (matchedOption) {
//                                                 handleAnswerChange(
//                                                   index + pageIndex * itemsPerPage,
//                                                   matchedOption.name,
//                                                   false
//                                                 );
//                                               } else {
//                                                 handleAnswerChange(
//                                                   index + pageIndex * itemsPerPage,
//                                                   '',
//                                                   false
//                                                 );
//                                               }
//                                             }
//                                           }}
//                                           sx={{
//                                             fontSize: "x-small", marginTop: "10px",
//                                             border: errors[index + pageIndex * itemsPerPage] ? '0px solid red' : '',
//                                             backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "", //For all the dropdown
//                                           }}
//                                           error={Boolean(errors[index + pageIndex * itemsPerPage])}
//                                         />
//                                       )}
//                                       value={item.questionDto.selectedValue || ''}
//                                       onInputChange={(event, newInputValue) => {
//                                         if (item.questionDto.selectedValue !== newInputValue) {
//                                           item.questionDto.selectedValue = newInputValue;
//                                           const matchedOption = item.questionDto.answerTypeData.find(
//                                             (answer: { name: string; }) =>
//                                               typeof answer.name === 'string' &&
//                                               answer.name.toLowerCase().startsWith(newInputValue.toLowerCase())
//                                           );
//                                           if (matchedOption) {
//                                             handleAnswerChange(
//                                               index + pageIndex * itemsPerPage,
//                                               matchedOption.name,
//                                               false
//                                             );
//                                           }
//                                         }
//                                       }}
//                                     />
//                                     {showInputBox[index + pageIndex * itemsPerPage] && (
//                                       <TextField
//                                         sx={{ fontSize: 'x-small', marginTop: '10px' }}
//                                         fullWidth
//                                         size="small"
//                                         autoComplete="off"
//                                         multiline
//                                         placeholder="Please provide additional details"
//                                         value={additionalAnswers[index + pageIndex * itemsPerPage]?.trimStart() || ''}
//                                         InputLabelProps={{ className: 'inputFeild' }}
//                                         InputProps={{ className: 'inputFeild' }}
//                                         onChange={(e) =>
//                                           handleAdditionalAnswerChange(
//                                             index + pageIndex * itemsPerPage,
//                                             e.target.value.trimStart()
//                                           )
//                                         }
//                                       />
//                                     )}
//                                   </>
//                                 )}
//                               </span>
//                               <span>
//                                 {!item.questionDto.multiQuestion &&
//                                   item.questionDto.ansTypeId !== 2 && (
//                                     <TextField
//                                       id={`input-${index}`}
//                                       sx={{
//                                         fontSize: "x-small", marginTop: "10px",
//                                         border: errors[index + pageIndex * itemsPerPage] ? "0px solid red" : "",
//                                         backgroundColor: errors[index + pageIndex * itemsPerPage] ? "#ffe6e6" : "", //for all the textbox except 17
//                                       }}
//                                       fullWidth
//                                       size="small"
//                                       autoComplete="off"
//                                       placeholder="Text Field"
//                                       value={item.questionDto.textValue}
//                                       name={`question-${index}`}
//                                       InputLabelProps={{ className: 'inputFeild' }}
//                                       InputProps={{ className: 'inputFeild' }}
//                                       error={Boolean(errors[index + pageIndex * itemsPerPage])}
//                                       onChange={(e) =>
//                                         handleAnswerChange(
//                                           index + pageIndex * itemsPerPage,
//                                           e.target.value,
//                                           false
//                                         )
//                                       }
//                                     />
//                                   )}
//                                 {item.questionDto.additionalDetails && !showInputBox[index + pageIndex * itemsPerPage] && (
//                                   <div>
//                                     <TextField
//                                       sx={{
//                                         fontSize: "x-small",
//                                         marginTop: "10px",
//                                       }}
//                                       fullWidth
//                                       size="small"
//                                       autoComplete="off"
//                                       multiline
//                                       placeholder="Please provide additional details"
//                                       value={additionalAnswers[index + pageIndex * itemsPerPage]?.trimStart() || item.questionDto.additionalDetails || ''}
//                                       InputLabelProps={{ className: 'inputFeild' }}
//                                       InputProps={{ className: 'inputFeild' }}
//                                       onChange={(e) =>
//                                         handleAdditionalAnswerChange(
//                                           index + pageIndex * itemsPerPage,
//                                           e.target.value.trimStart()
//                                         )
//                                       }
//                                     />
//                                   </div>
//                                 )}
//                                 {/* For diplaying error message below the textbox and dropdown */}
//                                 {errors[index + pageIndex * itemsPerPage] && (
//                                   <Typography variant="caption" color="error">
//                                     {errors[index + pageIndex * itemsPerPage]}
//                                   </Typography>
//                                 )}
//                                 {/* For Displaying the red colour for error messages */}
//                                 {errorMessage && item.questionDto.name === "Name" && !item.questionDto.textValue && (
//                                   <Typography variant="caption" color="error">
//                                     {errorMessage}
//                                   </Typography>
//                                 )}
//                               </span>
//                             </TableCell>
//                           </TableRow>
//                         </React.Fragment>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//                 <div style={{ textAlign: "right", marginTop: "16px", position: "absolute", right: "20px", fontSize: "small", bottom: "0px", }}>Page : {pageIndex + 1}</div>
//                 <div style={{ textAlign: "right", position: "absolute", fontSize: "small", }}> Update: {printNumber}</div>
//               </div>
//             </Paper>
//           ))}

//           <Paper elevation={10} style={{ marginBottom: "20px" }}>
//             <div style={{ position: "relative", width: "100%", minHeight: "100%", padding: "20px", }} >
//               <div style={a4SheetStyles}>
//                 <table style={tableStyles}>
//                   <tbody>
//                     <tr style={evenRowStyles}>
//                       <td style={{ ...cellStyle, width: "30%" }}><strong>Name</strong></td>
//                       <td style={{ ...cellStyle, width: "70%" }}> </td>
//                     </tr>
//                     <tr>
//                       <td style={{ ...cellStyle, width: "30%" }}><strong>Designation</strong></td>
//                       <td style={{ ...cellStyle, width: "70%" }}> </td>
//                     </tr>
//                     <tr style={evenRowStyles}>
//                       <td style={{ ...cellStyle, width: "30%" }}><strong>Signature</strong></td>
//                       <td style={{ ...cellStyle, width: "70%" }}> </td>
//                     </tr>
//                     <tr>
//                       <td style={{ ...cellStyle, width: "30%" }}><strong>Seal of the Member</strong></td>
//                       <td style={{ ...cellStyle, width: "70%" }}> </td>
//                     </tr>
//                     <tr style={evenRowStyles}>
//                       <td style={{ ...cellStyle, width: "30%" }}><strong>Date</strong></td>
//                       <td style={{ ...cellStyle, width: "70%" }}> </td>
//                     </tr>
//                     <tr>
//                       <td style={{ ...cellStyle, width: "30%" }}><strong>Place</strong></td>
//                       <td style={{ ...cellStyle, width: "70%" }}> </td>
//                     </tr>
//                   </tbody>
//                 </table>
//                 <div style={{ textAlign: "right", marginTop: "16px", position: "absolute", right: "20px", fontSize: "small", bottom: "15px", }}>Page : {6}</div>
//                 <div style={{ textAlign: "right", position: "absolute", fontSize: "small", bottom: "15px", }}>Update: {printNumber} </div>
//               </div>
//             </div>
//           </Paper>

//           {dataFetched && (
//             <div>
//               {applicationTypeId === 1 && accountTypeId === 2 && (
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <div className="arroww" style={{ marginRight: "10px" }}>
//                     <span style={{ textAlign: "center" }}>Step 1:</span>
//                   </div>
//                   <button style={{ width: '12%' }}
//                     className='btn btn-primary btn-sm'
//                     onClick={() => {
//                       handleSubmit();
//                     }}
//                     disabled={!showSaveBtn}
//                   >
//                     Save</button>
//                   <br />
//                 </div>
//               )}
//               <br></br>

//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div className="arroww" style={{ marginRight: "10px" }}>
//                   <span style={{ textAlign: "center" }}>Step 2:</span>
//                 </div>
//                 <button style={{ width: '12%' }} className={`btn btn-sm ${saveClicked ? 'btn-primary' : 'btn-secondary'}`} onClick={downloadPDF} disabled={!saveClicked}>Download</button>
//                 {loading && <Loader />}
//               </div>
//               <br></br>
//               {downloadingPDF && (
//                 <p style={{ color: "red" }}>
//                   Please wait for the download...
//                 </p>
//               )}

//               {isLevelcasedetailsOpen && (
//                 <Grid container spacing={1}>
//                   <Grid item xs={12}>
//                     <Grid container spacing={1}>
//                       {images.map((image, index) => (
//                         <Grid item xs={12} key={index}>
//                           <form
//                             onSubmit={handleSubmits}
//                             encType="multipart/form-data"
//                           >
//                             <div className="person-container">
//                               <div className="field-group">
//                                 <div className="field-group-column">
//                                   <input
//                                     type="file"
//                                     id={`image-upload-input1-${index}`}
//                                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                                     onChange={(event) => {
//                                       handleFileChange(event);
//                                       handleFileChange4(index, event);
//                                     }}
//                                     style={{ display: "none" }}
//                                     multiple
//                                   />
//                                   <Button
//                                     variant="outlined"
//                                     onClick={() =>
//                                       handleChooseImagesClick1(index)
//                                     }
//                                     style={{ marginRight: "10px" }}
//                                   >
//                                     Document
//                                   </Button>
//                                   <TextField
//                                     style={{ width: "50%" }}
//                                     label="Attachment"
//                                     type="text"
//                                     size="small"
//                                     variant="outlined"
//                                     value={image.name}
//                                     disabled
//                                     fullWidth
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           </form>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               )}

//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div className="arroww" style={{ marginRight: "10px" }}>
//                   <span style={{ textAlign: "center" }}>Step 3:</span>
//                 </div>
//                 <form onSubmit={Signonupload} style={{ width: "11%" }}>
//                   <button
//                     style={{ width: '109%', marginLeft: '-1%' }}
//                     className={`btn btn-sm ${downlodClicked ? 'btn-primary' : 'btn-secondary'}`}
//                     disabled={selectedFiles.length === 0}
//                   >
//                     Sign on upload
//                   </button>
//                 </form>
//                 {loading && <Loader />}
//               </div>

//               <br></br>

//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div className="arroww" style={{ marginRight: "10px" }}>
//                   <span style={{ textAlign: "center" }}>Step 4:</span>
//                 </div>
//                 <button
//                   style={{ width: "12%" }}
//                   className={`btn btn-sm ${signUploadBtnClicked ? 'btn-primary' : 'btn-secondary'}`}
//                   disabled={!signUploadBtnClicked}
//                   onClick={handleView}
//                 >
//                   View
//                 </button>
//                 {loading && <Loader />}
//                 {/* {errorMessage && (
//                   <Typography
//                     variant="body1"
//                     style={{ color: "red", textAlign: "center", marginLeft: '1%' }}
//                   >
//                     {errorMessage}
//                   </Typography>
//                 )} */}
//               </div>

//               <br></br>

//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div className="arroww" style={{ marginRight: "10px" }}>
//                   <span style={{ textAlign: "center" }}>Step 5:</span>
//                 </div>
//                 <div style={{ width: '6%' }}>
//                   <button
//                     style={{ width: "200%" }}
//                     className={`btn btn-sm ${viewBtnClicked ? 'btn-primary' : 'btn-secondary'}`}
//                     onClick={() => {
//                       handlestep5Submit();
//                     }}
//                     disabled={!viewBtnClicked}
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           <br></br>
//         </LocalizationProvider>
//       </Container>
//       {/* <Card> */}
//       <div>

//         <Dialog open={showImageModal} onClose={handleCloseImageModal} fullWidth maxWidth="xl">
//           <DialogTitle>Image Preview</DialogTitle>
//           <DialogContent>
//             {base64Image && (
//               <img
//                 src={`data:image/png;base64,${base64Image}`}
//                 alt="Image Preview"
//               />
//             )}
//             {errorMessage && (
//               <Typography variant="body1">{errorMessage}</Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseImageModal}>Close</Button>
//           </DialogActions>
//         </Dialog>

//         {/* pdf view */}

//         <Dialog open={showPdfModal} onClose={handleClosePdfModal} maxWidth="md">
//           {loading && <Loader />}
//           <DialogTitle>PDF Preview
//             <IconButton aria-label="close" onClick={handleClosePdfModal} style={{ position: "absolute", right: 8, top: 8, color: "#aaa" }}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent dividers={true} style={{ overflow: "auto", padding: 0, margin: 0 }}>
//             {loading && <Loader />}
//             {pdfData.base64 ? (
//               <div style={{ border: "1px solid #e0e0e0", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", height: '100%', overflow: 'hidden', }}>
//                 <Document file={`data:application/pdf;base64,${pdfData.base64}`} onLoadSuccess={onDocumentLoadSuccess} onLoadError={(error) => console.error("PDF load error", error)} className="pdf-document" >
//                   {Array.from(new Array(numPages), (el, index) => (
//                     <div
//                       key={`page_${index + 1}`}
//                       style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center", overflow: "hidden", height: 'auto', }}>
//                       <Page
//                         pageNumber={index + 1}
//                         width={Math.min(window.innerWidth * 0.85, 800)}
//                         scale={1.1}
//                       />
//                     </div>
//                   ))}
//                 </Document>
//               </div>
//             ) : (
//               <Typography variant="body1" style={{ color: "red", textAlign: "center" }}>
//                 {errorMessage || "No PDF available"}
//               </Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             {pdfData.filename && (
//               <Button
//                 onClick={handleDownload}
//                 href={`data:application/pdf;base64,${pdfData.base64}`}
//                 download={pdfData.filename}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 variant="contained"
//               >
//                 {downloading ? <Loader /> : 'Download PDF'}
//               </Button>
//             )}
//           </DialogActions>
//         </Dialog>

//       </div>

//       {/* pdf download part */}
//       <div id="pdfContentApp"
//         style={{ display: "none" }}
//       >
//         {pageView && pageView.map((pageContent, pageIndex) => (
//           <Paper key={pageIndex}
//             style={{
//               marginBottom: "20px",
//               boxShadow: '0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)',
//               width: '274mm', minHeight: '297mm'
//             }}
//           >
//             <div ref={contentRef} style={{ width: '274mm', minHeight: '297mm', padding: '20px' }}>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ fontSize: 'small' }}>
//                       <TableCell style={{ width: '5%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Sl.no</TableCell>
//                       <TableCell style={{ width: '60%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Question</TableCell>
//                       <TableCell style={{ width: '35%', padding: '4px', fontSize: '0.875rem', backgroundColor: '#d6d0d09e' }}>Answer</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {pageContent &&
//                       pageContent.map((item: any, index: any) => (
//                         <TableRow key={index} sx={{ height: '24px' }}>
//                           <TableCell sx={{ width: '5%', padding: '12px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>{index + 1 + pageIndex * itemsPerPagePdf}</TableCell>

//                           <TableCell sx={{ width: '60%', padding: '4px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontWeight: '900' }}>
//                             {item && item.questionDto ? (
//                               <>
//                                 <strong>{item.questionDto.name}</strong>
//                                 {console.log(item.questionDto)}
//                                 {item.questionDto.description && (
//                                   <Typography variant="body2" color="textSecondary">{item.questionDto.description}</Typography>
//                                 )}
//                               </>
//                             ) : null}
//                           </TableCell>

//                           <TableCell sx={{ width: '30%', padding: '4px', fontSize: '0.75rem' }}>
//                             {item && item.questionDto ? (
//                               item.questionDto.id === 17 ? (
//                                 <>
//                                   <Typography variant="body1" color="textSecondary">
//                                     {item.questionDto.subQuestionTypeData.map((subQuestion: any) => (
//                                       <div key={subQuestion.id}>
//                                         <strong style={{ fontWeight: 'bold', fontSize: '1rem' }}>{subQuestion.name} : </strong>
//                                         <span style={{ fontWeight: 'normal' }}>{subQuestion.selectedValue || "No answer available"}</span>
//                                       </div>
//                                     ))}
//                                   </Typography>
//                                 </>
//                               ) : (
//                                 <>
//                                   {
//                                     (item.questionDto.selectedValue === "Under Process" || item.questionDto.textValue === "Under Process") ? (
//                                       <>
//                                         <Typography variant="body1" sx={{ fontWeight: 'normal', color: 'text.primary' }}>
//                                           {item.questionDto.selectedValue || item.questionDto.textValue}
//                                         </Typography>
//                                         <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', fontSize: '1rem' }}>
//                                           <div><span style={{ fontWeight: 'bold' }}>Additional Details : </span>{item.questionDto.additionalDetails || "No additional details provided"}</div>
//                                         </Typography>
//                                       </>
//                                     ) : (
//                                       <Typography variant="body1" sx={{ fontWeight: 'normal', color: 'text.primary' }}>
//                                         {(item.questionDto.selectedValue || item.questionDto.textValue) || "No answer available"}
//                                       </Typography>
//                                     )
//                                   }
//                                 </>
//                               )
//                             ) : null}
//                           </TableCell>

//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </div>
//           </Paper>
//         ))}

//         <div style={{ ...a4SheetStyle, contentVisibility: "hidden" }}>
//           <table style={tableStyle}>
//             <tbody>
//               <tr style={evenRowStyle}>
//                 <td style={{ ...cellStyle, width: "30%" }}><strong>Name</strong></td>
//                 <td style={{ ...cellStyle, width: "70%" }}>  </td>
//               </tr>
//               <tr>
//                 <td style={{ ...cellStyle, width: "30%" }}> <strong>Designation</strong></td>
//                 <td style={{ ...cellStyle, width: "70%" }}> </td>
//               </tr>
//               <tr style={evenRowStyle}>
//                 <td style={{ ...cellStyle, width: "30%" }}><strong>Signature</strong></td>
//                 <td style={{ ...cellStyle, width: "70%" }}> </td>
//               </tr>
//               <tr>
//                 <td style={{ ...cellStyle, width: "30%" }}><strong>Seal of the Member</strong></td>
//                 <td style={{ ...cellStyle, width: "70%" }}> </td>
//               </tr>
//               <tr style={evenRowStyle}>
//                 <td style={{ ...cellStyle, width: "30%" }}><strong>Date</strong></td>
//                 <td style={{ ...cellStyle, width: "70%" }}> </td>
//               </tr>
//               <tr>
//                 <td style={{ ...cellStyle, width: "30%" }}><strong>Place</strong></td>
//                 <td style={{ ...cellStyle, width: "70%" }}> </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//       </div>
//       {/* </Card> */}

//       <Snackbar open={isSuccessOpen} autoHideDuration={5000} onClose={() => setIsSuccessOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right", }}>
//         <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => setIsSuccessOpen(false)}>{successMessage}</MuiAlert>
//       </Snackbar>

//       <Snackbar open={isErrorOpen} autoHideDuration={5000} onClose={() => setIsErrorOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right", }}>
//         <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => setIsErrorOpen(false)}>{errorMessage}</MuiAlert>
//       </Snackbar>

//     </>
//   );

// };

// export default ApplicationForm;
