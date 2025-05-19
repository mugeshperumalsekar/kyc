
import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { AdminUserPayload } from "./adminuser_payload";

class AdminUserApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterAdminUser = async (payload: AdminUserPayload) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/users/createUserRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminUserApiService doMasterAdminUser() error:", error);
            throw error;
        }
    };

    getAdminUserOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/users');
            return response;
        } catch (error) {
            throw error;
        }
    };
    getAdminRole = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/users/roles');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateAdminUser = async (id: string, payload: AdminUserPayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/users/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminUserApiService updateAdminUser() error:", error);
            throw error;
        }
    };

    blockAdminUser = async (uid: string) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/users/${uid}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("blockAdminUser deleteState() error:", error);
            throw error;
        }
    };

    unblockAdminUser = async (uid: string) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/users/${uid}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("unblockAdminUser deleteState() error:", error);
            throw error;
        }
    };

}

export default AdminUserApiService;