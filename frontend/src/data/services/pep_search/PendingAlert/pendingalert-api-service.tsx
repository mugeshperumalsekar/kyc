import HttpClientWrapper from "../../../api/http-client-wrapper";

class PendingAlertApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getpendingalertdetails = async () => {
    try {
      const levelId = 1;
      const response = await this.httpClientWrapper.ALget3(`/api/v1/pendingalert?levelId=${levelId}`);
      return response;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  getPendingAlertDetails = async (loginDetails: any, statusId: any) => {
    try {
      const levelId = loginDetails?.accessLevel;
      if (!levelId) {
        throw new Error("accessLevel not found in loginDetails");
      }
      const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelFlowApiService?levelId=${levelId}&statusId=${statusId}`);
      return response;
    } catch (error) {
      console.error("Error fetching pending alert details:", error);
      throw error;
    }
  };

  getpepRemarkending = async (hitdataId: any) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

}

export default PendingAlertApiService;