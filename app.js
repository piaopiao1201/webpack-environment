var express = require('express'),
    path = require('path');
var consolidate = require('consolidate');
var isDev = process.env.NODE_ENV !== 'production';
var app = express();
var port = 3000;

app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './www'));

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

if (isDev) {

    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.dev.config.js');
    // var devClient = './dev-client';
    // Object.keys(webpackDevConfig.entry).forEach(function (name, i) {
    // var extras = [devClient]
    // webpackDevConfig.entry[name] = extras.concat(webpackDevConfig.entry[name])
    // })
    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    var hotMiddleWare=webpackHotMiddleware(compiler);
    app.use(hotMiddleWare);

    // 监听html文件改变事件
    compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件 reload,这个事件会在dev-client.js中接受到，然后刷新
        hotMiddleWare.publish({ action: 'reload' });
        cb();
        console.log('事件已经发送');
    })
    })
    // require('./server/routes')(app);

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);
    //  var bs = require('browser-sync').create();
    // app.listen(port, function(){
    //     bs.init({
    //         open: false,
    //         ui: false,
    //         notify: false,
    //         proxy: 'localhost:3000',
    //         files: ['./www/index.html'],
    //         port: 3000
    //     })
    //     console.log('App (dev) is going to be running on port 8080 (by browsersync).');
    // });
    server.listen(port, function(){
        console.log('App (dev) is now running on port 3000!');
    });
} else {

    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, 'public')));
    // require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}

app.use(express.static(path.join(__dirname, 'www')));
// var io=require('socket.io').listen(server);
// app.get('/',function(req,res){
//   res.sendFile('./www/index.html');
// });
app.use('/',require('./www/server/route.js'));
// io.on('connect',function(socket){
//     console.log('已经连接');
//     socket.on('say',function(data){
//         console.log(data);
//     })
// })