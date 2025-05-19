import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PindingcasesPayload } from "./pending-payload";

class PendingcasesApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePendingcases = async (payload: PindingcasesPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/pendingcase/insert', payload);
            return response;
        } catch (error) {
            console.error("PendingcasesApiService CreatePendingcases() error:", error);
            throw error;
        }
    };

    CreateCaseLifeCycleImplInsert = async (payload: PindingcasesPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/insert/CaseLifeCycleImpl', payload);
            return response;
        } catch (error) {
            console.error("HitcaseApiService CreateCaseLifeCycleImplInsert() error:", error);
            throw error;
        }
    };

    getPendingcases = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/pendingcase/l3PendingCase');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getPendingcaseRIF = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/pendingcase/l4PendingCase');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getRemarkDetails = async (hitdataId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getRemarkDetails:", error);
        }
    };

}

export default PendingcasesApiService;