import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { AdmingroupPayload } from "./admingroup_payload";

class AdmingroupApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    doMasterAdmingroup = async (payload: AdmingroupPayload) => {
        console.log("AdmingroupApiService doMasterRelativeType() start = " + JSON.stringify(payload));
        try {
            const response = await this.httpClientWrapper.post('/api/v1/admingroup/createAdmingroup', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdmingroupApiService doMasterRelativeType() error:", error);
            throw error;
        }
    }

    getAdmingroup = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/admingroup');
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default AdmingroupApiService;
