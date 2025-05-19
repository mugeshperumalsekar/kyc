export interface CustomerRequest {
  name: string;
  sourceLink: string;
  education: string;
  placeOfBirth: string;
  dob: string;
  pan: string;
  directorsIdentificationNumber: string;
  adverseInformation?: boolean | number;
  regulatoryAction?: boolean | number;
  uid: string;
  genderId: number;
  createdAt: string;
};

export interface AkaDetRequest {
  akaName: string;
};

export interface PartyRequest {
  formerAndCurrent: String,
  stateId: string,
  countryId: string,
  otherInformation: string,
  died: string,
  permanentAddress: string,
  positionInTheGovernment: string,
  partyMasterId: string;
  positionInTheParty: string
};

export interface PartyAddress {
  permanentAddress: string,
};

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
  pepId: number;
  relativeId: number;
  name: string;
  pan: string;
};

export interface RelativeChildrenDTO {
  pepId: number;
  relativeDetId: number;
  relativeId: number;
  childrenName: string;
  pan: string;
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
  relativeChildrenDTOS: RelativeChildrenDTO[];
};

export interface RelativePayload {
  relativeCombineDTO: RelativeCombineDTO[];
};

export interface Relative {
  id: string;
  name: string;
};

export interface PartyPayload {
  id: number;
  partyName: string;
};

export interface CompanyMasterPayload {
  id: number;
  name: string;
};

export interface CompaniesDirectorsDTO {
  id: number;
  din: string;
  companyId: number;
  directorId: number;
  designationId: number;
  companyMasterId: number,
  appointmentDate: string;
  cessationDate: string;
  designation: string;
  directorStatus: string;
  directorName: string;
};

export interface AddressDTO {
  id: number;
  companyId: number;
  registeredAddress: string;
};

export interface ContactDTO {
  companyId: number;
  emailID: string;
};

export interface CompanyDTO {
  id: number;
  associateMasterId: number,
  companyName: string;
  sourceLink: string;
  listAdverseInformation?: boolean | number;
  listRegulatoryAction?: boolean | number;
  listGovernment?: boolean | number;
  originalDateOfAppointment: string;
  typeId: number;
  cinfcrn: string;
  document: string;
};

export interface CompanyAssociationDTO {
  id: number;
  companyId: number,
  companyAssociation: string;
  uid: number;
};

export interface CombinedDTO {
  companyDTO: CompanyDTO;
  addressDTOS: AddressDTO[];
  contactDTOS: ContactDTO[];
  companiesDirectorsDTOS: CompaniesDirectorsDTO[];
  companyDocumentsDTOS: CompanyDocumentsDTO[];
  companyAssociationDTOS: CompanyAssociationDTO[];
};

export interface Payload {
  combinedDTO: CombinedDTO[];
};

export interface CompaniesDirectorsData {
  pepId: number;
  Directorid: string;
  companyId: number;
};

export interface DirectorsMasterData {
  name: string;
  din: string;
};

export interface Father {
  pepId: number;
  relativeMasterId: string;
  relativeName: string;
  pan: string;
};

export interface Mother {
  pepId: number;
  relativeMasterId: string;
  relativeName: string;
  pan: string;
};

export interface NumberofHUTs {
  pepId: number;
  relativeMasterId: string;
  relativeName: string;
  pan: string;
};

export interface Spouse {
  pepId: number;
  relativeMasterId: string;
  relativeName: string;
  pan: string;
};

export interface PhoneNumbers {
  pepId: number;
  communicationDt: string;
  communicationTypeId: number;
};

export interface Emailids {
  pepId: number;
  communicationDt: string;
  communicationTypeId: number;
};

export interface DesignationPayload {
  name: string;
  id: number;
};

export interface Payloads {
  combinedDTO: CombinedDTO[];
  createAkaDetRequest: AkaDetRequest[];
  createContactsDetailsRequest: ContactsDetailsRequest[];
  createPartyRequest: PartyRequest;
  createOtherAssociationRequest: OtherAssociationRequest[];
  createRelativeRequest: RelativeRequest[],
  relativeCombineDTO: RelativeCombineDTO[];
};

export interface RequestForUpdate {
  pepId: number;
  requestAt: string;
  requestUid: number;
  updatedUid: number;
  valid: number;
  updated: string;
  requestForUpdate: string;
};

export interface RequestForUpdate {
  pepId: number;
  requestAt: string;
  requestUid: number;
  updatedUid: number;
  valid: number;
  updated: string;
  requestForUpdate: string;
};

export interface RequestDescription {
  pepId: number;
  description: string;
  uid: number;
};

export interface HufDTO {
  pepId: number;
  hufName: string;
  hufPan: string;
};

export interface FatherDTO {
  pepId: number;
  fatherName: string;
  fatherPan: string;
};

export interface MotherDTO {
  pepId: number;
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
  pepId: number;
  spouseName: string;
  spousePan: string;
};

export interface SpouseHufDTO {
  pepId: number;
  spouseId: number;
  hufName: string;
  hufPan: string;
};

export interface SpouseFatherDTO {
  pepId: number;
  spouseId: number;
  fatherName: string;
  fatherPan: string;
};

export interface SpouseMotherDTO {
  pepId: number;
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

export interface Pan {
  pan: string;
};

export interface RecordDTO {
  id: number;
  name: string;
  dob: string;
  placeOfBirth: string;
  pan: string;
  directorsIdentificationNumber: string;
  score: number;
};

export interface SearchDTO {
  name: string;
  matching_score: number;
};