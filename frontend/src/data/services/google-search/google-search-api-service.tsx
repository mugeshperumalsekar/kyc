import HttpClientWrapper from "../../api/http-client-wrapper";

class GoogleSearchApiService {
    
    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    };

    googleSearch = async (qry:any, qryParamRequest:any) => {
        try {
            const response = await this.httpClientWrapper.googlepost(`/api/v1/googleSearch?q=${qry}`, qryParamRequest);
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default GoogleSearchApiService;