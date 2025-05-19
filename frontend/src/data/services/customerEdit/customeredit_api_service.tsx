import { format } from 'date-fns';
import { CustomerEditData, } from './customeredit_payload';
import HttpClientWrapper from '../../api/http-client-wrapper';
import { ManagerData, QcPendingViewData, QcViewDataPayload } from '../Reports/CustomerEdit/customeredit-payload';

class CustomerApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    async getCustomDate(startDate: Date, endDate: Date,): Promise<CustomerEditData[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.ALget(`api/v1/CustomerEdit?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
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

    async getManager(startDate: Date, endDate: Date,): Promise<CustomerEditData[]> {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.get(`api/v1/QcManager?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
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

    getQcViewDate = async (startDate: Date, endDate: Date, pepId: string): Promise<QcViewDataPayload[]> => {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.get(`api/v1/QcView?fromDate=${formattedStartDate}&toDate=${formattedEndDate}&pepId=${pepId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    async getQcPending(startDate: Date, endDate: Date): Promise<QcPendingViewData[]> {
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
    };

    getManagerDate = async (startDate: Date, endDate: Date): Promise<[ManagerData]> => {
        try {
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const response = await this.httpClientWrapper.get(`/api/v1/QcManager?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

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
    };

    getAll = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/CustomerAllData');
            console.log('GetAll:',response)
            return response;
        } catch (error) {
            throw error;
        }
    };

    getDocumentType = async (cmsId: number, pathId: number) => {
        try {
            const response = await this.httpClientWrapper.getLocalImage(`/api/v1/Document/downloadDocument/${cmsId}/${pathId}`);
            const responseText = new TextDecoder().decode(response);
            const jsonResponse = JSON.parse(responseText);
            return jsonResponse;
        } catch (error) {
            console.error("AddressApiService getDocumentType() error:", error);
            throw error;
        }
    };

    getImage = async (pathId: number, cmsId: number) => {
        try {
            const response = await this.httpClientWrapper.getLocalImageCms(`/api/v1/Document/downloadDocument/${cmsId}/${pathId}`);
            return response;
        } catch (error) {
            console.error("AddressApiService getLocalImage() error:", error);
            throw error;
        }
    };

    getPDF = async (pathId: number, cmsId: number) => {
        try {
            const response: any = await this.httpClientWrapper.getLocalPDFCms(`/api/v1/Document/downloadDocument/${cmsId}/${pathId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            return { data: response, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

}

export default CustomerApiService;