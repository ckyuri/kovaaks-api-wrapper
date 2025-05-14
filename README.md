# Kovaaks API Wrapper

A TypeScript wrapper for the Kovaaks API that provides easy access to leaderboards, user profiles, scenarios, and more.

## Installation

```bash
npm install kovaaks-api-wrapper
```

## Usage

```typescript
import { KovaaksApiClient } from 'kovaaks-api-wrapper';

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

// Example: Get global leaderboard
const globalLeaderboard = await client.getGlobalLeaderboard({
  page: 0,
  max: 20
});

// Example: Get country leaderboard (requires auth and Kovaaks+)
const countryLeaderboard = await client.getCountryLeaderboard({
  page: 0,
  max: 20,
  countryCode: 'US'
});

// Example: Search global leaderboard
const searchResults = await client.searchGlobalLeaderboard({
  username: 'firefly'
});

// Example: Get playlists
const playlists = await client.getPlaylists({
  page: 0,
  max: 20,
  search: 'aim training'
});

// Example: Get scenario details
const scenarioDetails = await client.getScenarioDetails({
  leaderboardId: 8680
});

// Example: Get popular scenarios
const popularScenarios = await client.getPopularScenarios({
  page: 0,
  max: 20,
  scenarioNameSearch: 'vt bounce'
});

// Example: Get trending scenarios
const trendingScenarios = await client.getTrendingScenarios();

// Example: Get user profile
const userProfile = await client.getUserProfileByUsername({
  username: 'firefly'
});

// Example: Get user activity
const userActivity = await client.getUserActivity({
  username: 'firefly'
});

// Example: Get user scenarios
const userScenarios = await client.getUserScenarios({
  username: 'firefly',
  page: 0,
  max: 20
});

// Example: Get benchmark progress
const benchmarkProgress = await client.getBenchmarkProgress({
  benchmarkId: 'benchmark-id',
  steamId: 'steam-id'
});

// Example: Get monthly players
const monthlyPlayers = await client.getMonthlyPlayers();

// Example: Get game settings
const gameSettings = await client.getGameSettings();
```

## Authentication

### Login
```typescript
const loginResponse = await client.login({
  username: 'your-email@example.com',
  password: 'your-password'
});

// The auth token is automatically set for future requests
```

### Verify Token
```typescript
const isValid = await client.verifyToken();
```

### Set/Clear Auth Token
```typescript
client.setAuthToken('your-token');
client.clearAuthToken();
```

## API Methods

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
```

#### Get Country Leaderboard
```typescript
// Requires authentication and supporter status
const countryLeaderboard = await client.getCountryLeaderboard({
  page: 0,
  max: 20,
  countryCode: 'US' // ISO country code
});
```

> **Note**: Access to country-specific leaderboards requires:
> 1. Authentication (valid auth token)
> 2. Supporter status (Kovaaks+ subscription)
> 
> If these requirements are not met, the API will return a 401 Unauthorized error.

#### Search Global Leaderboard
```typescript
const searchResults = await client.searchGlobalLeaderboard({
  username: 'firefly'
});
```

### User Data

#### Get User Profile
```typescript
// Requires authentication
const profile = await client.getUserProfile();
```

#### Get User Profile by Username
```typescript
const profile = await client.getUserProfileByUsername({
  username: 'username'
});
```

#### Get User Activity
```typescript
const activity = await client.getUserActivity({
  username: 'username'
});
```

#### Get User Scenarios
```typescript
const scenarios = await client.getUserScenarios({
  username: 'username',
  page: 0,
  max: 20,
  sortParam?: string
});
```

### Benchmarks

#### Get Benchmark Progress
```typescript
const progress = await client.getBenchmarkProgress({
  benchmarkId: 'benchmark-id',
  steamId: 'steam-id',
  page?: 0,
  max?: 100
});
```

#### Get Benchmarks for User
```typescript
const benchmarks = await client.getBenchmarksForUser({
  username: 'username',
  page: 0,
  max: 20
});
```

### Scenarios

#### Get Trending Scenarios
```typescript
const trending = await client.getTrendingScenarios();
```

#### Get Popular Scenarios
```typescript
const popular = await client.getPopularScenarios({
  page: 0,
  max: 20,
  scenarioNameSearch?: string
});
```

#### Get Scenario Details
```typescript
const details = await client.getScenarioDetails({
  leaderboardId: 8680
});
```

### Playlists

#### Get Playlists
```typescript
const playlists = await client.getPlaylists({
  page: 0,
  max: 20,
  search?: string
});
```

### Game Data

#### Get Monthly Players
```typescript
const monthlyPlayers = await client.getMonthlyPlayers();
```

#### Get Game Settings
```typescript
const settings = await client.getGameSettings();
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

## Types

The package exports all necessary TypeScript types. Here are some of the main ones:

- `KovaaksApiClientOptions`
- `LoginCredentials`
- `UserProfile`
- `GlobalLeaderboardResponse`
- `GroupedLeaderboardResponse`
- `BenchmarkProgress`
- `ScenarioPopularResponse`
- `UserScenarioResponse`
- `TrendingScenario`

## API Reference

#### Types

```typescript
// Playlist Types
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

interface GetPlaylistsParams {
  page: number;
  max: number;
  search?: string;
}

// Scenario Types
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

interface GetScenarioDetailsParams {
  leaderboardId: number;
}

// Leaderboard Search Types
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

interface GetGlobalLeaderboardSearchParams {
  username: string;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 