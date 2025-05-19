
import { format } from 'date-fns';
import { CustomerEditData, CustomerEditDatas } from './customeredit-payload';
import HttpClientWrapper from '../../../../api/http-client-wrapper';


class CustomerApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    async getCustomDate(startDate: Date, endDate: Date): Promise<CustomerEditData[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.amlget(`/api/v1/AmlCustomerEditApiResources?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
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


    getAll = async () => {
        try {
            const response = await this.httpClientWrapper.amlget('/api/v1/AmlCustomerAllDataApiResources');
            return response;
        } catch (error) {
            throw error;
        }
    };

    
    getAllrepaly = async (branchId: any) => {
        try {
            const response = await this.httpClientWrapper.amlget(`/api/v1/AmlBranchTeam/fetchAllAmlBranchPendingResponse?branchId=${branchId}`);
            console.log("response:", response);
            return response;
         
            
        } catch (error) {
            throw error;
        }
    };
    getAlldecision = async () => {
        try {
            const response = await this.httpClientWrapper.amlget(`/api/v1/AmlComplaintReply/fetchAllAmlPendingResponse`);
            console.log("response:", response);
            return response;
        } catch (error) {
            throw error;
        }
    };

   
    getFraudAll = async () => {
        try {
            const response = await this.httpClientWrapper.amlget('/api/v1/FraudAllData');
            return response;
        } catch (error) {
            throw error;
        }
    };

    async getCustomDates(startDate: Date, endDate: Date): Promise<CustomerEditDatas[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.amlget(`/api/v1/FraudViewApiResources?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
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

    getAlls = async () => {
        try {
            const response = await this.httpClientWrapper.amlget('/api/v1/CustomerAllData');
            return response;
        } catch (error) {
            throw error;
        }
    }


}

export default CustomerApiService;