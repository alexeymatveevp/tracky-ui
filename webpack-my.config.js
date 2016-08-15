const path = require('path');
const webpack = require('webpack');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
    devtool: 'eval',
    entry: './src/app/app.jsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'tracky.min.js'
    },
    module: {
        loaders: [
//            {
//                test: /\.js$/,
//                loaders: ['json']
//            }, 
            {
                test: /\.png$/,
                loader: 'url-loader'
            }, {
                test: /\.jsx$/,
                loader: 'jsx-loader'
            }
        ]
    }
//    plugins: [
//        // Moves files
//        new TransferWebpackPlugin([
//          {from: 'app'},
//        ], path.resolve(__dirname, 'src')),
//      ],
}