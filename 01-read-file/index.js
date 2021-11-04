const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
let stream = fs.createReadStream(file,'utf8');

stream.on('data', function(data)  {
    console.log(data)
});