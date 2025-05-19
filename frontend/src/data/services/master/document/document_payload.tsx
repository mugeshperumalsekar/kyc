export interface SancSearchData {
    id: number;
    kycId: number;
    name: string;
    matching_score: number;
    identity: string;
}
export interface SancHitSearchData {
    id: number;
    searchId: number;
    name: string;
    matchingScore: number;
    display: string;
}
// export interface KycSearchDetails {

//     name: string;
//     searchingScore: number;
//     uid: number;
//     kycId: number;
// }


export interface KycSanSearchDetails {

    name: string;
    searchingScore: number;
    uid: number;
    kycId: number;
}

export interface SearchDto {
    name: string;
    searchingScore: number;
    recordTypeId: number;
    kycId: number;
    applicantFormId: number;
    screeningType: string;
    isScreening:number;
    uid: string;
}

export interface KycCriminalSearchDetails {
    searchDTO: SearchDto;
}