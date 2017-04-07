var webpack = require('webpack');
var path = require('path');
var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var poststylus =  require('poststylus');
var loaders = [
    'style-loader',
  {
    loader: 'css-loader',
    options: {
      modules: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
    plugins: function() {
      return [
           require('autoprefixer')
        ];
      }
    }
  },
];
module.exports = {
    entry: {
        page1: [hotMiddlewareScript , './www/js/main.js'],
        // page2: ['./client/page2', hotMiddlewareScript]
    },
    output: {
        filename: './main/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: publicPath
    },
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        },{
            test: /\.css$/,
            // use:loaders
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: loaders,
            })
        },{
            test:/\.styl(us)?$/,
            // use:ExtractTextPlugin.extract({
            //     fallback: 'style-loader',
            //     use: ['css-loader','stylus-loader']
            // })
            use:[
                'style-loader', 'css-loader','stylus-loader'
            ]
        }]
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin("./asset/css/[name].css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                use: [poststylus([ 'autoprefixer'])]
                }
            }
        }),
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: './asset/index.html',
            template: './www/page.html',
            inject:true
        }),
    ],
    resolve:{
        extensions:['.js','.json']
    },
};

// module.exports = devConfig;
