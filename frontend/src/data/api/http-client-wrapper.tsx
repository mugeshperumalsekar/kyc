import ApiConfig from "./api-config";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from 'react-toastify';
import StorageService from "../storage/storage-service";

class HttpClientWrapper {

  private axiosClient: AxiosInstance;
  private axiosClient2: AxiosInstance;
  private axiosClient3: AxiosInstance;
  private axiosClient4: AxiosInstance;
  private axiosClient5: AxiosInstance;
  private axiosClient6: AxiosInstance;
  private axiosClient7: AxiosInstance;
  private axiosClient8: AxiosInstance;
  private axiosClient9: AxiosInstance;
  private axiosClient10: AxiosInstance;
  private axiosClient11: AxiosInstance;

  constructor() {
    this.axiosClient = new ApiConfig().getAxiosInstance();//san
    this.axiosClient2 = new ApiConfig().getAxiosSecInstance();//cms
    this.axiosClient3 = new ApiConfig().getAxiosThrirdInstance();//pep
    this.axiosClient4 = new ApiConfig().getAxiosFourInstance();//aml
    this.axiosClient5 = new ApiConfig().getAxiosFifthInstance();//btms
    this.axiosClient6 = new ApiConfig().getAxiosSevenInstance();//kyc
    this.axiosClient7 = new ApiConfig().getAxiosLocalPepInstance();//pep_local
    this.axiosClient8 = new ApiConfig().getAxiosLocalCmsInstance();//cms_local
    this.axiosClient9 = new ApiConfig().getAxiosLocalSanInstance();//san_local
    this.axiosClient10 = new ApiConfig().getAxiosLocalSanBulkInstance();//san_local_bulk
    this.axiosClient11 = new ApiConfig().getAxiosgooleInstance();//google search
  }

