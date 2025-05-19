

import HttpClientWrapper from "../../api/http-client-wrapper";
import { SearchPayload ,SearchDTO,RecordDTO} from "./search-payload";

class SearchApiService {


    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }


    CreateSearch = async (payload: SearchPayload) => {
        console.log("SearchApiService CreateSearch() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/search/createSearch', payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("SearchApiService CreateSearch() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }

    // GET request to fetch all ministries
    getSearch = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/search');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
    // getSearchs = async () => {
    //     try {
    //         const levelId = 1; // Set the levelId parameter here
    //         const response = await this.httpClientWrapper.get(`/api/v1/hitdatatable?levelId=${levelId}`);
    //         return response;
    //     } catch (error) {
    //         // Handle the error as needed
    //         throw error;
    //     }
    // }
    getSearchs = async () => {
        try {
            const levelId = 1; // Set the levelId parameter here
            const response = await this.httpClientWrapper.get(`/api/v1/Count/RecordsCount?name=Raji&matching_score=90&listID=0&partySubTypeID=0&countryId=0`);
            return response;
        } catch (error) {
            // Handle the error as nee
            throw error;
        }
    }
    // getSearchs = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
    //     try {
    //         const response = await this.httpClientWrapper.get(`/api/v1/Count/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}&listId=${searchDTO.listID}&listId=${searchDTO.partySubTypeID}&listId=${searchDTO.countryId}`);
    //         console.log('API Response:', response); // Log the API response
    //         return response; // Assuming the response contains an array of RecordDTO objects
    //     } catch (error) {
    //         console.error('Error fetching records count:', error);
    //         throw error;
    //     }
        
    // };
    

   
    updateSearch = async (id: number, payload: SearchPayload) => {
        console.log("SearchApiService updateSearch() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/search/${id}`, payload);
            const data = response.data;
            console.log("Response data:", data);
            return data; // You may return the data if needed
        } catch (error) {
            console.error("SearchApiService updateSearch() error:", error);
            throw error; // Rethrow the error or handle it as needed
        }
    }
    // DELETE request to delete a ministry by ID


blockSearch = async (id: number) => {
       
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/search/{id}/${id}/block` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("StateApiService blockSearch() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
unblockSearch= async (id: number) => {
   
    try {
        const response = await this.httpClientWrapper.put(`/api/v1/search/{id}/${id}/unblock` );
        const data = response.data;
        console.log("Response data:", data);
        return data; // You may return the data if needed
    } catch (error) {
        console.error("StateApiService unblockSearch() error:", error);
        throw error; // Rethrow the error or handle it as needed
    }
}
}

export default SearchApiService;
