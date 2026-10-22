// Central API Client configured for Go/Gin Backend integration
// Base URL is configurable via environment variables (EXPO_PUBLIC_API_URL)
// Controlled demo mode provides instant, reliable responses when backend is offline

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs: number;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.wayalogistics.africa/v1',
  timeoutMs: 12000,
};

class ApiClient {
  private config: ApiClientConfig;
  private token: string | null = null;
  private isDemoMode: boolean = true;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public setToken(token: string | null) {
    this.token = token;
  }

  public setDemoMode(enabled: boolean) {
    this.isDemoMode = enabled;
  }

  public getIsDemoMode(): boolean {
    return this.isDemoMode;
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  public async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Platform': 'WayaMobile-Expo',
      'X-Client-Version': '1.0.0',
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const url = `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `HTTP ${response.status} error` };
        }
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      // In mobile apps, if network connection drops or backend is in staging/local development,
      // log clearly without breaking app initialization
      if (__DEV__) {
        console.warn(`[ApiClient] Request to ${endpoint} failed:`, err?.message || err);
      }
      throw err;
    }
  }
}

export const apiClient = new ApiClient();
