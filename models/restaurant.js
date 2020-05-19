const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurantName : String,
    tag : String,
    webLink : { type: String, unique: true },
    address : String,
    rating : String,
    swiggy : String,
    zomato : String,
    foodpanda : String,
    peopleRated: String,
    items : [
        {
            itemName : String,
            description : String,
            sgyPrice : Number,
            ztoPrice : Number,
            fpPrice : Number
        }
    ]
});

module.exports = mongoose.model("Restaurant", restaurantSchema);