export interface JSONSchema {
    total: number;
    page:  number;
    max:   number;
    data:  Datum[];
}

export interface Datum {
    steamId:           string;
    score:             number;
    rank:              number;
    steamAccountName:  string;
    webappUsername:    null | string;
    kovaaksPlusActive: boolean;
    country:           null | string;
    attributes:        Attributes;
}

export interface Attributes {
    fOv?:                number;
    hash?:               Hash;
    cm360?:              number;
    epoch:               number;
    kills?:              number;
    score?:              number;
    avgFps?:             number;
    avgTtk?:             number;
    fovScale?:           string;
    vertSens?:           number;
    horizSens?:          number;
    resolution?:         Resolution;
    sensScale?:          string;
    accuracyDamage:      number;
    challengeStart?:     string;
    scenarioVersion:     Hash;
    clientBuildVersion?: string;
    fov?:                number;
    sensRandomizer?:     null;
    modelOverrides?:     ModelOverrides;
    scenario?:           string;
}

export enum Hash {
    The18505Db399Aaa604B7A65Fa03Ffa7490 = "18505db399aaa604b7a65fa03ffa7490",
}

export interface ModelOverrides {
    cuboid:      Cuboid;
    spheroid:    Cuboid;
    cylindrical: Cuboid;
}

export interface Cuboid {
    skin:  Model;
    model: Model;
}

export enum Model {
    None = "None",
}

export enum Resolution {
    The1280X960 = "1280x960",
    The1600X900 = "1600x900",
    The1680X1050 = "1680x1050",
    The1920X1080 = "1920x1080",
    The2560X1440 = "2560x1440",
}
