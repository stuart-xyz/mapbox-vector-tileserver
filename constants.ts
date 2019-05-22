import {
  Datasource,
  Logger,
  register_default_fonts,
  register_default_input_plugins
} from "mapnik";

import * as SphericalMercator from "@mapbox/sphericalmercator";

register_default_fonts();
register_default_input_plugins();
Logger.setSeverity(Logger.DEBUG);

require('dotenv').config();

export const TILE_SIZE = 256;
export const PROJECTION_STRING = '+init=epsg:3857';
export const mercator = new SphericalMercator({
  size: TILE_SIZE
});

const SRID = 3857;
const EXAMPLE_TABLE_QUERY = '(select * from mytable) AS data';

export const EXAMPLE_DATASOURCE = new Datasource({
  type: 'postgis',
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  dbname: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  srid: SRID,
  geometry_field: 'geom',
  estimate_extent: false,
  table: EXAMPLE_TABLE_QUERY
});
