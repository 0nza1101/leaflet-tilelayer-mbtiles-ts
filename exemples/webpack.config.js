const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = path.resolve(__dirname, './');
const srcPath = path.resolve(__dirname, './');
const buildPath = path.resolve(__dirname, './');

module.exports = {
    entry: path.join(srcPath, 'index.ts'),
    output: {
        path: buildPath,
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: buildPath,
        compress: true
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        }]
    },
    node: {
        fs: "empty"
    },
    resolve: {
        extensions: ['*', '.js', '.ts']
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(publicPath, 'index.html'),
            filename: 'index.html'
        })
    ]
};