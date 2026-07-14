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
    return { title: title, url: url };
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
}


