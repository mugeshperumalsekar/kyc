
interface CompanyDTO {
    id: number;
    pepId: number;
    listOfAssociatedCompanies: string;
    associateMasterdId:number,
    companyName: string;
    designation: string;
    originalDateOfAppointment: string;
    dateOfAppointmentAtCurrentDesignation: string;
    dateOfCessation: string;
    cinfcrn: string;
    din: string;
  }
  export default CompanyDTO;