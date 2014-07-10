var fs = require('fs');

module.exports = function(pagerun){
    pagerun.injectCode('<script src="//pagerun/domtime.js"></script>', 'top');
    pagerun.injectCodeBefore('<script>var domtimeHeaderEndTime = (new Date()).getTime();</script>', 'header');
    pagerun.injectCodeBefore('<script>var domtimeFooterEndTime = (new Date()).getTime();</script>', 'footer');
    pagerun.addRequestMap('pagerun/domtime.js', {
        'responseCode': '200',
        'responseHeaders': {
            'Content-Type': 'application/javascript'
        },
        'responseData': fs.readFileSync(__dirname+'/domtime-client.js')
    });
};