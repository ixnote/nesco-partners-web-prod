const DEFAULT_BASE_URL = "http://localhost:3000";

type QueryValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryValue | QueryValue[]>;

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL.length > 0) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return DEFAULT_BASE_URL;
};

export const createUrl = (path: string, params?: QueryParams) => {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item === undefined || item === null) {
            return;
          }

          url.searchParams.append(key, String(item));
        });
        return;
      }

      if (value === undefined || value === null) {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};


