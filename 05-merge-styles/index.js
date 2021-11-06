const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const stylesSrc = path.join(__dirname, 'styles');
const projectSrc = path.join(__dirname, 'project-dist', 'bundle.css');
let writeableStream = fs.createWriteStream(projectSrc);

const copyStyle = (stream) => {
    stream.on('data', (data) => {
        writeableStream.write(data);
    });
}

const mergeStyles = async () => {
    const files = await readdir(stylesSrc);
    for (const file of files) {
        let fileExt = path.extname(file);
        
        if (fileExt === '.css') {
            let newPath = path.join(__dirname, 'styles', file);
            let stream = fs.createReadStream(newPath,'utf8');
            copyStyle(stream);
        }
    }
}

mergeStyles();