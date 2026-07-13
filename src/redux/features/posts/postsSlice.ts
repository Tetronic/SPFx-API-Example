import { createSlice, PayloadAction  } from '@reduxjs/toolkit'

// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
}

// FOR ASYNC
// import { createAsyncThunk } from '@reduxjs/toolkit'
// import { RootState } from '../../Store/store'

// WAS WORKING BEFORE ASYNC
// Create an initial state value for the reducer, with that type
/*const initialState: Post[] = [
  { id: '1', title: 'First Post!' },
  { id: '2', title: 'Second Post' }
]*/

export interface PostsState {
  posts: Post[]
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
}


// Create the slice and pass in the initial state
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Declare a "case reducer" named `postAdded`.
    // The type of `action.payload` will be a `Post` object.
    postAdded(state, action: PayloadAction<Post>) {
      // "Mutate" the existing state array, which is
      // safe to do here because `createSlice` uses Immer inside.
      // WAS WORKING BEFORE ASYNC
      // state.push(action.payload)
      state.posts.push(action.payload)
    }
  }
})

// Export the auto-generated action creator with the same name
export const { postAdded } = postsSlice.actions

// Export the generated reducer function
export default postsSlice.reducer

// export const selectAllPosts = (state: RootState) => state.posts.posts