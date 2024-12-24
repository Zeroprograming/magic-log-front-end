import { GetServerSideProps } from 'next';

import { Head } from '@/components';
import ProtectedRoute from '@/components/common/Auth/ProtectedRoute';
import getServerSideSharedProps from '@/lib/next';
import SellerView from '@/views/seller';

export default function Home() {
  return (
    <>
      <Head title="Vendedor" />
      <ProtectedRoute>
        <SellerView />
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
