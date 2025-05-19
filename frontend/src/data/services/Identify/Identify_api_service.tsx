import HttpClientWrapper from "../../api/http-client-wrapper";
import { Identifieds } from "./Identify_payload";

class IdentifyApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getmanger = async (cmsName: string): Promise<Identifieds[]> => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/ManagerViewGet?cmsName=${encodeURIComponent(cmsName)}`);
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

    getEntity = async (cmsName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Entity?cmsName=${encodeURIComponent(cmsName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getIndividuals = async (cmsName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Individual?cmsName=${encodeURIComponent(cmsName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getShip = async (cmsName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Ship?cmsName=${encodeURIComponent(cmsName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAircraft = async (cmsName: string) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Aircraft?cmsName=${encodeURIComponent(cmsName)}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default IdentifyApiService;