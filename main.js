'use strict'
const myServer = require('./server');

(() =>{

    const server = myServer.createServer();
    server.listen(9991, () => {

        console.log('SNS-API server has been  started ,listening at %s', server.url);
    });
})();