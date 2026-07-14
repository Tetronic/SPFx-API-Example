import * as React from 'react';
import styles from './GetM365Infos.module.scss';
import type { IGetM365InfosProps } from './IGetM365InfosProps';

import { ISiteInfoTitle, ISiteInfoURL, IGroupInfo, IListInfo  } from '../../../interfaces/Interfaces';
import { IUserInfo } from '../../../redux/Reducer/userSlice'

import { Provider } from 'react-redux';
import { store } from '../../../redux/Store/store'

import { UserInfoComponent } from '../../../components/UserInfo';
import { SiteInfoComponent } from '../../../components/SiteInfo';
import { GroupsInfoComponent } from '../../../components/GroupsInfo';
import { ListsInfoComponent } from '../../../components/ListsInfo';

import { MSGraphClientFactory, SPHttpClient } from '@microsoft/sp-http';
import { GraphService } from '../../../services/GraphAPI';
import { SPService } from '../../../services/SharePointAPI';



interface IAppState {
  userObject: IUserInfo;
  siteTitleObject: ISiteInfoTitle;
  siteURLObject: ISiteInfoURL;
  groupObject: IGroupInfo;
  listObject: IListInfo;
}

export default class GetM365Infos extends React.Component<IGetM365InfosProps, IAppState> {
  
private _graphService: GraphService;
private _spService: SPService;

  constructor(props: IGetM365InfosProps) {
    super(props);

    //this.state = { 
      // userObject: {userName: "", email: "", jobTitle: "", department: ""},
      /*siteTitleObject: {title: ""},
      siteURLObject: {url: ""},
      groupObject: {groups: []},
      listObject: {lists: []}

    };*/

    // initialize APIs
    const client: MSGraphClientFactory = this.props.context.msGraphClientFactory;
    this._graphService = new GraphService(client);

    const spHttpClient: SPHttpClient = this.props.context.spHttpClient;
    const url: string = this.props.context.pageContext.web.absoluteUrl;
    this._spService = new SPService(url, spHttpClient);
  }

  public componentDidMount() {
    this.getData();
  }

  public getData(){
    
      // GRAPH API

      // function works, but is too fast. API delivers async later
      // const userObject = getCurrentUserInfos(this.props.context);
      /*console.log("NOW COMES OBJECT");
      console.log(userObject);

      this.setState({
         userObject: 
          {
            displayName: userObject.displayName, 
            mail: userObject.email, 
            jobTitle:userObject.jobTitle, 
            department: userObject.department
          }
      })*/

      /*this.props.context.msGraphClientFactory
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api("/me")
          .select('displayName, mail, jobTitle, department')
          .get()
          .then((user: any) =>
          {
            // this._currentUser = user;
            console.log(user.displayName);
            console.log(user.mail);
            console.log(user.jobTitle);
            console.log(user.department);
            this.setState({ userObject: {userName: user.displayName, email: user.mail, jobTitle:user.jobTitle, department: user.department}})
          })
          .catch(error => {
            console.error("Error fetching /me from Microsoft Graph", error);
          })
        });*/

        // SP API

        /*let currentWebUrl = this.props.context.pageContext.web.absoluteUrl;

        // OK
        let requestUrl = currentWebUrl.concat("/_api/web/title")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON!=null && responseJSON.value!=null)
                        {
                          let title:string = responseJSON.value.toString();
                          console.log(title);
                          this.setState({ siteTitleObject: {title: title}})
                        }
                    });
                }
            });


        // OK
        requestUrl = currentWebUrl.concat("/_api/web/url")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON!=null && responseJSON.value!=null)
                        {
                          let url:string = responseJSON.value.toString();
                          console.log(url);
                          this.setState({ siteURLObject: {url: url}})
                        }
                    });
                }
            });


        // OK
        requestUrl = currentWebUrl.concat("/_api/Web/CurrentUser/Groups")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                      if (responseJSON!=null && responseJSON.value!=null) 
                      {
                        this.setState({ groupObject: {groups: responseJSON.value}})

                        var groups = responseJSON.value;
                        let groupArray:any[] = groups;
                        for (var i = 0; i < groupArray.length; i++) {
                          console.log(groupArray[i].Title);
                        }
                      }
                    });
                }
            });

        // OK
        requestUrl = currentWebUrl.concat("/_api/lists")

        this.props.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                if (response.ok) {
                    response.json().then((responseJSON) => {
                        if (responseJSON!=null && responseJSON.value!=null)
                        {                          
                          this.setState({ listObject: {lists: responseJSON.value}})
                          
                          let listArray:any[] = responseJSON.value;
                          for (var i = 0; i < listArray.length; i++) {
                            console.log(listArray[i].Title);
                            console.log(listArray[i].ItemCount);
                          }
                        }
                    });
                }
            });*/

    }

  public render(): React.ReactElement<IGetM365InfosProps> {

    /*const userObject = this.state.userObject;
    const siteTitleObject = this.state.siteTitleObject;
    const siteURLObject = this.state.siteURLObject;
    const groupObject = this.state.groupObject;
    const listObject = this.state.listObject;*/
    const graphService: GraphService = this._graphService;
    const spService: SPService = this._spService;
    
    return (
      <Provider store={store}>
        <section className={`${styles.getM365Infos} }`}>
          <div className={styles.welcome}>
            <UserInfoComponent graphService={graphService} />
            <SiteInfoComponent spService={spService} />
            <GroupsInfoComponent spService={spService} />
            <ListsInfoComponent spService={spService} />
          </div>
        </section>
      </Provider>
    );
  }
}
