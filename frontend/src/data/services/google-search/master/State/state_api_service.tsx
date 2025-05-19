
import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { StatePayload } from "./state_payload";

class StateApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    MasterState = async (payload: StatePayload) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/State/CreateStateRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService MasterState() error:", error);
            throw error;
        }
    };

    getStateDataByCountryId = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/State');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateState = async (id: number, payload: StatePayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/State/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService updateState() error:", error);
            throw error;
        }
    };

    blockState = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/State/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

    unblockState = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/State/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

}

export default StateApiService;