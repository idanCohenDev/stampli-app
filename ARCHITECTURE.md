# Architecture Documentation

## Project Structure

```
stampli-app/
├── app/
│   ├── expenses/           # Main expenses screen
│   │   └── index.tsx       # Single-page expense tracker
│   ├── (tabs)/             # Tab navigation (redirects to expenses)
│   └── _layout.tsx         # Root layout with React Query provider
├── src/
│   ├── types/              # TypeScript definitions
│   │   ├── expense.ts      # Expense and category types
│   │   ├── api.ts          # API response types
│   │   └── index.ts
│   ├── services/           # Business logic layer
│   │   ├── ApiClient.ts    # HTTP client with latency simulation
│   │   ├── ExpenseService.ts # Expense CRUD + offline queue
│   │   ├── NetInfoService.ts # Network connectivity monitoring
│   │   ├── PushService.ts    # Mock FCM push notifications
│   │   └── index.ts
│   ├── state/              # React Query configuration
│   │   ├── queryClient.ts         # Query client setup
│   │   ├── expenseService.instance.ts # Service singleton
│   │   ├── useExpenses.ts         # Custom React Query hooks
│   │   └── index.ts
│   ├── utils/              # Helper functions
│   │   ├── formatting.ts   # Currency, date formatting
│   │   ├── calculations.ts # Summary calculations
│   │   ├── categories.ts   # Category colors and icons
│   │   └── index.ts
│   ├── components/
│   │   ├── common/         # Reusable form components
│   │   │   ├── ControlledTextInput.tsx
│   │   │   └── index.ts
│   │   └── expenses/       # Domain-specific components
│   │       ├── ExpenseCard.tsx     # Individual expense display
│   │       ├── ExpenseList.tsx     # List renderer
│   │       ├── AddExpenseForm.tsx  # Form with validation
│   │       ├── SummaryHeader.tsx   # Analytics dashboard
│   │       ├── OfflineBanner.tsx   # Offline indicator
│   │       └── index.ts
│   └── tests/              # Jest tests
│       ├── ExpenseService.test.ts
│       └── calculations.test.ts
├── .env.development        # Dev environment config
├── .env.production         # Prod environment config
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Test setup and mocks
└── README.md               # Project documentation
```

## Design Patterns

### 1. Repository Pattern
**Location**: `src/services/`

The service layer abstracts data access and business logic:

- **ApiClient**: Generic HTTP client (handles all network requests)
- **ExpenseService**: Domain-specific repository (CRUD operations + queue management)
- **Benefits**: Easy to swap API implementations, testable in isolation

### 2. Container-Presenter Pattern
**Location**: `app/expenses/` + `src/components/`

- **Container** (`app/expenses/index.tsx`): Manages state, side effects, data fetching
- **Presenters** (`src/components/expenses/*.tsx`): Pure, reusable UI components
- **Benefits**: Clean separation, components are highly reusable

### 3. Custom Hooks Pattern
**Location**: `src/state/`

React Query hooks encapsulate all data fetching logic:

```typescript
const { data: expenses } = useExpenses();
const addExpenseMutation = useAddExpense();
```

**Benefits**: Declarative, automatic caching, easy optimistic updates

### 4. Dependency Inversion
**Location**: Service layer

Services depend on abstractions (ApiClient interface) not concrete implementations:

```typescript
class ExpenseService {
  constructor(private apiClient: ApiClient) {}
}
```

## Data Flow

### Adding an Expense (Online)

1. User fills form → `AddExpenseForm`
2. Form submits → `useAddExpense` mutation
3. **Optimistic Update**: Expense added to UI immediately
4. Mutation calls `ExpenseService.addTransaction()`
5. Service calls `ApiClient.post()`
6. On success: Cache updated with server response
7. On error: Optimistic update rolled back

### Adding an Expense (Offline)

1. User fills form → `AddExpenseForm`
2. Form submits → `useAddExpense` mutation
3. **Optimistic Update**: Expense added to UI
4. Service detects failure → adds to offline queue
5. Expense saved to AsyncStorage
6. When online: `NetInfoService` triggers queue flush
7. Queue processed → temp IDs replaced with server IDs

## Offline-First Strategy

### Queue Management

**Location**: `src/services/ExpenseService.ts`

```typescript
private queue: QueuedExpense[] = [];

async addTransaction(newExpense: NewExpense) {
  const response = await this.apiClient.post(...);

  if (!response.success) {
    // Add to queue
    this.queue.push({ tempId, expense, timestamp });
    await this.saveQueue();
  }

  return expense;
}

async flushQueue() {
  for (const queuedItem of this.queue) {
    // Retry failed requests
  }
}
```

### Cache Strategy

1. **Read**: Always try network first, fallback to cache
2. **Write**: Save to cache immediately (optimistic)
3. **Sync**: Background sync when connection restored

## Testing Strategy

### Unit Tests
- **Services**: Mock ApiClient, test queue logic
- **Utils**: Pure function testing (calculations, formatting)

### Component Tests
- **Forms**: Validation, submission behavior
- **Lists**: Rendering, empty states

### Integration Tests
- **Offline Flow**: Queue → reconnect → flush
- **Optimistic Updates**: Add → fail → rollback

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI | React Native | Cross-platform mobile framework |
| Navigation | Expo Router | File-based routing |
| State | React Query | Server state management |
| Forms | React Hook Form | Form validation |
| HTTP | Axios | Network requests |
| Storage | AsyncStorage | Local persistence |
| Connectivity | NetInfo | Network monitoring |
| Testing | Jest | Unit and integration tests |
| Types | TypeScript | Static type checking |

## Performance Optimizations

1. **Memoization**: `React.memo` on presentational components
2. **Query Caching**: 5-minute stale time on expense queries
3. **Optimistic Updates**: Zero perceived latency on mutations
4. **FlatList**: Virtualized list rendering for large datasets

## Security Considerations

- No sensitive data in AsyncStorage (mock API only)
- API config externalized to `.env` files
- Type safety prevents injection vulnerabilities

## Scalability

### Adding New Features

**New Entity Type** (e.g., "Budgets"):
1. Create types in `src/types/budget.ts`
2. Create service in `src/services/BudgetService.ts`
3. Create hooks in `src/state/useBudgets.ts`
4. Create components in `src/components/budgets/`

**New API Endpoint**:
1. Add method to appropriate service
2. Create React Query hook
3. Use in components

### Code Organization

- Keep files under 300 lines
- One component per file
- Export from index.ts barrels
- Co-locate tests with source files
