# Features to Pages Migration

## Overview

Reorganized the project structure to follow React best practices: **pages** contain UI/screens, **features** contain shared business logic.

---

## What Changed

### ✅ Moved to `src/pages/(auth)/`

**Page Components (UI):**
```
src/features/auth/login/          → src/pages/(auth)/login/
src/features/auth/register/       → src/pages/(auth)/register/
src/features/auth/forgot-password/ → src/pages/(auth)/forgot-password/
```

### ✅ Kept in `src/features/auth/`

**Shared Logic (Business Logic):**
```
src/features/auth/schemas/
├── login.schema.ts
├── register.schema.ts
└── forgot-password.schema.ts
```

---

## New Structure

### Before ❌
```
src/
├── features/
│   └── auth/
│       ├── login/
│       │   └── index.tsx                 (Page)
│       ├── register/
│       │   └── index.tsx                 (Page)
│       ├── forgot-password/
│       │   └── index.tsx                 (Page)
│       └── schemas/                      (Logic)
│           ├── login.schema.ts
│           ├── register.schema.ts
│           └── forgot-password.schema.ts
└── pages/
    └── (auth)/
        ├── login/                        (Empty)
        └── register/                     (Empty)
```

### After ✅
```
src/
├── features/
│   └── auth/
│       └── schemas/                      ✅ Business logic only
│           ├── login.schema.ts
│           ├── register.schema.ts
│           └── forgot-password.schema.ts
└── pages/
    └── (auth)/
        ├── login/
        │   └── index.tsx                 ✅ Page component
        ├── register/
        │   └── index.tsx                 ✅ Page component
        └── forgot-password/
            └── index.tsx                 ✅ Page component
```

---

## Updated Files

### 1. Navigation Config ✅

**File:** `src/navigation/root/_config.tsx`

```typescript
// Before
import Login from '@features/auth/login';
import Register from '@features/auth/register';
import ForgotPassword from '@features/auth/forgot-password';

// After
import Login from '@pages/(auth)/login';
import Register from '@pages/(auth)/register';
import ForgotPassword from '@pages/(auth)/forgot-password';
```

### 2. Schema Imports in Pages ✅

**Files:** 
- `src/pages/(auth)/login/index.tsx`
- `src/pages/(auth)/register/index.tsx`
- `src/pages/(auth)/forgot-password/index.tsx`

```typescript
// Before (relative path)
import { loginSchema } from '../schemas/login.schema';

// After (absolute path)
import { loginSchema } from '@features/auth/schemas/login.schema';
```

---

## Why This Structure?

### `src/pages/` - UI Components
- **Purpose:** Render UI and handle user interactions
- **Contains:** React components, JSX, routing
- **Examples:** Login screen, Register screen, Profile page

### `src/features/` - Business Logic
- **Purpose:** Reusable logic, validation, types
- **Contains:** Schemas, utilities, hooks, types
- **Examples:** Validation schemas, data transformers

### Benefits

1. ✅ **Clear Separation of Concerns**
   - Pages = UI/Presentation
   - Features = Logic/Business rules

2. ✅ **Better Reusability**
   - Schemas can be reused across multiple pages
   - Logic is decoupled from UI

3. ✅ **Easier Testing**
   - Test business logic independently
   - Test UI components separately

4. ✅ **Follows React Best Practices**
   - Standard project structure
   - Easier for new developers to understand

---

## Pattern to Follow

### ✅ Good Structure

```
src/
├── features/
│   └── [feature-name]/
│       ├── schemas/          # Zod schemas
│       ├── hooks/            # Custom hooks
│       ├── utils/            # Helper functions
│       ├── types/            # TypeScript types
│       └── constants/        # Constants
├── pages/
│   └── [route-name]/
│       └── index.tsx         # Page component
└── services/
    ├── api/                  # API calls
    ├── hooks/                # Global hooks
    └── contexts/             # Context providers
```

### ❌ Anti-pattern

```
src/
├── features/
│   └── [feature-name]/
│       ├── SomePage.tsx      # ❌ Pages shouldn't be here
│       ├── AnotherPage.tsx   # ❌ Pages shouldn't be here
│       └── schemas/          # ✅ OK
└── pages/
    └── [route-name]/
        ├── index.tsx         # ✅ OK
        └── schema.ts         # ❌ Logic shouldn't be here
```

---

## Examples from Your Codebase

### Login Flow

```
Page (UI):
src/pages/(auth)/login/index.tsx
├── Imports schema from features
├── Uses react-hook-form
├── Renders form UI
└── Handles navigation

Schema (Logic):
src/features/auth/schemas/login.schema.ts
├── Defines validation rules
├── Uses Zod
└── Exported for reuse
```

### Register Flow

```
Page (UI):
src/pages/(auth)/register/index.tsx
├── Multi-step form
├── Uses schemas from features
└── Renders UI

Schemas (Logic):
src/features/auth/schemas/register.schema.ts
├── phoneStepSchema
├── otpStepSchema
└── detailsStepSchema
```

---

## Other Features to Consider

Based on your folder structure, you might want to apply the same pattern:

### Potential Migrations

```
src/features/
├── home/       # Check if contains pages → move to src/pages/
├── moment/     # Check if contains pages → move to src/pages/
├── user/       # Check if contains pages → move to src/pages/
└── clip/       # Check if contains pages → move to src/pages/
```

**Rule of thumb:**
- If it renders a full screen → `src/pages/`
- If it's shared logic/types → `src/features/`
- If it's a reusable component → `src/components/`

---

## Testing After Migration

### Verify Everything Works

1. ✅ **Navigation**
   ```
   - Login screen loads
   - Register screen loads
   - Forgot password screen loads
   - Navigation between screens works
   ```

2. ✅ **Imports**
   ```
   - Schema imports resolve correctly
   - No import errors
   - TypeScript is happy
   ```

3. ✅ **Functionality**
   ```
   - Form validation works
   - API calls work
   - Navigation works
   - Mock data works
   ```

---

## Summary

| Item | Location | Purpose |
|------|----------|---------|
| **Login Page** | `src/pages/(auth)/login/` | UI Component |
| **Register Page** | `src/pages/(auth)/register/` | UI Component |
| **Forgot Password Page** | `src/pages/(auth)/forgot-password/` | UI Component |
| **Auth Schemas** | `src/features/auth/schemas/` | Validation Logic |
| **Auth API Hooks** | `src/services/hooks/apis/auth/` | API Logic |
| **Auth Mutations** | `src/services/mutations/` | Mutation Config |
| **Auth Queries** | `src/services/queries/` | Query Config |

---

## Next Steps

1. ✅ Run `npm install` (if you haven't)
2. ✅ Clear cache: `npx react-native start --reset-cache`
3. ✅ Test auth flows
4. ⏳ Consider migrating other features if they contain pages
5. ⏳ Document any feature-specific logic

**Migration complete!** Your project structure now follows React best practices. 🎉

