
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production':'development',
    devtool: isProd ? false: '#cheap-module-source-map',
    output:{
        path: path.resolve(__dirname,'../../build/'),
        publicPath: '',
        filename: '[name].[chunkhash].js',
    },
    module: {
        noParse: /es6-promise\.js$/, 
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    preserveWhitespace: false,
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
                        })
                    ]
                }
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, '../src')],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', ['vue-app']]
                    }
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[hash].[ext]'
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isProd ? (MiniCssExtractPlugin.loader,'css-loader') : 'style-loader',
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.vue'],
        alias: {
            '~': path.resolve(__dirname, '../'),
            '~api': path.resolve(__dirname,'../api'),
            '~common': path.resolve(__dirname, '../common'),
            '~components': path.resolve(__dirname, '../components'),
            '~config': path.resolve(__dirname, '../config'),
            '~page': path.resolve(__dirname, '../page'),
            '~static': path.resolve(__dirname, '../static'),
            '~store': path.resolve(__dirname, '../store'),
            '~util': path.resolve(__dirname, '../util'),
        }
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },
    plugins: isProd
    ? [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        })
      ]
    : [
        new FriendlyErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
      ]
}
