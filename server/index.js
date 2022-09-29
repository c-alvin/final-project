require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const fetch = require('node-fetch');
const pg = require('pg');
const ClientError = require('./client-error');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth-middleware');

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
  select "content" , "ratingValue", "createdAt", "users"."username"
    from "reviews"
    join "users" using ("userId")
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

  Promise.all([detailsPromise, commentsPromise, ratingsPromise]).then(threeResults => {
    res.status(200).json(threeResults);
  })
    .catch(err => next(err));
});

app.post('/api/details/comment', authMiddleware, (req, res, next) => {
  const { comment, gameId, rating } = req.body;
  const { userId } = req.user;
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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields.');
  }

  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username"
      `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.get('/api/search', (req, res, next) => {
  const search = req.query.term;
  fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.CLIENT_ID,
      Authorization: process.env.API_TOKEN
    },
    body: `fields cover.*, storyline,  age_ratings.*,first_release_date, release_dates.*, screenshots.*, name, platforms.*; search: "${search}"; limit 50;`
  })
    .then(res => res.json())
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
