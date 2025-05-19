export interface CreateScamTeamRequest {
    id: number;
    branchCode: string;
    branchId: number;
    clientId: string;
    accountNumber: string;
    ticketId: number;
    ticketStatus: string;
    targetCustomerName: string;
    uid: number;
    euid: number;
};

export interface ScamStatusData {
    id: number;
    scamId: number;
    branchCode: string;
    branchId: number;
    scamStatus: string;
    ticketId: number;
    ticketStatus: string;
    uid: number;
    euid: number;
};

export interface ScamRemarkData {
    id: number;
    scamId: number;
    branchId: number;
    ticketId: number;
    remark: string;
    uid: number;
    euid: number;
};

export interface ScamObservationData {
    id: number;
    scamId: number;
    observation: string;
    ticketId: number;
    branchId: number;
    ticketStatus: string;
    uid: number;
    euid: number;
};

export interface AmlScamDto {
    createScamTeamRequest: CreateScamTeamRequest;
    createScamStatusRequest: ScamStatusData[];
    createScamRemarkRequest: ScamRemarkData[];
    createScamObservationRequest: ScamObservationData[];
};

export interface ScamDatas {
    scamId: number;
    username: string;
    targetCustomerName: string;
    frmDate: string;
    toDate: string;
    ticketId: number;
    uid: number;
    created_at: string;
    count: any;
    complaintId: any;
  }