const DEFAULT_BASE_URL = "https://ae996252bfce.ngrok-free.app/api/v1";

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
  
  // Remove leading slash from path if present to avoid replacing the base URL path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure baseUrl ends with / for proper URL joining
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  const url = new URL(cleanPath, normalizedBase);

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


