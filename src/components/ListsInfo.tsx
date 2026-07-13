// import React, { useEffect } from 'react';
import React from 'react';

import { fetchLists, selectLists } from '../redux/Reducer/listsSlice'
// import { fetchLists } from '../redux/Reducer/listsSlice'
// import { fetchUser, selectUser } from '../redux/Reducer/userSlice'
// import { fetchUser, selectUserInfoStatus } from '../redux/features/user/userSlice'
// import { doAnUpdateAsync } from '../redux/features/user/userSlice'

import { useSelector, useDispatch } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store/store'
import { SPService } from '../services/SharePointAPI';

interface IProps {
  spService: SPService;
}

export const ListsInfoComponent: React.FC<IProps> = ({spService}) => {
  
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
    dispatch(fetchLists(spService));

    const listsInfo = useSelector(selectLists)
    /*console.log("now INFOS 2:");
    console.log(listsInfo);
    listsInfo.map((g: any) => {
                    console.log(g.Title);
                    console.log(g.ItemCount);
                    }); */
    console.log("listsInfo:");
    console.log(listsInfo);
  
    return (
    
        <section>
            <div>
                <h2>Available Lists on this Site</h2>
                <table>
                <tr>
                    <th>Title</th>
                    <th>Items</th>
                </tr>
                {
                    /*listsInfo.map((l: any) => {
                    return (
                        <tr>
                            <td>{l.Title}</td>
                            <td>{l.ItemCount}</td>
                        </tr>
                    );
                    })*/
                }            
                </table>

            </div>
        </section>
    )
} 
