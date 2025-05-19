import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RIFPayload } from "./rif-payload";


class RIFApiService {
    


    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    

    // CreateCaseLifeCycleImplInsert = async (payload: RIFPayload) => {
    //     console.log("HitcaseApiService CreateCaseLifeCycleImplInsert() start = " + JSON.stringify(payload));
    //     try {
    //       const response = await this.httpClientWrapper.post('/api/insert/CaseLifeCycleImpl', payload);
    //       const data = response.data;
    //       console.log("Response data:", data);
    //       return data;
    //     } catch (error) {
    //       console.error("HitcaseApiService CreateCaseLifeCycleImplInsert() error:", error);
    //       throw error;
    //     }
    //   }
    
    

    // GET request to fetch all ministries
    // getRIF = async () => {
    //     try {
    //         const response = await this.httpClientWrapper.get('/api/v1/rif');
    //         return response;
    //     } catch (error) {
    //         // Handle the error as needed
    //         throw error;
    //     }
    // }

    getRIF = async () => {
        try {
            const levelId = 3;
            const response = await this.httpClientWrapper.get(`/api/v1/levelFour?levelId=${levelId}`);

            console.log("Request config:", response.config);
            console.log("pendingalert", response.data);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
        
    }

    getpendingRIF = async () => {
        try {
            const levelId = 4;
            const response = await this.httpClientWrapper.get(`/api/v1/levelFour?levelId=${levelId}`);

            console.log("Request config:", response.config);
            console.log("pendingalert", response.data);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
        
    }
   

}



export default RIFApiService;
