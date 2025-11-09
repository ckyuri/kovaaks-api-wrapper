# Kovaaks API Client

[![npm version](https://img.shields.io/npm/v/kovaaks-api-client.svg)](https://www.npmjs.com/package/kovaaks-api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A powerful TypeScript client for the Kovaaks API that provides seamless access to leaderboards, user profiles, scenarios, playlists, and benchmarks.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Users](#users)
  - [Scenarios](#scenarios)
  - [Leaderboards](#leaderboards)
  - [Benchmarks](#benchmarks)
  - [Playlists](#playlists)
  - [Statistics](#statistics)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- 👤 **User Profiles**: Access detailed user data, including profiles, favorite scenarios, played scenarios, and recent high scores.
- 🎯 **Scenarios**: Search for scenarios, view trending scenarios, and get detailed information.
- 📊 **Leaderboards**: Fetch global and scenario-specific leaderboards, as well as featured high scores.
- 🏆 **Benchmarks**: Track user progress in benchmarks.
- 📋 **Playlists**: Retrieve user-created playlists.
- 📈 **Statistics**: Get game statistics like concurrent users, monthly players, and total scenarios.

## Installation

```bash
# Using npm
npm install kovaaks-api-client

# Using yarn
yarn add kovaaks-api-client

# Using pnpm
pnpm add kovaaks-api-client
```

## Quick Start

```typescript
import { KovaaksApiClient } from 'kovaaks-api-client';

// Create a client
const client = new KovaaksApiClient();

// Example: Get a user's profile and their favorite scenarios
async function getUserInfo(username: string) {
  try {
    // Get user profile
    const profile = await client.getProfileByUsername({ username });
    console.log('User Profile:', profile);

    // Get favorite scenarios
    const favorites = await client.getFavoriteScenariosByUsername({ username });
    console.log('Favorite Scenarios:', favorites);

  } catch (error) {
    console.error('Error:', error);
  }
}

getUserInfo('josh');
```

## API Reference

---

### Users

#### `getProfileByUsername(params)`
Retrieves a user's profile by their web app username.

- **Parameters**:
  - `username` (string): The user's username.
- **Returns**: `Promise<KovaaksTypes.GetProfileByWebappUsername.Response>`
- **Response Object**:
  ```typescript
  {
    playerId: number,
    steamAccountName: string,
    steamAccountAvatar: string,
    created: Date,
    steamId: string,
    clientBuildVersion: string,
    lastAccess: Date,
    webapp: {
      roles: {
        admin: boolean,
        coach: boolean,
        staff: boolean,
      },
      videos: any[],
      username: string,
      socialMedia: {
        tiktok: null,
        twitch: null,
        discord: string,
        twitter: null,
        youtube: null,
        discord_id: string,
      },
      gameSettings: {
        dpi: null,
        fov: null,
        cm360: null,
        rawInput: string,
        sensitivity: null,
      },
      profileImage: null,
      profileViews: number,
      hasSubscribed: boolean,
      gamingPeripherals: {
        mouse: string,
        headset: null,
        monitor: null,
        keyboard: null,
        mousePad: string,
      },
      username_changed_at: Date,
    },
    country: string,
    kovaaksPlusActive: boolean,
    badges: any[],
    followCounts: {
      following: number,
      followers: number,
    },
    kovaaksPlus: {
      active: boolean,
      expiration: Date,
    },
    scenariosPlayed: string,
  }
  ```

#### `getFavoriteScenariosByUsername(params)`
Retrieves a user's favorite scenarios.

- **Parameters**:
  - `username` (string): The user's username.
- **Returns**: `Promise<KovaaksTypes.GetFavoriteScenariosByUsername.Response[]>`
- **Response Object**:
  ```typescript
  [{
    leaderboardId: string,
    scenarioName: string,
    score: number,
    scoreHistory: {
      score: number,
      attributes: {
        fov?: number,
        cm360: number,
        epoch: string,
        horizSens: number,
      },
    }[],
  }]
  ```

#### `getRecentHighScoresByUsername(params)`
Retrieves a user's recent high scores.

- **Parameters**:
  - `username` (string): The user's username.
- **Returns**: `Promise<KovaaksTypes.GetRecentScenarioHighScoresByUsername.Response[]>`
- **Response Object**:
  ```typescript
  [{
    timestamp: Date,
    type: string,
    scenarioName: string,
    score: number,
    leaderboardId: number,
    username: string,
    webappUsername: string,
    steamId: string,
    steamAccountName: string,
    steamAccountAvatar: string,
    country: string,
    kovaaksPlus: boolean,
  }]
  ```

#### `getScenariosPlayedByUsername(params)`
Retrieves a list of scenarios played by a user.

- **Parameters**:
  - `username` (string): The user's username.
  - `page` (number, optional): The page number for pagination.
  - `max` (number, optional): The maximum number of results per page.
  - `sort` (string, optional): The sorting parameter.
- **Returns**: `Promise<KovaaksTypes.GetScenariosPlayedByUsernameSortedByPlays.Response>`
- **Response Object**:
  ```typescript
  {
    page: number,
    max: number,
    total: number,
    data: [{
      leaderboardId: string,
      scenarioName: string,
      counts: {
        plays: number,
      },
      rank: number,
      score: number,
      attributes: {
        // ... see types.ts for full attribute list
      },
      scenario: {
        aimType: string | null,
        authors: string[],
        description: string,
      },
    }],
  }
  ```

---

### Scenarios

#### `searchScenariosByName(params)`
Searches for scenarios by name.

- **Parameters**:
  - `scenarioName` (string): The name of the scenario to search for.
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.SearchScenariosByScenarioName.Response>`
- **Response Object**:
  ```typescript
  {
    page: number,
    max: number,
    total: number,
    data: [{
      rank: number,
      leaderboardId: number,
      scenarioName: string,
      scenario: {
        aimType: string | null,
        authors: string[],
        description: string,
      },
      counts: {
        plays: number,
        entries: number,
      },
      topScore: {
        score: number,
      },
    }],
  }
  ```

#### `getTrendingScenarios()`
Retrieves a list of trending scenarios.

- **Returns**: `Promise<KovaaksTypes.GetTrendingScenarios.Response[]>`
- **Response Object**:
  ```typescript
  [{
    scenarioName: string,
    leaderboardId: number,
    webappUsername: string | null,
    steamAccountName: string,
    kovaaksPlusActive: boolean,
    entries: number,
    new: boolean,
  }]
  ```

#### `getScenarioDetails(params)`
Retrieves details for a specific scenario by its leaderboard ID.

- **Parameters**:
  - `leaderboardId` (number): The leaderboard ID of the scenario.
- **Returns**: `Promise<KovaaksTypes.GetScenarioDetailsByLeaderboardId.Response>`
- **Response Object**:
  ```typescript
  {
    scenarioName: string,
    aimType: string,
    playCount: number,
    steamId: string,
    steamAccountName: string,
    webappUsername: string,
    description: string,
    tags: string[],
    created: Date,
  }
  ```

---

### Leaderboards

#### `getGlobalLeaderboard(params)`
Retrieves the global leaderboard.

- **Parameters**:
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.GetGlobalLeaderboardScores.Response>`
- **Response Object**:
  ```typescript
  {
    data: [{
      rank: number,
      rankChange: number,
      steamId: string,
      webappUsername: string,
      steamAccountName: string,
      points: string,
      scenariosCount: string,
      completionsCount: number,
      kovaaksPlusActive: boolean,
      country: string,
    }],
    total: string,
  }
  ```

#### `searchScenarioLeaderboard(params)`
Searches a scenario's leaderboard.

- **Parameters**:
  - `leaderboardId` (number): The ID of the leaderboard.
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.ScenarioLeaderboardScoreSearch.Response>`
- **Response Object**:
  ```typescript
  {
    total: number,
    page: number,
    max: number,
    data: [{
      steamId: string,
      score: number,
      rank: number,
      steamAccountName: string,
      webappUsername: string | null,
      kovaaksPlusActive: boolean,
      country: string | null,
      attributes: {
        // ... see types.ts for full attribute list
      },
    }],
  }
  ```

#### `getFeaturedHighScores(params)`
Retrieves featured high scores.

- **Parameters**:
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.FeaturedHighScores.Response[]>`
- **Response Object**:
  ```typescript
  [{
    scenarioName: string,
    steamId: string,
    score: number,
    created: Date,
    attributes: {
      // ... see types.ts for full attribute list
    },
    steamAccountName: string,
    webappUsername: string,
    game: string,
  }]
  ```

---

### Benchmarks

#### `getBenchmarkProgress(params)`
Retrieves progress for a specific benchmark.

- **Parameters**:
  - `benchmarkId` (number): The ID of the benchmark.
  - `steamId` (string): The user's Steam ID.
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.GetBenchmarkProgressBySteamId64AndBenchmarkId.Response>`
- **Response Object**:
  ```typescript
  {
    benchmark_progress: number,
    overall_rank: number,
    categories: {
      // ... see types.ts for full category list
    },
    ranks: {
      icon: string,
      name: string,
      color: string,
      frame: string,
      description: string,
      playercard_large: string,
      playercard_small: string,
    }[],
  }
  ```

#### `getBenchmarkProgressForUsername(params)`
Retrieves all benchmark progress for a user.

- **Parameters**:
  - `username` (string): The user's username.
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.GetBenchmarkProgressForWebappUsername.Response>`
- **Response Object**:
  ```typescript
  {
    page: number,
    max: number,
    total: number,
    data: [{
      benchmarkName: string,
      benchmarkId: number,
      benchmarkIcon: string,
      benchmarkAuthor: string,
      type: string,
      tintRanks: boolean,
      rankName: string,
      rankIcon: string,
      rankColor: string,
    }],
  }
  ```

---

### Playlists

#### `getPlaylistsByUser(params)`
Retrieves playlists created by a user.

- **Parameters**:
  - `username` (string): The user's username.
  - `page` (number, optional): Page number.
  - `max` (number, optional): Results per page.
- **Returns**: `Promise<KovaaksTypes.GetPlaylistsCreatedByUser.Response>`
- **Response Object**:
  ```typescript
  {
    totalPlaylistSubscribers: number,
    page: number,
    max: number,
    total: number,
    data: [{
      playlistId: number,
      playlistName: string,
      playlistCode: string,
      playlistHash: string,
      playerId: number,
      playlistBase64: string,
      playlistJson: {
        authorName: string,
        playlistId: number,
        description: string,
        playlistName: string,
        scenarioList: {
          playCount: number,
          scenarioName: string,
        }[],
        authorSteamId: string,
      },
      created: Date,
      aimType: string,
      isPrivate: boolean,
      updated: Date,
      partnerName: null,
      description: string,
      subscribers: number,
    }],
  }
  ```

#### `searchPlaylists(params)`
Search for playlists by name or partial name match with pagination support.

- **Parameters**:
  - `query` (string): The search term to match against playlist names.
  - `page` (number, optional): Page number for pagination (default: 0).
  - `max` (number, optional): Maximum number of results per page (default: 20).
- **Returns**: `Promise<KovaaksTypes.SearchPlaylists.Response>`
- **Response Object**:
  ```typescript
  {
    page: number,
    max: number,
    total: number,
    data: [{
      playlistName: string,
      subscribers: number,
      scenarioList: [{
        author: string,
        aimType: string,
        playCount: number,
        scenarioName: string,
        webappUsername: string,
        steamAccountName: string,
      }],
      playlistCode: string,
      playlistId: number,
      published: string,
      steamId: string,
      steamAccountName: string,
      webappUsername: string,
      description: string,
      aimType: string,
      playlistDuration: number,
    }],
  }
  ```

#### `getPlaylistByCode(params)`
Retrieve a specific playlist using its unique playlist code. Playlist codes are guaranteed to return at most one playlist.

- **Parameters**:
  - `code` (string): The unique playlist code identifier.
- **Returns**: `Promise<KovaaksTypes.GetPlaylistByCode.Response | null>`
  - Returns the playlist object if found, or `null` if not found.
- **Response Object**:
  ```typescript
  {
    playlistName: string,
    subscribers: number,
    scenarioList: [{
      author: string,
      aimType: string,
      playCount: number,
      scenarioName: string,
      webappUsername: string,
      steamAccountName: string,
    }],
    playlistCode: string,
    playlistId: number,
    published: string,
    steamId: string,
    steamAccountName: string,
    webappUsername: string,
    description: string,
    aimType: string,
    playlistDuration: number,
  }
  ```

---

### Statistics

#### `getMonthlyPlayersCount()`
Gets the number of monthly active players.

- **Returns**: `Promise<KovaaksTypes.GetMonthlyPlayersCount.Response>`
- **Response Object**:
  ```typescript
  {
    count: number,
  }
  ```

#### `getConcurrentUsers()`
Gets the number of concurrent users.

- **Returns**: `Promise<KovaaksTypes.GetConcurrentUsers.Response>`
- **Response Object**:
  ```typescript
  {
    concurrentUsers: number,
  }
  ```

#### `getTotalScenariosCount()`
Gets the total number of custom scenarios.

- **Returns**: `Promise<KovaaksTypes.TotalScenariosCount.Response>`
- **Response Object**:
  ```typescript
  {
    customScenarioCount: number,
  }
  ```

## Error Handling

The client will throw a `KovaaksApiError` for any API-related errors. This custom error class includes the HTTP status code and the response body for easier debugging.

```typescript
import { KovaaksApiClient, KovaaksApiError } from 'kovaaks-api-client';

const client = new KovaaksApiClient();

try {
  await client.getProfileByUsername({ username: 'nonexistentuser' });
} catch (error) {
  if (error instanceof KovaaksApiError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status: ${error.status}`);
    console.error(`Response:`, error.response);
  } else {
    console.error('An unexpected error occurred:', error);
  }
}
```

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

</rewritten_file>