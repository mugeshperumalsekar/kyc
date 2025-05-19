import HttpClientWrapper from "../../api/http-client-wrapper";

class AuthConfigModuleModuleDetApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getConfigModuleModuleDet = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/configmodulemoduledet');
            return response;
        } catch (error) {
            throw error;
        }
    };
    
}

export default AuthConfigModuleModuleDetApiService;
