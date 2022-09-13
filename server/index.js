require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const fetch = require('node-fetch');

const app = express();

app.use(staticMiddleware);

app.get('/api/search', (req, res) => {
  // console.log(req.query.term);
  const search = req.query.term;
  fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      Authorization: 'Bearer wb9acv3ulq4tsa3zc27zkli61edii0'
    },
    body: `fields cover.*, screenshots.*, name, platforms.*; search: "${search}";`
  })
    .then(res => res.json())
    .then(data => res.status(201).json(data))
    .catch(err => console.error(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
