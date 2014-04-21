var fs = require('fs');

module.exports = function(pagerun){
    var self = this;
    var bOpenUrl = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        var domtimeClientContent = fs.readFileSync(__dirname+'/domtime-client.js');
        proxy.addFilter(function(httpData, next, end){
            if(bOpenUrl === true){
                var responseContent = httpData.responseContent;
                if(httpData.responseCode === 200 &&
                    httpData.responseType === 'html' &&
                    responseContent !== undefined){
                    httpData.responseContent = responseContent.replace(/<\/title>/i, '$&<script type="text/javascript" src="http://pagerun/domtime.js" charset="utf-8"></script>');
                }
                else if(httpData.type === 'request' && httpData.hostname === 'pagerun'){
                    switch(httpData.path){
                        case '/domtime.js':
                            httpData.responseCode = '200';
                            httpData.responseHeaders = {
                                'Content-Type': 'application/javascript'
                            };
                            httpData.responseData = domtimeClientContent;
                            break;
                    }
                    if(httpData.responseCode){
                        return end();
                    }
                }
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
};