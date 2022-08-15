const express = require('express'), 
    bodyParser = require('body-parser'); 
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
/* We are grouping all the end points for the route /promoes defined in index.js */
promoRouter.route('/:promoId?')
    .all((req, res, next) => { //this will be invoked for all requests from /promoes endpoint (no matter if its GET, POST, PUT, DELETE. All requests from /promoes will be handled here)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); //will pass the req res params for /promoes endpoint to next method, which is in our case is app.get for /promoes
        })

    .get((req, res, next) => {
            if (req.params.promoId) {
                res.end('Will send you back details of the promo: ' + req.params.promoId);
            } else {
                res.end('Will send you back all the promoes soon');
            }
        })

    .post((req, res, next) => {
            if (req.params.promoId) {
                res.statusCode = 403;
                res.end('POST method is not supported on /promoes/'+ req.params.promoId);
            } else {
                res.end('Will add the promoes: ' + req.body.name + ' with details ' + req.body.description);
            }
        })

    .put((req, res, next) => {
            if (req.params.promoId) {
                res.write('Updating the promo: ' + req.params.promoId + '\n');
                res.end('will update the promo: ' + req.body.name + ' with details ' + req.body.description);
            } else {
                res.statusCode = 403;
                res.end('PUT method is not supported on /promoes');
            }
        })

    .delete((req, res, next) => {
        if (req.params.promoId) {
            res.end('Deleting promo: ' + req.params.promoId);

        } else {
            res.end('Will delete all the promoes');
        }
        });

module.exports = promoRouter