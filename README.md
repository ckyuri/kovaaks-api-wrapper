# Kovaaks API Client

A TypeScript client for the Kovaaks API, providing easy access to Kovaaks' webapp backend and authentication services.

## Features

- Full TypeScript support with comprehensive type definitions
- Authentication handling (login, token management)
- Error handling with custom error types
- Support for all Kovaaks API endpoints
- Configurable client options
- Promise-based API

## Installation

```bash
npm install kovaaks-api-client
```

## Quick Start

```typescript
import { KovaaksApiClient } from 'kovaaks-api-client';

// Create a new client instance
const client = new KovaaksApiClient();

// Get trending scenarios
const trendingScenarios = await client.getTrendingScenarios();
console.log(trendingScenarios);
```

## Authentication

The client supports both authenticated and unauthenticated requests. For authenticated endpoints, you'll need to log in first:

```typescript
// Login to get an auth token
const loginResponse = await client.login({
  username: 'your-email@example.com',
  password: 'your-password'
});

// The client automatically sets the auth token for future requests
console.log('Logged in as:', loginResponse.profile.webapp.username);

// You can also manually manage the auth token
client.setAuthToken('your-token');
client.clearAuthToken();

// Verify if the token is valid
const isTokenValid = await client.verifyToken();
```

## Error Handling

The client provides custom error handling with detailed error information:

```typescript
import { KovaaksApiError } from 'kovaaks-api-client';

try {
  const userProfile = await client.getUserProfile();
} catch (error) {
  if (error instanceof KovaaksApiError) {
    console.error(`API Error (${error.status}):`, error.message);
    console.error('Response:', error.response);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Configuration

You can customize the client with various options:

```typescript
const client = new KovaaksApiClient({
  baseUrl: 'https://kovaaks.com', // Default
  timeout: 15000, // 15 seconds (default is 10000)
  authToken: 'existing-token-if-available'
});
```

## API Methods

### Authentication
- `login(credentials: LoginCredentials): Promise<LoginResponse>`
- `verifyToken(): Promise<boolean>`
- `setAuthToken(token: string): void`
- `clearAuthToken(): void`

### Benchmarks
- `getBenchmarkProgress(params: GetBenchmarkProgressParams): Promise<BenchmarkProgress>`
- `getBenchmarksForUser(params: GetBenchmarksForUserParams): Promise<BenchmarkSearchResponse>`

### Leaderboards
- `getGlobalLeaderboard(params: GetGlobalLeaderboardParams): Promise<GlobalLeaderboardResponse | GroupedLeaderboardResponse>`

### Users
- `getUserProfile(): Promise<UserProfile>`
- `getUserProfileByUsername(params: GetUserProfileByUsernameParams): Promise<UserProfile>`
- `getUserActivity(params: GetUserActivityParams): Promise<UserActivity[]>`
- `getUserScenarios(params: GetUserScenarioParams): Promise<UserScenarioResponse>`
- `getMonthlyPlayers(): Promise<{ count: number }>`

### Scenarios
- `getPopularScenarios(params: GetPopularScenariosParams): Promise<ScenarioPopularResponse>`
- `getTrendingScenarios(): Promise<TrendingScenario[]>`

### Other
- `getGameSettings(): Promise<any>`

## Type Definitions

The package includes comprehensive TypeScript type definitions for all API responses and request parameters. You can import them directly:

```typescript
import {
  BenchmarkProgress,
  UserProfile,
  LoginResponse,
  // ... other types
} from 'kovaaks-api-client';
```

## Examples

See the `examples` directory for more usage examples:

```bash
cd examples
npm install
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details. 