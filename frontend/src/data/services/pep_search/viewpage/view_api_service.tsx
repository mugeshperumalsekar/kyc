import HttpClientWrapper from '../../../api/http-client-wrapper';
import { RecordDTO, SearchDTO, UiRecordDTO, UiSearchDTO, uiReciveRecord, uiSearchDtoVerify } from './view_payload';

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
      const response = await this.httpClientWrapper.ALget3('/api/v1/SanctionsProgram');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getStatus = async () => {
    try {
      const response = await this.httpClientWrapper.ALget3('/api/v1/Status');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getAll = async () => {
    try {
      const response = await this.httpClientWrapper.ALget3('/api/v1/All');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getlookup = async (name: string) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/LookUpResultsApiResources?name=${name}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getAddresses = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/AddressesApiresources?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getAliases = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/AliasesApiResources?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getIdentification = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/IdentificationApiResoures?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getDetails = async (ids: any) => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/DetailsApiRresources?id=${ids}`);
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
  // getsearchDTOpep = async (searchDTO: SearchDTO): Promise<RecordDTO[]> => {
  //   try {
  //       // Construct the URL
  //       const url = `/api/v1/Search/RecordsCount`;

  //       // Construct the request body
  //       const requestBody = {
  //           name: searchDTO.name,
  //           matching_score: searchDTO.matching_score,
  //           uid:searchDTO.uid
  //       };

  //       // Make the POST request with the URL and request body
  //       const response = await this.httpClientWrapper.ALpost3(url, requestBody);
  //       console.log('API Response:', response); // Log the API response
  //       return response; // Assuming the response contains an array of RecordDTO objects
  //   } catch (error) {
  //       console.error('Error fetching records count:', error);
  //       throw error;
  //   }
  // };

  getsearchDTOpep = async (data: SearchDTO[]): Promise<RecordDTO[]> => {
    try {
      const screeningDto = {
        screenDTOList: data.map(item => ({
          name: item.name,
          searchingScore: item.searchingScore,
          kycId: item.kycId,
          applicantFormId: item.applicantFormId,
          screeningType: item.screeningType,
          uid: item.uid,
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

  getUItect = async (searchDTO: UiSearchDTO): Promise<UiRecordDTO[]> => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/UiTestApiResources/UiTestRecords?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}`);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  };

  getUItectsearch = async (searchDTO: uiSearchDtoVerify): Promise<uiReciveRecord[]> => {
    try {
      const response = await this.httpClientWrapper.ALget3(`/api/v1/UiTestApiResources/UiTestAlgorithemRecords?firstName=${searchDTO.firstName}&secondName=${searchDTO.secondName}`);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  };

}

export default ViewService;