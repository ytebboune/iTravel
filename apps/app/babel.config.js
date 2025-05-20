module.exports = function (api) {
  api.cache(true);

  // Ignore all .babelrc files in node_modules (hacky, but works in dev)
  process.env.BABEL_IGNORE_BABELRC = "1";

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel']
      }
    }
  };
};
