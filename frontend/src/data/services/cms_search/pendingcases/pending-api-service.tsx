import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PindingcasesPayload } from "./pending-payload";

class PendingcasesApiService {
    


    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePendingcases = async (payload: PindingcasesPayload) => {
        console.log("PendingcasesApiService CreatePendingcases() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.ALpost('/api/v1/pendingcase/insert', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("PendingcasesApiService CreatePendingcases() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

    CreateCaseLifeCycleImplInsert = async (payload: PindingcasesPayload) => {
        console.log("HitcaseApiService CreateCaseLifeCycleImplInsert() start = " + JSON.stringify(payload));
        try {
          const response = await this.httpClientWrapper.ALpost('/api/insert/CaseLifeCycleImpl', payload);
          const data = response.data;
          console.log("Response data:", data);
          return data;
        } catch (error) {
          console.error("HitcaseApiService CreateCaseLifeCycleImplInsert() error:", error);
          throw error;
        }
      }
    
    

    // GET request to fetch all ministries
    getPendingcases = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/pendingcase/l3PendingCase');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

    getPendingcaseRIF = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/pendingcase/l4PendingCase');
            console.log("Response data:", response);

            return response;
            
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
    getPendingOneRemarkDetails= async(criminalId: any, hitId: any, levelId: any, statusId: any)=> {
        try {
            const response = await this.httpClientWrapper.ALget(`/api/v1/LevelOneRemark?criminalId=${criminalId}&hitId=${hitId}&levelId=${levelId}&statusId=${statusId}`);
     
            console.log("Request config:", response.config);
            return response;
        } catch (error) {
           
            throw error;
        }
    }
    getPendingTwoRemarkDetails= async(criminalId: any, hitId: any, levelId: any, statusId: any)=> {
        try {
            const response = await this.httpClientWrapper.ALget(`/api/v1/LevelOneRemark?criminalId=${criminalId}&hitId=${hitId}&levelId=${levelId}&statusId=${statusId}`);
            console.log("Request config:", response.config);
         
            return response;
        } catch (error) {
         
            throw error;
        }
    }
    getPendingOneStatusTwoRemarkDetails= async(criminalId: any, hitId: any, levelId: any, statusId: any)=> {
        try {
            const response = await this.httpClientWrapper.ALget(`/api/v1/LevelOneRemark?criminalId=${criminalId}&hitId=${hitId}&levelId=${levelId}&statusId=${statusId}`);
            console.log("Request config:", response.config);
         
            return response;
        } catch (error) {
         
            throw error;
        }
    }
    getPendingthreeStatusTwoRemarkDetails= async(criminalId: any, hitId: any, levelId: any, statusId: any)=> {
        try {
            const response = await this.httpClientWrapper.ALget(`/api/v1/LevelOneRemark?criminalId=${criminalId}&hitId=${hitId}&levelId=${levelId}&statusId=${statusId}`);
            console.log("Request config:", response.config);
         
            return response;
        } catch (error) {
           
            throw error;
        }
    }
    getRemarkDetails = async (hitdataId: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getRemarkDetails:", error);
        }
    };
    
   

}

export default PendingcasesApiService;
