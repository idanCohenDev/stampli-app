# Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ExpenseService.test.ts
```

## Manual Testing Scenarios

### 1. Add Expense (Online)

**Steps**:
1. Launch the app with network connection
2. Fill in the form:
   - Merchant: "Starbucks"
   - Amount: "5.75"
   - Category: "Food"
3. Tap "Add Expense"

**Expected**:
- Expense appears in list immediately
- Form resets
- Total spend updates
- No offline banner visible

### 2. Add Expense (Offline)

**Steps**:
1. Enable Airplane Mode on device/simulator
2. Fill in the form:
   - Merchant: "Target"
   - Amount: "45.00"
   - Category: "Shopping"
3. Tap "Add Expense"

**Expected**:
- Offline banner appears at top
- Banner shows "1 expense queued for sync"
- Expense appears in list with temporary ID
- Total spend updates locally

### 3. Queue Sync

**Steps**:
1. Add 2-3 expenses while offline
2. Disable Airplane Mode

**Expected**:
- Offline banner disappears
- Queue automatically flushes
- Temporary IDs replaced with server IDs
- No data loss

### 4. Push Notification Simulation

**Steps**:
1. Tap "Simulate Push" button in header
2. Alert appears showing new expense

**Expected**:
- Alert displays: "New Expense! Starbucks - $5.75"
- Tap OK to dismiss

### 5. Form Validation

**Test Invalid Inputs**:

| Input | Expected Behavior |
|-------|-------------------|
| Empty merchant | "Merchant is required" error |
| Merchant: "A" | "Merchant name too short" error |
| Empty amount | "Amount is required" error |
| Amount: "abc" | "Invalid amount" error |
| Amount: "-10" | "Amount must be greater than 0" error |

### 6. Category Selection

**Steps**:
1. Tap category field
2. Modal opens with all categories
3. Select "Entertainment"

**Expected**:
- Modal closes
- Selected category displays
- Category indicator color changes

### 7. Summary Calculations

**Scenario**: Add these expenses:
- Food: $50.00
- Food: $30.00
- Transport: $20.00

**Expected Summary**:
- Total Spend: $100.00
- Transactions: 3
- Average: $33.33
- Spend by Category:
  - Food: $80.00
  - Transport: $20.00

### 8. Empty State

**Steps**:
1. Clear all expenses (fresh install)
2. View expenses list

**Expected**:
- "No expenses yet" message
- "Add your first expense to get started" subtext

### 9. Latency Simulation

**Observation**:
- API calls have random delay (0-1000ms)
- ~10% of requests fail randomly
- Failed requests trigger offline queue

**To verify**:
- Add multiple expenses quickly
- Some should queue if random failure occurs

### 10. Optimistic Updates

**Steps**:
1. Add expense with network connected
2. Observe UI updates before API completes

**Expected**:
- Expense appears immediately
- No loading spinner between submit and display
- If API fails, expense is rolled back

## Unit Test Coverage

### ExpenseService Tests

**Location**: `src/tests/ExpenseService.test.ts`

Tests:
- ✅ Adds expense to queue when offline
- ✅ Returns expense immediately when online
- ✅ Flushes queue when reconnected
- ✅ Persists queue to AsyncStorage

### Calculations Tests

**Location**: `src/tests/calculations.test.ts`

Tests:
- ✅ Calculates correct summary statistics
- ✅ Handles empty expense list
- ✅ Sorts expenses by date (descending/ascending)
- ✅ Groups expenses by category

## Component Testing

### Testing AddExpenseForm

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { AddExpenseForm } from '@/src/components/expenses';

it('validates required fields', () => {
  const { getByText, getByPlaceholderText } = render(
    <AddExpenseForm onSubmit={jest.fn()} />
  );

  fireEvent.press(getByText('Add Expense'));

  expect(getByText('Merchant is required')).toBeTruthy();
  expect(getByText('Amount is required')).toBeTruthy();
});
```

## Integration Testing Strategy

### Offline Flow Integration Test

**Scenario**: User adds expense while offline, then reconnects

```typescript
it('queues expense when offline and flushes when back online', async () => {
  // 1. Mock offline state
  mockApiClient.post.mockRejectedValue(new Error('Network error'));

  // 2. Add expense
  const expense = await expenseService.addTransaction(newExpense);

  // 3. Verify queued
  expect(expenseService.getQueueLength()).toBe(1);

  // 4. Mock back online
  mockApiClient.post.mockResolvedValue({ success: true, data: expense });

  // 5. Flush queue
  await expenseService.flushQueue();

  // 6. Verify queue empty
  expect(expenseService.getQueueLength()).toBe(0);
});
```

## Performance Testing

### Metrics to Monitor

1. **Time to Interactive**: < 2 seconds
2. **List Scroll Performance**: 60fps with 100+ items
3. **Form Submission**: < 100ms perceived latency
4. **Cache Load Time**: < 500ms

### Testing Large Datasets

```typescript
// Generate 1000 mock expenses
const mockExpenses = Array.from({ length: 1000 }, (_, i) => ({
  id: `${i}`,
  merchant: `Store ${i}`,
  amount: Math.random() * 100,
  category: randomCategory(),
  date: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}));

// Verify list renders smoothly
```

## Debugging Tips

### Enable React Query DevTools (Development)

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  {__DEV__ && <ReactQueryDevtools />}
</QueryClientProvider>
```

### Debug Offline Queue

```typescript
// In ExpensesScreen
console.log('Queue length:', expenseService.getQueueLength());
console.log('Is online:', netInfoService.getConnectionStatus());
```

### Monitor Network Requests

```typescript
// In ApiClient
console.log('REQUEST:', method, path, body);
console.log('RESPONSE:', response);
```

## Continuous Integration

### Recommended CI Pipeline

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Type check
        run: npx tsc --noEmit
      - name: Lint
        run: npm run lint
```

## Known Testing Limitations

1. **Real Device Testing**: NetInfo behavior differs between simulator and real device
2. **Push Notifications**: Mock implementation only (no real FCM)
3. **Background Sync**: Not implemented (would require native background tasks)

## Test Data Seeds

### Mock Expenses for Development

```typescript
const seedData: Expense[] = [
  {
    id: '1',
    merchant: 'Whole Foods',
    amount: 87.32,
    category: ExpenseCategory.FOOD,
    date: '2025-10-15T14:30:00Z',
    createdAt: '2025-10-15T14:30:00Z',
  },
  // Add more...
];
```

Use `expenseService.getMockExpenses()` to load seed data.
