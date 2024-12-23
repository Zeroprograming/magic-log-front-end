import { GetServerSideProps } from 'next';

import { Head } from '@/components';
import ProtectedRoute from '@/components/common/Auth/ProtectedRoute';
import getServerSideSharedProps from '@/lib/next';
import HomeView from '@/views/home';

export default function Home() {
  return (
    <>
      <Head title="Home" />
      <ProtectedRoute>
        <HomeView />
      </ProtectedRoute>
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
