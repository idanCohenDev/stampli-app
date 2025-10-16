# Environment Configuration Guide

This app supports **three environments**: Development, Staging, and Production.

## Environment Files

Each environment has its own `.env` file:

```
.env.development   # Local development
.env.staging       # Staging/QA environment
.env.production    # Production environment
.env.example       # Template (committed to repo)
```

**Note**: The actual `.env.*` files are gitignored. Use `.env.example` as a template.

## Setup

1. Copy the example file for each environment:

```bash
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

2. Update each file with environment-specific values:

**`.env.development`**
```bash
APP_ENV=development
API_BASE_URL=https://api.expenses.dev
API_TIMEOUT=10000
SIMULATE_LATENCY=true
LATENCY_MS=1000
FAILURE_RATE=0.1
```

**`.env.staging`**
```bash
APP_ENV=staging
API_BASE_URL=https://api.expenses.staging
API_TIMEOUT=10000
SIMULATE_LATENCY=true
LATENCY_MS=500
FAILURE_RATE=0.05
```

**`.env.production`**
```bash
APP_ENV=production
API_BASE_URL=https://api.expenses.prod
API_TIMEOUT=10000
SIMULATE_LATENCY=false
LATENCY_MS=0
FAILURE_RATE=0
```

## Running the App

### Development
```bash
npm start              # Default (development)
npm run start:dev      # Explicit development
npm run ios:dev        # iOS development
npm run android:dev    # Android development
```

### Staging
```bash
npm run start:staging
npm run ios:staging
npm run android:staging
```

### Production
```bash
npm run start:prod
npm run ios:prod
npm run android:prod
```

## How It Works

### 1. app.config.js
Dynamic configuration file that loads the appropriate `.env` file based on `APP_ENV`:

```javascript
require('dotenv').config({
  path: `.env.${process.env.APP_ENV || 'development'}`,
});
```

### 2. src/config/env.ts
Type-safe wrapper that reads configuration from `expo-constants`:

```typescript
export const env = {
  API_BASE_URL: '...',
  SIMULATE_LATENCY: true/false,
  ENVIRONMENT: 'development' | 'staging' | 'production',
  // ...
};
```

### 3. Usage in Code
Import and use anywhere:

```typescript
import { env } from '@/src/config/env';

console.log('Current environment:', env.ENVIRONMENT);
console.log('API URL:', env.API_BASE_URL);
```

## Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `APP_ENV` | string | Environment name (development/staging/production) |
| `API_BASE_URL` | string | Backend API base URL |
| `API_TIMEOUT` | number | Request timeout in milliseconds |
| `SIMULATE_LATENCY` | boolean | Enable simulated network delays |
| `LATENCY_MS` | number | Max simulated latency (if enabled) |
| `FAILURE_RATE` | number | Random API failure rate (0-1) |

## Troubleshooting

### Environment not loading
```bash
# Clear Expo cache and restart
npm start -- -c
```

### Wrong environment active
Check which environment is running:
```typescript
import { env } from '@/src/config/env';
console.log('Active environment:', env.ENVIRONMENT);
```

### TypeScript errors
Rebuild after changing `app.config.js`:
```bash
npx tsc --noEmit
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build for Staging
  env:
    APP_ENV: staging
  run: |
    npm run build
```

### EAS Build
```json
{
  "build": {
    "development": {
      "env": {
        "APP_ENV": "development"
      }
    },
    "staging": {
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

## Best Practices

1. **Never commit real .env files** - Only commit `.env.example`
2. **Use staging for QA** - Test all changes in staging before production
3. **Disable simulation in production** - Set `SIMULATE_LATENCY=false` for prod
4. **Verify environment** - Check `env.ENVIRONMENT` on app startup
5. **Document changes** - Update `.env.example` when adding new variables

## Security

- Sensitive values (API keys, secrets) should use a secure secret manager
- Don't include credentials in environment files
- Use different API keys per environment
- Rotate credentials regularly
