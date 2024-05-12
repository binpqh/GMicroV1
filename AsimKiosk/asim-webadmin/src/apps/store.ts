import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './Feature/authSlice/authSlice';
import loadingReducer from './Feature/loadingSlice/loadingSlice';
import forbiddenReducer from './Feature/Forbiden403/forbidenSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    forbidden: forbiddenReducer,
    // device: deviceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
