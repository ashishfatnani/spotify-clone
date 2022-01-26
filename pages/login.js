import React from "react";
import { getProviders, signIn } from "next-auth/react";
const login = ({ providers }) => {
  return <div>This is Login</div>;
};

export default login;

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
