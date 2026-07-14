import React, { useEffect } from 'react';

import { fetchUser, selectUser, selectUserInfoStatus } from '../redux/Reducer/userSlice'

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store/store'
import { GraphService } from '../services/GraphAPI';

interface IProps {
  graphService: GraphService;
}

export const UserInfoComponent: React.FC<IProps> = ({graphService}) => {
  
    const userInfoStatus = useSelector(selectUserInfoStatus)

    const dispatch = useDispatch<AppDispatch>();
    
    // use effect hook is executed, when component is loaded ("onLoad()-event")
    // it will reload, if [userInfoStatus or dispatch changes their values] ("event listener")
    useEffect(() => {
        if (userInfoStatus === "idle") {
            dispatch(fetchUser(graphService))
        }
    }, [userInfoStatus , dispatch])

    const userInfo = useSelector(selectUser)
    return (
    
        <section>
            <div>
                <h2>Profile</h2>
                <div><b>Name:</b>&nbsp;{userInfo.displayName}</div>
                <div><b>E-Mail:</b>&nbsp;{userInfo.mail}</div>
                <div><b>Job Title:</b>&nbsp;{userInfo.jobTitle}</div>
                <div><b>Department:</b>&nbsp;{userInfo.department}</div>
            </div>
        </section>
    )
} 
