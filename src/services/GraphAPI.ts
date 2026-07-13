import { MSGraphClientFactory, MSGraphClientV3 } from '@microsoft/sp-http';
import { IUserInfo } from "../redux/Reducer/userSlice";

export interface IGraphServiceResult<T> {
  data: T | null;
  error: string | null;
}

export class GraphService {
  private _client: Promise<MSGraphClientV3>;

  constructor(client: MSGraphClientFactory) {
    this._client = client.getClient('3');
  }

  // Get the current user's profile
  public async getCurrentUser(): Promise<IGraphServiceResult<IUserInfo>> {
    try {
      const client = await this._client;
      const response = await client
        .api('/me')
        .select('displayName,mail,jobTitle,department')
        .get();

      return { data: response as IUserInfo, error: null };
    } catch (err) {
      return { data: null, error: this._extractErrorMessage(err) };
    }
  }

  // Get the current user's profile
  public async getCurrentSite(): Promise<IGraphServiceResult<IUserInfo>> {
    try {
      const client = await this._client;
      const response = await client
        .api('/me')
        .select('title, url')
        .get();

      return { data: response as IUserInfo, error: null };
    } catch (err) {
      return { data: null, error: this._extractErrorMessage(err) };
    }
  }

    // Extract a readable error message from Graph error responses
  private _extractErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'object' && err !== null) {
      const graphErr = err as { body?: string; statusCode?: number };
      if (graphErr.body) {
        try {
          const parsed = JSON.parse(graphErr.body);
          return parsed?.error?.message ?? 'Unknown Graph error';
        } catch {
          return graphErr.body;
        }
      }
    }
    return 'Unknown error';
  }
}


