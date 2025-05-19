import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PendingAlertPayload } from "./pendingalert-payload";


class PendingAlertApiService {
 


    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getpendingalertdetails = async () => {
        try {
            const levelId = 1;
            const response = await this.httpClientWrapper.ALget(`/api/v1/pendingalert?levelId=${levelId}`);

            console.log("Request config:", response.config);
            console.log("pendingalert", response.data);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
        
    }
    getPendingAlertDetails = async (loginDetails: any, statusId:any) => {
        try {
          console.log("loginDetails:", loginDetails);  
      
          const levelId = loginDetails?.accessLevel;
      
          if (!levelId) {
            throw new Error("accessLevel not found in loginDetails");
          }
      
          // if(levelId === statusId){
            
          // }
          // if(levelId && statusId==0){
          // }
          // if (levelId === 3) {
          //   statusId = 0;
          //   statusId = 3;
          // } else {
          //   statusId = 0;  
          // }
      
          const response = await this.httpClientWrapper.ALget(
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
      getcmsRemarkending = async (hitId: any) => { 
        try {
            const response = await this.httpClientWrapper.ALget(`/api/v1/RemarksDetails?hitId=${hitId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
   
   

}

export default PendingAlertApiService;
