/** @type {import('jest').Config} */
module.exports = {
    preset: 'jest-expo',
    testMatch: ['<rootDir>/tests/component/**/*.test.{ts,tsx}'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    ],
    setupFilesAfterFramework: ['@testing-library/react-native/pure'],
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        '!app/**/_layout.tsx',
        '!app/**/+not-found.tsx',
    ],
    coverageThreshold: {
        global: {
            lines: 60,
            branches: 50,
        },
    },
};
