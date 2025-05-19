export interface HitdatalifecyclePayload {
  searchId: string;
  hitId: string;
  criminalId: string;
  caseId: string;
  levelId: string;
  statusId: string;
  uid: string;
  remark: string;
}

export interface HitrecordlifecyclePayload {
  search_id: number,
  hitdata_id: number,
  level_id: number,
  case_id: number,
  criminal_id: number,
  statusId: number,
  passingLevelId: number,
  isAlive: number,
  valid: number,
  remark: string,
  statusNowId: number
}