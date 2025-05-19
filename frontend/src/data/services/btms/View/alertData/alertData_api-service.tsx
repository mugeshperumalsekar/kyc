
import HttpClientWrapper from "../../../../api/http-client-wrapper";
import { createCustomerRequest } from "./alertData_payload";

class AlertDataApiService {
    private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }


  getAlertData = async (id: number) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/AlertGet/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  getlevle = async () => {
    try {
      const response = await this.httpClientWrapper.ALget5(`/api/v1/LevelGet`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  getTransaction = async () => {
    try {
      const response = await this.httpClientWrapper.ALget5('/api/v1/CustomerGet');
      return response;
  } catch (error) {
      throw error;
  }
  }
  getAuditLog = async () => {
    try {
      const response = await this.httpClientWrapper.ALget5(`/api/v1/CustomerApi/GetAuditLog`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  getTransactiondetails = async (senderCustomer:any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/TransactionGet?senderCustomer=${senderCustomer}`);
      console.log('response:', response);
      return response;
  } catch (error) {
      throw error;
  }
  }
  

  uploadFiles = async (
    commanWriteDTO: any,
    files: File[],
    alertId: number,
    customerId: String,
    imgName: string
) => {
    try {
        const formData = new FormData();
        formData.append('CommanWriteDTO', JSON.stringify(commanWriteDTO));
        files.forEach(file => formData.append('files', file));
        formData.append('alertId', alertId.toString());
        formData.append('customerId', customerId.toString());
        formData.append('imgName', imgName);

        const response = await this.httpClientWrapper.postFormData('/api/v1/CustomerApi/CreateCustomerDetails', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}



  
}

export default AlertDataApiService;
