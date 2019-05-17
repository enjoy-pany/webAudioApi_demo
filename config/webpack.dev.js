const path = require('path');
const uglify = require('uglifyjs-webpack-plugin'); //js压缩插件
const htmlPlugin = require('html-webpack-plugin'); //html压缩插件
const extractPlugin = require('mini-css-extract-plugin'); //css分离插件
module.exports = {
    entry: {//入口文件
        main: './src/index.js',
        // main2: './src/index2.js'
    }, 
    output: { //出口文件
        path: path.resolve(__dirname, '../dist'), //打包文件夹
        filename: '[name].js' //打包文件名称
    }, 
    mode: 'development', //模式选择
    module: { //转化配置
        rules: [
            //css loader
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                use: [
                    extractPlugin.loader,
                    'css-loader'
                ]
            },
            //写在html中的image-loader
            {
                test: /\.html$/i,
                use: ['html-withimg-loader']
            },
            //image loader
            {
                test: /\.(jpg|jpeg|png|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 500,
                            publicPath: '../image/',
                            outputPath: 'image/'
                        }
                    }
                ]
            },
            //es6 转义
            // {
            //     test: /\.js$/,
            //     use: ['babel-loader'],
            //     exclude: "/node_modules/" //include 表示哪些目录中的 .js 文件需要进行 babel-loader
            //                             //exclude 表示哪些目录中的 .js 文件不要进行 babel-loader
            // }
        ]
    },
    plugins: [ //插件
        new uglify(),
        new htmlPlugin({
            minify: { //对html进行压缩
                removeAttriuteQuotes: true //去掉属性的双引号
            },
            inject: 'head',
            hash: true, //为了js有缓存效果，添加hash解除缓存效果
            template: './index.html' //要打包的html路径及文件名称
        }),
       new extractPlugin({
            filename: './[name].css',
            chunkFilename:'[id].css'
       })
    ], 
    loader: {}, //loader 转换器
    devServer: { //服务器配置
        contentBase: path.resolve(__dirname, '../dist/'), //设置目录的基本结构
        host: 'localhost', //服务器Ip地址
        port: '8089', //端口配置
        compress: true //服务器压缩是否开启
    } 

}