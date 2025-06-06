export interface JSONSchema {
    totalPlaylistSubscribers: number;
    page:                     number;
    max:                      number;
    total:                    number;
    data:                     Datum[];
}

export interface Datum {
    playlistId:     number;
    playlistName:   string;
    playlistCode:   string;
    playlistHash:   string;
    playerId:       number;
    playlistBase64: string;
    playlistJson:   PlaylistJSON;
    created:        Date;
    aimType:        string;
    isPrivate:      boolean;
    updated:        Date;
    partnerName:    null;
    description:    string;
    subscribers:    number;
}

export interface PlaylistJSON {
    authorName:    string;
    playlistId:    number;
    description:   string;
    playlistName:  string;
    scenarioList:  ScenarioList[];
    authorSteamId: string;
}

export interface ScenarioList {
    playCount:    number;
    scenarioName: string;
}
