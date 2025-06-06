export interface JSONSchema {
    page:  number;
    max:   number;
    total: number;
    data:  Datum[];
}

export interface Datum {
    benchmarkName:   string;
    benchmarkId:     number;
    benchmarkIcon:   string;
    benchmarkAuthor: string;
    type:            Type;
    tintRanks:       boolean;
    rankName:        RankName;
    rankIcon:        string;
    rankColor:       string;
}

export enum RankName {
    DiamondIII = "Diamond III",
    NoRank = "No Rank",
    The05 = "0/5",
}

export enum Type {
    Benchmark = "benchmark",
    Workout = "workout",
}
