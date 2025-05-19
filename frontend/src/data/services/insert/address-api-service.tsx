import HttpClientWrapper from "../../api/http-client-wrapper";

class AddressApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  saveCustomerRequest = async (
    detailsDTOList: any,
    documentfiles: File[],
    pathId: number,
    imgName: string,
  ) => {
    try {
      const formData = new FormData();
      formData.append('DetailsDTOList', JSON.stringify(detailsDTOList));
      documentfiles.forEach(file => formData.append('documentfiles', file));
      formData.append('pathId', pathId.toString());
      formData.append('imgName', imgName);
      const response = await this.httpClientWrapper.postFormData('/api/v1/DetailSave/CreateDetails', formData);
      return response.data;
    } catch (error) {
      console.error('AddressApiService saveCustomerRequest() error:', error);
      throw error;
    }
  };

}

export default AddressApiService;