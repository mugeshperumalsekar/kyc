import AddressDTO from "./CompanyAddressDTO";
import ContactDTO from "./CompanyContactDTO";
import CompanyDTO from "./CompanyDTO";

interface CombinedDTO {
    companyDTO: CompanyDTO;
    addressDTOS: AddressDTO[];
    contactDTOS: ContactDTO[];
  }
  export default CombinedDTO;