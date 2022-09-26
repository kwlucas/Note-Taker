const router = require('express').Router();
const fs = require('fs').promises;

router.get('/api/notes', async (req, res) => {
    const dbContents = await fs.readFile('../db/db.json', 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes){
        res.send(notes);
    }
    else{
        res.status(404).send('Notes not found');
    }
});

module.exports = router;