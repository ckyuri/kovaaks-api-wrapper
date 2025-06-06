export interface JSONSchema {
    page:  number;
    max:   number;
    total: number;
    data:  Datum[];
}

export interface Datum {
    rank:          number;
    leaderboardId: number;
    scenarioName:  string;
    scenario:      Scenario;
    counts:        Counts;
    topScore:      TopScore;
}

export interface Counts {
    plays:   number;
    entries: number;
}

export interface Scenario {
    aimType:     AimType | null;
    authors:     string[];
    description: string;
}

export enum AimType {
    Clicking = "Clicking",
    TargetSwitching = "Target Switching",
    Tracking = "Tracking",
}

export interface TopScore {
    score: number;
}
