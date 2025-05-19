
import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { StatusPayload } from "./status-payload";

class statusApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateStatus = async (payload: StatusPayload) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/Status/createStatus', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getStatus = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Status');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateStatus = async (id: number, payload: StatusPayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Status/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    blockStatus = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Status/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    unblockStatus = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Status/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

}

export default statusApiService;