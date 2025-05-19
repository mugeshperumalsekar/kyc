import HttpClientWrapper from "../../../api/http-client-wrapper";
import { Type, AppFormData, CreateData, DeclarationFrom, ApplicationQuestion, ScoreDocument, ApplicationsubQuestion, UpdateAppFormData, NewPayload } from "./applicationfrome-payload";

class ApplicationfromeService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getType = async () => {
    try {
      const response = await this.httpClientWrapper.kycget('/api/v1/ApplicationType');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getappliction = async (applicationTypeId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/AccountType/${applicationTypeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getQuestionTypes = async (applicationTypeId: any, accountTypeId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/QuestionType/${applicationTypeId}/${accountTypeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getAnswer = async () => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/AnswerFieldType/{fetchAll}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getQuestionanswer = async (questionId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/AnswerType/${questionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  InsertPdf = async (files: File[]) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    formData.append('branchId', '1');
    try {
      const response = await this.httpClientWrapper.kycpostFormData('/api/v1/LetterHeadUpload/files/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading score document:', error);
      throw new Error('Error uploading score document');
    }
  };

  Apllicationinsert = async (formData: AppFormData) => {
    try {
      const response = await this.httpClientWrapper.kycpost('/api/v1/ApplicantForm/CreateApplicantFormRequest', formData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  DeclarationForm = async (declarationFrom: DeclarationFrom) => {
    try {
      const response = await this.httpClientWrapper.kycpost('/api/v1/DeclarationForm/CreateDeclarationFormRequest', declarationFrom);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getDeclarationForm = async (kycId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/DeclarationForm/DeclarationFormData/${kycId}`);
      return response;
    } catch (error) {
      console.error('Error fetching kycDeclaration data:', error);
      throw error;
    }
  };

  Directorslist = async (KycformData: NewPayload) => {
    try {
      const response = await this.httpClientWrapper.kycpost('/api/v1/DirectorsList/CreateDirectorsList', KycformData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  Directorslists = async (KycformDataa: NewPayload) => {
    try {
      const responses = await this.httpClientWrapper.kycpost('/api/v1/DirectorsList/CreateDirectorsList', KycformDataa);
      return responses;
    } catch (error) {
      throw error;
    }
  };

  getkycData = async (kycId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/ApplicantForm/KycForm?kycId=${kycId}`);
      return response;
    } catch (error) {
      console.error('Error fetching AML Complete Team data:', error);
      throw error;
    }
  };

  getKycShareHolder = async (kycId: number) => {
    if (kycId === undefined || kycId === null) {
      throw new Error("Required parameter 'kycId' is not present.");
    }
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/DirectorsList/KycShareHolder/${kycId}?kycId=${kycId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getSignAuthority = async (kycId: number) => {
    if (kycId === undefined || kycId === null) {
      throw new Error("Required parameter 'kycId' is not present.");
    }
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/DirectorsSignAuthority/signAuthority/${kycId}?kycId=${kycId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getKycDirectorsList = async (kycId: number) => {
    if (kycId === undefined || kycId === null) {
      throw new Error("Required parameter 'kycId' is not present.");
    }
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/DirectorsList/KycDirectorsList/${kycId}?kycId=${kycId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getPrintNumber = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/ApplicantForm/PrintNumber?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching AML Complete Team data:', error);
      throw error;
    }
  };

  getPepScore = async () => {
    try {
      const response = await this.httpClientWrapper.kycget('/api/v1/PepScore');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getNegativeSearch = async () => {
    try {
      const response = await this.httpClientWrapper.kycget('/api/v1/NegativeScoreNews');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getEntityScore = async () => {
    try {
      const response = await this.httpClientWrapper.kycget('/api/v1/EntityScore');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getScore = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/ApplicantFormDetails/Score?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching getScore:', error);
      throw error;
    }
  };

  getRiskRange = async () => {
    try {
      const response = await this.httpClientWrapper.kycget('/api/v1/RiskScoreRange/ScoreRange');
      return response;
    } catch (error) {
      throw error;
    }
  };

  Appliactionquest = async (inputValue: ApplicationQuestion) => {
    try {
      const response = await this.httpClientWrapper.kycpost('/api/v1/QuestionType/CreateApplicationFormRequest', inputValue);
      return response;
    } catch (error) {
      throw error;
    }
  };

  Appliactionsubquestion = async (inputValue: ApplicationsubQuestion) => {
    try {
      const response = await this.httpClientWrapper.kycpost('/api/v1/SubQuestionType/CreateSubQuestionTypeRequest', inputValue);
      return response;
    } catch (error) {
      throw error;
    }
  };

  uploadScoreDocument = async (
    files: File[],
    kycId: number[],
    pathId: number[],
    createScoreCalculationRequest: ScoreDocument
  ) => {
    const formData = new FormData();
    for (let file of files) {
      console.log(`Appending file: ${file.name}`);
      formData.append('files', file);
    }
    kycId.forEach((kycId, index) => {
      formData.append('kycId', String(kycId));
    });
    pathId.forEach((pathId, index) => {
      formData.append('pathId', String(pathId));
    });
    formData.append('createScoreCalculationRequest', new Blob([JSON.stringify(createScoreCalculationRequest)], {
      type: "application/json"
    }));
    try {
      const response = await this.httpClientWrapper.kycpostFormData('/api/v1/ScoreDocument/files/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading score document:', error);
      throw new Error('Error uploading score document');
    }
  };

  getIsCompleted = async () => {
    try {
      const response = await this.httpClientWrapper.kycget('/api/v1/ApplicantForm/isCompleted');
      return response;
    } catch (error) {
      throw error;
    }
  };

  ApllicationUpdate = async (id: number, formData: UpdateAppFormData) => {
    try {
      console.log('Sending PUT request to API with payload:', formData);
      const response = await this.httpClientWrapper.kycput(`/api/v1/ApplicantForm/${id}`, formData);
      console.log('Response from PUT request:', response);
      return response;
    } catch (error) {
      console.error('Error in PUT request:', error);
      throw error;
    }
  };

  getDeclarationFormById = async (declarationId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/DeclarationForm/DeclarationFormData/${declarationId}`);
      return response;
    } catch (error) {
      console.error('Error fetching kycDeclaration data:', error);
      throw error;
    }
  };

  KycDocumentUpdate = async (kycId: number) => {
    try {
      const status = 'submit';
      const response = await this.httpClientWrapper.kycput(`/api/v1/ApplicantForm/applicantForm/${kycId}/status?id=${kycId}&status=${status}`);
      console.log('Response from PUT request:', response);
      return response;
    } catch (error) {
      console.error('Error in PUT request:', error);
      throw error;
    }
  };

}

export default ApplicationfromeService;