# Register Feature - Dynamic Email/Phone Configuration

This registration feature supports dynamic switching between **email** and **phone** verification based on backend configuration.

## Architecture

```
src/features/auth/register/
├── config/
│   ├── register.config.ts    # Configuration management
│   └── index.ts
├── hooks/
│   ├── useRegisterForm.ts    # Form logic with dynamic schema
│   ├── useStepNavigation.ts   # Step navigation with dynamic steps
│   └── index.ts
├── helpers/
│   ├── fieldConfig.tsx       # Dynamic field configuration
│   └── index.ts
├── components/
│   ├── StepForm.tsx          # Form component
│   ├── PaginatorDot.tsx      # Progress indicator
│   └── index.ts
└── schemas/
    ├── register.schema.ts    # Zod schemas (supports both email & phone)
    └── index.ts
```

## How to Switch Between Email and Phone

### Option 1: Update Default Config (Quick Test)

Edit `src/features/auth/register/config/register.config.ts`:

```typescript
export const DEFAULT_REGISTER_CONFIG: RegisterConfig = {
  verificationMethod: 'email', // Change from 'phone' to 'email'
  requireVerification: true,
};
```

### Option 2: Backend API (Recommended for Production)

Update `getRegisterConfig()` function to fetch from backend:

```typescript
export const getRegisterConfig = async (): Promise<RegisterConfig> => {
  const response = await api.get('/config/registration');
  return response.data;
  // Backend should return: { verificationMethod: 'email' | 'phone', requireVerification: boolean }
};
```

### Option 3: Environment Variables

```typescript
export const getRegisterConfig = (): RegisterConfig => {
  const method = process.env.REGISTRATION_METHOD || 'phone';
  return {
    verificationMethod: method === 'email' ? 'email' : 'phone',
    requireVerification: true,
  };
};
```

### Option 4: Feature Flags

```typescript
import { useFeatureFlag } from '@hooks/featureFlags';

export const useRegisterConfig = (): RegisterConfig => {
  const useEmail = useFeatureFlag('registration.useEmail');
  return {
    verificationMethod: useEmail ? 'email' : 'phone',
    requireVerification: true,
  };
};
```

## How It Works

1. **Configuration**: `register.config.ts` defines which verification method to use
2. **Schema**: `register.schema.ts` includes schemas for both email and phone
3. **Steps**: `useStepNavigation.ts` dynamically generates steps based on config
4. **Fields**: `fieldConfig.tsx` renders the appropriate field (email or phone)
5. **Form**: `useRegisterForm.ts` validates and submits with the correct field

## Example: Backend Integration

```typescript
// In your API service
export const getRegistrationConfig = async (): Promise<RegisterConfig> => {
  try {
    const response = await fetch('/api/config/registration');
    const data = await response.json();
    return {
      verificationMethod: data.verificationMethod, // 'email' or 'phone'
      requireVerification: data.requireVerification,
    };
  } catch {
    return DEFAULT_REGISTER_CONFIG; // Fallback
  }
};

// Update register.config.ts
export const getRegisterConfig = (): RegisterConfig => {
  // Cache config or fetch on app initialization
  return cachedConfig || DEFAULT_REGISTER_CONFIG;
};
```

## Form Data Structure

The form data type supports both:

```typescript
type RegisterFormData = {
  fullName: string;
  username: string;
  password: string;
  confirmPassword?: string;
  phone?: string;    // When verificationMethod === 'phone'
  email?: string;    // When verificationMethod === 'email'
};
```

## Benefits

✅ **Flexible**: Switch between email/phone without code changes  
✅ **Backend Controlled**: Configuration can come from API  
✅ **Type Safe**: Full TypeScript support  
✅ **Maintainable**: Single source of truth for configuration  
✅ **Testable**: Easy to test both scenarios  

