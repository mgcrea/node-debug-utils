module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '4'
        },
        loose: true
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread'
  ]
};
