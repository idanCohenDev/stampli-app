require('dotenv').config({
  path: `.env.${process.env.APP_ENV || 'development'}`,
});

const APP_ENV = process.env.APP_ENV || 'development';

const getExtraConfig = () => {
  const config = {
    apiBaseUrl: process.env.API_BASE_URL,
    apiTimeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
    simulateLatency: process.env.SIMULATE_LATENCY === 'true',
    latencyMs: parseInt(process.env.LATENCY_MS || '0', 10),
    failureRate: parseFloat(process.env.FAILURE_RATE || '0'),
    environment: APP_ENV,
  };

  if (!config.apiBaseUrl) {
    const defaults = {
      development: 'https://api.expenses.dev',
      staging: 'https://api.expenses.staging',
      production: 'https://api.expenses.prod',
    };
    config.apiBaseUrl = defaults[APP_ENV] || defaults.development;
  }

  return config;
};

module.exports = {
  expo: {
    name: 'stampli-app',
    slug: 'stampli-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'stampliapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: getExtraConfig(),
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
