



import HttpClientWrapper from "../../../api/http-client-wrapper";
import { CompanyDocumentsData } from "./ddressdto-payload";
interface MultipartFile {
  name: string;
  size: number;
  type: string;
}
class AddressApiService {
  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  saveCustomerRequest = async (
    pepDetailsWriteDTO: any,

    files: File[],
    pathIds: number[],

    files1: File[],
    pathIds1: number[],

    files2: File[],
    pathIds2: number[],

    files3: File[],
    pathIds3: number[],

    // files4: File[],
    // pathIds4: number[],

    companyfiles: File[],
    companyfilesPathId: number[],
    cinfcrn: string[]




  ) => {
    try {
      const formData = new FormData();
      formData.append('PepDetailsWriteDTO', JSON.stringify(pepDetailsWriteDTO));

      // Append files for the first set if available
      // Append files for the first set if available
    // Append files for the first set
if (files && files.length > 0) {
  files.forEach((file, index) => {
      if (file) { // Check if 'file' is not null
          formData.append('files', file);
          formData.append('pathIds', String(pathIds[index])); // Convert number to string
      }
  });
}


      // Append files for the second set if available
      if (files1 && files1.length > 0) {
        files1.forEach((file1, index) => {
          formData.append('files1', file1);
          formData.append('pathIds1', String(pathIds1[index])); // Convert number to string
        });
      }

      // Append files for the third set if available
      if (files2 && files2.length > 0) {
        files2.forEach((file2, index) => {
          formData.append('files2', file2);
          formData.append('pathIds2', String(pathIds2[index])); // Convert number to string
        });
      }
      if (files3 && files3.length > 0) {
        files3.forEach((file3, index) => {
          formData.append('files3', file3);
          formData.append('pathIds3', String(pathIds3[index])); // Convert number to string
        });
      }
      // if (files4 && files4.length > 0) {
      //   files4.forEach((file4, index) => {
      //     formData.append('files4', file4);
      //     formData.append('pathIds4', String(pathIds4[index])); // Convert number to string
      //   });
      // }

      // Append company files if available
      if (companyfiles && companyfiles.length > 0) {
        companyfiles.forEach((file, index) => {
          formData.append('companyfiles', file);
          formData.append('companyfilesPathId', String(companyfilesPathId[index]));
          formData.append('cinfcrn', String(cinfcrn[index]));

        })

      }

      console.log('FormData:', formData);

      const response = await this.httpClientWrapper.postFormData(
        '/api/v1/CustomerSave/CreateCustomerDetails',
        formData
      );

      console.log('Response data:', response?.data);

      return response?.data;

    } catch (error) {
      console.error('AddressApiService saveCustomerDetails() error:', error);
      throw error;
    }
  };



  async getFileType() {
    const url = '/api/v1/FileUpload/fileget';
    try {
      const response = await this.httpClientWrapper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  getImage = async (pathId: number, pepId: number) => {
    try {
      const response = await this.httpClientWrapper.getLocalImagepep(`/api/v1/FileUpload/downloadFile/${pepId}?pathId=${pathId}`);
      //  console.log("LocalImage:", response);
      return response;
    } catch (error) {
      console.error("AddressApiService getLocalImage() error:", error);
      throw error;
    }
  }
  getImagecomapny = async (pathId: number, companyId : number) => {
    try {
      const response = await this.httpClientWrapper.getLocalImage(`/api/v1/FileUpload/downloadcompanyFile/${companyId }?pathId=${pathId}`);
      //  console.log("LocalImage:", response);
      return response;
    } catch (error) {
      console.error("AddressApiService getLocalImage() error:", error);
      throw error;
    }
  }
  getImages = async (pathId: number, pepId: number, fileType: string, associatedCompaniesId: number) => {
    try {
      // Assuming you have an appropriate API endpoint in your httpClientWrapper
      const response = await this.httpClientWrapper.getLocalImage(`/api/v1/downloadSavedFile/${fileType}/${pathId}/${pepId}/${associatedCompaniesId}`);
      return response;
    } catch (error) {
      console.error("AddressApiService getImages() error:", error);
      throw error;
    }
  };



  getPDF = async (pathId: number, pepId: number) => {
    try {
      const response: any = await this.httpClientWrapper.getLocalPDFpep(`/api/v1/FileUpload/downloadFile/${pepId}?pathId=${pathId}`);

      // Check if the 'content-disposition' header is present
      const filename = typeof response === 'object' && response.headers
        ? (response.headers['content-disposition'] || '').split('filename=')[1]
        : 'default_filename.pdf';

      return { data: response, filename };
    } catch (error) {
      console.error("AddressApiService getPDF() error:", error);
      throw error;
    }
  };
  getCompanyImage = async (pathId: number, companyId: number) => {
    try {
      const companyId='9'
      const response = await this.httpClientWrapper.getLocalImage(`/api/v1/FileUpload/downloadcompanyFile/${companyId}?pathId=${pathId}`);
      return response;
    } catch (error) {
      console.error("AddressApiService getCompanyImage() error:", error);
      throw error;
    }
  };
  getCompanyPDF = async (pathId: number, companyId: number) => {
    try {
      const response: any = await this.httpClientWrapper.getLocalPDF(`/api/v1/FileUpload/downloadFile/${companyId}?pathId=${pathId}`);

      // Check if the 'content-disposition' header is present
      const filename = typeof response === 'object' && response.headers
        ? (response.headers['content-disposition'] || '').split('filename=')[1]
        : 'default_filename.pdf';

      return { data: response, filename };
    } catch (error) {
      console.error("AddressApiService getPDF() error:", error);
      throw error;
    }
  };
  getDocumentImage = async (companyId: number,imageName:string,pathId:number) => {
    try {
      const response = await this.httpClientWrapper.getLocalImagepep(`/api/v1/FileUpload/downloadCompanyFile/${companyId}?imageName=${imageName}&pathId=${pathId}`);
      //  console.log("LocalImage:", response);
      return response;
    } catch (error) {
      console.error("AddressApiService getLocalImage() error:", error);
      throw error;
    }
  }



  blockDocumentImage  = async (id: number,payload: CompanyDocumentsData ) => {
    try {
      const response = await this.httpClientWrapper.put(`/api/v1/CompanyDocuments/DocumentBlock/${id}`, payload);
      const data = response.data;
        console.log("Response data:", data);
        return data;
    } catch (error) {
        console.error("AddressApiService blockState() error:", error);
        throw error;
    }
}

//   getDocumentType = async (companyId: number) => {
//     try {
//       const response = await this.httpClientWrapper.getLocalImage(`/api/v1/GetDocumentType/${companyId}`);
//       //  console.log("LocalImage:", response);
//       return response;
//     } catch (error) {
//       console.error("AddressApiService getLocalImage() error:", error);
//       throw error;
//     }
//   }
// }
getDocumentType = async (companyId: number,pathId:number) => {
  try {
    const response = await this.httpClientWrapper.getLocalImagepep(`/api/v1/GetDocumentType?companyId=${companyId}&pathId=${pathId}`);
    
    // Assuming the response is expected to be JSON, convert ArrayBuffer to string and then parse JSON
    const responseText = new TextDecoder().decode(response);
    const jsonResponse = JSON.parse(responseText);
  

    console.log("LocalImage Response:", jsonResponse); // Log the entire response for debugging
    return jsonResponse;
  } catch (error) {
    console.error("AddressApiService getDocumentType() error:", error);
    throw error;
  }
}


}

export default AddressApiService;




