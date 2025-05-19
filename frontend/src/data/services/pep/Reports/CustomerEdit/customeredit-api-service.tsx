
import { format } from 'date-fns';

import { CustomerEditData, ManagerData, QcPendingViewData, QcViewDataPayload } from './customeredit-payload';
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
            const response = await this.httpClientWrapper.get(`api/v1/CustomerEdit?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);           
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

getQcViewDate = async (startDate: Date, endDate: Date, pepId: string): Promise<QcViewDataPayload[]> => {
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const response = await this.httpClientWrapper.get(`api/v1/QcView?fromDate=${formattedStartDate}&toDate=${formattedEndDate}&pepId=${pepId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getQcPending(startDate: Date, endDate: Date): Promise<QcPendingViewData[]> {
    try {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');   
        const response = await this.httpClientWrapper.get(`api/v1/QcView?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);            
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

async getManagerDate(startDate: Date, endDate: Date): Promise<CustomerEditData[]> {
    try {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');   
        const response = await this.httpClientWrapper.get(`api/v1/QcManagerPending?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);           
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
  async geManagerPending(startDate: Date, endDate: Date): Promise<QcPendingViewData[]> {
    try {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');   
        const response = await this.httpClientWrapper.get(`/api/v1/ViewApprove?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);            
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
        const response = await this.httpClientWrapper.get('/api/v1/CustomerAllData');
        return response;
    } catch (error) {
        throw error;
    }
}
async getManagerPending(startDate: Date, endDate: Date): Promise<CustomerEditData[]> {
    try {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        const response = await this.httpClientWrapper.get(`api/v1/ManagerViewPending?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
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

export default CustomerApiService;