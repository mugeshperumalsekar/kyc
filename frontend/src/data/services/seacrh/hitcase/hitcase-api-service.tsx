import HttpClientWrapper from "../../../api/http-client-wrapper";
import { HitcasePayload } from "./hitcase-payload";


class HitcaseApiService {
    
    
 
    
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }
    CreateHitcase = async (payload: HitcasePayload) => {
        console.log("HitcaseApiService CreateHitdata() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/hitcase/CreateHitcase', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("HitcaseApiService CreateHitdata() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    
    
    CreateHitCase = async (payload: HitcasePayload, searchId: string,statusNowId:string, hitId:string,criminalId:string) => {
        console.log("HitcaseApiService CreateHitcase() start = " + JSON.stringify(payload));
        try {
            payload.searchId = searchId;
            // payload.statusNowId= statusNowId;
            // payload.hitId = hitId;
            payload.criminalId = criminalId;
            const response = await this.httpClientWrapper.post('/api/hitcase/CreateHitcase', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("HitdataApiService CreateHitdata() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    

    CreateHitCaseInsert = async (payload: HitcasePayload) => {
        console.log("HitcaseApiService CreateHitCaseInsert() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/insert/CreateHitCase', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("HitcaseApiService CreateHitCaseInsert() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

   
    // GET request to fetch all ministries
    getHitdata = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/HitData');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   

    
}

export default HitcaseApiService;
