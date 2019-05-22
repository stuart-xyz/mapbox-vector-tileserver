# Mapbox vector tileserver

Simple example demonstrating how to use [node-mapnik](https://github.com/mapnik/node-mapnik) to generate Mapbox format vector tiles on the fly from a PostGIS data source, using TypeScript.

## Pre-requisites

* [node-mapnik dependencies](https://github.com/mapnik/node-mapnik#depends)
* Postgres database with PostGIS installed, pre-populated with geospatial data

## Setup

Create a file `.env` and add the following:
```
DB_HOST=... // e.g. <mypostgreshost.com>
DB_PORT=...
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
```
(or manually set these as environment variables)

Modify `EXAMPLE_TABLE_QUERY` in `constants.ts` to pull in the data that you require.
The results set must contain a column of type `geometry`.

## Run

1. `npm install`
2. `npm start`
