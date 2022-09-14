require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const fetch = require('node-fetch');

const app = express();

app.use(staticMiddleware);

app.get('/api/search', (req, res, next) => {
  // console.log(req.query.term);
  const search = req.query.term;
  fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      Authorization: process.env.API_TOKEN
    },
    body: `fields cover.*,first_release_date, release_dates.*, screenshots.*, name, platforms.*; search: "${search}"; limit 10; offset 0;`
  })
    .then(res => res.json())
    .then(data => res.status(201).json(data))
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
