import { AppContext } from 'next/app';

import { CookiesStorage } from '@/sdk';

export default function getStorage(ctx?: AppContext) {
  return new CookiesStorage(ctx);
}
