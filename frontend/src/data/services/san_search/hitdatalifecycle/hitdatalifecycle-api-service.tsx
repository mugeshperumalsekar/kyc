import HttpClientWrapper from "../../../api/http-client-wrapper";
import { HitdatalifecyclePayload ,HitrecordlifecyclePayload} from "./hitdatalifecycle-payload";
import { HitcasePayload } from "../hitcase/hitcase-payload";


class HitdatalifecycleApiService {


    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateHitdatalifecycle = async (payload: HitdatalifecyclePayload) => {
       const statusIds  = payload.statusId;
        if(parseInt(statusIds)==1)
        {
            try {
                const response = await this.httpClientWrapper.post('/api/hitrecordlifecycle/createhitrecordlifecycle', payload);
                console.log('API Responsess:', response); 
                // const data = response.data;
                return response; // You may return the data if needed
             
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error; // Rethrow the error or handle it as needed
            }
        }
        // else
        // {
        //     payload= HitcasePayload 
            
        // }
    }
    
    CreatLevelFlowcycle = async (payload: HitrecordlifecyclePayload) => {
   
        {
            try {
                const response = await this.httpClientWrapper.post('/api/v1/LevelFlowApiService/CreateLevelRequest', payload);
                console.log('API Responsess:', response); 
                
                return response; 
             
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error; // Rethrow the error or handle it as needed
            }
        }
       
    }
   

    // GET request to fetch all ministries
    getHitdatalifecycle = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/hitdatalifecycle');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }

   
    updateHitdatalifecycle = async (id: number, payload: HitdatalifecyclePayload) => {
        console.log("HitdatalifecycleApiService updateHitdatalifecycle() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/hitdatalifecycle/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("HitdatalifecycleApiService updateHitdatalifecycle() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID


blockHitdatalifecycle = async (id: number) => {
       
    try {
        const response = await this.httpClientWrapper.put(`/api/hitdatalifecycle/${id}/block` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("HitdatalifecycleApiService blockHitdatalifecycle() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
unblockSearch= async (id: number) => {
   
    try {
        const response = await this.httpClientWrapper.put(`/api/hitdatalifecycle/{id}/${id}/unblock` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("HitdatalifecycleApiService unblockSearch() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
}

export default HitdatalifecycleApiService;
