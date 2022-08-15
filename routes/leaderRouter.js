const express = require('express'), 
    bodyParser = require('body-parser'); 
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
/* We are grouping all the end points for the route /leaderes defined in index.js */
leaderRouter.route('/:leaderId?')
    .all((req, res, next) => { //this will be invoked for all requests from /leaderes endpoint (no matter if its GET, POST, PUT, DELETE. All requests from /leaderes will be handled here)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); //will pass the req res params for /leaderes endpoint to next method, which is in our case is app.get for /leaderes
        })

    .get((req, res, next) => {
            if (req.params.leaderId) {
                res.end('Will send you back details of the leader: ' + req.params.leaderId);
            } else {
                res.end('Will send you back all the leaderes soon');
            }
        })

    .post((req, res, next) => {
            if (req.params.leaderId) {
                res.statusCode = 403;
                res.end('POST method is not supported on /leaderes/'+ req.params.leaderId);
            } else {
                res.end('Will add the leaderes: ' + req.body.name + ' with details ' + req.body.description);
            }
        })

    .put((req, res, next) => {
            if (req.params.leaderId) {
                res.write('Updating the leader: ' + req.params.leaderId + '\n');
                res.end('will update the leader: ' + req.body.name + ' with details ' + req.body.description);
            } else {
                res.statusCode = 403;
                res.end('PUT method is not supported on /leaderes');
            }
        })

    .delete((req, res, next) => {
        if (req.params.leaderId) {
            res.end('Deleting leader: ' + req.params.leaderId);

        } else {
            res.end('Will delete all the leaderes');
        }
        });

module.exports = leaderRouter