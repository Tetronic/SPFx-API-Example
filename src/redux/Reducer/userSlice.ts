import { createAsyncThunk, createSlice, PayloadAction  } from '@reduxjs/toolkit'
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
      // WAS WORKING BEFORE ASYNC
      // state.push(action.payload)
      state.user = action.payload;
    }
  },
  // TODO: could the async call not be inside the reducers?
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      
      /*console.log("32");
      console.log(state);
      console.log(state.user);
      console.log(action);
      console.log(action.payload);*/
      // interesting: action.payload is the function "getCurrentUserInfosWithPromise"

      // this does not work (https://stackoverflow.com/questions/71999774/type-mytype-is-not-assignable-to-type-writabledraftmytype)
      // probably because this is not an immutable action.
      // state.user = action.payload;
      // Object assign makes a deep copy (https://www.geeksforgeeks.org/typescript/how-to-deep-clone-an-object-preserve-its-type-with-typescript/)
      // console.log("BEFORE");
      // console.log(state.user);
      Object.assign(state.user, action.payload.data) as IUserInfo
      // console.log("AFTER");
      // console.log(state.user );
      // console.log("33");
    });
  }
})

// export const fetchUser = createAppAsyncThunk('user/fetchUser', async (user:IUserInfo) => {
export const fetchUser = createAppAsyncThunk('user/fetchUser', async (graphService: GraphService) => {
  // console.log("YES 21");
  
  const response = graphService.getCurrentUser();
  // const response = getCurrentUserInfosWithPromise;
  // const response = 
  // console.log("YES 22");
  // console.log(response);
  return response;
})


/*export const fetchPosts = createAppAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
  },
  {
    condition(arg, thunkApi) {
      const postsStatus = selectPostsStatus(thunkApi.getState())
      if (postsStatus !== 'idle') {
        return false
      }
    },
  },
)*/






// Export the auto-generated action creator with the same name
export const { userLoad } = userSlice.actions

// Export the generated reducer function
export default userSlice.reducer

export const selectUser = (state: RootState) => state.user.user
export const selectUserInfoStatus = (state: RootState) => state.user.status

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const doAnUpdateAsync = createAsyncThunk('user/doAnUpdate', async () => {
  await delay();
  console.log("YES 2");
  return "completed";
});