# React Native Expenses App

A performant and maintainable single-page React Native expense tracking application built with TypeScript, React Query, and offline-first architecture.

## Architecture Overview

This app follows a modular, layered architecture with clear separation of concerns:

```
src/
├── types/           # TypeScript type definitions
├── services/        # API client, business logic, network monitoring
├── state/           # React Query hooks and cache configuration
├── utils/           # Formatting, calculations, category utilities
├── components/      # Reusable UI components
│   ├── common/      # Generic form inputs
│   └── expenses/    # Domain-specific components
└── tests/           # Jest unit and integration tests
```

## Key Features

- **Offline-First**: Works seamlessly offline with AsyncStorage caching
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Queue System**: Queues expense writes when offline and syncs upon reconnection
- **Network Monitoring**: Real-time connectivity tracking with NetInfo
- **Mock Push Notifications**: Simulated FCM push notifications
- **Aggregated Analytics**: Total spend, transaction count, averages, and category breakdown
- **Simulated API**: Mock latency and random failures for realistic testing

## Data Flow

1. **User Action** → Component (Container)
2. **Component** → React Query Mutation Hook
3. **Mutation Hook** → ExpenseService
4. **ExpenseService** → ApiClient (with simulated latency/failures)
5. **Response** → Cache Update (AsyncStorage + React Query)
6. **Cache** → Component Re-render

### Offline Sync Queue

When offline:
- New expenses are added to an in-memory queue
- Saved to AsyncStorage for persistence
- Displayed optimistically in the UI

When reconnected:
- NetInfoService detects connection
- Queue is automatically flushed to the API
- Temporary IDs replaced with server IDs

## Setup & Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment files
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production

# 3. Start development server
npm start
```

Run with different environments:
```bash
npm run start:dev       # Development (default)
npm run start:staging   # Staging
npm run start:prod      # Production
```

Run tests:
```bash
npm test
```

See [ENV_SETUP.md](ENV_SETUP.md) for detailed environment configuration.

## Technology Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build tooling
- **TypeScript**: Strict type safety
- **React Query**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Axios**: HTTP client
- **AsyncStorage**: Local persistence
- **NetInfo**: Network connectivity monitoring
- **Jest**: Unit and integration testing

## Component Architecture

### Container-Presenter Pattern

- **Containers** ([ExpensesScreen](app/expenses/index.tsx)): Handle data fetching, state, and side effects
- **Presenters** ([ExpenseCard](src/components/expenses/ExpenseCard.tsx), [SummaryHeader](src/components/expenses/SummaryHeader.tsx)): Pure, reusable visual components

### Repository Pattern

- **ApiClient** ([ApiClient.ts](src/services/ApiClient.ts)): Generic HTTP client with latency simulation
- **ExpenseService** ([ExpenseService.ts](src/services/ExpenseService.ts)): Domain-specific business logic
- **React Query Hooks** ([useExpenses.ts](src/state/useExpenses.ts)): Declarative data fetching layer

## Configuration

API configuration is managed per environment using `.env` files:

- `.env.development` - Local development with latency simulation
- `.env.staging` - Staging environment with reduced simulation
- `.env.production` - Production with no simulation

Configuration is loaded dynamically via [app.config.js](app.config.js) and accessed type-safely through [src/config/env.ts](src/config/env.ts).

**Example** (`.env.development`):
```bash
APP_ENV=development
API_BASE_URL=https://api.expenses.dev
SIMULATE_LATENCY=true
LATENCY_MS=1000
FAILURE_RATE=0.1
```

See [ENV_SETUP.md](ENV_SETUP.md) for complete environment setup guide.

## Testing Strategy

- **Unit Tests**: Service layer logic, utilities
- **Component Tests**: Form validation, user interactions
- **Integration Tests**: Offline queue behavior, network transitions

## Extending the App

### Adding a New Category

1. Update [ExpenseCategory](src/types/expense.ts) enum
2. Add color mapping in [categories.ts](src/utils/categories.ts)

### Modifying API Configuration

Update the `extra` section in [app.json](app.json):

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-api.com",
      "apiTimeout": 10000,
      "simulateLatency": false,
      "latencyMs": 0,
      "failureRate": 0
    }
  }
}
```

## License

MIT
