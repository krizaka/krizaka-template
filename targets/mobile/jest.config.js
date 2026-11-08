/**
 * Jest for the mobile template — one project.
 *
 * `screens`: the `jest-expo` preset with @testing-library/react-native — screens and the navigator
 * rendered under the iOS simulator environment. React is mapped to this package's own copy
 * (React 19.2.3, the version of React Native 0.86 renderer — see metro.config.js).
 */
const path = require("node:path");

const reactDir = path.dirname(require.resolve("react/package.json", { paths: [__dirname] }));
/** @krizaka/* packages export ES modules only (an `import` condition): Jest requires their files directly. */
const krizaka = (name, file) =>
  path.join(path.dirname(require.resolve(`@krizaka/${name}/package.json`, { paths: [__dirname] })), file);

/** The ES-module entries of the packages the kit and the app import (each has only an `import` condition). */
const esmEntries = {
  pacer: ["", "react"],
  intl: ["", "plural", "number", "date", "money"],
  i18n: ["", "react"],
  icons: ["native"],
};
const esmMap = Object.fromEntries(
  Object.entries(esmEntries).flatMap(([name, subs]) =>
    subs.map((sub) => {
      const dir = path.dirname(require.resolve(`@krizaka/${name}/package.json`, { paths: [__dirname] }));
      const entry = require(path.join(dir, "package.json")).exports[sub === "" ? "." : `./${sub}`].import;
      const suffix = sub === "" ? "" : `/${sub}`;
      return [`^@krizaka/${name}${suffix}$`, path.join(dir, entry)];
    }),
  ),
);

module.exports = {
  projects: [
    {
      displayName: "screens",
      preset: "jest-expo/ios",
      modulePaths: ["<rootDir>/node_modules"],
      setupFiles: ["<rootDir>/jest.setup.screens.js"],
      testMatch: ["<rootDir>/src/**/__tests__/**/*.test.tsx"],
      moduleNameMapper: {
        "^react$": reactDir,
        "^react/(.*)$": `${reactDir}/$1`,
        "^@krizaka/ui/native$": krizaka("ui", "dist/native.js"),
        "^@krizaka/ui/native/(.*)$": krizaka("ui", "dist/native/$1.js"),
        "^@krizaka/tokens/native$": krizaka("tokens", "dist/native.js"),
        ...esmMap,
      },
      transformIgnorePatterns: [
        "node_modules/(?!(.pnpm|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*|react-navigation|@krizaka/.*|@noble/.*|@tanstack/.*|react-native-svg))",
      ],
    },
  ],
};
