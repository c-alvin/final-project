# mist

A full stack JavaScript Application for gamers who want to rate and review their favorite games.

## Why I Built This

As a life-long gamer, I've always gravitated to hanging out with my friends on various gaming platforms.  I grew up
on the internet through these communities that existed on Ventrilo, Teamspeak, Steam, and Discord to name a few.
I wanted to build an application where gamer's could come together, rate and review their favorite games,
and build a community.

## Technologies Used

- React.js
- webpack
- Bootstrap 5
- Node.js
- Postgresql
- HTML5
- CSS3
- Dokku
- JavaScript

## Databases

- IGDB API [Docs](https://api-docs.igdb.com/#expander)
## Live Demo

Try the application live at [mist](https://mist.choalvin.com/)

## Features

- User can search for games.
- User can view details of a game.
- User can rate a game.
- User can review a game.
- User can sign up.
- User can log in.
- User can log out.
- User can play videos of a game.


## Preview

Search and view details

![Details](/server/public/images/search%3Aview.gif)

Leave a review

![Details](/server/public/images/makeareview.gif)

## Stretch Features
- User can edit their profile.
- User can sort searched games.
- User can delete a review.

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- Postgresql 14.3

### Getting Started

1. Clone the repository.

    ```shell
    git clone git@github.com:c-alvin/mist.git
    cd mist
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. create a `.env` file from .env.example template.

    ```shell
    cp .env.example .env
    ```

1. Update the `TOKEN_SECRET` with any value, Acquire/Update `CLIENT_SECRET`, `CLIENT_ID`, `API_TOKEN` by following the instructions at [igdb](https://api-docs.igdb.com/#account-creation)

1. Start PostgreSQL and create the database

    ```shell
    sudo service postgresql start
    createdb nameOfDatabase
    ```

1. Update the DATABASE_URL to point to your PostgreSQL database.

1. Initialize the database.

    ```shell
    npm run db:import
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
