import HttpClientWrapper from "../../../api/http-client-wrapper";
import { HitdataPayload } from "./hitdata-payload";

class HitdataApiService {
 


    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }
    CreateHitdata = async (payload: HitdataPayload) => {
        console.log("HitdataApiService CreateHitdata() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/HitRecord/createHitData', payload);
            const data = response.data;
            return data; // You may return the data if needed
        } catch (error) {
            console.error("HitdataApiService CreateHitdata() error:", error);
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

   
    updateHitdata = async (id: number, payload: HitdataPayload) => {
        console.log("HitdataApiService updateHitdata() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/HitData/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("HitdataApiService updateHitdata() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID


blockHitdata = async (id: number) => {
       
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/HitData/{id}/${id}/block` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("HitdataApiService blockHitdata() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
unblockHitdata= async (id: number) => {
   
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/HitData/${id}/unblock` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("HitdataApiService unblockHitdata() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
fetchHitdataById = async (id: number) => {
    try {
        const response = await this.httpClientWrapper.get(`/api/v1/HitData/${id}`);
        console.log("Fetched hitdata:", response.data); // Log the fetched data
        return response.data; // Assuming the response contains the hitdata record
    } catch (error) {
        console.error("Error fetching hitdata by ID:", error);
        throw error;
    }
};

}

export default HitdataApiService;