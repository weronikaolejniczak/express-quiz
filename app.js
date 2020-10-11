const express = require('express');
const path = require('path');
const app = express();

const roundRoute = require('./routes/round');

const port = process.env.PORT || 3000;
const hostname = 'localhost';

app.listen(port, () => {
    console.log(`Server is listening at http://${hostname}:${port}/`)
});

app.use(express.static(
    path.join(__dirname, 'public'),
))

roundRoute(app);
