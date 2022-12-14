const express = require('express'), 
    bodyParser = require('body-parser'); 
const promoRouter = express.Router();
const Promos = require('../models/promos');
const authenticate = require('../authenticate');
const cors = require('./cors');

promoRouter.use(bodyParser.json());

/* We are grouping all the end points for the route /promos defined in index.js */
promoRouter.route('/:promoId?')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        if (req.params.promoId) {
            Promos.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            Promos.find({})
            .then((promos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            if (req.params.promoId) {
                res.statusCode = 403;
                res.end('POST operation not supported on /promos/'+ req.params.promoId);
            } else {
                Promos.create(req.body)
                .then((promo) => {
                    console.log('promo Created ', promo);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        } else {
            err = new Error('Only Admin users can perform this operation');
            err.status = 403;
            return next(err);
        }
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            if (req.params.promoId) {
                Promos.findByIdAndUpdate(req.params.promoId, {
                    $set: req.body
                }, { new: true })
                .then((promo) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
                }, (err) => next(err))
                .catch((err) => next(err));
            } else {
                res.statusCode = 403;
                res.end('PUT method is not supported on /promos');
            }
        } else {
            err = new Error('Only Admin users can perform this operation');
            err.status = 403;
            return next(err);
        }
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin(req.user)) {
            if (req.params.promoId) {
                Promos.findByIdAndRemove(req.params.promoId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
            } else {
                Promos.remove({})
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

module.exports = promoRouter