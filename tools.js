import https from 'https';
import fs from 'fs';

https.get('https://cdn.emulatorjs.org/latest/data/emulator.js', (res) => {
  let file = fs.createWriteStream('emulator.js');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    fs.readFile('emulator.js', 'utf8', (err, data) => {
      let matches = data.match(/.{0,50}loadSave.{0,100}/g);
      if (matches) {
          console.log(matches.slice(0, 10).join('\n---\n'));
      }
    });
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
