const express = require('express'), 
    bodyParser = require('body-parser'),
    authenticate = require('../authenticate'),
    multer = require('multer'); //module for uploading images
const cors = require('./cors');

//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage(
    {
        destination: (req, res, cb) => {
            cb(null, 'public/images'); //error, destination folder
        },
        filename: (req, file, cb) => {
            //error, file object that's just uploaded. // file object has various properties in it
            cb(null, file.originalname); // originalname => if orginalName not given, multer will save the file with random unique string as its name
        }

    }
);

var imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {// \.(jpg|jpeg|png|gif) is Regex for checking file extension
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());
uploadRouter.route('/', cors.cors, )
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})

.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('imageFile'), (req, res, next) => {
    if (authenticate.verifyAdmin(req.user)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    } else {
        err = new Error('Only Admin users can perform this operation');
        err.status = 403;
        return next(err);
    }
        
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})

module.exports = uploadRouter;
