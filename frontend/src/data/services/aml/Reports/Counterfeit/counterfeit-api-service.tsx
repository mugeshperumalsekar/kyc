
import { format } from 'date-fns';

import HttpClientWrapper from '../../../../api/http-client-wrapper';
import { CounterfeitCustomerEditData } from './counterfeit-payload';
import { CounterfeitDto } from '../../viewpage/view_payload';


class CounterfeitApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    async counterfeitGetCustomDate(startDate: Date, endDate: Date): Promise<CounterfeitCustomerEditData[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');   
            const response = await this.httpClientWrapper.amlget(`/api/v1/CounterfeitViewApiResources?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);           
            console.log('response:', response);
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


counterfeitGetAll = async () => {
    try {
        const response = await this.httpClientWrapper.amlget('/api/v1/CustomerAllData');
        return response;
    } catch (error) {
        throw error;
    }
}



getAmlCounterfeit = async (counterfeitId: any) => {
    try { 
        const endpoint = `/api/v1/SaveCounterfeit/GetCounterfeit/${counterfeitId}`;
        const response = await this.httpClientWrapper.amlget(endpoint);
        console.log('Counterfeit:', response);
        return response;
    } catch (error) {
        console.error('Error fetching counterfeit details:', error);
        // Handle the error here, for example, by displaying an error message to the user
        throw error;
    }
};


CounterfeitEdit = async (counterfeitId: string, euid: number,counterfeitDto: CounterfeitDto) => {
    try {
        const response = await this.httpClientWrapper.amlput(`/api/v1/SaveCounterfeit/UpdateCounterfeit?counterfeitId=${counterfeitId}&euid=${euid}`, counterfeitDto);
        console.log('response:', response);
        return response;
    } catch (error) {
        console.error("AdminUserApiService updateAdminUser() error:", error);
        throw error;
    }
}



}

export default CounterfeitApiService;