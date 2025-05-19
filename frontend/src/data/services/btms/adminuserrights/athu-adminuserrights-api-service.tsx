
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AdminUserRightsPayload } from "./athu-adminuserrights-payload";

class AdminUserRightsApiService {
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    saveAdminUserRights = async (payload: AdminUserRightsPayload[]) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/adminUserRighters/createAdminUserRights', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("AdminUserRightsApiService saveAdminUserRights() error:", error);
            throw error;
        }
    };
    getImage = async (customerId: string, alertId: number) => {
      try {
        const response = await this.httpClientWrapper.getLocalImage(`/api/v1/Document/downloadDocument/${customerId}?alertId=${alertId}`);
        return response;
      } catch (error) {
        console.error("AdminUserRightsApiService getLocalImage() error:", error);
        throw error;
      }
    }
    
      getPDF = async (auditId: number, customerId: number,alertId:number) => {
        try {
          const response: any = await this.httpClientWrapper.getLocalPDF(`/api/v1/Document/downloadDocument/${customerId}?alertId=${alertId}`);
    
          // Check if the 'content-disposition' header is present
          const filename = typeof response === 'object' && response.headers
            ? (response.headers['content-disposition'] || '').split('filename=')[1]
            : 'default_filename.pdf';
    
          return { data: response, filename };
        } catch (error) {
          console.error("AdminUserRightsApiService getPDF() error:", error);
          throw error;
        }
      };

}

export default AdminUserRightsApiService;

