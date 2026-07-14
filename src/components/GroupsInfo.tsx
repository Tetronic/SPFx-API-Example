import React, { useEffect } from 'react';

// import { fetchUser, selectUser } from '../redux/Reducer/userSlice'
import { fetchGroups, selectGroups, selectGroupsInfoStatus } from '../redux/Reducer/groupsSlice'
// import { fetchUser, selectUserInfoStatus } from '../redux/features/user/userSlice'
// import { doAnUpdateAsync } from '../redux/features/user/userSlice'

import { useSelector, useDispatch } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store/store'
import { SPService } from '../services/SharePointAPI';

interface IProps {
  spService: SPService;
}

export const GroupsInfoComponent: React.FC<IProps> = ({spService}) => {
  
    const groupsInfoStatus = useSelector(selectGroupsInfoStatus)

    const dispatch = useDispatch<AppDispatch>();
    
    // use effect hook is executed, when component is loaded ("onLoad()-event")
    // it will reload, if [userInfoStatus or dispatch changes their values] ("event listener")
    useEffect(() => {
        if (groupsInfoStatus === "idle") {
            dispatch(fetchGroups(spService))
        }
    }, [groupsInfoStatus , dispatch])

    // dispatch(doAnUpdateAsync());
    // dispatch(fetchGroups(spService));

    const groupsInfo = useSelector(selectGroups)
    // console.log("now INFOS:");
    // console.log(groupsInfo);
    /*groupsInfo.map((g: any) => {
                    console.log(g.Title);
                    });  */
    return (
    
        <section>
            <div>
                <h2>User Groups</h2>
                {
                groupsInfo.map((g: any) => {
                    return (
                        <div>{g.Title}</div>
                    );
                    })
                }
            </div>
        </section>
    )
} 
