const webpack = require('webpack');
const merege = require('webpack-merge');
const base = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const isProd = process.env.NODE_ENV === 'production';

module.exports = merege(base,{
    entry:['./src/entry-client.js'],
    plugins: [
        new VueSSRClientPlugin()
    ],

    // low webapck 4.0.0
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "manifest",
    //   minChunks: Infinity
    optimization:
    isProd?{
        minimize: true,
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        runtimeChunk: {
            name: "true"
        },
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '@',
            name: true,
            cacheGroups:{
                test: /[\\/]node_modules[\\/]/,
                name: "lib",
                chunks: "all",

                //处理css
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    }:{},
})
