import * as React from 'react';
import styles from './GetM365Infos.module.scss';
import type { IGetM365InfosProps } from './IGetM365InfosProps';

import { MSGraphClientV3 } from '@microsoft/sp-http';
import { SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http'

import { IUserInfo, ISiteInfoTitle, ISiteInfoURL, IGroupInfo, IListInfo  } from './Interfaces';

interface IAppState {
  userObject: IUserInfo;
  siteTitleObject: ISiteInfoTitle;
  siteURLObject: ISiteInfoURL;
  groupObject: IGroupInfo;
  listObject: IListInfo;
}

export default class GetM365Infos extends React.Component<IGetM365InfosProps, IAppState> {
  
  constructor(props: IGetM365InfosProps) {
    super(props);

    this.state = { 
      userObject: {userName: "", email: "", jobTitle: "", department: ""},
      siteTitleObject: {title: ""},
      siteURLObject: {url: ""},
      groupObject: {groups: []},
      listObject: {lists: []}
    };
  }

    public componentDidMount() {
      this.getData();
    }

  private getData(){
    
      // GRAPH API

      this.props.context.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api("/me")
          .select('displayName, mail, jobTitle, department')
          .get()
          .then((user: any) =>
          {
            console.log(user.displayName);
            console.log(user.mail);
            console.log(user.jobTitle);
            console.log(user.department);
            this.setState({ userObject: {userName: user.displayName, email: user.mail, jobTitle:user.jobTitle, department: user.department}})
          })
          .catch(error => {
            console.error("Error fetching /me from Microsoft Graph", error);
          })
        });

        // SP API

        let currentWebUrl = this.props.context.pageContext.web.absoluteUrl;

        let requestUrl = currentWebUrl.concat("/_api/web/title")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON !== null && responseJSON.value !== null)
                        {
                          const title:string = responseJSON.value.toString();
                          console.log(title);
                          this.setState({ siteTitleObject: {title: title}})
                        }
                    });
                }
            })
            .catch(error => {
              console.error("Error fetching /_api/web/title from SharePoint REST API", error);
            });


        requestUrl = currentWebUrl.concat("/_api/web/url")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON !== null && responseJSON.value !== null)
                        {
                          const url:string = responseJSON.value.toString();
                          console.log(url);
                          this.setState({ siteURLObject: {url: url}})
                        }
                    });
                }
            })
            .catch(error => {
              console.error("Error fetching /_api/web/url from SharePoint REST API", error);
            });


        requestUrl = currentWebUrl.concat("/_api/Web/CurrentUser/Groups")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                      if (responseJSON !== null && responseJSON.value !== null) 
                      {
                        this.setState({ groupObject: {groups: responseJSON.value}})

                        const groupArray:any[] = responseJSON.value;
                        for (var i = 0; i < groupArray.length; i++) {
                          console.log(groupArray[i].Title);
                        }
                      }
                    });
                }
            })
            .catch(error => {
              console.error("Error fetching /_api/Web/CurrentUser/Groups from SharePoint REST API", error);
            });

        requestUrl = currentWebUrl.concat("/_api/lists")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON !== null && responseJSON.value !== null)
                        {                          
                          this.setState({ listObject: {lists: responseJSON.value}})
                          
                          const listArray:any[] = responseJSON.value;
                          for (var i = 0; i < listArray.length; i++) {
                            console.log(listArray[i].Title);
                            console.log(listArray[i].ItemCount);
                          }
                        }
                    });
                }
            })
            .catch(error => {
              console.error("Error fetching /_api/lists from SharePoint REST API", error);
            });

    }

  public render(): React.ReactElement<IGetM365InfosProps> {

    const userObject = this.state.userObject;
    const siteTitleObject = this.state.siteTitleObject;
    const siteURLObject = this.state.siteURLObject;
    const groupObject = this.state.groupObject;
    const listObject = this.state.listObject;

    return (
      <section className={`${styles.getM365Infos} }`}>
        <div className={styles.welcome}>
          <h2>Profile</h2>
          <div><b>Name:</b>&nbsp;{userObject.userName}</div>
          <div><b>E-Mail:</b>&nbsp;{userObject.email}</div>
          <div><b>Job Title:</b>&nbsp;{userObject.jobTitle}</div>
          <div><b>Department:</b>&nbsp;{userObject.department}</div>

          <h2>Site Information</h2>
          <div><b>Site Title:</b>&nbsp;{siteTitleObject.title}</div>
          <div><b>URL:</b>&nbsp;{siteURLObject.url}</div>

          <h2>User Groups</h2>
          {
            groupObject.groups.map((g: any) => {
                return (
                    <div>{g.Title}</div>
                );
            })  
          }
        
          <h2>Available Lists on this Site</h2>

          <div>
            <table style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <tr>
                <th>Title</th>
                <th>Items</th>
              </tr>
              {
                listObject.lists.map((l: any) => {
                  return (
                      <tr>
                        <td>{l.Title}</td>
                        <td>{l.ItemCount}</td>
                      </tr>
                  );
                })
              }            
            </table>
          </div>

        </div>
      </section>
    );
  }
}
