// kovaaks api tested/SEARCH_SCENARIOS_BY_SCENARIO_NAME.ts
export namespace SearchScenariosByScenarioName {
    export interface Response {
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
}

// kovaaks api tested/GET_BENCHMARK_PROGRESS_BY_STEAMID64_AND_BENCHMARK_ID.ts
export namespace GetBenchmarkProgressBySteamId64AndBenchmarkId {
    export interface Response {
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
}

// kovaaks api tested/GET GLOBAL LEADERBOARD SCORES.ts
export namespace GetGlobalLeaderboardScores {
    export interface Response {
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
}

// kovaaks api tested/GET BENCHMARK PROGRESS FOR WEBAPP USERNAME.ts
export namespace GetBenchmarkProgressForWebappUsername {
    export interface Response {
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
}

// kovaaks api tested/GET PLAYLISTS CREATED BY USER.ts
export namespace GetPlaylistsCreatedByUser {
    export interface Response {
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
}

// kovaaks api tested/GET_SCENARIOS_PLAYED_BY_USERNAME_SORTED_BY_PLAYS.ts
export namespace GetScenariosPlayedByUsernameSortedByPlays {
    export interface Response {
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
}

// kovaaks api tested/GET RECENT SCENARIO HIGH SCORES BY USERNAME.ts
export namespace GetRecentScenarioHighScoresByUsername {
    export interface Response {
        timestamp:          Date;
        type:               string;
        scenarioName:       string;
        score:              number;
        leaderboardId:      number;
        username:           string;
        webappUsername:     string;
        steamId:            string;
        steamAccountName:   string;
        steamAccountAvatar: string;
        country:            string;
        kovaaksPlus:        boolean;
    }
}

// kovaaks api tested/GET_FAVORITE_SCENARIOS_BY_USERNAME.ts
export namespace GetFavoriteScenariosByUsername {
    export interface Response {
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
}

// kovaaks api tested/TOTAL_SCENARIOS_COUNT.ts
export namespace TotalScenariosCount {
    export interface Response {
        customScenarioCount: number;
    }
}

// kovaaks api tested/GET_PROFILE_BY_WEBAPP_USERNAME.ts
export namespace SearchUsers {
    export interface Response {
        steamId:            string;
        username:           string;
        steamAccountName:   string;
        steamAccountAvatar: string;
        country:            string;
        kovaaksPlusActive:  boolean;
    }
}

export namespace GetProfileByWebappUsername {
    export interface Response {
        playerId:           number;
        steamAccountName:   string;
        steamAccountAvatar: string;
        created:            Date;
        steamId:            string;
        clientBuildVersion: string;
        lastAccess:         Date;
        webapp:             Webapp;
        country:            string;
        kovaaksPlusActive:  boolean;
        badges:             any[];
        followCounts:       FollowCounts;
        kovaaksPlus:        KovaaksPlus;
        scenariosPlayed:    string;
    }

    export interface FollowCounts {
        following: number;
        followers: number;
    }

    export interface KovaaksPlus {
        active:     boolean;
        expiration: Date;
    }

    export interface Webapp {
        roles:               Roles;
        videos:              any[];
        username:            string;
        socialMedia:         SocialMedia;
        gameSettings:        GameSettings;
        profileImage:        null;
        profileViews:        number;
        hasSubscribed:       boolean;
        gamingPeripherals:   GamingPeripherals;
        username_changed_at: Date;
    }

    export interface GameSettings {
        dpi:         null;
        fov:         null;
        cm360:       null;
        rawInput:    string;
        sensitivity: null;
    }

    export interface GamingPeripherals {
        mouse:    string;
        headset:  null;
        monitor:  null;
        keyboard: null;
        mousePad: string;
    }

    export interface Roles {
        admin: boolean;
        coach: boolean;
        staff: boolean;
    }

    export interface SocialMedia {
        tiktok:     null;
        twitch:     null;
        discord:    string;
        twitter:    null;
        youtube:    null;
        discord_id: string;
    }
}

// kovaaks api tested/GET_TRENDING_SCENARIOS.ts
export namespace GetTrendingScenarios {
    export interface Response {
        scenarioName:      string;
        leaderboardId:     number;
        webappUsername:    null | string;
        steamAccountName:  string;
        kovaaksPlusActive: boolean;
        entries:           number;
        new:               boolean;
    }
}

// kovaaks api tested/GET MONTHLY PLAYERS COUNT.ts
export namespace GetMonthlyPlayersCount {
    export interface Response {
        count: number;
    }
}

// kovaaks api tested/GET_CONCURRENT_USERS.ts
export namespace GetConcurrentUsers {
    export interface Response {
        concurrentUsers: number;
    }
}

// kovaaks api tested/FEATURED_HIGH_SCORES.ts
export namespace FeaturedHighScores {
    export interface Response {
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
}

// kovaaks api tested/GET_SCENARIO_DETAILS_BY_LEADERBOARD_ID.ts
export namespace GetScenarioDetailsByLeaderboardId {
    export interface Response {
        scenarioName:     string;
        aimType:          string;
        playCount:        number;
        steamId:          string;
        steamAccountName: string;
        webappUsername:   string;
        description:      string;
        tags:             string[];
        created:          Date;
    }
}

// kovaaks api tested/SCENARIO LEADERBOARD SCORE SEARCH.ts
export namespace ScenarioLeaderboardScoreSearch {
    export interface Response {
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
}

export namespace LastScoresByScenarioName {
  export interface ScoreAttributes {
    fov: number;
    hash: string;
    cm360: number;
    epoch?: string;
    kills: number;
    score: number;
    avgFps: number;
    avgTtk: number;
    fovScale: string;
    vertSens: number;
    horizSens: number;
    resolution: string;
    sensScale: string;
    accuracyDamage: number;
    challengeStart: string;
    modelOverrides: {
      cuboid: { skin: string; model: string };
      spheroid: { skin: string; model: string };
      cylindrical: { skin: string; model: string };
    };
    sensRandomizer: any;
    scenarioVersion: string;
    clientBuildVersion: string;
  }

  export interface ScoreData {
    score: number;
    attributes: ScoreAttributes;
  }

  export type Response = ScoreData[];
} 