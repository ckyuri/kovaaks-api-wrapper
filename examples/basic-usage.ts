import { KovaaksApiClient, KovaaksApiError } from '../src';

async function main() {
  try {
    // Create a new API client
    const client = new KovaaksApiClient();
    
    console.log('Fetching trending scenarios...');
    const trendingScenarios = await client.getTrendingScenarios();
    console.log(`Found ${trendingScenarios.length} trending scenarios:`);
    trendingScenarios.forEach((scenario, index) => {
      console.log(`${index + 1}. ${scenario.scenarioName} (${scenario.entries} entries)`);
    });
    
    console.log('\nFetching monthly player count...');
    const monthlyPlayers = await client.getMonthlyPlayers();
    console.log(`Monthly players: ${monthlyPlayers.count}`);
    
    console.log('\nFetching game settings...');
    const gameSettings = await client.getGameSettings();
    console.log('Game settings:', gameSettings);
    
    // Example with authentication (commented out)
    /*
    console.log('\nLogging in...');
    const loginResponse = await client.login({
      username: 'your-email@example.com',
      password: 'your-password'
    });
    
    console.log(`Logged in as: ${loginResponse.profile.webapp.username}`);
    
    console.log('\nFetching user profile...');
    const userProfile = await client.getUserProfile();
    console.log(`User profile: ${userProfile.webapp.username}`);
    */
    
    console.log('\nFetching global leaderboard...');
    const leaderboard = await client.getGlobalLeaderboard({
      page: 0,
      max: 5
    });
    
    console.log('Global leaderboard top 5:');
    leaderboard.data.forEach((entry, index) => {
      if ('webappUsername' in entry) {
        // This is a GlobalLeaderboardResponse entry
        console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points`);
      } else {
        // This is a GroupedLeaderboardResponse entry
        console.log(`${index + 1}. ${entry.group} - ${entry.points} points`);
      }
    });
    
    // Example of fetching country-specific leaderboard
    console.log('\nFetching Belarus leaderboard...');
    const belarusLeaderboard = await client.getCountryLeaderboard({
      page: 0,
      max: 5,
      countryCode: 'BY'
    });
    
    console.log('Belarus leaderboard top 5:');
    belarusLeaderboard.data.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.webappUsername || entry.steamAccountName} - ${entry.points} points`);
    });
    
    // Example of fetching user-specific data
    /*
    console.log('\nFetching user scenarios...');
    const userScenarios = await client.getUserScenarios({
      username: 'some-user-email@example.com',
      page: 0,
      max: 10
    });
    
    console.log(`User scenarios (${userScenarios.total} total):`);
    userScenarios.data.forEach((scenario, index) => {
      console.log(`${index + 1}. ${scenario.scenarioName} - Score: ${scenario.score}`);
    });
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