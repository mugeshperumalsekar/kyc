import { AxiosError } from "axios";
import HttpClientWrapper from "../../api/http-client-wrapper";
import { SearchPayload } from "./search-payload";

class SearchApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    CreateSearch = async (payload: SearchPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/v1/search/createSearch', payload);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    getSearch = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/search');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getSearchs = async () => {
        try {
            const levelId = 1;
            const response = await this.httpClientWrapper.ALget3(`/api/v1/Search/RecordsCount?name=Parthiban%20N%20G&matching_score=90&uid=0`);
            return response;
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
    getPepSearchDetails = async () => {
        try {
            const response = await this.httpClientWrapper.ALget7('/api/v1/Search');
            console.log("Pepresponse", response)
            return response;

        } catch (error) {
            throw error;
        }
    };

    async getPepHitSearch(searchId: number) {
        try {
            const response = await this.httpClientWrapper.ALget7(`/api/v1/HitRecord/searchId?searchId=${searchId}`);
            console.log("hitresponse", response)
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error response data:', error.response?.data);
                console.error('Error response status:', error.response?.status);
                console.error('Error response headers:', error.response?.headers);
            } else if (error instanceof Error) {
                console.error('Error message:', error.message);
            } else {
                console.error('An unknown error occurred:', error);
            }
            throw error;
        }
    }
    async getPepHitRecordSearch(kycId: number) {
        try {
            const response = await this.httpClientWrapper.ALget7(`/api/v1/EntityScreening?kycId=${kycId}`);
            console.log("hitresponse", response)
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error response data:', error.response?.data);
                console.error('Error response status:', error.response?.status);
                console.error('Error response headers:', error.response?.headers);
            } else if (error instanceof Error) {
                console.error('Error message:', error.message);
            } else {
                console.error('An unknown error occurred:', error);
            }
            throw error;
        }
    }
    async getSanctionHitRecordSearch(kycId: number) {
        try {
            const response = await this.httpClientWrapper.sanctionget(`/api/v1/EntityScreening?kycId=${kycId}`);
            console.log("hitresponse", response)
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error response data:', error.response?.data);
                console.error('Error response status:', error.response?.status);
                console.error('Error response headers:', error.response?.headers);
            } else if (error instanceof Error) {
                console.error('Error message:', error.message);
            } else {
                console.error('An unknown error occurred:', error);
            }
            throw error;
        }
    }

    getCmsSearchDetails = async () => {
        try {
            const response = await this.httpClientWrapper.ALgetCMS('/api/v1/SearchRecord');
            console.log("response", response)
            return response;

        } catch (error) {
            throw error;
        }
    };

    async getCmsHitSearch(searchId: number) {
        try {
            const response = await this.httpClientWrapper.ALgetCMS(`/api/v1/HitRecord/searchId?searchId=${searchId}`);
            console.log("hitresponse", response)
            return response;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error response data:', error.response?.data);
                console.error('Error response status:', error.response?.status);
                console.error('Error response headers:', error.response?.headers);
            } else if (error instanceof Error) {
                console.error('Error message:', error.message);
            } else {
                console.error('An unknown error occurred:', error);
            }
            throw error;
        }
    }
    getStatus = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/Status');
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
    getpepLevelpending = async (id: any) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/FirstlevelPending?id=${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    };
    getfirstlevelsearch = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/Search');
            console.log('firstlevelsearch:', response);
            return response;
        } catch (error) {
            // Handle the error as needed
            throw error;
        }
    }
    async getCriminalHitRecordSearch(kycId: number) {
        try {
            const response = await this.httpClientWrapper.ALgetCMS(`/api/v1/EntityScreening?kycId=${kycId}`);
            console.log("hitresponse", response)
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error response data:', error.response?.data);
                console.error('Error response status:', error.response?.status);
                console.error('Error response headers:', error.response?.headers);
            } else if (error instanceof Error) {
                console.error('Error message:', error.message);
            } else {
                console.error('An unknown error occurred:', error);
            }
            throw error;
        }
    }

}

export default SearchApiService;