const fs = require('fs');
const path = require('path');
const { readdir, rm, mkdir, stat, copyFile, readFile } = require('fs/promises');
const stylesSrc = path.join(__dirname, 'styles');
const projectStylesSrc = path.join(__dirname, 'project-dist', 'style.css');
const assetsSrc = path.join(__dirname, 'assets');
const projectAssetsSrc = path.join(__dirname, 'project-dist', 'assets');

const copyAssets = async (folderName, folderCopyName) => {
    await rm(folderCopyName, { recursive: true, force: true });
    await mkdir(folderCopyName, { recursive: true });
    const files = await readdir(folderName);
    for (const file of files) {
        let fileParse = await stat(path.resolve(folderName, file));
        if (fileParse.isDirectory()) await copyAssets(`${folderName}\\${file}`, `${folderCopyName}\\${file}`)
        if (fileParse.isFile()) await copyFile(`${folderName}\\${file}`, `${folderCopyName}\\${file}`);
    }
}

const copyStyle = (stream, writeableStream) => {
    stream.on('data', (data) => {
        writeableStream.write(data);
    });
}

const mergeStyles = async () => {
    const files = await readdir(stylesSrc);
    let writeableStream = fs.createWriteStream(projectStylesSrc);

    for (const file of files) {
        let fileExt = path.extname(file);
        
        if (fileExt === '.css') {
            let newPath = path.join(__dirname, 'styles', file);
            let stream = fs.createReadStream(newPath,'utf8');
            copyStyle(stream, writeableStream);
        }
    }
}

const createPage = (data) => {
    const indexPageSrc = path.join(__dirname, 'project-dist', 'index.html');
    let writeableStream = fs.createWriteStream(indexPageSrc);
    writeableStream.write(data);
}

const copyHTML = async () => {
    const templatePageSrc = path.join(__dirname, 'template.html');
    let templatePageStream = fs.createReadStream(templatePageSrc,'utf8');
    let templateContent = '';
    const componentsSrc = path.join(__dirname, 'components');
    const files = await readdir(componentsSrc);

    templatePageStream.on('data', async (data) => {
        templateContent = data;
        for (const file of files) {
            let content = '';
            let fileExt = path.extname(file);
            let fileName = path.basename(file, fileExt);
            let newPath = path.join(componentsSrc, file);
            if (fileExt === '.html') {
                content = await readFile(newPath,'utf8');
                templateContent = templateContent.replace(`{{${fileName}}}`,content)
                
            }
        }
        createPage(templateContent);
    })
}

const buildProject = async () => {
    await copyAssets(assetsSrc, projectAssetsSrc);
    await mergeStyles();
    await copyHTML();
}

buildProject();