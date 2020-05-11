const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    devtool: "inline-source-map",
    entry: "./src/index.ts",
    target: 'node',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader"
        }]
    },
    plugins: [
        new CopyPlugin([{
            from: 'node_modules/sql.js/dist/sql-wasm.wasm',
            to: 'static/js/'
        }])
    ]
};