import HttpClientWrapper from "../../../api/http-client-wrapper";
import { AmlComplaintDto, AmlComplaintStatus, Branchmapping, CounterfeitDto, FraudCommonDTO, FraudUpdateDTO, Remark, RepalywriteDto, ScamUpdateDTO,CounterfeitUpdateDTO } from "./view_payload";



class ViewService {
  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getBranch= async () => {
    try {
      const response = await this.httpClientWrapper.amlget('/api/v1/AmlConfigBranch');
      return response;
    } catch (error) {
      throw error;
    }
  }
  getStatus= async () => {
    try {
      const response = await this.httpClientWrapper.amlget('/api/v1/AmlConfigStatus');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  getScenarios= async () => {
    try {
      const response = await this.httpClientWrapper.amlget('/api/v1/AmlConfigAlertScenarios');
      return response;
    } catch (error) {
      throw error;
    }
  }
 
  post = async (amlComplaintDto: AmlComplaintDto) => {
    try {
      const response = await this.httpClientWrapper.amlpost('/api/v1/AmlComplaintTeam/createAmlComplaint', amlComplaintDto);
      console.log('response:', response); 
      return response;
    } catch (error) {
      throw error;
    }
  }
  Editpost = async (compId: string, euid: number,amlComplaintDto: AmlComplaintDto) => {
    try {
        const response = await this.httpClientWrapper.amlput(`/api/v1/AmlComplaintTeam/updateAmlTeamComplaint?compId=${compId}&euid=${euid}`, amlComplaintDto);
        console.log('response:', response);
        return response;
    } catch (error) {
        console.error("AdminUserApiService updateAdminUser() error:", error);
        throw error;
    }
}

  // getAmlCompleteTeam = async (complaintId:any) => {
  //   try {
  //     const response = await this.httpClientWrapper.get(`/api/v1/AmlCompleteTeamApiResources/CompleteTeamData?complaintId=${complaintId}`);
  //     console.log('CompleteTeam:', response);
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // };
  getAmlCompleteTeam = async (complaintId: any) => {
    try {
      const response = await this.httpClientWrapper.amlget(`/api/v1/AmlCompleteTeamApiResources/CompleteTeamData?complaintId=${complaintId}`);
      console.log('CompleteTeam:', response);
      return response;
    } catch (error) {
      console.error('Error fetching AML Complete Team data:', error);
      throw error;
    }
  }
  
  
 
  Remarkpost = async (remarkData: RepalywriteDto) => {
    try {
      const response = await this.httpClientWrapper.amlpost('/api/v1/AmlComplaintReply/createReplaySave', remarkData);
      console.log('response:', response); 
      return response;
    } catch (error) {
      throw error;
    }
  }
  // RemarkEdit= async (id: string,remarkData: Remark) => {
  //   try {
  //     const response = await this.httpClientWrapper.put('/api/v1/AmlComplaintRemark/${id}', remarkData);
  //     console.log('response:', response); 
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  RemarkEdit = async (id: string, remarkData: RepalywriteDto) => {
    try {
        const response = await this.httpClientWrapper.amlput(`/api/v1/AmlComplaintRemark/${id}`, remarkData);
        console.log('response:', response);
        return response;
    } catch (error) {
        console.error("AdminUserApiService updateAdminUser() error:", error);
        throw error;
    }
}
AmlComplaintStatus = async (payload: AmlComplaintStatus) => {
  try {
      const response = await this.httpClientWrapper.amlpost(`/api/v1/AmlComplaintStatus/CreateAmlStatusRequest`, payload);
      console.log('response:', response);
      return response;
  } catch (error) {
      console.error("AdminUserApiService updateAdminUser() error:", error);
      throw error;
  }
}
saveBranchmappingRights = async (payload: Branchmapping[]) => {
  try {
      const response = await this.httpClientWrapper.amlpost('/api/v1/BranchUserMappingApiResources/CreateAmlConfigBranchRequest', payload);
      const data = response.data;
      return data;
  } catch (error) {
      console.error("ViewService saveBranchmappingRights() error:", error);
      throw error;
  }
}
getBranchmapping = async () => {
  try {
      const response = await this.httpClientWrapper.amlget('/api/v1/BranchUserMappingApiResources');
      return response;
  } catch (error) {
      throw error;
  }
};
getadminuser = async () => {
  try {
      const response = await this.httpClientWrapper.amlget('/api/v1/users');
      return response;
  } catch (error) {
      throw error;
  }
};

blockUser = async (id: string) => {
  try {
      const response = await this.httpClientWrapper.amlput(`/api/v1/BranchUserMappingApiResources/${id}/block`);
      return response;
  } catch (error) {
      console.error("Block User error:", error);
  }
};

// fraudpost = async (fraudWriteDTO: FraudCommonDTO, ) => {
//   try {
//     const response = await fetch('/api/v1/SaveFraud/CreateFraud', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json' // Specify JSON content type
//       },
//       body: JSON.stringify({ fraudDTO: JSON.stringify(fraudWriteDTO) }) // Stringify the fraudWriteDTO
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save fraud details');
//     }

//     const responseData = await response.json();
//     console.log('response:', responseData);
//     return responseData;
//   } catch (error) {
//     throw error;
//   }
// }
fraudpost = async (
  fraudWriteDTO: any,

) => {
  try {
    const formData = new FormData();
    formData.append('FraudWriteDTO', JSON.stringify(fraudWriteDTO));

    const response = await this.httpClientWrapper.amlpostFormData(
      '/api/v1/SaveFraud/CreateFraud',
      formData
    );
    console.log('Response data:', response?.data);

    return response?.data;

  } catch (error) {
    console.error('AddressApiService fraudpost() error:', error);
    throw error;
  }
};

EditFraud = async (FraudCommon: FraudUpdateDTO, fraudId: string, euid: number) => {
  try {
    const response = await this.httpClientWrapper.amlput(`/api/v1/SaveFraud/UpdateFraud?fraudId=${fraudId}&euid=${euid}`, FraudCommon);
    return response;
  } catch (error) {
    throw error;
  }
};
fraudpostEdit = async (
  FraudDTO: any,
  fraudId:string,
  euid: number

) => {
  try {
    const formData = new FormData();
    formData.append('FraudWriteDTO', JSON.stringify(FraudDTO));

  
    const response = await this.httpClientWrapper.amlput(`/api/v1/SaveFraud/UpdateFraud?fraudId=${fraudId}&euid=${euid}`, formData);

    console.log('Response data:', response?.data);

    return response?.data;

  } catch (error) {
    console.error('AddressApiService fraudpost() error:', error);
    throw error;
  }
};

counterfeitpost = async (counterfeitDto: CounterfeitDto) => {
  try {
    const response = await this.httpClientWrapper.amlpost('/api/v1/SaveCounterfeit/CreateCounterfeit', counterfeitDto);
    console.log('response:', response); 
    return response;
  } catch (error) {
    throw error;
  }
}

scampost = async (ScamWriteDTO: any,) => {
  try {
    const formData = new FormData();
    formData.append('ScamWriteDTO', JSON.stringify(ScamWriteDTO));
    const response = await this.httpClientWrapper.amlpostFormData('/api/v1/SaveScam/CreateScam', formData);
    return response;
  } catch (error) {
    console.error('scampost error:', error);
    throw error;
  }
};

getAmlScamTeam = async (scamId: any) => {
  try {
    const response = await this.httpClientWrapper.amlget(`/api/v1/SaveScam/GetScam/${scamId}`);
    return response;
  } catch (error) {
    throw error;
  }
};


EditScam = async (ScamCommon: ScamUpdateDTO, scamId: string, euid: number) => {
  try {
    const response = await this.httpClientWrapper.amlput(`/api/v1/SaveScam/UpdateScam?scamId=${scamId}&euid=${euid}`, ScamCommon);
    return response;
  } catch (error) {
    throw error;
  }
};


getAmlFraudTeam = async (fraudId: any) => {
  try {
    const response = await this.httpClientWrapper.amlget(`/api/v1/SaveFraud/GetFraud/${fraudId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
EditCounterfeit = async (CounterfeitCommon: CounterfeitUpdateDTO, counterfeitId: string, euid: number) => {
  try {
    const response = await this.httpClientWrapper.amlput(`/api/v1/SaveCounterfeit/UpdateCounterfeit?counterfeitId=${counterfeitId}&euid=${euid}`, CounterfeitCommon);
    return response;
  } catch (error) {
    throw error;
  }
};


}

export default ViewService;



