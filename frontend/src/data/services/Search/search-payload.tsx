export interface Regulator {
  regulatorListId: number;
  id: number;
  Dead: string;
};

export interface AliasesNameRequest {
  name: string;
};

export interface Gender {
  id: number;
  gender: string;
};

export interface BirthDataRequest {
  name: string;
};

export interface PlaceofBirthRequest {
  PlaceofBirth: string;
};

export interface AddressRequest {
  Address: string;
};

export interface DateofBirthRequest {
  DateofBirth: string;
};

export interface RelativeDetDTO {
  Aliaes: string;
};

export interface RelationDTOS {
  Relationshipname: string;
};

export interface RelativeDTO {
  pepId: number;
  relativeMasterId: string;
  relativeName: string;
  pan: string;
};

export interface RelativeCombineDTO {
  relativeDTO: RelativeDTO;
  relativeDetDTOS: RelativeDetDTO[];
  relationDTOSDTOS: RelationDTOS[];
};

export interface RelativePayload {
  relativeCombineDTO: RelativeCombineDTO[];
};

export interface Image {
  name: string;
};

export interface Country {
  id: number;
  name: string;
};

export interface CustomerRequest {
  sourceLink: string;
};

export interface createDetailsRequest {
  recordTypeId: number;
  regulatorListId: number;
  regulatorId: number;
  display: number;
  sourceLink: string;
  name: string;
  registrationNum: string;
  genderId: number;
  deadId: number;
  uid: number;
};

export interface Regulator {
  id: number;
  name: string;
};

export interface RegulatorListData {
  id: number;
  name: string;
};

export interface RecordTypeData {
  id: number;
  name: string;
};

export interface Gender {
  id: number;
  gender: string;
};

export interface Dead {
  id: number;
  name: string;
};

export interface DetailsCombineDTO {
  addressDTOS: AddressDTO[];
  dateOfBirthDTOS: DateOfBirthDTO[];
  aliasesDTOS: AliasesDTO[];
};

export interface DetailsPayload {
  detailsCombineDTO: DetailsCombineDTO[];
};

export interface AddressDTO {
  cmsId: number;
  recordTypeId: number;
  address: string;
  uid: string;
};

export interface DateOfBirthDTO {
  cmsId: number;
  recordTypeId: number;
  dob: string;
  birthYearAlone: string;
  placeOfBirth: string;
  uid: string;
};

export interface AliasesDTO {
  cmsId: number;
  recordTypeId: number;
  aliasesName: string;
  uid: string;
};

export interface HeadQuartersDTO {
  countryId: number;
  recordTypeId: number;
  cmsId: number;
  countryHqId: number;
  identificationNumberId: number;
  identificationNum: string;
  identificationDetails: string;
};

export interface CreateCountryRegistrationRequest {
  countryId: number;
  recordTypeId: number;
  cmsId: number;
  countryHqId: number;
  identificationNumberId: number;
  identificationNum: string;
  identificationDetails: string;
  contactId: number;
  contactName: string;
};

export interface createBankDetailsRequests {
  bankId: number;
  recordTypeId: number;
  cmsId: number;
  acc_no: string;
  name: string;
  uid: number;
};

export interface createCompanyDetailsRequests {
  recordTypeId: number;
  cmsId: number
  identificationNumberId: number;
  stateId: number;
  role: string;
  companyName: string;
  address: string;
  idDetails: string;
  uid: number
};

export interface bank {
  id: number;
  bankName: string;
};

export interface ContactDetails {
  id: number;
  name: string;
};

export interface State {
  id: number;
  stateName: string;
  countryId: number;
};

export interface createIndCaseDetailsRequests {
  recordTypeId: number;
  cmsId: number;
  caseDetails: string;
  uid: number;
};

export interface createIndPositionsRequests {
  recordTypeId: number;
  cmsId: number;
  position: string;
  uid: number;
};

export interface IdNumberData {
  id: number;
  name: string;
};

export interface ContactDetailsData {
  id: number;
  name: string;
};

export interface RelativeConfigData {
  id: number;
  name: string;
};

export interface CountryHqData {
  id: number;
  name: string;
};

export interface CreateCaseDetailsRequest {
  cmsId: number;
  recordTypeId: number;
  caseDetails: string;
  uid: string;
};

export interface IndOrgCommonDTO {
  positionsDTO: PositionsDTO;
  indAliasesNameDTOS: IndAliasesNameDTO[];
  relationDTOS: RelationDTO[];
  relationAliasesDTOS: RelationAliasesDTO[];
  detailsAboutRelationDTOS: DetailsAboutRelationDTO[];
};

export interface InorgPayload {
  indOrgCommonDTO: IndOrgCommonDTO[];
};

export interface PositionsDTO {
  cmsId: number;
  recordTypeId: number;
  position: string;
  linIndName: string;
};

export interface IndAliasesNameDTO {
  cmsId: number;
  recordTypeId: number;
  positionId: number;
  linIndAliasesName: string;
};

export interface RelationDTO {
  cmsId: number;
  recordTypeId: number;
  positionId: number;
  relationship: string;
  relativeMasterId: number;
};

export interface RelationAliasesDTO {
  cmsId: number;
  recordTypeId: number;
  positionId: number;
  relationAliasesName: string;
};

export interface DetailsAboutRelationDTO {
  cmsId: number;
  recordTypeId: number;
  positionId: number;
  detailsAboutRelation: string;
};