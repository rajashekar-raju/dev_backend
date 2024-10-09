const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/about', (req, res) => {
    res.send('This is the about page.');
})

app.listen(4000,()=>{
    console.log('Server running on port 4000');
})