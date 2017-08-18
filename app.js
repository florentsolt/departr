'use strict';

var connect = require('connect'),
    path = require('path'),
    fs = require('fs'),
    app = connect(),
    backgrounds = [];

fs.readdirSync(path.join(__dirname, 'backgrounds')).forEach(filename => {
  if (path.extname(filename) === '.jpg') {
    backgrounds.push(filename);
  }    
})

app.use("/background.jpg", (req, res, next) => {
  var filename = path.join(__dirname, 'backgrounds', backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  var stat = fs.statSync(filename);

  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    'Content-Length': stat.size
  });

  fs.createReadStream(filename).pipe(res);
});

app.use('/', (req, res, next) => {
  res.writeHead(301, {Location: "https://chrome.google.com/webstore/detail/departr/beekbnifjppmocjpomjikcplglmfgehe"});
  res.end()  
});

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
