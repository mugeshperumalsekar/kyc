import HttpClientWrapper from "../../api/http-client-wrapper";
import { RecordDTO, RequestDescription, RequestForUpdate, SearchDTO } from "./viewpagedetails-payload";

class ViewPageDetailsService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getcustomer = async (cmsId: string) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${cmsId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getCompany = async (din: string) => {
    try {
      const response = await this.httpClientWrapper.ALget(`api/v1/CompanyGet?din=${din}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getdincompany = async (din: string) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/CompanyGet/dinCompanyGet?din=${din}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateEntry = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.ALput(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateManagerApprove = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.ALput(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateManagerClose = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.ALput(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateClose = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.ALput(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateQcManager = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.ALput(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  saveRequestForUpdate = async (payload: RequestForUpdate) => {
    try {
      const response = await this.httpClientWrapper.ALpost('/api/v1/RequestForUpdate/CreateRequestForUpdateRequest', payload);
      const successMessage = response.successMessage;
      return successMessage;
    } catch (error) {
      throw error;
    }
  };

  saveRequestDescription = async (payload: RequestDescription) => {
    try {
      const response = await this.httpClientWrapper.ALpost('/api/v1/RequestDescription/CreateRequestDescription', payload);
    } catch (error) {
      throw error;
    }
  };

  getCustomerList = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/Customer');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getRelative = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/ConfigRelative');
      return response;
    } catch (error) {
      throw error;
    }
  };

  closeManagerView = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.ALput(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      throw error;
    }
  };


  getRecordsCountCms = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
    try {
        const screeningDto = {
            searchDto: [
                {
                    name: searchDTO.name,
                    searchingScore: searchDTO.searchingScore,
                    recordTypeId: searchDTO.recordTypeId,
                    kycId: searchDTO.kycId,
                    applicantFormId: searchDTO.applicantFormId,
                    screeningType: searchDTO.screeningType,
                    uid: searchDTO.uid
                }
            ]
        };

        const params = new URLSearchParams();
        params.append('ScreeningDto', JSON.stringify(screeningDto));

        console.log('Requesting API with parameters:', params.toString());

        const response = await this.httpClientWrapper.ALget(`/api/v1/ScreeningRecords/Screening?${params.toString()}`);
        console.log('API Response:', response);
        
        return response; // Return the response data if successful
    }catch (error) {
      console.error('Error fetching records count:', error);
      throw error;
  }
}
}

export default ViewPageDetailsService;