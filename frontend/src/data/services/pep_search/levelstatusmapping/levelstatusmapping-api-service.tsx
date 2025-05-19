import HttpClientWrapper from "../../../api/http-client-wrapper";
import { LevelStatusMappingPayload } from "./levelstatusmapping-payload";

class LevelStatusMappingApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    createLevelStatusMapping = async (payload: LevelStatusMappingPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/v1/StatusMapping/CreateStatusMappingRequest', payload);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevelStatusMapping = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/StatusMapping');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevelOneData = async (loginDetails: any) => {
        try {
            console.log("loginDetails:", loginDetails);
            const levelId = loginDetails?.accessLevel;
            if (!levelId) {
                throw new Error("accessLevel not found in loginDetails");
            }
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelOne/levelId?levelId=${levelId}`);
            console.log("ss:", response)
            return response;
        } catch (error) {
            console.error('Error fetching level data:', error);
            throw error;
        }
    };

    getpepScreeningLevelOneData = async (loginDetails: any) => {
        try {
            console.log("loginDetails:", loginDetails);
            const levelId = loginDetails?.accessLevel;
            if (!levelId) {
                throw new Error("accessLevel not found in loginDetails");
            }
            const response = await this.httpClientWrapper.get(`/api/v1/LevelOne/levelId?levelId=${levelId}`);
            console.log("ss:", response)
            return response;
        } catch (error) {
            console.error('Error fetching level data:', error);
            throw error;
        }
    };

    updateLevelStatusMapping = async (levelId: any, statusId: any, payload: LevelStatusMappingPayload) => {
        try {
            const url = `/api/v1/StatusMapping/${levelId}/${statusId}?levelId=${levelId}&statusId=${statusId}`;
            console.log("Updating with URL:", url, "Payload:", payload);
            const response = await this.httpClientWrapper.ALput3(url, payload);
            return response.data;
        } catch (error) {
            console.error("Error in updateLevelStatusMapping:", error);
            throw error;
        }
    };

    getLevelStatus = async (levelId: any, statusId: any) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/StatusMapping/${levelId}/statusId?levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.error("Error fetching level status:", error);
            throw error;
        }
    };

}

export default LevelStatusMappingApiService;