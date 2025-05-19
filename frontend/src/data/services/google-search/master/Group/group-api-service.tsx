import axios from "axios";
import { GroupPayload } from "./group-payload";
import HttpClientWrapper from "../../../../api/http-client-wrapper";


class GroupApiService {

    private httpClientWrapper: HttpClientWrapper;
   

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterGroup = async (payload: GroupPayload) => {
        try {
            const url = `/api/v1/Group/CreateGroupRequest`; 
            console.log(`POST URL: ${url}`);
            const response = await this.httpClientWrapper.googlepost(url, payload);
            return response.data; 
        } catch (error) {
            console.error("Error creating Group:", error);
            throw error;
        }
    };
    

    getGroupOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Group/active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getCategoryOptions = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Category/active');
            return response;
        } catch (error) {
            throw error;
        }
    };
    updateGroup = async (id: number, payload: GroupPayload) => {
        console.log("GroupApiService updateCountry() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Group/${id}`, payload);
            const data = response.data;
            // console.log("Response data:", data);
            return data;
        } catch (error) {
            console.error("CountryApiService updateCountry() error:", error);
            throw error;
        }
    }


    
    blockGroup = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Group/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

    unblockGroup = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Group/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

}

export default GroupApiService;