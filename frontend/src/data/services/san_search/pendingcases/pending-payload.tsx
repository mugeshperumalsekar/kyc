// Update the PindingcasesPayload type
export interface PindingcasesPayload {
  caseId: string;
  criminalId: string;
  hitId: string;
  levelId: string;
  searchId: string;
  statusId: string;
  matchingScore: string;
  remark: string; // Include the remarks property
  uid:string;
  criminalName:string;
}

