const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema ,reviewSchema} = require('./schemas.js');
const Review = require('./models/review')

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


app.get('/',(req ,res)=>{
    res.render('home')
})

app.get('/makecampground',catchAsync(async (req ,res)=>{
    const camp = new Campground({title:'My Backyard' ,description:'This is a campground' ,price:'20'})
    await camp.save();
    res.send(camp)
}));

app.get('/campgrounds' ,catchAsync(async(req ,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
}))
//Adding new campground
app.get('/campgrounds/new',catchAsync(async (req,res)=>{
    res.render('campgrounds/new');
}))
app.post('/campgrounds' , validateCampground ,catchAsync(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);

        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))

//showing the camp details
app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.findById(req.params.id).populate('reviews');
    console.log(campgrounds);
    res.render('campgrounds/show' , {campgrounds});
}))
//editing
app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit' ,{campground});
}))

app.put('/campgrounds/:id',validateCampground , catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})) 

//Creating review system
app.post('/campgrounds/:id/reviews' ,validateReview, catchAsync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
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

