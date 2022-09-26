const router = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const db = path.join(__dirname, '../db/db.json')
router.get('/notes', async (req, res) => {
    console.log('GET api/notes request recieved');
    const dbContents = await fs.readFile(db, 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes){
        res.status(200).json(notes);
    }
    else{
        res.status(404).send('Notes not found');
    }
});

router.post('/notes', async (req, res) => {
    console.log('POST api/notes request recieved');
    const { title, text } = req.body;
    if(!title || !text){
        res.status(400).send('Invalid entry');
    }
    const dbContents = await fs.readFile(db, 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes || notes == []){
        let ids = notes.map(item => item.id);
        let newId = 0;
        while (ids.includes(newId)){
            newId++;
        }
        const newNote = {
            title: title,
            text: text,
            id: newId
        }
        notes.push(newNote);
        await fs.writeFile(db, JSON.stringify(notes));
        res.status(200).send('Note saved to the database.');
    }
    else{
        res.status(500).send('Unable to read database!');
    }
});

router.delete('/notes/:id', async (req, res) => {
    console.log('Delete api/notes request recieved');
    const removeId = req.params.id;
    const dbContents = await fs.readFile(db, 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes || notes == []){
        let removeIndex = notes.findIndex(item => item.id == removeId);
        if (removeIndex >= 0){
            notes.splice(removeIndex, 1);
            await fs.writeFile(db, JSON.stringify(notes));
            res.status(200).send('Note removed from database.');
        }
        else {
            res.status(404).send('Note not found!');
        }
    }
    else{
        res.status(500).send('Unable to read database!');
    }
});

module.exports = router;