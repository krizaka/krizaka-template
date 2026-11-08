// The Expo project (owner + extra.eas.projectId) is in app.json — public, not a secret.
// Set extra.eas.projectId in app.json after creating the project on expo.dev.
module.exports = function appConfig({ config }) {
  return {
    ...config,
    android: {
      ...config.android,
      ...(process.env.GOOGLE_SERVICES_JSON ? { googleServicesFile: process.env.GOOGLE_SERVICES_JSON } : {}),
    },
  };
};
