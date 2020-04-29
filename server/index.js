// POINT OF ENTRY

let express = require("express");
let app = express();

// CONNECTING TO A MONGO DB DATABASE
// reference the mongoose module 
let mongoose = require('mongoose');
// connect to database
let mongoDB = require('./config/keys').mongoURI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// connection error message
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Set a root mount point for api endpoints
let api = require("./routes/api");
app.use('/api', api);

// START UP SERVER LISTENER
let port = require('./config/keys').listenPort;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});