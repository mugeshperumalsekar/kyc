export interface SearchPayload {
  name: string;
  typeId: string;
  stateId: string;
  countryId: string;
  identity: string;
  uid: string;
};

export interface SanBulkPayload {
  assignTo: number;
  assignBy: number;
  searchName: string;
  searchId: number;
  euid: number;
  uid: number;
  matchingScore: number
  ofacDataList: {
    id: number;
    bulkAssignId: number;
    searchId: number;
    hitId: number;
    hitName: string;
    hit: number;
    euid: number;
    uid: number;
  }[];
};