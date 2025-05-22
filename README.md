# Kovaaks API Client

A TypeScript client for the Kovaaks API that provides easy access to leaderboards, user profiles, scenarios, playlists, and benchmarks.

## Features

- 🔐 Authentication and token management
- 📊 Global and country-specific leaderboards
- 🎯 Scenario details and popular/trending scenarios
- 📋 Playlist management
- 📈 Benchmark progress tracking
- 👤 User profiles and activity statistics
- 🎮 Game settings and global statistics

## Installation

```bash
npm install kovaaks-api-client
```

## Quick Start

```typescript
import { KovaaksApiClient } from 'kovaaks-api-client';

// Create a new client instance
const client = new KovaaksApiClient();

// Optional: Configure with custom options
const client = new KovaaksApiClient({
  baseUrl: 'https://kovaaks.com', // Optional: Custom base URL
  timeout: 10000,                 // Optional: Request timeout in milliseconds
  authToken: 'your-token'         // Optional: Authentication token
});

// Example: Login and get user profile
const loginResponse = await client.login({
  username: 'your-email@example.com',
  password: 'your-password'
});
```

## API Documentation

### Authentication

#### Login
```typescript
const loginResponse = await client.login({
  username: 'your-email@example.com',
  password: 'your-password'
});

// Response example:
// {
//   "auth": {
//     "firebaseJWT": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI...",
//     "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
//     "refreshToken": "686366f5-4ae5-41d0-8338-b385bbae7579",
//     "exp": 1743677681,
//     "emailVerified": true,
//     "steamAccountNameIds": {
//       "playerName": "76561198409458631"
//     }
//   },
//   "profile": {
//     "playerId": 881033,
//     "steamAccountName": "playerName",
//     "steamAccountAvatar": "https://avatars.steamstatic.com/d4b245bf50ac14190970b2b9cacf7e8762a70635_full.jpg",
//     "created": "2021-07-24T22:58:30.915Z",
//     "steamId": "76561198409458631",
//     "clientBuildVersion": "3.7.6.2025-03-13-13-18-42-a0d7bc7cd2e8",
//     "lastAccess": "2025-03-24T17:34:32.986Z",
//     "webapp": {
//       "roles": { "admin": false, "coach": false, "staff": false },
//       "videos": [],
//       "username": "user@example.com"
//     },
//     "country": "us"
//   },
//   "redirect": false
// }
```

#### Token Management
```typescript
// Set auth token manually
client.setAuthToken('your-token');

// Verify token validity
const isValid = await client.verifyToken();

// Clear auth token
client.clearAuthToken();
```

### Leaderboards

#### Get Global Leaderboard
```typescript
const leaderboard = await client.getGlobalLeaderboard({
  page: 0,
  max: 20,
  group?: 'country' | 'region',
  filterType?: 'region' | 'country',
  filterValue?: string
});

// Response example:
// {
//   "data": [
//     {
//       "rank": 1,
//       "rankChange": 0,
//       "steamId": "76561199247873110",
//       "webappUsername": "playerName",
//       "steamAccountName": "playerAlias",
//       "points": "42788553",
//       "scenariosCount": "3700",
//       "completionsCount": 34528,
//       "kovaaksPlusActive": true,
//       "country": "JP"
//     },
//     ... more entries ...
//   ],
//   "total": "1475018"
// }
```

#### Get Country Leaderboard
```typescript
// Requires authentication and Kovaaks+ subscription
const countryLeaderboard = await client.getCountryLeaderboard({
  page: 0,
  max: 20,
  countryCode: 'US' // ISO country code
});

// Response example:
// {
//   "data": [
//     {
//       "rank": 1,
//       "rankChange": 0,
//       "steamId": "76561198390284214",
//       "webappUsername": "PlayerUSA",
//       "steamAccountName": "PlayerAlias",
//       "points": "42431633",
//       "scenariosCount": "3536",
//       "completionsCount": 15355,
//       "kovaaksPlusActive": true,
//       "country": "US"
//     },
//     ... more entries ...
//   ],
//   "total": "354278"
// }
```

#### Search Global Leaderboard
```typescript
const searchResults = await client.searchGlobalLeaderboard({
  username: 'firefly'
});

// Response example:
// [
//   {
//     "steamId": "76561198123456789",
//     "rank": 352,
//     "rankChange": 5,
//     "username": "firefly",
//     "steamAccountName": "firefly2025",
//     "steamAccountAvatar": "https://avatars.steamstatic.com/abc123_full.jpg",
//     "country": "ca",
//     "kovaaksPlusActive": true
//   },
//   ... more matches ...
// ]
```

