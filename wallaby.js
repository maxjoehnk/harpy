module.exports = () => ({
    files: [
        'src/**/*.ts',
        '!src/**/*.test.ts'
    ],
    tests: [
        'src/**/*.test.ts'
    ],
    env: {
        type: 'node'
    },
    setup(wallaby) {
        const mocha = wallaby.testFramework;
        mocha.ui('tdd');
    }
});