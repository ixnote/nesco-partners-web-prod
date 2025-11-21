import Head from "next/head";
import * as React from "react";
import { Eye, EyeOff, Copy, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DashboardLayout } from "@/components/DashboardLayout";
import { getApiKey, generateApiKey, changePassword } from "@/api/auth";
import type { ChangePasswordRequestDTO } from "@/api/auth";
import { changePasswordRequestSchema } from "@/api/auth/auth.schema";

import type { NextPageWithLayout } from "../_app";

type SettingsTab = "api-key" | "password";

const passwordFormSchema = changePasswordRequestSchema;

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SettingsPage: NextPageWithLayout = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("api-key");
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // API Key state
  const [apiKey, setApiKey] = React.useState<string>("");
  const [isLoadingApiKey, setIsLoadingApiKey] = React.useState(false);
  const [apiKeyError, setApiKeyError] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generateSuccess, setGenerateSuccess] = React.useState(false);

  // Test API Key state
  const [testApiKey, setTestApiKey] = React.useState<string>("");
  const [showTestApiKey, setShowTestApiKey] = React.useState(false);
  const [isLoadingTestApiKey, setIsLoadingTestApiKey] = React.useState(false);
  const [testApiKeyError, setTestApiKeyError] = React.useState<string | null>(null);
  const [isGeneratingTest, setIsGeneratingTest] = React.useState(false);
  const [generateTestSuccess, setGenerateTestSuccess] = React.useState(false);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const token = React.useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }, []);

  // Fetch API key when API Key tab is active
  const fetchApiKey = React.useCallback(async () => {
    if (!token || activeTab !== "api-key") return;

    setIsLoadingApiKey(true);
    setApiKeyError(null);

    const result = await getApiKey(token);

    if (result.success) {
      setApiKey(result.data.data.apiKey);
    } else {
      setApiKeyError(result.error);
      setApiKey("");
    }

    setIsLoadingApiKey(false);
  }, [token, activeTab]);

  React.useEffect(() => {
    fetchApiKey();
  }, [fetchApiKey]);

  const handleCopyApiKey = React.useCallback(async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleCreateNewKey = React.useCallback(async () => {
    if (!token) return;

    setIsGenerating(true);
    setApiKeyError(null);
    setGenerateSuccess(false);

    const result = await generateApiKey(token);

    if (result.success) {
      setApiKey(result.data.data.apiKey);
      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } else {
      setApiKeyError(result.error);
    }

    setIsGenerating(false);
  }, [token]);

  // Fetch Test API key when API Key tab is active
  const fetchTestApiKey = React.useCallback(async () => {
    if (!token || activeTab !== "api-key") return;

    setIsLoadingTestApiKey(true);
    setTestApiKeyError(null);

    // For now, use the same endpoint - will be updated when actual endpoint is provided
    const result = await getApiKey(token);

    if (result.success) {
      setTestApiKey(result.data.data.apiKey);
    } else {
      setTestApiKeyError(result.error);
      setTestApiKey("");
    }

    setIsLoadingTestApiKey(false);
  }, [token, activeTab]);

  React.useEffect(() => {
    fetchTestApiKey();
  }, [fetchTestApiKey]);

  const handleCopyTestApiKey = React.useCallback(async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleCreateNewTestKey = React.useCallback(async () => {
    if (!token) return;

    setIsGeneratingTest(true);
    setTestApiKeyError(null);
    setGenerateTestSuccess(false);

    // For now, use the same endpoint - will be updated when actual endpoint is provided
    const result = await generateApiKey(token);

    if (result.success) {
      setTestApiKey(result.data.data.apiKey);
      setGenerateTestSuccess(true);
      setTimeout(() => setGenerateTestSuccess(false), 3000);
    } else {
      setTestApiKeyError(result.error);
    }

    setIsGeneratingTest(false);
  }, [token]);

  const handleCancel = React.useCallback(() => {
    reset();
    setPasswordError(null);
    setPasswordSuccess(false);
  }, [reset]);

  const handleUpdatePassword = handleSubmit(async (values: PasswordFormValues) => {
    if (!token) return;

    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const result = await changePassword(token, values);

    if (result.success) {
      setPasswordSuccess(true);
      reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      setPasswordError(result.error);
    }

    setIsChangingPassword(false);
  });

  return (
    <>
      <Head>
        <title>NESCO Partners · Settings</title>
      </Head>

      <section className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-brand-border-light">
          <button
            type="button"
            onClick={() => setActiveTab("api-key")}
            className={`transition-fx relative flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === "api-key"
                ? "text-brand-main"
                : "text-brand-ash hover:text-brand-black"
            }`}
          >
            <span>API Key</span>
            {activeTab === "api-key" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-main" />
            )}
          </button>
                <button
                  type="button"
            onClick={() => setActiveTab("password")}
            className={`transition-fx relative flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === "password"
                ? "text-brand-main"
                : "text-brand-ash hover:text-brand-black"
            }`}
          >
            <span>Password</span>
            {activeTab === "password" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-main" />
            )}
                </button>
        </div>

        {/* API Key Tab Content */}
        {activeTab === "api-key" && (
          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-black">
              Generate API Key
            </h2>
            <p className="mt-2 text-sm text-brand-ash">
              Do not share this key with any one. If you suspect any of your key
              has been compromised, then you should delete your key create a new
              one and update your code.
            </p>

            <div className="mt-6 space-y-4">
              {apiKeyError && (
                <div className="w-full max-w-2xl rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600">
                  {apiKeyError}
                </div>
              )}

              {generateSuccess && (
                <div className="w-full max-w-2xl rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  API key generated successfully
                </div>
              )}

              {/* API Key */}
              {isLoadingApiKey ? (
                <div className="flex items-center gap-2 text-brand-ash">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading API key...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative w-full max-w-2xl">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      placeholder={apiKey ? undefined : "No API key available"}
                      className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 pr-20 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
                    />
                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        disabled={!apiKey}
                        className="rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyApiKey(apiKey)}
                        disabled={!apiKey}
                        className="rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Create New Key Button */}
              <button
                type="button"
                onClick={handleCreateNewKey}
                disabled={isGenerating}
                className="mt-4 inline-flex h-12 items-center gap-2 rounded-lg bg-brand-main px-6 text-sm font-semibold text-brand-white transition hover:bg-brand-main/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-main disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create New Key
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Test API Key Section */}
        {activeTab === "api-key" && (
          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-black">
              Generate Test API Key
            </h2>
            <p className="mt-2 text-sm text-brand-ash">
              Generate a test API key for development and testing purposes. This key can be used to test API endpoints without affecting production data.
            </p>

            <div className="mt-6 space-y-4">
              {testApiKeyError && (
                <div className="w-full max-w-2xl rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600">
                  {testApiKeyError}
                </div>
              )}

              {generateTestSuccess && (
                <div className="w-full max-w-2xl rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Test API key generated successfully
                </div>
              )}

              {/* Test API Key */}
              {isLoadingTestApiKey ? (
                <div className="flex items-center gap-2 text-brand-ash">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading test API key...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative w-full max-w-2xl">
                    <input
                      type={showTestApiKey ? "text" : "password"}
                      value={testApiKey}
                      readOnly
                      placeholder={testApiKey ? undefined : "No test API key available"}
                      className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 pr-20 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
                    />
                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowTestApiKey(!showTestApiKey)}
                        disabled={!testApiKey}
                        className="rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {showTestApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyTestApiKey(testApiKey)}
                        disabled={!testApiKey}
                        className="rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Create New Test Key Button */}
              <button
                type="button"
                onClick={handleCreateNewTestKey}
                disabled={isGeneratingTest}
                className="mt-4 inline-flex h-12 items-center gap-2 rounded-lg bg-brand-pending-text px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-pending-text/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pending-text disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGeneratingTest ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create New Test Key
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Password Tab Content */}
        {activeTab === "password" && (
          <div className="rounded-2xl border border-brand-border-light bg-brand-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-black">
              Change Password
            </h2>
            <p className="mt-2 text-sm text-brand-ash">
              Please enter your current password to change your password
            </p>

            <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
              {passwordError && (
                <div className="w-full max-w-2xl rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-600">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="w-full max-w-2xl rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Password changed successfully
                </div>
              )}

              {/* Current Password */}
              <div className="flex flex-col gap-2 w-full max-w-2xl">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-brand-black"
                >
                  Old Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter old password"
                    className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 pr-10 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
                    {...register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-rose-400">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2 w-full max-w-2xl">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-brand-black"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 pr-10 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-rose-400">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2 w-full max-w-2xl">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-brand-black"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-12 w-full rounded-lg border-[0.3px] border-brand-border-light bg-brand-light-bg px-3 pr-10 text-sm text-brand-black transition focus:ring-2 focus:ring-brand-main"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-brand-ash hover:bg-brand-light-bg hover:text-brand-black transition-fx"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isChangingPassword}
                  className="h-12 rounded-lg border border-brand-border-light bg-brand-white px-6 text-sm font-medium text-brand-ash transition hover:border-brand-main hover:text-brand-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-main disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="h-12 inline-flex items-center gap-2 rounded-lg bg-brand-main px-6 text-sm font-semibold text-brand-white transition hover:bg-brand-main/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-main disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
};

SettingsPage.getLayout = (page) => (
  <DashboardLayout
    heading="Settings"
    byText="Manage account settings and preferences."
  >
    {page}
  </DashboardLayout>
);

export default SettingsPage;
