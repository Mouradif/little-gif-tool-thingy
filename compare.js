const resemble = require('resemblejs');
const fs = require('fs');
const path = require('path');

process.argv.shift();
process.argv.shift();

const compare = (a, b) => new Promise(r => resemble(a).compareTo(b).onComplete(r));

async function main() {
  const folderName = process.argv.shift();
  if (!folderName) throw new Error('Usage: $ node compare <folder_name>');
  const s = fs.statSync(folderName);
  if (!s.isDirectory()) throw new Error(`'${folderName}' is not a directory`);
  const framesFolder = path.join(folderName, 'frames');
  const files = fs.readdirSync(framesFolder).filter(f => f.endsWith('.png'));
  files.shift();
  files.shift();
  const reference = fs.readFileSync(path.join(framesFolder, files.shift()));
  const frames = [];
  let wentDown = false;
  for (let i = 0; i < files.length; i++) {
    const check = fs.readFileSync(path.join(framesFolder, files[i]));
    const diff = (await compare(reference, check)).rawMisMatchPercentage;
    console.log(files[i].padEnd(20, ' '), '|'.repeat(Math.floor(diff)));
    continue;
    frames[i] = diff;
    if (!i) continue;
    if (frames[i] < frames[i - 1]) {
      wentDown = true;
      continue;
    }
    if (!wentDown) continue;
    console.log(i, diff);
    return files.slice(0, i - 2);
  }
}

main().catch(e => console.log(e.message));
