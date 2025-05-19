

import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PartyPayload } from "./party_payload";
class PartyApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    
    // GET request to fetch all ministries
    getparty = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/PartyMaster');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
 
}

export default PartyApiService;
