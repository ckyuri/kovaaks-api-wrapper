import { KovaaksApiClient, KovaaksApiError } from '../src';

async function demonstrateUsers(client: KovaaksApiClient) {
  console.log('\n=== User Features ===');
    
  console.log('\n--- Get User Profile ---');
  const profile = await client.getProfileByUsername({ username: 'kyuri' });
  console.log(`Profile for ${profile.webapp.username}:`);
  console.log(`- Steam: ${profile.steamAccountName}`);
  console.log(`- Country: ${profile.country}`);
  console.log(`- Scenarios Played: ${profile.scenariosPlayed}`);

  console.log('\n--- Get Favorite Scenarios ---');
  const favScenarios = await client.getFavoriteScenariosByUsername({ username: 'kyuri' });
  console.log(`Found ${favScenarios.length} favorite scenarios (showing top 3):`);
  favScenarios.slice(0, 3).forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName} - Score: ${scenario.score}`);
  });

  console.log('\n--- Get Recent High Scores ---');
  const recentScores = await client.getRecentHighScoresByUsername({ username: 'kyuri' });
  console.log(`Found ${recentScores.length} recent high scores (showing top 3):`);
  recentScores.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. ${item.timestamp}: ${item.scenarioName} - Score: ${item.score}`);
  });

  console.log('\n--- Get Scenarios Played ---');
  const scenariosPlayed = await client.getScenariosPlayedByUsername({ username: 'kyuri' });
  console.log(`Found ${scenariosPlayed.total} scenarios played (showing top ${scenariosPlayed.data.length}):`);
  scenariosPlayed.data.slice(0, 3).forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName} - ${scenario.counts.plays} plays`);
  });
}

async function demonstrateBenchmarks(client: KovaaksApiClient) {
  console.log('\n=== Benchmarks ===');
    
  console.log('\n--- Get Benchmark Progress for a user ---');
  const benchmarks = await client.getBenchmarkProgressForUsername({ username: 'kyuri', page: 0, max: 10 });
  console.log(`Found ${benchmarks.total} benchmarks (showing top 3):`);
  benchmarks.data.slice(0, 3).forEach((benchmark, index) => {
    console.log(`${index + 1}. ${benchmark.benchmarkName} by ${benchmark.benchmarkAuthor} - Rank: ${benchmark.rankName}`);
  });
    
  console.log('\n--- Get specific Benchmark Progress ---');
  const progress = await client.getBenchmarkProgress({
    benchmarkId: 2, // Example benchmarkId
    steamId: '76561198409458631', // Example steamId
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
    
  console.log('\n--- Search Scenarios By Name ---');
  const searchResults = await client.searchScenariosByName({ scenarioName: 'voltaic', page: 0, max: 3 });
  console.log(`Found ${searchResults.total} scenarios matching "voltaic" (showing top 3):`);
  searchResults.data.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName}`);
  });

  console.log('\n--- Get Trending Scenarios ---');
  const trending = await client.getTrendingScenarios();
  console.log(`Found ${trending.length} trending scenarios (showing top 3):`);
  trending.slice(0, 3).forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.scenarioName} (${scenario.entries} entries)`);
  });
    
  console.log('\n--- Get Scenario Details ---');
  const details = await client.getScenarioDetails({ leaderboardId: trending[0].leaderboardId });
  console.log(`Details for ${details.scenarioName}:`);
  console.log(`- Author: ${details.steamAccountName}`);
  console.log(`- Aim Type: ${details.aimType}`);
  console.log(`- Play Count: ${details.playCount}`);
}

async function demonstrateLeaderboards(client: KovaaksApiClient) {
  console.log('\n=== Leaderboards ===');

  console.log('\n--- Global Leaderboard ---');
  const global = await client.getGlobalLeaderboard({ page: 0, max: 3 });
  console.log('Top 3 players on the global leaderboard:');
  global.data.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points`);
  });
    
  console.log('\n--- Scenario Leaderboard ---');
  const scenarioLeaderboard = await client.searchScenarioLeaderboard({ leaderboardId: 8680, page: 0, max: 3 });
  console.log('Top 3 players on scenario leaderboard (ID 8680):');
  scenarioLeaderboard.data.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - Score: ${entry.score}`);
  });

  console.log('\n--- Featured High Scores ---');
  const featuredScores = await client.getFeaturedHighScores({ max: 3 });
  console.log('Top 3 featured scores:');
  featuredScores.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.score} on ${entry.scenarioName}`);
  });
}

async function demonstratePlaylists(client: KovaaksApiClient) {
  console.log('\n=== Playlists ===');

  console.log('\n--- Get Playlists By User ---');
  const playlists = await client.getPlaylistsByUser({
    username: 'kyuri',
    page: 0,
    max: 3
  });
  console.log(`Found ${playlists.total} playlists for user kyuri (showing top 3):`);
  playlists.data.forEach((playlist, index) => {
    console.log(`${index + 1}. ${playlist.playlistName} - Subscribers: ${playlist.subscribers}`);
  });
}

async function demonstrateStatistics(client: KovaaksApiClient) {
  console.log('\n=== Statistics ===');

  const monthlyPlayers = await client.getMonthlyPlayersCount();
  console.log(`- Active players this month: ${monthlyPlayers.count}`);

  const concurrentUsers = await client.getConcurrentUsers();
  console.log(`- Concurrent users: ${concurrentUsers.concurrentUsers}`);

  const totalScenarios = await client.getTotalScenariosCount();
  console.log(`- Total scenarios: ${totalScenarios.customScenarioCount}`);
}

async function runDemonstration(name: string, demonstration: (client: KovaaksApiClient) => Promise<void>, client: KovaaksApiClient) {
  try {
    await demonstration(client);
  } catch (error) {
    console.error(`\nAn error occurred during ${name}:`);
    if (error instanceof KovaaksApiError) {
      console.error(`API Error (${error.status}):`, error.message);
      if (error.response) {
        console.error('Response:', error.response);
      }
    } else {
      console.error(error);
    }
  }
}

async function main() {
  console.log('Initializing Kovaaks API Client...');
  const client = new KovaaksApiClient();

  await runDemonstration('User Features', demonstrateUsers, client);
  await runDemonstration('Benchmark Features', demonstrateBenchmarks, client);
  await runDemonstration('Scenario Features', demonstrateScenarios, client);
  await runDemonstration('Leaderboard Features', demonstrateLeaderboards, client);
  await runDemonstration('Playlist Features', demonstratePlaylists, client);
  await runDemonstration('Statistics Features', demonstrateStatistics, client);
}

main(); 