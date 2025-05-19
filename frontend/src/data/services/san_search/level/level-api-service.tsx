import HttpClientWrapper from "../../../api/http-client-wrapper";
import { LevelPayload } from "./level-payload";

class LevelApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateLevel = async (payload: LevelPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Level/CreateLevelRequest', payload);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevel = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Level');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateLevel = async (id: number, payload: LevelPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Level/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    fetchLevelById = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Level/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    getsanStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Status');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default LevelApiService;