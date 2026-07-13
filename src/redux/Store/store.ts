import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../Reducer/userSlice'
import siteReducer from '../Reducer/siteSlice'
import groupsReducer from '../Reducer/groupsSlice'
import listsReducer from '../Reducer/listsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    site: siteReducer,
    groups: groupsReducer,
    lists: listsReducer
  }
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>