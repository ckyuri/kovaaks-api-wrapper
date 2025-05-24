import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  BenchmarkProgress,
  BenchmarkSearchResponse,
  GlobalLeaderboardResponse,
  GroupedLeaderboardResponse,
  LoginResponse,
  UserProfile,
  UserActivity,
  ScenarioPopularResponse,
  UserScenarioResponse,
  TrendingScenario,
  GetBenchmarkProgressParams,
  GetBenchmarksForUserParams,
  GetGlobalLeaderboardParams,
  GetUserActivityParams,
  GetPopularScenariosParams,
  GetUserProfileByUsernameParams,
  GetUserScenarioParams,
  LoginCredentials,
  GetCountryLeaderboardParams,
  PlaylistResponse,
  GetPlaylistsParams,
  GlobalLeaderboardSearchResponse,
  GetGlobalLeaderboardSearchParams,
  ScenarioDetailsResponse,
  GetScenarioDetailsParams,
  UserSearchResponse,
  GetUserSearchParams
} from './types';

export class KovaaksApiError extends Error {
  public readonly status: number;
  public readonly response: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = 'KovaaksApiError';
    this.status = status;
    this.response = response;
  }
}

export interface KovaaksApiClientOptions {
  baseUrl?: string;
  authToken?: string;
  timeout?: number;
  customRequestConfig?: Partial<AxiosRequestConfig>;
}

/**
 * A client for the Kovaaks API
 */
export class KovaaksApiClient {
  private client: AxiosInstance;
  private authToken?: string;

