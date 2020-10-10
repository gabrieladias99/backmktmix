import 'dotenv/config'
import cors from 'cors';

import express from 'express';
import path from 'path';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes()
  }

  middlewares() {
    this.server.use(cors());
    this.server.options('*', cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp'))
    );
  }

  routes(){
    this.server.use(routes);
  }
}

export default new App().server;
