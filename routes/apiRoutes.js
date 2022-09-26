const router = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const db = path.join(__dirname, '../db/db.json')
router.get('/notes', async (req, res) => {
    //console.log('GET api/notes request recieved');
    //read the file contents and store in "dbContents"
    const dbContents = await fs.readFile(db, 'utf-8');
    //convert it from JSON string to a javascript array
    let notes = JSON.parse(dbContents);
    if (notes){
        //Return the contents if found
        res.status(200).json(notes);
    }
    else{
        //send a 404 error if there are no notes
        res.status(404).send('Notes not found');
    }
});

router.post('/notes', async (req, res) => {
    //console.log('POST api/notes request recieved');
    const { title, text } = req.body;
    if(!title || !text){
        //If the title and text of a new note is empty dont save and send error
        res.status(400).send('Invalid entry');
    }
    //Get the contents of the database file and convert it to a javascript array
    const dbContents = await fs.readFile(db, 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes || notes == []){
        //If an array is found create an array of all the note ids within it
        let ids = notes.map(item => item.id);
        let newId = 1;
        //Starting from one keep adding until you find a number that doesn't already exit in array
        while (ids.includes(newId)){
            newId++;
        }
        //create new note object with title, text and id
        const newNote = {
            title: title,
            text: text,
            id: newId
        }
        //Add the note to the list
        notes.push(newNote);
        //Convert the note array to a JSON string and save it to the file
        await fs.writeFile(db, JSON.stringify(notes));
        res.status(200).send('Note saved to the database.');
    }
    else{
        res.status(500).send('Unable to read database!');
    }
});

router.delete('/notes/:id', async (req, res) => {
    //console.log('Delete api/notes request recieved');
    //Get the id to be removed from the request
    const removeId = req.params.id;
    //Get the contents of the database file and convert it to a javascript array
    const dbContents = await fs.readFile(db, 'utf-8');
    let notes = JSON.parse(dbContents);
    if (notes || notes == []){
        //Get the index of the note item with an id that matches the id to remove
        let removeIndex = notes.findIndex(item => item.id == removeId);
        if (removeIndex >= 1){
            //Remove the note at the located index from the note array
            notes.splice(removeIndex, 1);
            //Convert the note array to a JSON string and save it to the file
            await fs.writeFile(db, JSON.stringify(notes));
            res.status(200).send('Note removed from database.');
        }
        else {
            //If no note with the specified id is found send 404 error
            res.status(404).send('Note not found!');
        }
    }
    else{
        res.status(500).send('Unable to read database!');
    }
});

module.exports = router;