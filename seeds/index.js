const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./Incities');
const {places ,descriptors} = require('./seedHelpers')

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection Error:"));
db.once("open" ,()=>{
    console.log('Database Connected')
});

//Creating a name for campground by using seedHelper
const sample = array =>array[Math.floor(Math.random() * array.length)];

const seedDb = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 406);
        const c = new Campground({
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`
        })
        await c.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close(); 
});
