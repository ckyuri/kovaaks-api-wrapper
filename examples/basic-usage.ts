import { KovaaksApiClient, KovaaksApiError, GroupedLeaderboardResponse } from '../dist';

async function demonstrateUserManagement(client: KovaaksApiClient) {
  console.log('\n=== User Management ===');
  
  // Search for users
  console.log('\n--- User Search ---');
  const userSearchResults = await client.searchUsers({ username: 'kyuri' });
  console.log(`Found ${userSearchResults.length} users matching "kyuri":`);
  userSearchResults.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username} (${user.steamAccountName}) from ${user.country || 'unknown'}`);
  });

  // Get user profile
  const username = userSearchResults[0]?.username || 'kyuri';
  console.log('\n--- User Profile ---');
  const profile = await client.getUserProfileByUsername({ username });
  console.log(`Profile: ${profile.steamAccountName}`);
  console.log(`Country: ${profile.country}`);
  console.log(`Scenarios Played: ${profile.scenariosPlayed}`);
  console.log(`Kovaaks+ Active: ${profile.kovaaksPlus.active}`);

  // Get user activity
  console.log('\n--- User Activity ---');
  const activity = await client.getUserActivity({ username });
  console.log(`Found ${activity.length} recent activities:`);
  activity.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. ${item.timestamp}: ${item.scenarioName} - Score: ${item.score}`);
  });

  // Get user scenarios
  console.log('\n--- User Scenarios ---');
  const scenarios = await client.getUserScenarios({
    username,
    page: 0,
    max: 5,
    sortParam: 'count'
  });
  console.log(`Found ${scenarios.total} scenarios (showing top 5):`);
  scenarios.data.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName} - Score: ${scenario.score} (Plays: ${scenario.counts.plays})`);
  });

  return userSearchResults[0]?.steamId || '76561198409458631';
}

async function demonstrateBenchmarks(client: KovaaksApiClient, steamId: string) {
  console.log('\n=== Benchmarks ===');

  // Get benchmarks for user
  console.log('\n--- User Benchmarks ---');
  const benchmarks = await client.getBenchmarksForUser({
    username: 'kyuri',
    page: 0,
    max: 3
  });
  console.log(`Found ${benchmarks.total} benchmarks (showing top 3):`);
  benchmarks.data.forEach((benchmark, index) => {
    console.log(`${index + 1}. ${benchmark.benchmarkName} by ${benchmark.benchmarkAuthor} - Rank: ${benchmark.rankName}`);
  });

  // Get benchmark progress
  console.log('\n--- Benchmark Progress ---');
  const progress = await client.getBenchmarkProgress({
    benchmarkId: '2',
    steamId,
    page: 0,
    max: 100
  });
  console.log(`Overall Progress: ${progress.benchmark_progress}`);
  console.log(`Overall Rank: ${progress.overall_rank}`);
  console.log('Categories:');
  Object.entries(progress.categories).forEach(([category, data]) => {
    console.log(`- ${category}: Progress ${data.benchmark_progress}, Rank ${data.category_rank}`);
  });
}

async function demonstrateScenarios(client: KovaaksApiClient) {
  console.log('\n=== Scenarios ===');

  // Get trending scenarios
  console.log('\n--- Trending Scenarios ---');
  const trending = await client.getTrendingScenarios();
  console.log(`Found ${trending.length} trending scenarios (showing top 3):`);
  trending.slice(0, 3).forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName} (${scenario.entries} entries)`);
  });

  // Get popular scenarios
  console.log('\n--- Popular Scenarios ---');
  const popular = await client.getPopularScenarios({
    page: 0,
    max: 3,
    scenarioNameSearch: 'voltaic'
  });
  console.log(`Found ${popular.total} popular voltaic scenarios:`);
  popular.data.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName} - ${scenario.counts.plays} plays`);
  });

  // Get scenario details
  if (popular.data.length > 0) {
    console.log('\n--- Scenario Details ---');
    const details = await client.getScenarioDetails({
      leaderboardId: popular.data[0].leaderboardId
    });
    console.log(`Details for ${details.scenarioName}:`);
    console.log(`Author: ${details.steamAccountName}`);
    console.log(`Aim Type: ${details.aimType}`);
    console.log(`Play Count: ${details.playCount}`);
  }

  // Get scenario leaderboard
  if (popular.data.length > 0) {
    console.log('\n--- Scenario Leaderboard ---');
    const leaderboard = await client.getScenarioLeaderboard({
      leaderboardId: popular.data[0].leaderboardId,
      page: 0,
      max: 3,
      usernameSearch: 'voltaic'
    });
    console.log('Top players:');
    leaderboard.data.forEach((entry: any, index: number) => {
      console.log(`${index + 1}. ${entry.username || entry.steamAccountName} - Score: ${entry.score}`);
    });
  }
}

async function demonstrateLeaderboards(client: KovaaksApiClient) {
  console.log('\n=== Leaderboards ===');

  // Global leaderboard
  console.log('\n--- Global Leaderboard ---');
  const global = await client.getGlobalLeaderboard({
    page: 0,
    max: 3
  });
  console.log('Top 3 players:');
  global.data.forEach((entry, index) => {
    if ('webappUsername' in entry) {
      console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points (${entry.country})`);
    }
  });

  // Country grouping
  console.log('\n--- Country Leaderboard ---');
  const countryBoard = await client.getGlobalLeaderboard({
    page: 0,
    max: 3,
    group: 'country'
  }) as GroupedLeaderboardResponse;
  console.log('Top 3 countries:');
  countryBoard.data.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.group} - ${entry.points} points (${entry.scenarios_count} scenarios)`);
  });

  // Region grouping
  console.log('\n--- Region Leaderboard ---');
  const regionBoard = await client.getGlobalLeaderboard({
    page: 0,
    max: 3,
    group: 'region'
  }) as GroupedLeaderboardResponse;
  console.log('Top 3 regions:');
  regionBoard.data.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.group} - ${entry.points} points (${entry.scenarios_count} scenarios)`);
  });
}

