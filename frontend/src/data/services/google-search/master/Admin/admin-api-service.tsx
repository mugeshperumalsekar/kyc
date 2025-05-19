



import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { AdminPayload } from "./admin-payload";

class AdminApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    createAdmin = async (payload: AdminPayload) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/AdminSubscription/CreateAdminSubscriptionRequest', payload);
            console.log('Insert Response:', response);
            return response;
        } catch (error) {
            console.error("AdminApiService createAdmin() error:", error);
            throw error;
        }
    };

    
    updateAdmin = async (id: any, payload: AdminPayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/AdminSubscription/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error("AdminApiService updateAdmin() error:", error);
            throw error;
        }
    };
    updateAdmins = async (id: any, payload: AdminPayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/AdminSubscription/${id}/deActivate`, payload);
            return response.data;
        } catch (error) {
            console.error("AdminApiService updateAdmin() error:", error);
            throw error;
        }
    };
    getGroupOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Group/active');
            return response;
        } catch (error) {
            console.error("AdminApiService getGroupOptions() error:", error);
            throw error;
        }
    };

    getCategoryOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Category/active');
            return response;
        } catch (error) {
            console.error("AdminApiService getCategoryOptions() error:", error);
            throw error;
        }
    };

    getAdmins = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/AdminSubscription/active');
            return response;
        } catch (error) {
            console.error("AdminApiService getAdmins() error:", error);
            throw error;
        }
    };

    getClientsAdmin = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/AdminSubscription/client');
            return response;
        } catch (error) {
            console.error("AdminApiService getAdmins() error:", error);
            throw error;
        }
    };


    blockAdmin = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/AdminSubscription/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminApiService blockAdmin() error:", error);
            throw error;
        }
    };

    // Unblock a Admin by id
    unblockAdmin = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/AdminSubscription/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminApiService unblockAdmin() error:", error);
            throw error;
        }
    };
   
}

export default AdminApiService;