#### Get Scenario Leaderboard (by leaderboardId)
```typescript
const scenarioLeaderboard = await client.getScenarioLeaderboard({
  leaderboardId: 8680, // The scenario's leaderboardId
  page: 0,             // Optional: page number (default 0)
  max: 50              // Optional: max results per page (default 50)
});

// Response example:
// {
//   "total": 698126,
//   "page": 0,
//   "max": 50,
//   "data": [
//     {
//       "steamId": "76561198305528151",
//       "score": 5520,
//       "rank": 1,
//       "steamAccountName": "雑魚AIMのG",
//       "webappUsername": "Garun3141",
//       "kovaaksPlusActive": false,
//       "country": "jp",
//       "attributes": { /* ... scenario-specific attributes ... */ }
//     },
//     // ... more entries ...
//   ]
// }
```

### User Search & Profiles

#### Search Users
```typescript
const users = await client.searchUsers({
  username: 'wow'
});

// Response example:
// [
//   {
//     "steamId": "76561199088730578",
//     "username": "wowman681",
//     "steamAccountName": "deathbringer6886",
//     "steamAccountAvatar": "https://avatars.steamstatic.com/9ed36beb5d09f2eafba210f988322cf050f1eb08_full.jpg",
//     "country": "us",
//     "kovaaksPlusActive": false
//   },
//   {
//     "steamId": "76561198851782641",
//     "username": "Wowzers",
//     "steamAccountName": "Wowzers",
//     "steamAccountAvatar": "https://avatars.steamstatic.com/f0f14d001cc62e3da040933f1101b9a27e9fa1f4_full.jpg",
//     "country": "us",
//     "kovaaksPlusActive": false
//   },
//   ... more matches ...
// ]
```

#### Get User Profile
```typescript
// Requires authentication
const profile = await client.getUserProfile();

// Response example:
// {
//   "playerId": 881033,
//   "steamAccountName": "playerName",
//   "steamAccountAvatar": "https://avatars.steamstatic.com/d4b245bf50ac14190970b2b9cacf7e8762a70635_full.jpg",
//   "created": "2021-07-24T22:58:30.915Z",
//   "steamId": "76561198409458631",
//   "clientBuildVersion": "3.7.6.2025-03-13-13-18-42-a0d7bc7cd2e8",
//   "lastAccess": "2025-03-24T17:34:32.986Z",
//   "webapp": {
//     "roles": {
//       "admin": false,
//       "coach": false,
//       "staff": false
//     },
//     "videos": [],
//     "username": "user@example.com",
//     "socialMedia": {
//       "tiktok": null,
//       "twitch": null,
//       "discord": "discordUser",
//       "twitter": null,
//       "youtube": null,
//       "discord_id": "934987217456209951"
//     },
//     "gameSettings": {
//       "dpi": null,
//       "fov": null,
//       "cm360": null,
//       "rawInput": "true",
//       "sensitivity": null
//     },
//     "profileImage": null,
//     "profileViews": 25,
//     "hasSubscribed": false,
//     "gamingPeripherals": {
//       "mouse": "Gaming Mouse X2 V3",
//       "headset": null,
//       "monitor": null,
//       "keyboard": null,
//       "mousePad": "Gaming Pad 2"
//     }
//   },
//   "country": "us",
//   "kovaaksPlusActive": false,
//   "badges": [],
//   "scenariosPlayed": "2616"
// }
```

#### Get User Profile by Username
```typescript
const profile = await client.getUserProfileByUsername({
  username: 'username'
});

// Response has the same format as getUserProfile
```

#### Get User Activity
```typescript
const activity = await client.getUserActivity({
  username: 'username'
});

// Response example:
// [
//   {
//     "timestamp": "2025-03-24T17:43:23.724Z",
//     "type": "HIGH_SCORE",
//     "scenarioName": "VT Aether Intermediate S5",
//     "score": 2429,
//     "leaderboardId": 101369,
//     "username": "user@example.com",
//     "webappUsername": "user@example.com",
//     "steamId": "76561198409458631",
//     "steamAccountName": "playerName",
//     "steamAccountAvatar": "https://avatars.steamstatic.com/d4b245bf50ac14190970b2b9cacf7e8762a70635_full.jpg",
//     "country": "us",
//     "kovaaksPlus": false
//   },
//   ... more activities ...
// ]
```

