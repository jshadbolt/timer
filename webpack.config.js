const HtmlWebpackPlugin = require('html-webpack-plugin');     
const path = require('path');

module.exports = {
    // mode: 'production',
    mode: 'development',
    watch: true,
    entry: {
        index: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'New Website',
            template: './src/index.html'
        }),
    ],
    devtool: 'inline-source-map', 
    devServer: {
        static: './dist',
        watchFiles: ["src/*.html"],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    // optimization: {
    //     runtimeChunk: 'single',
    // },
};