import { KovaaksApiClient, KovaaksApiError, GroupedLeaderboardResponse } from '../dist';

async function main() {
  try {
    console.log('Initializing Kovaaks API Client...');
    // Create a new API client
    const client = new KovaaksApiClient();
    
    // --- PUBLIC ENDPOINTS ---
    
    // 1. Search for a user
    console.log('\n--- USER SEARCH ---');
    console.log('Searching for user "kyuri"...');
    const userSearchResults = await client.searchUsers({
      username: 'kyuri'
    });
    console.log(`Found ${userSearchResults.length} users matching "kyuri":`);
    userSearchResults.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.steamAccountName}) from ${user.country || 'unknown'}`);
    });
    
    // Save steamId for later use
    const kyuriSteamId = userSearchResults.length > 0 ? userSearchResults[0].steamId : '76561198409458631';
    
    // 2. Get user profile
    console.log('\n--- USER PROFILE ---');
    console.log('Fetching user profile for "kyuri"...');
    try {
      const profile = await client.getUserProfileByUsername({
        username: 'kyuri'
      });
      console.log(`Profile: ${profile.steamAccountName}`);
      console.log(`Country: ${profile.country}`);
      console.log(`Scenarios Played: ${profile.scenariosPlayed}`);
      console.log(`Kovaaks+ Active: ${profile.kovaaksPlusActive}`);
    } catch (error) {
      console.log('Could not fetch profile, using backup approach');
      // Try with the first search result if profile lookup fails
      if (userSearchResults.length > 0) {
        console.log(`Found via search: ${userSearchResults[0].username} (${userSearchResults[0].steamAccountName})`);
      }
    }
    
    // 3. Get user activity
    console.log('\n--- USER ACTIVITY ---');
    console.log('Fetching recent activity for "kyuri"...');
    try {
      const activity = await client.getUserActivity({
        username: 'kyuri'
      });
      console.log(`Found ${activity.length} recent activities:`);
      activity.slice(0, 3).forEach((item, index) => {
        console.log(`${index + 1}. ${item.timestamp}: ${item.type} - ${item.scenarioName} (Score: ${item.score})`);
      });
    } catch (error) {
      console.log('Could not fetch activity');
    }
    
    // 4. Get user scenarios
    console.log('\n--- USER SCENARIOS ---');
    console.log('Fetching scenarios played by "kyuri"...');
    try {
      const scenarios = await client.getUserScenarios({
        username: 'kyuri',
        page: 0,
        max: 5,
        sortParam: 'count'
      });
      console.log(`Found ${scenarios.total} scenarios (showing top 5):`);
      scenarios.data.forEach((scenario, index) => {
        console.log(`${index + 1}. ${scenario.scenarioName} - Score: ${scenario.score} (Plays: ${scenario.counts.plays})`);
      });
    } catch (error) {
      console.log('Could not fetch scenarios');
    }
    
    // 5. Get benchmarks for user
    console.log('\n--- USER BENCHMARKS ---');
    console.log('Fetching benchmarks for "kyuri"...');
    try {
      const benchmarks = await client.getBenchmarksForUser({
        username: 'kyuri',
        page: 0,
        max: 3
      });
      console.log(`Found ${benchmarks.total} benchmarks (showing top 3):`);
      benchmarks.data.forEach((benchmark, index) => {
        console.log(`${index + 1}. ${benchmark.benchmarkName} by ${benchmark.benchmarkAuthor} - Rank: ${benchmark.rankName}`);
      });
    } catch (error) {
      console.log('Could not fetch benchmarks');
    }
    
    // 6. Get benchmark progress
    console.log('\n--- BENCHMARK PROGRESS ---');
    console.log('Fetching benchmark progress for "kyuri" on benchmark #2...');
    try {
      const progress = await client.getBenchmarkProgress({
        benchmarkId: '2',
        steamId: kyuriSteamId,
      });
      console.log(`Benchmark Progress: ${progress.benchmark_progress}`);
      console.log(`Overall Rank: ${progress.overall_rank}`);
      console.log('Categories:');
      Object.keys(progress.categories).slice(0, 2).forEach(category => {
        console.log(`- ${category}: Progress ${progress.categories[category].benchmark_progress}, Rank ${progress.categories[category].category_rank}`);
      });
    } catch (error) {
      console.log('Could not fetch benchmark progress');
    }
    
    // 7. Get game data
    console.log('\n--- GAME DATA ---');
    
    console.log('Fetching trending scenarios...');
    const trendingScenarios = await client.getTrendingScenarios();
    console.log(`Found ${trendingScenarios.length} trending scenarios (showing top 3):`);
    trendingScenarios.slice(0, 3).forEach((scenario, index) => {
      console.log(`${index + 1}. ${scenario.scenarioName} (${scenario.entries} entries) by ${scenario.steamAccountName}`);
    });
    
    console.log('\nFetching popular scenarios...');
    const popularScenarios = await client.getPopularScenarios({
      page: 0,
      max: 3,
      scenarioNameSearch: 'voltaic'
    });
    console.log(`Found ${popularScenarios.total} popular voltaic scenarios (showing top 3):`);
    popularScenarios.data.forEach((scenario, index) => {
      console.log(`${index + 1}. ${scenario.scenarioName} - ${scenario.counts.plays} plays`);
    });
    
    console.log('\nFetching playlists...');
    const playlists = await client.getPlaylists({
      page: 0, 
      max: 3,
      search: 'voltaic'
    });
    console.log(`Found ${playlists.total} voltaic playlists (showing top 3):`);
    playlists.data.forEach((playlist, index) => {
      console.log(`${index + 1}. ${playlist.playlistName} - ${playlist.subscribers} subscribers, ${playlist.scenarioList.length} scenarios`);
    });
    
    // 8. Get leaderboard data
    console.log('\n--- LEADERBOARD DATA ---');
    console.log('Fetching global leaderboard...');
    const leaderboard = await client.getGlobalLeaderboard({
      page: 0,
      max: 3
    });
    
    console.log('Global leaderboard top 3:');
    leaderboard.data.forEach((entry, index) => {
      if ('webappUsername' in entry) {
        // This is a GlobalLeaderboardResponse entry
        console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points (${entry.country})`);
      } else {
        // This is a GroupedLeaderboardResponse entry
        console.log(`${index + 1}. ${entry.group} - ${entry.points} points`);
      }
    });
    
    console.log('\nFetching global leaderboard by country grouping...');
    const countryLeaderboard = await client.getGlobalLeaderboard({
      page: 0,
      max: 3,
      group: 'country'
    }) as GroupedLeaderboardResponse;
    
    console.log('Top 3 countries:');
    countryLeaderboard.data.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.group} - ${entry.points} points (${entry.scenarios_count} scenarios)`);
    });
    
    console.log('\nMonthly player count:');
    const monthlyPlayers = await client.getMonthlyPlayers();
    console.log(`${monthlyPlayers.count} players this month`);
    
    // --- AUTHENTICATED ENDPOINTS (COMMENTED OUT) ---
    /*
    console.log('\n--- AUTHENTICATION ---');
    console.log('Logging in...');
    const loginResponse = await client.login({
      username: 'your-email@example.com',
      password: 'your-password'
    });
    
    console.log(`Logged in as: ${loginResponse.profile.webapp.username}`);
    
    // Verify token
    console.log('\nVerifying token...');
    const isValid = await client.verifyToken();
    console.log(`Token valid: ${isValid}`);
    
    // Get authenticated user profile
    console.log('\nFetching authenticated user profile...');
    const userProfile = await client.getUserProfile();
    console.log(`User profile: ${userProfile.webapp.username}`);
    
    // Get country leaderboard (requires Kovaaks+ subscription)
    console.log('\nFetching US leaderboard (requires Kovaaks+)...');
    try {
      const usLeaderboard = await client.getCountryLeaderboard({
        page: 0,
        max: 3,
        countryCode: 'US'
      });
      
      console.log('US leaderboard top 3:');
      usLeaderboard.data.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points`);
      });
    } catch (error) {
      console.log('Could not access country leaderboard (requires Kovaaks+)');
    }
    */
    
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