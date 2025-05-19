import { format } from 'date-fns';
import { BankData } from "./bank_payload";
import HttpClientWrapper from '../../../api/http-client-wrapper';

class BankApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    async getClientView(startDate: Date, endDate: Date): Promise<BankData[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.kycget(`/api/v1/ClientView/ClientView?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
            console.log('Response:', response);
            return response;
        } catch (error: any) {
            if (error.response) {
                console.error('Request failed with status code:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received. Request made but no response.');
            } else {
                console.error('Error setting up the request:', error.message);
            }
            throw new Error(`Error in API request: ${error}`);
        }
    };

    getName = async () => {
        try {
            const response = await this.httpClientWrapper.kycget('/api/v1/ClientView/ClientName');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default BankApiService;   