// import AkaDetRequest from "./dto/AkaDetRequest";
// import CombinedDTO from "./dto/CombinedDTO";
// import ContactsDetailsRequest from "./dto/ContactsDetailsRequest";
// import CustomerRequest from "./dto/CustomerRequest";
// import OtherAssociationRequest from "./dto/OtherAssociationRequest";
// import PartyRequest from "./dto/PartyRequest";
// import RelativeCombineDTO from "./dto/RelativeCombineDTO";
// import RelativeRequest from "./dto/RelativeRequest";

//  export interface PepDetailsWriteDTO {
//     combinedDTO: CombinedDTO[];
//     createCustomerRequest: CustomerRequest; // Include the CustomerRequest type here
//     createAkaDetRequest: AkaDetRequest[];
//     createContactsDetailsRequest: ContactsDetailsRequest[]; // Adjust the type if needed
//     createPartyRequest: PartyRequest;
//     createOtherAssociationRequest: OtherAssociationRequest[];
//     createRelativeRequest: RelativeRequest[],
//     relativeCombineDTO: RelativeCombineDTO[];
//   }


export interface CompanyDocumentsData {

  id: number;
  companyId: number;
  pathId: number;
  url: String;
  documentType: String;
  documentCount: number;
  uid:number;

}