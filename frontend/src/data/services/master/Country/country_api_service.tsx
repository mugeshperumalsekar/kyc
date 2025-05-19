import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CountryEditPayload, CountryPayload } from "./country_payload";

class CountryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterCountry = async (payload: CountryPayload) => {
    };

    getCountryOptions = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Country');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateCountry = async (id: number, payload: CountryEditPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Country/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CountryApiService updateCountry() error:", error);
            throw error;
        }
    };

    blockCountry = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Country/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

    unblockCountry = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Country/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

}

export default CountryApiService;