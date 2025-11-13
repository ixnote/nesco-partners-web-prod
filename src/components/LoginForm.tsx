import * as React from "react";
import * as Label from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      setIsSubmitting(true);
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full max-w-xl flex flex-col items-center justify-center gap-10 rounded-2xl bg-brand-white p-8 shadow-xl shadow-slate-950/40 backdrop-blur"
    >
      <header className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-bold text-brand-main p-2 rounded-lg lg:text-5xl">
          NESCO
        </h1>
        <span className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-brand-black p-2 rounded-lg lg:text-2xl">
            Welcome Back!
          </h2>
          <h3 className="text-sm text-brand-ash font-normal -mt-2 lg:text-base">
            Log in to continue
          </h3>
        </span>
      </header>

      <div className="w-full flex flex-col items-center justify-center gap-10">
        <fieldset className="w-full flex flex-col gap-2">
          <Label.Root
            className="text-sm font-medium text-brand-black"
            htmlFor="email"
          >
            Business Email
          </Label.Root>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-rose-400">{errors.email.message}</p>
          ) : null}
        </fieldset>

        <fieldset className="w-full flex flex-col gap-2">
          <Label.Root
            className="text-sm font-medium text-brand-black"
            htmlFor="password"
          >
            Password
          </Label.Root>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-rose-400">{errors.password.message}</p>
          ) : null}
        </fieldset>

        <Link
          href="/dashboard"
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-main text-sm font-semibold text-brand-white transition hover:bg-brand-main/80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-main disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        </Link>
      </div>

      <footer className="w-full flex flex-col items-center justify-center gap-2 text-sm text-brand-ash font-normal lg:flex-row lg:text-base">
        By continuing you agree to our{" "}
        <span>
          <Link href="/terms" className="text-brand-main hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-brand-main hover:underline">
            Privacy Policy
          </Link>
        </span>
      </footer>
    </form>
  );
};
