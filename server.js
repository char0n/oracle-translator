'use strict';
require('./server.babel');
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
try {
  fs.accessSync(envPath, fs.F_OK);
  require('dotenv').config({path: envPath});
} catch (e) { /*It isn't accessible*/ }

const http = require('http');
const express = require('express');
const webpack = require('webpack');
const app = express();
const open = require('open');
// Mount webpack middleware.
let webpackConfig;
let production = process.env.NODE_ENV === "production";
let allowLint = true;

process.argv.forEach((val) => {
  let vars = val.split('=');
  if (vars[0] === 'webpackConfig') {
    webpackConfig = require('./' + vars[1]);
  }
});

if (!production) {
  if (!allowLint) {
    delete webpackConfig.module.preLoaders;
  }

  let compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    quiet: false,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

const server = new http.Server(app);
server.listen('3000', (err) => {
  if (err) {
    console.error(err);
  }
  console.info('Open http://%s:%s in a browser to view the app.', 'localhost', '3000');
});

let srcFolder = (production) ? 'dist' : 'app';
app.get('/', (req, res) => {
  res.status(200).send(fs.readFileSync('./' + srcFolder + '/index.html', {
    encoding: 'utf-8'
  }));
});
app.use(express.static(srcFolder));

if (!process.env.DISABLE_OPEN) {
  open('http://localhost:3000');
}
