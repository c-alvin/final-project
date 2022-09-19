require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const fetch = require('node-fetch');
const pg = require('pg');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);
app.use(express.json());

app.get('/api/details', (req, res, next) => {
  const search = req.query.gameId;

  const sql = `
  select "content" , "ratingValue", "createdAt"
    from "reviews"
    where "gameId" = $1
  `;

  const sqlAverageRatings = `
  select avg("ratingValue")
    from "reviews"
    where "gameId" = $1
    group by "gameId" = $1
  `;

  const paramsRatings = [search];
  const params = [search];

  const ratingsPromise = db.query(sqlAverageRatings, paramsRatings)
    .then(result => {
      return result.rows;
    });

  const commentsPromise = db.query(sql, params)
    .then(result => {
      return result.rows;
    });

  const detailsPromise = fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      Authorization: process.env.API_TOKEN
    },
    body: `fields name, first_release_date, total_rating, storyline,genres.*, rating, summary, age_ratings.*, aggregated_rating, screenshots.*, tags, cover.*, videos.*; where id = ${search};`
  })
    .then(res => res.json());

  Promise.all([detailsPromise, commentsPromise, ratingsPromise]).then(bothResults => {
    res.status(200).json(bothResults);
  })
    .catch(err => next(err));
});

app.post('/api/details/comment', (req, res, next) => {
  const { comment, gameId, rating } = req.body;
  const userId = 1;
  const sql = `
    insert into "reviews" ("userId", "gameId", "content", "ratingValue")
    values ($1, $2, $3, $4)
    returning "content", "ratingValue", "createdAt"
  `;

  const params = [userId, gameId, comment, rating];

  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows);
    })
    .catch(err => next(err))
  ;

});

app.get('/api/search', (req, res, next) => {
  const search = req.query.term;
  fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      Authorization: process.env.API_TOKEN
    },
    body: `fields cover.*, storyline, age_ratings.*,first_release_date, release_dates.*, screenshots.*, name, platforms.*; search: "${search}";`
  })
    .then(res => res.json())
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
