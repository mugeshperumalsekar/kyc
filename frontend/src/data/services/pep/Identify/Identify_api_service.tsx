
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { Identifieds } from "./Identify_payload";

class IdentifyApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getCategory = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Category');
            return response;
        } catch (error) {
            throw error;
        }
    }

    getIdentify = async (name: string): Promise<Identifieds[]> => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/Identifier?name=${encodeURIComponent(name)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getIndividual = async (pepName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Individual?pepName=${encodeURIComponent(pepName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getOrganization = async (companyName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Organization?companyName=${encodeURIComponent(companyName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
    getAll = async (pepName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/All?pepName=${encodeURIComponent(pepName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

}

export default IdentifyApiService;