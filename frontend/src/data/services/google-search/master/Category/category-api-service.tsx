

import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { CategoryPayload } from "./category-payload"; 

class CategoryApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    createCategory = async (payload: CategoryPayload) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/Category/CreateCategoryRequest', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CategoryApiService createCategory() error:", error);
            throw error;
        }
    };

    // Get all categories
    getCategories = async () => {
        try {
            const response = await this.httpClientWrapper.googleget('/api/v1/Category');
            return response;
        } catch (error) {
            console.error("CategoryApiService getCategories() error:", error);
            throw error;
        }
    };

    // Update a category by id
    updateCategory = async (id: number, payload: CategoryPayload) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/Category/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CategoryApiService updateCategory() error:", error);
            throw error;
        }
    };

    // Block a category by id
    blockCategory = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Category/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CategoryApiService blockCategory() error:", error);
            throw error;
        }
    };

    // Unblock a category by id
    unblockCategory = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Category/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("CategoryApiService unblockCategory() error:", error);
            throw error;
        }
    };
}

export default CategoryApiService;
