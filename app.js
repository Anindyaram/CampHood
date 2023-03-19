const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema ,reviewSchema} = require('./schemas.js');
const Review = require('./models/review')

const campgrounds = require('./routes/campgrounds')

const mongoose = require('mongoose');
const { validate } = require('./models/campground');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection Error:"));
db.once("open" ,()=>{
    console.log('Database Connected')
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);
app.set('view engine' ,'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

//Server side validation with the help of joi 
const validateCampground = (req,res,next)=>{
        const { error } = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        }else{
            next();
        }
        // console.log(result);
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}
//campground Routes
app.use('/campgrounds' , campgrounds);

app.get('/',(req ,res)=>{
    res.render('home')
})


//Creating review system
app.post('/campgrounds/:id/reviews' ,validateReview, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId' , catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

//Error handeling of express
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found' ,404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Something went wrong!';
    res.status(statusCode).render('error' ,{ err });
})


app.listen(3000,()=>{
    console.log('Connected to port 3000')
})

