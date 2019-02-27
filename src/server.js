const path = require('path');
const Fs = require('fs');
const express = require('express');
const server = express();
const proxy = require('http-proxy-middleware');
const {createBundleRenderer} = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
// generate json bundle  use Fs.readFileSync is error
const bundle = require('../build/vue-ssr-server-bundle.json');

const clientManifest = require('../build/vue-ssr-client-manifest.json');

const template = Fs.readFileSync(path.resolve(__dirname,'./static/index.template.html'),'utf8');

// webpack vue-ssr-renderer-plugin generate json file
// const bundle = require('./dist/vue-ssr-bundle.json');
// const renderer = createBundleRenderer(bundle);

let renderer;
let readyPromise;
function createRenderer(bundle,options){
    return createBundleRenderer(bundle,Object.assign(options,{
        //cache
        runInNewContext: false,
    }))
}
if(isProd){
    renderer = createRenderer(bundle,{
        template,
        clientManifest
    })
}else{
    readyPromise = require('./config/setup-dev-server')(
        server,
        path.resolve(__dirname,'./static/index.template.html'),
        (bundle,options) =>{
            renderer = createRenderer(bundle,options);
        }
    )
}



function render(req,res){

    const s = Date.now();

    res.setHeader("Content-Type", "text/html");

    //error handle
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url);
        } else if(err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error');
            console.error(`error during render : ${req.url}`);
            console.error(err.stack);
        }
    }


    const context = {
        url: req.url,
        title: 'hello xiaoxx',
        meta: `<meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="format-detection" content="telephone=no">
        `,
    };

    renderer.renderToString(context, (err, html) => {
        if (err) {
            handleError(err);
        }
        res.send(html);

        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`);
        }
    });

}

// set proxy   http://localhost:8888/api/index.json   ===>  http://10.0.1.15/~xiaoxx/api/index.json
server.use('/openplatform', proxy({
    target: 'http://wx.500.com',
    changeOrigin: true
}));

//express 读取静态文件
server.use('', express.static(path.join(__dirname, '../build')));

// nodejs原生读取静态文件
/*
const documentRoot = 'E:/nodejs/ssr/dist/';
server.use('/dist',function(req,res){
    var url = req.url; 
    //客户端输入的url，例如如果输入localhost:8888/index.html
    //那么这里的url == /index.html 

    var file = documentRoot + url;
    console.log(url);
    Fs.readFile(file , function(err,data){
        
            //err为文件路径
            //data为回调函数
            //回调函数的一参为读取错误返回的信息，返回空就没有错误
            //data为读取成功返回的文本内容
        
        if(err){
            res.writeHeader(404,{
                'content-type' : 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
        }else{
            res.writeHeader(200,{
                'content-type' : 'application/x-javascript;charset="utf-8"'
            });

            //将index.js显示在客户端
            res.write(data);
            res.end();
        }

    });
})
*/

server.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req,res));
});

const port = process.env.PORT || 8989;
server.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});