import NothingLayout from './nothing';
import PrincipalLayout from './principal';

const layoutsMap: Record<string, React.FC<{ children: JSX.Element }>> = {
  '/': PrincipalLayout,
  '/_error': NothingLayout,
  '/auth/sign-in': NothingLayout,
  '/users/user-management': PrincipalLayout,
};

export default layoutsMap;
