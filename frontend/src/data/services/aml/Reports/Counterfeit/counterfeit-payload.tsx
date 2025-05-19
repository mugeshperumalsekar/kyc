export interface CounterfeitCustomerEditData {
    frmDate: string;
    toDate: string;
    targetCustomerName: string;
    count: string;
    username: string;
    created_at: string;
    ticketId: string;
    counterfeitId: number,
    uid: number,
    
  }

  export interface CounterfeitTeamsDto {
    counterfeitId: number;
    branchName: string;
    branchCode: string | null;
    clientId: string;
    accountNumber: string;
    targetCustomerName: string;
  }
  

  
  export interface RemarkDto {
    remark: string;
  }
  
  export interface NumberDto {
    counterfeitNo: string;
    denomination: string;
  }
  export interface CompleteTeamDto {
    counterfeitTeamsDto: CounterfeitTeamsDto[];
    remarkDtos: RemarkDto[];
    numberDtos: NumberDto[];
  }
  
  export interface CompleteTeam {
    completeTeamDto: CompleteTeamDto;
  }

  export interface CounterfeitStatusData{
    id: number;
    counterfeitStatus: string
    counterfeitId: number;
    branchId: number
    uid: number;

  };

  export interface CreateCounterfeitTeamRequest{
    id: number;
    ticketId: number
    branchId: number;
    branchCode:string;
    clientId: string;
    accountNumber: string;
    targetCustomerName: string;
    uid: number;

  };

  export interface CounterfeitRemarkData{
    id: number;
    remark: string
    counterfeitId: number;
    branchId: number
    uid: number;

  };

  export interface CounterfeitNumberData{
    id: number;
    counterfeitNo: string
    denomination: string;
    counterfeitId: number;
    branchId:number;
    uid: number;

  };

  export interface CounterfeitGetDto {
    createCounterfeitTeamRequest:CreateCounterfeitTeamRequest;
    counterfeitStatusData:CounterfeitStatusData[];
    counterfeitRemarkData:CounterfeitRemarkData[];
    counterfeitNumberData:CounterfeitNumberData[];
  }

  