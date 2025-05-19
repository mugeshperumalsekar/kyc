import HttpClientWrapper from "../../api/http-client-wrapper";
import { searchIdentify } from "./searchIdentify_payload";

class searchIdentifyApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getSearchIdentify = async (assignTo: number): Promise<searchIdentify[]> => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/UserTaskView?assignTo=${assignTo}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default searchIdentifyApiService;