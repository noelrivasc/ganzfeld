let mix = require('laravel-mix');
let productionSourceMaps = true;

mix.browserSync({proxy: {target: 'http://localhost:8000'}, port: 8000});

mix.js('src/ganzfeld.js', 'dist').setPublicPath('dist')
  .sourceMaps(productionSourceMaps, 'source-map');
