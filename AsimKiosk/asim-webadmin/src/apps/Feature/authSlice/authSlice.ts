import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginInput, ILoginResponse } from '../../../interface/IAuth';
import { LoginAsync } from '../../../service/auth.service';
import { setLoading } from '../loadingSlice/loadingSlice';

import { jwtDecode } from 'jwt-decode';
import { RootState } from '../../store';

export interface IAuthState {
  isLogin: boolean;
  token: string | null;
  name: string | null;
  role: string | null;
  clientId: number;
  groupId: string | null;
  userId: string | null;
}

export const login = createAsyncThunk(
  'auth/login',
  async (data: ILoginInput, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await LoginAsync(data);
      dispatch(setLoading(false));
      return response;
    } catch (error: any) {
      dispatch(setLoading(false));
      return rejectWithValue(error);
    }
  }
);

const getByDecodedToken = (url: string) => {
  // get Token from sessionStorage
  let Token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null;

  // if there is Token => decode token and get role
  if (Token) {
    const decoded: any = jwtDecode(Token);
    // urlToken là code của BE trả trong token
    const urlToken = url;
    // console.log(decoded, decoded[TokenRole]);
    return decoded ? decoded[urlToken] : null;
  }
  // if there is no Token => decode token and get role
  if (!Token) return null;
};

const initialState: IAuthState = {
  isLogin: !!sessionStorage.getItem('token'),
  token: sessionStorage.getItem('token') || null,
  name: getByDecodedToken('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name') || null,
  userId:
    getByDecodedToken('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier') ||
    null,
  groupId:
    getByDecodedToken('http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid') || null,
  role: getByDecodedToken('http://schemas.microsoft.com/ws/2008/06/identity/claims/role') || null,
  clientId: 0,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginConfig: (state) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
      state.token = null;
      state.name = null;
      state.userId = null;
      state.role = null;
      state.groupId = null;
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    },
    getMe: (state, action: PayloadAction<any>) => {
      console.log('GetMe:::', action.payload);
      state.name = action.payload.name;
      state.role = action.payload.role;
      sessionStorage.setItem('name', action.payload.name);
      state.clientId = action.payload.clientId;
    },
    refreshToken: (state, action: PayloadAction<ILoginResponse>) => {
      // console.log(action);
      state.token = action.payload.data.token;
      state.role = action.payload.data.role;
      sessionStorage.setItem('token', action.payload.data.token);
      state.groupId = getByDecodedToken(
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid'
      );
      state.userId = getByDecodedToken(
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<ILoginResponse>) => {
      sessionStorage.setItem('token', action.payload.data.token);
      console.log('logged', state, action);
      state.isLogin = true;
      state.token = action.payload.data.token;
      state.role = action.payload.data.role;
      // state.userName = action.payload.data.userName;
      state.groupId = getByDecodedToken(
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid'
      );
      state.userId = getByDecodedToken(
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      );
    });
    builder.addCase(login.rejected, (state) => {
      sessionStorage.removeItem('token');
      state.isLogin = false;
      state.token = null;
      state.role = null;
      state.userId = null;
    });
  },
});

export const { logout, getMe, refreshToken } = auth.actions;

export const isLogin = (state: RootState) => state.auth.isLogin;
export const getToken = (state: RootState) => state.auth.token;
export const getName = (state: RootState) => state.auth.name;
export const getRole = (state: RootState) => state.auth.role;
export const getUserId = (state: RootState) => state.auth.userId;
export const getClientId = (state: RootState) => state.auth.clientId;

export default auth.reducer;
