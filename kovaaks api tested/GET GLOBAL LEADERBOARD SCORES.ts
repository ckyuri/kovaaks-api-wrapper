export interface JSONSchema {
    data:  Datum[];
    total: string;
}

export interface Datum {
    rank:              number;
    rankChange:        number;
    steamId:           string;
    webappUsername:    string;
    steamAccountName:  string;
    points:            string;
    scenariosCount:    string;
    completionsCount:  number;
    kovaaksPlusActive: boolean;
    country:           string;
}
