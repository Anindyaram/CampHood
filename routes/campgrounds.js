const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn ,isAuthor ,validateCampground} = require('../middleware');

//Added campground.index by using a model
router.get('/' ,catchAsync(campgrounds.index))
//Adding new campground
router.get('/new', isLoggedIn,catchAsync(campgrounds.renderNewForm))
//creating new campground
router.post('/' , validateCampground ,catchAsync(campgrounds.createNewCampground))
//showing the camp details
router.get('/:id', catchAsync(campgrounds.showCampground))
//editing
router.get('/:id/edit' ,isLoggedIn ,isAuthor , catchAsync(campgrounds.renderEditForm))
//Updating campground
router.put('/:id', isLoggedIn ,isAuthor ,validateCampground , catchAsync(campgrounds.updateCampground));
//deleting campground
router.delete('/:id' ,isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground)) 

module.exports = router;