import {
  Map,
  VectorTile,
  Layer,
  Image
} from 'mapnik';

import {
  EXAMPLE_DATASOURCE,
  PROJECTION_STRING,
  TILE_SIZE,
  mercator
} from "./constants";


export interface VectorTileOptions {
  x: number;
  y: number;
  z: number;
}

export default function generateVectorTile(opts: VectorTileOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const map = new Map(TILE_SIZE, TILE_SIZE, PROJECTION_STRING);
    map.extent = mercator.bbox(opts.x, opts.y, opts.z, false, '3857');

    const layer = new Layer('mylayer');
    layer.srs = PROJECTION_STRING;
    layer.datasource = EXAMPLE_DATASOURCE;

    map.add_layer(layer);

    const vectorTile = new VectorTile(opts.z, opts.x, opts.y);
    map.render(vectorTile, (err: Error, output: Image) => {
        if (err) return reject(err);
        resolve(output.getData());
    });
  });
}
