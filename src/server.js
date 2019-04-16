const path = require('path');
const fs = require('fs');
const express = require('express');
const server = express();
const proxy = require('http-proxy-middleware');
const  { createBundleRenderer } = require('vue-server-renderer');
const isProd = process.env.NODE_ENV === 'production';

let renderer;
let readyPromise;

if(isProd){
    // generate json bundle  use Fs.readFileSync is error
    const template = readFile(path.resolve(__dirname,'./static/index.template.server.html'));
    const clientManifest = requireFile('../build/vue-ssr-client-manifest.json');
    const bundle = requireFile('../build/vue-ssr-server-bundle.json');

    renderer = createRenderer(bundle,{
        template,
        clientManifest
    });
}else{
    readyPromise = require('./config/setup-dev-server')(
        server,
        path.resolve(__dirname,'./static/index.template.server.html'),
        (bundle,options) =>{
            renderer = createRenderer(bundle,options);
        }
    )
}

// set proxy   http://localhost:8888/api/index.json   ===>  http://10.0.1.15/~xiaoxx/api/index.json
server.use('/openplatform', proxy({
    target: 'http://wx.500.com',
    changeOrigin: true
}));

//express 读取静态文件
server.use('', express.static(path.join(__dirname, '../build')));

server.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req,res));
});

const port = process.env.PORT || 8989;
server.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});

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
            res.status(500).send('500 | Internal Server Error');
            console.error(`error during render : ${req.url}`);
        }
    }

    if(req.url.indexOf('local') > -1){   
        res.sendFile(path.join(__dirname, '../build/index.html'));
        return true;
    }
    
    if(renderer){
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
        return true;
    }
    handleError({code:500});
}

function createRenderer(bundle,options){
    if(Object.keys(bundle).length>0){
        return createBundleRenderer(bundle,Object.assign(options,{
            runInNewContext: false,
        }))
    }
    return null;
}

function readFile(path){
    try{
        return fs.readFileSync(path,'utf8');
    }catch(e){}
}

function requireFile(path){
    try{
        return require(path);
    }catch(e){
        return {}
    }
}