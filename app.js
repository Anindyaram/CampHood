const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground')
const methodOverride = require('method-override')

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

app.get('/makecampground',async (req ,res)=>{
    const camp = new Campground({title:'My Backyard' ,description:'This is a campground' ,price:'20'})
    await camp.save();
    res.send(camp)
})

app.get('/campgrounds' ,async(req ,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
})
//Adding new campground
app.get('/campgrounds/new',async (req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds',async (req,res,next)=>{
    try{
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }catch(e){
        next(e);
    }
})

//showing the camp details
app.get('/campgrounds/:id',async(req,res)=>{
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/show' , {campgrounds});
})
//editing
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit' ,{campground});
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.use((err,req,res,next)=>{
    res.send("Their's an error!")
})


app.listen(3000,()=>{
    console.log('Connected to port 3000')
})

