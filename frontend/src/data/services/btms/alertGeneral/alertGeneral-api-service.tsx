import HttpClientWrapper from "../../../api/http-client-wrapper";


class AlertGeneralApiService {
    private httpClientWrapper: HttpClientWrapper;
    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getAlertGeneral = async () => {
        try {
            const response = await this.httpClientWrapper.ALget5('/api/v1/CustomerGet');
            return response;
        } catch (error) {
            throw error;
        }
    }

    getTransaction = async (senderCustomer: any) => {
        try {
            const response = await this.httpClientWrapper.ALget5(`/api/v1/TransactionGet?senderCustomer=${senderCustomer}`);
            console.log('response:', response);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default AlertGeneralApiService;