import HttpClientWrapper from "../../api/http-client-wrapper";
import { RecordDTO } from "../viewpage/view_payload";
import { SanBulkPayload, SearchPayload } from "./search-payload";
import { SearchDTO } from "./viewpage/view_payload";

class SearchApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateSearch = async (payload: SearchPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/search/createSearch', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    CreateSanBulkTask = async (payload: SanBulkPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/BulkTaskAssign/createBulkTaskAssign', payload);
            return response;
        } catch (error) {
        }
    };

    getSearch = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/search/isBulkSearchGet');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAssignedData = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/BulkTaskAssign/{isTaskAssigned}/Active');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getNotification = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/search/fetchAllSearch');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getSanUser = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/users');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getSanBulkTaskAssign = async (searchId: number) => {
        try {
            const response = await this.httpClientWrapper.gets(`/api/v1/BulkTaskAssign/{searchId}?searchId=${searchId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getLevelpending = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/FirstlevelPending?id=${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getsanLevelpending = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/FirstlevelPending?id=${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    getSearchs = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/Count/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}&listId=${searchDTO.listID}&listId=${searchDTO.partySubTypeID}&listId=${searchDTO.countryId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    updateSearch = async (id: number, payload: SearchPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/search/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getfirstlevelsearch = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Search');
            console.log('firstlevelsearch:', response);
            return response;
        } catch (error) {
            throw error;
        }
    };

    blockSearch = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/search/{id}/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    unblockSearch = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/search/{id}/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Status');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default SearchApiService;