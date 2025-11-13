# Project Coding Rules & Conventions

> **Philosophy**: Consistency over preference. These rules prioritize maintainability, clarity, and team collaboration.

---

## 📚 Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Layer](#api-layer)
- [Components](#components)
- [Pages](#pages)
- [Hooks](#hooks)
- [State Management](#state-management)
- [Forms](#forms)
- [Styling](#styling)
- [Utils](#utils)
- [Constants](#constants)
- [Contexts](#contexts)
- [Library Configuration](#library-configuration)
- [Types & Interfaces](#types--interfaces)
- [Testing](#testing)
- [Naming Conventions](#naming-conventions)

---

## 🛠 Technology Stack

### Core Dependencies

- ✅ React 19+
- ✅ Next.js 16+ (Pages Router)
- ✅ TypeScript 5+
- ✅ Tailwind CSS 4+
- ✅ SWR for data fetching
- ✅ React Hook Form + Zod for forms
- ✅ Radix UI for primitives
- ✅ Jotai (only when React.useState is insufficient)
- ✅ pnpm for package management

### Development Tools

- ✅ ESLint
- ✅ Prettier
- ✅ TypeScript strict mode

---

## 📁 Project Structure

```
src/
├── api/              # API calls, DTOs, schemas
├── components/       # Reusable UI components (flat structure)
├── pages/            # Next.js pages
├── hooks/            # Custom React hooks
├── contexts/         # React Context providers
├── utils/            # Utility functions
├── constants/        # App-wide constants
├── lib/              # Third-party library configs
├── styles/           # Global styles
└── types/            # Shared TypeScript types
```

### Structure Rules

1. **Flat Component Structure**: Maximum 1 level deep from `components/`

   ```
   ✅ src/components/Button.tsx
   ✅ src/components/LoginForm.tsx
   ✅ src/components/TransactionTable.tsx
   ❌ src/components/Auth/Forms/LoginForm.tsx
   ```

2. **Feature Colocation**: Keep related files close

   ```
   ✅ src/api/users/getUsers.ts
   ✅ src/api/users/users.schema.ts
   ```

3. **No Nested Folders** beyond 2 levels in any directory

---

## 🌐 API Layer

### Location

- All API calls in `src/api/` folder
- Organize by resource/entity (users, transactions, etc.)

### Rules

1. **Use SWR for data fetching** (unless you need SSR/SSG)

   ```tsx
   import useSWR from "swr";

   export const useGetUsers = () =>
     useSWR<UsersResponse>("/api/users", fetcher);
   ```

2. **Use Zod for validation** - DTOs and schemas in same file

   ```tsx
   import { z } from "zod";

   export const userSchema = z.object({
     id: z.string(),
     name: z.string(),
     email: z.string().email(),
   });

   export type UserDTO = z.infer<typeof userSchema>;
   ```

3. **Always use `createUrl` for formatting URLs**

   ```tsx
   import { createUrl } from "@/utils/createUrl";

   const url = createUrl("/api/users", { search: "john", limit: 10 });
   ```

4. **File naming**: `resourceName.ts`, `resourceName.schema.ts`

   ```
   api/
   ├── users/
   │   ├── getUsers.ts
   │   ├── createUser.ts
   │   └── users.schema.ts
   ```

5. **Mock data**: Store in `*.mock.ts` files within API folder
   ```tsx
   // api/users/users.mock.ts
   export const mockUsers: UserDTO[] = [...];
   ```

### Example API File

```tsx
// api/users/getUsers.ts
import useSWR from "swr";
import { createUrl } from "@/utils/createUrl";
import type { UserDTO, UsersResponseDTO } from "./users.schema";
import { usersResponseSchema } from "./users.schema";

const fetchUsers = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch users");
  const data = await response.json();
  return usersResponseSchema.parse(data);
};

export type UseGetUsersParams = {
  search?: string;
  limit?: number;
};

export const getUsersKey = (params?: UseGetUsersParams) =>
  createUrl("/api/users", params);

export const useGetUsers = (params?: UseGetUsersParams) =>
  useSWR<UsersResponseDTO>(getUsersKey(params), fetchUsers);
```

---

## 🧩 Components

### Location

- All components in `src/components/` folder
- Flat structure (no nested folders)

### Rules

1. **Import React as namespace**

   ```tsx
   ✅ import * as React from 'react';
   ❌ import React from 'react';
   ```

2. **Always use named exports**

   ```tsx
   ✅ export const Button = () => { ... };
   ❌ export default Button;
   ```

3. **Component file = Component name**

   ```
   ✅ Button.tsx → export const Button
   ✅ LoginForm.tsx → export const LoginForm
   ```

4. **Props type naming**: `ComponentNameProps`

   ```tsx
   export type ButtonProps = {
     variant?: "primary" | "secondary";
     children: React.ReactNode;
   };

   export const Button = ({ variant = "primary", children }: ButtonProps) => {
     return <button className={variant}>{children}</button>;
   };
   ```

5. **Component-specific types**: Define inline in same file
   ```tsx
   // Inside Button.tsx
   type ButtonVariant = "primary" | "secondary";
   type ButtonSize = "sm" | "md" | "lg";
   ```

### Component Template

```tsx
import * as React from "react";

export type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`btn-${variant} btn-${size}`}
    >
      {children}
    </button>
  );
};
```

---

## 📄 Pages

### Location

- All pages in `src/pages/` folder (Next.js Pages Router)

### Rules

1. **Always use default export** for pages

   ```tsx
   export default LoginPage;
   ```

2. **Import React as namespace** (same as components)

   ```tsx
   import * as React from "react";
   ```

3. **Page naming**: Lowercase with hyphens (Next.js convention)

   ```
   pages/
   ├── index.tsx              → /
   ├── about.tsx              → /about
   ├── auth/
   │   └── login.tsx          → /auth/login
   ├── dashboard/
   │   ├── index.tsx          → /dashboard
   │   └── settings.tsx       → /dashboard/settings
   ```

4. **Use layouts** for shared UI structure

   ```tsx
   import type { NextPageWithLayout } from "./_app";

   const DashboardPage: NextPageWithLayout = () => {
     return <div>Dashboard content</div>;
   };

   DashboardPage.getLayout = (page) => (
     <DashboardLayout>{page}</DashboardLayout>
   );

   export default DashboardPage;
   ```

### Page Template

```tsx
import * as React from "react";
import Head from "next/head";
import { DashboardLayout } from "@/components/DashboardLayout";
import type { NextPageWithLayout } from "../_app";

const DashboardPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard | My App</title>
      </Head>
      <div>{/* Page content */}</div>
    </>
  );
};

DashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DashboardPage;
```

---

## 🪝 Hooks

### Location

- All custom hooks in `src/hooks/` folder

### Rules

1. **Always prefix with `use`**

   ```tsx
   ✅ useToggle
   ✅ useLocalStorage
   ✅ useDebounce
   ```

2. **Use named exports**

   ```tsx
   ✅ export const useToggle = () => { ... };
   ❌ export default useToggle;
   ```

3. **Import React as namespace**

   ```tsx
   import * as React from "react";
   ```

4. **Return arrays for boolean states, objects for complex states**

   ```tsx
   // Boolean state - return array
   export const useToggle = (initial = false) => {
     const [value, setValue] = React.useState(initial);
     const toggle = React.useCallback(() => setValue((v) => !v), []);
     return [value, toggle] as const;
   };

   // Complex state - return object
   export const useForm = <T,>(initial: T) => {
     const [values, setValues] = React.useState(initial);
     const [errors, setErrors] = React.useState({});
     return { values, setValues, errors, setErrors };
   };
   ```

### Hook Template

```tsx
import * as React from "react";

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
};
```

---

## 🔄 State Management

### Rules

1. **Try `React.useState` first** - Use for local component state

   ```tsx
   const [count, setCount] = React.useState(0);
   ```

2. **Use Jotai only when needed** - For complex global state

   ```tsx
   import { atom, useAtom } from "jotai";

   export const userAtom = atom<User | null>(null);

   // In component
   const [user, setUser] = useAtom(userAtom);
   ```

3. **Avoid prop drilling** - Use Context or Jotai for deep state

   ```tsx
   // ❌ Passing through 5 levels
   <Parent user={user}>
     <Child user={user}>
       <GrandChild user={user}>
         <GreatGrandChild user={user} />

   // ✅ Use Context
   <UserProvider>
     <App />
   </UserProvider>
   ```

---

## 📝 Forms

### Rules

1. **Always use React Hook Form with Zod**

   ```tsx
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { z } from "zod";

   const loginSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
   });

   type LoginFormValues = z.infer<typeof loginSchema>;

   export const LoginForm = () => {
     const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm<LoginFormValues>({
       resolver: zodResolver(loginSchema),
     });

     const onSubmit = handleSubmit((data) => {
       console.log(data);
     });

     return <form onSubmit={onSubmit}>...</form>;
   };
   ```

2. **Define schema before component**

   ```tsx
   // ✅ Schema first
   const schema = z.object({...});
   type FormValues = z.infer<typeof schema>;
   export const MyForm = () => { ... };
   ```

3. **Use Radix UI for form primitives** (Label, etc.)

   ```tsx
   import * as Label from '@radix-ui/react-label';

   <Label.Root htmlFor="email">Email</Label.Root>
   <input id="email" {...register('email')} />
   ```

---

## 🎨 Styling

### Rules

1. **Use Tailwind CSS** for all styling

   ```tsx
   <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
     Click me
   </button>
   ```

2. **Use SCSS only for global styles** in `src/styles/globals.css`

   ```css
   @import "tailwindcss";

   :root {
     --brand-primary: #1089ff;
   }
   ```

3. **Use CSS variables** for brand colors

   ```css
   :root {
     --brand-main: #1089ff;
     --brand-success: #22c55e;
   }

   @theme inline {
     --color-brand-main: var(--brand-main);
     --color-brand-success: var(--brand-success);
   }
   ```

4. **No inline styles** unless dynamic
   ```tsx
   ❌ <div style={{ color: 'red' }}>Text</div>
   ✅ <div className="text-red-500">Text</div>
   ✅ <div style={{ width: `${progress}%` }}>Dynamic</div>
   ```

---

## 🛠 Utils

### Location

- All utility functions in `src/utils/` folder

### Rules

1. **Use named exports**

   ```tsx
   ✅ export const formatDate = () => { ... };
   ❌ export default formatDate;
   ```

2. **One function per file** (unless closely related)

   ```
   utils/
   ├── formatDate.ts
   ├── createUrl.ts
   └── validation.ts  // Multiple related validators OK
   ```

3. **Pure functions preferred** - No side effects

   ```tsx
   // ✅ Pure
   export const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat("en-NG", {
       style: "currency",
       currency: "NGN",
     }).format(amount);
   };

   // ❌ Side effect
   export const logAndFormat = (amount: number) => {
     console.log(amount); // Side effect!
     return formatCurrency(amount);
   };
   ```

### Util Template

```tsx
/**
 * Formats a date string into a human-readable format
 * @param date - ISO date string or Date object
 * @param format - Output format ('short' | 'long')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: "short" | "long" = "short"
): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
```

---

## 📊 Constants

### Location

- All constants in `src/constants/` folder

### Rules

1. **Use SCREAMING_SNAKE_CASE**

   ```tsx
   export const API_BASE_URL = "https://api.example.com";
   export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   export const ALLOWED_ROLES = ["admin", "user", "guest"] as const;
   ```

2. **Group related constants**

   ```tsx
   // constants/api.ts
   export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
   export const API_TIMEOUT = 10000;
   export const API_RETRY_COUNT = 3;

   // constants/validation.ts
   export const MIN_PASSWORD_LENGTH = 8;
   export const MAX_USERNAME_LENGTH = 20;
   ```

3. **Use `as const` for literal types**
   ```tsx
   export const TRANSACTION_STATUSES = [
     "pending",
     "completed",
     "failed",
   ] as const;
   export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
   ```

---

## 🌍 Contexts

### Location

- All React Contexts in `src/contexts/` folder

### Rules

1. **Context + Provider + Hook in same file**

   ```tsx
   import * as React from "react";

   type AuthContextType = {
     user: User | null;
     login: (credentials: Credentials) => Promise<void>;
     logout: () => void;
   };

   const AuthContext = React.createContext<AuthContextType | undefined>(
     undefined
   );

   export const AuthProvider = ({
     children,
   }: {
     children: React.ReactNode;
   }) => {
     const [user, setUser] = React.useState<User | null>(null);

     const login = React.useCallback(async (credentials: Credentials) => {
       // Implementation
     }, []);

     const logout = React.useCallback(() => {
       setUser(null);
     }, []);

     return (
       <AuthContext.Provider value={{ user, login, logout }}>
         {children}
       </AuthContext.Provider>
     );
   };

   export const useAuth = () => {
     const context = React.useContext(AuthContext);
     if (!context) {
       throw new Error("useAuth must be used within AuthProvider");
     }
     return context;
   };
   ```

2. **Always provide error handling** for context consumer
   ```tsx
   if (!context) {
     throw new Error("useMyContext must be used within MyProvider");
   }
   ```

---

## 🔧 Library Configuration

### Location

- All third-party library configs in `src/lib/` folder

### Rules

1. **One file per library**

   ```
   lib/
   ├── axios.ts
   ├── dayjs.ts
   └── analytics.ts
   ```

2. **Export configured instances**

   ```tsx
   // lib/axios.ts
   import axios from "axios";

   export const apiClient = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
     timeout: 10000,
     headers: {
       "Content-Type": "application/json",
     },
   });

   apiClient.interceptors.request.use((config) => {
     const token = localStorage.getItem("token");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

---

## 📘 Types & Interfaces

### Location

- Component-specific types: **Inline in component file**
- Shared types: `src/types/` folder

### Rules

1. **Prefer `type` over `interface`** (unless extending)

   ```tsx
   ✅ type User = { id: string; name: string; };
   ⚠️  interface User { id: string; name: string; } // Only if extending
   ```

2. **Use `type` suffix for reusable types**

   ```tsx
   type ButtonProps = { ... };
   type TransactionStatus = 'pending' | 'completed';
   ```

3. **Component props**: `ComponentNameProps`

   ```tsx
   export type ButtonProps = { ... };
   export type ModalProps = { ... };
   ```

4. **API DTOs**: `ResourceNameDTO`

   ```tsx
   export type UserDTO = {
     id: string;
     email: string;
     name: string;
   };
   ```

5. **Truly shared types** go in `src/types/`
   ```tsx
   // types/common.ts
   export type Nullable<T> = T | null;
   export type Optional<T> = T | undefined;
   ```

---

## 🧪 Testing

### Location

- Co-located with component: `Button.test.tsx`
- Or in `__tests__` folder: `__tests__/Button.test.tsx`

### Rules

1. **Use `.test.tsx` extension**

   ```
   Button.tsx
   Button.test.tsx
   ```

2. **Test file naming matches component**

   ```
   ✅ Button.tsx → Button.test.tsx
   ✅ LoginForm.tsx → LoginForm.test.tsx
   ```

3. **Describe blocks for organization**
   ```tsx
   describe('Button', () => {
     describe('when disabled', () => {
       it('should not call onClick', () => { ... });
     });

     describe('when clicked', () => {
       it('should call onClick handler', () => { ... });
     });
   });
   ```

---

## 📝 Naming Conventions

### Files

- **Components**: PascalCase - `Button.tsx`, `LoginForm.tsx`
- **Pages**: kebab-case - `index.tsx`, `login.tsx`
- **Utils**: camelCase - `formatDate.ts`, `createUrl.ts`
- **Hooks**: camelCase with `use` prefix - `useToggle.ts`
- **Constants**: camelCase file - `api.ts` (exports SCREAMING_SNAKE_CASE)
- **Types**: camelCase - `common.ts`, `api.types.ts`

### Variables & Functions

- **Variables**: camelCase - `userName`, `isLoading`
- **Functions**: camelCase - `handleClick`, `formatDate`
- **Components**: PascalCase - `Button`, `LoginForm`
- **Hooks**: camelCase with `use` - `useToggle`, `useAuth`
- **Constants**: SCREAMING_SNAKE_CASE - `API_URL`, `MAX_SIZE`
- **Types**: PascalCase - `UserProps`, `TransactionStatus`
- **Booleans**: Prefix with `is`, `has`, `should` - `isLoading`, `hasError`

### Folders

- **Lowercase with hyphens**: `api`, `components`, `utils`
- **No plurals for folders**: `component/` not `components/` for subfolders

---

## 🚫 Common Mistakes to Avoid

1. ❌ Default exports for components
2. ❌ `import React from 'react'`
3. ❌ Nested component folders (>1 level)
4. ❌ Types/interfaces in separate files (unless shared)
5. ❌ Using `any` type
6. ❌ Inline styles (unless dynamic)
7. ❌ Prop drilling (use Context/Jotai)
8. ❌ Side effects in render
9. ❌ Mutating state directly
10. ❌ Not using `useCallback`/`useMemo` for expensive operations

---

## ✅ Quick Checklist

Before committing code, ensure:

- [ ] All React imports use `import * as React from 'react'`
- [ ] All components use named exports
- [ ] Component folder structure is flat (max 1 level)
- [ ] API calls use SWR
- [ ] Forms use React Hook Form + Zod
- [ ] Utils are pure functions with named exports
- [ ] Constants use SCREAMING_SNAKE_CASE
- [ ] Custom hooks start with `use`
- [ ] No linter errors
- [ ] Styles use Tailwind CSS
- [ ] No `any` types
- [ ] Proper error handling

---

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SWR](https://swr.vercel.app/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Radix UI](https://www.radix-ui.com/)

---

**Last Updated**: November 2024
**Version**: 1.0.0
