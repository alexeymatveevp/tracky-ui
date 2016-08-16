const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);


module.exports = {
    entry: {
        tracky: path.join(__dirname, 'src/app/') + 'index.jsx',
        test: path.join(__dirname, 'src/app/') + 'test.jsx',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
//            {
//                test: /\.js$/,
//                loaders: ['json']
//            }, 
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
//            {
//                test: /\.jsx$/,
//                loader: 'jsx-loader'
//            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'src/*.html', to: 'dist'} // not working!
        ], {
            copyUnmodified: true
        })
    ],
    devServer: {
      port: 3000,
      historyApiFallback: true
    },
}
