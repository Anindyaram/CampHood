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
        const price = Math.floor(Math.random() *20)+10;
        const c = new Campground({
            author:'64232352547912c6ec23bfa0',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            image:`https://source.unsplash.com/collection/483251/1600x900`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facere minima, quaerat voluptates beatae quo sapiente, repellendus porro est harum, veniam esse ipsam recusandae doloribus sed deleniti corrupti vitae nisi!',
            price
        })
        await c.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close(); 
});
