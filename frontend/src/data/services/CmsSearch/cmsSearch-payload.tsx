export interface CmsSearchData {
  searchDtos: SearchDto[];
}

export interface SearchDto {
  name: string;
  matchingScore: number | null;
  uid: number;
  fromDate: string;
  toDate: string;
  hitRecordData: HitRecordData[];
}

export interface HitRecordData {
  id: number;
  searchId: number;
  name: string;
  matchingScore: number;
  uid: number;
  criminalId: number;
  display: string;
  statusNowId: number;
  cycleId: number;
  fromDate: string;
  toDate: string;
}