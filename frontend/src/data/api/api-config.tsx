import axios, { AxiosInstance } from "axios";

class ApiConfig {
    // private basepepURL  = 'http://192.168.1.65:8090';//pep 
    // private baseSecURL  = 'http://192.168.1.65:8093';//cms   
    // private basekycURL  = 'http://192.168.1.65:8094';//kyc
    // private baseamlURL  = 'http://192.168.1.65:8095';//aml
    // private baseURL     = 'http://192.168.1.65:8096';//san 
    // private basebtmsURL = 'http://192.168.1.65:8092';//btms
    // private basegoogleURL = 'http://localhost:8090';//googlesearch

    // private basepepURL  = 'http://localhost:8090';//pep 
    private basepepURL = 'http://localhost:8091';//pep 
    private baseSecURL = 'http://localhost:8093';//cms   
    // private basekycURL = 'http://61.2.136.192:8094';//kyc
    // private basekycURL = 'http://192.168.0.171:8094'; //kyc
    private basekycURL = 'http://localhost:8094';//kyc
    private baseamlURL = 'http://localhost:8095';//aml
    private baseURL = 'http://localhost:8097';//san 
    private basebtmsURL = 'http://localhost:8092';//btms
    private basegoogleURL = 'http://localhost:80901';//googlesearch

    private apiBaseUrl: string;
    private apibaselocalSanURL: string;
    private apibaselocalSanBulkURL: string;
    private apiBaseSecUrl: string;
    private apibaselocalCmsURL: string;
    private apibasepepURL: string;
    private apibaselocalPepURL: string;
    private apibaseamlURL: string;
    private apibasebtmsURL: string;
    private apibasekycURL: string;
    private apibasegooglesearchURL: string;

    constructor() {
        this.apiBaseUrl = this.baseURL;
        this.apibaselocalSanURL = this.baseURL;
        this.apibaselocalSanBulkURL = this.baseURL;
        this.apiBaseSecUrl = this.baseSecURL;
        this.apibaselocalCmsURL = this.baseSecURL;
        this.apibasepepURL = this.basepepURL;
        this.apibaselocalPepURL = this.basepepURL;
        this.apibaseamlURL = this.baseamlURL;
        this.apibasebtmsURL = this.basebtmsURL;
        this.apibasekycURL = this.basekycURL;
        this.apibasegooglesearchURL = this.basegoogleURL;
    }

    private getApiBaseURL = () => {
        return this.apiBaseUrl;
    }

    public getAxiosInstance = () => {
        return axios.create({ baseURL: this.getApiBaseURL() });
    }

    private getApiLocalSanBaseURL = () => {
        return this.apibaselocalSanURL;
    }

    public getAxiosLocalSanInstance = () => {
        return axios.create({ baseURL: this.getApiLocalSanBaseURL() });
    }

    private getApiLocalSanBulkBaseURL = () => {
        return this.apibaselocalSanBulkURL;
    }

    public getAxiosLocalSanBulkInstance = () => {
        return axios.create({ baseURL: this.getApiLocalSanBulkBaseURL() });
    }

    private getApiBaseSecURL = () => {
        return this.apiBaseSecUrl;
    }

    public getAxiosSecInstance = () => {
        return axios.create({ baseURL: this.getApiBaseSecURL() });
    }

    private getApiLocalCmsBaseSecURL = () => {
        return this.apibaselocalCmsURL;
    }

    public getAxiosLocalCmsInstance = () => {
        return axios.create({ baseURL: this.getApiLocalCmsBaseSecURL() });
    }

    private getApiPepBaseSecURL = () => {
        return this.apibasepepURL;
    }

    public getAxiosThrirdInstance = () => {
        return axios.create({ baseURL: this.getApiPepBaseSecURL() });
    }

    private getApiLocalPepBaseSecURL = () => {
        return this.apibaselocalPepURL;
    }

    public getAxiosLocalPepInstance = () => {
        return axios.create({ baseURL: this.getApiLocalPepBaseSecURL() });
    }

    private getApiAmlBaseSecURL = () => {
        return this.apibaseamlURL;
    }

    public getAxiosFourInstance = () => {
        return axios.create({ baseURL: this.getApiAmlBaseSecURL() });
    }

    private getApiBtmsBaseSecURL = () => {
        return this.apibasebtmsURL;
    }

    public getAxiosFifthInstance = () => {
        return axios.create({ baseURL: this.getApiBtmsBaseSecURL() });
    }

    private getApiKYCBaseSecURL = () => {
        return this.apibasekycURL;
    }

    public getAxiosSevenInstance = () => {
        return axios.create({ baseURL: this.getApiKYCBaseSecURL() });
    }

    private getApiGoogleBaseSecURL = () => {
        return this.apibasegooglesearchURL;
    }

    public getAxiosgooleInstance = () => {
        return axios.create({ baseURL: this.getApiGoogleBaseSecURL() });
    }

}

export default ApiConfig;