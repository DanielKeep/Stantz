
var worker = new Worker('stantz/worker.js');
worker.response = null;

worker.onmessage = function(event)
{
    console.info('response: %o', event);
    worker.response = event.data;
};

worker.onerror = function(event)
{
    console.info('error: %o', event.data);
};

function post()
{
    worker.postMessage(arguments);
}

