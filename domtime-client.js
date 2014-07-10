pagerun.newTask('domtime', function(){
    var task = this;
    var doc = document;
    var win = window;

    var startTime, readyTime;

    startTime = (new Date()).getTime();

    DOMContentLoaded = function() {
        if (doc.addEventListener) {
            doc.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            readyTriggered();
        } else if (doc.readyState === "complete") {
            doc.detachEvent("onreadystatechange", DOMContentLoaded);
            readyTriggered();
        }
    }
    var isReady = false;

    function readyTriggered() {
        if (isReady === false) {
            isReady = true;
            readyTime = (new Date()).getTime() - startTime;
        }
    }

    function loadTriggered() {
        var headerTime = domtimeHeaderEndTime - startTime;
        var loadTime = (new Date()).getTime() - startTime;
        task.info({
            'url': location.href,
            'header': headerTime,
            'ready': readyTime,
            'load': loadTime
        });
        task.end();
    }
    if (doc.addEventListener) {
        doc.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
        win.addEventListener("load", readyTriggered, false);
        win.addEventListener("load", loadTriggered, false);
    } else {
        doc.attachEvent("onreadystatechange", DOMContentLoaded);
        win.attachEvent("onload", readyTriggered);
        win.attachEvent("onload", loadTriggered);
        var top = false;
        try {
            top = win.frameElement == null && doc.documentElement;
        } catch(e) {}
        if ( top && top.doScroll ) {
            (function doScrollCheck() {
                if ( !isReady ) {
                    try {
                        top.doScroll("left");
                    } catch(e) {
                        return setTimeout( doScrollCheck, 50 );
                    }
                    DOMContentLoaded();
                }
            })();
        }
    }
});