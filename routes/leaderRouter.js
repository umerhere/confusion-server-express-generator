const express = require('express'), 
    bodyParser = require('body-parser'); 
const leaderRouter = express.Router();
const Leaders = require('../models/leaders');

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

    .post((req, res, next) => {
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
    })

    .put((req, res, next) => {
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
    })

    .delete((req, res, next) => {
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
    });

module.exports = leaderRouter