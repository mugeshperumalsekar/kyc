
import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { AuthAdminPayload } from "./authu-admin-payload";

class AuthAdminApiService {

    private httpClientWrapper: HttpClientWrapper;
    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getgenders = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/Gender');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getadmingroup = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/admingroup');
            return response;
        } catch (error) {
            throw error;
        }
    };
    

    getmarialstatus = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/marialstatus');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getadminuser = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/users');
            return response;
        } catch (error) {
            throw error;
        }
    };
    

    getUserView = async (id: string) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/users/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    doAdminuser = async (payload: AuthAdminPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/v1/users/createUserRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AuthAdminApiService doAdminuser() error:", error);
            throw error;
        }
    };
    updateAdminUser = async (id: any, payload: AuthAdminPayload) => {
        try {
            const response = await this.httpClientWrapper.ALput3(`/api/v1/users/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminUserApiService updateAdminUser() error:", error);
            throw error;
        }
    };
    getlevel = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/Level');
            console.log('accessresponse:',response);
            return response;
         
        } catch (error) {
            throw error;
        }
    };
    getAdmingroup = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/admingroup');
            return response;
        } catch (error) {
            throw error;
        }
    }

}

export default AuthAdminApiService;