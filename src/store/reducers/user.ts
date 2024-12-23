/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createReducer } from '@reduxjs/toolkit';

import { chargeUser, logoutUser } from '@/store';
import { User } from '@/utils/constants';
interface UserState {
  isLoggedIn: boolean;
  user: User;
}

const emptyUser: User = {
  id: 0,
  email: '',
  name: '',
  createdAt: '',
  updatedAt: '',
};

export const initialState: UserState = {
  isLoggedIn: false,
  user: emptyUser,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(chargeUser, (state, action) => {
    state.isLoggedIn = true;
    state.user = action.payload.user;
  });
  builder.addCase(logoutUser, (state) => {
    state.isLoggedIn = false;
    state.user = emptyUser;
  });
});
