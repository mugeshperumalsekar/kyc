
import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { ClientPayload } from "./Client-payload";


class ClientApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    createClient = async (payload: ClientPayload) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/ClientSubscription/CreateClientSubscriptionRequest', payload);
            console.log('Insert Responsess:', response);
            return response;
          
        } catch (error) {
            console.error("ClientApiService createClient() error:", error);
            throw error;
        }
    };

    getGroupOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Group/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getClients = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ClientSubscription/active');
            return response;
        } catch (error) {
            throw error;
        }
    };
    getClientsdata = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/ClientSubscription/${clientId}');
            return response;
        } catch (error) {
            throw error;
        }
    };
    //    getClientsdata = async (clientId:any) => {
    //     try {
    //         const response = await this.httpClientWrapper.get(`/api/v1/ClientSubscription/${clientId}`);
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    getCategoryOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Category/active');
            return response;
        } catch (error) {
            throw error;
        }
    };


    // Update a Client by id
    updateClient = async (id: any, payload: ClientPayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/ClientSubscription/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientApiService updateClient() error:", error);
            throw error;
        }
    };

    // Block a Client by id
    blockClient = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/ClientSubscription/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientApiService blockClient() error:", error);
            throw error;
        }
    };

    // Unblock a Client by id
    unblockClient = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/ClientSubscription/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("ClientApiService unblockClient() error:", error);
            throw error;
        }
    };
   
}

export default ClientApiService;
