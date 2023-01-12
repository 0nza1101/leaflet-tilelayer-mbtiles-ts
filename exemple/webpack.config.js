const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = path.resolve(__dirname, './public/');
const srcPath = path.resolve(__dirname, './src/');

module.exports = {
    mode: 'development',
    entry: path.join(srcPath, 'index.ts'),
    output: {
        path: publicPath,
        filename: 'bundle.js'
    },
    devServer: {
        static: publicPath,
        compress: true,
        compress: true,
        hot: true,
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        }]
    },
    resolve: {
        extensions: ['*', '.js', '.ts'],
        fallback: {
            "crypto": false,
            "fs": false,
            "path": false
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(publicPath, 'index.html'),
            filename: 'index.html'
        })
    ]
};