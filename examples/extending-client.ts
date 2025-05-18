import { KovaaksApiClient, KovaaksApiClientOptions } from '../dist';

// Define our extension methods interface
interface ScenarioExtensions {
  getScenarioTopPlayers(leaderboardId: number, max?: number): Promise<any>;
  findScenariosByName(scenarioName: string): Promise<any>;
  [key: string]: Function;
}

/**
 * Example 1: Extend the base client with the extend() method
 */
async function extendMethodExample() {
  console.log('--- Example 1: Using extend() method ---');
  
  // Create a basic client
  const client = new KovaaksApiClient();
  
  // Extend it with custom methods
  // TypeScript now knows that extendedClient has the methods defined in ScenarioExtensions
  const extendedClient = client.extend<ScenarioExtensions>({
    // Custom method to get top players for a scenario
    async getScenarioTopPlayers(leaderboardId: number, max = 5) {
      console.log(`Getting top ${max} players for scenario #${leaderboardId}`);
      
      try {
        // Using the protected request method from the base class
        const result = await this.request({
          method: 'GET',
          url: this.buildUrl('/webapp-backend/leaderboard/scenario-scores', {
            leaderboardId,
            page: 0,
            max
          })
        });
        
        return result;
      } catch (error: any) {
        console.log('Error fetching scenario top players:', error.message);
        // Return a default empty response structure
        return { data: [], total: 0 };
      }
    },
    
    // Custom method to search scenarios by exact name
    async findScenariosByName(scenarioName: string) {
      console.log(`Searching for scenarios with name: "${scenarioName}"`);
      
      try {
        const result = await this.request({
          method: 'GET',
          url: this.buildUrl('/webapp-backend/scenario/popular', {
            page: 0,
            max: 10,
            scenarioNameSearch: scenarioName
          })
        });
        
        return result;
      } catch (error: any) {
        console.log('Error searching scenarios:', error.message);
        return { data: [], total: 0 };
      }
    }
  });
  
  // Use our custom methods
  try {
    // First find a scenario by name
    const scenarios = await extendedClient.findScenariosByName('Voltaic');
    console.log(`Found ${scenarios.total} scenarios matching 'Voltaic'`);
    
    if (scenarios.data && scenarios.data.length > 0) {
      // Take the first scenario and get its top players
      const firstScenario = scenarios.data[0];
      console.log(`Getting top players for: ${firstScenario.scenarioName} (ID: ${firstScenario.leaderboardId})`);
      
      const topPlayers = await extendedClient.getScenarioTopPlayers(firstScenario.leaderboardId);
      
      // Log the results
      if (topPlayers.data && topPlayers.data.length > 0) {
        console.log('Top players:');
        topPlayers.data.forEach((player: any, index: number) => {
          console.log(`${index + 1}. ${player.webappUsername || player.steamAccountName} - Score: ${player.score}`);
        });
      } else {
        console.log('No players found for this scenario.');
      }
    }
  } catch (error: any) {
    console.error('Example failed:', error);
  }
}

/**
 * Example 2: Create a subclass with additional functionality
 */
class EnhancedKovaaksClient extends KovaaksApiClient {
  // Custom properties
  private cacheEnabled: boolean;
  private cache: Map<string, { data: any, timestamp: number }>;
  private cacheTTL: number; // milliseconds
  
  constructor(options: KovaaksApiClientOptions & { cacheEnabled?: boolean, cacheTTL?: number } = {}) {
    super(options);
    
    // Initialize cache
    this.cacheEnabled = options.cacheEnabled !== false; // Default to true
    this.cacheTTL = options.cacheTTL || 5 * 60 * 1000; // Default 5 minutes
    this.cache = new Map();
    
    console.log(`Enhanced client initialized with cache ${this.cacheEnabled ? 'enabled' : 'disabled'}`);
  }
  
  // Cached version of getTrendingScenarios
  async getTrendingScenarios() {
    const cacheKey = 'trending_scenarios';
    
    // Check cache if enabled
    if (this.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      
      // Check if cache is still valid
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        console.log('Returning trending scenarios from cache');
        return cached.data;
      }
    }
    
    // Fetch fresh data
    console.log('Fetching fresh trending scenarios data');
    const result = await super.getTrendingScenarios();
    
    // Update cache
    if (this.cacheEnabled) {
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    }
    
    return result;
  }
  
  // Additional method to find the most played scenario
  async getMostPlayedScenario() {
    console.log('Finding most played scenario...');
    
    try {
      // Get popular scenarios
      const popular = await this.getPopularScenarios({
        page: 0,
        max: 10
      });
      
      // Find the one with most plays
      if (popular.data && popular.data.length > 0) {
        let mostPlayed = popular.data[0];
        
        popular.data.forEach(scenario => {
          if (scenario.counts.plays > mostPlayed.counts.plays) {
            mostPlayed = scenario;
          }
        });
        
        return {
          name: mostPlayed.scenarioName,
          plays: mostPlayed.counts.plays,
          leaderboardId: mostPlayed.leaderboardId
        };
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Error finding most played scenario:', error.message);
      return null;
    }
  }
  
  // Clear the cache
  clearCache() {
    console.log('Clearing cache');
    this.cache.clear();
  }
}

async function subclassExample() {
  console.log('\n--- Example 2: Using a subclass ---');
  
  // Create enhanced client
  const enhancedClient = new EnhancedKovaaksClient({
    cacheEnabled: true,
    cacheTTL: 30 * 1000 // 30 seconds cache
  });
  
  try {
    // First call - should fetch fresh data
    console.log('First call to getTrendingScenarios');
    const trending1 = await enhancedClient.getTrendingScenarios();
    console.log(`Found ${trending1.length} trending scenarios`);
    
    // Second call - should use cache
    console.log('\nSecond call to getTrendingScenarios');
    const trending2 = await enhancedClient.getTrendingScenarios();
    console.log(`Found ${trending2.length} trending scenarios (from cache)`);
    
    // Get most played scenario
    console.log('\nGetting most played scenario');
    const mostPlayed = await enhancedClient.getMostPlayedScenario();
    
    if (mostPlayed) {
      console.log(`Most played scenario: ${mostPlayed.name} with ${mostPlayed.plays} plays`);
    } else {
      console.log('Could not determine most played scenario');
    }
    
    // Clear cache and fetch again
    console.log('\nClearing cache and fetching trending scenarios again');
    enhancedClient.clearCache();
    const trending3 = await enhancedClient.getTrendingScenarios();
    console.log(`Found ${trending3.length} trending scenarios (fresh data after cache clear)`);
    
  } catch (error: any) {
    console.error('Example failed:', error);
  }
}

/**
 * Run the examples
 */
async function main() {
  try {
    await extendMethodExample();
    await subclassExample();
  } catch (error: any) {
    console.error('Error running examples:', error);
  }
}

main(); 