import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface IForbiddenSlice {
  isForbidden: boolean;
}

const initialState: IForbiddenSlice = {
  isForbidden: false,
};

const forbiddenSlice = createSlice({
  name: 'forbidden',
  initialState,
  reducers: {
    setForbidden(state, action: PayloadAction<boolean>) {
      state.isForbidden = action.payload;
    },
  },
});

export const { setForbidden } = forbiddenSlice.actions;
export const isForbidden = (state: RootState) => state.forbidden.isForbidden;

export default forbiddenSlice.reducer;
