import { SPHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
import { ISiteInfo } from "../redux/Reducer/siteSlice";
import { IGroupsInfo } from "../redux/Reducer/groupsSlice";
import { IListsInfo } from "../redux/Reducer/listsSlice";

export interface ISPServiceResult<T> {
  data: T | null;
  error: string | null;
}

export class SPService {
  private _absoluteURL: string;
  private _client: SPHttpClient;

  constructor(absoluteURL: string, client: SPHttpClient) {
    this._absoluteURL = absoluteURL;
    this._client = client;
  }

  public async GetCurrentSiteInfo(): Promise<ISiteInfo> {
    const siteUrl = `${this._absoluteURL}/_api/web/title`;

    const options: ISPHttpClientOptions = {
        headers: {
            'odata-version':'3.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'          
        }               
    };
    const response = await this._client.get(
        siteUrl,
        SPHttpClient.configurations.v1,
        options
    );
    let data = await response.json();
    const title = data.value;
    const url = this._absoluteURL;
    // return { data: data as ISiteInfo, error: null };
    return { title: title, url: url };
    // return data;
  }

  public async GetGroupsInfo(): Promise<IGroupsInfo[]> {
    const groupsUrl = `${this._absoluteURL}/_api/web/CurrentUser/Groups`;

    const options: ISPHttpClientOptions = {
        headers: {
            'odata-version':'3.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'          
        }               
    };
    const response = await this._client.get(
        groupsUrl,
        SPHttpClient.configurations.v1,
        options
    );
    let data = await response.json();
    return data.value;
  }

  public async GetListsInfo(): Promise<IListsInfo[]> {
    const listsUrl = `${this._absoluteURL}/_api/lists`;

    const options: ISPHttpClientOptions = {
        headers: {
            'odata-version':'3.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'          
        }               
    };
    const response = await this._client.get(
        listsUrl,
        SPHttpClient.configurations.v1,
        options
    );
    let data = await response.json();
    return data.value;
  }



    // Extract a readable error message from Graph error responses
  /*private _extractErrorMessage(err: unknown): string {
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
  }*/
}


