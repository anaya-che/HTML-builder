const fs = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

const getFiles = async () => {
    const files = await fs.readdir(folder);
    for (const file of files) {
        let fileExt = path.extname(file);
        let fileName = path.basename(file, fileExt);
        let fileParse = await fs.stat(path.resolve(folder, file))
        if(fileParse.isFile()) console.log(`${fileName} - ${fileExt} - ${fileParse.size/1024}kb`);
    }
}

getFiles();