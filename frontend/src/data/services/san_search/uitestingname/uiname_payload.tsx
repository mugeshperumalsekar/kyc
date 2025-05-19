export interface uiSingleDtoVerify {
    id: string,
    name: string,
    country: string,
    dob: string,
    score: number,
}

export interface multiParaSearchData {
    id: string,
    name: string,
    country: string,
    dob: string,
    score: number,
}

export interface SingleRecord {
    id: string,
    onsideMultiPara: string[];
    name: string;
    dob: string
    country: string
}