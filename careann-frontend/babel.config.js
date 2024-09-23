module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'], // or any other preset you're using
      plugins: ['tailwindcss-react-native/babel'],
    };
  };
  