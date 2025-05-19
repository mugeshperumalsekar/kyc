

import HttpClientWrapper from '../../api/http-client-wrapper';
import { Country, RecordDTO, SearchDTO, UiRecordDTO, UiSearchDTO, uiReciveRecord, uiSearchDtoVerify,SanctionSearchData } from './view_payload';
import axios, { AxiosResponse } from 'axios';
import { format } from 'date-fns';

class ViewService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getCountryList = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/Country');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getList = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/List');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getProgram = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/SanctionsProgram');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getAll = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/All');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getlookup = async (name: string) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/LookUpResultsApiResources?name=${name}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getAddresses = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/AddressesApiresources?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getAliases = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/AliasesApiResources?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getIdentification = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/IdentificationApiResoures?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getDetails = async (ids: any) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/DetailsApiRresources?id=${ids}`);
      console.log('response:', response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // getRecordsCount = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
  //   try {
  //     const response = await this.httpClientWrapper.get(`/api/v1/Count/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}`);
  //     console.log('API Response:', response);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching records count:', error);
  //     throw error;
  //   }
  // };
  getRecordsCount = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
    try {
        const response = await this.httpClientWrapper.get(`/api/v1/Count/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}&listId=${searchDTO.listID}&listId=${searchDTO.partySubTypeID}&listId=${searchDTO.countryId}`);
        console.log('API Response:', response); // Log the API response
        return response; // Assuming the response contains an array of RecordDTO objects
    } catch (error) {
        console.error('Error fetching records count:', error);
        throw error;
    }
    
};
getUItect = async (searchDTO: UiSearchDTO): Promise<UiRecordDTO[]> => {
  try {
      const response = await this.httpClientWrapper.get(`/api/v1/UiTestApiResources/UiTestRecords?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}`);
      console.log('API Response:', response); // Log the API response
      return response; // Assuming the response contains an array of RecordDTO objects under 'data'
  } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
  }

  
};
getUItectsearch = async (searchDTO: uiSearchDtoVerify): Promise<uiReciveRecord[]> => {
  try {
      const response = await this.httpClientWrapper.get(`/api/v1/UiTestApiResources/UiTestAlgorithemRecords?firstName=${searchDTO.firstName}&secondName=${searchDTO.secondName}`);
      console.log('API Response:', response); 
      return response; // Assuming the response contains an array of RecordDTO objects under 'data'
  } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
  }

  
};
async getCustomDate(startDate: Date, endDate: Date): Promise<SanctionSearchData[]> {
  try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const response = await this.httpClientWrapper.get(`/api/v1/search/Search?fromDate=${formattedStartDate}&toDate=${formattedEndDate}`);
      console.log('API Response:', response);
     
      return response;
  } catch (error: any) {
      if (error.response) {
          console.error('Request failed with status code:', error.response.status);
          console.error('Response data:', error.response.data);
      } else if (error.request) {
          console.error('No response received. Request made but no response.');
      } else {
          console.error('Error setting up the request:', error.message);
      }
      throw new Error(`Error in API request: ${error}`);
  }
}



}

export default ViewService;