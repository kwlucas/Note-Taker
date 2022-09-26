const router = require('express').Router();
const fs = require('fs').promises;

router.get('/notes', async (req, res) => {
    console.log('GET api/notes request recieved');
    const dbContents = await fs.readFile('../db/db.json', 'utf-8');
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
    const dbContents = await fs.readFile('../db/db.json', 'utf-8');
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
        await fs.writeFile('../db/db.json', JSON.stringify(notes));
        res.status(200).send('Note saved to the database.');
    }
    else{
        res.status(500).send('Unable to read database!');
    }
});

module.exports = router;