import HttpClientWrapper from "../../../api/http-client-wrapper";
import { HitcasePayload } from "./hitcase-payload";

class HitcaseApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateHitcase = async (payload: HitcasePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/hitcase/CreateHitcase', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    CreateHitCase = async (payload: HitcasePayload, searchId: string, statusNowId: string, hitId: string, criminalId: string) => {
        try {
            payload.searchId = searchId;
            payload.criminalId = criminalId;
            const response = await this.httpClientWrapper.post('/api/hitcase/CreateHitcase', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    CreateHitCaseInsert = async (payload: HitcasePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/insert/CreateHitCase', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getHitdata = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/HitData');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default HitcaseApiService;