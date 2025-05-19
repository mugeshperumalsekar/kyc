import { AxiosError } from "axios";
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { KycCriminalSearchDetails, KycSanSearchDetails, } from "./document_payload";
import { KycSearchDetails } from "../../kyc/document/Document_payload";

class DocumentApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getStatus = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Status');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getSanSearch = async () => {
        try {
            const response = await this.httpClientWrapper.sanctionget('/api/v1/search');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getpepSearchResult = async () => {
        try {
            const response = await this.httpClientWrapper.Alget('/api/v1/SearchResult');
            return response;
        } catch (error) {
            throw error;
        }
    };

    getsanSearchResult = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/search');
            return response;
        } catch (error) {
            throw error;
        }
    };

    async getSanHitSearch(searchId: number) {
        try {
            const response = await this.httpClientWrapper.sanctionget(`/api/v1/HitRecord/searchId?searchId=${searchId}`);
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
    };

    uploadFiles = async (files: File[], kycId: number, pathIds: number[], isChecked: number[]) => {
        console.log('Starting file upload');
        const formData = new FormData();
        for (let file of files) {
            console.log(`Appending file: ${file.name}`);
            formData.append('files', file);
        }
        formData.append('kycId', String(kycId));
        formData.append('pathId', pathIds.join(','));
        formData.append('isChecked', isChecked.join(','));
        console.log('FormData prepared', formData);
        try {
            const response = await this.httpClientWrapper.postFormDatas('/api/v1/AlgorithamFileUpload/files/upload', formData);
            console.log('Upload response received', response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    };

    getPDF = async (pathId: number, kycId: number, imageName: string) => {
        try {
            const response: any = await this.httpClientWrapper.getLocalPDF(`/api/v1/FileUpload/downloadCompanyFile/${kycId}?imageName=${imageName}&pathId=${pathId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            return { data: response, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

    getName = async (kycId: number) => {
        try {
            const response = await this.httpClientWrapper.kycget(`/api/v1/NameSearch/KycFormNameSearch/${kycId}?kycId=${kycId}`);
            console.log("responseget", response);
            return response;
        } catch (error) {
            console.error('Error in getName:', error);
            throw error;
        }
    };

    getFilepath = async (kycId: number) => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/AlgorithamFileUpload/getId/${kycId}`);
            console.log("responseFilepath", response);
            return response;
        } catch (error) {
            console.error('Error in getFilepath:', error);
            throw error;
        }
    };

    async getFiles(imgId: number, pathId: number) {
        try {
            const response = await this.httpClientWrapper.getLocalImage(`/api/v1/AlgorithamFileUpload/downloadFiles/${imgId}/${pathId}`);
            console.log("responseFile", response);
            return response;
        } catch (error) {
            console.error('Error in getFiles:', error);
            throw error;
        }
    };

    createKycDetails = async (data: KycSearchDetails[]) => {
        try {
            const screeningDto = {
                screenDTOList: data.map(item => ({
                    name: item.screenDTO.name,
                    searchingScore: item.screenDTO.searchingScore,
                    kycId: item.screenDTO.kycId,
                    applicantFormId: item.screenDTO.applicantFormId,
                    screeningType: item.screenDTO.screeningType,
                    uid: item.screenDTO.uid,
                    isScreening: 1
                }))
            };
            const params = new URLSearchParams();
            params.append('ScreeningDto', JSON.stringify(screeningDto));
            console.log('Requesting API with parameters:', params.toString());
            const response = await this.httpClientWrapper.ALpostScreening(
                `/api/v1/Search/Screening?${params.toString()}`,
                screeningDto
            );
            console.log('API Response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching records count:', error);
            throw error;
        }
    };

    createKycDetailsSan = async (data: KycSanSearchDetails[]) => {
        try {
            console.log('Sending data:', data);
            const response = await this.httpClientWrapper.sanpost('/api/v1/excel/saveScreeningData', data);
            console.log('Response:', response);
            return response;
        } catch (error) {
            console.error('Error details:', error);
            throw error;
        }
    };

    createKycDetailsCriminal = async (data: KycCriminalSearchDetails[]) => {
        try {
            const screeningDto = {
                searchDto: data.map(item => ({
                    name: item.searchDTO.name,
                    searchingScore: item.searchDTO.searchingScore,
                    recordTypeId: item.searchDTO.recordTypeId,
                    kycId: item.searchDTO.kycId,
                    applicantFormId: item.searchDTO.applicantFormId,
                    screeningType: item.searchDTO.screeningType,
                    uid: item.searchDTO.uid,
                    isScreening: 1
                }))
            };
            const params = new URLSearchParams();
            params.append('ScreeningDto', JSON.stringify(screeningDto));
            console.log('Requesting API with parameters:', params.toString());
            const response = await this.httpClientWrapper.ALget(`/api/v1/ScreeningRecords/Screening?${params.toString()}`);
            console.log('API Response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching records count:', error);
            throw error;
        }
    };

    createKycDetailsSanction = async (data: KycSanSearchDetails[]) => {
        try {
            console.log('Sending data:', data);
            const response = await this.httpClientWrapper.sanpost('/api/v1/excel/saveScreeningData', data);
            console.log('Response:', response);
            return response;
        } catch (error) {
            console.error('Error details:', error);
            throw error;
        }
    };

    getScreenedDataPep = async (kycId: number) => {
        try {
            const response = await this.httpClientWrapper.ALget3(`/api/v1/NameSearch/KycFormNameSearch/${kycId}?kycId=${kycId}`);
            console.log("responseScreenedget", response);
            return response;
        } catch (error) {
            console.error('Error in getName:', error);
            throw error;
        }
    };

    getScreenedDataCriminal = async (kycId: number) => {
        try {
            const response = await this.httpClientWrapper.ALgetCMS(`/api/v1/NameSearch/KycFormNameSearch/${kycId}?kycId=${kycId}`);
            console.log("responseCriminialScreenedget", response);
            return response;
        } catch (error) {
            console.error('Error in getName:', error);
            throw error;
        }
    };

    getScreenedDataSanction = async (kycId: number) => {
        try {
            const response = await this.httpClientWrapper.sanctionget(`/api/v1/NameSearch/KycFormNameSearch/${kycId}?kycId=${kycId}`);
            console.log("responseSanctionScreenedget", response);
            return response;
        } catch (error) {
            console.error('Error in getName:', error);
            throw error;
        }
    };
};

export default DocumentApiService;