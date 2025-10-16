import Reactotron from 'reactotron-react-native';
import { QueryClientManager, reactotronReactQuery } from 'reactotron-react-query';
import { queryClient } from '@/src/state';

// Only configure Reactotron in development mode
if (__DEV__) {
  const queryClientManager = new QueryClientManager({
    queryClient,
  });

  Reactotron.configure({
    name: 'Stampli App',
    // Use your machine's local IP if testing on a physical device
    // Otherwise localhost works fine for simulator/emulator
  })
    .useReactNative({
      asyncStorage: true,
      networking: {
        ignoreUrls: /symbolicate/,
      },
      editor: false,
      errors: { veto: (stackFrame) => false },
      overlay: false,
    })
    .use(reactotronReactQuery(queryClientManager))
    .connect();

  // Clear Reactotron on app start for a fresh session
  Reactotron.clear?.();

  console.log('Reactotron Configured');
}

export default Reactotron;
