// search-payload.tsx
export interface SearchPayload {
    name: string;
    typeId: string;
   stateId:string;
    countryId: string;
    identity: string;
    uid:string;
    
  }
  
export interface SearchDTO {
  name: string;
  matching_score: number;
  listID:number;
  partySubTypeID:number;
  countryId:number;

};

export interface RecordDTO {
  hitId: any;
  criminalId: any;
  searchId: any;
  ids: number;
  name: string;
  address: string;
  entityType: string;
  program: string;
  list: string;
  score: number;
};
  