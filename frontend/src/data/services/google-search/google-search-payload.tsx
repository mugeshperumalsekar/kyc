export interface CreateGoogleSearchRequest {
    clientId:number;
    userId:number;  
    query: string;
    company:any;
    location:any;
    startIndex: number;
    perPage: number;
    page: number;
    filter: string;
    dateRestrict: any;
    sort: string;
    afterDate: "";
    beforeDate: "";
    news: string;
    onlySocialMedia: Boolean ;
    excludeSocialMedia: Boolean;
    noneOfTheseWords: string;
    country:string;
    excludeTheseSites: string[];
    filters: string[];
    groupIds: [];
    onlyFromTheseSites: string[];
    keywords: string[];
}
