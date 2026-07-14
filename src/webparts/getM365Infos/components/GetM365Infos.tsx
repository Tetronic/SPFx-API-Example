import * as React from 'react';
import styles from './GetM365Infos.module.scss';
import type { IGetM365InfosProps } from './IGetM365InfosProps';

import { Provider } from 'react-redux';
import { store } from '../../../redux/Store/store'

import { UserInfoComponent } from '../../../components/UserInfo';
import { SiteInfoComponent } from '../../../components/SiteInfo';
import { GroupsInfoComponent } from '../../../components/GroupsInfo';
import { ListsInfoComponent } from '../../../components/ListsInfo';

import { MSGraphClientFactory, SPHttpClient } from '@microsoft/sp-http';
import { GraphService } from '../../../services/GraphAPI';
import { SPService } from '../../../services/SharePointAPI';


export default class GetM365Infos extends React.Component<IGetM365InfosProps> {
  
private _graphService: GraphService;
private _spService: SPService;

  constructor(props: IGetM365InfosProps) {
    super(props);

    // initialize APIs
    const client: MSGraphClientFactory = this.props.context.msGraphClientFactory;
    this._graphService = new GraphService(client);

    const spHttpClient: SPHttpClient = this.props.context.spHttpClient;
    const url: string = this.props.context.pageContext.web.absoluteUrl;
    this._spService = new SPService(url, spHttpClient);
  }

  public render(): React.ReactElement<IGetM365InfosProps> {

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
