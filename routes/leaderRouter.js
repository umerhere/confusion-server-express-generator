const express = require('express'), 
    bodyParser = require('body-parser'); 
const leaderRouter = express.Router();
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

leaderRouter.use(bodyParser.json());
/* We are grouping all the end points for the route /leaders defined in index.js */
leaderRouter.route('/:leaderId?')
    .get((req, res, next) => {
        if (req.params.leaderId) {
            Leaders.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            if (req.params.leaderId) {
                res.statusCode = 403;
                res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
            } else {
                Leaders.create(req.body)
                .then((leader) => {
                    console.log('leader Created ', leader);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        } else {
            err = new Error('Only Admin users can perform this operation');
            err.status = 403;
            return next(err);
        }
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            if (req.params.leaderId) {
                Leaders.findByIdAndUpdate(req.params.leaderId, {
                    $set: req.body
                }, { new: true })
                .then((leader) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                }, (err) => next(err))
                .catch((err) => next(err));
            } else {
                res.statusCode = 403;
                res.end('PUT method is not supported on /leaders');
            }
        } else {
            err = new Error('Only Admin users can perform this operation');
            err.status = 403;
            return next(err);
        }
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            if (req.params.leaderId) {
                Leaders.findByIdAndRemove(req.params.leaderId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
            } else {
                Leaders.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));    
            }
        } else {
            err = new Error('Only Admin users can perform this operation');
            err.status = 403;
            return next(err);
        }
    });

module.exports = leaderRouter