#### Get User Scenarios
```typescript
const scenarios = await client.getUserScenarios({
  username: 'username',
  page: 0,
  max: 20,
  sortParam: 'count'
});

// Response example:
// {
//   "page": 0,
//   "max": 20,
//   "total": 378,
//   "data": [
//     {
//       "leaderboardId": "5203",
//       "scenarioName": "patTS Voltaic 360 Easy",
//       "counts": {
//         "plays": 27
//       },
//       "rank": 512,
//       "score": 6240,
//       "attributes": {
//         "resolution": "1920x1080",
//         "fov": 103,
//         "cm360": 34.6363639831543,
//         "sens_scale": "Overwatch"
//         // more attributes...
//       },
//       "scenario": {
//         "aimType": null,
//         "authors": ["patys", "voxel", "sini"],
//         "description": "PatTargetSwitch with no bodies..."
//       }
//     },
//     ... more scenarios ...
//   ]
// }
```

### Scenarios

#### Get Scenario Details
```typescript
const details = await client.getScenarioDetails({
  leaderboardId: 8680
});

// Response example:
// {
//   "scenarioName": "VT Pasu Intermediate S5",
//   "aimType": "Clicking",
//   "playCount": 198364,
//   "steamId": "76561198123456789",
//   "steamAccountName": "ScenarioCreator",
//   "webappUsername": "CreatorName",
//   "description": "Semi auto click timing with four targets...",
//   "tags": ["clicking", "flicking", "timing"],
//   "created": "2023-05-10T12:34:56.789Z"
// }
```

#### Get Popular Scenarios
```typescript
const popular = await client.getPopularScenarios({
  page: 0,
  max: 20,
  scenarioNameSearch: 'vt bounce'
});

// Response example:
// {
//   "page": 0,
//   "max": 20,
//   "total": 53,
//   "data": [
//     {
//       "rank": 1,
//       "leaderboardId": 98330,
//       "scenarioName": "VT Bounce Intermediate S5",
//       "scenario": {
//         "aimType": "Clicking",
//         "authors": ["Author1", "Author2"],
//         "description": "Scenario description here..."
//       },
//       "counts": {
//         "plays": 235687,
//         "entries": 32150
//       },
//       "topScore": {
//         "score": 1240
//       }
//     },
//     ... more scenarios ...
//   ]
// }
```

#### Get Trending Scenarios
```typescript
const trending = await client.getTrendingScenarios();

// Response example:
// [
//   {
//     "scenarioName": "VT Snake Track Elite Hard Entry Size",
//     "leaderboardId": 114924,
//     "webappUsername": "Creator Name",
//     "steamAccountName": "CreatorGameName",
//     "kovaaksPlusActive": false,
//     "entries": 44,
//     "new": true
//   },
//   ... more scenarios ...
// ]
```

### Playlists

#### Get Playlists
```typescript
const playlists = await client.getPlaylists({
  page: 0,
  max: 20,
  search: 'aim training'
});

// Response example:
// {
//   "page": 0,
//   "max": 20,
//   "total": 156,
//   "data": [
//     {
//       "playlistName": "Complete Aim Training",
//       "subscribers": 5280,
//       "scenarioList": [
//         {
//           "author": "Author1",
//           "aimType": "Clicking",
//           "playCount": 158763,
//           "scenarioName": "VT Pasu Intermediate",
//           "webappUsername": "Creator",
//           "steamAccountName": "CreatorGameName"
//         },
//         ... more scenarios ...
//       ],
//       "playlistCode": "KW4B2",
//       "playlistId": 4235,
//       "published": "2024-01-15T08:45:12.789Z",
//       "steamId": "76561198123456789",
//       "steamAccountName": "PlaylistCreator",
//       "webappUsername": "CreatorName",
//       "description": "A complete aim training routine...",
//       "aimType": "Mixed",
//       "playlistDuration": 45
//     },
//     ... more playlists ...
//   ]
// }
```

### Benchmarks

