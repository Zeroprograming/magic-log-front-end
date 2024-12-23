import { GetServerSideProps } from 'next';
import React from 'react';

import { Head } from '@/components';
import getServerSideSharedProps from '@/lib/next';

const NotFoundPage = () => {
  return (
    <>
      <Head title="Error 404" />
      <div>Not found</div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await getServerSideSharedProps(ctx)),
    },
  };
};

export default NotFoundPage;
