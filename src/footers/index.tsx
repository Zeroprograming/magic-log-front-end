import { useRouter } from 'next/router';
import React from 'react';

import footersMap from './footers-map';
import PrincipalFooter from './principal';

interface Props {
  children: JSX.Element;
}

const FooterWrapper = ({ children }: Props) => {
  const router = useRouter();
  const pathname = router.pathname;
  const Footer = footersMap[pathname] || PrincipalFooter;

  return <Footer>{children}</Footer>;
};

export default FooterWrapper;
