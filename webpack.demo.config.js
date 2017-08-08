'use strict';
const path = require('path')
const webpack = require('webpack');

const autoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlwebpackPlugin = require('html-webpack-plugin')

let entry = {};

let ROOT = path.resolve(__dirname);
var htmlplugin =
    new HtmlwebpackPlugin({
        filename: `./index.html`,
        template: `./demo/demo.html`,
        chunks: ['bundle'],
        minify: {
            collapseWhitespace: true,
            minifyJS: true
        }
    });
module.exports = {
    devtool: "source-map",
    entry: {
        'bundle': path.resolve(ROOT, './demo/index.js')
    },
    output: {
        path: path.resolve(ROOT, './demo/dist'),
        filename: '[name].js'
    },
    plugins: [htmlplugin, new ExtractTextPlugin("style.css"), new webpack.optimize.UglifyJsPlugin({
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
        compress: {
            //supresses warnings, usually from module minification
            warnings: false,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
        }
    })],
    devServer: {
        port: 10000,
        host: '127.0.0.1',
        https: false,
        compress: true,
        disableHostCheck: true
    },
    resolve: {
        extensions: ['.vue', '.js', '.json']
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader'],
            exclude: /(node_modules)/
        }, {
            test: /\.vue$/,
            use: [{
                loader: 'vue-loader',
                options: {
                    postcss: [require('postcss-bem')(), require('postcss-nested')(), require('postcss-cssnext')(), require('postcss-short'), require('postcss-position')()],
                    extractCSS: true
                }
            }],
        }, {
            test: /\.(css|scss)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader?modules'
            }, {
                loader: 'postcss-loader'
            }, ]
        }, {
            test: /\.(png|jpg|gif)(\?t=\d+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'assets/images/[name].[ext]'
                }
            }]
        }]
    }
}
