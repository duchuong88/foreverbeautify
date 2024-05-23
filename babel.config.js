module.exports = {
    presets: [
        '@babel/preset-react', ['@babel/preset-env', {
            modules: false,
        }],
    ],
    plugins: [
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-private-methods", { "loose": true }],
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import'
    ],
};