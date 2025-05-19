import HttpClientWrapper from "../../../api/http-client-wrapper";



class AlertViewApiService {
    private httpClientWrapper: HttpClientWrapper;
    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getTransactionDet = async () => {
        try {
            const response = await this.httpClientWrapper.ALget5('api/v1/CustomerGet');
            console.log('Response:', response);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default AlertViewApiService;