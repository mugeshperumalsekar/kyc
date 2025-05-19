export interface ScreenDTO {
    name: string;
    searchingScore: number;
    kycId: number;
    applicantFormId: number;
    screeningType: string;
    isScreening:number;
    uid: string;
}

export interface KycSearchDetails {
    screenDTO: ScreenDTO;
}