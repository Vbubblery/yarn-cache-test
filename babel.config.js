module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry"
      }
    ]
  ],
  // Support by babel-preset but not with cli-plugin-babel apparently
  // TODO: Check with tsconfig if there's a connection
  plugins: [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
};
