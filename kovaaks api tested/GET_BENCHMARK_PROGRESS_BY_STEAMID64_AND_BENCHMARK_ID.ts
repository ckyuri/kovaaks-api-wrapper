export interface JSONSchema {
    benchmark_progress: number;
    overall_rank:       number;
    categories:         Categories;
    ranks:              Rank[];
}

export interface Categories {
    "Static Clicking":     StaticClicking;
    "Reactivity Tracking": ReactivityTracking;
    "Dynamic Clicking":    DynamicClicking;
    "Smooth Tracking":     SmoothTracking;
    Switching:             Switching;
    Movement:              Movement;
}

export interface DynamicClicking {
    benchmark_progress: number;
    category_rank:      number;
    rank_maxes:         number[];
    scenarios:          DynamicClickingScenarios;
}

export interface DynamicClickingScenarios {
    "Clicking Bounce": ClickingBounce;
    "Clicking Dodgy":  ClickingBounce;
}

export interface ClickingBounce {
    score:            number;
    leaderboard_rank: number;
    scenario_rank:    number;
    rank_maxes:       number[];
}

export interface Movement {
    benchmark_progress: number;
    category_rank:      number;
    rank_maxes:         number[];
    scenarios:          MovementScenarios;
}

export interface MovementScenarios {
    "Movement Tracking":        ClickingBounce;
    "Movement Clicking Bounce": ClickingBounce;
}

export interface ReactivityTracking {
    benchmark_progress: number;
    category_rank:      number;
    rank_maxes:         number[];
    scenarios:          ReactivityTrackingScenarios;
}

export interface ReactivityTrackingScenarios {
    "Ground Tracking":  ClickingBounce;
    "Air Tracking 180": ClickingBounce;
}

export interface SmoothTracking {
    benchmark_progress: number;
    category_rank:      number;
    rank_maxes:         number[];
    scenarios:          SmoothTrackingScenarios;
}

export interface SmoothTrackingScenarios {
    "Smooth Vertical Tracking": ClickingBounce;
    "Smooth Tracking":          ClickingBounce;
}

export interface StaticClicking {
    benchmark_progress: number;
    category_rank:      number;
    rank_maxes:         number[];
    scenarios:          StaticClickingScenarios;
}

export interface StaticClickingScenarios {
    "Clicking Static 5": ClickingBounce;
    "Clicking 3 Wide":   ClickingBounce;
}

export interface Switching {
    benchmark_progress: number;
    category_rank:      number;
    rank_maxes:         number[];
    scenarios:          SwitchingScenarios;
}

export interface SwitchingScenarios {
    "Switching Humanoid": ClickingBounce;
    "Switching Spheres":  ClickingBounce;
}

export interface Rank {
    icon:             string;
    name:             string;
    color:            string;
    frame:            string;
    description:      string;
    playercard_large: string;
    playercard_small: string;
}
