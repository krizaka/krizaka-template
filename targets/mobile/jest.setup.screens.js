// Expo SDK 57's "winter" runtime installs lazy globals (import.meta registry, structuredClone) whose first read
// requires a module; under Jest that read can land after the test file is torn down ("require a file outside of the
// scope of the test code"). Define them eagerly here.
jest.mock("expo/src/winter/ImportMetaRegistry", () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));
if (typeof globalThis.structuredClone !== "function") {
  // The polyfill itself: structuredClone is what is missing here.
  globalThis.structuredClone = (value) => JSON.parse(JSON.stringify(value)); // NOSONAR
}

// react-native-safe-area-context: the native provider renders nothing under Jest; use a passthrough.
jest.mock("react-native-safe-area-context", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(insets) },
    initialWindowMetrics: { frame: { x: 0, y: 0, width: 390, height: 844 }, insets },
  };
});
