// import React, { useEffect } from 'react';
import React from 'react';

// import { fetchUser, selectUser } from '../redux/Reducer/userSlice'
import { fetchSite, selectSite } from '../redux/Reducer/siteSlice'
// import { fetchUser, selectUserInfoStatus } from '../redux/features/user/userSlice'
// import { doAnUpdateAsync } from '../redux/features/user/userSlice'

import { useSelector, useDispatch } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store/store'
import { SPService } from '../services/SharePointAPI';

interface IProps {
  spService: SPService;
}

export const SiteInfoComponent: React.FC<IProps> = ({spService}) => {
  
    // const userInfoStatus = useSelector(selectUserInfoStatus)

    const dispatch = useDispatch<AppDispatch>();
    
    // use effect hook is executed, when component is loaded ("onLoad()-event")
    // it will reload, if [userInfoStatus or dispatch changes their values] ("event listener")
    /*useEffect(() => {
        if (userInfoStatus === "idle") {
            dispatch(fetchUser())
        }
    }, [userInfoStatus , dispatch])*/

    // dispatch(doAnUpdateAsync());
    dispatch(fetchSite(spService));

    const siteInfo = useSelector(selectSite)
    console.log("siteInfo:");
    console.log(siteInfo);
  
    return (
    
        <section>
            <div>
                <h2>Site Information</h2>
                <div><b>Site Title:</b>&nbsp;{siteInfo.title}</div>
                <div><b>URL:</b>&nbsp;{siteInfo.url}</div>
            </div>
        </section>
    )
} 
