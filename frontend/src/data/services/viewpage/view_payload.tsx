export interface Country {
  primaryKey: string;
  id: string;
  ISO2: string;
  text: string;
  FK_CountryValues: string;
};

export interface List {
  primaryKey: string;
  id: string;
  ISO2: string;
  text: string;
  FK_ListValues: string;
};

export interface Program {
  primaryKey: string;
  id: string;
  ISSubsidiaryBodyIDO2: string;
  text: string;
  FK_SanctionsProgramValues: string;
};

export interface All {
  partyTypeID: string;
  partySubTypeID: string;
  ISSubsidiaryBodyIDO2: string;
  partySubText: string;
  type_text: string;
  partyText: string;
};

export interface CustomerRequest {
  ids: number;
  name: string;
  address: string;
  entityType: string;
  program: string;
  list: string;
  score: number;
};

export interface Customer {
  id: number;
  city: string;
  State: string;
};

export interface Address {
  ids: number;
  region: string
  address1: string;
  address2: string;
  address3: string;
  city: string;
  province: string;
  postal: string;
  countryName: string;
};

export interface IdentificationData {
  ids: number;
  type: string
  country: string;
  issue_Date: string;
  dateClarification: string;
};

export interface AliasesData {
  aliasesType: string
  aliasesName: string;
  category: string;
};

export interface PlaceOfBirthData {
  featuretypeText: string;
  versiondetailText: string;
};

export interface NationalityData {
  text: string;
  name: string;
};

export interface Birthdate {
  dobW: string;
  dob: string;
};

export interface DetailsData {
  heading: string;
  val: string;
};

export interface SearchDTO {
  name: string;
  matching_score: number;
  listID: number;
  partySubTypeID: number;
  countryId: number;

};

export interface RecordDTO {
  ids: number;
  name: string;
  address: string;
  entityType: string;
  program: string;
  list: string;
  score: number;
};

export interface UiSearchDTO {
  name: string;
  matching_score: number;
};

export interface UiRecordDTO {
  name: string;
  jarow: string;
  fuzzy_Wuzzytoken_sort_ratio: string;
  set: string;
  sort: string;
  cosine_Similarity: string;
  double_Metaphone: string;
  soundex_val: string;
  double_Metaphone_jw: string;
  n_Gram: string;
};

export interface uiSearchDtoVerify {
  firstName: string;
  secondName: string;
};

export interface uiReciveRecord {
  onesidematching: string;
  twosidematching: string;
  tokenWeight: string;
  onsideSinglePara: string;
  onsideMultiPara: string;
  jaro: string;
};

export interface uiReciveCountryRecord {
  onesidematching: string;
  twosidematching: string;
  tokenWeight: string;
  onsideSinglePara: string;
  onsideMultiPara: string[];
  jaro: string;
};

export interface SanctionSearchData {
  searchData: SearchData[];
};

export interface SearchData {
  name: string;
  matchingScore: number | null;
  uid: number;
  typeId: number;
  listId: number;
  stateId: number;
  countryId: number;
  levelId: number
  fromDate: string;
  toDate: string;
  hitRecordData: HitRecordData[];
};

export interface HitRecordData {
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
};