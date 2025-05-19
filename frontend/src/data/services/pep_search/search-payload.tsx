export interface SearchPayload {
  name: string;
  typeId: string;
  stateId: string;
  countryId: string;
  identity: string;
  uid: string;
};export interface SearchPayload {
  name: string;
  typeId: string;
  stateId: string;
  countryId: string;
  identity: string;
  uid: string;
};
export interface PepGetSearchDetails{
  id:number;
  matchingScore:number;
  name:string;
  searchId:number;
  typeId:number;
  kycId:number;
  
  }
  export interface SancGetSearchDetails{
    id:number;
    matchingScore:number;
    name:string;
    searchId:number;
    typeId:number;
    kycId:number;
    
    }
  export interface PepHitSearchData {
    id:number;
    searchId:number;
    name:string;
    matchingScore:number;
    display:string;
  }
  export interface CmsGetSearchDetails{
    id:number;
    searchingScore:number;
    name:string;
    searchId:number;
    typeId:number;
    kycId:number;
    cmsId:number;
  }
  export interface CmsHitSearchData {
    id:number;
    searchId:number;
    name:string;
    matchingScore:number;
    display:string;
  }