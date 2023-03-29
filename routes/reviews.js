const express = require('express');
const router = express.Router({ mergeParams:true });//need to be true for accesing id

const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview ,isLoggedIn ,isReviewAuthor}= require('../middleware')

//Creating review system
router.post('/' ,isLoggedIn ,validateReview , catchAsync(reviews.createReview))
//Deleting the review
router.delete('/:reviewId' ,isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;