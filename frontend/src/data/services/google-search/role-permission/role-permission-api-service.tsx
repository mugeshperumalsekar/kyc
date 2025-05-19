
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RolePermissionRequest } from "./role-permission-payload";

class RolePermissionApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    saveRolePermissions = async (payload: RolePermissionRequest[]) => {
        try {
            const response = await this.httpClientWrapper.googlepost('/api/v1/rolepermissions', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RolePermissionApiService saveRolePermissions() error:", error);
            throw error;
        }
    };

    updateRolePermissions = async (roleId:any, payload: RolePermissionRequest[]) => {
        try {
            const response = await this.httpClientWrapper.googleput(`/api/v1/rolepermissions/${roleId}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("RolePermissionApiService updateRolePermissions() error:", error);
            throw error;
        }
    };

    fetchAllRolePermissionsByRoleId = async (roleId:any) => {
        try {
            const response = await this.httpClientWrapper.googleget(`/api/v1/rolepermissions/${roleId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    accessPermission = async (roleId:any) => {
        try {
            const response = await this.httpClientWrapper.googleget(`/api/v1/rolepermissions/sidenav/${roleId}`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    
}

export default RolePermissionApiService;