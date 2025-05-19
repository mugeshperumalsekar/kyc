export interface OtherAssociationRequest {
  otherAssociationAsPerMedia: string,
};

export interface RelativeRequest {
  relativeMasterId: String,
  relativeName: String,
  pan: String
};

export interface ContactsDetailsRequest {
  communicationDt: String,
  communicationTypeId: String
};

export interface AssociatedlistPayload {
  id: number;
  name: string
};

export interface Country {
  id: string;
  name: string;
};

export interface State {
  id: string;
  countryId: string;
  stateName: string;
};

export interface Gender {
  id: string;
  gender: string;
};

interface MultipartFile {
  name: string;
  size: number;
  type: string;
};

export interface CompanyDocumentsDTO {
  documentTypeId: number;
  companyId: number;
  uid: number;
  euid: number;
  files3: string[];
  documentType: string;
  imageName3: string;
  path?: number[];
};

export interface CompanyPath {
  CompanyPathId: number;
};

export interface RelativeDetDTO {
  cmsId: number;
  relativeId: number;
  name: string;
  pan: string;
};

export interface RelativeChildrenDTO {
  cmsId: number;
  relativeDetId: number;
  relativeId: number;
  childrenName: string;
  pan: string;
};

export interface RelativeDTO {
  cmsId: number;
  relativeMasterId: string;
  relativeName: string;
  pan: string;
};

export interface RelativeCombineDTO {
  relativeDTO: RelativeDTO;
  relativeDetDTOS: RelativeDetDTO[];
  relativeChildrenDTOS: RelativeChildrenDTO[];
};

export interface RelativePayload {
  relativeCombineDTO: RelativeCombineDTO[];
};

export interface Relative {
  id: string;
  name: string;
};

export interface DesignationPayload {
  name: string;
  id: number;
};

export interface RequestForUpdate {
  cmsId: number;
  requestAt: string;
  requestUid: number;
  updatedUid: number;
  valid: number;
  updated: string;
  requestForUpdate: string;
};

export interface RequestForUpdate {
  cmsId: number;
  requestAt: string;
  requestUid: number;
  updatedUid: number;
  valid: number;
  updated: string;
  requestForUpdate: string;
};

export interface RequestDescription {
  cmsId: number;
  description: string;
  uid: number;
};

export interface HufDTO {
  cmsId: number;
  hufName: string;
  hufPan: string;
};

export interface FatherDTO {
  cmsId: number;
  fatherName: string;
  fatherPan: string;
};

export interface MotherDTO {
  cmsId: number;
  motherName: string;
  motherPan: string;
};

export interface FamilyCombinedDTO {
  hufDTO: HufDTO[];
  fatherDTOS: FatherDTO[];
  motherDTOS: MotherDTO[];
};

export interface FamilyPayload {
  familyCombinedDTO: FamilyCombinedDTO[];
};

export interface SpouseDetailsDTO {
  cmsId: number;
  spouseName: string;
  spousePan: string;
};

export interface SpouseHufDTO {
  cmsId: number;
  spouseId: number;
  hufName: string;
  hufPan: string;
};

export interface SpouseFatherDTO {
  cmsId: number;
  spouseId: number;
  fatherName: string;
  fatherPan: string;
};

export interface SpouseMotherDTO {
  cmsId: number;
  spouseId: number;
  motherName: string;
  motherPan: string;
};

export interface SpouseCommonDTO {
  spouseDetailsDTO: SpouseDetailsDTO;
  spouseHufDTOS: SpouseHufDTO[];
  spouseFatherDTOS: SpouseFatherDTO[];
  spouseMotherDTOS: SpouseMotherDTO[];
};

export interface SpouseFamilyPayload {
  spouseCommonDTO: SpouseCommonDTO[];
};

export interface ListOfCompanyPayload {
  id: number;
  type: string;
};

export interface SearchDTO {
  name: string; 
  searchingScore: number;
  recordTypeId: number;
  kycId: number;
  applicantFormId: string;
  screeningType: number;
  uid: number;
}

export interface RecordDTO {
  cmsId: number;
  searchId: number; 
  criminalId: number; 
  hitId: number; 
  cmsName: string;
  cmsRecordType: string;
  score: number;
  recordTypeId: number;
  uid: number;
}
