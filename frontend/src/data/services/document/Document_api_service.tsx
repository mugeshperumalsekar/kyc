import { toast } from "react-toastify";
import HttpClientWrapper from "../../api/http-client-wrapper";

class DocumentApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    saveCustomerRequest = async (
        files: File[], kycId: number, documentTypeId: number, uid: number) => {
        try {
            const formData = new FormData();
            formData.append('PepDetailsWriteDTO', JSON.stringify(files));
            if (files && files.length > 0) {
                files.forEach((file, index) => {
                    if (file) {
                        formData.append('files', file);
                    }
                });
            }
            formData.append('kycId', String(kycId));
            formData.append('documentTypeId', String(documentTypeId));
            formData.append('uid', String(uid));
            const response = await this.httpClientWrapper.postFormData('/api/v1/FileUpload/files/upload', formData);
            return response;
            // return response?.data;
        } catch (error) {
            console.log('Error Uploading the SaveCustomerRequest:', error);
            throw error;
        }
    };

    saveFormCustomerRequest = async (
        files: File[], kycId: number, documentTypeId: number, uid: number) => {
        try {
            const formData = new FormData();
            formData.append('PepDetailsWriteDTO', JSON.stringify(files));
            if (files && files.length > 0) {
                files.forEach((file, index) => {
                    if (file) {
                        formData.append('files', file);
                    }
                });
            }
            formData.append('kycId', String(kycId));
            formData.append('documentTypeId', String(documentTypeId));
            formData.append('uid', String(uid));
            const response = await this.httpClientWrapper.kycpostFormData('/api/v1/FileUpload/files/upload', formData);
            return response?.data;
        } catch (error) {
            throw error;
        }
    };

    getImage = async (kycId: string, documentTypeId: number) => {
        try {
            const response = await this.httpClientWrapper.getLocalImage(`/api/v1/FileUpload/downloadFile/${kycId}/${documentTypeId}`);
            return response;
        } catch (error) {
            console.error("AddressApiService getLocalImage() error:", error);
            throw error;
        }
    };

    getPDF = async (kycId: string, documentTypeId: number) => {
        try {
            const response: any = await this.httpClientWrapper.getLocalPDF(`/api/v1/FileUpload/downloadFile/${kycId}/${documentTypeId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            return { data: response, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

    getkycPDF = async (kycId: string, documentTypeId: number) => {
        try {
            const response: any = await this.httpClientWrapper.getKycLocalPDF(`/api/v1/FileUpload/downloadFile/${kycId}/${documentTypeId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            return { data: response, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

    getPDFf = async (kycId: string, documentTypeId: string) => {
        try {
            const response: any = await this.httpClientWrapper.getLocalPDF(`/api/v1/FileUpload/downloadFile/${kycId}/${documentTypeId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            const blob = new Blob([response.data], { type: 'application/pdf' });
            return { data: blob, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

    getLetterHead = async (branchId: number) => {
        try {
            const response = await this.httpClientWrapper.kycgetLocalImage(`/api/v1/LetterHeadUpload/view/${branchId}`);
            return response;
        } catch (error) {
            console.error("AddressApiService getKycLocalImage() error:", error);
            throw error;
        }
    };

    getClientImage = async (documentTypeId: number, kycId: number) => {
        try {
            const response = await this.httpClientWrapper.getClientLocalImage(`/api/v1/FileUpload/downloadFile/${kycId}/${documentTypeId}`);
            return response;
        } catch (error) {
            console.error("AddressApiService getLocalImage() error:", error);
            throw error;
        }
    };

    getClientPDF = async (documentTypeId: number, kycId: number) => {
        try {
            const response: any = await this.httpClientWrapper.getClientLocalPDF(`/api/v1/FileUpload/downloadFile/${kycId}/${documentTypeId}`);
            const filename = typeof response === 'object' && response.headers
                ? (response.headers['content-disposition'] || '').split('filename=')[1]
                : 'default_filename.pdf';
            return { data: response, filename };
        } catch (error) {
            console.error("AddressApiService getPDF() error:", error);
            throw error;
        }
    };

    saveExcelRequest = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await this.httpClientWrapper.postFormData('/api/v1/excel/tableBulkImport', formData);
            return response?.data;
        } catch (error) {
            throw error;
        }
    };

}

export default DocumentApiService;