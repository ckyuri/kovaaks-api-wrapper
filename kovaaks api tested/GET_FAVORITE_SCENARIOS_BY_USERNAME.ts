export interface JSONSchema {
    leaderboardId: string;
    scenarioName:  string;
    score:         number;
    scoreHistory:  ScoreHistory[];
}

export interface ScoreHistory {
    score:      number;
    attributes: Attributes;
}

export interface Attributes {
    fov?:      number;
    cm360:     number;
    epoch:     string;
    horizSens: number;
}
