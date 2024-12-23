import { useRouter } from 'next/router';
import React from 'react';

import layoutsMap from './layouts-map';
import PrincipalLayout from './principal';

interface Props {
  children: JSX.Element;
}

const LayoutWrapper = ({ children }: Props) => {
  const router = useRouter();
  const pathname = router.pathname;
  const Layout = layoutsMap[pathname] || PrincipalLayout;
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
