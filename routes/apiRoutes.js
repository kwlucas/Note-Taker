const router = require('express').Router();
const fs = require('fs').promises;

router.get('/notes', async (req, res) => {
    const dbContents = await fs.readFile('../db/db.json', 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes){
        res.status(200).send(notes);
    }
    else{
        res.status(404).send('Notes not found');
    }
});

router.post('/notes', async (req, res) => {
    const newNote = req.body;
    if(!newNote.title || !newNote.text){
        res.status(400).send('Invalid entry');
    }
    const dbContents = await fs.readFile('../db/db.json', 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes){
        notes.push(newNote);
        await fs.writeFile('../db/db.json', JSON.stringify(notes));
        res.status(200).send('Note saved to the database.');
    }
    else{
        res.status(500).send('Unable to read database!');
    }
});

module.exports = router;