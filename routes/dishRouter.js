const express = require('express'), 
    bodyParser = require('body-parser'); 
const dishRouter = express.Router();

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());
/* We are grouping all the end points for the route /dishes defined in index.js */
dishRouter.route('/:dishId?')
    .get((req, res, next) => {
        if (req.params.dishId) {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            Dishes.find({})
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    })

    .post((req, res, next) => {
        if (req.params.dishId) {
            res.statusCode = 403;
            res.end('POST method is not supported on /dishes/'+ req.params.dishId);
        } else {
            Dishes.create(req.body)
                .then((dish) => {
                    console.log('Dish created', dish);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    })

    .put((req, res, next) => {
        if (req.params.dishId) {
            Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, { new: true })
            .then((dish) => {
                console.log('Dish created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            res.statusCode = 403;
            res.end('PUT method is not supported on /dishes');
        }
    })

    .delete((req, res, next) => {
        if (req.params.dishId) {
            Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                console.log('Dishes deleted');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

        } else {
            Dishes.remove({})
                .then((resp) => {
                    console.log('Dishes deleted');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    });

module.exports = dishRouter