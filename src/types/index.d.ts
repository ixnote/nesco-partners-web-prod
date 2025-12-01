declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL?: string;
  }
}

declare module "*.jpg" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.png" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.jpeg" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.gif" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.webp" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.svg" {
  const value: import("next/image").StaticImageData;
  export default value;
}