  /**
   * Create a new KovaaksApiClient
   * @param options Client configuration options
   */
  constructor(options: KovaaksApiClientOptions = {}) {
    const baseURL = options.baseUrl || 'https://kovaaks.com';
    
    this.client = axios.create({
      baseURL,
      timeout: options.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options.customRequestConfig
    });

    if (options.authToken) {
      this.setAuthToken(options.authToken);
    }

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.error || error.message || 'Unknown error';
        const status = error.response?.status || 500;
        const response = error.response?.data;
        
        throw new KovaaksApiError(message, status, response);
      }
    );
  }

  /**
   * Set the authentication token for future requests
   * @param token JWT token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear the authentication token
   */
  public clearAuthToken(): void {
    this.authToken = undefined;
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Helper method to build URL with query parameters
   */
  private buildUrl(path: string, params: Record<string, any> = {}): string {
    const url = new URL(path, this.client.defaults.baseURL);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array parameters
          value.forEach(v => url.searchParams.append(`${key}[]`, String(v)));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
    
    return url.toString();
  }

  /**
   * Make an HTTP request
   * @protected - Available to extending classes
   */
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      if (error instanceof KovaaksApiError) {
        throw error;
      }
      throw new KovaaksApiError(
        (error as Error).message || 'Request failed',
        500
      );
    }
  }

  /**
   * Create a request configuration with default options
   * @param method HTTP method
   * @param url URL path
   * @param data Request data (for POST, PUT, etc.)
   * @param params URL parameters
   * @returns AxiosRequestConfig object
   */
  protected createRequestConfig(
    method: string,
    url: string,
    data?: any,
    params?: Record<string, any>
  ): AxiosRequestConfig {
    return {
      method,
      url: params ? this.buildUrl(url, params) : url,
      data
    };
  }
  
  /**
   * Extend the client with custom methods
   * @param methods Object with methods to add to the client
   * @returns Extended client instance (this)
   */
  public extend<T extends Record<string, Function>>(methods: T): this & T {
    Object.entries(methods).forEach(([name, method]) => {
      // @ts-ignore - Dynamic extension
      this[name] = method.bind(this);
    });
    
    // @ts-ignore - Return type with extensions
    return this;
  }

  /**
   * Log in to the Kovaaks webapp
   * @param credentials Login credentials (username and password)
   * @returns {Promise<LoginResponse>} A promise resolving to a LoginResponse object containing:
   * - auth: Authentication data including JWT tokens, expiration, and Steam account mappings
   * - profile: Complete user profile with personal information, social media accounts, and game settings
   * - redirect: Boolean indicating if a redirect is needed after login
   * @throws {KovaaksApiError} If login fails due to invalid credentials or server issues
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Use Basic Authentication
    const authString = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
    
    const response = await this.request<LoginResponse>({
      method: 'POST',
      url: '/auth/webapp/login',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    });
    
    // Automatically set the auth token for future requests
    if (response.auth.jwt) {
      this.setAuthToken(response.auth.jwt);
    }
    
    return response;
  }

  /**
   * Verify if the current authentication token is valid
   * @returns {Promise<boolean>} A promise resolving to true if the token is valid and accepted by the server, false otherwise
   */
  public async verifyToken(): Promise<boolean> {
    if (!this.authToken) {
      return false;
    }
    
    try {
      const response = await this.request<{ success: boolean }>({
        method: 'GET',
        url: '/auth/webapp/verify-token'
      });
      
      return response.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get benchmark progress for a player
   * @param params Parameters for the request including benchmarkId and steamId
   * @returns {Promise<BenchmarkProgress>} A promise resolving to the benchmark progress data containing:
   * - benchmark_progress: Overall progress score
   * - overall_rank: Player's overall rank in the benchmark
   * - categories: Object mapping category names to detailed category progress data including:
   *   - benchmark_progress: Category-specific progress score
   *   - category_rank: Player's rank in this category
   *   - rank_maxes: Array of score thresholds for each rank
   *   - scenarios: Object mapping scenario names to scenario-specific scores and rankings
   * - ranks: Array of rank information objects with icons, colors and descriptions
   */
  public async getBenchmarkProgress(params: GetBenchmarkProgressParams): Promise<BenchmarkProgress> {
    return this.request<BenchmarkProgress>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/benchmarks/player-progress-rank-benchmark', {
        benchmarkId: params.benchmarkId,
        steamId: params.steamId,
        page: params.page ?? 0,
        max: params.max ?? 100
      })
    });
  }

  /**
   * Get benchmarks for a user
   * @param params Parameters including username, page, and max results
   * @returns {Promise<BenchmarkSearchResponse>} A promise resolving to benchmark search results containing:
   * - page: Current page number
   * - max: Maximum results per page
   * - total: Total number of benchmarks available
   * - data: Array of benchmark objects with name, ID, icon, author, type, and rank information
   */
  public async getBenchmarksForUser(params: GetBenchmarksForUserParams): Promise<BenchmarkSearchResponse> {
    return this.request<BenchmarkSearchResponse>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/benchmarks/player-progress-rank', {
        username: params.username,
        page: params.page,
        max: params.max
      })
    });
  }

  /**
   * Get global leaderboard scores
   * @param params Parameters including page, max results, optional grouping and filtering
   * @returns {Promise<GlobalLeaderboardResponse | GroupedLeaderboardResponse>} 
   * - When no grouping is specified: GlobalLeaderboardResponse with individual player entries including:
   *   - data: Array of player entries with rank, Steam ID, username, points, scenarios count, etc.
   *   - total: Total number of entries
   * - When grouped (by country, region): GroupedLeaderboardResponse with group entries including:
   *   - data: Array of group entries with group name, points, scenarios count, etc.
   *   - total: Total number of group entries
   */
  public async getGlobalLeaderboard(params: GetGlobalLeaderboardParams): Promise<GlobalLeaderboardResponse | GroupedLeaderboardResponse> {
    return this.request<GlobalLeaderboardResponse | GroupedLeaderboardResponse>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/global/scores', {
        page: params.page,
        max: params.max,
        group: params.group,
        filterType: params.filterType,
        filterValue: params.filterValue
      })
    });
  }

  /**
   * Get global leaderboard scores filtered by country
   * @param params Parameters including page, max results, and countryCode
   * @returns {Promise<GlobalLeaderboardResponse>} A promise resolving to country-specific leaderboard data:
   * - data: Array of player entries from the specified country with rank, Steam ID, points, etc.
   * - total: Total number of entries
   * @throws {KovaaksApiError} If user isn't authenticated, has invalid token, or lacks Kovaaks+ subscription
   */
  public async getCountryLeaderboard(params: GetCountryLeaderboardParams): Promise<GlobalLeaderboardResponse> {
    // Check if user is authenticated
    if (!this.authToken) {
      throw new KovaaksApiError(
        'Authentication required for country leaderboard access',
        401
      );
    }

    // Verify token and check supporter status
    try {
      const isValid = await this.verifyToken();
      if (!isValid) {
        throw new KovaaksApiError(
          'Invalid authentication token',
          401
        );
      }

      // Get user profile to check supporter status
      const profile = await this.getUserProfile();
      if (!profile.kovaaksPlusActive) {
        throw new KovaaksApiError(
          'Kovaaks+ subscription required for country leaderboard access',
          403
        );
      }

      return this.request<GlobalLeaderboardResponse>({
        method: 'GET',
        url: this.buildUrl('/webapp-backend/leaderboard/global/scores', {
          page: params.page,
          max: params.max,
          filterType: 'country',
          filterValue: params.countryCode
        })
      });
    } catch (error) {
      if (error instanceof KovaaksApiError) {
        throw error;
      }
      throw new KovaaksApiError(
        'Failed to verify authentication or supporter status',
        500
      );
    }
  }

  /**
   * Get monthly player count
   * @returns {Promise<{count: number}>} A promise resolving to an object containing:
   * - count: The number of active players in the current month
   */
  public async getMonthlyPlayers(): Promise<{ count: number }> {
    return this.request<{ count: number }>({
      method: 'GET',
      url: '/webapp-backend/user/monthly-players'
    });
  }

  /**
   * Get game settings
   * @returns {Promise<any>} A promise resolving to game settings data with variable structure
   */
  public async getGameSettings(): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/webapp-backend/game-settings'
    });
  }

  /**
   * Get current user profile (requires authentication)
   * @returns {Promise<UserProfile>} A promise resolving to the authenticated user's profile containing:
   * - playerId: Numeric ID of the player
   * - steamAccountName: Steam username
   * - steamAccountAvatar: URL to Steam avatar image
   * - created: Account creation timestamp
   * - steamId: Steam ID string
   * - webapp: Object with webapp-specific properties including:
   *   - roles: User permission roles (admin, coach, staff)
   *   - socialMedia: Social media links and IDs
   *   - gameSettings: Game configuration (sensitivity, DPI, FOV)
   *   - gamingPeripherals: Hardware details (mouse, keyboard, etc.)
   * - kovaaksPlusActive: Boolean indicating if user has active Kovaaks+ subscription
   * - features: Available features for this user
   * @throws {KovaaksApiError} If not authenticated
   */
  public async getUserProfile(): Promise<UserProfile> {
    if (!this.authToken) {
      throw new KovaaksApiError('Authentication required for this endpoint', 401);
    }
    
    return this.request<UserProfile>({
      method: 'GET',
      url: '/webapp-backend/user/profile'
    });
  }

  /**
   * Get recent activity for a user
   * @param params Parameters including username
   * @returns {Promise<UserActivity[]>} A promise resolving to an array of activity entries, each containing:
   * - timestamp: When the activity occurred
   * - type: Activity type (e.g., "HIGH_SCORE")
   * - scenarioName: Name of the scenario involved
   * - score: Numeric score achieved
   * - leaderboardId: ID of the relevant leaderboard
   * - steamId: User's Steam ID
   * - country: User's country code
   * - kovaaksPlus: Boolean indicating if user has Kovaaks+
   */
  public async getUserActivity(params: GetUserActivityParams): Promise<UserActivity[]> {
    return this.request<UserActivity[]>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/activity/recent', {
        username: params.username
      })
    });
  }

  /**
   * Get popular scenarios
   * @param params Parameters including page, max results, and optional scenario name search
   * @returns {Promise<ScenarioPopularResponse>} A promise resolving to popular scenarios data containing:
   * - page: Current page number
   * - max: Maximum results per page
   * - total: Total number of scenarios available
   * - data: Array of scenario objects with:
   *   - rank: Popularity rank
   *   - leaderboardId: Unique ID for the scenario's leaderboard
   *   - scenarioName: Name of the scenario
   *   - scenario: Object with aim type, authors, and description
   *   - counts: Object with play and entry counts
   *   - topScore: Object with the highest score achieved
   */
  public async getPopularScenarios(params: GetPopularScenariosParams): Promise<ScenarioPopularResponse> {
    return this.request<ScenarioPopularResponse>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/scenario/popular', {
        page: params.page,
        max: params.max,
        scenarioNameSearch: params.scenarioNameSearch
      })
    });
  }

  /**
   * Get user profile by username
   * @param params Parameters including username
   * @returns {Promise<UserProfile>} A promise resolving to the specified user's profile with the same structure
   * as getUserProfile() but for the specified user instead of the authenticated user
   */
  public async getUserProfileByUsername(params: GetUserProfileByUsernameParams): Promise<UserProfile> {
    return this.request<UserProfile>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/profile/by-username', {
        username: params.username
      })
    });
  }

  /**
   * Get user's scenario leaderboard scores
   * @param params Parameters including username, page, max results, and optional sort parameter
   * @returns {Promise<UserScenarioResponse>} A promise resolving to user scenario data containing:
   * - page: Current page number
   * - max: Maximum results per page
   * - total: Total number of scenarios played by the user
   * - data: Array of scenario entries with:
   *   - leaderboardId: Scenario leaderboard ID
   *   - scenarioName: Name of the scenario
   *   - counts: Object with play count
   *   - rank: User's rank on this scenario's leaderboard
   *   - score: User's best score
   *   - attributes: Detailed score attributes (FPS, TTK, sensitivity, etc.)
   *   - scenario: Object with aim type, authors, and description
   */
  public async getUserScenarios(params: GetUserScenarioParams): Promise<UserScenarioResponse> {
    const queryParams: Record<string, any> = {
      username: params.username,
      page: params.page,
      max: params.max
    };
    
    if (params.sortParam) {
      queryParams['sort_param[]'] = params.sortParam;
    }
    
    return this.request<UserScenarioResponse>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/scenario/total-play', queryParams)
    });
  }

  /**
   * Get trending scenarios
   * @returns {Promise<TrendingScenario[]>} A promise resolving to an array of trending scenarios, each containing:
   * - scenarioName: Name of the scenario
   * - leaderboardId: ID of the scenario's leaderboard
   * - webappUsername: Username of the top player (if available)
   * - steamAccountName: Steam name of the top player
   * - kovaaksPlusActive: Whether the top player has Kovaaks+
   * - entries: Number of entries/plays
   * - new: Boolean indicating if this is a new trending scenario
   */
  public async getTrendingScenarios(): Promise<TrendingScenario[]> {
    return this.request<TrendingScenario[]>({
      method: 'GET',
      url: '/webapp-backend/scenario/trending'
    });
  }

  /**
   * Get playlists
   * @param params Parameters including page, max results, and optional search term
   * @returns {Promise<PlaylistResponse>} A promise resolving to playlist data containing:
   * - page: Current page number
   * - max: Maximum results per page
   * - total: Total number of playlists available
   * - data: Array of playlist objects with:
   *   - playlistName: Name of the playlist
   *   - subscribers: Number of subscribers
   *   - scenarioList: Array of scenarios in the playlist
   *   - playlistCode: Unique code for the playlist
   *   - playlistId: Numeric ID of the playlist
   *   - published: Publication timestamp
   *   - description: Playlist description
   *   - aimType: Primary aim type targeted by the playlist
   *   - playlistDuration: Estimated duration in minutes
   */
  public async getPlaylists(params: GetPlaylistsParams): Promise<PlaylistResponse> {
    return this.request<PlaylistResponse>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/playlist/playlists', {
        page: params.page,
        max: params.max,
        search: params.search
      })
    });
  }

  /**
   * Search the global leaderboard for users
   * @param params Parameters including username search term
   * @returns {Promise<GlobalLeaderboardSearchResponse[]>} A promise resolving to an array of matching players, each containing:
   * - steamId: Player's Steam ID
   * - rank: Global leaderboard rank
   * - rankChange: Change in rank since last period
   * - username: Webapp username (if available)
   * - steamAccountName: Steam account name
   * - steamAccountAvatar: URL to Steam avatar image
   * - country: Country code
   * - kovaaksPlusActive: Whether the player has Kovaaks+
   */
  public async searchGlobalLeaderboard(params: GetGlobalLeaderboardSearchParams): Promise<GlobalLeaderboardSearchResponse[]> {
    return this.request<GlobalLeaderboardSearchResponse[]>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/global/search/account-names', {
        username: params.username
      })
    });
  }

  /**
   * Get detailed information about a scenario
   * @param params Parameters including leaderboardId
   * @returns {Promise<ScenarioDetailsResponse>} A promise resolving to scenario details containing:
   * - scenarioName: Name of the scenario
   * - aimType: Type of aim required (e.g., "Tracking", "Clicking")
   * - playCount: Total number of plays
   * - steamId: Creator's Steam ID
   * - steamAccountName: Creator's Steam account name
   * - webappUsername: Creator's webapp username
   * - description: Scenario description
   * - tags: Array of tags/categories
   * - created: Creation timestamp
   */
  public async getScenarioDetails(params: GetScenarioDetailsParams): Promise<ScenarioDetailsResponse> {
    return this.request<ScenarioDetailsResponse>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/scenario/details', {
        leaderboardId: params.leaderboardId
      })
    });
  }

  /**
   * Search for users by username
   * @param params Parameters including username search term
   * @returns {Promise<UserSearchResponse[]>} A promise resolving to an array of matching users, each containing:
   * - steamId: User's Steam ID
   * - username: Webapp username
   * - steamAccountName: Steam account name
   * - steamAccountAvatar: URL to Steam avatar image
   * - country: Country code (if available)
   * - kovaaksPlusActive: Whether the user has Kovaaks+
   */
  public async searchUsers(params: GetUserSearchParams): Promise<UserSearchResponse[]> {
    return this.request<UserSearchResponse[]>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/search', {
        username: params.username
      })
    });
  }

  /**
   * Get scenario-specific leaderboard scores
   * @param params Parameters including leaderboardId, page, max results, and optional usernameSearch
   * @returns {Promise<any>} A promise resolving to leaderboard data for the specified scenario
   */
  public async getScenarioLeaderboard(params: { leaderboardId: number, page?: number, max?: number, usernameSearch?: string }): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/scores/global', {
        leaderboardId: params.leaderboardId,
        page: params.page ?? 0,
        max: params.max ?? 50,
        ...(params.usernameSearch ? { usernameSearch: params.usernameSearch } : {})
      })
    });
  }
} 