const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');

const mongoose = require('mongoose');
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
app.post('/campgrounds',catchAsync(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    // using JOI for validation of data 
    const campgroundSchema = Joi.object({
        campground:Joi.object({
            title:Joi.string().required(),
            price:Joi.number().required().min(0),
            image:Joi.string().required(),
            location:Joi.string().required(),
            description:Joi.string().required()
        }).required()
    })    
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    console.log(result);

        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))

//showing the camp details
app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/show' , {campgrounds});
}))
//editing
app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit' ,{campground});
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
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

