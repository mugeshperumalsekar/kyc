
export interface Branch {
 id:number;
  name: string;
}
export interface Status{
  id:number;
  name:string;
}
export interface ConfigBranchData {
  id: number;
  branchCodeId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  uid: number;
}
export interface AlertScenariosData {
  id: number;
  alertScenarios: string;
  uid: number;

}
export interface AmlComplaintReply {
  replyQry: string;
  reply: string
  uid: number;


}
export interface CreateAmlComplaintTeamRequest {
  id: number;
  ticketId: number
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  uid: number;

}
export interface AmlComplaintAlertScenariosData {
  id: number;
  complaintId: number
  scenarioId: number;
  replyQry:string;
  uid: number;


}

export interface AmlComplaintRemarkData {
  id: number;
  remark: string
  complaintId: number;
  branchId: number
  uid: number;

}

export interface AmlComplaintDto {
  createAmlComplaintTeamRequest: CreateAmlComplaintTeamRequest;
  amlComplaintAlertScenariosData: AmlComplaintAlertScenariosData[];

  amlComplaintRemarkData: AmlComplaintRemarkData[];

}
export interface SpouseFamilyPayload {
  amlComplaintDto: AmlComplaintDto;
}

//aml to barnch
export interface CreateAmlComplaintReplyRequests{
  id:number;
  complaintAlertId:number;
  reply:string;
  complaintId:number;
  uid:number;

}
export interface createAmlComplaintRemarkRequest{
  remark: string;
  complaintId: number;
  branchId: number;
  uid: number;
}

export interface RepalywriteDto {
  createAmlComplaintReplyRequests: CreateAmlComplaintReplyRequests[];
  createAmlComplaintRemarkRequest: createAmlComplaintRemarkRequest;

}
export interface SpouseFamilyPayload {
  repalywriteDto: RepalywriteDto;
}
export interface Remark {

  remark: string;
  complaintId: number;
  branchId: number;
  uid: number;

}

export interface AmlComplaintStatus {
  id: number;
  ticketId: number;
  ticketStatusId: number;
  complaintId:number;
  remark: string;
  branchId: number;
  uid: number;

}
//get

export interface ComplaintDto {
  complaintId: number;
  branchName: string;
  branchCode: string | null;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
}

export interface AlertScenarioDto {
  complaintAlertId:number;
  alertScenarios: string;
  replyQry:string;
}

export interface RemarkDto {
  remark: string;
}



export interface CompleteTeamDto {
  complaintDto: ComplaintDto[];
  alertScenarioDtos: AlertScenarioDto[];
  remarkDtos: RemarkDto[];

}

export interface CompleteTeam {
  completeTeamDto: CompleteTeamDto;
}
export interface Branchmapping {
  id: number;
  branchId: number;
  userId: string
  entryDate: string;
  uid: number;


}
//fraud
export interface AmlComplaintReply {
  replyQry: string;
  reply: string
  uid: number;


}
export interface CreateFraudTeamRequest {
  id: number;
  ticketId: number
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  branchCode: string;
  ticketStatus: string;
  uid: number;

}
export interface CreateFraudStatusRequest {
  id: number;
  fraudId: number
  branchId: number;
  uid: number;
  fraudStatus:string;
  ticketId:number;
  branchCode:number


}
export interface CreateFraudObservationRequest {
  id: number;
  observation: string

  fraudId: number;
  ticketId:number;
  branchId:number;
  uid: number;

}
export interface CreateFraudRemarkRequest {
  id: number;
  remark: string
  fraudId: number;
  branchId: number;
  ticketId:number;
  uid: number;

}

export interface FraudCommonDTO {
  createFraudTeamRequest: CreateFraudTeamRequest;
  createFraudStatusRequest: CreateFraudStatusRequest[];
  createFraudRemarkRequest: CreateFraudRemarkRequest[];
  createFraudObservationRequest: CreateFraudObservationRequest[];

}

export interface FraudFamilyPayload {
  fraudCommonDTO: FraudCommonDTO;
}
//fraudget
export interface createFraudTeamRequest {
  complaintId: number;
  branchName: string;
  branchCode: string | null;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
}

export interface FraudStatusData {
  id: number;
  fraudId: number
  branchId: number;
  uid: number;
  fraudStatus: string;
  ticketId: number;
  branchCode: number
};

export interface FraudRemarkData {
  id: number;
  remark: string
  fraudId: number;
  branchId: number;
  ticketId: number;
  uid: number;
};

export interface FraudObservationData {
  id: number;
  observation: string
  fraudId: number;
  ticketId: number;
  branchId: number;
  uid: number;
};

export interface FraudTeam {
  createFraudTeamRequest: CreateFraudTeamRequest[];
  fraudStatusData: FraudStatusData[];
  fraudRemarkData: FraudRemarkData[];
  fraudObservationData: FraudObservationData[];
}

export interface CompleteTeam {
  fraudTeam: FraudTeam;
}

