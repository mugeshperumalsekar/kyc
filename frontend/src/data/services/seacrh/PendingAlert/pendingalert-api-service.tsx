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
            const response = await this.httpClientWrapper.get(`/api/v1/pendingalert?levelId=${levelId}`);

            console.log("Request config:", response.config);
            console.log("pendingalert", response.data);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
        
    }
   

}

export default PendingAlertApiService;
