const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: "development",
    devtool: "cheap-module-dev-source-map",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'threedemo.js'
    },
    devServer: {
        contentBase: "./dist",
        open: true,
        port: 8096
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        })
    ],
    module: {
        rules: [{
            test: /\.(png|jpe?g|gif)$/,
            use: {
                loader: "file-loader",
                options: {
                    outputPath: 'img/'
                }
            }
        }, {
            test: /\.js$/,
            exclude: /node-modules/,
            loader: 'babel-loader',
            /* options: {
                presets: [
                    ['@babel/preset-env',
                        // {
                        //     'useBuiltIns':"usage",//按需注入 失败可能参数不是这样设置了
                        //     //"corejs":2
                        // }
                    ],
                    // "@babel/preset-react"
                ]
            } */
            /* options:{ //报错 后面在解决
                "plugins":[
                    [
                        "@babel/plugin-transform-runtime",
                        {
                            "absoluteRuntime":false,
                            "corejs":2,
                            "helpers":true,
                            "regenerator":true,
                            "useESModules":false
                        }
                    ]
                ]
            } */
        }
        ]
    }
}