let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the UserSchema for users of system
let UserSchema = new Schema (
    {
        name: {type: String, required: true},
        password : {required : true, type : String},
        email : {required : true, type : String},
        date : {type : Date, default : Date.now}        
    }
)


module.exports = mongoose.model('usersCW200429', UserSchema);