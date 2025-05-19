import HttpClientWrapper from '../../../api/http-client-wrapper';
import { uiReciveCountryRecord } from '../../viewpage/view_payload';
import { uiCountryDtoVerify } from './uicountry_payload';

class UiTestingCountryService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getUICountry = async () => {
    try {
      const response = await this.httpClientWrapper.get('/api/v1/UiTestApiResources/getFlechcountry');
      return response;
    } catch (error) {
      throw error;
    }
  };

  getUISearchMultiParaRecords = async (searchDTO: uiCountryDtoVerify): Promise<uiReciveCountryRecord[]> => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/UiReciveSingleRecordApiResources/calculateScorestestingService?entityType=${searchDTO.entityType}&name1=${searchDTO.name1}&name2=${searchDTO.name2}&id1=${searchDTO.id1}&id2=${searchDTO.id2}&country1=${searchDTO.country1}&country2=${searchDTO.country2}&dob1=${searchDTO.dob1}&dob2=${searchDTO.dob2}`);
      return response;
    } catch (error) {
      console.error('Error getting the getUISearchMultiParaRecords:', error);
      throw error;
    }
  };

}

export default UiTestingCountryService;