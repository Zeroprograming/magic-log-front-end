import { createAction } from '@reduxjs/toolkit';

import { IUserProfile } from '@/schemas/auth/auth';

const chargeUser = createAction<{ user: IUserProfile }>('user/chargeUser');
const logoutUser = createAction('user/logoutUser');
const activateUser = createAction('user/activateUser');
const updateUser = createAction<{ user: Partial<IUserProfile> }>(
  'user/updateUser',
);

export { activateUser, chargeUser, logoutUser, updateUser };
