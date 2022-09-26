const router = require('express').Router();
const path = require('path');

router.get('/notes', (req, res) => {
    //console.log('GET /notes request recieved');
    //send notes.html file
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

//catch all route for all other requests
router.get('*', (req, res) => {
    //console.log('GET * request recieved');
    //send index.html pages
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;