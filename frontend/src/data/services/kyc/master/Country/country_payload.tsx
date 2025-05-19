export interface CountryPayload {
    name: string;
};

export interface CountryEditPayload {
    text: string;
    primaryKey: string;
    iso2: string;
    fk_CountryValues: string;
};