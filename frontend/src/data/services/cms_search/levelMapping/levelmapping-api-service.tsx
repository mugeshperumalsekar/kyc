import HttpClientWrapper from "../../../api/http-client-wrapper";
import { LevelMappingPayload, LevelOnePayload } from "./levelmapping-payload";

class LevelMappingApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateLevelMapping = async (payload: LevelMappingPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost('/api/v1/LevelMapping/CreateLevelMappingRequest', payload);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevelMapping = async () => {
        try {
            const response = await this.httpClientWrapper.ALget('/api/v1/LevelMapping');
            return response;
        } catch (error) {
            throw error;
        }
    };

   

    fetchLevelMappingById = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelMapping/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    blockLevelMapping = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/LevelMapping/${id}/block`);
            return response;
        } catch (error) {
            throw error;
        }
    };


    unblockLevelMapping = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/LevelMapping/{id}/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getLevelOneData = async (levelId: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelOne/levelId?levelId=${levelId}`);
            console.log("ss:",response)
            return response;
        } catch (error) {
            console.error('Error fetching level data:', error);
            throw error;
        }
    };

    updateLevelMapping = async (levelId: any, statusId: any, payload: LevelMappingPayload) => {
        try {
            const url = `/api/v1/LevelMapping/${levelId}/${statusId}?levelId=${levelId}&statusId=${statusId}`;
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
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelMapping/${levelId}/statusId?levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.error("Error fetching level status:", error);
            throw error; 
        }
    };

}

export default LevelMappingApiService;