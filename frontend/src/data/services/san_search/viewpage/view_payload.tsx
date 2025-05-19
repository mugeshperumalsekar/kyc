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
  uid: number;
  isBulkSearch: number;
  // accountNum:string;

};

export interface RecordDTO {
  ids: number;
  searchId: string;
  hitId: string;
  criminalId: string;
  name: string;
  address: string;
  entityType: string;
  program: string;
  list: string;
  score: number;
  fileType: number;
  fileList: string;
  nationality: string;
  citizenship: string;
  passport: string;
  Country: string;
  accountNumber: string;
};
export interface UiSearchDTO {
  name: string;
  matching_score: number;
}
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

}
export interface uiSearchDtoVerify {
  firstName: string;
  secondName: string;


}
// export interface uiReciveRecord{
//   firstName:string;
//   secondName:string;
//   damroSimilarity:string;
//   jaroWinkler:string;
//   fuzzy_Wuzzy_WeightRatio:string;
//   double_Metaphone_cosine:string




// }
export interface uiReciveRecord {
  onesidematching: string;
  twosidematching: string;
  jaro80: string;
  ratio: string;
  tokenSet: string;
  tokenSort: string;
  tokenWeight: string;
  fuzzydouble_Metaphone_cosine: string;
  jaro: string;
  onsideSinglePara:string;
  // sqlJaro:string;



}
export interface logicalIdentification {
  iden_Leba_publication_date: string;
  entity_logical_id_Iden: number;
  iden_leba_numtitle: string;
  iden_country: string;
  iden_number: string;

}
export interface logicaAddress {
  addr_other: string;
  entity_logical_id_Addr: number;
  addr_number: string;
  addr_street: string;
  addr_zipcod: string;
  addr_city: string;
  addr_country: string;

}
export interface LogicalDetails {
  naal_firstname: string;
  naal_middlename: string;
  naal_lastname: string;
}
export interface Logicalcitiy {
  citi_country: string;

}
export interface LogicalBirthDetails {
  birt_plcae: string;
  birt_country: string;
  birt_date: string

}
export interface LogicalAKADetails {
  name: string;

}
export interface GroupAliases {
  name: string;
  alias_Quality: string;
  alias_Type: string;



}
export interface GroupIdentification {
  identity: string;
  number: string;
  det: string;



}

export interface CityDetails {
  name: string;
  citizenship: string;
  place_of_Birth: string;
  dob: string;
  group_Type: string;
}
export interface UnDetails {
  firstName: string;
  secName: string;
  thirdName: string;
  _list: string;
  title: string;
  dob: string;
  citizenship: string;
  birthType: string;
  birthPlace: string;
  remarks: string;
  dataid: number;
  gender: string;
  nationality: string;
}
export interface UnAliases {
  _Type: string;
  name: string;
  quality: string
}
export interface UnDesignationDetails {
  identity: string;
}
