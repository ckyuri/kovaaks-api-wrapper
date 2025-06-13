import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as KovaaksTypes from './types';

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
      timeout: options.timeout || 30000,
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

  public async searchScenariosByName(params: { scenarioName: string, page?: number, max?: number }): Promise<KovaaksTypes.SearchScenariosByScenarioName.Response> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/scenario/popular', {
        scenarioNameSearch: params.scenarioName,
        page: params.page,
        max: params.max
      })
    });
  }

  public async getBenchmarkProgress(params: {
    benchmarkId: number,
    steamId: string,
    page?: number,
    max?: number
  }): Promise<KovaaksTypes.GetBenchmarkProgressBySteamId64AndBenchmarkId.Response> {
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

  public async getGlobalLeaderboard(params: { page?: number, max?: number }): Promise<KovaaksTypes.GetGlobalLeaderboardScores.Response> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/leaderboard/global/scores', params)
    });
  }

  public async getBenchmarkProgressForUsername(params: { username: string, page?: number, max?: number }): Promise<KovaaksTypes.GetBenchmarkProgressForWebappUsername.Response> {
    return this.request({
      method: 'GET',
      url: this.buildUrl(`/webapp-backend/benchmarks/player-progress-rank`, { 
        username: params.username,
        page: params.page,
        max: params.max
      })
    });
  }

  public async getPlaylistsByUser(params: { username: string, page?: number, max?: number }): Promise<KovaaksTypes.GetPlaylistsCreatedByUser.Response> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/playlist/creator', {
        username: params.username,
        page: params.page,
        max: params.max
      })
    });
  }

  public async getScenariosPlayedByUsername(params: { username: string, page?: number, max?: number, sort?: string }): Promise<KovaaksTypes.GetScenariosPlayedByUsernameSortedByPlays.Response> {
    const queryParams: Record<string, any> = {
      username: params.username,
      page: params.page || 0,
      max: params.max || 10
    };
    if (params.sort) {
      queryParams['sort_param[]'] = params.sort;
    }
    return this.request({
      method: 'GET',
      url: this.buildUrl(`/webapp-backend/user/scenario/total-play`, queryParams)
    });
  }

  public async getRecentHighScoresByUsername(params: { username: string }): Promise<KovaaksTypes.GetRecentScenarioHighScoresByUsername.Response[]> {
    return this.request({
      method: 'GET',
      url: this.buildUrl(`/webapp-backend/user/activity/recent`, { username: params.username })
    });
  }

  public async getFavoriteScenariosByUsername(params: { username: string }): Promise<KovaaksTypes.GetFavoriteScenariosByUsername.Response[]> {
    return this.request({
        method: 'GET',
        url: this.buildUrl(`/webapp-backend/user/favorite/scenarios`, { username: params.username })
    });
  }

  public async getTotalScenariosCount(): Promise<KovaaksTypes.TotalScenariosCount.Response> {
    return this.request({
        method: 'GET',
        url: '/backend/webapp/custom-scenarios-count'
    });
  }

  public async getProfileByUsername(params: { username: string }): Promise<KovaaksTypes.GetProfileByWebappUsername.Response> {
    return this.request({
        method: 'GET',
        url: this.buildUrl(`/webapp-backend/user/profile/by-username`, { username: params.username })
    });
  }

  public async getTrendingScenarios(): Promise<KovaaksTypes.GetTrendingScenarios.Response[]> {
    return this.request({
        method: 'GET',
        url: '/webapp-backend/scenario/trending'
    });
  }

  public async getMonthlyPlayersCount(): Promise<KovaaksTypes.GetMonthlyPlayersCount.Response> {
    return this.request({
        method: 'GET',
        url: '/webapp-backend/user/monthly-players'
    });
  }

  public async getConcurrentUsers(): Promise<KovaaksTypes.GetConcurrentUsers.Response> {
    return this.request({
        method: 'GET',
        url: '/backend/webapp/concurrent-users'
    });
  }

  public async getFeaturedHighScores(params: { page?: number, max?: number }): Promise<KovaaksTypes.FeaturedHighScores.Response[]> {
    return this.request({
        method: 'GET',
        url: this.buildUrl('/webapp-backend/leaderboard/scores/vip/recent', params)
    });
  }
  
  public async getScenarioDetails(params: { leaderboardId: number }): Promise<KovaaksTypes.GetScenarioDetailsByLeaderboardId.Response> {
    return this.request({
        method: 'GET',
        url: this.buildUrl('/webapp-backend/scenario/details', { leaderboardId: params.leaderboardId })
    });
  }

  public async searchScenarioLeaderboard(params: { leaderboardId: number, page?: number, max?: number }): Promise<KovaaksTypes.ScenarioLeaderboardScoreSearch.Response> {
    return this.request({
        method: 'GET',
        url: this.buildUrl('/webapp-backend/leaderboard/scores/global', {
            leaderboardId: params.leaderboardId,
            page: params.page,
            max: params.max
        })
    });
  }

  public async getLastScoresByScenarioName(params: { username: string, scenarioName: string }): Promise<KovaaksTypes.LastScoresByScenarioName.Response> {
    return this.request({
      method: 'GET',
      url: this.buildUrl('/webapp-backend/user/scenario/last-scores/by-name', {
        username: params.username,
        scenarioName: params.scenarioName
      })
    });
  }
} 