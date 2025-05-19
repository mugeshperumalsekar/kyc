import HttpClientWrapper from "../../../api/http-client-wrapper";
import { HitdatalifecyclePayload, HitrecordlifecyclePayload } from "./hitdatalifecycle-payload";

class HitdatalifecycleApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreateHitdatalifecycle = async (payload: HitdatalifecyclePayload) => {
        const statusIds = payload.statusId;
        if (parseInt(statusIds) == 1) {
            try {
                const response = await this.httpClientWrapper.ALpost3('/api/hitrecordlifecycle/createhitrecordlifecycle', payload);
                console.log('API Responsess:', response);
                return response;
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error;
            }
        }
    };

    CreatLevelFlowcycle = async (payload: HitrecordlifecyclePayload) => {
        {
            try {
                const response = await this.httpClientWrapper.ALpost3('/api/v1/LevelFlowApiService/CreateLevelRequest', payload);
                console.log('API Responsess:', response);
                return response;
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error;
            }
        }
    };

    getHitdatalifecycle = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/hitdatalifecycle');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateHitdatalifecycle = async (id: number, payload: HitdatalifecyclePayload) => {
        console.log("HitdatalifecycleApiService updateHitdatalifecycle() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/hitdatalifecycle/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("HitdatalifecycleApiService updateHitdatalifecycle() error:", error);
            throw error;
        }
    };

    blockHitdatalifecycle = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/hitdatalifecycle/${id}/block`);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("HitdatalifecycleApiService blockHitdatalifecycle() error:", error);
            throw error;
        }
    };

    unblockSearch = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/hitdatalifecycle/{id}/${id}/unblock`);
            const data = response.data;
            console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("HitdatalifecycleApiService unblockSearch() error:", error);
            throw error;
        }
    };

    CreateCriminalHitdatalifecycle = async (payload: HitdatalifecyclePayload) => {
        const statusIds = payload.statusId;
        if (parseInt(statusIds) == 1) {
            try {
                const response = await this.httpClientWrapper.ALpost8('/api/hitrecordlifecycle/createhitrecordlifecycle', payload);
                console.log('API Responsess:', response);
                return response;
            } catch (error) {
                console.error("HitdatalifecycleApiService CreateHitdatalifecycle() error:", error);
                throw error;
            }
        }
    };
}

export default HitdatalifecycleApiService;