#### Get Benchmark Progress
```typescript
const progress = await client.getBenchmarkProgress({
  benchmarkId: '2',
  steamId: '76561198409458631',
  page: 0,
  max: 100
});

// Response example:
// {
//   "benchmark_progress": 95088.2,
//   "overall_rank": 15,
//   "categories": {
//     "Static Clicking": {
//       "benchmark_progress": 16337.47,
//       "category_rank": 15,
//       "rank_maxes": [1052.63, 2105.26, 3157.89, 4210.53],
//       "scenarios": {
//         "Clicking Static 5": {
//           "score": 9168600,
//           "leaderboard_rank": 10761,
//           "scenario_rank": 15,
//           "rank_maxes": [54390, 59829, 62937]
//         },
//         ... more scenarios ...
//       }
//     },
//     ... more categories ...
//   },
//   "ranks": [
//     {
//       "icon": "https://storage.googleapis.com/cdn_dev/benchmark_test_icons/RB_None.svg",
//       "name": "No Rank",
//       "color": " ",
//       "frame": "https://storage.googleapis.com/cdn_dev/benchmark_test_icons/RF_None.svg",
//       "description": "This is No rank!",
//       "playercard_large": "https://storage.googleapis.com/cdn_dev/benchmark_test_icons/PopUp/PC_00_NoRank.png",
//       "playercard_small": "https://storage.googleapis.com/cdn_dev/benchmark_test_icons/MainScreen/PM_00_NoRank.png"
//     },
//     ... more ranks ...
//   ]
// }
```

#### Get Benchmarks for User
```typescript
const benchmarks = await client.getBenchmarksForUser({
  username: 'username',
  page: 0,
  max: 20
});

// Response example:
// {
//   "page": 1,
//   "max": 10,
//   "total": 52,
//   "data": [
//     {
//       "benchmarkName": "Temeski tracking V2",
//       "benchmarkId": 71,
//       "benchmarkIcon": "https://storage.googleapis.com/cdn_dev/benchmarks/icons/BM_01.svg",
//       "benchmarkAuthor": "Temeski",
//       "type": "benchmark",
//       "tintRanks": false,
//       "rankName": "No Rank",
//       "rankIcon": "https://storage.googleapis.com/cdn_dev/benchmarks/ranks/KvK/Rank00.svg",
//       "rankColor": "#424242"
//     },
//     ... more benchmarks ...
//   ]
// }
```

### Game Data

#### Get Monthly Players
```typescript
const monthlyPlayers = await client.getMonthlyPlayers();

// Response example:
// {
//   "count": 320866
// }
```

#### Get Game Settings
```typescript
const settings = await client.getGameSettings();

// Response example:
// {
//   "sensitivities": {
//     "games": [
//       {
//         "name": "Overwatch",
//         "fov_scales": ["103 OW", "80 OW"]
//       },
//       ... more games ...
//     ],
//     "fov_scales": [
//       {
//         "name": "Overwatch",
//         "settings": {
//           "default_fov": 103,
//           "min_fov": 80,
//           "max_fov": 103
//         }
//       },
//       ... more FOV scales ...
//     ]
//   }
// }
```

## Error Handling

The client throws `KovaaksApiError` for API-related errors. You can catch and handle them like this:

```typescript
try {
  const data = await client.getUserProfile();
} catch (error) {
  if (error instanceof KovaaksApiError) {
    console.error(`API Error (${error.status}):`, error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

Common error scenarios:
- 401: Authentication required or invalid token
- 403: Insufficient permissions (e.g., Kovaaks+ required)
- 404: Resource not found
- 429: Rate limit exceeded
- 500: Server error

## Extending the Client

The client is designed to be easily extensible so you can add custom methods or override existing functionality without modifying the source code.

> **Example File**: Check out [examples/extending-client.ts](examples/extending-client.ts) for a complete demonstration of extending the API client with custom methods and creating a subclass with caching functionality.

### Adding Custom Methods

You can extend the client with custom methods using the `extend()` method:

```typescript
import { KovaaksApiClient } from 'kovaaks-api-client';

// Create a client instance
const client = new KovaaksApiClient();

// Extend the client with custom methods
const extendedClient = client.extend({
  // Add a custom method to get the top 10 players for a scenario
  async getScenarioTopPlayers(leaderboardId: number) {
    // You have access to all protected methods like this.request, this.buildUrl, etc.
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/scenario-scores', {
        leaderboardId,
        page: 0,
        max: 10
      })
    });
  },

  // Add any other custom methods
  async customEndpoint(param1: string, param2: number) {
    return this.request(
      this.createRequestConfig('GET', '/custom/endpoint', null, { param1, param2 })
    );
  }
});

// Use your custom methods
const topPlayers = await extendedClient.getScenarioTopPlayers(12345);
const customData = await extendedClient.customEndpoint('value', 42);
```

### Creating a Custom Client Class

For more advanced extensions, you can create a subclass:

```typescript
import { KovaaksApiClient, KovaaksApiClientOptions } from 'kovaaks-api-client';

