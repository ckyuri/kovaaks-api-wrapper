// Types based on Kovaaks OpenAPI spec

export interface BenchmarkProgress {
  benchmark_progress: number;
  overall_rank: number;
  categories: {
    [key: string]: {
      benchmark_progress: number;
      category_rank: number;
      rank_maxes: number[];
      scenarios: {
        [key: string]: {
          score: number;
          leaderboard_rank: number;
          scenario_rank: number;
          rank_maxes: number[];
        };
      };
    };
  };
  ranks: Array<{
    icon: string;
    name: string;
    color: string;
    frame: string;
    description: string;
    playercard_large: string;
    playercard_small: string;
  }>;
}

export interface BenchmarkSearchResponse {
  page: number;
  max: number;
  total: number;
  data: Array<{
    benchmarkName: string;
    benchmarkId: number;
    benchmarkIcon: string;
    benchmarkAuthor: string;
    type: 'benchmark' | 'workout';
    tintRanks: boolean;
    rankName: string;
    rankIcon: string;
    rankColor: string;
  }>;
}

export interface GlobalLeaderboardResponse {
  data: Array<{
    rank: number;
    rankChange: number;
    steamId: string;
    webappUsername: string | null;
    steamAccountName: string;
    points: string;
    scenariosCount: string;
    completionsCount: number;
    kovaaksPlusActive: boolean;
    country: string;
  }>;
  total: string;
}

export interface GroupedLeaderboardResponse {
  data: Array<{
    group: string;
    points: string;
    scenarios_count: string;
    completions_count: string;
    rank: number;
  }>;
  total: string;
}

export interface LoginResponse {
  auth: {
    firebaseJWT: string;
    jwt: string;
    refreshToken: string;
    exp: number;
    emailVerified: boolean;
    steamAccountNameIds: { [key: string]: string };
  };
  profile: UserProfile;
  redirect: boolean;
}

export interface UserProfile {
  playerId: number;
  steamAccountName: string;
  steamAccountAvatar: string;
  created: string;
  steamId: string;
  clientBuildVersion: string;
  lastAccess: string;
  webapp: {
    roles: {
      admin: boolean;
      coach: boolean;
      staff: boolean;
    };
    videos: Array<any>;
    username: string;
    socialMedia: {
      tiktok: string | null;
      twitch: string | null;
      discord: string | null;
      twitter: string | null;
      youtube: string | null;
      discord_id: string | null;
    };
    gameSettings: {
      dpi: number | null;
      fov: number | null;
      cm360: number | null;
      rawInput: string;
      sensitivity: number | null;
    };
    profileImage: string | null;
    profileViews: number;
    hasSubscribed: boolean;
    gamingPeripherals: {
      mouse: string | null;
      headset: string | null;
      monitor: string | null;
      keyboard: string | null;
      mousePad: string | null;
    };
  };
  country: string;
  kovaaksPlusActive: boolean;
  discord_id: string | null;
  discord_username: string | null;
  hideDiscord: boolean;
  badges: Array<any>;
  followCounts: {
    following: number;
    followers: number;
  };
  kovaaksPlus: {
    active: boolean;
    expiration: string | null;
  };
  scenariosPlayed: string;
  features: {
    global_leaderboards: boolean;
  };
}

export interface UserActivity {
  timestamp: string;
  type: string;
  scenarioName: string;
  score: number;
  leaderboardId: number;
  username: string;
  webappUsername: string;
  steamId: string;
  steamAccountName: string;
  steamAccountAvatar: string;
  country: string;
  kovaaksPlus: boolean;
}

export interface ScenarioPopularResponse {
  page: number;
  max: number;
  total: number;
  data: Array<{
    rank: number;
    leaderboardId: number;
    scenarioName: string;
    scenario: {
      aimType: string | null;
      authors: string[];
      description: string;
    };
    counts: {
      plays: number;
      entries: number;
    };
    topScore: {
      score: number;
    };
  }>;
}

export interface UserScenarioResponse {
  page: number;
  max: number;
  total: number;
  data: Array<{
    leaderboardId: string;
    scenarioName: string;
    counts: {
      plays: number;
    };
    rank: number;
    score: number;
    attributes: { [key: string]: any };
    scenario: {
      aimType: string | null;
      authors: string[];
      description: string;
    };
  }>;
}

export interface TrendingScenario {
  scenarioName: string;
  leaderboardId: number;
  webappUsername: string | null;
  steamAccountName: string;
  kovaaksPlusActive: boolean;
  entries: number;
  new: boolean;
}

// Parameter interfaces
export interface GetBenchmarkProgressParams {
  benchmarkId: string;
  steamId: string;
  page?: number;
  max?: number;
}

export interface GetBenchmarksForUserParams {
  username: string;
  page: number;
  max: number;
}

export interface GetGlobalLeaderboardParams {
  page: number;
  max: number;
  group?: 'country' | 'region';
  filterType?: 'region' | 'country';
  filterValue?: string;
}

export interface GetUserActivityParams {
  username: string;
}

export interface GetPopularScenariosParams {
  page: number;
  max: number;
  scenarioNameSearch?: string;
}

export interface GetUserProfileByUsernameParams {
  username: string;
}

export interface GetUserScenarioParams {
  username: string;
  page: number;
  max: number;
  sortParam?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Error types
export interface ApiError {
  error: string;
  details?: string[];
}

export interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
} 