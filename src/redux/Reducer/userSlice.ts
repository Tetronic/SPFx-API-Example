import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
import { RootState } from '../Store/store';
import { createAppAsyncThunk } from '../Store/withTypes';
import { GraphService } from '../../services/GraphAPI';

export interface IUserInfo {
    displayName: string,
    mail: string,
    jobTitle: string,
    department: string;
}

export interface IUserInfoState {
  user: IUserInfo
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const initialState: IUserInfoState = {
  user: {
    displayName: "",
    mail: "",
    jobTitle: "",
    department: ""
  },
  status: 'idle',
  error: null,
}

// Create the slice and pass in the initial state
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Declare a "case reducer" named `postAdded`.
    // The type of `action.payload` will be a `Post` object.
    userLoad(state, action: PayloadAction<IUserInfo>) {
      // "Mutate" the existing state array, which is
      // safe to do here because `createSlice` uses Immer inside.
      state.user = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        
        // interesting: action.payload is the function "getCurrentUserInfosWithPromise"

        // this does not work (https://stackoverflow.com/questions/71999774/type-mytype-is-not-assignable-to-type-writabledraftmytype)
        // probably because this is not an immutable action.
        // state.user = action.payload;
        // Object assign makes a deep copy (https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/)
        state.status = 'succeeded';
        Object.assign(state.user, action.payload.data) as IUserInfo
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message ?? 'Unknown Error';
      })
  }
})

// export const fetchUser = createAppAsyncThunk('user/fetchUser', async (user:IUserInfo) => {
export const fetchUser = createAppAsyncThunk('user/fetchUser', async (graphService: GraphService) => {
  
  const response = graphService.getCurrentUser();
  return response;
},
{
  // condition is needed in development environment, because for react components useEffect is executed twice
  // https://redux.js.org/tutorials/essentials/part-5-async-logic#avoiding-duplicate-fetches
  condition(arg, thunkApi) {
    const userInfoStatus = selectUserInfoStatus(thunkApi.getState())
    if (userInfoStatus !== 'idle') {
      return false
    }
  }
})


// Export the auto-generated action creator with the same name
export const { userLoad } = userSlice.actions

// Export the generated reducer function
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.user
export const selectUserInfoStatus = (state: RootState) => state.user.status