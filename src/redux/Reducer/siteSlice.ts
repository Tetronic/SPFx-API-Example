import { createAsyncThunk, createSlice, PayloadAction  } from '@reduxjs/toolkit'
import { RootState } from '../Store/store';
import { createAppAsyncThunk } from '../Store/withTypes';
import { SPService } from '../../services/SharePointAPI';

export interface ISiteInfo {
    title: string,
    url: string;
}

export interface ISiteInfoState {
  site: ISiteInfo
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const initialState: ISiteInfoState = {
  site: {
    title: "",
    url: ""
  },
  status: 'idle',
  error: null,
}

// Create the slice and pass in the initial state
const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    // Declare a "case reducer" named `postAdded`.
    // The type of `action.payload` will be a `Post` object.
    siteLoad(state, action: PayloadAction<ISiteInfo>) {
      // "Mutate" the existing state array, which is
      // safe to do here because `createSlice` uses Immer inside.
      // WAS WORKING BEFORE ASYNC
      // state.push(action.payload)
      state.site = action.payload;
    }
  },
  // TODO: could the async call not be inside the reducers?
  extraReducers: builder => {
    builder.addCase(fetchSite.fulfilled, (state, action) => {
      
      /*console.log("32");
      console.log(state);
      console.log(state.site);
      console.log(action);
      console.log(action.payload);*/
      // interesting: action.payload is the function "getCurrentUserInfosWithPromise"

      // this does not work (https://stackoverflow.com/questions/71999774/type-mytype-is-not-assignable-to-type-writabledraftmytype)
      // probably because this is not an immutable action.
      // state.user = action.payload;
      // Object assign makes a deep copy (https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/)
      /*console.log("BEFORE");
      console.log(state.site);*/
      Object.assign(state.site, action.payload) as ISiteInfo
      /*console.log("AFTER");
      console.log(state.site);
      console.log("33");*/
    });
  }
})

// export const fetchUser = createAppAsyncThunk('user/fetchUser', async (user:IUserInfo) => {
export const fetchSite = createAppAsyncThunk('site/fetchSite', async (SPService: SPService) => {
  
  // console.log("YES 21");
  
  // const response = SPService.getCurrentSite();
  // const response = SPService.GetWithSPHttpClient();
  const response = SPService.GetCurrentSiteInfo();
  
  // const response = getCurrentUserInfosWithPromise;
  // const response = 
  // console.log("YES 22");
  // console.log(response);
  return response;
})


// Export the auto-generated action creator with the same name
export const { siteLoad } = siteSlice.actions

// Export the generated reducer function
export default siteSlice.reducer

export const selectSite = (state: RootState) => state.site.site
export const selectSiteInfoStatus = (state: RootState) => state.site.status

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const doAnUpdateAsync = createAsyncThunk('site/doAnUpdate', async () => {
  await delay();
  console.log("YES 2");
  return "completed";
});