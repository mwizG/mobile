/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
    transformer: {
      // Enable inline requires to optimize startup time
      inlineRequires: true,
    },
    resolver: {
      // Add custom file extensions if needed (e.g., .jsx, .json)
      sourceExts: ['js', 'json', 'ts', 'tsx'],
    },
  };
  