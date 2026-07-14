import React, { useEffect } from 'react';

import { fetchGroups, selectGroups, selectGroupsInfoStatus } from '../redux/Reducer/groupsSlice'

import { useSelector, useDispatch } from 'react-redux';
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

    const groupsInfo = useSelector(selectGroups)
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
