import { format } from 'date-fns';
import HttpClientWrapper from '../../../api/http-client-wrapper';
import { ScamDatas } from './scam_payload';


class ScamApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    async getCustomDate(startDate: Date, endDate: Date): Promise<ScamDatas[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.amlget(`/api/v1/ScamViewApiResources?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
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


    getAll = async () => {
        try {
            const response = await this.httpClientWrapper.amlget('/api/v1/ScamAllData');
            return response;
        } catch (error) {
            throw error;
        }
    };


}

export default ScamApiService;