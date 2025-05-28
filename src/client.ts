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

/**
 * Custom error class for API-related errors
 */
export class KovaaksApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: any
  ) {
    super(message);
    this.name = 'KovaaksApiError';
  }
}

export interface KovaaksApiClientOptions {
  baseUrl?: string;
  authToken?: string;
  timeout?: number;
  customRequestConfig?: Partial<AxiosRequestConfig>;
}

/**
 * Kovaaks API Client
 * 
 * A TypeScript client for interacting with the Kovaaks API.
 * Provides access to leaderboards, user profiles, scenarios, playlists, and benchmarks.
 */
export class KovaaksApiClient {
  private readonly client: AxiosInstance;
  private authToken?: string;

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
   */
  private setAuthToken(token: string): void {
    this.authToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear the authentication token and log out
   */
  public logout(): void {
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

  // Authentication
  
  /**
   * Log in to the Kovaaks webapp using Basic Auth
   * @param credentials Login credentials (username and password)
   * @returns Login response with JWT token and user profile
   */
  public async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const authString = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
    
    const response = await this.request<LoginResponse>({
      method: 'POST',
      url: '/auth/webapp/login',
      headers: {
        'Authorization': `Basic ${authString}`
      }
    });
    
    if (response.auth.jwt) {
      this.setAuthToken(response.auth.jwt);
    }
    
    return response;
  }

  /**
   * Verify if the current authentication token is valid
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

  // Leaderboards

  /**
   * Get global leaderboard scores
   */
  public async getGlobalLeaderboard(params: GetGlobalLeaderboardParams): Promise<GlobalLeaderboardResponse | GroupedLeaderboardResponse> {
    return this.request({
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
   * Get country-specific leaderboard (requires Kovaaks+ subscription)
   */
  public async getCountryLeaderboard(params: GetCountryLeaderboardParams): Promise<GlobalLeaderboardResponse> {
    if (!this.authToken) {
      throw new KovaaksApiError('Authentication required for country leaderboard access', 401);
    }

    const isValid = await this.verifyToken();
    if (!isValid) {
      throw new KovaaksApiError('Invalid authentication token', 401);
    }

    const profile = await this.getUserProfile();
    if (!profile.kovaaksPlusActive) {
      throw new KovaaksApiError('Kovaaks+ subscription required for country leaderboard access', 403);
    }

    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/global/scores', {
        page: params.page,
        max: params.max,
        filterType: 'country',
        filterValue: params.countryCode
      })
    });
  }

  /**
   * Search the global leaderboard
   */
  public async searchGlobalLeaderboard(params: GetGlobalLeaderboardSearchParams): Promise<GlobalLeaderboardSearchResponse[]> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/global/search', {
        username: params.username
      })
    });
  }

  /**
   * Get scenario-specific leaderboard
   */
  public async getScenarioLeaderboard(params: { 
    leaderboardId: number, 
    page?: number, 
    max?: number, 
    usernameSearch?: string 
  }): Promise<any> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/scores/global', {
        leaderboardId: params.leaderboardId,
        page: params.page ?? 0,
        max: params.max ?? 50,
        ...(params.usernameSearch ? { usernameSearch: params.usernameSearch } : {})
      })
    });
  }

  // User Management

  /**
   * Get current user's profile (requires authentication)
   */
  public async getUserProfile(): Promise<UserProfile> {
    if (!this.authToken) {
      throw new KovaaksApiError('Authentication required for this endpoint', 401);
    }
    
    return this.request({
      method: 'GET',
      url: '/webapp-backend/user/profile'
    });
  }

  /**
   * Get user profile by username
   */
  public async getUserProfileByUsername(params: GetUserProfileByUsernameParams): Promise<UserProfile> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/profile/by-username', {
        username: params.username
      })
    });
  }

  /**
   * Search for users
   */
  public async searchUsers(params: GetUserSearchParams): Promise<UserSearchResponse[]> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/search', {
        username: params.username
      })
    });
  }

  /**
   * Get user's recent activity
   */
  public async getUserActivity(params: GetUserActivityParams): Promise<UserActivity[]> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/activity/recent', {
        username: params.username
      })
    });
  }

  /**
   * Get user's scenario statistics
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
    
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/scenario/total-play', queryParams)
    });
  }

  // Scenarios

  /**
   * Get popular scenarios
   */
  public async getPopularScenarios(params: GetPopularScenariosParams): Promise<ScenarioPopularResponse> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/scenario/popular', {
        page: params.page,
        max: params.max,
        scenarioNameSearch: params.scenarioNameSearch
      })
    });
  }

  /**
   * Get trending scenarios
   */
  public async getTrendingScenarios(): Promise<TrendingScenario[]> {
    return this.request({
      method: 'GET',
      url: '/webapp-backend/scenario/trending'
    });
  }

  /**
   * Get detailed scenario information
   */
  public async getScenarioDetails(params: GetScenarioDetailsParams): Promise<ScenarioDetailsResponse> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/scenario/details', {
        leaderboardId: params.leaderboardId
      })
    });
  }

  // Playlists

  /**
   * Get playlists
   */
  public async getPlaylists(params: GetPlaylistsParams): Promise<PlaylistResponse> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/playlist/playlists', {
        page: params.page,
        max: params.max,
        search: params.search
      })
    });
  }

  // Benchmarks

  /**
   * Get benchmark progress
   */
  public async getBenchmarkProgress(params: GetBenchmarkProgressParams): Promise<BenchmarkProgress> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/benchmarks/player-progress-rank-benchmark', {
        benchmarkId: params.benchmarkId,
        steamId: params.steamId,
        page: params.page,
        max: params.max
      })
    });
  }

  /**
   * Get benchmarks for user
   */
  public async getBenchmarksForUser(params: GetBenchmarksForUserParams): Promise<BenchmarkSearchResponse> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/benchmarks/player-progress-rank', {
        username: params.username,
        page: params.page,
        max: params.max
      })
    });
  }

  // Statistics

  /**
   * Get monthly active player count
   */
  public async getMonthlyPlayers(): Promise<{ count: number }> {
    return this.request({
      method: 'GET',
      url: '/webapp-backend/user/monthly-players'
    });
  }

  /**
   * Get game settings
   */
  public async getGameSettings(): Promise<any> {
    return this.request({
      method: 'GET',
      url: '/webapp-backend/game-settings'
    });
  }
} 