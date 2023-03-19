const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const reviews = require('./routes/reviews')
const campgrounds = require('./routes/campgrounds')
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
app.use(express.static(path.join(__dirname, 'public')))

//campground and review Router
app.use('/campgrounds' , campgrounds);
app.use('/campgrounds/:id/reviews' , reviews);

app.get('/',(req ,res)=>{
    res.render('home')
})

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

