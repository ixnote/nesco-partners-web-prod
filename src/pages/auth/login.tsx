import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { LoginForm } from "@/components/LoginForm";
import { AuthLayout } from "@/components/AuthLayout";
import { login } from "@/api/auth/login";

import type { NextPageWithLayout } from "../_app";

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = React.useCallback(
    async (values: { email: string; password: string }) => {
      setError(null);
      setIsLoading(true);

      const result = await login(values);

      if (result.success) {
        // Store the token and user data
        localStorage.setItem("authToken", result.data.data.authorization.token);
        localStorage.setItem("user", JSON.stringify(result.data.data));

        // Redirect to dashboard
        await router.push("/dashboard");
      } else {
        setError(result.error);
      }

      setIsLoading(false);
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>NESCO Partners · Sign in</title>
      </Head>
      <LoginForm 
        onSubmit={handleLogin} 
        error={error}
        isLoading={isLoading}
      />
    </>
  );
};

LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
