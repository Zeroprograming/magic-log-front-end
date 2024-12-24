import { GetServerSideProps } from 'next';

import { Head } from '@/components';
import ProtectedRoute from '@/components/common/Auth/ProtectedRoute';
import getServerSideSharedProps from '@/lib/next';
import AdminPanelView from '@/views/admin-panel';

export default function AdminPanel() {
  return (
    <>
      <Head title="Admin Panel" />
      <ProtectedRoute>
        <AdminPanelView />
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
