const express = require('express'), 
    bodyParser = require('body-parser'); 
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
/* We are grouping all the end points for the route /dishes defined in index.js */
dishRouter.route('/:dishId?')
    .all((req, res, next) => { //this will be invoked for all requests from /dishes endpoint (no matter if its GET, POST, PUT, DELETE. All requests from /dishes will be handled here)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); //will pass the req res params for /dishes endpoint to next method, which is in our case is app.get for /dishes
        })

    .get((req, res, next) => {
            if (req.params.dishId) {
                res.end('Will send you back details of the dish: ' + req.params.dishId);
            } else {
                res.end('Will send you back all the dishes soon');
            }
        })

    .post((req, res, next) => {
            if (req.params.dishId) {
                res.statusCode = 403;
                res.end('POST method is not supported on /dishes/'+ req.params.dishId);
            } else {
                res.end('Will add the dishes: ' + req.body.name + ' with details ' + req.body.description);
            }
        })

    .put((req, res, next) => {
            if (req.params.dishId) {
                res.write('Updating the dish: ' + req.params.dishId + '\n');
                res.end('will update the dish: ' + req.body.name + ' with details ' + req.body.description);
            } else {
                res.statusCode = 403;
                res.end('PUT method is not supported on /dishes');
            }
        })

    .delete((req, res, next) => {
        if (req.params.dishId) {
            res.end('Deleting dish: ' + req.params.dishId);

        } else {
            res.end('Will delete all the dishes');
        }
        });

module.exports = dishRouter