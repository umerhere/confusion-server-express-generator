const express = require('express'), 
    bodyParser = require('body-parser'); 
const dishRouter = express.Router();
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');
const cors = require('./cors');

dishRouter.use(bodyParser.json());

/* We are grouping all the end points for the route /dishes defined in index.js */

// GET REQUEST is public, while for put, delete and post, we need to authenticate the user

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        Dishes.create(req.body)
        .then((dish) => {
            console.log('Dish Created ', dish);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        Dishes.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));  
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
});
dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') //dishes will now have author from user document now
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'+ req.params.dishId);
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        Dishes.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
});
dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') //dishes will now have author from user document now
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            //passport.authenticate('local') will give us req.user upon success
            // We say that the author is currently logged in user
            // Now author is automatically set by server in the body, instead of client setting it
            req.body.author = req.user._id;
            dish.comments.push(req.body); //.push is deprecated by mongoose, I'm using usePushEach flag in dishSchema to make it work
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                    //.populate('comments.author')   //uncomment this line to see the author details in response, but this will be costly
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);                
                    })
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                for (var i = (dish.comments.length -1); i >= 0; i--) {
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));  
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }      
});
dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') //dishes will now have author from user document now
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (JSON.stringify(dish.comments.id(req.params.commentId).author) === JSON.stringify(req.user._id)) {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;                
                }
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);                
                        })
                }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        } else {
            err = new Error('Only author of this comment can perform this operation ');
            err.status = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,     (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (JSON.stringify(dish.comments.id(req.params.commentId).author) === JSON.stringify(req.user._id)) { //dish.comments.id(req.params.commentId).author & req.user._id were of object types
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);                
                        })
                }, (err) => next(err));
            }
            else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);            
            }
        } else {
            err = new Error('Only author of this comment can perform this operation ');
            err.status = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter