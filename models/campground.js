const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampGrounds = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

// Deleting all reviews of the campground as it is deleted
CampGrounds.post('findOneAndDelete' , async function(doc){
    if(doc){
        await Review.remove({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground' , CampGrounds)