module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: [
      '@testing-library/react-native/cleanup-after-each',
      '@testing-library/jest-native/extend-expect',
    ],
  };