class CustomKovaaksClient extends KovaaksApiClient {
  constructor(options: KovaaksApiClientOptions = {}) {
    super(options);
  }
  
  // Add custom methods
  async getScenarioTopPlayers(leaderboardId: number) {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/scenario-scores', {
        leaderboardId,
        page: 0,
        max: 10
      })
    });
  }
  
  // Override existing methods
  async getGlobalLeaderboard(params) {
    // Add custom logic before or after the API call
    console.log('Fetching global leaderboard with custom client...');
    const result = await super.getGlobalLeaderboard(params);
    console.log('Leaderboard fetched successfully!');
    return result;
  }
}

// Use your custom client
const client = new CustomKovaaksClient();
const topPlayers = await client.getScenarioTopPlayers(12345);
```

### Customizing Request Configuration

You can provide custom request configuration when creating the client:

```typescript
const client = new KovaaksApiClient({
  customRequestConfig: {
    // Add any axios request config options
    headers: {
      'User-Agent': 'My Custom App',
    },
    validateStatus: status => status < 500,
    // ... any other axios configuration options
  }
});
```

## Type Reference

### Client Types

```typescript
// Client configuration
interface KovaaksApiClientOptions {
  baseUrl?: string;
  authToken?: string;
  timeout?: number;
}

// Error class
class KovaaksApiError extends Error {
  status: number;
  response?: any;
}

// Authentication
interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
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
```

### User & Profile Types

```typescript
interface UserProfile {
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

interface UserSearchResponse {
  steamId: string;
  username: string;
  steamAccountName: string;
  steamAccountAvatar: string;
  country: string | null;
  kovaaksPlusActive: boolean;
}

interface UserActivity {
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
```

### Leaderboard Types

```typescript
interface GlobalLeaderboardResponse {
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

interface GroupedLeaderboardResponse {
  data: Array<{
    group: string;
    points: string;
    scenarios_count: string;
    completions_count: string;
    rank: number;
  }>;
  total: string;
}

interface GlobalLeaderboardSearchResponse {
  steamId: string;
  rank: number;
  rankChange: number;
  username: string | null;
  steamAccountName: string;
  steamAccountAvatar: string;
  country: string | null;
  kovaaksPlusActive: boolean;
}

// Parameter types
interface GetGlobalLeaderboardParams {
  page: number;
  max: number;
  group?: 'country' | 'region';
  filterType?: 'region' | 'country';
  filterValue?: string;
}

interface GetCountryLeaderboardParams {
  page: number;
  max: number;
  countryCode: string;
}

interface GetGlobalLeaderboardSearchParams {
  username: string;
}
```

### Scenario Types

```typescript
interface ScenarioPopularResponse {
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

interface ScenarioDetailsResponse {
  scenarioName: string;
  aimType: string;
  playCount: number;
  steamId: string;
  steamAccountName: string;
  webappUsername: string;
  description: string;
  tags: string[];
  created: string;
}

interface TrendingScenario {
  scenarioName: string;
  leaderboardId: number;
  webappUsername: string | null;
  steamAccountName: string;
  kovaaksPlusActive: boolean;
  entries: number;
  new: boolean;
}

interface UserScenarioResponse {
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

// Parameter types
interface GetPopularScenariosParams {
  page: number;
  max: number;
  scenarioNameSearch?: string;
}

interface GetScenarioDetailsParams {
  leaderboardId: number;
}

interface GetUserScenarioParams {
  username: string;
  page: number;
  max: number;
  sortParam?: string;
}
```

### Benchmark Types

```typescript
interface BenchmarkProgress {
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

interface BenchmarkSearchResponse {
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

// Parameter types
interface GetBenchmarkProgressParams {
  benchmarkId: string;
  steamId: string;
  page?: number;
  max?: number;
}

interface GetBenchmarksForUserParams {
  username: string;
  page: number;
  max: number;
}
```

### Playlist Types

```typescript
interface PlaylistResponse {
  page: number;
  max: number;
  total: number;
  data: Array<{
    playlistName: string;
    subscribers: number;
    scenarioList: Array<{
      author: string;
      aimType: string;
      playCount: number;
      scenarioName: string;
      webappUsername: string;
      steamAccountName: string;
    }>;
    playlistCode: string;
    playlistId: number;
    published: string;
    steamId: string;
    steamAccountName: string;
    webappUsername: string;
    description: string;
    aimType: string;
    playlistDuration: number;
  }>;
}

// Parameter types
interface GetPlaylistsParams {
  page: number;
  max: number;
  search?: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 