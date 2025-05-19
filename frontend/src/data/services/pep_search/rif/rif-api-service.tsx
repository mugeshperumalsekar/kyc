import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RIFPayload } from "./rif-payload";

class RIFApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getRIF = async () => {
        try {
            const levelId = 3;
            const statusId = 3;
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelOneRemark/RIF?levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    getpendingRIF = async () => {
        try {
            const levelId = 4;
            const statusId = 3;
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelOneRemark/RIF?levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

}

export default RIFApiService;