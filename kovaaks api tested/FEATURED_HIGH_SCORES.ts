export interface JSONSchema {
    scenarioName:     string;
    steamId:          string;
    score:            number;
    created:          Date;
    attributes:       Attributes;
    steamAccountName: string;
    webappUsername:   string;
    game:             Game;
}

export interface Attributes {
    resolution:           Resolution;
    avg_fps:              number;
    avg_ttk:              number;
    sens_scale:           Scale;
    horiz_sens:           number;
    vert_sens:            number;
    fov:                  number;
    challenge_start:      string;
    score:                number;
    kills:                number;
    hash:                 string;
    fov_scale:            Scale;
    sens_randomizer:      null;
    model_overrides:      ModelOverrides;
    accuracy_damage:      number;
    scenario_version:     string;
    cm360:                number;
    client_build_version: ClientBuildVersion;
    epoch:                number;
}

export enum ClientBuildVersion {
    The37720250421102618Ebda1827461E = "3.7.7.2025-04-21-10-26-18-ebda1827461e",
}

export enum Scale {
    CM360 = "cm/360",
    CallOfDuty = "Call of Duty",
    Overwatch = "Overwatch",
    Valorant = "Valorant",
}

export interface ModelOverrides {
    cylindrical: Cuboid;
    cuboid:      Cuboid;
    spheroid:    Cuboid;
}

export interface Cuboid {
    model: Model;
    skin:  Model;
}

export enum Model {
    None = "None",
}

export enum Resolution {
    The1600X900 = "1600x900",
    The1920X1080 = "1920x1080",
    The2560X1440 = "2560x1440",
}

export enum Game {
    Aimerz = "aimerz",
    Cs2 = "CS2",
    KovaaKS = "KovaaK's",
    KovaaKs = "KovaaKs",
    Valorant = "Valorant",
}
