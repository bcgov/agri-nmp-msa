const express = require('express');

const app = express();
const path = require('path');

const port = 5001;

app.use(express.static('public/build'));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'public/build/generated_index.html'));
});

app.listen(port, () => {
  console.log('service ready');
});
