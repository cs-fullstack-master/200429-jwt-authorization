// import express
let express = require('express');
// create router
let router = express.Router();
// json middleware
router.use(express.json());

router.get('/', (req,res) => {
    res.send(`<h1>Success!</h1>`);
});

module.exports = router;