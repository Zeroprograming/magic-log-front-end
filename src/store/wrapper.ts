import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import { formsReducer } from './reducers/forms';
import { userReducer } from './reducers/user';

const reducers = combineReducers({
  user: userReducer,
  forms: formsReducer,
});

const reducer = (
  state: ReturnType<typeof reducers> | undefined,
  action: AnyAction,
) => {
  if (!state) return reducers(undefined, action);
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...(action.payload as ReturnType<typeof reducers>),
    };

    return nextState;
  } else {
    return reducers(state, action);
  }
};

export const store = configureStore({
  reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const makeStore = () => {
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

const wrapping = () => createWrapper<AppStore>(makeStore);
export const wrapper = wrapping();
