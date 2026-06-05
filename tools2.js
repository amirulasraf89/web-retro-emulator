import https from 'https';

https.get('https://cdn.emulatorjs.org/latest/data/emulator.js', (res) => {
    console.log("Status: " + res.statusCode);
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
