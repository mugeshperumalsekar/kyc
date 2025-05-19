// export interface PepSearchData {
//   searchDtos: SearchDtos[];
//   searchDetailsData: SearchDetailsData[];
// };

// export interface SearchDtos {
//   name: string;
//   searchingScore: string;
//   uid: string;
//   fromDate: string,
//   toDate: string,
// };

// export interface SearchDetailsData {
//   searchId: number;
//   name: string;
//   matchingScore: number;
//   uid: string;
// };
export interface PepSearchData {
  searchDtos: SearchDto[];
}

export interface SearchDto {
  id:number;

  name: string;
  searchingScore: number | null;
  uid: number;
hitName:string;
  fromDate: string;
  toDate: string;
  hitRecordData: HitRecordData[];
}

export interface HitRecordData {
  id:number;
  searchId: number;
  name: string;
  matchingScore: number;
  uid: number;
hitName:string;
  fromDate: string;
  toDate: string;
}
