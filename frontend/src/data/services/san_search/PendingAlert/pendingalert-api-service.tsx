import HttpClientWrapper from "../../../api/http-client-wrapper";

class PendingAlertApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getpendingalertdetails = async () => {
        try {
            const levelId = 1;
            const response = await this.httpClientWrapper.get(`/api/v1/pendingalert?levelId=${levelId}`);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    getRemarkDetails = async (hitdataId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getRemarkDetails:", error);
        }
    };
    getPendingAlertDetails = async (loginDetails: any, statusId:any) => {
        try {
          console.log("loginDetails:", loginDetails);  
      
          const levelId = loginDetails?.accessLevel;
      
          if (!levelId) {
            throw new Error("accessLevel not found in loginDetails");
          }
      
          
      
          const response = await this.httpClientWrapper.get(
            `/api/v1/LevelFlowApiService?levelId=${levelId}&statusId=${statusId}`
          );
      
          console.log("Request config:", response);
          console.log("pendingalert", response);
      
          return response;
        } catch (error) {
          console.error("Error fetching pending alert details:", error);
          throw error;
        }
      };
    getsanRemarkending = async (hitdataId: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            throw error;
        }
      };
   

}

export default PendingAlertApiService;