import { GetServerSideProps } from 'next';

import { Head } from '@/components';
import getServerSideSharedProps from '@/lib/next';
import SignInView from '@/views/auth/sign-in';

export default function SignIn() {
  return (
    <>
      <Head title="Iniciar Sesión" />
      <SignInView />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await getServerSideSharedProps(ctx)),
    },
  };
};
