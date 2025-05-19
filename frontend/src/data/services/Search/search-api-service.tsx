import HttpClientWrapper from "../../api/http-client-wrapper";
import { Regulator } from "./search-payload";

class SearchService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getRegulator = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/Regulator');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getRegulatorList = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/RegulatorList');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getRecoredType = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/RecordType');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getBank = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/Bank');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getState = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/State');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getContactDetails = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/ContactDetails');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getCountryHq = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/CountryHq');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getCustomer = async (cmsId: string) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/DetailSave/GetDetails/${cmsId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  updateQcCustomer = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      console.error('Error updating QC customer:', error);
      throw error;
    }
  };

  updateManagerView = async (cmsId: string, uid: string, statusCall: string) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/TaskReassign/updateEntry/${cmsId}/${uid}/${statusCall}?uid=${uid}&statusCall=${statusCall}`);
      return response;
    } catch (error) {
      console.error('Error updating QC customer:', error);
      throw error;
    }
  };

}

export default SearchService;