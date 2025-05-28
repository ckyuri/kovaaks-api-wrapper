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
  - [User Management](#user-management)
  - [Leaderboards](#leaderboards)
  - [Scenarios](#scenarios)
  - [Playlists](#playlists)
  - [Benchmarks](#benchmarks)
  - [Statistics](#statistics)
  - [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- 👤 **User Management**
  - Profile lookup and search
  - Activity tracking
  - Scenario statistics
  - Performance history
- 📊 **Comprehensive Leaderboards**
  - Global rankings
  - Country and region grouping
  - Scenario-specific leaderboards
- 🎯 **Scenario Features**
  - Popular and trending scenarios
  - Detailed scenario information
  - Performance tracking
  - Leaderboard access
- 📋 **Additional Features**
  - Playlist management
  - Benchmark tracking
  - Game statistics
  - Authentication support

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
const client = new KovaaksApiClient({
  baseUrl: 'https://kovaaks.com',  // Optional: Custom base URL
  timeout: 10000,                  // Optional: Request timeout (ms)
  authToken: 'your-token'          // Optional: JWT token
});

// Example: Search for a user and get their profile
async function getUserInfo(username: string) {
  try {
    // Search for user
    const searchResults = await client.searchUsers({ username });
    if (searchResults.length === 0) {
      console.log('User not found');
      return;
    }

    // Get detailed profile
    const profile = await client.getUserProfileByUsername({ 
      username: searchResults[0].username 
    });
    
    console.log('User Profile:', {
      name: profile.steamAccountName,
      country: profile.country,
      scenariosPlayed: profile.scenariosPlayed,
      kovaaksPlusActive: profile.kovaaksPlus.active
    });

  } catch (error) {
    console.error('Error:', error);
  }
}
```

## API Reference

### User Management

```typescript
// Search for users
const users = await client.searchUsers({ 
  username: 'searchTerm' 
});

// Get user profile by username
const profile = await client.getUserProfileByUsername({ 
  username: 'targetUser' 
});

// Get user's recent activity
const activity = await client.getUserActivity({ 
  username: 'targetUser' 
});

// Get user's scenario statistics
const scenarios = await client.getUserScenarios({
  username: 'targetUser',
  page: 0,
  max: 20,
  sortParam: 'count'  // Optional: sort parameter
});
```

### Leaderboards

```typescript
// Global leaderboard
const global = await client.getGlobalLeaderboard({
  page: 0,
  max: 20
});

// Grouped by country
const countryBoard = await client.getGlobalLeaderboard({
  page: 0,
  max: 20,
  group: 'country'
}) as GroupedLeaderboardResponse;

// Grouped by region
const regionBoard = await client.getGlobalLeaderboard({
  page: 0,
  max: 20,
  group: 'region'
}) as GroupedLeaderboardResponse;

// Scenario-specific leaderboard
const scenarioBoard = await client.getScenarioLeaderboard({
  leaderboardId: 12345,
  page: 0,
  max: 50,
  usernameSearch: 'playerName'  // Optional: filter by username
});
```

### Scenarios

```typescript
// Get trending scenarios
const trending = await client.getTrendingScenarios();

// Get popular scenarios
const popular = await client.getPopularScenarios({
  page: 0,
  max: 20,
  scenarioNameSearch: 'voltaic'  // Optional: search term
});

// Get scenario details
const details = await client.getScenarioDetails({
  leaderboardId: 12345
});
```

### Playlists

```typescript
// Get playlists
const playlists = await client.getPlaylists({
  page: 0,
  max: 20,
  search: 'voltaic'  // Optional: search term
});

// Response includes:
interface PlaylistData {
  playlistName: string;
  subscribers: number;
  scenarioList: Array<{
    scenarioName: string;
    author: string;
    playCount: number;
  }>;
  playlistDuration: number;
  // ... other fields
}
```

### Benchmarks

```typescript
// Get user's benchmarks
const benchmarks = await client.getBenchmarksForUser({
  username: 'targetUser',
  page: 0,
  max: 20
});

// Get benchmark progress
const progress = await client.getBenchmarkProgress({
  benchmarkId: '2',
  steamId: 'steam-id',
  page: 0,
  max: 100
});
```

### Statistics

```typescript
// Get monthly active players
const monthlyStats = await client.getMonthlyPlayers();
console.log(`Active players: ${monthlyStats.count}`);

// Get game settings
const settings = await client.getGameSettings();
```

### Authentication

```typescript
// Login
const loginResponse = await client.login({
  username: 'your-email@example.com',
  password: 'your-password'
});

// Verify token
const isValid = await client.verifyToken();

// Get authenticated user profile
const profile = await client.getUserProfile();

// Logout
client.logout();
```

## Error Handling

The client uses a custom `KovaaksApiError` class for error handling:

```typescript
try {
  await client.getUserProfile();
} catch (error) {
  if (error instanceof KovaaksApiError) {
    console.error(`API Error (${error.status}):`, error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 