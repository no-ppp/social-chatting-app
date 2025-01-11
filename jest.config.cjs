module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.cjs'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@testing-library|react-router|react-router-dom)/)'
    ],
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    }
}; 