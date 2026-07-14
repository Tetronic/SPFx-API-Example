import React, { useEffect } from 'react';

import { fetchLists, selectLists, selectListsInfoStatus } from '../redux/Reducer/listsSlice'

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store/store'
import { SPService } from '../services/SharePointAPI';

interface IProps {
  spService: SPService;
}

export const ListsInfoComponent: React.FC<IProps> = ({spService}) => {
  
    const listsInfoStatus = useSelector(selectListsInfoStatus)

    const dispatch = useDispatch<AppDispatch>();
    
    // use effect hook is executed, when component is loaded ("onLoad()-event")
    // it will reload, if [userInfoStatus or dispatch changes their values] ("event listener")
    useEffect(() => {
        if (listsInfoStatus === "idle") {
            dispatch(fetchLists(spService))
        }
    }, [listsInfoStatus , dispatch])

    const listsInfo = useSelector(selectLists)
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
                    listsInfo.map((l: any) => {
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
        </section>
    )
} 
