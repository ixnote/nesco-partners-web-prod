import * as React from "react";

export type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light-bg p-4">
      {children}
    </div>
  );
};
