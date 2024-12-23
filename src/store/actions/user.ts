import { createAction } from '@reduxjs/toolkit';

import { User } from '@/utils/constants';

const chargeUser = createAction<{ user: User }>('user/chargeUser');
const logoutUser = createAction('user/logoutUser');
const activateUser = createAction('user/activateUser');
const updateUser = createAction<{ user: Partial<User> }>('user/updateUser');

export { activateUser, chargeUser, logoutUser, updateUser };
