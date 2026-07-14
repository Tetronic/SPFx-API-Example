import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
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
      state.lists = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLists.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        
        // interesting: action.payload is the function "getCurrentUserInfosWithPromise"

        // this does not work (https://stackoverflow.com/questions/71999774/type-mytype-is-not-assignable-to-type-writabledraftmytype)
        // probably because this is not an immutable action.
        // state.user = action.payload;
        // Object assign makes a deep copy (https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/)
        state.status = 'succeeded';
        Object.assign(state.lists, action.payload)
      })
      .addCase(fetchLists .rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error.message ?? 'Unknown Error'
      });
  }
})

export const fetchLists = createAppAsyncThunk('lists/fetchLists', async (SPService: SPService) => {
  
  const response = SPService.GetListsInfo();
  return response;
},
{
  // condition is needed in development environment, because for react components useEffect is executed twice
  // https://redux.js.org/tutorials/essentials/part-5-async-logic#avoiding-duplicate-fetches
  condition(arg, thunkApi) {
    const listsInfoStatus = selectListsInfoStatus(thunkApi.getState())
    if (listsInfoStatus !== 'idle') {
      return false;
    }
  }
})


// Export the auto-generated action creator with the same name
export const { groupsLoad } = listsSlice.actions

// Export the generated reducer function
export default listsSlice.reducer

export const selectLists = (state: RootState) => state.lists.lists
export const selectListsInfoStatus = (state: RootState) => state.lists.status