async function demonstratePlaylists(client: KovaaksApiClient) {
  console.log('\n=== Playlists ===');

  const playlists = await client.getPlaylists({
    page: 0,
    max: 3,
    search: 'voltaic'
  });
  console.log(`Found ${playlists.total} voltaic playlists (showing top 3):`);
  playlists.data.forEach((playlist, index) => {
    console.log(`${index + 1}. ${playlist.playlistName}`);
    console.log(`   Subscribers: ${playlist.subscribers}`);
    console.log(`   Scenarios: ${playlist.scenarioList.length}`);
    console.log(`   Duration: ${playlist.playlistDuration} minutes`);
  });
}

async function demonstrateStatistics(client: KovaaksApiClient) {
  console.log('\n=== Statistics ===');

  // Monthly players
  const monthlyPlayers = await client.getMonthlyPlayers();
  console.log(`Active players this month: ${monthlyPlayers.count}`);

  // Game settings
  const settings = await client.getGameSettings();
  console.log('\nGame Settings:', settings);
}

async function demonstrateAuthentication(client: KovaaksApiClient) {
  console.log('\n=== Authentication (Commented Out) ===');
  /*
  // Login
  const loginResponse = await client.login({
    username: 'your-email@example.com',
    password: 'your-password'
  });
  console.log(`Logged in as: ${loginResponse.profile.webapp.username}`);

  // Verify token
  const isValid = await client.verifyToken();
  console.log(`Token valid: ${isValid}`);

  // Get authenticated user profile
  const profile = await client.getUserProfile();
  console.log(`Authenticated profile: ${profile.webapp.username}`);

  // Get country leaderboard (requires Kovaaks+)
  const countryLeaderboard = await client.getCountryLeaderboard({
    countryCode: 'US',
    page: 0,
    max: 3
  });
  console.log('US Top 3:');
  countryLeaderboard.data.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points`);
  });

  // Logout
  client.logout();
  console.log('Logged out');
  */
}

async function main() {
  try {
    console.log('Initializing Kovaaks API Client...');
    const client = new KovaaksApiClient();

    // Demonstrate all functionality
    const steamId = await demonstrateUserManagement(client);
    await demonstrateBenchmarks(client, steamId);
    await demonstrateScenarios(client);
    await demonstrateLeaderboards(client);
    await demonstratePlaylists(client);
    await demonstrateStatistics(client);
    await demonstrateAuthentication(client);

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
}

main().catch(console.error); 