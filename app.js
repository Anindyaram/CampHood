const express = require('express');
const path = require('path');
const Campground = require('./models/campground')

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
app.set('view engine' ,'ejs');

app.get('/',(req ,res)=>{
    res.render('home')
})

app.get('/makecampground',async (req ,res)=>{
    const camp = new Campground({title:'My Backyard' ,description:'This is a campground' ,price:'20'})
    await camp.save();
    res.send(camp)
})

app.listen(3000,()=>{
    console.log('Connected to port 3000')
})

