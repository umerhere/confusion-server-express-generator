const express = require('express');
const cors = require('cors');

const app = express();

//all origins that our server is willing to access
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin')) !== -1) { //if incoming req header contains origin field, then check if that origin exists in our whitelist
        //since the request header origin is in our whitelist, we will allow it to accepted and access allow origin will be sent back from server to client
        corsOptions = {origin: true};  
    } else {
        //access allow origin will not be sent back
        corsOptions = {origin: false};
    }
    callback(null, corsOptions); //error, options
};

exports.cors = cors(); //no option given means this will reply back with access control allow origin with a wild card * (Ok for get and POST operations)
exports.corsWithOptions = cors(corsOptionsDelegate); //will use when we need to apply certain rules to cors