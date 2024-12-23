import NothingFooter from './NothingFooter';
import PrincipalFooter from './principal';

const footersMap: Record<string, React.FC<{ children: JSX.Element }>> = {
  '/': PrincipalFooter,
  '/_error': NothingFooter,
  '/auth/sign-in': NothingFooter,
};

export default footersMap;
