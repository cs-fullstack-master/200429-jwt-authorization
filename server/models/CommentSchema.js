let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Define the schema for comments in the database/collection
let CommentSchema = new Schema (
    {
        commentUser: {type: String, required: true},
        commentTitle: {type: String, required: true},
        commentBody: {type: String, required: true},
        date : {type : Date, default : Date.now} 
    }
)

module.exports = mongoose.model('commentsCW200429', CommentSchema);