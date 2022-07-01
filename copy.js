const fs = require('fs');
const path = require('path');

process.argv.shift();
process.argv.shift();

async function main() {
  const folder = process.argv.shift();
  const start = 3;
  const end = parseInt(process.argv.shift());
  if (!end || !folder) throw new Error('Usage: $ node copy <folder> <firstFrameIndex> <lastFrameIndex>');
  const frames = fs.readdirSync(path.join(folder, 'frames')).filter(f => f.endsWith('.png'));
  for (let i = start; i <= end; i++) {
    const fileName = `${String(i).padStart(4, '0')}.png`;
    fs.copyFileSync(
      path.join(folder, 'frames', fileName),
      path.join(folder, 'loop', fileName)
    );
    console.log('copied', fileName);
  }
}

main().catch(e => console.log(e.message));
