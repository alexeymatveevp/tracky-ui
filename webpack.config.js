const webpack = require('webpack');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);


module.exports = {
    entry: {
        tracky: path.join(__dirname, 'src/app/') + 'index.jsx',
        test: path.join(__dirname, 'src/app/') + 'test.jsx',
//        vendor: [
//            "jquery",
//            "jquery-mockjax"
//        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
//            {
//                text: /\.scss$/,
//                loaders: ['style', 'css', 'sass']
//            }
//            {
//                test: /jquery-mockjax/,
//                loader: 'imports?jQuery=jquery,$=jquery,this=>window'
//            },
//            {
//                test: /jquery/,
//                loader: 'expose?$!expose?jQuery'
//            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'src/*.html',
                to: 'dist'
            } // not working!
        ], {
            copyUnmodified: true
        }),
//        new webpack.ProvidePlugin({
//            $: 'jquery',
//            jQuery: 'jquery',
//            "$.mockjax": 'jquery-mockjax',
//            _: 'lodash'
//        })
    ],
    devServer: {
        port: 3000,
        historyApiFallback: true
    },
    //    resolveLoader: {
    //        modulesDirectories: [
    //            path.join(__dirname, 'node_modules'),
    //            path.join(__dirname, 'src/app/mock')
    //      ]
    //    },
    //    resolve: {
    //        root: [
    //            path.join(__dirname, 'src/app/mock'),
    //            path.join(__dirname, 'src/app/components')
    //      ]
    //    }
    resolve: {
        modulesDirectories: [
            "node_modules",
            "mock",
            "scss"
        ]
    }
}
