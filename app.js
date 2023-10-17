let SERVER_NAME = 'clinic-api'
let PORT = 3000;
let HOST = '127.0.0.1';

const mongoose = require ("mongoose");
let uristring = 'mongodb://127.0.0.1:27017/CLINIC';

// Connect to MongoDB
mongoose.connect(uristring, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("**** Connected to db: " + uristring)
});
