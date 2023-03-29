const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn ,isAuthor ,validateCampground} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))    //Added campground.index by using a model
    .post(isLoggedIn, upload.array('image'),validateCampground ,catchAsync(campgrounds.createNewCampground))//creating new campground

router.get('/new', isLoggedIn,catchAsync(campgrounds.renderNewForm))//Adding new campground

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) //showing the camp details
    .put(isLoggedIn ,isAuthor ,upload.array('image'),validateCampground , catchAsync(campgrounds.updateCampground))//Updating campground
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground)) //deleting campground

router.get('/:id/edit' ,isLoggedIn ,isAuthor , catchAsync(campgrounds.renderEditForm))//editing

module.exports = router;