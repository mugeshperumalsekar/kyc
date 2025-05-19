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
  searchingScore: number;
  kycId: number;
  applicantFormId: string;
  screeningType: number;
  uid: number;
};

export interface RecordDTO {
  id: number;
  name: string;
  dob: string;
  placeOfBirth: string;
  pan: string;
  directorsIdentificationNumber: string;
  score: number;
  hitId: number;
  criminalId: number;
  searchId: number;
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
  firstName: string;
  secondName: string;
  damroSimilarity: string;
  jaroWinkler: string;
  fuzzy_Wuzzy_WeightRatio: string;
  double_Metaphone_cosine: string
}