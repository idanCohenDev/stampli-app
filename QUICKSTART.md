# Quick Start Guide

## Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Run on iOS simulator
npm run ios

# 4. Run on Android emulator
npm run android

# 5. Run on web
npm run web
```

## What You'll See

Upon launching, the app displays a single-page expense tracker with:

1. **Header** - "Expenses" title + "Simulate Push" button
2. **Summary Card** - Total spend, transaction count, average, spend by category
3. **Add Expense Form** - Merchant, amount, category fields
4. **Transaction List** - Recent expenses sorted by date

## Try These Features

### 1. Add Your First Expense
- Merchant: "Starbucks"
- Amount: "5.75"
- Category: Tap to select "Food"
- Press "Add Expense"

**Result**: Expense appears immediately in the list, summary updates

### 2. Test Offline Mode
- Enable Airplane Mode on your device/simulator
- Add another expense
- Notice the orange offline banner appears
- Disable Airplane Mode
- Watch the queue sync automatically

### 3. Simulate Push Notification
- Tap "Simulate Push" in the header
- Alert appears with mock expense details

### 4. View Analytics
- Add expenses in different categories
- Watch the "Spend by Category" section update
- See color-coded category breakdowns

## Project Structure at a Glance

```
app/expenses/index.tsx       ← Main screen (start here!)
src/
├── components/expenses/     ← UI components
├── services/               ← Business logic
├── state/                  ← React Query hooks
└── types/                  ← TypeScript definitions
```

## Key Files

| File | Purpose |
|------|---------|
| [app/expenses/index.tsx](app/expenses/index.tsx) | Main expense screen |
| [src/services/ExpenseService.ts](src/services/ExpenseService.ts) | Offline queue logic |
| [src/state/useExpenses.ts](src/state/useExpenses.ts) | React Query hooks |
| [src/components/expenses/AddExpenseForm.tsx](src/components/expenses/AddExpenseForm.tsx) | Form with validation |

## Configuration

Modify API behavior in [app.json](app.json) under the `extra` section:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://api.expenses.mock",
      "apiTimeout": 10000,
      "simulateLatency": true,    // ← Enable/disable delays
      "latencyMs": 1000,           // ← Max delay in ms
      "failureRate": 0.1           // ← 10% random failures
    }
  }
}
```

Configuration is loaded via [src/config/env.ts](src/config/env.ts) using `expo-constants`.

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage
```

**Current Coverage**: 7 tests passing
- ExpenseService queue logic
- Summary calculations
- Date sorting

## Common Issues

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Cache Issues
```bash
npx expo start -c
```

### Metro Bundler Issues
```bash
rm -rf node_modules
npm install
npx expo start
```

## Next Steps

1. **Read the docs**:
   - [README.md](README.md) - Full feature overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Design patterns
   - [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing strategies

2. **Explore the code**:
   - Start with [app/expenses/index.tsx](app/expenses/index.tsx)
   - Follow imports to understand data flow
   - Check out [src/services/ExpenseService.ts](src/services/ExpenseService.ts) for offline logic

3. **Customize**:
   - Add new categories in [src/types/expense.ts](src/types/expense.ts)
   - Modify colors in [src/utils/categories.ts](src/utils/categories.ts)
   - Adjust cache timing in [src/state/queryClient.ts](src/state/queryClient.ts)

4. **Extend**:
   - Add expense editing
   - Implement date filtering
   - Create budget tracking
   - Add expense photos

## Development Tips

**Hot Reload**: Edit any file and save - changes appear instantly

**Debug Menu**:
- iOS: Cmd + D
- Android: Cmd + M
- Shake device on physical phone

**View Logs**:
```bash
npx expo start
# Then press 'j' to open debugger
```

## Support

- Issues: Check [TESTING_GUIDE.md](TESTING_GUIDE.md) debugging section
- Architecture questions: See [ARCHITECTURE.md](ARCHITECTURE.md)
- Expo docs: https://docs.expo.dev

---

**Built with**:
- React Native + Expo
- TypeScript (strict mode)
- React Query (v5)
- React Hook Form
- Axios

**Time to Interactive**: ~2 seconds
**Bundle Size**: Optimized with tree-shaking
**Offline Support**: Full offline-first architecture
