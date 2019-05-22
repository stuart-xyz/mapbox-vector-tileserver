import * as express from 'express';
import { Request, Response } from 'express';
import * as zlib from 'zlib';

import generateVectorTile from './generate-vector-tile';
import { VectorTileOptions } from "./generate-vector-tile";


const app = express();

app.get('/:z/:x/:y.pbf', async (req: Request, res: Response) => {

  const opts: VectorTileOptions = {
    x: parseInt(req.params.x, 10),
    y: parseInt(req.params.y, 10),
    z: parseInt(req.params.z, 10)
  };

  const vectorTileBuffer = await generateVectorTile(opts);
  zlib.deflate(vectorTileBuffer, (err: Error | null, data: Buffer) => {
    if (err) return res.status(500).send(err.message);
    res.setHeader('Content-Encoding', 'deflate');
    res.setHeader('Content-Type', 'application/x-protobuf');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(data);
  });
});

app.listen(8080, () => {
  console.log("Listening on port 8080...");
});
