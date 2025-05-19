import HttpClientWrapper from "../../../api/http-client-wrapper";

class IdNumberApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getIdnumber = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/IdNumber');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default IdNumberApiService;