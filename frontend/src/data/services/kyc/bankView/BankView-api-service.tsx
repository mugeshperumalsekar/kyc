import HttpClientWrapper from "../../../api/http-client-wrapper";

class BankViewService {

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

  getQuestionanswer = async (questionId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/AnswerType/${questionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  InsertPdf = async (file: File) => {
    try {
      const response = await this.httpClientWrapper.postFileData('/api/v1/FileUpload/files/verificationupload', file);
      return response;
    } catch (error) {
      throw error;
    }
  };



  getkycData = async (kycId: any) => {
    try {
      const response = await this.httpClientWrapper.kycget(`/api/v1/ApplicantForm/KycForm?kycId=${kycId}`);
      console.log('kycData:', response);
      return response;
    } catch (error) {
      console.error('Error fetching AML Complete Team data:', error);
      throw error;
    }
  }

}

export default BankViewService;