
import HttpClientWrapper from '../../../api/http-client-wrapper';
import { Country, RecordDTO, SearchDTO, UiRecordDTO, UiSearchDTO, uiReciveRecord, uiSearchDtoVerify } from './view_payload';
import axios, { AxiosResponse } from 'axios';

class ViewService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getCountryList = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/Country');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getList = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/List');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getProgram = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/SanctionsProgram');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getAll = async () => {
    try {
      const response = await this.httpClientWrapper.ALget('/api/v1/All');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getlookup = async (name: string) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/LookUpResultsApiResources?name=${name}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getAddresses = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/AddressesApiresources?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getAliases = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/AliasesApiResources?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getIdentification = async (id: any) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/IdentificationApiResoures?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching company details:', error);
      throw error;
    }
  };

  getDetails = async (ids: any) => {
    try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/DetailsApiRresources?id=${ids}`);
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
        const response = await this.httpClientWrapper.ALget(`/api/v1/Count/RecordsCount?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}&listId=${searchDTO.listID}&listId=${searchDTO.partySubTypeID}&listId=${searchDTO.countryId}`);
        console.log('API Response:', response); // Log the API response
        return response; // Assuming the response contains an array of RecordDTO objects
    } catch (error) {
        console.error('Error fetching records count:', error);
        throw error;
    }
    
};
getUItect = async (searchDTO: UiSearchDTO): Promise<UiRecordDTO[]> => {
  try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/UiTestApiResources/UiTestRecords?name=${searchDTO.name}&matching_score=${searchDTO.matching_score}`);
      console.log('API Response:', response); // Log the API response
      return response; // Assuming the response contains an array of RecordDTO objects under 'data'
  } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
  }

  
};
getUItectsearch = async (searchDTO: uiSearchDtoVerify): Promise<uiReciveRecord[]> => {
  try {
      const response = await this.httpClientWrapper.ALget(`/api/v1/UiTestApiResources/UiTestAlgorithemRecords?firstName=${searchDTO.firstName}&secondName=${searchDTO.secondName}`);
      console.log('API Response:', response); 
      return response; // Assuming the response contains an array of RecordDTO objects under 'data'
  } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
  }

  
};
getLogicalIdentification = async (Entity_logical_id_Iden:any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/Identification?Entity_logical_id_Iden=${Entity_logical_id_Iden}`);
    console.log('logical:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

getLogicalAddress = async (Entity_logical_id_Addr:any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/Address?Entity_logical_id_Addr=${Entity_logical_id_Addr}`);
    console.log('logicalAddr:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
getLogicaldetails = async (Entity_logical_id: any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/Details?Entity_logical_id=${Entity_logical_id}`);
    console.log('logicaldetails:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};


getLogicalcity = async (Entity_logical_id_citi : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/CityDetails?Entity_logical_id_citi=${Entity_logical_id_citi }`);
    console.log('logicalcity:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
getLogicalBirthDetails = async (Entity_logical_id_birth  : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/BirthDetails?Entity_logical_id_birth=${Entity_logical_id_birth  }`);
    console.log('logicalbirth:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
getLogicalAka = async (Entity_logical_id   : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/AKADetails?Entity_logical_id=${Entity_logical_id}`);
    console.log('logicalAka:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
getGroupAliases= async (Group_ID  : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/AliasesDetails?Group_ID=${Group_ID }`);
    console.log('group:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
getGroupIdentification = async (Group_ID :any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/NameDetails/NationalIdentification?Group_ID=${Group_ID }`);
    console.log('gropid:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

getGroupCityDetails= async (Group_ID  : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/UkDetails/UkCityDetails?Group_ID=${Group_ID }`);
    console.log('group:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};

getUnDetails= async (DATAID : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/UnDetails/UnDetails?DATAID=${DATAID}`);
    console.log('unde:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};


getUnAliases= async (DATAID   : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/UnDetails/UnAliasDetails?DATAID=${DATAID  }`);
    console.log('group:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
getUnDesignationDetailss= async (DATAID   : any) => {
  try {
    // Ensure the URL parameter name matches the backend API expectation
    const response = await this.httpClientWrapper.ALget(`/api/v1/UnDetails/UnDesignationDetails?DATAID=${DATAID  }`);
    console.log('group:', response);
    return response;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
}

export default ViewService;