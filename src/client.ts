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
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
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
   * Log in to the Kovaaks webapp
   * @param credentials Login credentials
   * @returns Login response with tokens and profile
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
   * @returns Boolean indicating if token is valid
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
   * @param params Parameters for the request
   * @returns Benchmark progress data
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
   * @param params Parameters for the request
   * @returns Benchmark search results
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
   * @param params Parameters for the request
   * @returns Global leaderboard data
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
   * @param params Parameters for the request
   * @returns Global leaderboard data for the specified country
   * @throws {KovaaksApiError} If not authenticated or not a supporter
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
   * @returns Monthly player count data
   */
  public async getMonthlyPlayers(): Promise<{ count: number }> {
    return this.request<{ count: number }>({
      method: 'GET',
      url: '/webapp-backend/user/monthly-players'
    });
  }

  /**
   * Get game settings
   * @returns Game settings data
   */
  public async getGameSettings(): Promise<any> {
    return this.request<any>({
      method: 'GET',
      url: '/webapp-backend/game-settings'
    });
  }

  /**
   * Get current user profile (requires authentication)
   * @returns User profile data
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
   * @param params Parameters for the request
   * @returns Recent activity data
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
   * @param params Parameters for the request
   * @returns Popular scenarios data
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
   * @param params Parameters for the request
   * @returns User profile data
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
   * @param params Parameters for the request
   * @returns User's scenario data
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
   * @returns Trending scenarios data
   */
  public async getTrendingScenarios(): Promise<TrendingScenario[]> {
    return this.request<TrendingScenario[]>({
      method: 'GET',
      url: '/webapp-backend/scenario/trending'
    });
  }

  /**
   * Get playlists with optional search
   * @param params Parameters for the request
   * @returns Playlist data
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
   * Search global leaderboard by username
   * @param params Parameters for the request
   * @returns Array of matching leaderboard entries
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
   * Get scenario details by leaderboard ID
   * @param params Parameters for the request
   * @returns Scenario details
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
   * @param params Parameters for the request
   * @returns Array of matching user profiles
   */
  public async searchUsers(params: GetUserSearchParams): Promise<UserSearchResponse[]> {
    return this.request<UserSearchResponse[]>({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/search', {
        username: params.username
      })
    });
  }
} 