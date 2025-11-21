import { createUrl } from "@/utils/createUrl";

import type { ApiKeyResponseDTO } from "./auth.schema";
import { apiKeyResponseSchema } from "./auth.schema";

const API_KEY_ROUTE = "/partners/settings/api-key";

type ApiKeyResult = 
  | { success: true; data: ApiKeyResponseDTO }
  | { success: false; error: string };

export const getApiKey = async (token: string): Promise<ApiKeyResult> => {
  try {
    const url = createUrl(API_KEY_ROUTE);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Failed to fetch API key: ${response.statusText}`,
      };
    }

    const payload = await response.json();
    
    // Wrap Zod parsing in try-catch to handle schema validation errors
    try {
      const parsed = apiKeyResponseSchema.parse(payload);
      return { success: true, data: parsed };
    } catch (parseError) {
      console.error("API key schema validation error:", parseError);
      return {
        success: false,
        error: "Invalid API key data format received",
      };
    }
  } catch (error) {
    // Handle network errors, fetch failures, etc.
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return {
        success: false,
        error: "Network error: Unable to connect to server",
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const generateApiKey = async (token: string): Promise<ApiKeyResult> => {
  try {
    const url = createUrl(API_KEY_ROUTE);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Failed to generate API key: ${response.statusText}`,
      };
    }

    const payload = await response.json();
    
    // Wrap Zod parsing in try-catch to handle schema validation errors
    try {
      const parsed = apiKeyResponseSchema.parse(payload);
      return { success: true, data: parsed };
    } catch (parseError) {
      console.error("API key schema validation error:", parseError);
      return {
        success: false,
        error: "Invalid API key data format received",
      };
    }
  } catch (error) {
    // Handle network errors, fetch failures, etc.
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return {
        success: false,
        error: "Network error: Unable to connect to server",
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

