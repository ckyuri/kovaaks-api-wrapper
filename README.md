# Kovaaks API Client

A TypeScript client for the Kovaaks API that provides easy access to leaderboards, user profiles, scenarios, and more.

## Features

- 🔐 Authentication and user management
- 📊 Global and country-specific leaderboards
- 🎯 Scenario details and popular scenarios
- 📋 Playlist management
- 📈 Benchmark progress tracking
- 👤 User profiles and activity
- 🎮 Game settings and statistics

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

// Example: Get global leaderboard
const globalLeaderboard = await client.getGlobalLeaderboard({
  page: 0,
  max: 20
});
```

## Authentication

### Login
```typescript
const loginResponse = await client.login({
  username: 'your-email@example.com',
  password: 'your-password'
});

// Response includes:
// - JWT token
// - Refresh token
// - User profile
// - Firebase JWT
```

### Token Management
```typescript
// Set auth token manually
client.setAuthToken('your-token');

// Verify token validity
const isValid = await client.verifyToken();

// Clear auth token
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

// Response includes:
// - Array of leaderboard entries with rank, username, points
// - Total number of entries
```

#### Get Country Leaderboard
```typescript
// Requires authentication and Kovaaks+ subscription
const countryLeaderboard = await client.getCountryLeaderboard({
  page: 0,
  max: 20,
  countryCode: 'US' // ISO country code
});

// Response includes:
// - Array of country-specific leaderboard entries
// - Total number of entries
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

// Response includes:
// - Array of matching users with rank and stats
```

### Scenarios

#### Get Scenario Details
```typescript
const details = await client.getScenarioDetails({
  leaderboardId: 8680
});

// Response includes:
// - Scenario name and type
// - Play count
// - Creator information
// - Description and tags
// - Creation date
```

#### Get Popular Scenarios
```typescript
const popular = await client.getPopularScenarios({
  page: 0,
  max: 20,
  scenarioNameSearch?: string
});

// Response includes:
// - Array of popular scenarios
// - Pagination info (page, max, total)
// - Scenario details and stats
```

#### Get Trending Scenarios
```typescript
const trending = await client.getTrendingScenarios();

// Response includes:
// - Array of trending scenarios
// - Scenario details and stats
```

### Playlists

#### Get Playlists
```typescript
const playlists = await client.getPlaylists({
  page: 0,
  max: 20,
  search?: string
});

// Response includes:
// - Array of playlists
// - Pagination info (page, max, total)
// - Playlist details and scenarios
```

### User Data

#### Get User Profile
```typescript
// Requires authentication
const profile = await client.getUserProfile();

// Response includes:
// - User details
// - Game settings
// - Social media links
// - Kovaaks+ status
```

#### Get User Profile by Username
```typescript
const profile = await client.getUserProfileByUsername({
  username: 'username'
});

// Response includes:
// - User details
// - Game settings
// - Social media links
// - Kovaaks+ status
```

#### Get User Activity
```typescript
const activity = await client.getUserActivity({
  username: 'username'
});

// Response includes:
// - Array of recent activities
// - Activity details and timestamps
```

#### Get User Scenarios
```typescript
const scenarios = await client.getUserScenarios({
  username: 'username',
  page: 0,
  max: 20,
  sortParam?: string
});

// Response includes:
// - Array of user's scenarios
// - Pagination info
// - Scenario details and stats
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

// Response includes:
// - Overall progress
// - Category progress
// - Scenario scores
// - Rank information
```

#### Get Benchmarks for User
```typescript
const benchmarks = await client.getBenchmarksForUser({
  username: 'username',
  page: 0,
  max: 20
});

// Response includes:
// - Array of benchmarks
// - Pagination info
// - Benchmark details
```

### Game Data

#### Get Monthly Players
```typescript
const monthlyPlayers = await client.getMonthlyPlayers();

// Response includes:
// - Monthly player count
```

#### Get Game Settings
```typescript
const settings = await client.getGameSettings();

// Response includes:
// - Game settings and configurations
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

## Types

The package exports all necessary TypeScript types. Here are the main interfaces:

```typescript
// Authentication
interface LoginResponse {
  auth: {
    firebaseJWT: string;
    jwt: string;
    refreshToken: string;
    exp: number;
    emailVerified: boolean;
  };
  profile: UserProfile;
}

// User Profile
interface UserProfile {
  playerId: number;
  steamAccountName: string;
  steamAccountAvatar: string;
  webapp: {
    username: string;
    roles: {
      admin: boolean;
      coach: boolean;
      staff: boolean;
    };
    socialMedia: {
      tiktok: string | null;
      twitch: string | null;
      discord: string | null;
      twitter: string | null;
      youtube: string | null;
    };
    gameSettings: {
      dpi: number | null;
      fov: number | null;
      cm360: number | null;
      rawInput: string;
      sensitivity: number | null;
    };
  };
  country: string;
  kovaaksPlusActive: boolean;
}

// Leaderboard
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

// Scenario
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

// Playlist
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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 