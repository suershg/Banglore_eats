const mongoose = require('mongoose');

/* ===========================DATABASE CONNECTION========================================*/

const url = "mongodb://127.0.0.1:27017/restaurants";

mongoose.connect(url, {useNewUrlParser : true,  useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', _ => {
    console.log("database connected:", url)
})

db.on('error', err => {
    console.error("connection error : ", err)
})



exports.db = db