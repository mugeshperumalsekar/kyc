
import HttpClientWrapper from "../../../api/http-client-wrapper";
import { RecordDTO, RequestDescription, RequestForUpdate, SearchDTO } from "./viewpagedetails-payload";
// import { PepDetailsReadDTO } from './viewpagedetails-payload';

class ViewPageDetailsService {
  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }
  //1
  getcustomer = async (pepId: string) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}`);
      console.log("GetAssociatedCompaniesRequest" + response)
      return response;
    } catch (error) {
      throw error;
    }
  }
  getCompany = async (din: string) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`api/v1/CompanyGet?din=${din}`);
      console.log('response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  }
  getdincompany = async (din: string) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/CompanyGet/dinCompanyGet?din=${din}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  getPartyList = async (pepId: number) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/PartyDTO/getPartyDetails/{pepId}?pepId=${pepId}`);
      console.log("party", response);
      return response;
    } catch (error) {
      console.error('HttpClientWrapper get() error===', error);
      throw error;
    }
  }
  // getCompany = async (din: string) => {
  //   try {
  //     const response = await this.httpClientWrapper.get(`api/v1/CompanyGet?din=${din}`);
  //     console.log('response:', response);
  //     return response;
  //   } catch (error) {
  //     console.error('Error fetching company details:', error);
  //     throw error;
  //   }
  // }


  // updateQcCustomer = async (pepId: string, uid: string, statusCall: string) => {
  //   try {
  //     const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  updateQcCustomer = async (pepId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  updateEntry = async (pepId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateQcManager = async (pepId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateManagerApprove = async (pepId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  saveRequestForUpdate = async (payload: RequestForUpdate) => {
    try {
      const response = await this.httpClientWrapper.post('/api/v1/RequestForUpdate/CreateRequestForUpdateRequest', payload);
      const successMessage = response.successMessage;
      return successMessage;
    } catch (error) {
      console.error("saveRequestForUpdate error:", error);
      throw error;
    }
  };

  saveRequestDescription = async (payload: RequestDescription) => {
    try {
      const response = await this.httpClientWrapper.post('/api/v1/RequestDescription/CreateRequestDescription', payload);
    } catch (error) {
      throw error;
    }
  }

  getCustomerList = async () => {
    try {
      const response = await this.httpClientWrapper.ALget3('/api/v1/Customer');
      return response;
    } catch (error) {
      throw error;
    }
  }

  getRelative = async () => {
    try {
      const response = await this.httpClientWrapper.ALget3('/api/v1/ConfigRelative');
      return response;
    } catch (error) {
      throw error;
    }
  };
  closeManagerView = async (pepId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  updateClose = async (pepId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${pepId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  updateBlock = async (pepId: string, pathId: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/FileUpload/blockDocument?pepId=${pepId}&pathId=${pathId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  getPan = async (pan: string) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/PanApi?pan=${pan}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  }
  //seacrhpep
  getsearchDTOpep = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/Search/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}`);
      console.log('API Response:', response); // Log the API response
      return response; // Assuming the response contains an array of RecordDTO objects
    } catch (error) {
      console.error('Error fetching records count:', error);
      throw error;
    }

  };

}

export default ViewPageDetailsService;



