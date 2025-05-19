import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RelativePayload } from "./relative-payload";

class RelativeApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getRelative = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/ConfigRelative');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default RelativeApiService;