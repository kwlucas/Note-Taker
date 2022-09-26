const express = require('express');
const rootRoutes = require('./routes/rootRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//if request has "/api" sent to apiRoutes
app.use('/api', apiRoutes);
//if request has "/" send to rootRoutes
app.use('/', rootRoutes);


app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));