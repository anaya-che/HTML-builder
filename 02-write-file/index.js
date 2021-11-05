const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const file = path.resolve(__dirname, 'text.txt');
let writeableStream = fs.createWriteStream(file);

rl.question('Please, enter your text: ', (answer) => {
    if (answer.includes('exit')) rl.close();
    else {
        writeableStream.write(`${answer}\n`);
    }
});

rl.on('line', (answer) =>{
    if (answer.includes('exit')) rl.close();
    else {
        writeableStream.write(`${answer}\n`);
    }
})

process.on('beforeExit', () => {
    console.log('May the force be with you!');
});