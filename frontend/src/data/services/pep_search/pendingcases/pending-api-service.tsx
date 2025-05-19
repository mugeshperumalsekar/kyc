import HttpClientWrapper from "../../../api/http-client-wrapper";
import { PindingcasesPayload } from "./pending-payload";

class PendingcasesApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    CreatePendingcases = async (payload: PindingcasesPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/v1/pendingcase/insert', payload);
            return response;
        } catch (error) {
            console.error("PendingcasesApiService CreatePendingcases() error:", error);
        }
    };

    CreateCaseLifeCycleImplInsert = async (payload: PindingcasesPayload) => {
        try {
            const response = await this.httpClientWrapper.ALpost3('/api/insert/CaseLifeCycleImpl', payload);
            return response;
        } catch (error) {
            console.error("HitcaseApiService CreateCaseLifeCycleImplInsert() error:", error);
        }
    };

    getPendingcases = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/pendingcase/l3PendingCase');
            return response;
        } catch (error) {
            console.log("Error fetching the getPendingCases:", error);
        }
    };

    getPendingcaseRIF = async () => {
        try {
            const response = await this.httpClientWrapper.ALget3('/api/v1/pendingcase/l4PendingCase');
            return response;
        } catch (error) {
            console.log("Error fetching the getPendingCaseRIF:", error);
        }
    };

    getLevelOneRemark = async (criminalId: number, hitdataId: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelOneRemark?criminalId=${criminalId}&hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getLevelOneRemark:", error);
        }
    };

    getLevelOneRemarkRfi = async (criminalId: number, hitdataId: number, levelId: number, statusId: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/LevelOneRemark?criminalId=${criminalId}&hitdataId=${hitdataId}&levelId=${levelId}&statusId=${statusId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getLevelOneRemarkRfi:", error);
        }
    };

    getRemarkDetails = async (hitdataId: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/RemarksDetails?hitdataId=${hitdataId}`);
            return response;
        } catch (error) {
            console.log("Error fetching the getRemarkDetails:", error);
        }
    };

}

export default PendingcasesApiService;