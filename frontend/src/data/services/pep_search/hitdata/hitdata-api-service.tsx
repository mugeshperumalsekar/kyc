import HttpClientWrapper from "../../../api/http-client-wrapper";
import { HitdataPayload } from "./hitdata-payload";

class HitdataApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateHitdata = async (payload: HitdataPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/v1/HitRecord/createHitData', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getHitdata = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/HitData');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateHitdata = async (id: number, payload: HitdataPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/HitData/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    blockHitdata = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/HitData/{id}/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    unblockHitdata = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/HitData/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    fetchHitdataById = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/HitData/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

}

export default HitdataApiService;