import { createAsyncThunk, createSlice, PayloadAction  } from '@reduxjs/toolkit'
import { RootState } from '../Store/store';
import { createAppAsyncThunk } from '../Store/withTypes';
import { SPService } from '../../services/SharePointAPI';

export interface IListsInfo {
    title: string,
    itemCount: number
}

export interface IListsInfoState {
  lists: IListsInfo[]
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const initialState: IListsInfoState = {
  lists: [],
  status: 'idle',
  error: null,
}

// Create the slice and pass in the initial state
const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    // Declare a "case reducer" named `postAdded`.
    // The type of `action.payload` will be a `Post` object.
    groupsLoad(state, action: PayloadAction<IListsInfo[]>) {
      // "Mutate" the existing state array, which is
      // safe to do here because `createSlice` uses Immer inside.
      // WAS WORKING BEFORE ASYNC
      // state.push(action.payload)
      state.lists = action.payload;
    }
  },
  // TODO: could the async call not be inside the reducers?
  extraReducers: builder => {
    builder.addCase(fetchLists.fulfilled, (state, action) => {
      
      /*console.log("32");
      console.log(state);
      console.log(state.groups);
      console.log(action);
      console.log(action.payload);*/
      // interesting: action.payload is the function "getCurrentUserInfosWithPromise"

      // this does not work (https://stackoverflow.com/questions/71999774/type-mytype-is-not-assignable-to-type-writabledraftmytype)
      // probably because this is not an immutable action.
      // state.user = action.payload;
      // Object assign makes a deep copy (https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/)
      /*console.log("BEFORE");
      console.log(state.groups);*/
      Object.assign(state.lists, action.payload)
      /*console.log("AFTER");
      console.log(state.groups);
      console.log("33");*/
    });
  }
})

// export const fetchUser = createAppAsyncThunk('user/fetchUser', async (user:IUserInfo) => {
export const fetchLists = createAppAsyncThunk('listss/fetchLists', async (SPService: SPService) => {
  // console.log("YES 21");
  
  // const response = SPService.getCurrentSite();
  // const response = SPService.GetWithSPHttpClient();
  const response = SPService.GetListsInfo();
  
  // const response = getCurrentUserInfosWithPromise;
  // const response = 
  // console.log("YES 22");
  // console.log(response);
  return response;
})


// Export the auto-generated action creator with the same name
export const { groupsLoad } = listsSlice.actions

// Export the generated reducer function
export default listsSlice.reducer

export const selectLists = (state: RootState) => state.lists.lists
export const selectListsInfoStatus = (state: RootState) => state.lists.status

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const doAnUpdateAsync = createAsyncThunk('site/doAnUpdate', async () => {
  await delay();
  console.log("YES 2");
  return "completed";
});