import { format } from 'date-fns';
import HttpClientWrapper from '../../../api/http-client-wrapper';
import { PepSearchData } from './pepSearch-payload';




class PepSearchApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    async getCustomDate(startDate: Date, endDate: Date): Promise<PepSearchData[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.ALget3(`/api/v1/Search/Search?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
            console.log('API Response:', response);
           
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
    }
    

}

export default PepSearchApiService;