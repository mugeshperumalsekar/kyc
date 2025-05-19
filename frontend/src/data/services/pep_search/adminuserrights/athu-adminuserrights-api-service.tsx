
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AdminUserRightsPayload } from "./athu-adminuserrights-payload";

class AdminUserRightsApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    saveAdminUserRights = async (payload: AdminUserRightsPayload[]) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/v1/adminUserRighters/createAdminUserRights', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminUserRightsApiService saveAdminUserRights() error:", error);
            throw error;
        }
    };

    getUserAccess = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/adminUserRighters');
            return response;
        } catch (error) {
            throw error;
        }
    };

    blockUser = async (id: string) => {
        try {
            const response = await this.httpClientWrapper.ALput3(`/api/v1/adminUserRighters/${id}/block`);
            return response;
        } catch (error) {
            console.error("Block User error:", error);
        }
    };

}

export default AdminUserRightsApiService;