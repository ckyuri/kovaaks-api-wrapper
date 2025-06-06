export interface JSONSchema {
    page:  number;
    max:   number;
    total: number;
    data:  Datum[];
}

export interface Datum {
    leaderboardId: string;
    scenarioName:  string;
    counts:        Counts;
    rank:          number;
    score:         number;
    attributes:    Attributes;
    scenario:      Scenario;
}

export interface Attributes {
    fov?:                 number;
    hash:                 string;
    cm360:                number;
    epoch:                number;
    kills:                number;
    score:                number;
    avg_fps:              number;
    avg_ttk:              number;
    fov_scale:            FovScale;
    vert_sens:            number;
    horiz_sens:           number;
    resolution:           Resolution;
    sens_scale:           SensScale;
    accuracy_damage:      number;
    challenge_start:      string;
    model_overrides?:     ModelOverrides;
    sens_randomizer?:     null;
    scenario_version:     string;
    client_build_version: string;
    fOV?:                 number;
}

export enum FovScale {
    Horizontal43 = "Horizontal (4:3)",
    Overwatch = "Overwatch",
}

export interface ModelOverrides {
    cuboid:      Cuboid;
    spheroid:    Cuboid;
    cylindrical: Cuboid;
}

export interface Cuboid {
    skin:  string;
    model: string;
}

export enum Resolution {
    The1600X900 = "1600x900",
    The1920X1080 = "1920x1080",
}

export enum SensScale {
    CM360 = "cm/360",
    Overwatch = "Overwatch",
    QuakeSource = "Quake/Source",
}

export interface Counts {
    plays: number;
}

export interface Scenario {
    aimType:     null | string;
    authors:     string[];
    description: string;
}
