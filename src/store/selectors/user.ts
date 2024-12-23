import { AppState } from '@/store/wrapper';

const selectUser = (state: AppState) => state.user;

const getCurrentUser = (state: AppState) => state.user.user;

const isLoggedIn = (state: AppState) => state.user.isLoggedIn;

export { getCurrentUser, isLoggedIn, selectUser };
