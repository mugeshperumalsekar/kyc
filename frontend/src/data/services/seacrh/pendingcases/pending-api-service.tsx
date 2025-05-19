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
            const response = await this.httpClientWrapper.post('/api/v1/pendingcase/insert', payload);
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
          const response = await this.httpClientWrapper.post('/api/insert/CaseLifeCycleImpl', payload);
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
            const response = await this.httpClientWrapper.get('/api/v1/pendingcase/l3PendingCase');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

    getPendingcaseRIF = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/pendingcase/l4PendingCase');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
   

}

export default PendingcasesApiService;
