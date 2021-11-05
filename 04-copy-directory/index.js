const fs = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

const copyDir = async (folderName, folderCopyName) => {
    await fs.rm(folderCopyName, { recursive: true, force: true });
    await fs.mkdir(folderCopyName, { recursive: true });
    const files = await fs.readdir(folderName);
    for (const file of files) {
        let fileParse = await fs.stat(path.resolve(folderName, file));
        if (fileParse.isDirectory()) await copyDir(`${folderName}\\${file}`, `${folderCopyName}\\${file}`)
        if (fileParse.isFile()) await fs.copyFile(`${folderName}\\${file}`, `${folderCopyName}\\${file}`);
    }
}

copyDir(folder, folderCopy);