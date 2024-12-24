/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createReducer } from '@reduxjs/toolkit';

import { IUserProfile } from '@/schemas/auth/auth';
import { chargeUser, logoutUser } from '@/store';
interface UserState {
  isLoggedIn: boolean;
  user: IUserProfile;
}

const emptyUser: IUserProfile = {
  id: 0,
  email: '',
  role: {
    id: 0,
    name: '',
  },
  cart: {
    id: 0,
    items: [],
  },
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
