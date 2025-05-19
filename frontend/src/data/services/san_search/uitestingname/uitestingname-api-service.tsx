import HttpClientWrapper from '../../../api/http-client-wrapper';
import { multiParaSearchData, SingleRecord } from './uiname_payload';

class UiTestingNameService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getUISearchSinglemultiParaSearchData = async (searchDTO: multiParaSearchData): Promise<SingleRecord[]> => {
        try {
            const response = await this.httpClientWrapper.get(`/api/v1/UiReciveSingleRecordApiResources/UiReciveSingleRecord?name=${searchDTO.name}&dob=${searchDTO.dob}&id=${searchDTO.id}&score=${searchDTO.score}&country=${searchDTO.country}`);
            console.log('API Response1:', response);
            return response;
        } catch (error) {
            console.error('Error fetching records count:', error);
            throw error;
        }
    };

}

export default UiTestingNameService;