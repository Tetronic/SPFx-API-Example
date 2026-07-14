import React, { useEffect, CSSProperties } from 'react';

import { fetchLists, selectLists, selectListsInfoStatus, selectListsError } from '../redux/Reducer/listsSlice'

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store/store'
import { SPService } from '../services/SharePointAPI';

import { RingLoader } from "react-spinners";

interface IProps {
  spService: SPService;
}

export const ListsInfoComponent: React.FC<IProps> = ({spService}) => {
  
    const listsInfoStatus = useSelector(selectListsInfoStatus)
    const listsError = useSelector(selectListsError)

    const dispatch = useDispatch<AppDispatch>();
    
    // use effect hook is executed, when component is loaded ("onLoad()-event")
    // it will reload, if [userInfoStatus or dispatch changes their values] ("event listener")
    useEffect(() => {
        if (listsInfoStatus === "idle") {
            dispatch(fetchLists(spService))
        }
    }, [listsInfoStatus , dispatch])

    const spinnerCSSStyles: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "red"
    };

    const listsInfo = useSelector(selectLists)

    let componentDynamicContent: React.ReactNode;

    if (listsInfoStatus === 'pending') {
        componentDynamicContent =
         <RingLoader
            cssOverride={spinnerCSSStyles}
            loading={true}
            size={150}
            aria-label="Loading content"
            data-testid="loader"
        />
    } else if (listsInfoStatus === 'succeeded') {
        componentDynamicContent = 
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

    } else if (listsInfoStatus === 'rejected') {
        componentDynamicContent = <div>{listsError}</div>
    }

    return (
    
        <section>
            <div>
                <h2>Available Lists on this Site</h2>
                {componentDynamicContent}
            </div>
        </section>
    )
} 
