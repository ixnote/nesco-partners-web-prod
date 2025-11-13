import * as React from "react";
import Head from "next/head";

import { LoginForm } from "@/components/LoginForm";
import { AuthLayout } from "@/components/AuthLayout";

import type { NextPageWithLayout } from "../_app";

const LoginPage: NextPageWithLayout = () => {
  const handleLogin = React.useCallback(
    async (values: { email: string; password: string }) => {
      // Replace with a real authentication workflow.
      console.info("Login attempt:", values);
    },
    []
  );

  return (
    <>
      <Head>
        <title>NESCO Partners · Sign in</title>
      </Head>
      <LoginForm onSubmit={handleLogin} />
    </>
  );
};

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
