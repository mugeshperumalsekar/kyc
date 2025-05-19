import HttpClientWrapper from '../../../api/http-client-wrapper';
import {   uiSearchDtoVerify } from '../viewpage/view_payload';
import { uiReciveTwoPartRecord } from './uitestingtwopart_payload';


class UiTestingTwoPartRecordsService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getUITwoPartRecords = async (searchDTO: uiSearchDtoVerify): Promise<uiReciveTwoPartRecord[]> => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/UiTestApiResources/UiTestPartTwoRecords?firstName=${searchDTO.firstName}&secondName=${searchDTO.secondName}`);
      console.log("getUITwoPartRecords",response)
      return response;
    } catch (error) {
      throw error;
    }
  };

}
export default UiTestingTwoPartRecordsService;