export interface CounterfeitDto {
  createCounterfeitTeamRequest: CreateCounterfeitTeamRequest;
  createCounterfeitNumberRequest: CreateCounterfeitNumberRequest[];
  createCounterfeitRemarkRequest: CreateCounterfeitRemarkRequest[];
  createCounterfeitStatusRequest: CreateCounterfeitStatusRequest[];

}
export interface CounterfeitUpdateDTO {
  updateCounterfeitTeamRequest: UpdateCounterfeitTeamRequest;
  createCounterfeitStatusRequest: CreateCounterfeitStatusRequest[];
  createCounterfeitRemarkRequest: CreateCounterfeitRemarkRequest[];
  createCounterfeitNumberRequest: CreateCounterfeitNumberRequest[];
};

export interface CreateAmlComplaintTeamRequest {
  id: number;
  ticketId: number
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  uid: number;

}
export interface CreateCounterfeitTeamRequest {
  id: number;
  ticketId: number
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  uid: number;

}
export interface UpdateCounterfeitTeamRequest {
  id: number;
  ticketId: number
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  branchCode:string;
  uid: number;

}
export interface CreateCounterfeitRemarkRequest {
  id: number;
  remark: string
  counterfeitId: number;
  branchId: number
  uid: number;

}
export interface CreateCounterfeitStatusRequest {
  id: number;
  counterfeitStatus: string
  counterfeitId: number;
  branchId: number
  uid: number;

}
export interface CreateCounterfeitNumberRequest {
  id: number;
  counterfeitNo: string
  denomination: string;
  counterfeitId: number;
  branchId:number;
  uid: number;

}

export interface CreateScamTeamRequest {
  id: number;
  ticketId: number;
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  branchCode: string;
  ticketStatus: string;
  uid: number;
};

export interface CreateScamStatusRequest {
  id: number;
  scamId: number
  branchId: number;
  uid: number;
  scamStatus: string;
  ticketId: number;
  branchCode: number
};

export interface CreateScamObservationRequest {
  id: number;
  observation: string
  scamId: number;
  ticketId: number;
  branchId: number;
  uid: number;
};

export interface CreateScamRemarkRequest {
  id: number;
  remark: string
  scamId: number;
  branchId: number;
  ticketId: number;
  uid: number;
};

export interface ScamCommonDTO {
  createScamTeamRequest: CreateScamTeamRequest;
  createScamStatusRequest: CreateScamStatusRequest[];
  createScamRemarkRequest: CreateScamRemarkRequest[];
  createScamObservationRequest: CreateScamObservationRequest[];
};

export interface ScamStatusData {
  id: number;
  scamId: number
  branchId: number;
  uid: number;
  scamStatus: string;
  ticketId: number;
  branchCode: number
};

export interface ScamRemarkData {
  id: number;
  remark: string
  scamId: number;
  branchId: number;
  ticketId: number;
  uid: number;
};

export interface ScamObservationData {
  id: number;
  observation: string
  scamId: number;
  ticketId: number;
  branchId: number;
  uid: number;
};

export interface GetScamDTO {
  createScamTeamRequest: CreateScamTeamRequest;
  scamStatusData: ScamStatusData[];
  scamRemarkData: ScamRemarkData[];
  scamObservationData: ScamObservationData[];
};

export interface UpdateScamTeamRequest {
  id: number;
  ticketId: number;
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  branchCode: string;
  ticketStatus: string;
  uid: number;
};


export interface ScamUpdateDTO {
  updateScamTeamRequest: UpdateScamTeamRequest;
  createScamStatusRequest: CreateScamStatusRequest[];
  createScamRemarkRequest: CreateScamRemarkRequest[];
  createScamObservationRequest: CreateScamObservationRequest[];
};

export interface GetFraudDTO {
  createFraudTeamRequest: CreateFraudTeamRequest;
  fraudStatusData: FraudStatusData[];
  fraudRemarkData: FraudRemarkData[];
  fraudObservationData: FraudObservationData[];
};
export interface UpdateFraudTeamRequest {
  id: number;
  ticketId: number
  branchId: number;
  clientId: string;
  accountNumber: string;
  targetCustomerName: string;
  branchCode: string;
  ticketStatus: string;
  uid: number;
};
export interface FraudUpdateDTO {
  updateFraudTeamRequest: UpdateFraudTeamRequest;
  createFraudStatusRequest: CreateFraudStatusRequest[];
  createFraudRemarkRequest: CreateFraudRemarkRequest[];
  createFraudObservationRequest: CreateFraudObservationRequest[];
};
export interface CounterfeitUpdateDTO {
  updateCounterfeitTeamRequest: UpdateCounterfeitTeamRequest;
  createCounterfeitStatusRequest: CreateCounterfeitStatusRequest[];
  createCounterfeitRemarkRequest: CreateCounterfeitRemarkRequest[];
  createCounterfeitNumberRequest: CreateCounterfeitNumberRequest[];
};