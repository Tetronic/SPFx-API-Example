import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
import { RootState } from '../Store/store';
import { createAppAsyncThunk } from '../Store/withTypes';
import { SPService } from '../../services/SharePointAPI';

export interface IGroupsInfo {
    title: string
}

export interface IGroupsInfoState {
  groups: IGroupsInfo[]
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const initialState: IGroupsInfoState = {
  groups: [],
  status: 'idle',
  error: null,
}

// Create the slice and pass in the initial state
const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    // Declare a "case reducer" named `postAdded`.
    // The type of `action.payload` will be a `Post` object.
    groupsLoad(state, action: PayloadAction<IGroupsInfo[]>) {
      // "Mutate" the existing state array, which is
      // safe to do here because `createSlice` uses Immer inside.
      state.groups = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGroups.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
      
        // interesting: action.payload is the function "getCurrentUserInfosWithPromise"

        // this does not work (https://stackoverflow.com/questions/71999774/type-mytype-is-not-assignable-to-type-writabledraftmytype)
        // probably because this is not an immutable action.
        // state.user = action.payload;
        // Object assign makes a deep copy (https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/)
        state.status = 'succeeded';
        Object.assign(state.groups, action.payload)
      })
      .addCase(fetchGroups .rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error.message ?? 'Unknown Error'
      });
  }
})

export const fetchGroups = createAppAsyncThunk('groups/fetchGroups', async (SPService: SPService) => {
    
  const response = SPService.GetGroupsInfo();
  return response;
},
{
  // condition is needed in development environment, because for react components useEffect is executed twice
  // https://redux.js.org/tutorials/essentials/part-5-async-logic#avoiding-duplicate-fetches
  condition(arg, thunkApi) {
    const groupsInfoStatus = selectGroupsInfoStatus(thunkApi.getState())
    if (groupsInfoStatus !== 'idle') {
      return false
    }
  }
})


// Export the auto-generated action creator with the same name
export const { groupsLoad } = groupsSlice.actions

// Export the generated reducer function
export default groupsSlice.reducer

export const selectGroups = (state: RootState) => state.groups.groups
export const selectGroupsInfoStatus = (state: RootState) => state.groups.status