import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import Header from "../../../layouts/header/header";
import { Card } from "react-bootstrap";
import ApplicationfromeService from "../../../data/services/kyc/applicationfrom/applicationfrome-api-service";
import {
  Type,
  AccountType,
  QuestionType,
  AppFormData,
  kycForm,
  AnswerTypeData,
  ApplicantFormDetailsData,
} from "../../../data/services/kyc/applicationfrom/applicationfrome-payload";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import contactImage from "../../../assets/contact.png";
import ponsunImage from "../../../assets/ponsun.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { useApplicationContext } from "./ApplicationContext";
import DocumentApiService from "../../../data/services/document/Document_api_service";
import "./Form.css";
import { IconButton } from "@mui/material";
import { CSSProperties } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { useLocation, useParams } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  removeQuestionnaire,
  saveQuestionnaire,
} from "./state/save-application-action";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface CustomerData {
    kycFormDto: kycForm;
  }
function Download() {
    const [formData, setFormData] = useState<AppFormData>({
        applicantFormDto: {
          id: 0,
          name: "",
          numberOfPrint: 0,
          isCompleted:0,
          isScreening:0,
          uid: 0,
          applicantFormDetailsData: [],
        },
      });
      const [fetchedQuestions, setFetchedQuestions] = useState<QuestionType[]>([]);
      // const { setResponseId } = useApplicationContext();
      const [errors, setErrors] = useState<string[]>([]);

      const [loading, setLoading] = useState(true);
      const [customerdata, setcustomerData] = useState<CustomerData[]>([]);
      const [pageView, setPageView] = useState<any[]>([]);
      const [pages, setPages] = useState<any[]>([]);
      const [noOfPrint, setNoOfPrint] = useState<number>(formData.applicantFormDto.numberOfPrint || 1);
      const dispatch = useDispatch();
    

      const applicationfrome = new ApplicationfromeService();
      const fetchData = async (kycId: any, questions: any) => {
        try {
          setLoading(true);
          const customerData: any[] = await applicationfrome.getkycData(kycId);
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
      const updateUiWithSavedData = async (
        questions: any[],
        customerData: kycForm[]
      ) => {
        if (customerData && customerData.length > 0 && questions) {
          for (let i = 0; i < questions.length; i++) {
            let question: any = questions[i].questionDto;
            let customerDataQuestion: any = customerData.find(
              (item) => item.kycFormDto.id === question.id
            );
            if (customerDataQuestion) {
              let value = customerDataQuestion.kycFormDto.kycAnswerData[0].answer;
              if (question.answerTypeData.length > 0) {
                for (let j = 0; j < question.answerTypeData.length; j++) {
                  if (question.answerTypeData[j].name == value) {
                    question["selectedValue"] = question.answerTypeData[j].name;
                    break;
                  }
                }
              } else {
                question["textValue"] = value;
              }
            }
          }
        } else {
          setErrors([""]);
        }
      };

  return (
    <div></div>
  )
}

export default Download