  public ALpost = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient2.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public post = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public ALget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient2.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public ALget3 = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient6.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };
  public Alget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient3.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };


  public ALpost3 = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient3.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public ALput3 = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient3.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public get = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public getbulk = async (path: string): Promise<any> => {
    console.log(`HttpClientWrapper get() start path = ${path}`);
    try {
      const response = await this.axiosClient10.get(path, this.getJsonHeaderConfig());
      console.log(`HttpClientWrapper get() response data = ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (err: any) {
      console.error(`HttpClientWrapper get() error = ${JSON.stringify(err)}`);
      throw err;
    }
  };

  public gets = async (path: string, config?: AxiosRequestConfig) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      const mergedConfig = { ...this.getJsonHeaderConfig(), ...config };
      let response: any = await this.axiosClient.get(path, mergedConfig);
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public put = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public ALput = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public delete = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "");
    try {
      let response: any = await this.axiosClient.delete(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper delete() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper delete() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper delete() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public postFormData = async (path: string, formData: FormData) => {
    console.log("HttpClientWrapper post() start path = '" + path + "'");
    try {
      let response: any = await this.axiosClient.post(path, formData, this.getFormDataHeaderConfig());
      console.log("HttpClientWrapper post() end path = '" + path + "'");
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper post() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  public putFormData = async (path: string, formData: FormData) => {
    console.log("HttpClientWrapper post() start path = '" + path + "'");
    try {
      let response: any = await this.axiosClient.put(path, formData, this.getFormDataHeaderConfig());
      console.log("HttpClientWrapper post() end path = '" + path + "'");
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper post() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  public pute = async (url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return await this.axiosClient.put(url, data, config);
  };

  async gete(url: string, config: any): Promise<any> {
    try {
      const response = await this.axiosClient.get(url, config);
      return response;
    } catch (error) {
      throw new Error('Request failed');
    }
  };

  getFormDataHeaderConfig = () => {
    return this.getHeaderConfig('multipart/form-data');
  };

  getHeaderConfig = (contentType: string) => {
    let headers: any = {};
    headers['Content-Type'] = contentType;
    let token = StorageService.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    return { headers: headers }
  };

  getJsonHeaderConfig = () => {
    return this.getHeaderConfig('application/json');
  };

  public getLocalImage = async (path: string) => {
    console.log("HttpClientWrapper getLocalImage() start path = " + path);
    try {
      const response: any = await this.axiosClient.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalImage() error: ", err);
      throw err;
    }
  };

  public getLocalImagepep = async (path: string) => {
    console.log("HttpClientWrapper getLocalImage() start path = " + path);
    try {
      const response: any = await this.axiosClient3.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalImage() error: ", err);
      throw err;
    }
  };

  public getLocalImageCms = async (path: string) => {
    console.log("HttpClientWrapper getLocalImage() start path = " + path);
    try {
      const response: any = await this.axiosClient2.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalImage() error: ", err);
      throw err;
    }
  };

  getLocalPDFpep = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient3.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  getLocalPDF = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  getLocalPDFCms = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient2.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const binary = new Uint8Array(buffer);
    const bytes = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = String.fromCharCode(binary[i]);
    }
    return btoa(bytes.join(''));
  };

  //aml
  public amlpost = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient4.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public amlget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient4.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public amlput = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient4.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public amlpostFormData = async (path: string, formData: FormData) => {
    console.log("HttpClientWrapper post() start path = '" + path + "'");
    try {
      let response: any = await this.axiosClient4.post(path, formData, this.getFormDataHeaderConfig());
      console.log("HttpClientWrapper post() end path = '" + path + "'");
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper post() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  //btms
  public ALget5 = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient5.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  //kyc
  public kycgetLocalImage = async (path: string) => {
    console.log("HttpClientWrapper getLocalImage() start path = " + path);
    try {
      const response: any = await this.axiosClient6.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalImage() error: ", err);
      throw err;
    }
  };

  kycgetLocalPDF = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient6.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  getFileHeaderConfig = () => {
    return this.getHeaderConfig('application/octet-stream');
  };

  public kycpost = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient6.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public kycget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient6.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public kycgets = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      const response = await this.axiosClient6.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data:", response.data);
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper get() error:", err);
      throw err;
    }
  };

  public kycput = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient6.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public kycpostFormData = async (path: string, formData: FormData) => {
    console.log("HttpClientWrapper post() start path = '" + path + "'");
    try {
      let response: any = await this.axiosClient6.post(path, formData, this.getFormDataHeaderConfig());
      console.log("HttpClientWrapper post() end path = '" + path + "'");
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper post() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  postFileData = async (path: string, file: File) => {
    console.log("HttpClientWrapper postFileData() start path = '" + path + "'");
    try {
      const headers = this.getFileHeaderConfig();
      let response = await this.axiosClient6.post(path, file, { headers });
      console.log("HttpClientWrapper postFileData() end path = '" + path + "'");
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper postFileData() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  public postFormDatas = async (path: string, formData: FormData) => {
    try {
      let response: any = await this.axiosClient6.post(path, formData, this.getFormDataHeaderConfig());
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper post() error=== " + JSON.stringify(err));
      toast.error(err.response.data.message, { containerId: 'TR' });
      throw err;
    }
  };

  //pep_local
  public ALget7 = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient7.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public ALpostScreening = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient7.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  //cms_local
  public ALgetCMS = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient8.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public ALpost8 = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient8.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  //san_local
  public sanget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient4.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public sanpost = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient9.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public sanctionget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient9.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  //client files
  public getClientLocalImage = async (path: string) => {
    console.log("HttpClientWrapper getLocalImage() start path = " + path);
    try {
      const response: any = await this.axiosClient6.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalImage() error: ", err);
      throw err;
    }
  };

  getClientLocalPDF = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient6.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  //kyc
  getKycLocalPDF = async (path: string) => {
    console.log("HttpClientWrapper getLocalPDF() start path =", path);
    try {
      const response: any = await this.axiosClient6.get(path, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      if (response && response.data) {
        const base64Pdf = this.arrayBufferToBase64(response.data);
        console.log("PDF Data:", base64Pdf);
        return base64Pdf;
      } else {
        console.error("PDF Data is empty.");
        throw new Error("Empty PDF Data");
      }
    } catch (err: any) {
      console.error("HttpClientWrapper getLocalPDF() error:", err);
      throw err;
    }
  };

  //google
  public googlepost = async (path: string, payload: any) => {
    console.log("HttpClientWrapper post() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient11.post(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper post() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper post() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper post() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

  public googleget = async (path: string) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      let response: any = await this.axiosClient11.get(path, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public googlegets = async (path: string, config?: AxiosRequestConfig) => {
    console.log("HttpClientWrapper get() start path = " + path);
    try {
      const mergedConfig = { ...this.getJsonHeaderConfig(), ...config };
      let response: any = await this.axiosClient11.get(path, mergedConfig);
      console.log("HttpClientWrapper get() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper get() end path = " + path);
      return response.data;
    } catch (err: any) {
      console.log("HttpClientWrapper get() error=== " + JSON.stringify(err));
      throw err;
    }
  };

  public googleput = async (path: string, payload?: any) => {
    console.log("HttpClientWrapper put() start path = '" + path + "', payload = " + JSON.stringify(payload));
    try {
      let response: any = await this.axiosClient11.put(path, payload, this.getJsonHeaderConfig());
      console.log("HttpClientWrapper put() response data " + JSON.stringify(response.data.data));
      console.log("HttpClientWrapper put() end");
      return response.data;
    } catch (err: any) {
      console.error("HttpClientWrapper put() error: ", err);
      toast.error(err.response?.data?.message || "An error occurred", { containerId: 'TR' });
      throw err;
    }
  };

}

export default HttpClientWrapper;